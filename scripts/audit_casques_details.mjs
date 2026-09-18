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
  const { data } = await supabase
    .from('products')
    .select('slug, name, brand, specs, pros, cons, recommendation_profile, product_offers(price)')
    .eq('category_id', '3339b393-34ce-4144-bc71-a7655e628d2d')
    .limit(3);
  console.log('Dynamic mic samples:', JSON.stringify(data, null, 2));
}

run();
