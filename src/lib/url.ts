const base = import.meta.env.BASE_URL;

/** Antepone la ruta base del sitio a un enlace interno. */
export function url(path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

/** True si `href` corresponde a la pagina actual (o a una de sus hijas). */
export function isActive(current: string, href: string): boolean {
  const target = url(href);
  const now = current.endsWith('/') ? current : `${current}/`;
  if (target === url('/')) return now === url('/');
  return now === target || now.startsWith(target);
}
