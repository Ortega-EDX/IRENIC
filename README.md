# IRENIC - Asistente de Convivencia Escolar
## Colegio San Alberto Magno (COLSAM)

Portal web institucional moderno, limpio y amigable en **blanco y verde**, desarrollado con **React (Vite)**, para que los estudiantes del **Colegio San Alberto Magno (COLSAM)** conozcan e interactúen con **IRENIC**, el chatbot oficial que orienta sobre el **Manual de Convivencia Escolar**, derechos, deberes, clasificación de faltas (Ley 1620 de 2013) y rutas de atención.
🔗 **Sitio publicado:** [https://ortega-edx.github.io/IRENIC/](https://irenic-nu.vercel.app/#/nosotros)
---
## Estructura del Portal
1. **Página Principal de Presentación (`/`)**:
   - Diseño institucional limpio en blanco y verde esmeralda.
   - Presentación clara de Irenic: quién es, qué hace y cómo ayuda a los estudiantes.
   - Destacado de capacidades: normativas al instante, lectura de archivos/documentos escolares y resolución pacífica de conflictos.
   - Gran botón de acceso: **"Entrar al Espacio de Chat con Irenic"**.
2. **Ambiente Exclusivo y Dedicado para el Chatbot (`/chat`)**:
   - Espacio diseñado 100% para la conversación con Irenic.
   - **Chat integrado en la página** (Botpress Webchat): no es una burbuja flotante, ocupa el área principal.
   - **Subida y lectura de archivos**: botón de adjuntos (clip) para subir PDFs, excusas médicas o fotos de circulares.
   - **Atajos rápidos**: botones superiores para preguntas frecuentes sobre faltas, uniformes, acoso y excusas.
   - Botón **"Nueva Consulta"** para reiniciar la conversación y enlace **"Volver a la Presentación"**.
---
## Migración a React
El proyecto pasó de páginas HTML estáticas a una aplicación React, **sin cambiar el diseño ni el formato**:
| Antes (HTML)         | Ahora (React)                              |
|----------------------|--------------------------------------------|
| `index.html`         | `src/pages/Landing.jsx`                    |
| `chat.html`          | `src/pages/Chat.jsx`                       |
| `js/app.js`          | Lógica dentro de `Chat.jsx` (hooks y estado) |
| `css/style.css`      | `src/styles/style.css` (sin cambios)       |
| `assets/`            | `public/assets/`                           |
- La navegación usa `react-router-dom` con rutas `#/` y `#/chat`.
- El único HTML es `index.html`, punto de montaje de Vite (`<div id="root">`); toda la interfaz está escrita en componentes `.jsx`.
---
## 📁 Archivos del Proyecto
```
IRENIC/
├── index.html                  # Punto de montaje de Vite (<div id="root">)
├── package.json                # Dependencias y scripts
├── vite.config.js              # Configuración de Vite
├── .github/workflows/
│   └── deploy.yml              # Publicación automática en GitHub Pages
├── public/
│   └── assets/                 # Logo e ilustraciones
└── src/
    ├── main.jsx                # Entrada de React + HashRouter
    ├── App.jsx                 # Rutas "/" y "/chat"
    ├── pages/
    │   ├── Landing.jsx         # Página de presentación
    │   └── Chat.jsx            # Chat con Irenic (Botpress, chips, toast)
    ├── components/
    │   └── Toast.jsx           # Notificación verde
    ├── hooks/
    │   └── usePageMeta.js      # Título, descripción y clase del <body>
    └── styles/
        └── style.css           # Estilos en blanco y verde
```
---
## Cómo Probar el Proyecto
Requiere [Node.js](https://nodejs.org) 18 o superior. En la terminal, dentro de la carpeta del proyecto:
```bash
npm install        # instala las dependencias (solo la primera vez)
npm run dev        # servidor de desarrollo en http://localhost:5173
npm run build      # genera la carpeta dist/ para publicar
npm run preview    # prueba local del build
```
> En PowerShell, si `npm` da error de scripts deshabilitados, usa `npm.cmd` en su lugar (por ejemplo `npm.cmd run dev`).
---
## Publicación
Cada `push` a la rama `react-solo` ejecuta el flujo de **GitHub Actions** (`deploy.yml`), que compila el proyecto y lo publica automáticamente en **GitHub Pages**.
---
## Equipo
**Colegio San Alberto Magno (COLSAM) • INMAT** — Área: Tecnología e Informática | Grado: 11°
- Docente orientador: Isaías Enrique Beleño Morato
- Equipo de desarrollo estudiantil: Ignacio Geovanny Almeida Peñarrieta, Jeider David Monsalvo Barrios, Juan Sebastián Ortega Salcedo y Alejandro David Ricaurte Colmenares
