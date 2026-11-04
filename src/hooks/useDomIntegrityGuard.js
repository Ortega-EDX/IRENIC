import { useEffect, useRef, useState } from 'react';

/**
 * Escudo global no intrusivo contra inspección casual y edición directa de la página:
 * - Permite el clic derecho dentro de campos de escritura (<textarea>, <input>) para
 *   no afectar funciones útiles como "Pegar" o el corrector ortográfico del navegador.
 * - Bloquea el menú contextual (Inspeccionar) en el resto de la interfaz.
 * - Bloquea atajos de teclado de DevTools / Código fuente (F12, Ctrl+Shift+I/J/C, Ctrl+U).
 * - Impide activar document.designMode o atributos contenteditable fuera de los inputs.
 */
export function useGlobalAntiTamper() {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;

    const handleContextMenu = (e) => {
      const target = e.target;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'textarea' || tag === 'input') {
        return;
      }
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      const key = String(e.key || '').toLowerCase();
      const ctrlOrMeta = e.ctrlKey || e.metaKey;

      // F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Ctrl/Cmd + Shift + I / J / C (Inspector, Consola, Selector de elementos)
      if (ctrlOrMeta && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Ctrl/Cmd + U (Ver código fuente)
      if (ctrlOrMeta && !e.shiftKey && key === 'u') {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const asegurarModoDisenoApagado = () => {
      try {
        if (document.designMode && document.designMode.toLowerCase() !== 'off') {
          document.designMode = 'off';
        }
        if (document.body?.hasAttribute('contenteditable')) {
          document.body.removeAttribute('contenteditable');
        }
        if (document.documentElement?.hasAttribute('contenteditable')) {
          document.documentElement.removeAttribute('contenteditable');
        }
      } catch (_) {
        // ignorar errores de permisos del navegador
      }
    };

    asegurarModoDisenoApagado();

    const bodyObserver =
      typeof MutationObserver !== 'undefined'
        ? new MutationObserver((mutations) => {
            asegurarModoDisenoApagado();
            for (const m of mutations) {
              if (m.type === 'attributes' && m.target instanceof HTMLElement) {
                const tag = m.target.tagName.toLowerCase();
                if (tag !== 'textarea' && tag !== 'input' && m.target.hasAttribute('contenteditable')) {
                  m.target.removeAttribute('contenteditable');
                }
              }
            }
          })
        : null;

    if (bodyObserver && document.documentElement) {
      bodyObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['contenteditable'],
        subtree: true,
      });
    }

    document.addEventListener('contextmenu', handleContextMenu, { capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      bodyObserver?.disconnect();
    };
  }, []);
}

/**
 * Custodio de integridad del DOM para bloques de texto del chat (mensajes de Irenic y del usuario).
 * Si alguien abre DevTools desde el menú del navegador e intenta editar palabras, nodos HTML o
 * atributos (como ocultar texto o usar "Edit as HTML"), revierte el cambio al instante (< 1ms)
 * y fuerza la resincronización limpia con el estado real en memoria de React.
 */
export function useProtectedElementRef(deps = []) {
  const ref = useRef(null);
  const [tamperVersion, setTamperVersion] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof MutationObserver === 'undefined') return undefined;

    const parent = el.parentElement;
    const canonicalHTML = el.innerHTML;
    const canonicalClass = el.className;
    let restaurando = false;

    const restaurar = () => {
      if (restaurando) return;
      restaurando = true;
      try {
        // Si el nodo fue eliminado o reemplazado desde su contenedor padre ("Edit as HTML")
        if (parent && !parent.contains(el)) {
          setTamperVersion((v) => v + 1);
          return;
        }

        let huboCambio = false;

        if (el.innerHTML !== canonicalHTML) {
          el.innerHTML = canonicalHTML;
          huboCambio = true;
        }
        if (el.className !== canonicalClass) {
          el.className = canonicalClass;
          huboCambio = true;
        }
        if (el.hasAttribute('contenteditable')) {
          el.removeAttribute('contenteditable');
          huboCambio = true;
        }
        if (el.hasAttribute('style')) {
          el.removeAttribute('style');
          huboCambio = true;
        }
        if (el.hasAttribute('hidden')) {
          el.removeAttribute('hidden');
          huboCambio = true;
        }

        if (huboCambio) {
          setTamperVersion((v) => v + 1);
        }
      } finally {
        restaurando = false;
      }
    };

    const observer = new MutationObserver(() => {
      restaurar();
    });

    observer.observe(el, {
      childList: true,
      characterData: true,
      attributes: true,
      subtree: true,
    });

    const parentObserver = parent
      ? new MutationObserver((mutations) => {
          for (const m of mutations) {
            if (m.type === 'childList' && !parent.contains(el)) {
              restaurar();
              break;
            }
            if (m.type === 'attributes' && parent.hasAttribute('style')) {
              parent.removeAttribute('style');
            }
          }
        })
      : null;

    if (parentObserver && parent) {
      parentObserver.observe(parent, {
        childList: true,
        attributes: true,
      });
    }

    return () => {
      observer.disconnect();
      parentObserver?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tamperVersion]);

  return { ref, tamperVersion };
}
