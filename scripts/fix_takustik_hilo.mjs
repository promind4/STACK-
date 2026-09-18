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

async function fix() {
  const { data: p } = await supabase.from('products').select('*').eq('slug', 'takustik-hilo-p80').single();
  if (!p) return console.log('Not found');

  const extraImgs = [
    'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_39/393278/11796590_800.jpg',
    'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_39/393278/11796595_800.jpg'
  ];

  const current = [p.image_url, ...(p.gallery_images || [])];
  const merged = [...new Set([...current, ...extraImgs])];

  const mainImage = merged[0];
  const gallery = merged.slice(1);

  await supabase.from('products').update({
    image_url: mainImage,
    gallery_images: gallery,
    gallery_urls: merged,
    updated_at: new Date().toISOString()
  }).eq('id', p.id);

  // Update offer price to 14.30
  await supabase.from('product_offers').update({
    price: 14.3,
    affiliate_link: 'https://www.thomann.fr/the_takustik_hilo_p80.htm',
    updated_at: new Date().toISOString()
  }).eq('product_id', p.id);

  console.log('Fixed takustik-hilo-p80! Total images now:', merged.length);
}

fix();
