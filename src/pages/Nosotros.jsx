import { useState } from 'react';
import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';
import '../styles/pages.css';

const ASSETS = `${import.meta.env.BASE_URL}assets/`;

/**
 * Integrantes del Equipo de Desarrollo (Equipo INMAT - Grado 11° COLSAM).
 * Coloca las fotografías en `public/assets/equipo/` con los nombres indicados en `foto`.
 * Mientras se agregan los archivos, la tarjeta muestra automáticamente las iniciales del integrante.
 */
const INTEGRANTES_EQUIPO = [
  {
    id: 'juan-ortega',
    nombre: 'Juan Sebastián Ortega Salcedo',
    iniciales: 'JO',
    rol: 'Arquitectura de Software & Backend',
    foto: `${ASSETS}equipo/juan-ortega.webp`,
    rutaArchivo: 'public/assets/equipo/juan-ortega.webp',
    aportes:
      'Diseño de la arquitectura cliente-servidor, implementación del proxy seguro (/api/chat), integración del motor normativo y despliegue de la plataforma.',
  },
  {
    id: 'ignacio-almeida',
    nombre: 'Ignacio Geovanny Almeida Peñarrieta',
    iniciales: 'IA',
    rol: 'Frontend & Diseño UI/UX',
    foto: `${ASSETS}equipo/ignacio-almeida.webp`,
    rutaArchivo: 'public/assets/equipo/ignacio-almeida.webp',
    aportes:
      'Desarrollo de componentes interactivos en React, aplicación de la paleta cromática institucional anti-fatiga visual y adaptabilidad multidispositivo.',
  },
  {
    id: 'jeider-monsalvo',
    nombre: 'Jeider David Monsalvo Barrios',
    iniciales: 'JM',
    rol: 'Documentación & Marco Normativo',
    foto: `${ASSETS}equipo/jeider-monsalvo.webp`,
    rutaArchivo: 'public/assets/equipo/jeider-monsalvo.webp',
    aportes:
      'Estructuración y curaduría del Manual de Convivencia Escolar, alineación con la Ley 1620 de 2013, el SIEE y las rutas de debido proceso.',
  },
  {
    id: 'alejandro-ricaurte',
    nombre: 'Alejandro David Ricaurte Colmenares',
    iniciales: 'AR',
    rol: 'Validación Normativa & Pruebas QA',
    foto: `${ASSETS}equipo/alejandro-ricaurte.webp`,
    rutaArchivo: 'public/assets/equipo/alejandro-ricaurte.webp',
    aportes:
      'Diseño de casos de prueba estudiantiles, verificación de precisión en la tipificación de faltas (Tipo I, II y III) y control de calidad de respuestas.',
  },
];

const PILARES_TECNOLOGICOS = [
  {
    titulo: 'Consulta Basada en el Manual Oficial',
    descripcion:
      'El motor analiza cada consulta contrastándola exclusivamente con el texto íntegro del Manual de Convivencia del Colegio San Alberto Magno, evitando invenciones o respuestas fuera de contexto.',
    icono: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </>
    ),
  },
  {
    titulo: 'Determinismo y Rigurosidad Normativa',
    descripcion:
      'Configurado con alta precisión determinista (baja temperatura) e instrucciones de sistema estrictas para identificar hechos, tipificación de faltas (Tipo I, II o III), artículos exactos y debido proceso.',
    icono: (
      <>
        <path d="M12 3v18"></path>
        <path d="M6 8l6-3 6 3"></path>
        <path d="M6 8l-3 7a3 3 0 0 0 6 0L6 8z"></path>
        <path d="M18 8l-3 7a3 3 0 0 0 6 0L18 8z"></path>
      </>
    ),
  },
  {
    titulo: 'Privacidad y Seguridad por Diseño',
    descripcion:
      'Opera mediante una capa intermedia en el servidor (/api/chat) que protege las credenciales institucionales y procesa las consultas de forma transitoria, sin almacenar historiales personales.',
    icono: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>,
  },
  {
    titulo: 'Arquitectura Moderna en React + Vite',
    descripcion:
      'Construido 100% con componentes funcionales en React (JSX), enrutamiento dinámico y una interfaz institucional pensada para la lectura cómoda en computadores y dispositivos móviles.',
    icono: (
      <>
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </>
    ),
  },
];

function TeamMemberCard({ integrante }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="irenic-team-card">
      <div className="irenic-team-avatar-wrap">
        {!imgError ? (
          <img
            src={integrante.foto}
            alt={`Fotografía de ${integrante.nombre}`}
            className="irenic-team-avatar-img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="irenic-team-avatar-fallback" aria-label={integrante.nombre}>
            {integrante.iniciales}
          </div>
        )}
      </div>

      <span className="irenic-team-role">{integrante.rol}</span>
      <h3 className="irenic-team-name">{integrante.nombre}</h3>
      <p className="irenic-team-bio">{integrante.aportes}</p>
      <div className="irenic-team-path-hint" title="Ruta preparada para colocar la foto del integrante">
        📷 {integrante.rutaArchivo}
      </div>
    </article>
  );
}

