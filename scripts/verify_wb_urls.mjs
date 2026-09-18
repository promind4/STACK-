import https from 'https';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function test(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (res) => {
      console.log(`[${res.statusCode}] -> ${url}`);
      resolve();
    }).on('error', (e) => {
      console.log(`[ERR: ${e.message}] -> ${url}`);
      resolve();
    });
  });
}

async function run() {
  await test('https://woodbrass.com/products/audio-technica-bp40-229660');
  await test('https://woodbrass.com/products/shure-sm58-20154');
  await test('https://woodbrass.com/products/shure-sm57-9764');
  await test('https://woodbrass.com/products/rode-podmic-333408');
  await test('https://woodbrass.com/products/sennheiser-evolution-e835-19778');
  await test('https://woodbrass.com/products/se-electronics-v7-377669');
}

run();
