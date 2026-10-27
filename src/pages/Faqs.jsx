import { useState } from 'react';
import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';

export default function Faqs() {
  usePageMeta({
    title: 'Preguntas Frecuentes (FAQS) | IRENIC - COLSAM',
    description:
      'Preguntas frecuentes sobre el funcionamiento de IRENIC, el Asistente Virtual del Manual de Convivencia del Colegio San Alberto Magno.',
  });

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqsList = [
    {
      question: '1. ¿Qué es el proyecto IRENIC?',
      answer:
        'Es el asistente virtual de convivencia escolar del Colegio San Alberto Magno (COLSAM), diseñado mediante un chatbot interactivo para brindar orientación rápida y clara sobre el Manual de Convivencia, deberes, derechos y rutas de atención.'
    },
    {
      question: '2. ¿Por qué es importante contar con IRENIC en la comunidad educativa?',
      answer:
        'Porque facilita el conocimiento inmediato de las normas escolares y la Ley 1620 de 2013, fomentando la resolución pacífica de conflictos y la prevención del acoso escolar de forma accesible para todos.'
    },
    {
      question: '3. ¿A quiénes está dirigido IRENIC?',
      answer:
        'Está dirigido a los estudiantes y comunidad educativa del Colegio San Alberto Magno (COLSAM).'
    },
    {
      question: '4. ¿Qué tipo de consultas e interacciones permite el chatbot?',
      answer:
        'Permite consultar la clasificación de faltas (Tipo I, II y III), uso correcto de uniformes, procedimientos de excusas médicas, derechos estudiantiles y el debido proceso aplicable a cada caso.'
    },
    {
      question: '5. ¿Cuánto tiempo toma recibir una respuesta de IRENIC?',
      answer:
        'Las respuestas son instantáneas y en tiempo real. El chatbot está configurado para responder en segundos las 24 horas del día.'
    },
    {
      question: '6. ¿Con qué frecuencia se puede utilizar el chatbot?',
      answer:
        'Está disponible cualquier día de la semana y a cualquier hora para consultas educativas legítimas, contando con un sistema automático de protección anti-spam y moderación para asegurar que el servicio permanezca fluido para toda la comunidad escolar.'
    },
    {
      question: '7. ¿Se necesita un programa o equipo especial para usar IRENIC?',
      answer:
        'No. Solo se requiere conexión a internet y un navegador web desde cualquier dispositivo (computadora, teléfono inteligente o tablet) sin necesidad de descargar aplicaciones.'
    },
    {
      question: '8. ¿Quiénes desarrollaron e implementan el proyecto IRENIC?',
      answer:
        'Fue concebido y desarrollado por el equipo de desarrollo estudiantil INMAT del Grado 11° en el área de Tecnología e Informática del Colegio San Alberto Magno (COLSAM), bajo orientación docente.'
    },
    {
      question: '9. ¿Cómo ayuda IRENIC a dar seguimiento a las situaciones de convivencia?',
      answer:
        'Orienta paso a paso sobre el debido proceso instituido en el Manual de Convivencia, aclarando a qué instancia (docente de grupo, coordinación o Comité Escolar de Convivencia) se debe acudir según cada caso.'
    },
    {
      question: '10. ¿IRENIC puede utilizarse en casa o solo en el colegio?',
      answer:
        'Está disponible en línea para utilizarse tanto dentro del colegio durante la jornada escolar como desde casa con los padres de familia y acudientes.'
    }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1.5rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/" style={{ color: 'var(--color-verde-inst, #10b981)', textDecoration: 'none', fontWeight: 600 }}>
          ← Volver a la presentación
        </Link>
      </div>

      <header style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ color: '#0f4c3a', fontSize: '2rem', marginBottom: '0.5rem' }}>
          Preguntas Frecuentes (FAQS) – IRENIC
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Respuestas rápidas sobre el Asistente Virtual de Convivencia Escolar | COLSAM
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {faqsList.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              style={{
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
              }}
            >
              <button
                onClick={() => toggleFaq(index)}
                style={{
                  width: '100%',
                  padding: '1.1rem 1.2rem',
                  backgroundColor: isOpen ? '#f0fdf4' : '#ffffff',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#0f4c3a',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <span>{faq.question}</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-verde-inst, #10b981)' }}>
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen && (
                <div style={{ padding: '1rem 1.2rem', borderTop: '1px solid #e2e8f0', color: '#334155', lineHeight: '1.6' }}>
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <Link
          to="/chat"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--color-verde-inst, #10b981)',
            color: '#ffffff',
            padding: '0.8rem 1.8rem',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '1rem',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
          }}
        >
          Probar el Chat con Irenic ahora →
        </Link>
      </div>
    </div>
  );
}
