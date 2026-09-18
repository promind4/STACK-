import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split(/\r?\n/).forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '');
});

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

import { spawnSync } from 'child_process';

async function run() {
  const ids = ['456894', '459427', '523315'];
  for (const id of ids) {
    const res = spawnSync('curl.exe', ['-s', '-L', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', `https://www.thomann.fr/index.html?page=bdb&ar=${id}`], { encoding: 'utf8' });
    const matches = [...res.stdout.matchAll(/https:\/\/thumbs\.static-thomann\.de\/thumb\/padthumb1000x1000\/pics\/bdb\/[^\s"']+\.jpg/g)].map(m => m[0]);
    console.log(id, 'matches:', matches.length);
    if (matches.length) console.log(matches.slice(0, 5));
  }
}

run();
