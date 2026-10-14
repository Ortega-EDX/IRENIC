import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="irenic-footer">
      <div className="footer-container">
        <p className="footer-copy">
          &copy; {year} <strong>IRENIC</strong>. Todos los derechos reservados.
        </p>
        <nav className="footer-nav">
          <Link to="/tratamiento-datos" className="footer-link">
            Tratamiento de datos
          </Link>
          <span className="footer-separator">|</span>
          <Link to="/terminos-condiciones" className="footer-link">
            Términos y Condiciones
          </Link>
          <span className="footer-separator">|</span>
          <Link to="/faqs" className="footer-link">
            FAQS
          </Link>
          <span className="footer-separator">|</span>
          <Link to="/cookies" className="footer-link">
            Cookies
          </Link>
        </nav>
      </div>
    </footer>
  );
}   
