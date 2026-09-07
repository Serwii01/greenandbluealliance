// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Dominio definitivo del sitio. Cambiar aqui cuando se confirme el TLD.
const SITE = process.env.SITE_URL ?? 'https://greenandbluealliance.org';

// Ruta base. En un dominio propio es '/'. Si se publica en
// usuario.github.io/greenandblue, basta con BASE_PATH=/greenandblue/ al construir.
const BASE = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
