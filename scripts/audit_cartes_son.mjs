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

async function run() {
  console.log('=== INSPECTING CASQUES & ENCEINTES ===\n');
  const { data: casques } = await supabase.from('products').select('slug, name, brand, short_description, description, specs, pros, cons').eq('category_id', 'e53b8f8a-ab68-4ede-9f53-d892bf785ff6').limit(2);
  console.log('Casque 1:', JSON.stringify(casques[0], null, 2));

  const { data: enceintes } = await supabase.from('products').select('slug, name, brand, short_description, description, specs, pros, cons').eq('category_id', '35dcf61b-1b56-4635-a3e9-7bba7f165409').limit(2);
  console.log('Enceinte 1:', JSON.stringify(enceintes[0], null, 2));
}

run().catch(console.error);

