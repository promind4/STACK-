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

async function inspectImages() {
  const sampleSlugs = [
    'focusrite-scarlett-2i2-4th-gen',
    'audient-id4-mkii',
    'shure-sm7b',
    'nt1-5th-generation-black',
    'ssl-2-plus'
  ];

  for (const s of sampleSlugs) {
    const { data: p } = await supabase
      .from('products')
      .select('slug, name, image_url, gallery_images')
      .eq('slug', s)
      .single();

    console.log(`\n=== [${p?.slug}] ===`);
    console.log('Main Image:', p?.image_url);
    console.log('Gallery Images Count:', p?.gallery_images?.length);
    if (p?.gallery_images?.length) {
      p.gallery_images.slice(0, 5).forEach((img, i) => console.log(`  [${i+1}] ${img}`));
    }
  }
}

inspectImages().catch(console.error);
