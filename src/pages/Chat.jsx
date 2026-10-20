import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';
import Toast from '../components/Toast.jsx';
import FormattedMessage from '../components/FormattedMessage.jsx';
import { consultarManual, IrenicModelError } from '../services/gemini.js';
import '../styles/chat-messages.css';

const ASSETS = `${import.meta.env.BASE_URL}assets/`;

const MENSAJE_BIENVENIDA = {
  id: 'bienvenida',
  rol: 'bot',
  esBienvenida: true,
  texto: [
    '## Motor Normativo del Manual de Convivencia',
    'Describe tu situación o plantea un caso y lo analizaré bajo el Manual de Convivencia del Colegio San Alberto Magno.',
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
  const [toast, setToast] = useState({ message: '', show: false });

  const toastTimer = useRef(null);
  const abortRef = useRef(null);
  const finRef = useRef(null);
  const inputRef = useRef(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  /** Notificación Toast en verde institucional */
  const showToastGreen = useCallback((message) => {
    setToast({ message, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  }, []);

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

  // Cancela cualquier solicitud pendiente al salir de la página
  useEffect(
    () => () => {
      abortRef.current?.abort();
      clearTimeout(toastTimer.current);
    },
    []
  );

  /** Envía una consulta al motor normativo y agrega la respuesta al chat */
  const enviarConsulta = useCallback(
    async (textoCrudo) => {
      const mensaje = (textoCrudo || '').trim();
      if (!mensaje || loading) return;

      const historial = messagesRef.current;

      setMessages((prev) => [
        ...prev,
        {
          id: `u-${Date.now()}`,
          rol: 'usuario',
          texto: mensaje,
        },
      ]);
      setInput('');
      setLoading(true);

      const controlador = new AbortController();
      abortRef.current = controlador;

      try {
        const respuesta = await consultarManual({
          historial,
          mensaje,
          signal: controlador.signal,
        });
        setMessages((prev) => [...prev, { id: `b-${Date.now()}`, rol: 'bot', texto: respuesta }]);
      } catch (e) {
        if (e?.name === 'AbortError') return; // consulta reiniciada o página cerrada
        const textoError =
          e instanceof IrenicModelError
            ? e.message
            : 'No se pudo conectar con el modelo de IRENIC. Inténtalo de nuevo.';
        setMessages((prev) => [
          ...prev,
          { id: `e-${Date.now()}`, rol: 'bot', esError: true, texto: textoError },
        ]);
      } finally {
        if (abortRef.current === controlador) {
          abortRef.current = null;
          setLoading(false);
        }
      }
    },
    [loading]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    enviarConsulta(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarConsulta(input);
    }
  };

  /** Botón para iniciar nueva consulta limpia */
  const handleNuevaConsulta = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
    setMessages([MENSAJE_BIENVENIDA]);
    setInput('');
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
            {/* Avatar con el Logo Oficial del Robot */}
            <img src={`${ASSETS}logo.webp`} alt="Irenic Asistente de Convivencia" className="chat-bot-avatar-img" />

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
              disabled={loading}
              onClick={() => enviarConsulta(chip.prompt)}
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
              {messages.map((m) => (
                <div key={m.id} className={`irenic-msg-row ${m.rol}${m.esError ? ' error' : ''}`}>
                  {m.rol === 'bot' && <img src={`${ASSETS}logo.webp`} alt="" className="irenic-msg-avatar" />}
                  <div className="irenic-msg-bubble">
                    {m.rol === 'bot' ? <FormattedMessage texto={m.texto} /> : m.texto}
                  </div>
                </div>
              ))}

              {/* Estado de carga mientras se consulta el Manual */}
              {loading && (
                <div className="irenic-msg-row bot">
                  <img src={`${ASSETS}logo.webp`} alt="" className="irenic-msg-avatar" />
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
            <form className="irenic-chat-form" onSubmit={handleSubmit}>
              <textarea
                ref={inputRef}
                className="irenic-chat-input"
                rows={1}
                value={input}
                disabled={loading}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe tu situación o plantea un caso según el Manual de Convivencia..."
                aria-label="Escribe tu consulta"
              />

              <button type="submit" className="irenic-send-btn" disabled={loading || !input.trim()}>
                <span>Enviar</span>
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
