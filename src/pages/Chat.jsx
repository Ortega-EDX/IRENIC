import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';
import Toast from '../components/Toast.jsx';
import FormattedMessage from '../components/FormattedMessage.jsx';
import {
  consultarManual,
  IrenicModelError,
  MENSAJE_RECHAZO_NORMATIVO,
  obtenerClientId,
  obtenerEstadoBloqueoLocal,
  formatearTiempoEspera,
} from '../services/gemini.js';
import '../styles/chat-messages.css';

const ASSETS = `${import.meta.env.BASE_URL}assets/`;

/** Enfriamiento corto anti-doble-clic (800ms) que permite que el detector Anti-Spam actúe si envían 5 mensajes seguidos */
const COOLDOWN_ENVIO_MS = 800;

const MENSAJE_BIENVENIDA = {
  id: 'bienvenida',
  rol: 'bot',
  esBienvenida: true,
  texto: [
    '## Motor Normativo del Manual de Convivencia',
    'Describe tu situación por escrito o mediante el micrófono de voz y la analizaré bajo el Manual de Convivencia del Colegio San Alberto Magno.',
    'Para cada consulta identificaré:',
    '- **Hechos** relevantes del caso.',
    '- **Tipificación** de la falta (Tipo I, II o III).',
    '- **Artículos** del Manual involucrados.',
    '- **Debido proceso** aplicable.',
    'Ejemplos: "¿Qué pasa si llego tarde?" o "Me decomisaron el teléfono, ¿es legal?".',
  ].join('\n'),
};

/** Sugerencias rápidas para estudiantes */
const CHIPS = [
  {
    label: 'Faltas Tipo I, II y III',
    prompt: '¿Cuáles son las diferencias entre faltas Tipo 1, Tipo 2 y Tipo 3 según el Manual de Convivencia?',
    icon: (
      <>
        <path d="M12 3v18"></path>
        <path d="M6 8l6-3 6 3"></path>
        <path d="M6 8l-3 7a3 3 0 0 0 6 0L6 8z"></path>
        <path d="M18 8l-3 7a3 3 0 0 0 6 0L18 8z"></path>
      </>
    ),
  },
  {
    label: 'Normas del Uniforme',
    prompt: '¿Cuáles son las normas sobre el uso correcto del uniforme escolar institucional?',
    icon: (
      <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
    ),
  },
  {
    label: 'Derechos y Debido Proceso',
    prompt: '¿Cuáles son mis derechos fundamentales y el debido proceso de defensa como estudiante?',
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>,
  },
  {
    label: 'Ruta contra el Acoso',
    prompt: '¿Cuál es la ruta de atención integral ante un caso de agresión o acoso escolar (bullying)?',
    icon: (
      <>
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M4.93 4.93l4.24 4.24"></path>
        <path d="M14.83 14.83l4.24 4.24"></path>
        <path d="M14.83 9.17l4.24-4.24"></path>
        <path d="M4.93 19.07l4.24-4.24"></path>
      </>
    ),
  },
  {
    label: 'Excusas e Inasistencias',
    prompt: '¿Cómo es el protocolo para justificar una inasistencia o excusa médica?',
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
      </>
    ),
  },
  {
    label: 'Celulares en el Aula',
    prompt: '¿Está permitido el uso de celulares y tablets en el salón de clase?',
    icon: (
      <>
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
        <line x1="12" y1="18" x2="12.01" y2="18"></line>
      </>
    ),
  },
];

/** Limpia marcas de Markdown para que la lectura por voz suene natural */
function limpiarTextoParaLectura(markdown = '') {
  return String(markdown)
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^[-*•]\s+/gm, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, '. ')
    .replace(/\.\s*\./g, '.')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Genera un resumen corto de la respuesta del chatbot para mostrar en la vista previa de cita */
function resumirTextoCita(markdown = '', maxLen = 65) {
  const limpio = limpiarTextoParaLectura(markdown);
  if (limpio.length <= maxLen) return limpio;
  return `${limpio.slice(0, maxLen).trim()}...`;
}

