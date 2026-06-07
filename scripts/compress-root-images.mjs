// Compresse les PNG à la racine de public/images/
import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { statSync } from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('public/images');
const MAX_WIDTH = 1600;
const QUALITY   = 75;

async function main() {
  const files = await readdir(SRC_DIR);
  // Only top-level PNG files, skip subdirectories
  const pngs = files.filter(f => {
    if (!/\.png$/i.test(f)) return false;
    return statSync(path.join(SRC_DIR, f)).isFile();
  });

  let totalBefore = 0;
  let totalAfter  = 0;

  for (const file of pngs) {
    const srcPath = path.join(SRC_DIR, file);
    const outName = file.replace(/\.png$/i, '.webp');
    const outPath = path.join(SRC_DIR, outName);

    const before = (await stat(srcPath)).size;

    await sharp(srcPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(outPath);

    const after = (await stat(outPath)).size;
    totalBefore += before;
    totalAfter  += after;

    // Remove original PNG
    await unlink(srcPath);

    const ratio = ((1 - after / before) * 100).toFixed(0);
    console.log(`${file.padEnd(28)} ${(before/1024).toFixed(0).padStart(5)} KB → ${(after/1024).toFixed(0).padStart(5)} KB  (-${ratio}%)`);
  }

  console.log(`\nTOTAL  ${(totalBefore/1024/1024).toFixed(2)} MB → ${(totalAfter/1024/1024).toFixed(2)} MB  (-${((1 - totalAfter/totalBefore)*100).toFixed(0)}%)`);
}

main().catch(e => { console.error(e); process.exit(1); });
