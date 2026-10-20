import { Fragment } from 'react';

/**
 * Renderiza el analisis del motor normativo (subconjunto de Markdown) como JSX seguro,
 * sin usar dangerouslySetInnerHTML:
 *   "## Titulo", "- viñeta", "1. item", "**negrita**" y parrafos.
 */
function renderInline(texto, clave) {
  const partes = texto.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return partes.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? (
      <strong key={`${clave}-${i}`}>{p.slice(2, -2)}</strong>
    ) : (
      <Fragment key={`${clave}-${i}`}>{p}</Fragment>
    )
  );
}

function parsearBloques(texto) {
  const bloques = [];
  let lista = null;

  const cerrarLista = () => {
    if (lista) {
      bloques.push(lista);
      lista = null;
    }
  };

  texto.split(/\r?\n/).forEach((lineaCruda) => {
    const linea = lineaCruda.trim();

    if (!linea) {
      cerrarLista();
      return;
    }

    const titulo = linea.match(/^#{1,6}\s+(.*)$/);
    if (titulo) {
      cerrarLista();
      bloques.push({ tipo: 'titulo', texto: titulo[1].replace(/\*\*/g, '') });
      return;
    }

    const vineta = linea.match(/^[-*•]\s+(.*)$/);
    if (vineta) {
      if (!lista || lista.tipo !== 'ul') {
        cerrarLista();
        lista = { tipo: 'ul', items: [] };
      }
      lista.items.push(vineta[1]);
      return;
    }

    const numerado = linea.match(/^\d+[.)]\s+(.*)$/);
    if (numerado) {
      if (!lista || lista.tipo !== 'ol') {
        cerrarLista();
        lista = { tipo: 'ol', items: [] };
      }
      lista.items.push(numerado[1]);
      return;
    }

    cerrarLista();
    bloques.push({ tipo: 'parrafo', texto: linea });
  });

  cerrarLista();
  return bloques;
}

export default function FormattedMessage({ texto }) {
  const bloques = parsearBloques(texto);

  return (
    <div className="irenic-msg-formatted">
      {bloques.map((b, i) => {
        if (b.tipo === 'titulo') {
          return (
            <h4 key={i} className="irenic-msg-heading">
              {b.texto}
            </h4>
          );
        }
        if (b.tipo === 'ul') {
          return (
            <ul key={i} className="irenic-msg-list">
              {b.items.map((it, j) => (
                <li key={j}>{renderInline(it, `${i}-${j}`)}</li>
              ))}
            </ul>
          );
        }
        if (b.tipo === 'ol') {
          return (
            <ol key={i} className="irenic-msg-list">
              {b.items.map((it, j) => (
                <li key={j}>{renderInline(it, `${i}-${j}`)}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={i} className="irenic-msg-paragraph">
            {renderInline(b.texto, `${i}`)}
          </p>
        );
      })}
    </div>
  );
}
