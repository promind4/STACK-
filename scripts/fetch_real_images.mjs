import https from 'https';
import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function fetchHtml(url) {
  return new Promise(resolve => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

function fetchJson(url) {
  return new Promise(resolve => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch(e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  const products = [
    // USB
    { slug: 'elgato-wave-3', wb: 'https://woodbrass.com/products/elgato-wave-3-430550.js' },
    { slug: 'elgato-wave-neo', wb: 'https://woodbrass.com/products/elgato-wave-neo-430548.js' },
    { slug: 'shure-mv6', thomann: 'https://www.thomann.fr/shure_mv6.htm', wb: 'https://woodbrass.com/products/shure-mv6-399318.js' },
    { slug: 'rode-nt-usb-plus', thomann: 'https://www.thomann.fr/rode_nt_usb_554868.htm', wb: 'https://woodbrass.com/products/rode-nt-usb-370970.js' },
    { slug: 'blue-yeti', thomann: 'https://www.thomann.fr/blue_microphones_yeti_silver.htm' },
    
    // Shotgun
    { slug: 'rode-videomic-pro-plus', thomann: 'https://www.thomann.fr/rode_videomic_pro.htm', wb: 'https://woodbrass.com/products/rode-videomic-pro-285614.js' },
    { slug: 'rode-videomic-ntg', thomann: 'https://www.thomann.fr/rode_videomic_ntg.htm', wb: 'https://woodbrass.com/products/rode-videomic-ntg-312074.js' },
    { slug: 'rode-ntg1', wb: 'https://woodbrass.com/products/rode-ntg-1-83377.js' },
    { slug: 'rode-ntg2', wb: 'https://woodbrass.com/products/rode-ntg2-83381.js' },
    { slug: 'rode-ntg4-plus', wb: 'https://woodbrass.com/products/rode-ntg4-249553.js' },
    { slug: 'audio-technica-at875r', thomann: 'https://www.thomann.fr/audio_technica_at_875_r.htm' },
    { slug: 'audio-technica-at897', wb: 'https://woodbrass.com/products/audio-technica-at897-190289.js' },
    { slug: 'sennheiser-mke-400-mkii', thomann: 'https://www.thomann.fr/sennheiser_mke_400_mkii.htm', wb: 'https://woodbrass.com/products/sennheiser-mke-400-347633.js' },
    { slug: 'sennheiser-mke-200', wb: 'https://woodbrass.com/products/sennheiser-mke-200-337558.js' }
  ];

  const results = {};

  for (const p of products) {
    let images = [];
    
    // Check Woodbrass Shopify JS
    if (p.wb) {
      const json = await fetchJson(p.wb);
      if (json && json.images && json.images.length > 0) {
        images = json.images.map(img => img.startsWith('//') ? 'https:' + img : img);
      }
    }
    
    // Check Thomann HTML
    if (p.thomann) {
      const html = await fetchHtml(p.thomann);
      const m = html.match(/https:\/\/thumbs\.static-thomann\.de\/thumb\/padthumb1000x1000\/pics\/bdb\/[^\"]+\.jpg/g);
      if (m && m.length > 0) {
        const unique = [...new Set(m)];
        images = [...images, ...unique];
      }
    }

    results[p.slug] = images;
    console.log(`[${p.slug}] => ${images.length} images found`);
    if (images.length > 0) console.log('   Sample:', images.slice(0, 3));
  }

  fs.writeFileSync('scripts/fetched_images.json', JSON.stringify(results, null, 2));
  console.log('Saved fetched images to scripts/fetched_images.json');
}

run();
