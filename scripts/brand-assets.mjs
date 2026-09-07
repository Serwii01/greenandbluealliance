/**
 * Genera los assets de marca a partir del logotipo original incrustado en
 * docs/Green & Blue Alliance - Corporate Presentation.pptx.
 *
 *   node scripts/brand-assets.mjs <ruta-al-logo.jpg>
 *
 * Solo hay que volver a ejecutarlo si cambia el logotipo.
 */
import sharp from 'sharp';

const ORIGEN = process.argv[2] ?? 'src/assets/logo/_origen.jpg';
const CUT = 244; // por encima de este minimo el pixel se considera fondo blanco

/** Convierte un logotipo sobre fondo blanco en RGBA con fondo transparente. */
async function aTransparente(ruta) {
  const { data, info } = await sharp(ruta).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = info.width * info.height;
  const out = Buffer.alloc(px * 4);
  for (let i = 0; i < px; i++) {
    const o = i * 4;
    const [r, g, b] = [data[o], data[o + 1], data[o + 2]];
    const m = Math.min(r, g, b);
    const a = m >= CUT ? 0 : Math.round(((CUT - m) * 255) / CUT);
    if (a === 0) continue;
    const af = a / 255;
    const unmix = (c) => Math.max(0, Math.min(255, Math.round((c - 255 * (1 - af)) / af)));
    out[o] = unmix(r); out[o + 1] = unmix(g); out[o + 2] = unmix(b); out[o + 3] = a;
  }
  return { buffer: await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer(), info };
}

const { buffer: transparente, info } = await aTransparente(ORIGEN);
const corteMarca = Math.round(info.height * 0.63); // el emblema ocupa el 63% superior

// Logotipo completo y emblema suelto
await sharp(transparente).trim({ threshold: 1 }).png({ compressionLevel: 9 })
  .toFile('src/assets/logo/logo-completo.png');

const marca = await sharp(transparente)
  .extract({ left: 0, top: 0, width: info.width, height: corteMarca })
  .png().toBuffer();
await sharp(marca).trim({ threshold: 1 }).png({ compressionLevel: 9 })
  .toFile('src/assets/logo/logo-marca.png');

// Wordmark en blanco, para fondos oscuros: se usa el trazado como mascara
const wordmarkCrudo = await sharp(transparente)
  .extract({ left: 0, top: corteMarca, width: info.width, height: info.height - corteMarca })
  .png().toBuffer();
const wordmark = await sharp(wordmarkCrudo).trim({ threshold: 1 }).png().toBuffer();
await sharp(wordmark).png({ compressionLevel: 9 }).toFile('src/assets/logo/wordmark-color.png');
const wm = await sharp(wordmark).metadata();
await sharp({ create: { width: wm.width, height: wm.height, channels: 4, background: '#ffffff' } })
  .composite([{ input: wordmark, blend: 'dest-in' }])
  .png({ compressionLevel: 9 })
  .toFile('src/assets/logo/wordmark-blanco.png');

// Favicons
for (const [size, nombre] of [[32, 'favicon-32.png'], [180, 'apple-touch-icon.png'], [512, 'favicon-512.png']]) {
  await sharp('src/assets/logo/logo-marca.png')
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png().toFile(`public/${nombre}`);
}

// Imagen social (1200x630)
const fondo = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="a" cx="80%" cy="32%" r="60%">
      <stop offset="0%" stop-color="#0080b0" stop-opacity="0.9"/><stop offset="100%" stop-color="#0080b0" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="b" cx="92%" cy="88%" r="50%">
      <stop offset="0%" stop-color="#58b018" stop-opacity="0.6"/><stop offset="100%" stop-color="#58b018" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="c" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%" stop-color="#48a020"/><stop offset="55%" stop-color="#0080b0"/><stop offset="100%" stop-color="#004078"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#022038"/>
  <rect width="1200" height="630" fill="url(#a)"/>
  <rect width="1200" height="630" fill="url(#b)"/>
  <rect y="616" width="1200" height="14" fill="url(#c)"/>
</svg>`);
await sharp(fondo)
  .composite([
    { input: await sharp('src/assets/logo/wordmark-blanco.png').resize({ width: 560 }).toBuffer(), left: 80, top: 240 },
    { input: await sharp('src/assets/logo/logo-marca.png').resize(400).toBuffer(), left: 720, top: 115 },
  ])
  .jpeg({ quality: 88 })
  .toFile('public/og.jpg');

console.log('Assets de marca regenerados.');
