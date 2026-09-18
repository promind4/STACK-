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
  const { data: cat } = await supabase.from('categories').select('id, name, slug').eq('slug', 'micros-dynamiques');
  if (!cat || !cat.length) return;
  const { data: prods, error: pErr } = await supabase.from('products').select('id, name, slug, brand, image_url').eq('category_id', cat[0].id).order('name');
  if (pErr) return console.error(pErr);
  
  console.log(`Total dynamic mics: ${prods.length}`);
  for (const p of prods) {
    const { data: offers } = await supabase.from('product_offers').select('id, merchant_name, price, affiliate_link').eq('product_id', p.id);
    console.log(`\n[${p.slug}] ${p.brand} - ${p.name}`);
    console.log(`  Image: ${p.image_url}`);
    if (offers && offers.length) {
      offers.forEach(o => {
        console.log(`  - [${o.merchant_name}] (${o.price}€) -> ${o.affiliate_link}`);
      });
    } else {
      console.log(`  - No offers`);
    }
  }
}

run().catch(console.error);
