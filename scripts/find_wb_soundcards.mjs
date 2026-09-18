import https from 'https';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json'
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch (e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

const queries = [
  'Focusrite Scarlett 4i4 4th Gen',
  'Universal Audio Apollo Twin X USB',
  'MOTU M4',
  'Arturia MiniFuse 1',
  'Solid State Logic SSL 2 MKII',
  'Audient iD24',
  'Elgato Wave XLR',
  'Rode Rodecaster Duo',
  'PreSonus Studio 24c',
  'Behringer U-Phoria UM2',
  'Universal Audio Volt 176',
  'Native Instruments Komplete Audio 2'
];

async function run() {
  for (const q of queries) {
    const res = await fetchJson(`https://woodbrass.com/search/suggest.json?q=${encodeURIComponent(q)}&resources[type]=product`);
    console.log(`\n=== "${q}" ===`);
    const prods = res?.resources?.results?.products || [];
    if (prods.length) {
      prods.slice(0, 3).forEach(p => {
        console.log(`  - ${p.title} (${p.price}€) -> https://woodbrass.com${p.url.split('?')[0]}`);
      });
    } else {
      console.log('  Aucun résultat');
    }
  }
}

run();
