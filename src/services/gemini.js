/**
 * Cliente Frontend del Motor Normativo de IRENIC
 *
 * - Mantiene la clave de acceso 100% en el servidor (`POST /api/chat`).
 * - Genera y persiste un `clientId` único en `localStorage` para el control Anti-Spam
 *   híbrido (`${ip}_${clientId}`) pensado para redes escolares compartidas (NAT).
 * - Sincroniza las sanciones temporales (`blockedUntil` y `strikes`) en `localStorage`
 *   para resistir reinicios en frío (cold starts) de funciones Serverless.
 * - Ejecuta la Capa 1 contextual (Filtro local por Expresiones Regulares en Input y Output)
 *   para cortar de inmediato insultos directos o intentos de Prompt Injection sin
 *   consumir cuota de la API, permitiendo consultas legítimas del Manual.
 */

const TIMEOUT_MS = 60000;

const STORAGE_CLIENT_ID = 'irenic_client_id';
const STORAGE_BLOCKED_UNTIL = 'irenic_blocked_until_v2';
const STORAGE_SPAM_STRIKES = 'irenic_spam_strikes_v2';
const STORAGE_MSG_TIMESTAMPS = 'irenic_msg_timestamps_v2';

const VENTANA_SPAM_MS = 15 * 1000; // 15 segundos para detectar ráfagas de 5 mensajes seguidos
const MAX_MENSAJES_VENTANA = 5; // 5 o más mensajes dentro de la ventana
const SANCION_5_MIN_MS = 5 * 60 * 1000; // 5 minutos
const SANCION_24_HORAS_MS = 24 * 60 * 60 * 1000; // 24 horas
const MAX_STRIKES_PARA_24H = 3;

/**
 * Mensaje estático predeterminado para rechazos por moderación o guardrails.
 */
export const MENSAJE_RECHAZO_NORMATIVO =
  'El mensaje no ha podido ser procesado ni enviado porque infringe las normas de uso, convivencia y los Términos y Condiciones de IRENIC.';

/**
 * Expresiones Regulares de Capa 1 Contextual (Input y Output):
 * Insultos, groserías fuertes y patrones de Prompt Injection / Jailbreak.
 */
const REGEX_GROSERIAS_FUERTES = new RegExp(
  '\\b(' +
    [
      'gonorre[a@o0]s?',
      'hijueput[a@o0]s?',
      'hpta?s?',
      'triplehijueput[a@o0]s?',
      'malparid[o0a@]s?',
      'maricon(es)?',
      'pirob[o0a@]s?',
      'carechimb[a@]s?',
      'caremond[a@]s?',
      'careverg[a@]s?',
      'cacorr[o0a@]s?',
      'huevon(es|a|as)?',
      'guevon(es|a|as)?',
      'mierd[a@]s?',
      'put[a@o0]s?',
      'putear',
      'pendej[o0a@]s?',
      'imbecil(es)?',
      'idiot[a@]s?',
      'estupid[o0a@]s?',
      'cabron(es|a|as)?',
      'culer[o0a@]s?',
      'verg[a@]s?',
      'mond[a@]s?',
      'tetranutr[a@]s?',
      'comemierd[a@]s?',
      'mamaguev[o0]s?',
      'mamabich[o0]s?',
      'jodete',
      'pudrete',
      'vete\\s+a\\s+la\\s+mierda',
      'fuck(ing|er)?',
      'bitch(es)?',
      'asshole',
    ].join('|') +
    ')\\b',
  'i'
);

