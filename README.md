# Green & Blue Alliance — sitio web

Sitio estático e informativo de Green & Blue Alliance, construido con [Astro](https://astro.build)
y [Tailwind CSS](https://tailwindcss.com), pensado para alojarse gratis en GitHub Pages.

No hay servidor, ni base de datos, ni formularios: el resultado del build es HTML, CSS e
imágenes. La única línea de JavaScript que se envía al navegador es la del menú móvil.

---

## Poner en marcha el proyecto

```bash
npm install
npm run dev      # servidor de desarrollo en http://localhost:4321
npm run build    # genera el sitio en dist/
npm run preview  # sirve dist/ para revisarlo antes de publicar
```

## Dónde se edita cada cosa

| Quiero cambiar… | Fichero |
|---|---|
| Correo, redes sociales, datos registrales, menú | [`src/config.ts`](src/config.ts) |
| Textos de una página | El `.astro` correspondiente en [`src/pages/`](src/pages) |
| Una biografía del equipo | El `.md` de esa persona en [`src/content/equipo/`](src/content/equipo) |
| Colores, tipografías, estilos base | [`src/styles/global.css`](src/styles/global.css) |
| Dominio del sitio | La constante `SITE` de [`astro.config.mjs`](astro.config.mjs) |

### Añadir o quitar a alguien del equipo

Crea o borra un fichero en `src/content/equipo/`. El nombre del fichero se convierte en la
URL (`isidro-molina.md` → `/equipo/isidro-molina/`). El frontmatter obligatorio es:

```yaml
---
nombre: Nombre Apellidos
cargo: Su cargo
orden: 9                    # ordena las fichas; 1-4 salen en "Junta directiva"
titular: Una frase de presentación.
foto: ../../assets/equipo/nombre.jpg          # versión grande
fotoFicha: ../../assets/equipo/nombre-card.jpg # recorte vertical 4:5 para las fichas
alt: Descripción de la foto para lectores de pantalla
pilares:                    # exactamente tres
  - titulo: Primero
    texto: Explicación.
  - titulo: Segundo
    texto: Explicación.
  - titulo: Tercero
    texto: Explicación.
---

## Un apartado

El cuerpo del fichero es la biografía completa, en Markdown.
```

Si falta algún campo o los pilares no son tres, el build falla con un mensaje claro.

## Assets de marca

El logotipo, los favicons y la imagen social se generan a partir del logotipo original con:

```bash
node scripts/brand-assets.mjs src/assets/logo/_origen.jpg
```

El script quita el fondo blanco del original, recorta el emblema, produce el wordmark en
azul y en blanco, los favicons y `public/og.jpg`. Solo hay que volver a ejecutarlo si
cambia el logotipo.

## Publicar

El flujo [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) construye y
publica el sitio en cada `push` a `main`. Para activarlo, en el repositorio de GitHub:
**Settings → Pages → Source → GitHub Actions**.

### Dónde vive el sitio

Ahora mismo se publica en un subdirectorio:
<https://serwii01.github.io/greenandbluealliance/>. Eso obliga a que todas las rutas
internas lleven ese prefijo, y las dos constantes que lo definen están **solo** en
[`astro.config.mjs`](astro.config.mjs):

```js
const SITE = process.env.SITE_URL  ?? 'https://serwii01.github.io';
const BASE = process.env.BASE_PATH ?? '/greenandbluealliance/';
```

El workflow no las sobrescribe, a propósito: así cualquier construcción produce las mismas
rutas y no hay dos sitios que puedan desincronizarse. Un `npm run build` a secas ya genera
la salida que se publica.

Todo lo que apunta a una ruta interna pasa por el ayudante `url()` de
[`src/lib/url.ts`](src/lib/url.ts) o por `import.meta.env.BASE_URL`, y `robots.txt` se
genera en el build desde [`src/pages/robots.txt.ts`](src/pages/robots.txt.ts).

> **Ojo al relanzar un despliegue.** «Re-run jobs» sobre una ejecución antigua reconstruye
> **el commit de esa ejecución**, no el último. Si esa versión tenía otra configuración,
> pisará el despliegue bueno. Para volver a publicar el estado actual usa
> **Actions → Desplegar en GitHub Pages → Run workflow** sobre `main`.

### Pasar a dominio propio

1. En [`astro.config.mjs`](astro.config.mjs), pon `SITE` al dominio nuevo y `BASE` a `'/'`.
2. Crea `public/CNAME` con el dominio, sin `https://` ni barra final.
3. Apunta el DNS a GitHub Pages y activa **Enforce HTTPS** en Settings → Pages.

## Pendiente de completar

Estos datos aparecen como marcadores en el sitio hasta que se rellenen en `src/config.ts`:

- Dirección de correo real (ahora `info@greenandbluealliance.org`).
- Perfiles de redes sociales (están a `null` y no se muestran).
- CIF, número de registro y domicilio social de la asociación: son **obligatorios** en el
  aviso legal. Mientras falten, la página muestra un recuadro recordándolo.
