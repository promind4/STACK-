import https from 'https';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

https.get('https://www.thomann.fr/audio_technica_bp40.htm', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'fr-FR,fr;q=0.9'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const priceMatch = data.match(/class="price"[^>]*>([^<]+)</) || data.match(/"price":\s*"([^"]+)"/) || data.match(/(\d+[\s,]?\d*)\s*€/);
    console.log('Status:', res.statusCode);
    console.log('Price match:', priceMatch ? priceMatch[0] : 'None');
    const matches = data.match(/\d+[\s\u00A0]?€/g);
    console.log('All € prices:', matches?.slice(0, 10));
  });
}).on('error', console.error);
