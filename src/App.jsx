import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Chat from './pages/Chat.jsx';
import TratamientoDatos from './pages/TratamientoDatos.jsx';
import TerminosCondiciones from './pages/TerminosCondiciones.jsx';
import Faqs from './pages/Faqs.jsx';
import Cookies from './pages/Cookies.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app-container">
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/tratamiento-datos" element={<TratamientoDatos />} />
          <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
