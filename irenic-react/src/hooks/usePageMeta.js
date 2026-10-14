import { useEffect } from 'react';

/**
 * Ajusta el título, la descripción y la clase del <body> por página,
 * igual que en los archivos HTML originales (index.html / chat.html).
 */
export default function usePageMeta({ title, description, bodyClass = '' }) {
  useEffect(() => {
    document.title = title;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description);

    const classes = bodyClass.split(' ').filter(Boolean);
    document.body.classList.add(...classes);
    return () => document.body.classList.remove(...classes);
  }, [title, description, bodyClass]);
}
