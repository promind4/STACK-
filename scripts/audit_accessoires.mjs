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
  const slugs = ['bras-articules', 'cable-xlr', 'traitement-acoustique'];
  const { data: cats } = await supabase.from('categories').select('*').in('slug', slugs);
  console.log('Categories:', cats);

  for (const c of cats) {
    console.log('\n==============================');
    console.log(`CATEGORY: ${c.name} (${c.slug}) ID: ${c.id}`);
    const { data: prods, error: prodErr } = await supabase
      .from('products')
      .select('id, name, slug, brand, image_url, gallery_images, product_offers(*)')
      .eq('category_id', c.id)
      .order('name');

    if (prodErr) {
      console.error('Error fetching prods:', prodErr);
      continue;
    }
    console.log(`Total products: ${prods?.length || 0}`);
    prods.forEach(p => {
      console.log(` - [${p.slug}] ${p.brand} ${p.name} | price: ${p.price} | imgs: 1+${p.gallery_images?.length || 0} | offers: ${p.product_offers?.length || 0}`);
      (p.product_offers || []).forEach(o => {
        console.log(`     * [${o.merchant_name}] ${o.price}€ -> ${o.affiliate_link}`);
      });
    });
  }
}

check();
