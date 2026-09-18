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

async function check() {
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'cartes-son').single();
  const { data: prods } = await supabase
    .from('products')
    .select('id, name, slug, brand, image_url, gallery_images, product_offers(*)')
    .eq('category_id', cat.id)
    .order('name');

  console.log(`Total soundcards in DB: ${prods.length}`);
  prods.forEach(p => {
    const galleryCount = (p.gallery_images || []).length;
    const offers = p.product_offers || [];
    console.log(`\n[${p.slug}] ${p.brand} ${p.name}`);
    console.log(`  Main image: ${p.image_url ? 'OK' : 'MISSING'}`);
    console.log(`  Gallery count: ${galleryCount}`);
    offers.forEach(o => {
      console.log(`    - ${o.merchant}: ${o.price}€ -> ${o.affiliate_link}`);
    });
  });
}

check();
