import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Chat from './pages/Chat.jsx';
import TerminosCondiciones from './pages/TerminosCondiciones.jsx';
import Faqs from './pages/Faqs.jsx';
import Cookies from './pages/Cookies.jsx';
import Footer from './components/Footer.jsx';

/**
 * Rutas principales de la aplicación IRENIC:
 *   /                     -> Landing (presentación)
 *   /chat                 -> Chat (ambiente del chatbot)
 *   /terminos-condiciones -> Términos y Condiciones de Uso
 *   /faqs                 -> Preguntas Frecuentes
 *   /cookies              -> Política de Cookies
 */
export default function App() {
  return (
    <div className="app-container">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Pie de página institucional */}
      <Footer />
    </div>
  );
}
