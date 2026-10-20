/**
 * Cliente Frontend del Motor Normativo de IRENIC
 *
 * Por seguridad, el frontend NUNCA maneja ni conoce la clave de acceso del modelo
 * ni se conecta directo a servicios externos. Todas las consultas se envían al
 * endpoint intermedio del servidor (`POST /api/chat`), donde `api/chat.js`
 * adjunta las instrucciones del sistema con `MANUAL_TEXT` y devuelve `{ reply }`.
 */

const TIMEOUT_MS = 60000;

/** Error controlado con mensaje seguro para mostrar en la burbuja del bot */
export class IrenicModelError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'IrenicModelError';
    this.code = code;
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
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIMEOUT_MS);
  const cancelarExterno = () => controlador.abort();
  signal?.addEventListener('abort', cancelarExterno);

  try {
    let respuesta;
    try {
      respuesta = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historial, mensaje, adjunto }),
        signal: controlador.signal,
      });
    } catch (e) {
      if (e?.name === 'AbortError') throw e;
      throw new IrenicModelError(
        'NETWORK',
        'No se pudo conectar con el modelo de IRENIC. Verifica tu conexión a internet o que el servidor esté activo.'
      );
    }

    let datos = null;
    try {
      datos = await respuesta.json();
    } catch (e) {
      throw new IrenicModelError(
        'SERVER',
        'No se pudo conectar con el modelo del chatbot (/api/chat). Verifica que el servidor esté activo.'
      );
    }

    if (!respuesta.ok) {
      throw new IrenicModelError(
        datos?.code || 'API',
        datos?.error || 'No se pudo conectar con el modelo de IRENIC en este momento. Inténtalo de nuevo.'
      );
    }

    const texto = String(datos?.reply || '').trim();
    if (!texto) {
      throw new IrenicModelError('EMPTY', 'El modelo de IRENIC no devolvió un análisis para esta consulta. Intenta describir la situación con más detalle.');
    }

    return texto;
  } catch (e) {
    if (e?.name === 'AbortError') {
      if (signal?.aborted) throw e;
      throw new IrenicModelError('TIMEOUT', 'La consulta al modelo de IRENIC tardó demasiado en responder. Inténtalo de nuevo.');
    }
    if (e instanceof IrenicModelError) throw e;
    throw new IrenicModelError('API', 'No se pudo conectar con el modelo del chatbot en este momento.');
  } finally {
    clearTimeout(temporizador);
    signal?.removeEventListener('abort', cancelarExterno);
  }
}
