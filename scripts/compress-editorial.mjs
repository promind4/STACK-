// Script de compression pour les images editorial.
// Convertit les PNG lourds en WebP optimisés (1600px max, qualité 75).
// Usage : node scripts/compress-editorial.mjs
import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('public/images/editorial');
const OUT_DIR = SRC_DIR; // overwrite in place (.webp variants)

const MAX_WIDTH = 1600;
const QUALITY   = 72;

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.error('Dossier introuvable:', SRC_DIR);
    process.exit(1);
  }
  const files = await readdir(SRC_DIR);
  const pngs  = files.filter(f => /\.png$/i.test(f));

  let totalBefore = 0;
  let totalAfter  = 0;

  for (const file of pngs) {
    const srcPath = path.join(SRC_DIR, file);
    const outName = file.replace(/\.png$/i, '.webp');
    const outPath = path.join(OUT_DIR, outName);

    const before = (await stat(srcPath)).size;

    await sharp(srcPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(outPath);

    const after = (await stat(outPath)).size;
    totalBefore += before;
    totalAfter  += after;

    const ratio = ((1 - after / before) * 100).toFixed(0);
    console.log(`${file.padEnd(28)} ${(before/1024).toFixed(0).padStart(5)} KB → ${outName.padEnd(28)} ${(after/1024).toFixed(0).padStart(5)} KB  (-${ratio}%)`);
  }

  console.log(`\nTOTAL  ${(totalBefore/1024/1024).toFixed(2)} MB → ${(totalAfter/1024/1024).toFixed(2)} MB  (-${((1 - totalAfter/totalBefore)*100).toFixed(0)}%)`);
}

main().catch(e => { console.error(e); process.exit(1); });
