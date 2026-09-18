import { spawnSync } from 'child_process';
import fs from 'fs';

function scrapeCategory(url) {
  const res = spawnSync('curl.exe', [
    '-s', '-L',
    '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    url
  ], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });

  const html = res.stdout || '';
  const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[0].slice(0, 100));
  console.log('Scripts:', scripts.slice(0, 10));
  return [];
}

console.log('--- CABLES DE MICROPHONES ---');
const cables = scrapeCategory('https://www.thomann.fr/cables_de_microphones.html');
console.log('Cables found:', cables.length);
console.log(cables.slice(0, 30));

console.log('\n--- BRAS MICROS / SUPPORTS TABLE ---');
const bras = scrapeCategory('https://www.thomann.fr/pieds_de_table_et_accessoires.html');
console.log('Bras found:', bras.length);
console.log(bras.slice(0, 30));

console.log('\n--- TRAITEMENT ACOUSTIQUE / ABSORBEURS ---');
const acoustique = scrapeCategory('https://www.thomann.fr/absorbeurs_standards.html');
console.log('Absorbeurs found:', acoustique.length);
console.log(acoustique.slice(0, 30));

const ecrans = scrapeCategory('https://www.thomann.fr/ecrans_acoustiques.html');
console.log('Ecrans found:', ecrans.length);
console.log(ecrans.slice(0, 30));
