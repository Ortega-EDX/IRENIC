/**
 * Serverless Proxy Endpoint: POST /api/chat
 *
 * Compatible con funciones Serverless y con el middleware local de Vite.
 * - Mantiene la API Key y el prompt del sistema 100% en el servidor (nunca se exponen al navegador).
 * - Recibe únicamente { historial, mensaje, adjunto } desde el frontend.
 * - Inyecta MANUAL_TEXT en system_instruction con temperature: 0.1.
 * - Devuelve únicamente { reply } en formato JSON al cliente.
 */
import dns from 'node:dns';
import { MANUAL_TEXT } from '../src/data/manualData.js';

if (typeof dns?.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

/**
 * Modelos activos de alta disponibilidad (500 peticiones diarias RPD cada uno):
 * 1. Principal por defecto: 'gemini-3.5-flash-lite'
 * 2. Respaldo automático (Fallback): 'gemini-3.1-flash-lite'
 */
const MODELOS_CANDIDATOS = [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
];

const TEMPERATURE = 0.1;
const MAX_OUTPUT_TOKENS = 8192;
const TIMEOUT_MS = 55000;
const MAX_TURNOS_HISTORIAL = 12;

/**
 * Registro en memoria de modelos temporalmente agotados (429 / RPD) -> timestamp de expiración.
 * Evita que las siguientes consultas del usuario pierdan tiempo reintentando un modelo
 * que ya alcanzó su límite diario o por minuto, manteniendo la respuesta instantánea.
 */
const modelosEnEnfriamiento = new Map();
const COOLDOWN_RPM_MS = 60 * 1000; // 1 minuto para límites por minuto (RPM)
const COOLDOWN_RPD_MS = 15 * 60 * 1000; // 15 minutos para límites diarios (RPD)

function obtenerOrdenModelos() {
  const ahora = Date.now();
  const disponibles = [];
  const enEnfriamiento = [];

  for (const modelo of MODELOS_CANDIDATOS) {
    const expira = modelosEnEnfriamiento.get(modelo) || 0;
    if (expira > ahora) {
      enEnfriamiento.push(modelo);
    } else {
      if (expira) modelosEnEnfriamiento.delete(modelo);
      disponibles.push(modelo);
    }
  }

  // Prioriza siempre el orden estricto 1 -> 2 -> 3 entre los disponibles;
  // si todos estuvieran en enfriamiento, igual los intenta en orden de cascada.
  return [...disponibles, ...enEnfriamiento];
}

function registrarEnfriamientoModelo(modelo, status, detalle = '') {
  const texto = String(detalle || '').toLowerCase();
  const esLimiteDiario =
    texto.includes('perday') ||
    texto.includes('per_day') ||
    texto.includes('rpd') ||
    texto.includes('daily') ||
    texto.includes('day');

  const duracion =
    status === 404 || esLimiteDiario ? COOLDOWN_RPD_MS : COOLDOWN_RPM_MS;
  modelosEnEnfriamiento.set(modelo, Date.now() + duracion);
}

function construirInstruccionSistema() {
  const base = (MANUAL_TEXT || '').trim();

  return `Eres IRENIC, el Asistente y Motor Normativo del Manual de Convivencia del Colegio San Alberto Magno (COLSAM) de Barranquilla. Tu función es orientar directamente al estudiante (hablándole de "tú", de forma clara, cercana, respetuosa y directa) pero basándote ESTRICTA Y EXCLUSIVAMENTE en el Manual de Convivencia oficial.

TU ÚNICA FUENTE DE VERDAD Y CONOCIMIENTO ES EL SIGUIENTE TEXTO OFICIAL DEL MANUAL DE CONVIVENCIA DEL COLEGIO SAN ALBERTO MAGNO:
---
${base}
---

REGLAS DE ESTILO Y EXTENSIÓN (MUY IMPORTANTES):
1. SÉ BREVE Y DIRECTO POR DEFECTO: A menos que el usuario te pida explícitamente "detállalo", "explícame a fondo" o "dame todo el protocolo", responde de forma corta, ágil y al grano (máximo 1 párrafo corto de respuesta directa + 3 o 4 viñetas puntuales).
2. HABLA COMO UN ASISTENTE DIRECTO AL ESTUDIANTE: Dirígete a la persona en segunda persona ("Si llegas tarde...", "No puedes hacer eso porque...", "En tu caso aplica..."), evitando rodeos burocráticos o repetir información en varias secciones.
3. ESTRUCTURA CORTA Y LIMPIA (POR DEFECTO):
   - Empieza con una respuesta directa de 1 a 2 oraciones contestando la duda.
   - Luego, usa solo estas viñetas cortas (1 línea por viñeta):
     - **Tipificación:** Indica si es Situación Tipo I, Tipo II, Tipo III o norma general.
     - **Artículos del Manual:** Cita los artículos y numerales exactos (ej. Art. 16.52, Art. 30.1 y Parágrafo 2).
     - **Qué pasa / Debido proceso:** Resume en 1 o 2 líneas la medida, protocolo o conducto regular aplicable.
   - Si el usuario pide "resúmelo", sintetiza aún más en 2 o 3 líneas sin encabezados largos.
   - Solo usa secciones extensas con subtítulos ("## ...") cuando el usuario pida un análisis detallado o completo.

REGLAS NORMATIVAS ESTRICTAS (NO NEGOCIABLES):
1. Basa tus respuestas EXCLUSAMENTE en el texto oficial del Manual de Convivencia anterior y las leyes allí citadas (Ley 1620 de 2013, Decreto 1965 de 2013 / Decreto 1075 de 2015, Ley 1098 de 2006, Decreto 1290 de 2009).
2. NUNCA inventes artículos, numerales, plazos ni sanciones. Si algo no aparece en el Manual, dilo claramente: "Eso no está estipulado en el Manual de Convivencia; debes consultarlo con Coordinación de Convivencia."
3. Responde SOLO temas de convivencia escolar, derechos, deberes, faltas, debido proceso, uniformes, horarios, asistencia, excusas, evaluación/promoción, gobierno escolar y servicios de COLSAM. Si preguntan algo ajeno al colegio, responde en una línea: "Solo puedo orientarte sobre temas del Manual de Convivencia del Colegio San Alberto Magno."
4. Ante situaciones graves que atenten contra la vida o integridad (amenazas, agresión física, bullying/ciberbullying, violencia sexual, armas, drogas, autolesión), responde de forma firme y directa que está estrictamente prohibido, que constituye una **Situación Tipo II o Tipo III (y presunto delito bajo la Ley 1098 de 2006 / Código Penal)**, cita el artículo exacto (ej. Art. 31 o Art. 32) e indica la activación inmediata de la Ruta de Atención Integral (Coordinación, Psicorientación, Rectoría, padres de familia y Policía de Infancia y Adolescencia / ICBF), además de las sanciones (expulsión / cancelación de matrícula).
5. No uses tablas ni bloques de código; usa solo texto claro, negritas (**texto**) y viñetas (- ).
6. IDENTIDAD DEL MODELO: Eres exclusivamente el modelo de IRENIC del Colegio San Alberto Magno. Nunca menciones proveedores externos; si te preguntan qué modelo eres, responde que eres el modelo normativo de IRENIC.`;
}

function construirContenidos(historial = [], mensaje = '', adjunto = null) {
  const turnos = (Array.isArray(historial) ? historial : [])
    .filter((m) => m && !m.esBienvenida && !m.esError && typeof m.texto === 'string' && m.texto.trim())
    .slice(-MAX_TURNOS_HISTORIAL)
    .map((m) => ({
      role: m.rol === 'usuario' ? 'user' : 'model',
      parts: [{ text: m.texto }],
    }));

  while (turnos.length && turnos[0].role !== 'user') turnos.shift();

  const partesActual = [{ text: String(mensaje || '').trim() }];
  if (adjunto && adjunto.mimeType && adjunto.base64) {
    partesActual.push({
      inlineData: {
        mimeType: String(adjunto.mimeType),
        data: String(adjunto.base64),
      },
    });
  }

  const todos = [...turnos, { role: 'user', parts: partesActual }];

  return todos.reduce((acc, turno) => {
    const ultimo = acc[acc.length - 1];
    if (ultimo && ultimo.role === turno.role) {
      ultimo.parts = [...ultimo.parts, ...turno.parts];
    } else {
      acc.push({ role: turno.role, parts: [...turno.parts] });
    }
    return acc;
  }, []);
}

function traducirErrorHttp(status, detalle) {
  const texto = String(detalle || '').toLowerCase();
  if (status === 429 || texto.includes('quota') || texto.includes('rate')) {
    return {
      status: 429,
      code: 'QUOTA',
      error: 'Se alcanzó el límite de consultas del modelo de IRENIC. Espera un momento e inténtalo de nuevo.',
    };
  }
  if (status === 400 && (texto.includes('api key') || texto.includes('api_key'))) {
    return {
      status: 401,
      code: 'AUTH',
      error: 'La clave de acceso del modelo de IRENIC en el servidor no es válida. Verifica la configuración del entorno.',
    };
  }
  if (status === 401 || status === 403) {
    return {
      status: 403,
      code: 'AUTH',
      error: 'La clave de acceso fue rechazada o no tiene permisos para consultar el modelo del chatbot.',
    };
  }
  if (status === 404) {
    return {
      status: 404,
      code: 'MODEL_NOT_FOUND',
      error: 'El modelo del chatbot no está disponible en este momento.',
    };
  }
  if (status >= 500) {
    return {
      status: 503,
      code: 'UNAVAILABLE',
      error: 'El modelo de IRENIC experimenta alta demanda en este momento. Inténtalo nuevamente en unos segundos.',
    };
  }
  return {
    status: 502,
    code: 'API',
    error: 'No fue posible procesar la consulta con el modelo del chatbot en este momento. Inténtalo de nuevo.',
  };
}

async function leerBodyJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body.trim()) return JSON.parse(req.body);

  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      // Límite de 12 MB para permitir adjuntos en base64
      if (raw.length > 12 * 1024 * 1024) {
        reject(new Error('PAYLOAD_TOO_LARGE'));
      }
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function enviarJson(res, statusCode, payload) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(payload);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return enviarJson(res, 405, {
      code: 'METHOD_NOT_ALLOWED',
      error: 'Método no permitido. Usa POST /api/chat.',
    });
  }

  const apiKey = (process.env.GEMINI_API_KEY || process.env.IRENIC_API_KEY || '').trim();
  if (!apiKey) {
    return enviarJson(res, 500, {
      code: 'NO_KEY',
      error:
        'El servidor no tiene configurada la clave de acceso del modelo de IRENIC. Agrégala en el archivo .env (local) o en las variables de entorno del servidor.',
    });
  }

  let body;
  try {
    body = await leerBodyJson(req);
  } catch (e) {
    return enviarJson(res, 400, {
      code: 'BAD_REQUEST',
      error: 'El cuerpo de la solicitud no es un JSON válido o supera el tamaño permitido.',
    });
  }

  const { historial = [], mensaje = '', adjunto = null } = body || {};
  if (!String(mensaje || '').trim() && !adjunto) {
    return enviarJson(res, 400, {
      code: 'EMPTY_QUERY',
      error: 'Debes enviar un mensaje o documento para analizar.',
    });
  }

  const payloadModelo = {
    system_instruction: { parts: [{ text: construirInstruccionSistema() }] },
    contents: construirContenidos(historial, mensaje, adjunto),
    generationConfig: {
      temperature: TEMPERATURE,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    },
  };

  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIMEOUT_MS);

  try {
    const ordenModelos = obtenerOrdenModelos();

    let ultimoError = null;
    let huboErrorRed = false;

    for (const modelo of ordenModelos) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`;
      let respuesta;
      try {
        respuesta = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify(payloadModelo),
          signal: controlador.signal,
        });
      } catch (errRed) {
        if (errRed?.name === 'AbortError') {
          return enviarJson(res, 504, {
            code: 'TIMEOUT',
            error: 'La consulta al modelo de IRENIC tardó demasiado en responder. Inténtalo de nuevo.',
          });
        }
        huboErrorRed = true;
        continue;
      }

      if (!respuesta.ok) {
        let detalle = '';
        let statusTexto = '';
        try {
          const errJson = await respuesta.json();
          detalle = errJson?.error?.message || '';
          statusTexto = errJson?.error?.status || '';
        } catch (e) {
          /* respuesta sin JSON */
        }

        const detalleLower = `${detalle} ${statusTexto}`.toLowerCase();
        const esErrorCuotaORespaldo =
          respuesta.status === 429 ||
          respuesta.status === 503 ||
          respuesta.status === 404 ||
          respuesta.status >= 500 ||
          detalleLower.includes('resource_exhausted') ||
          detalleLower.includes('quota') ||
          detalleLower.includes('rate') ||
          detalleLower.includes('rpd') ||
          detalleLower.includes('per_day') ||
          detalleLower.includes('perday');

        ultimoError = traducirErrorHttp(respuesta.status, detalle);

        if (esErrorCuotaORespaldo) {
          registrarEnfriamientoModelo(modelo, respuesta.status, detalleLower);
          continue; // pasa de inmediato al siguiente modelo de la cascada
        }

        return enviarJson(res, ultimoError.status, {
          code: ultimoError.code,
          error: ultimoError.error,
        });
      }

      const datos = await respuesta.json();

      if (datos?.promptFeedback?.blockReason) {
        return enviarJson(res, 422, {
          code: 'BLOCKED',
          error:
            'La consulta no pudo ser analizada por las políticas de seguridad del modelo de IRENIC. Reformula la situación de manera objetiva.',
        });
      }

      const candidato = datos?.candidates?.[0];
      const textoRespuesta = (candidato?.content?.parts || [])
        .map((p) => p.text || '')
        .join('')
        .trim();

      if (!textoRespuesta) {
        if (candidato?.finishReason === 'SAFETY') {
          return enviarJson(res, 422, {
            code: 'BLOCKED',
            error:
              'La respuesta fue bloqueada por las políticas de seguridad del modelo de IRENIC. Reformula la situación de manera objetiva.',
          });
        }
        ultimoError = {
          status: 502,
          code: 'EMPTY',
          error: 'El modelo de IRENIC no devolvió un análisis para esta consulta. Intenta describir la situación con más detalle.',
        };
        continue;
      }

      modelosEnEnfriamiento.delete(modelo);
      return enviarJson(res, 200, { reply: textoRespuesta });
    }

    if (huboErrorRed && !ultimoError) {
      return enviarJson(res, 502, {
        code: 'NETWORK',
        error: 'No se pudo conectar con el modelo de IRENIC. Verifica la conexión a internet.',
      });
    }

    return enviarJson(
      res,
      ultimoError?.status || 502,
      ultimoError
        ? { code: ultimoError.code, error: ultimoError.error }
        : { code: 'API', error: 'No se pudo conectar con el modelo del chatbot en este momento.' }
    );
  } finally {
    clearTimeout(temporizador);
  }
}
