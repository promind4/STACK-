import https from 'https';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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
          resolve({ status: res.statusCode, error: e.message, data: data.slice(0, 200) });
        }
      });
    }).on('error', (e) => resolve({ status: 'ERR', error: e.message }));
  });
}

async function searchShopify(q) {
  const url = `https://woodbrass.com/search/suggest.json?q=${encodeURIComponent(q)}&resources[type]=product`;
  const res = await fetchJson(url);
  console.log(`\n--- Query: "${q}" (status: ${res.status}) ---`);
  if (res.json?.resources?.results?.products) {
    const prods = res.json.resources.results.products;
    console.log(`Found ${prods.length} products:`);
    prods.slice(0, 3).forEach(p => {
      console.log(`  - ${p.title} (${p.price}€) -> https://woodbrass.com${p.url}`);
    });
  } else {
    console.log('No products or error:', res);
  }
}

async function main() {
  await searchShopify('shure sm58');
  await searchShopify('shure sm57');
  await searchShopify('shure sm7db');
  await searchShopify('rode podmic');
  await searchShopify('sennheiser e835');
  await searchShopify('se electronics v7');
  await searchShopify('audio technica bp40');
}

main();
