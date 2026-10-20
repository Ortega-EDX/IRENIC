import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';

export default function Cookies() {
  usePageMeta({
    title: 'Política de Cookies y Almacenamiento Local | IRENIC - COLSAM',
    description:
      'Política de Cookies y Almacenamiento Local de la plataforma educativa IRENIC del Colegio San Alberto Magno.',
  });

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1.5rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/" style={{ color: 'var(--color-verde-inst, #10b981)', textDecoration: 'none', fontWeight: 600 }}>
          ← Volver a la presentación
        </Link>
      </div>

      <header style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ color: '#0f4c3a', fontSize: '2rem', marginBottom: '0.5rem' }}>
          Política de Cookies y Almacenamiento Local – IRENIC
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Colegio San Alberto Magno (COLSAM) • Asistente Virtual de Convivencia Escolar
        </p>
      </header>

      <section style={{ lineHeight: '1.7', color: '#334155' }}>
        <p style={{ marginBottom: '1.2rem' }}>
          Esta Política explica de manera transparente cómo la plataforma <strong>IRENIC</strong> hace uso del almacenamiento técnico en tu navegador para ofrecer una experiencia fluida y segura.
        </p>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>1. ¿Qué son las cookies y el almacenamiento local?</h3>
        <p>
          Las cookies y el almacenamiento local (<em>localStorage</em>) son pequeñas tecnologías de guardado de datos en tu navegador web. Permiten que la aplicación recuerde tus interacciones para que no tengas que volver a cargar la información cada vez que navegas.
        </p>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>2. ¿Qué tipo de datos guarda IRENIC?</h3>
        <p>
          Como plataforma pedagógica e institucional del Colegio San Alberto Magno (COLSAM), IRENIC únicamente almacena datos de carácter técnico y funcional:
        </p>
        <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
          <li><strong>Cookies Esenciales y Técnicas:</strong> Permiten mantener la fluidez en el envío y recepción de mensajes durante la sesión activa en el chatbot.</li>
          <li><strong>Almacenamiento de Preferencias:</strong> Guarda temporalmente tus ajustes visuales o el historial reciente de preguntas para facilitar tu navegación.</li>
          <li><strong>Sin rastreo comercial ni publicidad:</strong> IRENIC <strong>NO</strong> utiliza cookies de terceros, píxeles publicitarios ni herramientas de rastreo comercial.</li>
        </ul>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>3. Protección de la comunidad educativa</h3>
        <p>
          Ningún dato almacenado localmente en tu dispositivo es vendido, compartido ni utilizado para elaborar perfiles publicitarios de estudiantes o acudientes. Todo uso se enmarca estricta y únicamente en la interacción con el chatbot de convivencia.
        </p>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>4. ¿Cómo puedes borrar o desactivar el almacenamiento?</h3>
        <p>
          Si deseas borrar los datos guardados en tu dispositivo por IRENIC, puedes hacerlo en cualquier momento desde las opciones de configuración de tu navegador (Google Chrome, Microsoft Edge, Safari o Firefox) en el menú de <em>Privacidad y Seguridad → Borrar datos de navegación</em>.
        </p>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>5. Contacto e inquietudes</h3>
        <p style={{ marginBottom: '2rem' }}>
          Si tienes dudas sobre el uso de estas tecnologías en IRENIC, puedes ponerte en contacto escribiendo a: {' '}
          <a href="mailto:Irenic@colsam.edu.co" style={{ color: 'var(--color-verde-inst, #10b981)', fontWeight: 600 }}>
            Irenic@colsam.edu.co
          </a>
        </p>
      </section>
    </div>
  );
}
