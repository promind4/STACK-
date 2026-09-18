import { spawnSync } from 'child_process';
import https from 'https';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Test B&H or Sweetwater or manufacturer for the 4 products
const products = [
  { slug: 'elgato-wave-xlr', query: 'elgato wave xlr' },
  { slug: 'native-instruments-komplete-audio-2', query: 'native instruments komplete audio 2' },
  { slug: 'presonus-studio-24c', query: 'presonus studio 24c' },
  { slug: 'steinberg-ur22c', query: 'steinberg ur22c' }
];

for (const p of products) {
  // Check DuckDuckGo / B&H images or Sweetwater
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(p.query + ' site:bhphotovideo.com')}`;
  const res = spawnSync('curl.exe', ['-s', '-L', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', url], { encoding: 'utf8' });
  const bhMatch = res.stdout.match(/https:\/\/(?:www\.)?bhphotovideo\.com\/c\/product\/[^\s"']+/);
  console.log(p.slug, '=> B&H URL:', bhMatch ? bhMatch[0] : 'None');
  if (bhMatch) {
    const pageRes = spawnSync('curl.exe', ['-s', '-L', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', bhMatch[0]], { encoding: 'utf8' });
    const imgMatches = [...pageRes.stdout.matchAll(/https:\/\/static\.bhphoto\.com\/images\/images[0-9]+x[0-9]+\/([^\s"']+\.jpg)/g)]
      .map(m => `https://static.bhphoto.com/images/images1000x1000/${m[1]}`);
    const uniq = [...new Set(imgMatches)];
    console.log(`  Found ${uniq.length} B&H images!`);
  }
}
