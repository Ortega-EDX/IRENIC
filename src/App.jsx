import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Chat from './pages/Chat.jsx';
import TerminosCondiciones from './pages/TerminosCondiciones.jsx';
import Faqs from './pages/Faqs.jsx';
import Cookies from './pages/Cookies.jsx';
import Footer from './components/Footer.jsx';

// Aquí está la página de Nosotros integrada directo en el App.jsx
const About = () => (
  <div style={{ padding: '60px', textAlign: 'center', lineHeight: '1.6' }}>
    <h1>Sobre IRENIC</h1>
    <p>Proyecto desarrollado por el <strong>Equipo INMAT</strong> (Grado 11):</p>
    <p>Ignacio Almeida, Jeider Monsalvo, Juan Ortega y Alejandro Ricaurte.</p>
    <p><strong>Asesor:</strong> Isaías Beleño Morato.</p>
    <p>Una solución pedagógica basada en la <strong>Ley 1620 de 2013</strong>.</p>
  </div>
);

export default function App() {
  return (
    <div className="app-container">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
