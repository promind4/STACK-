import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { fetchWoodbrass } from './harvest_helpers.mjs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split(/\r?\n/).forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const slugs = ['sony-mdr-7506', 'sennheiser-hd-600', 'sennheiser-hd-650'];
  for (const s of slugs) {
    const { data: p } = await supabase.from('products').select('image_url, gallery_images').eq('slug', s).maybeSingle();
    let wb = { images: [] };
    if (s === 'sony-mdr-7506') wb = await fetchWoodbrass('sony-mdr-7506-10233');
    if (s === 'sennheiser-hd-600') wb = await fetchWoodbrass('sennheiser-hd-600-82421');
    if (s === 'sennheiser-hd-650') wb = await fetchWoodbrass('sennheiser-hd-650-82426');

    const combined = [...(wb.images || [])];
    if (p?.image_url && !combined.includes(p.image_url)) combined.push(p.image_url);
    if (p?.gallery_images) {
      for (const g of p.gallery_images) {
        if (!combined.includes(g)) combined.push(g);
      }
    }
    console.log(s, 'Total unique combined images:', combined.length);
    console.log(combined);
  }
}

test();
