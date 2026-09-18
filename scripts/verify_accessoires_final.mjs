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
  const cats = [
    { id: '60d48356-1a67-415e-8e47-cda221d4a8d5', name: 'Bras articulés', slug: 'bras-articules' },
    { id: 'b99cc6bc-39c6-4236-be26-708456b06f97', name: 'Câble XLR', slug: 'cable-xlr' },
    { id: '40b8f65e-df8b-4c85-a6e0-5e4b986d7235', name: 'Traitement acoustique', slug: 'traitement-acoustique' }
  ];

  let totalProds = 0;
  let issues = 0;

  for (const c of cats) {
    console.log(`\n======================================================`);
    console.log(`CATEGORY: ${c.name} (${c.slug})`);
    console.log(`======================================================`);

    const { data: prods } = await supabase
      .from('products')
      .select('id, slug, name, brand, image_url, gallery_images, gallery_urls, is_active, product_offers(*)')
      .eq('category_id', c.id)
      .eq('is_active', true)
      .order('name');

    totalProds += prods.length;
    console.log(`Active products count: ${prods.length}`);

    for (const p of prods) {
      const allImgs = [p.image_url, ...(p.gallery_images || [])].filter(Boolean);
      const uniqueImgs = [...new Set(allImgs)];
      const offers = p.product_offers || [];

      console.log(`\n[${p.slug}] ${p.brand} ${p.name}`);
      console.log(`  - Total Images: ${uniqueImgs.length} (main: ${!!p.image_url}, gallery: ${p.gallery_images?.length || 0})`);
      if (uniqueImgs.length < 6) {
        console.error(`  ❌ ERROR: Under 6 images (${uniqueImgs.length})`);
        issues++;
      } else {
        console.log(`  ✅ Gallery OK (>= 6 images)`);
      }

      console.log(`  - Offers count: ${offers.length}`);
      if (offers.length === 0) {
        console.error(`  ❌ ERROR: No offers found!`);
        issues++;
      }

      offers.forEach(o => {
        const hasAff = o.affiliate_link.includes('partenaire') || o.affiliate_link.includes('tag=');
        const isSearch = o.affiliate_link.includes('/s?k=');
        const status = (hasAff || isSearch) ? '❌ INVALID URL' : '✅ DIRECT URL';
        console.log(`    * [${o.merchant_name}] ${o.price}€ -> ${o.affiliate_link} (${status})`);
        if (hasAff || isSearch) issues++;
      });
    }
  }

  console.log(`\n======================================================`);
  console.log(`AUDIT SUMMARY: ${totalProds} total products evaluated, ${issues} issues detected.`);
  console.log(`======================================================`);
}

check().catch(console.error);
