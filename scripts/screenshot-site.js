/**
 * Script de capture d'écran automatique — fluxlab.fr
 * Utilise: node scripts/screenshot-site.js
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const DEST = path.join(__dirname, '..', 'DESIGN-SCREENS');
if (!fs.existsSync(DEST)) fs.mkdirSync(DEST, { recursive: true });

const PAGES = [
  { name: '01_homepage_hero',          url: 'https://www.fluxlab.fr',                                    scrollY: 0 },
  { name: '02_homepage_produits',       url: 'https://www.fluxlab.fr',                                    scrollY: 700 },
  { name: '03_homepage_guides',         url: 'https://www.fluxlab.fr',                                    scrollY: 1600 },
  { name: '04_homepage_methodologie',   url: 'https://www.fluxlab.fr',                                    scrollY: 2600 },
  { name: '05_categorie_audio_header',  url: 'https://www.fluxlab.fr/categorie/audio',                    scrollY: 0 },
  { name: '06_categorie_audio_grille',  url: 'https://www.fluxlab.fr/categorie/audio',                    scrollY: 500 },
  { name: '07_fiche_produit_top',       url: 'https://www.fluxlab.fr/produit/shure-sm7b',                 scrollY: 0 },
  { name: '08_fiche_produit_avis',      url: 'https://www.fluxlab.fr/produit/shure-sm7b',                 scrollY: 800 },
  { name: '09_guides_liste',            url: 'https://www.fluxlab.fr/guides',                             scrollY: 0 },
  { name: '10_guide_article_top',       url: 'https://www.fluxlab.fr/guide/meilleur-micro-podcast-2026',  scrollY: 0 },
  { name: '11_guide_article_contenu',   url: 'https://www.fluxlab.fr/guide/meilleur-micro-podcast-2026',  scrollY: 900 },
  { name: '12_configurateur',           url: 'https://www.fluxlab.fr/configurateur',                      scrollY: 0 },
];

async function run() {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.log('Installation de puppeteer...');
    execSync('npm install --save-dev puppeteer', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    puppeteer = require('puppeteer');
  }

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  for (const p of PAGES) {
    console.log(`Capture: ${p.name}`);
    await page.goto(p.url, { waitUntil: 'networkidle2', timeout: 30000 });
    if (p.scrollY > 0) {
      await page.evaluate((y) => window.scrollTo(0, y), p.scrollY);
      await new Promise(r => setTimeout(r, 800));
    }
    const dest = path.join(DEST, `${p.name}.jpg`);
    await page.screenshot({ path: dest, type: 'jpeg', quality: 90 });
    console.log(`  -> ${dest}`);
  }

  await browser.close();
  console.log(`\nDone — ${PAGES.length} screenshots dans DESIGN-SCREENS/`);
}

run().catch(console.error);
