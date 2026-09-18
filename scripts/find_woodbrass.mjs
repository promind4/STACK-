import https from 'https';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function testUrl(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let loc = res.headers.location;
      if (loc) {
        if (!loc.startsWith('http')) loc = 'https://www.woodbrass.com' + loc;
        https.get(loc, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
          resolve({ initial: res.statusCode, final: res2.statusCode, loc });
        }).on('error', () => resolve({ initial: res.statusCode, final: 'ERR', loc }));
      } else {
        resolve({ initial: res.statusCode, final: res.statusCode, loc: null });
      }
    }).on('error', (e) => resolve({ initial: 'ERR', error: e.message }));
  });
}

// Test known / guessed Woodbrass URLs
async function test() {
  const candidates = [
    // SM58
    'https://www.woodbrass.com/microphones-dynamiques-shure-sm58-lce-p9414.html',
    'https://www.woodbrass.com/microphones-dynamiques-shure-sm58-p9414.html',
    // SM57
    'https://www.woodbrass.com/microphones-dynamiques-shure-sm57-lce-p9413.html',
    'https://www.woodbrass.com/microphones-dynamiques-shure-sm57-p9413.html',
    // Podmic
    'https://www.woodbrass.com/microphones-dynamiques-rode-podmic-p290130.html',
    // SE V7
    'https://www.woodbrass.com/microphones-dynamiques-se-electronics-v7-p232675.html',
    // Sennheiser e835
    'https://www.woodbrass.com/microphones-dynamiques-sennheiser-e835-p19630.html',
    // SM7dB
    'https://www.woodbrass.com/microphones-dynamiques-shure-sm7db-p384976.html',
    // Existing direct links in db:
    'https://www.woodbrass.com/microphones-usb-shure-mv7+-p392308.html',
    'https://www.woodbrass.com/microphones-a-large-membrane-shure-mv7x-p354182.html',
    'https://www.woodbrass.com/microphones-dynamiques-electrovoice-re-20-p170796.html',
    'https://www.woodbrass.com/microphones-a-large-membrane-aston-microphones-stealth-p288960.html',
    'https://www.woodbrass.com/microphones-dynamiques-shure-sm7b-p9415.html'
  ];

  for (const url of candidates) {
    const res = await testUrl(url);
    console.log(`${res.final === 200 ? '✅ 200' : '❌ ' + res.final} -> ${url} (loc: ${res.loc})`);
  }
}

test();
