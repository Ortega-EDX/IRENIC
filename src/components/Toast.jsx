/**
 * Notificación Toast en verde institucional (antes creada con innerHTML en app.js)
 */
export default function Toast({ message, show }) {
  return (
    <div id="toast-green" className={`toast-notice-green${show ? ' show' : ''}`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>{message}</span>
    </div>
  );
}
