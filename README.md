# Portfolio — Carlos Doncel (Astro + Tailwind)

## Uso
```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera /dist
```

## Imágenes y videos
Copia tu carpeta `imagenes/` dentro de `public/imagenes/` (mismos nombres que antes:
`alas-portada.jpg`, `ojos-trailer.mp4`, etc.). El logo ya está en `public/logo.png`.

## Dónde editar
- `src/data/projects.ts` — todo el contenido de los 4 proyectos (ES/EN)
- `src/components/*.astro` — una sección por archivo
- `src/styles/global.css` — colores, fuentes y animaciones (bloque `@theme`)

## Deploy
Sube `dist/` a GitHub Pages, o conecta el repo a Vercel/Netlify (comando `npm run build`, carpeta `dist`).