/** Icono SVG de Pin (chincheta) para citar una respuesta del chatbot */
function IconoPin({ size = 14, relleno = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={relleno ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="17" x2="12" y2="22"></line>
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
    </svg>
  );
}

/** Divide un texto largo en fragmentos por oraciones para evitar cortes en navegadores móviles/escritorio */
function dividirEnFragmentosDeVoz(textoLimpio, maxLen = 220) {
  const oraciones = textoLimpio.split(/(?<=[.!?])\s+/);
  const fragmentos = [];
  let actual = '';

  for (const oracion of oraciones) {
    if (!oracion) continue;
    if ((actual + ' ' + oracion).trim().length <= maxLen) {
      actual = (actual ? `${actual} ${oracion}` : oracion).trim();
    } else {
      if (actual) fragmentos.push(actual);
      if (oracion.length <= maxLen) {
        actual = oracion.trim();
      } else {
        // Si una oración individual es muy larga, dividir por comas o palabras
        const partes = oracion.split(/,\s+/);
        actual = '';
        for (const parte of partes) {
          if ((actual + ', ' + parte).trim().length <= maxLen) {
            actual = (actual ? `${actual}, ${parte}` : parte).trim();
          } else {
            if (actual) fragmentos.push(actual);
            actual = parte.trim();
          }
        }
      }
    }
  }
  if (actual) fragmentos.push(actual);
  return fragmentos.length > 0 ? fragmentos : [textoLimpio];
}

export default function Chat() {
  usePageMeta({
    title: 'IRENIC | Chat de Convivencia Escolar - Colegio San Alberto Magno (COLSAM)',
    description:
      'Espacio exclusivo para interactuar con Irenic, asistente inteligente del Manual de Convivencia del Colegio San Alberto Magno.',
    bodyClass: 'chat-page-body',
  });

  const [messages, setMessages] = useState([MENSAJE_BIENVENIDA]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensajeCitado, setMensajeCitado] = useState(null);
  const [leyendoId, setLeyendoId] = useState(null);
  const [escuchandoVoz, setEscuchandoVoz] = useState(false);
  const [cooldownHasta, setCooldownHasta] = useState(0);
  const [bloqueadoHasta, setBloqueadoHasta] = useState(() => obtenerEstadoBloqueoLocal().blockedUntil || 0);
  const [ahoraTick, setAhoraTick] = useState(() => Date.now());
  const [toast, setToast] = useState({ message: '', show: false });

  const toastTimer = useRef(null);
  const abortRef = useRef(null);
  const finRef = useRef(null);
  const inputRef = useRef(null);
  const lecturaTokenRef = useRef(0);
  const reconocimientoRef = useRef(null);
  const textoBaseVozRef = useRef('');
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  /** Notificación Toast en verde institucional */
  const showToastGreen = useCallback((message) => {
    setToast({ message, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3500);
  }, []);

  // Asegura la inicialización del clientId persistente en localStorage al cargar
  useEffect(() => {
    obtenerClientId();
    const estadoInicial = obtenerEstadoBloqueoLocal();
    if (estadoInicial.bloqueado) {
      setBloqueadoHasta(estadoInicial.blockedUntil);
    }
  }, []);

  // Reloj reactivo para actualizar la cuenta regresiva de cooldown (3s) o bloqueo por spam
  useEffect(() => {
    const ahora = Date.now();
    if (cooldownHasta <= ahora && bloqueadoHasta <= ahora) return undefined;

    const intervalo = setInterval(() => {
      const actual = Date.now();
      setAhoraTick(actual);
      if (cooldownHasta > 0 && actual >= cooldownHasta) {
        setCooldownHasta(0);
      }
      if (bloqueadoHasta > 0 && actual >= bloqueadoHasta) {
        setBloqueadoHasta(0);
      }
    }, 300);

    return () => clearInterval(intervalo);
  }, [cooldownHasta, bloqueadoHasta]);

  const estaEnCooldown = cooldownHasta > ahoraTick;
  const segundosCooldown = estaEnCooldown ? Math.max(1, Math.ceil((cooldownHasta - ahoraTick) / 1000)) : 0;
  const estaBloqueadoSpam = bloqueadoHasta > ahoraTick;
  const textoTiempoBloqueo = estaBloqueadoSpam ? formatearTiempoEspera(bloqueadoHasta - ahoraTick) : '';

  /** Detiene cualquier lectura en voz alta activa */
  const detenerLectura = useCallback(() => {
    lecturaTokenRef.current += 1;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setLeyendoId(null);
  }, []);

  /** Lee en voz alta la respuesta del chatbot o la detiene si ya está reproduciéndose */
  const alternarLecturaMensaje = useCallback(
    (mensajeObj) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        showToastGreen('Tu navegador no admite lectura en voz alta.');
        return;
      }

      if (leyendoId === mensajeObj.id) {
        detenerLectura();
        return;
      }

      window.speechSynthesis.cancel();
      const tokenActual = lecturaTokenRef.current + 1;
      lecturaTokenRef.current = tokenActual;

      const textoLimpio = limpiarTextoParaLectura(mensajeObj.texto);
      if (!textoLimpio) return;

      const fragmentos = dividirEnFragmentosDeVoz(textoLimpio);
      const voces = window.speechSynthesis.getVoices() || [];
      const vozEspanol =
        voces.find((v) => /es[-_](CO|419|MX|US)/i.test(v.lang) && /natural|google|online/i.test(v.name)) ||
        voces.find((v) => /es[-_](CO|419|MX|US)/i.test(v.lang)) ||
        voces.find((v) => /^es/i.test(v.lang)) ||
        null;

      setLeyendoId(mensajeObj.id);

      const hablarFragmento = (indice) => {
        if (lecturaTokenRef.current !== tokenActual) return;
        if (indice >= fragmentos.length) {
          setLeyendoId(null);
          return;
        }

        const utterance = new SpeechSynthesisUtterance(fragmentos[indice]);
        utterance.lang = vozEspanol?.lang || 'es-CO';
        if (vozEspanol) utterance.voice = vozEspanol;
        utterance.rate = 1.02;
        utterance.pitch = 1.0;

        utterance.onend = () => {
          if (lecturaTokenRef.current === tokenActual) {
            hablarFragmento(indice + 1);
          }
        };

        utterance.onerror = () => {
          if (lecturaTokenRef.current === tokenActual) {
            setLeyendoId(null);
          }
        };

        window.speechSynthesis.speak(utterance);
      };

      hablarFragmento(0);
    },
    [leyendoId, detenerLectura, showToastGreen]
  );

  /** Detiene el reconocimiento de voz del micrófono */
  const detenerDictadoVoz = useCallback(() => {
    if (reconocimientoRef.current) {
      try {
        reconocimientoRef.current.onend = null;
        reconocimientoRef.current.stop();
      } catch (_) {
        // ignorar si ya se detuvo
      }
      reconocimientoRef.current = null;
    }
    setEscuchandoVoz(false);
  }, []);

  /** Activa o desactiva la transcripción de voz a texto con el micrófono */
  const alternarDictadoVoz = useCallback(() => {
    if (escuchandoVoz) {
      detenerDictadoVoz();
      return;
    }

    const SpeechRecognitionAPI =
      typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognitionAPI) {
      showToastGreen('Tu navegador no admite dictado directo. Usa Chrome, Edge o Safari.');
      return;
    }

    // Si el chatbot estaba leyendo en voz alta, lo silenciamos para no interferir con el micrófono
    detenerLectura();

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = 'es-CO';
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      const textoActual = inputRef.current?.value || input || '';
      textoBaseVozRef.current = textoActual.trim() ? `${textoActual.trim()} ` : '';

      recognition.onstart = () => {
        setEscuchandoVoz(true);
      };

      recognition.onresult = (event) => {
        let transcripcion = '';
        for (let i = 0; i < event.results.length; i += 1) {
          transcripcion += event.results[i][0].transcript;
        }
        const textoCombinado = `${textoBaseVozRef.current}${transcripcion.trim()}`;
        setInput(textoCombinado);
      };

      recognition.onerror = (event) => {
        setEscuchandoVoz(false);
        reconocimientoRef.current = null;
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          showToastGreen('Permite el acceso al micrófono en tu navegador para dictar por voz.');
        } else if (event.error === 'no-speech') {
          showToastGreen('No se detectó voz. Toca el micrófono e inténtalo de nuevo.');
        }
      };

      recognition.onend = () => {
        setEscuchandoVoz(false);
        reconocimientoRef.current = null;
        inputRef.current?.focus();
      };

      reconocimientoRef.current = recognition;
      recognition.start();
    } catch (err) {
      setEscuchandoVoz(false);
      showToastGreen('No se pudo iniciar el micrófono. Inténtalo de nuevo.');
    }
  }, [escuchandoVoz, input, detenerDictadoVoz, detenerLectura, showToastGreen]);

  // Desplazamiento automático al último mensaje
  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  // Ajuste de altura del campo de texto
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [input]);

  // Cancela cualquier solicitud pendiente, lectura o dictado al salir de la página
  useEffect(
    () => () => {
      abortRef.current?.abort();
      clearTimeout(toastTimer.current);
      detenerLectura();
      detenerDictadoVoz();
    },
    [detenerLectura, detenerDictadoVoz]
  );

  /** Cita o quita la cita de un mensaje del chatbot (solo 1 a la vez) */
  const alternarCitaMensaje = useCallback(
    (mensajeObj) => {
      if (!mensajeObj || mensajeObj.rol !== 'bot' || mensajeObj.esError) return;
      setMensajeCitado((prev) => {
        if (prev?.id === mensajeObj.id) {
          showToastGreen('Se quitó el mensaje citado.');
          return null;
        }
        showToastGreen('Se ha citado un mensaje del chatbot para dar contexto.');
        return {
          id: mensajeObj.id,
          texto: mensajeObj.texto,
          resumen: resumirTextoCita(mensajeObj.texto),
        };
      });
      inputRef.current?.focus();
    },
    [showToastGreen]
  );

  /** Envía una consulta al motor normativo y agrega la respuesta al chat */
  const enviarConsulta = useCallback(
    async (textoCrudo, citaActual = null) => {
      const texto = (textoCrudo || '').trim();
      if (!texto || loading) return;

      // 1. Verificar si hay bloqueo activo por spam en localStorage
      const estadoSpam = obtenerEstadoBloqueoLocal();
      if (estadoSpam.bloqueado) {
        setBloqueadoHasta(estadoSpam.blockedUntil);
        setAhoraTick(Date.now());
        showToastGreen(estadoSpam.mensaje);
        return;
      }

      // 2. Verificar enfriamiento (cooldown) corto entre mensajes
      const ahora = Date.now();
      if (cooldownHasta > ahora) {
        const segRestantes = Math.max(1, Math.ceil((cooldownHasta - ahora) / 1000));
        showToastGreen(`Por favor espera ${segRestantes}s antes de enviar otro mensaje.`);
        return;
      }

      detenerDictadoVoz();
      detenerLectura();

      const mensaje = texto;
      const historial = messagesRef.current;

      const idMensajeUsuario = `u-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: idMensajeUsuario,
          rol: 'usuario',
          texto: mensaje,
          citaResumen: citaActual?.resumen || '',
        },
      ]);
      setInput('');
      setMensajeCitado(null);
      setLoading(true);

      const controlador = new AbortController();
      abortRef.current = controlador;

      try {
        const respuesta = await consultarManual({
          historial,
          mensaje,
          citaBot: citaActual?.texto || '',
          signal: controlador.signal,
        });

        const fueRechazadoPorNormas = respuesta === MENSAJE_RECHAZO_NORMATIVO;
        if (fueRechazadoPorNormas) {
          showToastGreen('Mensaje bloqueado: infringe las normas de uso y Términos de IRENIC.');
        }

        setMessages((prev) =>
          prev
            .map((m) => (fueRechazadoPorNormas && m.id === idMensajeUsuario ? { ...m, esBloqueado: true } : m))
            .concat({
              id: `b-${Date.now()}`,
              rol: 'bot',
              esError: fueRechazadoPorNormas,
              esBloqueado: fueRechazadoPorNormas,
              texto: respuesta,
            })
        );
      } catch (e) {
        if (e?.name === 'AbortError') return; // consulta reiniciada o página cerrada
        if (e instanceof IrenicModelError && e.code === 'RATE_LIMITED') {
          if (e.blockedUntil) {
            setBloqueadoHasta(e.blockedUntil);
            setAhoraTick(Date.now());
          }
          showToastGreen(e.message);
        }
        const textoError =
          e instanceof IrenicModelError
            ? e.message
            : 'No se pudo conectar con el modelo de chatbot de IRENIC. Inténtalo de nuevo.';
        setMessages((prev) =>
          prev
            .map((m) => (m.id === idMensajeUsuario ? { ...m, esBloqueado: true } : m))
            .concat({ id: `e-${Date.now()}`, rol: 'bot', esError: true, esBloqueado: true, texto: textoError })
        );
      } finally {
        if (abortRef.current === controlador) {
          abortRef.current = null;
          setLoading(false);
          const finEnvio = Date.now();
          setAhoraTick(finEnvio);
          setCooldownHasta(finEnvio + COOLDOWN_ENVIO_MS);
        }
      }
    },
    [loading, cooldownHasta, detenerDictadoVoz, detenerLectura, showToastGreen]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    enviarConsulta(input, mensajeCitado);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarConsulta(input, mensajeCitado);
    }
  };

  /** Botón para iniciar nueva consulta limpia */
  const handleNuevaConsulta = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    detenerLectura();
    detenerDictadoVoz();
    setLoading(false);
    setMessages([MENSAJE_BIENVENIDA]);
    setInput('');
    setMensajeCitado(null);
    showToastGreen('Iniciando una nueva consulta limpia...');
  };

  return (
    <>
      {/* ========================================================================
          CABECERA DEL AMBIENTE EXCLUSIVO DEL CHATBOT
          ======================================================================== */}
      <header className="chat-workspace-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Link to="/" className="chat-back-btn" title="Regresar a la página de presentación">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span className="btn-text-desktop">Volver a la Presentación</span>
            <span className="btn-text-mobile">Volver</span>
          </Link>

          <div className="chat-bot-identity">
            {/* Avatar con el Logo Simplificado del Robot */}
            <img src={`${ASSETS}logo-simple.jpg`} alt="Irenic Asistente de Convivencia" className="chat-bot-avatar-img" />

            <div className="chat-bot-info">
              <div className="chat-bot-name">
                IRENIC
                <span className="badge-tag">COLSAM</span>
              </div>
              <div className="chat-bot-status">
                <span className="status-dot-green"></span>
                <span>Manual de Convivencia • En línea</span>
              </div>
            </div>
          </div>
        </div>

        {/* Acción de Nueva Consulta */}
        <div className="chat-header-actions">
          <button
            id="btn-nueva-consulta"
            className="chat-back-btn"
            style={{ cursor: 'pointer' }}
            title="Reiniciar chat e iniciar consulta limpia"
            onClick={handleNuevaConsulta}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
            <span className="btn-text-desktop">Nueva Consulta</span>
            <span className="btn-text-mobile">Reiniciar</span>
          </button>
        </div>
      </header>

      {/* ========================================================================
          ÁREA PRINCIPAL DEL WORKSPACE DE CHAT
          ======================================================================== */}
      <main className="chat-workspace-main">
        {/* Barra de Sugerencias Rápidas para Estudiantes */}
        <div className="chat-prompts-bar">
          <div className="chat-prompts-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-ocre-dorado)' }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            <span>Sugerencias:</span>
          </div>

          {CHIPS.map((chip) => (
            <button
              key={chip.label}
              className="chip-btn"
              disabled={loading || estaEnCooldown || estaBloqueadoSpam}
              onClick={() => enviarConsulta(chip.prompt, mensajeCitado)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {chip.icon}
              </svg>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* Contenedor del chat estructurado de IRENIC */}
        <div className="embedded-chat-wrapper">
          {/* Mensajes */}
          <div className="irenic-chat-messages" role="log" aria-live="polite">
            <div className="irenic-chat-messages-inner">
              {messages.map((m) => {
                const estaLeyendo = leyendoId === m.id;
                const estaCitado = mensajeCitado?.id === m.id;
                return (
                  <div key={m.id} className={`irenic-msg-row ${m.rol}${m.esError ? ' error' : ''}`}>
                    {m.rol === 'bot' && <img src={`${ASSETS}logo-simple.jpg`} alt="" className="irenic-msg-avatar" />}
                    <div className="irenic-msg-bubble">
                      {m.citaResumen && (
                        <div className="irenic-msg-attachment" title={m.citaResumen}>
                          <IconoPin size={13} relleno />
                          <span>Mensaje del chatbot citado</span>
                        </div>
                      )}
                      {m.rol === 'bot' ? <FormattedMessage texto={m.texto} /> : m.texto}

                      {/* Opciones de las respuestas del chatbot: Escuchar respuesta + Pin para citar (máx. 1) */}
                      {m.rol === 'bot' && !m.esError && (
                        <div className="irenic-msg-footer">
                          <button
                            type="button"
                            className={`irenic-speak-btn${estaLeyendo ? ' active' : ''}`}
                            onClick={() => alternarLecturaMensaje(m)}
                            title={estaLeyendo ? 'Detener la lectura en voz alta' : 'Escuchar la respuesta del chatbot'}
                            aria-label={estaLeyendo ? 'Detener lectura' : 'Escuchar respuesta'}
                            aria-pressed={estaLeyendo}
                          >
                            {estaLeyendo ? (
                              <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"></rect>
                                </svg>
                                <span>Detener lectura</span>
                              </>
                            ) : (
                              <>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                                </svg>
                                <span>Escuchar respuesta</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            className={`irenic-pin-btn${estaCitado ? ' active' : ''}`}
                            onClick={() => alternarCitaMensaje(m)}
                            title={
                              estaCitado
                                ? 'Quitar cita de esta respuesta'
                                : 'Citar esta respuesta del chatbot como contexto (máx. 1)'
                            }
                            aria-label={estaCitado ? 'Quitar cita de respuesta' : 'Citar respuesta del chatbot'}
                            aria-pressed={estaCitado}
                          >
                            <IconoPin size={14} relleno={estaCitado} />
                            <span>{estaCitado ? 'Citado' : 'Citar'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Estado de carga mientras se consulta el Manual */}
              {loading && (
                <div className="irenic-msg-row bot">
                  <img src={`${ASSETS}logo-simple.jpg`} alt="" className="irenic-msg-avatar" />
                  <div className="irenic-msg-bubble">
                    <div className="irenic-typing">
                      <span className="irenic-typing-spinner"></span>
                      <span>Consultando el Manual de Convivencia...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={finRef}></div>
            </div>
          </div>

          {/* Barra de entrada */}
          <div className="irenic-chat-composer">
            {mensajeCitado && (
              <div className="irenic-attach-preview">
                <div className="irenic-attach-pill" title={mensajeCitado.resumen}>
                  <IconoPin size={15} relleno />
                  <span>Se ha citado un mensaje del chatbot</span>
                  <small className="irenic-attach-pill-size">
                    — &ldquo;{mensajeCitado.resumen}&rdquo;
                  </small>
                  <button
                    type="button"
                    onClick={() => setMensajeCitado(null)}
                    aria-label="Quitar mensaje citado"
                    title="Quitar cita para poder citar otro mensaje"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <form className="irenic-chat-form" onSubmit={handleSubmit}>
              <textarea
                ref={inputRef}
                className="irenic-chat-input"
                rows={1}
                value={input}
                disabled={loading || estaBloqueadoSpam}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  estaBloqueadoSpam
                    ? `Envío bloqueado temporalmente por spam (${textoTiempoBloqueo} restantes)...`
                    : escuchandoVoz
                      ? 'Escuchando tu voz... habla ahora y luego presiona Enviar'
                      : 'Describe tu situación o consulta según el Manual de Convivencia...'
                }
                aria-label="Escribe tu consulta"
              />

              {/* Botón de Micrófono para transcribir voz a texto */}
              <button
                type="button"
                className={`irenic-icon-btn irenic-mic-btn${escuchandoVoz ? ' listening' : ''}`}
                disabled={loading || estaBloqueadoSpam}
                onClick={alternarDictadoVoz}
                title={
                  escuchandoVoz
                    ? 'Detener micrófono (el texto quedará listo para enviar)'
                    : 'Dictar mensaje con el micrófono'
                }
                aria-label={escuchandoVoz ? 'Detener dictado por voz' : 'Dictar mensaje por voz'}
                aria-pressed={escuchandoVoz}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              </button>

              <button
                type="submit"
                className="irenic-send-btn"
                disabled={loading || estaEnCooldown || estaBloqueadoSpam || !input.trim()}
                title={
                  estaBloqueadoSpam
                    ? `Acceso bloqueado temporalmente (${textoTiempoBloqueo})`
                    : estaEnCooldown
                      ? `Espera ${segundosCooldown}s para enviar otro mensaje`
                      : 'Enviar consulta'
                }
              >
                <span>{estaEnCooldown ? `${segundosCooldown}s` : 'Enviar'}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>

            <p className="irenic-chat-disclaimer">
              Orientación informativa basada en el Manual de Convivencia. La decisión final corresponde a las instancias competentes del colegio.
            </p>
          </div>
        </div>
      </main>

      <Toast message={toast.message} show={toast.show} />
    </>
  );
}
