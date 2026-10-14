import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Chat from './pages/Chat.jsx';

/**
 * Rutas (equivalentes a las páginas HTML originales):
 *   /      -> index.html (presentación)
 *   /chat  -> chat.html  (ambiente exclusivo del chatbot)
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
