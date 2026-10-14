import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' permite desplegar el build en cualquier subcarpeta (GitHub Pages, etc.)
export default defineConfig({
  base: './',
  plugins: [react()],
});
