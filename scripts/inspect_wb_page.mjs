import https from 'https';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function fetchPage(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', (e) => resolve({ status: 'ERR', data: '' }));
  });
}

async function main() {
  const { data } = await fetchPage('https://woodbrass.com/search?q=sm58');
  console.log('Length:', data.length);
  // find script tags or json
  const scripts = [...data.matchAll(/<script[^>]*>(.*?)<\/script>/gs)].map(m => m[1]);
  for (const s of scripts) {
    if (s.includes('products') || s.includes('items') || s.includes('algolia') || s.includes('results')) {
      console.log('Script snippet:', s.slice(0, 300));
    }
  }
}

main();
