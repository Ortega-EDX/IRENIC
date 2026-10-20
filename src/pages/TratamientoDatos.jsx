import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';
import '../styles/pages.css';

export default function TratamientoDatos() {
  usePageMeta({
    title: 'Política de Tratamiento de Datos Personales | IRENIC - COLSAM',
    description:
      'Política de Tratamiento y Protección de Datos Personales del proyecto académico IRENIC - Colegio San Alberto Magno conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013.',
  });

  return (
    <div className="irenic-legal-wrapper">
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Link to="/" style={{ color: 'var(--color-verde-inst, #338C30)', textDecoration: 'none', fontWeight: 700 }}>
          ← Volver a la presentación
        </Link>
        <Link to="/chat" style={{ color: 'var(--color-verde-dark, #1A4718)', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
          Ir al Chat con IRENIC →
        </Link>
      </div>

      <article className="irenic-legal-card">
        <header className="irenic-legal-header">
          <h1 className="irenic-legal-title">
            Política de Tratamiento y Protección de Datos Personales – IRENIC
          </h1>
          <p className="irenic-legal-subtitle">
            Proyecto Académico IRENIC • Colegio San Alberto Magno (COLSAM) • Barranquilla, Colombia
          </p>
        </header>

        <div className="irenic-legal-meta-grid">
          <div className="irenic-legal-meta-box">
            <strong>Identificación</strong>
            Proyecto académico IRENIC – Colegio San Alberto Magno (COLSAM)
          </div>
          <div className="irenic-legal-meta-box">
            <strong>Marco Normativo</strong>
            Ley 1581 de 2012, Decreto 1377 de 2013 y Ley 1098 de 2006
          </div>
          <div className="irenic-legal-meta-box">
            <strong>Naturaleza del Procesamiento</strong>
            Anónimo, pedagógico y transitorio (sin historial personal)
          </div>
        </div>

        <section className="irenic-legal-body">
          <p>
            En cumplimiento de lo dispuesto en el artículo 15 de la Constitución Política de Colombia, la{' '}
            <strong>Ley Estatutaria 1581 de 2012</strong>, el <strong>Decreto Reglamentario 1377 de 2013</strong>{' '}
            (compilado en el Decreto Único 1074 de 2015) y la <strong>Ley 1098 de 2006</strong> (Código de la Infancia
            y la Adolescencia), se establece la presente Política de Tratamiento y Protección de Datos Personales para
            los usuarios de la plataforma educativa <strong>IRENIC</strong>.
          </p>

          <h3>1. Identificación del Responsable</h3>
          <ul>
            <li>
              <strong>Nombre del Proyecto:</strong> IRENIC – Motor Normativo y Asistente del Manual de Convivencia Escolar.
            </li>
            <li>
              <strong>Institución Educativa:</strong> Colegio San Alberto Magno (COLSAM), Barranquilla – Atlántico, Colombia.
            </li>
            <li>
              <strong>Equipo Responsable:</strong> Equipo de Desarrollo Estudiantil INMAT (Grado 11°), Área de Tecnología e Informática.
            </li>
            <li>
              <strong>Canal de Contacto Institucional:</strong>{' '}
              <a href="mailto:Irenic@colsam.edu.co" style={{ color: 'var(--color-verde-inst)', fontWeight: 700 }}>
                Irenic@colsam.edu.co
              </a>
            </li>
          </ul>

          <h3>2. Finalidad del Tratamiento de la Información</h3>
          <p>
            La plataforma IRENIC tiene una finalidad exclusivamente <strong>académica, pedagógica y orientadora</strong>.
            Su objetivo es facilitar a los estudiantes, padres de familia y docentes la consulta clara y estructurada
            del Manual de Convivencia del Colegio San Alberto Magno.
          </p>
          <div className="irenic-legal-highlight">
            <strong>Procesamiento Anónimo y Transitorio:</strong> Las consultas ingresadas en el chatbot se procesan
            únicamente de forma anónima y en memoria transitoria con el único propósito de generar la orientación
            normativa correspondiente. IRENIC <strong>no exige registro de cuentas, no recopila datos sensibles ni
            almacena historiales de conversación vinculados a identidades personales</strong>.
          </div>

          <h3>3. Privacidad y Protección Especial de Menores de Edad</h3>
          <p>
            Dado que la comunidad educativa está conformada principalmente por niños, niñas y adolescentes, IRENIC
            aplica de manera estricta el artículo 7 de la <strong>Ley 1581 de 2012</strong> y el artículo 12 del{' '}
            <strong>Decreto 1377 de 2013</strong>:
          </p>
          <ul>
            <li>
              <strong>Interés Superior del Menor:</strong> Toda interacción dentro de la plataforma respeta y asegura
              los derechos fundamentales de los niños, niñas y adolescentes consagrados en la Ley 1098 de 2006.
            </li>
            <li>
              <strong>No Recolección de Datos de Menores:</strong> Se recomienda a los estudiantes plantear sus dudas o
              casos hipotéticos sin incluir nombres propios, números de documento de identidad, direcciones ni teléfonos
              personales.
            </li>
            <li>
              <strong>Cero Perfilamiento Comercial:</strong> Ninguna consulta realizada en el sistema es utilizada para
              fines publicitarios, comerciales ni de perfilamiento conductual.
            </li>
          </ul>

          <h3>4. Derechos de los Titulares (Habeas Data)</h3>
          <p>
            De conformidad con el artículo 8 de la Ley 1581 de 2012, toda persona titular de datos personales cuenta con
            los siguientes derechos fundamentales frente a la institución:
          </p>
          <ul>
            <li>
              <strong>Conocer, actualizar y rectificar</strong> cualquier información personal en caso de que haya sido
              suministrada a través de los canales de contacto institucionales.
            </li>
            <li>
              <strong>Solicitar la supresión</strong> de información o revocar la autorización cuando considere que no
              se han respetado los principios, derechos y garantías constitucionales y legales.
            </li>
            <li>
              <strong>Presentar consultas o reclamos</strong> gratuitos ante el equipo coordinador del proyecto o las
              directivas del Colegio San Alberto Magno sobre el alcance de esta política.
            </li>
          </ul>

          <h3>5. Mecanismos de Consulta, Supresión y Ejercicio del Habeas Data</h3>
          <p>
            En cualquier momento el estudiante puede reiniciar su sesión activa haciendo clic en el botón{' '}
            <strong>«Nueva Consulta»</strong> en la cabecera del chat, lo cual elimina de inmediato los mensajes en
            pantalla. Para ejercer formalmente los derechos de consulta, actualización, rectificación o supresión
            previstos en la Ley 1581 de 2012, los titulares o sus representantes legales (padres de familia o
            acudientes) pueden escribir al correo institucional:{' '}
            <a href="mailto:Irenic@colsam.edu.co" style={{ color: 'var(--color-verde-inst)', fontWeight: 700 }}>
              Irenic@colsam.edu.co
            </a>
            .
          </p>

          <h3>6. Vigencia</h3>
          <p style={{ marginBottom: 0 }}>
            La presente Política de Tratamiento y Protección de Datos Personales rige a partir de su publicación en el
            portal institucional de IRENIC y permanece vigente durante el desarrollo y operación académica del proyecto
            en el Colegio San Alberto Magno.
          </p>
        </section>
      </article>
    </div>
  );
}
