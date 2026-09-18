import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import https from 'https';

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

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, error: e.message });
        }
      });
    }).on('error', (e) => resolve({ status: 'ERR', error: e.message }));
  });
}

async function checkWoodbrassCatalog() {
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'micros-dynamiques');
  const { data: prods } = await supabase.from('products').select('id, slug, name, brand').eq('category_id', cat[0].id);

  for (const p of prods) {
    const { data: offers } = await supabase.from('product_offers').select('*').eq('product_id', p.id).eq('merchant_name', 'woodbrass');
    if (!offers || !offers.length) continue;
    const off = offers[0];
    if (off.affiliate_link.includes('product_search.php')) {
      const q = `${p.brand} ${p.name}`.replace(/B-Stock|\+/g, '').trim();
      const searchRes = await fetchJson(`https://woodbrass.com/search/suggest.json?q=${encodeURIComponent(q)}&resources[type]=product`);
      console.log(`\n[${p.slug}] search "${q}":`);
      const results = searchRes.json?.resources?.results?.products || [];
      if (results.length > 0) {
        results.slice(0, 3).forEach(r => {
          console.log(`   found: "${r.title}" (${r.price}€) -> https://woodbrass.com${r.url.split('?')[0]}`);
        });
      } else {
        console.log(`   NO RESULTS on Woodbrass`);
      }
    } else {
      console.log(`\n[${p.slug}] already direct: ${off.affiliate_link}`);
    }
  }
}

checkWoodbrassCatalog().catch(console.error);
