import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';
import '../styles/pages.css';

const ASSETS = `${import.meta.env.BASE_URL}assets/`;

export default function Landing() {
  usePageMeta({
    title: 'IRENIC | Asistente de Convivencia - Colegio San Alberto Magno (COLSAM)',
    description:
      'Conoce a Irenic, el asistente virtual con modelo de chatbot para estudiantes sobre el Manual de Convivencia del Colegio San Alberto Magno.',
  });

  return (
    <div className="site-wrapper">
      {/* ========================================================================
          CABECERA INSTITUCIONAL CON LOGO OFICIAL
          ======================================================================== */}
      <header className="header-landing">
        <div className="header-inner">
          <Link to="/" className="brand-box">
            {/* Logo Simplificado del Robot IRENIC para tamaños pequeños */}
            <img src={`${ASSETS}logo-simple.jpg`} alt="Logo IRENIC - Colegio San Alberto Magno" className="brand-logo-img" />

            <div className="brand-names">
              <div className="brand-title">
                IRENIC
                <span className="badge-tag">COLSAM</span>
              </div>
              <span className="brand-school">Colegio San Alberto Magno</span>
            </div>
          </Link>

          {/* Botones de Navegación: Nosotros y Acceso al Chat */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <Link to="/nosotros" className="btn-cta-nav">
              <span>Nosotros</span>
            </Link>

            <Link to="/chat" className="btn-cta-nav">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className="btn-nav-desktop">Entrar al Chat</span>
              <span className="btn-nav-mobile">Chat</span>
            </Link>
          </div>
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
                  Ambiente exclusivo integrado • Sin historial guardado • Orientación normativa verificada
                </span>
              </div>
            </div>

            <div className="hero-mascot-col">
              <img src={`${ASSETS}logo-principal.jpg`} alt="Irenic - Asistente de Convivencia Escolar" className="hero-mascot-img" />
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
            <div className="presentation-card">
              <div className="card-img-container">
                <img src={`${ASSETS}normativas-manual.png`} alt="Normativas del Manual de Convivencia Escolar" className="card-img-illustration cover-fit" />
              </div>
              <h3>Normativas al Instante</h3>
              <p>Consulta sin enredos las normas del colegio, la clasificación de faltas en Tipo I, II y III según la Ley 1620 de 2013.</p>
            </div>

            <div className="presentation-card">
              <div className="card-img-container">
                <img src={`${ASSETS}archivos-documentos.png`} alt="Lectura de Archivos y Documentos" className="card-img-illustration" />
              </div>
              <h3>Lectura de Archivos</h3>
              <p>Sube fotos de circulares o excusas médicas directamente en el chat para que Irenic te oriente con exactitud.</p>
            </div>

            <div className="presentation-card">
              <div className="card-img-container">
                <img src={`${ASSETS}derechos-debido-proceso.png`} alt="Derechos y Debido Proceso Estudiantil" className="card-img-illustration" />
              </div>
              <h3>Derechos y Debido Proceso</h3>
              <p>Conoce tus garantías fundamentales y cómo funcionan las instancias de conciliación en el colegio.</p>
            </div>

            <div className="presentation-card">
              <div className="card-img-container">
                <img src={`${ASSETS}prevencion-apoyo.png`} alt="Prevención y Apoyo Seguro" className="card-img-illustration" />
              </div>
              <h3>Prevención y Apoyo Seguro</h3>
              <p>Orientación confidencial ante situaciones de acoso escolar, indicándote la Ruta de Atención Integral.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
