import https from 'https';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function fetchPage(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', (e) => resolve({ status: 'ERR', data: '' }));
  });
}

async function searchWoodbrass(query) {
  const url = `https://woodbrass.com/search?q=${encodeURIComponent(query)}`;
  const { status, data } = await fetchPage(url);
  console.log(`\n--- Search: ${query} (status: ${status}) ---`);
  // Look for product links: href="/products/..." or href="...-p[0-9]+.html"
  const matches = [...data.matchAll(/href="(\/(?:products|microphones)[^"]+)"/g)];
  const unique = [...new Set(matches.map(m => m[1]))];
  console.log(`Found ${unique.length} links:`);
  unique.slice(0, 5).forEach(l => console.log('  https://woodbrass.com' + l));
}

async function main() {
  await searchWoodbrass('shure sm58');
  await searchWoodbrass('shure sm57');
  await searchWoodbrass('rode podmic');
  await searchWoodbrass('sennheiser e835');
  await searchWoodbrass('se electronics v7');
  await searchWoodbrass('audio technica bp40');
}

main();
