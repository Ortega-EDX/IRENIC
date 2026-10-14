import { useCallback, useEffect, useRef, useState } from 'react';
import usePageMeta from '../hooks/usePageMeta.js';
import Toast from '../components/Toast.jsx';

const ASSETS = `${import.meta.env.BASE_URL}assets/`;
const BOTPRESS_SRC = 'https://cdn.botpress.cloud/webchat/v5.0/inject.js';

/** Sugerencias rápidas (antes botones .chip-btn con data-prompt) */
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

/** Limpia historial y sesiones previas de Botpress en el almacenamiento */
function clearBotpressStorage() {
  const clear = (storage) => {
    for (let i = storage.length - 1; i >= 0; i--) {
      const k = storage.key(i);
      if (k && (k.startsWith('bp-') || k.includes('botpress') || k.includes('conversation'))) {
        storage.removeItem(k);
      }
    }
  };
  try {
    clear(localStorage);
    clear(sessionStorage);
  } catch (e) {
    /* almacenamiento no disponible */
  }
}

/** Inicialización de Botpress con HISTORIAL Y HOME DESACTIVADOS */
function initBotpress() {
  window.botpress.init({
    botId: '79600d56-2bf0-4828-83e9-e609cc464b68',
    configuration: {
      version: 'v2',
      botName: 'Irenic - Convivencia COLSAM',
      botAvatar: `${ASSETS}logo.webp`,
      allowFileUpload: true,
      soundEnabled: true,
      conversationHistory: false, // DESACTIVADO: No guardar historial
      homePageEnabled: false, // DESACTIVADO: Entrar directo al chat
      storageLocation: 'sessionStorage', // No persistir permanentemente
      citationsEnabled: true,
      agentPresenceEnabled: true,
      embeddedChatId: 'irenic-embedded-chat',
      hideWidget: true,
    },
    clientId: '8a8a54a2-e7bd-4283-9bb8-b9a707102929',
  });
}

// Evita inicializar Botpress más de una vez (React.StrictMode ejecuta los efectos dos veces en desarrollo)
let botpressStarted = false;

export default function Chat() {
  usePageMeta({
    title: 'IRENIC | Chat de Convivencia Escolar - Colegio San Alberto Magno (COLSAM)',
    description:
      'Espacio exclusivo para interactuar con Irenic, asistente inteligente del Manual de Convivencia del Colegio San Alberto Magno.',
    bodyClass: 'chat-page-body',
  });

  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState({ message: '', show: false });
  const toastTimer = useRef(null);

  /** Notificación Toast en verde institucional */
  const showToastGreen = useCallback((message) => {
    setToast({ message, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  }, []);

  /** Envía un mensaje directamente al chat embebido de Irenic */
  const sendPromptToIrenic = useCallback(
    (text) => {
      if (!text) return;

      showToastGreen(`Preguntando a Irenic: "${text.length > 30 ? text.substring(0, 30) + '...' : text}"`);

      if (window.botpress && typeof window.botpress.sendMessage === 'function') {
        try {
          window.botpress.sendMessage(text);
        } catch (e) {
          console.warn('Error al enviar mensaje a Botpress:', e);
        }
      } else {
        setTimeout(() => {
          if (window.botpress && typeof window.botpress.sendMessage === 'function') {
            window.botpress.sendMessage(text);
          }
        }, 600);
      }
    },
    [showToastGreen]
  );

  /** Botón para iniciar nueva consulta limpia */
  const handleNuevaConsulta = () => {
    try {
      if (window.botpress && typeof window.botpress.restartConversation === 'function') {
        window.botpress.restartConversation();
        showToastGreen('Iniciando una nueva consulta limpia...');
      } else {
        window.location.reload();
      }
    } catch (e) {
      window.location.reload();
    }
  };

  /**
   * Volver a la presentación. Botpress inyecta elementos globales que no se pueden
   * desmontar, por lo que se recarga la página para dejar todo limpio (igual que
   * al navegar entre index.html y chat.html).
   */
  const handleBack = (e) => {
    e.preventDefault();
    window.location.hash = '#/';
    window.location.reload();
  };

  useEffect(() => {
    const timers = [];
    const openAndHide = () => {
      try {
        window.botpress.open();
      } catch (e) {
        /* aún no disponible */
      }
      setLoaded(true);
    };

    const start = () => {
      if (!window.botpress) return;
      if (!botpressStarted) {
        botpressStarted = true;
        clearBotpressStorage();
        initBotpress();
        window.botpress.on('webchat:ready', openAndHide);
      }
      timers.push(setTimeout(openAndHide, 800));
    };

    if (window.botpress) {
      start();
    } else {
      let script = document.querySelector(`script[src="${BOTPRESS_SRC}"]`);
      if (!script) {
        script = document.createElement('script');
        script.src = BOTPRESS_SRC;
        document.body.appendChild(script);
      }
      script.addEventListener('load', start);
    }

    // Watchdog para asegurar que el placeholder de carga se oculte
    timers.push(
      setTimeout(() => {
        setLoaded(true);
        if (window.botpress) {
          try {
            window.botpress.open();
          } catch (e) {
            /* sin acción */
          }
        }
      }, 3500)
    );

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(toastTimer.current);
    };
  }, []);

  return (
    <>
      {/* ========================================================================
          CABECERA DEL AMBIENTE EXCLUSIVO DEL CHATBOT
          ======================================================================== */}
      <header className="chat-workspace-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <a href="#/" onClick={handleBack} className="chat-back-btn" title="Regresar a la página de presentación">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span className="btn-text-desktop">Volver a la Presentación</span>
            <span className="btn-text-mobile">Volver</span>
          </a>

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

        {/* Indicador de Subida de Archivos y Nueva Consulta */}
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

          <div className="file-feature-indicator" title="Puedes enviar fotos, excusas o documentos en PDF mediante el clip de la barra">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
            </svg>
            <span>Adjuntar documentos</span>
          </div>
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
            <button key={chip.label} className="chip-btn" onClick={() => sendPromptToIrenic(chip.prompt)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {chip.icon}
              </svg>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* Contenedor Embebido Exclusivo de IRENIC */}
        <div className="embedded-chat-wrapper">
          {/* Pantalla de carga mientras se monta el chat */}
          <div id="chat-loading" className={`chat-loading-placeholder${loaded ? ' loaded' : ''}`}>
            <div className="loading-spinner-green"></div>
            <div className="loading-text">Iniciando consulta con Irenic...</div>
          </div>

          {/* AQUÍ SE MONTA DIRECTAMENTE EL CHATBOT DE BOTPRESS */}
          <div id="irenic-embedded-chat"></div>
        </div>
      </main>

      <Toast message={toast.message} show={toast.show} />
    </>
  );
}
