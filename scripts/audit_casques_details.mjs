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

async function run() {
  const imgs7506 = [
    'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_13/135709/9535760_800.jpg',
    'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_13/135709/9535765_800.jpg',
    'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_13/135709/9535720_800.jpg',
    'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_13/135709/9535755_800.jpg',
    'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_13/135709/9535715_800.jpg',
    'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_13/135709/9535710_800.jpg',
    'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_13/135709/9535735_800.jpg',
    'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_13/135709/9535730_800.jpg',
    'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_13/135709/9535725_800.jpg',
    'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/1a597c2a9ca50fa4001f0f46cc5190c1c46143c5_SONY_MDR75061.jpg?v=1789494324'
  ];

  const { error } = await supabase.from('products').update({
    image_url: imgs7506[0],
    gallery_images: imgs7506.slice(1, 10),
    gallery_urls: imgs7506.slice(1, 10)
  }).eq('slug', 'sony-mdr-7506');

  console.log('Sony 7506 gallery updated:', error ? error.message : 'OK');
}

run();
