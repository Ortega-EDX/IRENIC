# IRENIC - Asistente de Convivencia Escolar
### Colegio San Alberto Magno (COLSAM)

Portal web institucional moderno, limpio y amigable en **blanco y verde** diseñado para que los estudiantes del **Colegio San Alberto Magno (COLSAM)** conozcan e interactúen con **IRENIC**, el chatbot oficial enfocado en orientar sobre el **Manual de Convivencia Escolar**, derechos, deberes, clasificación de faltas (Ley 1620 de 2013) y rutas de atención.

---

## 🌟 Estructura del Portal

1. **Página Principal de Presentación (`index.html`)**:
   - Diseño institucional limpio en blanco y verde esmeralda.
   - Presentación clara de Irenic: quién es, qué hace y cómo ayuda a los estudiantes.
   - Destacado de capacidades: normativas al instante, lectura de archivos/documentos escolares y resolución pacífica de conflictos.
   - Gran botón de acceso: **"Entrar al Espacio de Chat con Irenic"**.

2. **Ambiente Exclusivo y Dedicado para el Chatbot (`chat.html`)**:
   - Espacio diseñado 100% para la conversación con Irenic.
   - **Chat Integrado en la Página**: No es una burbuja flotante pequeña en la esquina. El chat ocupa el área principal del espacio de trabajo.
   - **Barra de Entrada y Respuestas en la Página**: Escribe directamente y recibe respuestas fluidas en la interfaz.
   - **Subida y Lectura de Archivos**: Botón de adjuntos (clip 📎) activo en la barra de mensajes para que los estudiantes puedan subir documentos (PDFs, excusas médicas o fotos de circulares) y que Irenic los lea e interprete.
   - **Atajos Rápidos**: Botones superiores para preguntas frecuentes sobre faltas, uniformes, bullying y excusas con un solo clic.
   - Enlace directo *"← Volver a la Presentación"*.

---

## 📁 Archivos del Proyecto

```
IRENIC/
├── index.html         # Página principal de presentación en blanco y verde
├── chat.html          # Ambiente exclusivo de chat integrado con subida de archivos
├── css/
│   └── style.css      # Estilos modernos en blanco y verde, sin burbuja flotante
├── js/
│   └── app.js         # Hook para modo embedded de Botpress, atajos y controlador
└── README.md          # Documentación del sistema
```

---

## 🚀 Cómo Probar el Proyecto

Abre directamente `index.html` o `chat.html` en cualquier navegador web moderno (Google Chrome, Edge, Safari, Firefox).
O con cualquier servidor local:
```bash
python -m http.server 8080
```
Y visita `http://localhost:8080`.
