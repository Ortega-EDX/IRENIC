import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Chat from './pages/Chat.jsx';
import Footer from './components/Footer.jsx';

/**
 * Rutas principales de la aplicación:
 *   /     -> Landing (presentación)
 *   /chat -> Chat (ambiente del chatbot)
 */
export default function App() {
  return (
    <div className="app-container">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {/* Pie de página institucional */}
      <Footer />
    </div>
  );
}