const REGEX_PROMPT_INJECTION = new RegExp(
  '(' +
    [
      'ignora\\s+(todas\\s+)?(tus\\s+|las\\s+)?(instrucciones|reglas)(\\s+anteriores|\\s+previas)?',
      'olvida\\s+(todas\\s+)?(tus\\s+|las\\s+)?(instrucciones|reglas)(\\s+anteriores|\\s+previas)?',
      'descarta\\s+(todas\\s+)?(tus\\s+|las\\s+)?(instrucciones|reglas)',
      'ignore\\s+(all\\s+)?(previous|prior|above)\\s+(instructions|rules|prompts)',
      'forget\\s+(all\\s+)?(previous|prior|above)\\s+(instructions|rules|prompts)',
      'system\\s*prompt',
      'developer\\s*mode',
      'modo\\s+desarrollador',
      'modo\\s+dan\\b',
      '\\bdan\\s+mode\\b',
      '\\bjailbreak\\b',
      'repite\\s+despues\\s+de\\s+mi',
      'repite\\s+exactamente(\\s+lo\\s+siguiente)?',
      'di\\s+la\\s+palabra\\b',
      'dime\\s+la\\s+palabra\\b',
      'escribe\\s+la\\s+palabra\\b',
      'imprime\\s+la\\s+palabra\\b',
      'responde\\s+solo\\s+con\\s+la\\s+palabra',
      'actua\\s+como\\s+si\\s+no\\s+fueras',
      'finge\\s+que\\s+(eres|no\\s+eres)',
      'salte\\s+de\\s+tu\\s+(rol|personaje)',
      'olvida\\s+que\\s+eres\\s+irenic',
      'revela\\s+(tus\\s+|las\\s+)?instrucciones(\\s+internas|\\s+del\\s+sistema)?',
      'muestrame\\s+tu\\s+prompt',
      'bypass\\s+(safety|filter|filters|guardrails)',
    ].join('|') +
    ')',
  'i'
);

const REGEX_CONTEXTO_CONSULTA_ESCOLAR = new RegExp(
  '\\b(' +
    [
      'me\\s+dijo',
      'me\\s+dijeron',
      'le\\s+dijo',
      'me\\s+insulto',
      'me\\s+trato\\s+mal',
      'companero',
      'estudiante',
      'profesor',
      'docente',
      'colegio',
      'salon',
      'clase',
      'manual',
      'convivencia',
      'falta',
      'tipo\\s+(1|2|3|i|ii|iii)',
      'sancion',
      'articulo',
      'debido\\s+proceso',
      'protocolo',
      'que\\s+pasa\\s+si',
      'que\\s+hago\\s+si',
      'es\\s+legal',
    ].join('|') +
    ')\\b',
  'i'
);

