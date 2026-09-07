// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// DONDE VIVE EL SITIO. Estas dos constantes son la unica fuente de verdad:
// el flujo de despliegue no las sobrescribe, asi que cualquier construccion
// —local o en CI, de este commit o de otro— produce siempre las mismas rutas.
//
// Al pasar a dominio propio: SITE = 'https://el-dominio.tld' y BASE = '/'.
const SITE = process.env.SITE_URL ?? 'https://serwii01.github.io';
const BASE = process.env.BASE_PATH ?? '/greenandbluealliance/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