export default function Nosotros() {
  usePageMeta({
    title: 'Sobre IRENIC | Nosotros - Colegio San Alberto Magno (COLSAM)',
    description:
      'Conoce el propósito, misión, visión, equipo de desarrollo INMAT y enfoque tecnológico de IRENIC, proyecto de grado del Colegio San Alberto Magno.',
  });

  return (
    <div className="site-wrapper">
      {/* ========================================================================
          CABECERA INSTITUCIONAL
          ======================================================================== */}
      <header className="header-landing">
        <div className="header-inner">
          <Link to="/" className="brand-box">
            <img src={`${ASSETS}logo-simple.jpg`} alt="Logo IRENIC - Colegio San Alberto Magno" className="brand-logo-img" />
            <div className="brand-names">
              <div className="brand-title">
                IRENIC
                <span className="badge-tag">COLSAM</span>
              </div>
              <span className="brand-school">Colegio San Alberto Magno</span>
            </div>
          </Link>

          <div className="header-nav-group">
            <Link to="/" className="btn-cta-nav-outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Inicio</span>
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

      <main>
        {/* ========================================================================
            1. HERO / PRESENTACIÓN DEL PROYECTO
            ======================================================================== */}
        <section className="hero-presentation">
          <div className="hero-box">
            <div className="hero-content-col">
              <div className="hero-pill">
                <span className="status-dot-green"></span>
                <span>Proyecto de Grado • Equipo INMAT (Grado 11°) • COLSAM</span>
              </div>

              <h1 className="hero-headline">
                Sobre <span className="highlight-green">IRENIC</span>
              </h1>

              <p className="hero-subtext">
                Proyecto de grado enfocado en facilitar el acceso, comprensión y consulta ágil del{' '}
                <strong>Manual de Convivencia del Colegio San Alberto Magno (COLSAM)</strong> mediante un sistema
                estructurado de orientación estudiantil.
              </p>

              <div className="hero-cta-group">
                <Link to="/chat" className="btn-enter-chat">
                  <span>Consultar el Manual con IRENIC</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>

            <div className="hero-mascot-col">
              <img src={`${ASSETS}logo-principal.jpg`} alt="IRENIC - Colegio San Alberto Magno" className="hero-mascot-img" />
            </div>
          </div>
        </section>

        {/* ========================================================================
            2. MISIÓN Y VISIÓN DE LA PLATAFORMA
            ======================================================================== */}
        <section className="irenic-page-section">
          <div className="section-title-wrap">
            <span className="section-tag">Horizonte del Proyecto</span>
            <h2 className="section-main-title">Misión y Visión de la Plataforma</h2>
          </div>

          <div className="irenic-mv-grid">
            <article className="irenic-mv-card">
              <span className="irenic-mv-badge">Nuestra Misión</span>
              <h3>Misión</h3>
              <p>
                Empoderar a la comunidad estudiantil con una herramienta digital transparente que resuelva dudas
                normativas, promueva el debido proceso y la sana convivencia escolar.
              </p>
            </article>

            <article className="irenic-mv-card vision">
              <span className="irenic-mv-badge">Nuestra Visión</span>
              <h3>Visión</h3>
              <p>
                Convertirse en el estándar institucional de asistencia normativa escolar, garantizando respuestas
                objetivas y verificables basadas exclusivamente en el manual oficial.
              </p>
            </article>
          </div>
        </section>

        {/* ========================================================================
            3. EQUIPO DE DESARROLLO (INTEGRANTES DEL PROYECTO)
            ======================================================================== */}
        <section className="irenic-page-section">
          <div className="section-title-wrap">
            <span className="section-tag">Talento Estudiantil COLSAM</span>
            <h2 className="section-main-title">Equipo de Desarrollo (Integrantes del Proyecto)</h2>
          </div>

          <div className="irenic-team-grid">
            {INTEGRANTES_EQUIPO.map((integrante) => (
              <TeamMemberCard key={integrante.id} integrante={integrante} />
            ))}
          </div>

          <div className="irenic-advisor-banner">
            <div className="irenic-advisor-info">
              <h4>Docente Orientador y Asesor del Proyecto: Isaías Enrique Beleño Morato</h4>
              <p>
                Área de Tecnología e Informática • Grado 11° (Equipo INMAT) • Colegio San Alberto Magno, Barranquilla.
              </p>
            </div>
            <span className="badge-tag" style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}>
              Asesoría Académica y Metodológica
            </span>
          </div>
        </section>

        {/* ========================================================================
            4. ENFOQUE TECNOLÓGICO Y METODOLOGÍA
            ======================================================================== */}
        <section className="irenic-page-section" style={{ paddingBottom: '4rem' }}>
          <div className="section-title-wrap">
            <span className="section-tag">Ingeniería y Rigurosidad</span>
            <h2 className="section-main-title">Enfoque Tecnológico y Metodología</h2>
          </div>

          <div className="irenic-tech-grid">
            {PILARES_TECNOLOGICOS.map((pilar) => (
              <article key={pilar.titulo} className="irenic-tech-card">
                <div className="irenic-tech-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    {pilar.icono}
                  </svg>
                </div>
                <h3>{pilar.titulo}</h3>
                <p>{pilar.descripcion}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
