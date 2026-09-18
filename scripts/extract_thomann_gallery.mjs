import https from 'https';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

https.get('https://www.thomann.fr/focusrite_scarlett_2i2_4th_generation.htm', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'fr-FR,fr;q=0.9'
  }
}, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    // Find all bdb image matches
    const matches = [...data.matchAll(/https:\/\/thumbs\.static-thomann\.de\/thumb\/[^\s"']+\.jpg/g)].map(m => m[0]);
    const unique = [...new Set(matches)];
    console.log(`Found ${unique.length} image URLs on page:`);
    unique.slice(0, 10).forEach(u => console.log('  ', u));
  });
}).on('error', console.error);
