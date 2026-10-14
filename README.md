# IRENIC - Asistente de Convivencia Escolar (React)
### Colegio San Alberto Magno (COLSAM)

Versión del portal institucional migrada de HTML estático a **React (Vite)**. El diseño, estilos (`style.css`), textos, imágenes e integración con Botpress son idénticos a la versión HTML.

## Estructura

```
IRENIC/
├── index.html                # Punto de montaje de Vite (<div id="root">)
├── vite.config.js
├── package.json
├── public/assets/            # Logo e ilustraciones
└── src/
    ├── main.jsx              # Entrada de React + HashRouter
    ├── App.jsx               # Rutas: "/" (presentación) y "/chat"
    ├── pages/
    │   ├── Landing.jsx       # Antes index.html
    │   └── Chat.jsx          # Antes chat.html + js/app.js (Botpress, chips, toast)
    ├── components/Toast.jsx
    ├── hooks/usePageMeta.js  # Título, descripción y clase del <body> por página
    └── styles/style.css      # Mismo CSS original, sin cambios
```

## Cómo ejecutarlo

Requiere [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install
npm run dev       # servidor de desarrollo
npm run build     # genera la carpeta dist/ para publicar
npm run preview   # prueba local del build
```

Las rutas usan `HashRouter` (`#/` y `#/chat`), por lo que el `dist/` funciona en cualquier hosting estático (GitHub Pages, etc.) sin configuración extra.

