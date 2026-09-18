import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  console.log('=== AUDIT CATÉGORIE CARTES-SON ===\n');
  const { data: cat, error: catErr } = await supabase.from('categories').select('*').eq('slug', 'cartes-son').single();
  if (catErr) return console.error('Catégorie introuvable:', catErr);
  console.log(`Catégorie: ${cat.name} (ID: ${cat.id}, Slug: ${cat.slug})\n`);

  const { data: prods, error: pErr } = await supabase
    .from('products')
    .select('*, product_offers(*)')
    .eq('category_id', cat.id)
    .order('name');

  if (pErr) return console.error('Erreur produits:', pErr);

  console.log(`Nombre de produits actuels dans cartes-son: ${prods.length}`);
  for (const p of prods) {
    const offers = p.product_offers || [];
    console.log(`\n[${p.slug}] ${p.brand} - ${p.name} (Actif: ${p.is_active})`);
    console.log(`  Image: ${p.image_url}`);
    if (offers.length) {
      offers.forEach(o => {
        console.log(`   - [${o.merchant_name}] ${o.price}€ -> ${o.affiliate_link}`);
      });
    } else {
      console.log(`   - AUCUNE OFFRE`);
    }
  }

  // Vérifier aussi si des cartes son sont égarées dans d'autres catégories
  console.log('\n--- RECHERCHE DE CARTES SON DANS D\'AUTRES CATÉGORIES ---');
  const keywords = ['scarlett', 'audient', 'motu', 'volt', 'ssl', 'apoll', 'zen go', 'ur22', 'audiobox', 'minifuse', 'komplete audio', 'clarett', 'id4', 'id14', 'id24', 'id44', '2i2', 'solo', '4i4'];
  const { data: allProds } = await supabase.from('products').select('id, name, slug, brand, category_id, categories(name, slug)');
  const misplaced = (allProds || []).filter(p => {
    if (p.category_id === cat.id) return false;
    const txt = `${p.name} ${p.slug} ${p.brand}`.toLowerCase();
    return keywords.some(k => txt.includes(k));
  });
  console.log(`Cartes son potentielles trouvées ailleurs: ${misplaced.length}`);
  misplaced.forEach(p => {
    console.log(`  - [${p.slug}] ${p.brand} ${p.name} (dans: ${p.categories?.name || p.category_id})`);
  });
}

run().catch(console.error);
