import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import https from 'https';

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

function checkImg(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      resolve(res.statusCode);
    }).on('error', () => resolve('ERR'));
  });
}

async function verify() {
  const { data: cat } = await supabase.from('categories').select('id, name').eq('slug', 'cartes-son').single();
  const { data: prods } = await supabase
    .from('products')
    .select('*, product_offers(*)')
    .eq('category_id', cat.id)
    .order('brand');

  console.log(`=== VÉRIFICATION COMPLÈTE : ${prods.length} CARTES SON ===\n`);
  let errors = 0;

  for (const p of prods) {
    const imgCode = await checkImg(p.image_url);
    const offers = p.product_offers || [];
    const offersStr = offers.map(o => `${o.merchant_name} (${o.price}€)`).join(', ');
    const isOk = imgCode === 200 && offers.length >= 1;
    if (!isOk) errors++;
    console.log(`${isOk ? '✅' : '❌'} [${p.slug}] ${p.brand} ${p.name} | Image: ${imgCode} | Offres (${offers.length}): ${offersStr}`);
  }

  console.log(`\nBilan: ${prods.length} cartes son, ${errors} erreur(s).`);
}

verify().catch(console.error);
