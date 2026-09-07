import type { APIRoute } from 'astro';

/**
 * robots.txt generado en el build, para que la URL del sitemap siempre
 * apunte al dominio y a la ruta base con los que se ha construido el sitio.
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(
    `${import.meta.env.BASE_URL}/sitemap-index.xml`.replace(/\/{2,}/g, '/'),
    site,
  ).href;

  return new Response(
    ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemap}`, ''].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
