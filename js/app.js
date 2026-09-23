/**
 * PORTAL INSTITUCIONAL IRENIC - COLEGIO SAN ALBERTO MAGNO (COLSAM)
 * Controlador para la Página de Presentación y el Ambiente Exclusivo del Chatbot
 */

// Función de intercepción temprana para asegurar el montaje en el contenedor integrado
functiñon setupBotpressEmbedded() {
  if (!window.botpress) return;

  const origInit = window.botpress.init;
  window.botpress.init = function (options) {
    options = options || {};
    options.configuration = options.configuration || {};
    // Asignar el contenedor embebido y desactivar historial
    options.configuration.embeddedChatId = "irenic-embedded-chat";
    options.configuration.hideWidget = true;
    options.configuration.allowFileUpload = true;
    options.configuration.conversationHistory = false;
    options.configuration.homePageEnabled = false;
    options.configuration.storageLocation = "sessionStorage";

    console.log('[Irenic] Inicializando Botpress en contenedor integrado:', options);
    const result = origInit.call(window.botpress, options);

    attachBotpressOpenEvents();
    return result;
  };
}

function attachBotpressOpenEvents() {
  if (!window.botpress) return;

  const onReady = () => {
    console.log('[Irenic] Abriendo Webchat...');
    try {
      window.botpress.open();
    } catch (e) {
      console.warn('Error en botpress.open():', e);
    }
    hideChatLoadingPlaceholder();
    handleUrlPromptParam();
  };

  if (typeof window.botpress.on === 'function') {
    window.botpress.on('webchat:initialized', onReady);
    window.botpress.on('webchat:ready', onReady);
  }

  // Ticks de respaldo
  setTimeout(onReady, 800);
  setTimeout(onReady, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
  initChipsHandler();
  initLoadingWatchdog();
});

/**
 * Maneja los chips de preguntas frecuentes en el ambiente exclusivo de chat
 */
function initChipsHandler() {
  const chips = document.querySelectorAll('.chip-btn');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt') || chip.textContent.trim();
      sendPromptToIrenic(prompt);
    });
  });
}

/**
 * Envía un mensaje directamente al chat embebido de Irenic
 * @param {string} text Texto del mensaje o pregunta
 */
function sendPromptToIrenic(text) {
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
}

/**
 * Lee parámetros de la URL (ej: chat.html?prompt=Faltas)
 */
function handleUrlPromptParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const promptParam = urlParams.get('prompt');
  if (promptParam) {
    setTimeout(() => {
      sendPromptToIrenic(promptParam);
    }, 800);
  }
}

/**
 * Oculta la pantalla de carga del chat una vez montado
 */
function hideChatLoadingPlaceholder() {
  const placeholder = document.getElementById('chat-loading');
  if (placeholder) {
    placeholder.classList.add('loaded');
  }
}

/**
 * Watchdog para asegurar que el placeholder de carga se oculte
 */
function initLoadingWatchdog() {
  setTimeout(() => {
    hideChatLoadingPlaceholder();
    if (window.botpress) {
      try { window.botpress.open(); } catch (e) {}
    }
  }, 3500);
}

/**
 * Notificación Toast en verde institucional
 */
function showToastGreen(message) {
  let toast = document.getElementById('toast-green');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-green';
    toast.className = 'toast-notice-green';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');

  clearTimeout(window.greenToastTimer);
  window.greenToastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
