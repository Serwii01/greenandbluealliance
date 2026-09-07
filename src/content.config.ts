import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const equipo = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/equipo' }),
  schema: ({ image }) =>
    z.object({
      nombre: z.string(),
      cargo: z.string(),
      orden: z.number(),
      titular: z.string(),
      foto: image(),
      fotoFicha: image(),
      alt: z.string(),
      pilaresTitulo: z.string().default('Mi filosofia de vida y de trabajo se resume en tres pilares esenciales'),
      pilares: z.array(z.object({ titulo: z.string(), texto: z.string() })).length(3),
    }),
});

export const collections = { equipo };