function normalizarParaFiltro(texto = '') {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Evalúa si un texto contiene groserías directas o intentos de Prompt Injection (Capa 1),
 * respetando el contexto cuando un estudiante narra un caso de convivencia escolar.
 */
export function contieneInfraccionLocal(texto = '', esOutput = false) {
  const normalizado = normalizarParaFiltro(texto);
  if (!normalizado.trim()) return false;

  if (REGEX_PROMPT_INJECTION.test(normalizado)) {
    return true;
  }

  if (REGEX_GROSERIAS_FUERTES.test(normalizado)) {
    if (esOutput) return true;
    if (/\b(eres\s+un|dime|llamame|chatbot|irenic|bot)\b/i.test(normalizado)) {
      return true;
    }
    if (REGEX_CONTEXTO_CONSULTA_ESCOLAR.test(normalizado)) {
      return false;
    }
    return true;
  }

  return false;
}

/**
 * Obtiene o genera un identificador único persistente para el navegador actual.
 */
export function obtenerClientId() {
  try {
    let id = localStorage.getItem(STORAGE_CLIENT_ID);
    if (!id) {
      id =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `cid-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(STORAGE_CLIENT_ID, id);
    }
    return id;
  } catch (_) {
    return 'client-fallback';
  }
}

export function formatearTiempoEspera(ms) {
  const segTotales = Math.max(1, Math.ceil(ms / 1000));
  if (segTotales >= 3600) {
    const horas = Math.ceil(segTotales / 3600);
    return `${horas} ${horas === 1 ? 'hora' : 'horas'}`;
  }
  if (segTotales >= 60) {
    const minutos = Math.ceil(segTotales / 60);
    return `${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
  }
  return `${segTotales} ${segTotales === 1 ? 'segundo' : 'segundos'}`;
}

/**
 * Consulta si existe un bloqueo temporal activo en `localStorage`.
 */
export function obtenerEstadoBloqueoLocal() {
  try {
    const ahora = Date.now();
    const blockedUntil = Number(localStorage.getItem(STORAGE_BLOCKED_UNTIL) || 0);
    const strikes = Number(localStorage.getItem(STORAGE_SPAM_STRIKES) || 0);
    if (blockedUntil > ahora) {
      const tiempoTexto = formatearTiempoEspera(blockedUntil - ahora);
      return {
        bloqueado: true,
        blockedUntil,
        strikes,
        mensaje:
          strikes >= MAX_STRIKES_PARA_24H
            ? `Acceso bloqueado por 24 horas debido a reincidencia de spam. Tiempo restante: ${tiempoTexto}.`
            : `Has enviado demasiados mensajes seguidos (spam detectado). Espera ${tiempoTexto} para volver a consultar.`,
      };
    }
    return { bloqueado: false, blockedUntil: 0, strikes };
  } catch (_) {
    return { bloqueado: false, blockedUntil: 0, strikes: 0 };
  }
}

/**
 * Guarda en `localStorage` la marca de tiempo de bloqueo (`blockedUntil`) y el conteo de sanciones.
 */
export function guardarBloqueoLocal(blockedUntil, strikes) {
  try {
    if (blockedUntil && blockedUntil > Date.now()) {
      localStorage.setItem(STORAGE_BLOCKED_UNTIL, String(blockedUntil));
    }
    if (typeof strikes === 'number' && strikes >= 0) {
      localStorage.setItem(STORAGE_SPAM_STRIKES, String(strikes));
    }
  } catch (_) {
    /* localStorage no disponible */
  }
}

/**
 * Registra el envío de un mensaje en el cliente y verifica si supera 5 mensajes en < 15 segundos.
 */
function verificarYRegistrarEnvioLocal() {
  const estadoActual = obtenerEstadoBloqueoLocal();
  if (estadoActual.bloqueado) return estadoActual;

  try {
    const ahora = Date.now();
    const guardados = JSON.parse(localStorage.getItem(STORAGE_MSG_TIMESTAMPS) || '[]');
    const recientes = (Array.isArray(guardados) ? guardados : []).filter(
      (t) => typeof t === 'number' && ahora - t < VENTANA_SPAM_MS
    );
    recientes.push(ahora);

    if (recientes.length >= MAX_MENSAJES_VENTANA) {
      const nuevosStrikes = (estadoActual.strikes || 0) + 1;
      const es24h = nuevosStrikes >= MAX_STRIKES_PARA_24H;
      const duracion = es24h ? SANCION_24_HORAS_MS : SANCION_5_MIN_MS;
      const blockedUntil = ahora + duracion;

      localStorage.setItem(STORAGE_MSG_TIMESTAMPS, '[]');
      guardarBloqueoLocal(blockedUntil, nuevosStrikes);

      const tiempoTexto = formatearTiempoEspera(duracion);
      return {
        bloqueado: true,
        blockedUntil,
        strikes: nuevosStrikes,
        mensaje: es24h
          ? `Se ha detectado reincidencia de spam (3 sanciones acumuladas). Tu acceso al modelo de chatbot ha sido bloqueado por 24 horas (${tiempoTexto}).`
          : `Se detectó envío masivo de mensajes (5 o más mensajes seguidos). Se ha aplicado una sanción temporal de 5 minutos (Sanción ${nuevosStrikes} de ${MAX_STRIKES_PARA_24H}).`,
      };
    }

    localStorage.setItem(STORAGE_MSG_TIMESTAMPS, JSON.stringify(recientes));
    return { bloqueado: false, blockedUntil: 0, strikes: estadoActual.strikes };
  } catch (_) {
    return { bloqueado: false, blockedUntil: 0, strikes: 0 };
  }
}

/** Error controlado con mensaje seguro para mostrar en la burbuja del bot */
export class IrenicModelError extends Error {
  constructor(code, message, meta = {}) {
    super(message);
    this.name = 'IrenicModelError';
    this.code = code;
    this.blockedUntil = meta.blockedUntil || 0;
    this.strikes = meta.strikes || 0;
  }
}

export { IrenicModelError as GeminiError };

/**
 * Envía la consulta del estudiante al proxy serverless `/api/chat`.
 * @param {Object}   params
 * @param {Array}    params.historial  Mensajes previos [{rol:'usuario'|'bot', texto}]
 * @param {string}   params.mensaje    Consulta actual del estudiante
 * @param {Object=}  params.adjunto    {mimeType, base64} imagen o PDF opcional
 * @param {AbortSignal=} params.signal Para cancelar la solicitud
 * @returns {Promise<string>} Respuesta normativa en Markdown
 */
export async function consultarManual({ historial = [], mensaje, adjunto, signal }) {
  // 1. Verificar bloqueo anti-spam persistente en localStorage (cuenta todo intento de envío)
  const controlSpamLocal = verificarYRegistrarEnvioLocal();
  if (controlSpamLocal.bloqueado) {
    throw new IrenicModelError('RATE_LIMITED', controlSpamLocal.mensaje, {
      blockedUntil: controlSpamLocal.blockedUntil,
      strikes: controlSpamLocal.strikes,
    });
  }

  // 2. CAPA 1 (INPUT): Evaluar filtro local contextual antes de llamar a la API
  if (contieneInfraccionLocal(mensaje, false)) {
    return MENSAJE_RECHAZO_NORMATIVO;
  }

  const clientId = obtenerClientId();
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIMEOUT_MS);
  const cancelarExterno = () => controlador.abort();
  signal?.addEventListener('abort', cancelarExterno);

  try {
    let respuesta;
    try {
      respuesta = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': clientId,
        },
        body: JSON.stringify({ historial, mensaje, adjunto, clientId }),
        signal: controlador.signal,
      });
    } catch (e) {
      if (e?.name === 'AbortError') throw e;
      throw new IrenicModelError(
        'NETWORK',
        'No se pudo conectar con el modelo de chatbot de IRENIC. Verifica tu conexión a internet o que el servidor esté activo.'
      );
    }

    let datos = null;
    try {
      datos = await respuesta.json();
    } catch (e) {
      throw new IrenicModelError(
        'SERVER',
        'No se pudo conectar con el modelo de chatbot (/api/chat). Verifica que el servidor esté activo.'
      );
    }

    if (!respuesta.ok) {
      if (respuesta.status === 429 && datos?.blockedUntil) {
        guardarBloqueoLocal(Number(datos.blockedUntil), Number(datos.strikes || 1));
      }
      throw new IrenicModelError(
        datos?.code || 'API',
        datos?.error || 'No se pudo conectar con el modelo de chatbot de IRENIC en este momento. Inténtalo de nuevo.',
        {
          blockedUntil: Number(datos?.blockedUntil || 0),
          strikes: Number(datos?.strikes || 0),
        }
      );
    }

    const texto = String(datos?.reply || '').trim();
    if (!texto) {
      throw new IrenicModelError(
        'EMPTY',
        'El modelo de chatbot de IRENIC no devolvió un análisis para esta consulta. Intenta describir la situación con más detalle.'
      );
    }

    // 3. CAPA 1 (OUTPUT): Verificar que la respuesta recibida tampoco infrinja el filtro
    if (texto !== MENSAJE_RECHAZO_NORMATIVO && contieneInfraccionLocal(texto, true)) {
      return MENSAJE_RECHAZO_NORMATIVO;
    }

    return texto;
  } catch (e) {
    if (e?.name === 'AbortError') {
      if (signal?.aborted) throw e;
      throw new IrenicModelError(
        'TIMEOUT',
        'La consulta al modelo de chatbot de IRENIC tardó demasiado en responder. Inténtalo de nuevo.'
      );
    }
    if (e instanceof IrenicModelError) throw e;
    throw new IrenicModelError('API', 'No se pudo conectar con el modelo de chatbot en este momento.');
  } finally {
    clearTimeout(temporizador);
    signal?.removeEventListener('abort', cancelarExterno);
  }
}
