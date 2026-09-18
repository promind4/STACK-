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

async function healthCheck() {
  console.log('--- AUDIT COMPLET SUPABASE : CATÉGORIE MICROS DYNAMIQUES ---\n');
  
  const { data: cat, error: catErr } = await supabase.from('categories').select('*').eq('slug', 'micros-dynamiques').single();
  if (catErr) {
    console.error('Erreur catégorie:', catErr);
    return;
  }
  console.log(`Catégorie trouvée: "${cat.name}" (ID: ${cat.id}, slug: ${cat.slug})`);

  const { data: prods, error: prodErr } = await supabase
    .from('products')
    .select('*, product_offers(*)')
    .eq('category_id', cat.id)
    .order('name');

  if (prodErr) {
    console.error('Erreur produits:', prodErr);
    return;
  }

  console.log(`Total de produits dans la catégorie: ${prods.length}\n`);

  let errors = 0;
  for (const p of prods) {
    const issues = [];
    if (!p.name) issues.push('Nom manquant');
    if (!p.brand) issues.push('Marque manquante');
    if (!p.slug) issues.push('Slug manquant');
    if (!p.image_url) issues.push('Image manquante');
    if (!p.is_active) issues.push('Produit inactif');
    if (!p.product_offers || p.product_offers.length === 0) issues.push('Aucune offre marchande');

    const offersInfo = (p.product_offers || []).map(o => `${o.merchant_name} (${o.price}€)`).join(', ');
    const statusIcon = issues.length === 0 ? '✅' : '❌';
    console.log(`${statusIcon} [${p.slug}] ${p.brand} ${p.name} | Offres: [${offersInfo}]`);
    if (issues.length > 0) {
      console.log(`   ⚠️ Problèmes: ${issues.join(' | ')}`);
      errors++;
    }
  }

  console.log(`\nBilan de l'audit: ${prods.length} produits vérifiés, ${errors} erreur(s) détectée(s).`);
}

healthCheck().catch(console.error);
