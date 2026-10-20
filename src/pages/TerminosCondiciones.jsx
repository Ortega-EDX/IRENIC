import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';

export default function TerminosCondiciones() {
  usePageMeta({
    title: 'Términos y Condiciones de Uso | IRENIC - COLSAM',
    description:
      'Términos y Condiciones de Uso de la plataforma educativa IRENIC del Colegio San Alberto Magno (COLSAM).',
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
          Términos y Condiciones de Uso – IRENIC
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Colegio San Alberto Magno (COLSAM) • Asistente Virtual de Convivencia Escolar
        </p>
      </header>

      <section style={{ lineHeight: '1.7', color: '#334155' }}>
        <p style={{ marginBottom: '1.2rem' }}>
          Lee detenidamente estos términos antes de utilizar el servicio. Este documento establece las reglas y obligaciones que rigen el uso de la plataforma IRENIC.
        </p>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>1. Aceptación de los términos</h3>
        <p>
          Al acceder o interactuar con el chatbot IRENIC, aceptas quedar vinculado por estos Términos y Condiciones y por la{' '}
          <Link to="/tratamiento-datos" style={{ color: 'var(--color-verde-inst, #10b981)', fontWeight: 600 }}>
            Política de Tratamiento de Datos Personales
          </Link>{' '}
          del Colegio San Alberto Magno (COLSAM). Si no estás de acuerdo con alguna de las disposiciones, debes abstenerte de utilizar el servicio.
        </p>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>2. Naturaleza y alcance del servicio</h3>
        <p>
          IRENIC es una herramienta pedagógica e informativa basada en un chatbot y asistente virtual desarrollado para orientar a la comunidad educativa sobre el Manual de Convivencia Escolar, la Ley 1620 de 2013 (Convivencia Escolar) y las rutas institucionales de atención.
        </p>
        <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
          <li>La información suministrada por IRENIC es únicamente de carácter consultivo e informativo.</li>
          <li>No reemplaza las decisiones formales ni los debidos procesos ejecutados por los directivos, docentes o el Comité Escolar de Convivencia del COLSAM.</li>
        </ul>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>3. Uso aceptable del servicio</h3>
        <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
          <li>El servicio debe ser utilizado exclusivamente con fines pedagógicos, educativos e informativos.</li>
          <li>No debes utilizar el chatbot para enviar mensajes ofensivos, difamatorios, lenguaje de odio o intentar alterar el correcto funcionamiento del sistema.</li>
          <li>Toda consulta debe formularse de manera respetuosa y conforme a los valores institucionales.</li>
        </ul>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>4. Modificaciones de los términos</h3>
        <p>
          El Colegio San Alberto Magno se reserva el derecho de actualizar o modificar estos términos cuando sea necesario, especialmente ante actualizaciones del Manual de Convivencia o de la legislación colombiana.
        </p>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>5. Propiedad intelectual</h3>
        <p>
          Todos los derechos sobre el nombre, diseño, código fuente, interfaz y contenidos de IRENIC pertenecen al Colegio San Alberto Magno (COLSAM) y al equipo de desarrollo estudiantil INMAT. Queda prohibida la reproducción total o parcial sin autorización explícita.
        </p>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>6. Limitación de responsabilidad</h3>
        <p>
          A pesar de los esfuerzos por mantener la información actualizada y precisa, IRENIC no garantiza que el servicio esté libre de interrupciones o imprecisiones eventuales derivadas del funcionamiento del chatbot. El COLSAM no se hace responsable por malinterpretaciones o decisiones tomadas por el usuario sin la previa verificación con el personal docente o directivo correspondiente.
        </p>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>7. Tratamiento de datos y privacidad</h3>
        <p>
          Las consultas realizadas en IRENIC respetan los principios de la Ley 1581 de 2012 de Habeas Data en Colombia. Puedes consultar el detalle completo en nuestra sección de{' '}
          <Link to="/tratamiento-datos" style={{ color: 'var(--color-verde-inst, #10b981)', fontWeight: 600 }}>
            Tratamiento de Datos Personales
          </Link>
          .
        </p>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>8. Ley aplicable y jurisdicción</h3>
        <p>
          Estos términos se rigen e interpretan conforme a las leyes de la República de Colombia, especialmente la Ley General de Educación (Ley 115 de 1994) y la Ley de Convivencia Escolar (Ley 1620 de 2013).
        </p>

        <h3 style={{ color: '#0f4c3a', marginTop: '1.5rem' }}>9. Contacto e inquietudes</h3>
        <p style={{ marginBottom: '2rem' }}>
          Si tienes dudas sobre estos términos o sobre el funcionamiento de IRENIC, puedes escribir a: {' '}
          <a href="mailto:Irenic@colsam.edu.co" style={{ color: 'var(--color-verde-inst, #10b981)', fontWeight: 600 }}>
            Irenic@colsam.edu.co
          </a>
        </p>
      </section>
    </div>
  );
}
