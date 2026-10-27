import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';
import '../styles/pages.css';

export default function TerminosCondiciones() {
  usePageMeta({
    title: 'Términos y Condiciones de Uso | IRENIC - COLSAM',
    description:
      'Términos y Condiciones de Uso, normas de moderación automatizada y descargo de responsabilidad del modelo de chatbot de la plataforma educativa IRENIC del Colegio San Alberto Magno (COLSAM).',
  });

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1.5rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Link to="/" style={{ color: 'var(--color-verde-inst, #10b981)', textDecoration: 'none', fontWeight: 600 }}>
          ← Volver a la presentación
        </Link>
        <Link to="/chat" style={{ color: 'var(--color-verde-dark, #1A4718)', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
          Ir al Chat con IRENIC →
        </Link>
      </div>

      <header style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ color: '#0f4c3a', fontSize: '2rem', marginBottom: '0.5rem' }}>
          Términos y Condiciones de Uso – IRENIC
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Colegio San Alberto Magno (COLSAM) • Asistente Virtual y Modelo de Chatbot de Convivencia Escolar
        </p>
      </header>

      <section style={{ lineHeight: '1.7', color: '#334155' }}>
        <p style={{ marginBottom: '1.2rem' }}>
          Lee detenidamente estos términos antes de utilizar el servicio. Este documento establece las reglas, medidas de seguridad y obligaciones que rigen el uso de la plataforma educativa IRENIC.
        </p>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>1. Aceptación de los términos</h3>
        <p>
          Al acceder o interactuar con el modelo de chatbot de IRENIC, aceptas quedar vinculado por estos Términos y Condiciones y por la{' '}
          <Link to="/tratamiento-datos" style={{ color: 'var(--color-verde-inst, #10b981)', fontWeight: 600 }}>
            Política de Tratamiento de Datos Personales
          </Link>{' '}
          del Colegio San Alberto Magno (COLSAM). Si no estás de acuerdo con alguna de las disposiciones aquí descritas, debes abstenerte de utilizar el servicio.
        </p>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>2. Naturaleza y alcance del servicio</h3>
        <p>
          IRENIC es una herramienta pedagógica e informativa basada en un modelo de chatbot y asistente virtual desarrollado para orientar a la comunidad educativa sobre el Manual de Convivencia Escolar, la Ley 1620 de 2013 (Convivencia Escolar) y las rutas institucionales de atención.
        </p>
        <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
          <li>La información suministrada por IRENIC es únicamente de carácter consultivo, orientador e informativo.</li>
          <li>No reemplaza el texto oficial vigente del Manual de Convivencia ni las decisiones formales o debidos procesos ejecutados por los directivos, docentes o el Comité Escolar de Convivencia del COLSAM.</li>
        </ul>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>
          3. Uso Aceptable, Moderación Automatizada y Descargo de Responsabilidad del Modelo de Chatbot
        </h3>
        <p>
          Con el fin de garantizar un entorno escolar digital seguro, respetuoso y disponible para todos los estudiantes del Colegio San Alberto Magno, la plataforma cuenta con un sistema automatizado de seguridad en múltiples capas (<em>Guardrails</em>) y control contra abuso:
        </p>
        <ul style={{ paddingLeft: '1.5rem', margin: '0.6rem 0' }}>
          <li>
            <strong>Descargo de responsabilidad del modelo de chatbot:</strong> Las respuestas de IRENIC son orientativas y generadas de forma automatizada por el modelo de chatbot a partir del Manual de Convivencia institucional, por lo que no sustituyen el documento normativo oficial ni las determinaciones de las directivas escolares, Coordinación de Convivencia o Rectoría.
          </li>
          <li>
            <strong>Prohibición de manipulación del sistema y lenguaje ofensivo:</strong> Queda estrictamente prohibido enviar insultos, groserías, expresiones vulgares o discriminatorias, así como realizar intentos de manipulación de las instrucciones del modelo de chatbot (<em>Prompt Injection</em>, <em>Jailbreak</em>, solicitudes para ignorar reglas o forzar la repetición de palabras). Cualquier mensaje que incurra en estas prácticas será interceptado y rechazado de inmediato sin ser procesado.
          </li>
          <li>
            <strong>Control Anti-Spam y Sanciones Progresivas:</strong> Para proteger la disponibilidad del servicio en la red escolar, el envío masivo o automatizado de consultas (5 o más mensajes en menos de 10 segundos) activará automáticamente una suspensión temporal del acceso por <strong>5 minutos</strong>. La acumulación de <strong>3 sanciones por spam</strong> ocasionará el bloqueo automático del dispositivo/sesión por <strong>24 horas</strong>.
          </li>
          <li>
            <strong>Consecuencias disciplinarias institucionales:</strong> Cualquier intento deliberado de vulnerar el sistema, emplear lenguaje ofensivo o ejecutar ataques de saturación (spam) contra la plataforma será bloqueado automáticamente y, en caso de identificarse su autoría dentro de la institución, podrá acarrear las medidas pedagógicas y sanciones disciplinarias contempladas en el Manual de Convivencia del Colegio San Alberto Magno.
          </li>
        </ul>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>4. Modificaciones de los términos</h3>
        <p>
          El Colegio San Alberto Magno se reserva el derecho de actualizar o modificar estos términos cuando sea necesario, especialmente ante actualizaciones del Manual de Convivencia, mejoras en los filtros de seguridad del modelo de chatbot o cambios en la legislación colombiana.
        </p>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>5. Propiedad intelectual</h3>
        <p>
          Todos los derechos sobre el nombre, diseño, código fuente, arquitectura de seguridad, interfaz y contenidos de IRENIC pertenecen al Colegio San Alberto Magno (COLSAM) y al equipo de desarrollo estudiantil INMAT. Queda prohibida la reproducción total o parcial sin autorización explícita.
        </p>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>6. Limitación de responsabilidad</h3>
        <p>
          A pesar de los esfuerzos por mantener la información actualizada y precisa, IRENIC no garantiza que el servicio esté libre de interrupciones o imprecisiones eventuales derivadas del funcionamiento del modelo de chatbot. El COLSAM no se hace responsable por malinterpretaciones o decisiones tomadas por el usuario sin la previa verificación con el personal docente o directivo correspondiente.
        </p>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>7. Tratamiento de datos y privacidad</h3>
        <p>
          Las consultas realizadas en IRENIC respetan los principios de la Ley 1581 de 2012 de Habeas Data en Colombia. Los identificadores técnicos de sesión utilizados para la prevención de spam son estrictamente anónimos y locales al navegador. Puedes consultar el detalle completo en nuestra sección de{' '}
          <Link to="/tratamiento-datos" style={{ color: 'var(--color-verde-inst, #10b981)', fontWeight: 600 }}>
            Tratamiento de Datos Personales
          </Link>
          .
        </p>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>8. Ley aplicable y jurisdicción</h3>
        <p>
          Estos términos se rigen e interpretan conforme a las leyes de la República de Colombia, especialmente la Ley General de Educación (Ley 115 de 1994), el Código de la Infancia y la Adolescencia (Ley 1098 de 2006) y la Ley de Convivencia Escolar (Ley 1620 de 2013).
        </p>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>9. Contacto e inquietudes</h3>
        <p style={{ marginBottom: '2rem' }}>
          Si tienes dudas sobre estos términos o sobre el funcionamiento de IRENIC, puedes escribir a:{' '}
          <a href="mailto:Irenic@colsam.edu.co" style={{ color: 'var(--color-verde-inst, #10b981)', fontWeight: 600 }}>
            Irenic@colsam.edu.co
          </a>
        </p>
      </section>
    </div>
  );
}
