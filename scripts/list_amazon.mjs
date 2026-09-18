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

async function checkAmazon() {
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'micros-dynamiques');
  const { data: prods } = await supabase.from('products').select('id, slug, name, brand').eq('category_id', cat[0].id);

  for (const p of prods) {
    const { data: offers } = await supabase.from('product_offers').select('*').eq('product_id', p.id).eq('merchant_name', 'amazon');
    if (offers && offers.length) {
      console.log(`[${p.slug}] Amazon: ${offers[0].price}€ -> ${offers[0].affiliate_link}`);
    }
  }
}

checkAmazon().catch(console.error);
