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

async function run() {
  const { data: casques } = await supabase
    .from('products')
    .select('id, name, slug, brand, image_url, gallery_images, product_offers(*)')
    .eq('category_id', 'e53b8f8a-ab68-4ede-9f53-d892bf785ff6')
    .order('name');

  console.log('=== CASQUES STUDIO (13 ACTUELS) ===');
  casques.forEach(p => {
    console.log(`\n[${p.slug}] brand: "${p.brand}" | name: "${p.name}"`);
    console.log(`  image_url: ${p.image_url}`);
    console.log(`  gallery (${(p.gallery_images||[]).length}):`, p.gallery_images);
    (p.product_offers || []).forEach(o => {
      console.log(`    - [${o.merchant_name}] ${o.price}€ -> ${o.affiliate_link}`);
    });
  });

  const { data: enceintes } = await supabase
    .from('products')
    .select('id, name, slug, brand, image_url, gallery_images, product_offers(*)')
    .eq('category_id', '35dcf61b-1b56-4635-a3e9-7bba7f165409')
    .order('name');

  console.log('\n=== ENCEINTES MONITORING (11 ACTUELLES) ===');
  enceintes.forEach(p => {
    console.log(`\n[${p.slug}] brand: "${p.brand}" | name: "${p.name}"`);
    console.log(`  image_url: ${p.image_url}`);
    console.log(`  gallery (${(p.gallery_images||[]).length}):`, p.gallery_images);
    (p.product_offers || []).forEach(o => {
      console.log(`    - [${o.merchant_name}] ${o.price}€ -> ${o.affiliate_link}`);
    });
  });
}

run();
