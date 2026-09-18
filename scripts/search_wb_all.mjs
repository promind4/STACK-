import https from 'https';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
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

async function searchWb(q) {
  const url = 'https://woodbrass.com/search/suggest.json?q=' + encodeURIComponent(q) + '&resources[type]=product';
  const res = await fetchJson(url);
  if (res.json?.resources?.results?.products) {
    return res.json.resources.results.products;
  }
  return [];
}

async function getProductDetails(handle) {
  const url = 'https://woodbrass.com/products/' + handle + '.js';
  const res = await fetchJson(url);
  return res.json;
}

async function run() {
  const queries = [
    'elgato wave 3',
    'elgato wave neo',
    'hyperx quadcast s',
    'hyperx solocast',
    'blue yeti',
    'rode videomic pro+',
    'rode ntg1',
    'rode ntg2',
    'rode ntg4+',
    'audio-technica at875r',
    'audio-technica at897',
    'rode nt-usb+'
  ];

  for (const q of queries) {
    const prods = await searchWb(q);
    console.log('\n--- Query: ' + q + ' --- (' + prods.length + ' found)');
    for (const p of prods.slice(0, 2)) {
      console.log('  Handle: ' + p.handle + ' | Title: ' + p.title);
      const det = await getProductDetails(p.handle);
      console.log('  Images count: ' + (det?.images?.length || 0));
      if (det?.images) {
        console.log('  Images:', det.images.slice(0, 2));
      }
    }
  }
}
run();
