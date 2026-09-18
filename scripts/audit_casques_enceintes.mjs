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

async function inspect() {
  console.log('=== LISTING ALL CATEGORIES ===\n');
  const { data: cats, error: catErr } = await supabase.from('categories').select('*').order('name');
  if (catErr) return console.error(catErr);
  cats.forEach(c => console.log(`ID: ${c.id} | Slug: ${c.slug} | Name: ${c.name}`));

  // Find categories matching casques or enceintes/monitoring
  const targetCats = cats.filter(c => {
    const s = `${c.name} ${c.slug}`.toLowerCase();
    return s.includes('casque') || s.includes('enceinte') || s.includes('monitoring') || s.includes('speaker') || s.includes('headphone');
  });

  console.log('\n=== MATCHING CATEGORIES ===');
  for (const c of targetCats) {
    console.log(`\nCategory: ${c.name} (${c.slug}, ID: ${c.id})`);
    const { data: prods } = await supabase
      .from('products')
      .select('id, name, slug, brand, image_url, gallery_images, product_offers(*)')
      .eq('category_id', c.id)
      .order('name');

    console.log(`Products count: ${prods?.length || 0}`);
    (prods || []).forEach(p => {
      const offCount = (p.product_offers || []).length;
      const galCount = (p.gallery_images || []).length;
      console.log(`  - [${p.slug}] ${p.brand} ${p.name} | Images: 1+${galCount} | Offers: ${offCount}`);
    });
  }
}

inspect();
