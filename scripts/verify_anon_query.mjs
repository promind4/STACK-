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

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(slug), product_offers(*)')
    .eq('slug', 'audio-technica-bp40')
    .single();
    
  console.log('Error:', error);
  console.log('BP40 image:', data?.image_url);
  console.log('BP40 offers count:', data?.product_offers?.length);
  data?.product_offers?.forEach(o => {
    console.log(` - [${o.merchant_name}] ${o.price}€ -> ${o.affiliate_link}`);
  });
}

run();
