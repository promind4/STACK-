import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split(/\r?\n/).forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'cartes-son').single();
  const { data: prods } = await supabase
    .from('products')
    .select('id, name, slug, brand, image_url, gallery_images, product_offers(*)')
    .eq('category_id', cat.id)
    .order('name');

  console.log(`=== AUDIT COMPLET BASE DE DONNÉES : CARTES SON (${prods.length} PRODUITS) ===\n`);

  let allPass = true;

  for (const p of prods) {
    const gallery = p.gallery_images || [];
    const offers = p.product_offers || [];
    const hasEnoughImages = gallery.length >= 5 && !!p.image_url;
    const hasOffers = offers.length >= 2;
    const hasCleanUrls = offers.every(o => !o.affiliate_link.includes('partner_id') && !o.affiliate_link.includes('af=') && !o.affiliate_link.includes('tag='));

    const pass = hasEnoughImages && hasOffers && hasCleanUrls;
    if (!pass) allPass = false;

    console.log(`[${pass ? 'OK' : 'FAIL'}] ${p.brand} - ${p.name} (/produit/${p.slug})`);
    console.log(`     Image principale: ${p.image_url.slice(0, 70)}...`);
    console.log(`     Galerie: ${gallery.length} sous-images`);
    offers.forEach(o => {
      console.log(`       * [${o.merchant_name}] ${o.price}€ -> ${o.affiliate_link}`);
    });
  }

  console.log(`\nTOUS LES CRITÈRES VALIDÉS : ${allPass ? 'OUI ✅' : 'NON ❌'}`);
}

check();
