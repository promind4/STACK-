import https from 'https';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const sleep = ms => new Promise(r => setTimeout(r, ms));

function get(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
      }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (!loc.startsWith('http')) loc = 'https://www.thomann.fr' + loc;
        return get(loc).then(resolve);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', err => resolve({ status: 500, error: err.message }));
  });
}

async function run() {
  const items = [
    { slug: 'audio-technica-at875r', url: 'https://www.thomann.fr/audio_technica_at_875_r.htm' },
    { slug: 'audio-technica-at897', url: 'https://www.thomann.fr/audio_technica_at897.htm' },
    { slug: 'rode-ntg1', url: 'https://www.thomann.fr/rode_ntg_1.htm' },
    { slug: 'rode-ntg4-plus', url: 'https://www.thomann.fr/rode_ntg_4_plus.htm' },
    { slug: 'rode-videomic-pro-plus', url: 'https://www.thomann.fr/rode_videomic_pro_plus.htm' },
    { slug: 'hyperx-quadcast-s', url: 'https://www.thomann.fr/hyperx_quadcast_s.htm' },
    { slug: 'hyperx-solocast', url: 'https://www.thomann.fr/hyperx_solocast.htm' },
    { slug: 'blue-yeti', url: 'https://www.thomann.fr/blue_yeti.htm' },
    { slug: 'elgato-wave-3', url: 'https://www.thomann.fr/elgato_wave_3.htm' }
  ];

  for (const item of items) {
    await sleep(2000);
    const res = await get(item.url);
    console.log(item.slug, '=> status:', res.status, 'len:', res.data?.length);
    if (res.status === 200 && res.data) {
      const bdb = res.data.match(/https:\/\/[^"'\s]+\/pics\/bdb\/[^"'\s]+_800\.jpg/g) || [];
      const uniq = [...new Set(bdb)].map(u => u.replace(/padthumb\d+x\d+/, 'padthumb1000x1000'));
      console.log('  Found images:', uniq.length);
      if (uniq.length > 0) {
        console.log('  First 3:', uniq.slice(0, 3));
      }
    }
  }
}
run();
