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

async function stats() {
  const { data: cats } = await supabase.from('categories').select('*');
  const catMap = {};
  cats.forEach(c => catMap[c.id] = c);

  const { data: prods } = await supabase.from('products').select('id, name, slug, category_id, is_active');
  
  console.log('=== STATISTIQUES GLOBALES DU CATALOGUE ===');
  console.log(`Total produits enregistrés en base : ${prods.length}`);

  const activeProds = prods.filter(p => p.is_active);
  console.log(`Total produits actifs : ${activeProds.length}`);

  // Regroupement par Verticale
  const byVertical = { audio: 0, video: 0, streaming: 0, autre: 0 };
  const byVerticalActive = { audio: 0, video: 0, streaming: 0, autre: 0 };

  const byCat = {};
  prods.forEach(p => {
    const c = catMap[p.category_id];
    const vert = c?.vertical || 'autre';
    if (!byVertical[vert]) {
      byVertical[vert] = 0;
      byVerticalActive[vert] = 0;
    }
    byVertical[vert]++;
    if (p.is_active) byVerticalActive[vert]++;

    const catName = c ? `${c.name} [${c.slug}] (${vert})` : 'Sans catégorie';
    if (!byCat[catName]) byCat[catName] = { total: 0, active: 0, vertical: vert };
    byCat[catName].total++;
    if (p.is_active) byCat[catName].active++;
  });

  console.log('\n--- RÉPARTITION PAR VERTICALE ---');
  for (const [vert, count] of Object.entries(byVertical)) {
    console.log(`* ${vert.toUpperCase()} : ${count} total (dont ${byVerticalActive[vert]} actifs)`);
  }

  console.log('\n--- DÉTAIL PAR CATÉGORIE AUDIO ---');
  for (const [k, v] of Object.entries(byCat).sort((a,b) => b[1].total - a[1].total)) {
    if (v.vertical === 'audio') {
      console.log(`- ${k} : ${v.total} produits (${v.active} actifs)`);
    }
  }

  console.log('\n--- DÉTAIL CATÉGORIES NON-AUDIO (Image/Lumière, Streaming, etc.) ---');
  for (const [k, v] of Object.entries(byCat).sort((a,b) => b[1].total - a[1].total)) {
    if (v.vertical !== 'audio') {
      console.log(`- ${k} : ${v.total} produits (${v.active} actifs)`);
    }
  }
}

stats().catch(console.error);
