import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import chatHandler from './api/chat.js';

/**
 * Plugin local que monta el endpoint serverless `/api/chat` dentro de
 * `npm run dev` y `npm run preview`, leyendo `GEMINI_API_KEY` desde `.env`
 * exclusivamente en el entorno Node del servidor (nunca se envía al navegador).
 */
function irenicApiPlugin() {
  const middleware = async (req, res, next) => {
    if (!req.url || !req.url.startsWith('/api/chat')) {
      return next();
    }
    try {
      await chatHandler(req, res);
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ code: 'SERVER_ERROR', error: 'Error interno en /api/chat.' }));
    }
  };

  return {
    name: 'irenic-local-api-proxy',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

// base './' permite desplegar en cualquier ruta; envPrefix por defecto ('VITE_')
// garantiza que GEMINI_API_KEY jamás se incluya en el bundle del cliente.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }

  return {
    base: './',
    plugins: [react(), irenicApiPlugin()],
  };
});
