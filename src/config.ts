/**
 * Datos de la organizacion en un unico sitio.
 * Los marcados como PENDIENTE deben confirmarse antes de publicar.
 */
export const site = {
  nombre: 'Green & Blue Alliance',
  nombreCorto: 'Green & Blue Alliance',
  claim: 'For Planet Regeneration',
  lema: 'No es mi basura, pero es mi planeta',
  descripcion:
    'Organización de acción directa ambiental con base en Sevilla. Regeneramos ecosistemas terrestres y marinos con excelencia técnica, rigor científico y medición verificable.',
  ubicacion: 'Sevilla, Andalucía, España',
} as const;

export const contacto = {
  // PENDIENTE: confirmar la dirección real de correo.
  email: 'info@greenandbluealliance.org',
  // PENDIENTE: teléfono público, si se quiere mostrar.
  telefono: null as string | null,
};

/** PENDIENTE: sustituir por los perfiles reales. Los que queden a null no se muestran. */
export const redes: { nombre: string; url: string | null; icono: 'instagram' | 'linkedin' | 'x' | 'youtube' | 'facebook' }[] = [
  { nombre: 'Instagram', url: null, icono: 'instagram' },
  { nombre: 'LinkedIn', url: null, icono: 'linkedin' },
  { nombre: 'X', url: null, icono: 'x' },
  { nombre: 'YouTube', url: null, icono: 'youtube' },
  { nombre: 'Facebook', url: null, icono: 'facebook' },
];

/** PENDIENTE: datos registrales obligatorios en el aviso legal. */
export const entidad = {
  denominacion: 'Green & Blue Alliance',
  cif: null as string | null,
  registro: null as string | null,
  domicilio: null as string | null,
};

export const nav = [
  { titulo: 'Inicio', href: '/' },
  { titulo: 'Qué hacemos', href: '/que-hacemos/' },
  { titulo: 'Metodología', href: '/metodologia/' },
  { titulo: 'Equipo', href: '/equipo/' },
  { titulo: 'Colabora', href: '/colabora/' },
] as const;
