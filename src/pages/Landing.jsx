import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';

const ASSETS = `${import.meta.env.BASE_URL}assets/`;

export default function Landing() {
  usePageMeta({
    title: 'IRENIC | Asistente de Convivencia - Colegio San Alberto Magno (COLSAM)',
    description:
      'Conoce a Irenic, el asistente virtual con inteligencia artificial para estudiantes sobre el Manual de Convivencia del Colegio San Alberto Magno.',
  });

  return (
    <div className="site-wrapper">
      {/* ========================================================================
          CABECERA INSTITUCIONAL CON LOGO OFICIAL
          ======================================================================== */}
      <header className="header-landing">
        <div className="header-inner">
          <Link to="/" className="brand-box">
            {/* Logo Oficial del Robot IRENIC */}
            <img src={`${ASSETS}logo.webp`} alt="Logo IRENIC - Colegio San Alberto Magno" className="brand-logo-img" />

            <div className="brand-names">
              <div className="brand-title">
                IRENIC
                <span className="badge-tag">COLSAM</span>
              </div>
              <span className="brand-school">Colegio San Alberto Magno</span>
            </div>
          </Link>

          {/* Botón de Acceso al Chat (Verde Institucional #338C30) */}
          <Link to="/chat" className="btn-cta-nav">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span className="btn-nav-desktop">Entrar al Chat</span>
            <span className="btn-nav-mobile">Chat</span>
          </Link>
        </div>
      </header>

      {/* ========================================================================
          HERO: PRESENTACIÓN DE IRENIC CON MASCOTA
          ======================================================================== */}
      <main>
        <section className="hero-presentation">
          <div className="hero-box">
            <div className="hero-content-col">
              <div className="hero-pill">
                <span className="status-dot-green"></span>
                <span>Asistente Inteligente Oficial de Convivencia Escolar</span>
              </div>

              <h1 className="hero-headline">
                Conoce a <span className="highlight-green">Irenic</span>, tu guía para el Manual de Convivencia
              </h1>

              <p className="hero-subtext">
                Irenic es el compañero virtual de los estudiantes del <strong>Colegio San Alberto Magno</strong>.
                Tu guía rápida, clara y confidencial para consultar normativas, derechos, deberes, uniformes, protocolos de atención y la tipificación de faltas según la Ley 1620 de 2013.
              </p>

              {/* Botón Destacado de Entrada al Espacio de Chat */}
              <div className="hero-cta-group">
                <Link to="/chat" className="btn-enter-chat">
                  <span>Entrar al Espacio de Chat con Irenic</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>

                <span className="cta-subnote">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#338C30" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Ambiente exclusivo integrado • Sin historial guardado • Puedes adjuntar documentos (PDFs o imágenes)
                </span>
              </div>
            </div>

            {/* Columna del Logo / Mascota Oficial */}
            <div className="hero-mascot-col">
              <div className="hero-mascot-card">
                <img src={`${ASSETS}logo.webp`} alt="Irenic - Asistente de Convivencia Escolar" className="hero-mascot-img" />
                <div className="hero-mascot-label">IRENIC • Asistente de Convivencia</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================
            SECCIÓN: CAPACIDADES Y BENEFICIOS PARA LOS ESTUDIANTES
            ======================================================================== */}
        <section className="features-section">
          <div className="section-title-wrap">
            <span className="section-tag">¿Cómo puede ayudarte Irenic?</span>
            <h2 className="section-main-title">Todo el Manual de Convivencia al alcance de tu mano</h2>
          </div>

          <div className="cards-grid-presentation">
            {/* Capacidad 1: Normativas */}
            <div className="presentation-card">
              <div className="card-img-container">
                <img src={`${ASSETS}normativas-manual.png`} alt="Normativas del Manual de Convivencia Escolar" className="card-img-illustration cover-fit" />
              </div>
              <h3>Normativas al Instante</h3>
              <p>
                Consulta sin enredos las normas del colegio, la clasificación de faltas en Tipo I (Leves),
                Tipo II (Graves) y Tipo III (Gravísimas) según la Ley 1620 de 2013, y las normas sobre el porte del uniforme.
              </p>
            </div>

            {/* Capacidad 2: Archivos y Documentos */}
            <div className="presentation-card">
              <div className="card-img-container">
                <img src={`${ASSETS}archivos-documentos.png`} alt="Lectura de Archivos y Documentos" className="card-img-illustration" />
              </div>
              <h3>Lectura de Archivos y Documentos</h3>
              <p>
                Puedes subir fotos de circulares, formatos de excusas médicas o fragmentos del manual directamente
                en la barra del chat mediante el icono de clip para que Irenic los lea y te oriente con exactitud.
              </p>
            </div>

            {/* Capacidad 3: Derechos y Debido Proceso */}
            <div className="presentation-card">
              <div className="card-img-container">
                <img src={`${ASSETS}derechos-debido-proceso.png`} alt="Derechos y Debido Proceso Estudiantil" className="card-img-illustration" />
              </div>
              <h3>Derechos y Debido Proceso</h3>
              <p>
                Un espacio para conocer tus garantías fundamentales, hacer escuchar tu voz y entender cómo funcionan las instancias formativas y de conciliación en las institución San Alberto Magno. .
              </p>
            </div>

            {/* Capacidad 4: Prevención y Apoyo */}
            <div className="presentation-card">
              <div className="card-img-container">
                <img src={`${ASSETS}prevencion-apoyo.png`} alt="Prevención y Apoyo Seguro" className="card-img-illustration" />
              </div>
              <h3>Prevención y Apoyo Seguro</h3>
              <p>
                Orientación inmediata y confidencial ante situaciones de acoso escolar (bullying) o ciberacoso,
                indicándote la Ruta de Atención Integral y los canales con Psicorientación.
              </p>
            </div>
          </div>

          {/* Banner Destacado de Subida de Archivos */}
          <div className="upload-feature-banner">
            <div className="upload-text">
              <h4>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-verde-inst)', flexShrink: 0 }}>
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
                <span>¿Tienes una circular, justificación o documento escolar?</span>
              </h4>
              <p>
                En el espacio exclusivo de chat encontrarás una barra integrada con un botón para adjuntar archivos.
                Sube tus archivos en formato PDF o imagen y pregúntale a Irenic cualquier duda sobre ellos.
              </p>
            </div>
            <Link to="/chat" className="btn-cta-nav" style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }}>
              <span>Abrir Chat y Adjuntar Archivo</span> →
            </Link>
          </div>
        </section>
      </main>

      {/* ========================================================================
          PIE DE PÁGINA INSTITUCIONAL CON CRÉDITOS OFICIALES
          ======================================================================== */}
      <footer className="footer-landing">
        <div className="footer-landing-inner">
          {/* Ficha técnica institucional del proyecto */}
          <div className="footer-credits-box">
            <div className="footer-credits-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-verde-inst)', flexShrink: 0 }}>
                <path d="M3 21h18"></path>
                <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
                <path d="M9 9h1"></path><path d="M9 13h1"></path><path d="M9 17h1"></path>
                <path d="M14 9h1"></path><path d="M14 13h1"></path><path d="M14 17h1"></path>
              </svg>
              <span>Colegio San Alberto Magno (COLSAM) • INMAT</span>
            </div>
            <p>
              <strong>Área:</strong> Tecnología e Informática | <strong>Grado:</strong> 11° (Once Grado) | <strong>Docente Orientador:</strong> <a href="mailto:isaiasbeleno@mail.colsam.edu.co">Isaías Enrique Beleño Morato</a>
            </p>
            <div style={{ marginTop: '0.5rem', fontWeight: 700, color: 'var(--color-verde-dark)' }}>
              Equipo de Desarrollo Estudiantil:
            </div>
            <ul className="footer-authors-list">
              <li><a href="mailto:ialmeida@mail.colsam.edu.co">Ignacio Geovanny Almeida Peñarrieta</a></li>
              <li><a href="mailto:jmonsalvo@mail.colsam.edu.co">Jeider David Monsalvo Barrios</a></li>
              <li><a href="mailto:jortega@mail.colsam.edu.co">Juan Sebastián Ortega Salcedo</a></li>
              <li><a href="mailto:aricaurte@mail.colsam.edu.co">Alejandro David Ricaurte Colmenares</a></li>
            </ul>
          </div>

          <div className="footer-bottom-row">
            <div>&copy; 2026 Colegio San Alberto Magno. Manual de Convivencia Escolar.</div>
            <div>
              <Link to="/chat">Ir al Chat con Irenic →</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
