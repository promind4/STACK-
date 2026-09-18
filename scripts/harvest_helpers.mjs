import { spawnSync } from 'child_process';
import https from 'https';
import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Helper: fetch Thomann HTML via curl
function fetchThomann(url) {
  if (!url) return { status: 404, html: '', images: [], price: null };
  try {
    const res = spawnSync('curl.exe', [
      '-s', '-L',
      '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      '-w', '\nHTTP_STATUS:%{http_code}',
      url
    ], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });

    const parts = (res.stdout || '').split('\nHTTP_STATUS:');
    const status = parseInt(parts[1]?.trim() || '0', 10);
    const html = parts[0] || '';

    if (status !== 200) return { status, html: '', images: [], price: null };

    const matches = [...html.matchAll(/https:\/\/thumbs\.static-thomann\.de\/thumb\/(?:padthumb[0-9]+x[0-9]+|orig)\/pics\/bdb\/([^\s"']+\.jpg)/g)]
      .map(m => `https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/${m[1]}`);
    const images = [...new Set(matches)];

    const priceMatch = html.match(/"price":\s*"?([\d.,]+)"?/) || html.match(/data-price=["']?([\d.,]+)/);
    const price = priceMatch ? parseFloat(priceMatch[1]) : null;

    return { status, html, images, price };
  } catch (e) {
    return { status: 500, html: '', images: [], price: null };
  }
}

// Helper: fetch Woodbrass product JSON
function fetchWoodbrass(handleOrUrl) {
  return new Promise(resolve => {
    let handle = handleOrUrl || '';
    if (handle.includes('woodbrass.com/products/')) {
      handle = handle.split('woodbrass.com/products/')[1];
    }
    handle = handle.replace(/^\/products\//, '').replace(/\.json$/, '').split('?')[0].trim();
    if (!handle) return resolve({ status: 404, images: [], price: null, url: '' });

    const url = `https://woodbrass.com/products/${handle}.json`;
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, res => {
      if (res.statusCode !== 200) return resolve({ status: res.statusCode, images: [], price: null, url: '' });
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(d);
          const p = json.product;
          if (!p) return resolve({ status: 404, images: [], price: null, url: '' });
          const images = (p.images || []).map(img => img.src);
          const price = p.variants?.[0]?.price ? parseFloat(p.variants[0].price) : null;
          resolve({
            status: 200,
            images,
            price,
            url: `https://woodbrass.com/products/${handle}`
          });
        } catch (e) {
          resolve({ status: 500, images: [], price: null, url: '' });
        }
      });
    }).on('error', () => resolve({ status: 500, images: [], price: null, url: '' }));
  });
}

// Helper: search Woodbrass for handle
function searchWoodbrass(query) {
  return new Promise(resolve => {
    const url = `https://woodbrass.com/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product`;
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(d);
          const prods = json?.resources?.results?.products || [];
          resolve(prods);
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

export { fetchThomann, fetchWoodbrass, searchWoodbrass };
