import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages: https://carlosdoncel.github.io/Portfolio-Website/
// If you later use a custom domain or rename the repo to carlosdoncel.github.io, remove `base`.
export default defineConfig({
  site: 'https://carlosdoncel.github.io',
  base: '/Portfolio-Website',
  vite: { plugins: [tailwindcss()] },
});
