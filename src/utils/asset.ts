// Prefixes a /public path with the site's base (needed when deployed under /Portfolio-Website/ on GitHub Pages)
export const asset = (p: string) => import.meta.env.BASE_URL.replace(/\/$/, '') + '/' + p.replace(/^\//, '');
