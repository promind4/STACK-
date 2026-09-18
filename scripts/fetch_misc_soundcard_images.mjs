import { spawnSync } from 'child_process';
import https from 'https';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function searchImages(query) {
  // Use duckduckgo image search or similar
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + ' filetype:jpg white background')}`;
  const res = spawnSync('curl.exe', ['-s', '-L', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', url], { encoding: 'utf8' });
  const matches = [...res.stdout.matchAll(/uddg=([^&"]+)/g)].map(m => decodeURIComponent(m[1]));
  return matches.slice(0, 10);
}

// Let's also test Sweetwater product pages for Komplete Audio 2 and Studio 24c
const sweetwaterUrls = [
  { slug: 'native-instruments-komplete-audio-2', url: 'https://www.sweetwater.com/store/detail/KompAudio2--native-instruments-komplete-audio-2-usb-audio-interface' },
  { slug: 'presonus-studio-24c', url: 'https://www.sweetwater.com/store/detail/Studio24C--presonus-studio-24c-usb-c-audio-interface' },
  { slug: 'steinberg-ur22c', url: 'https://www.sweetwater.com/store/detail/UR22C--steinberg-ur22c-usb-audio-interface' }
];

for (const item of sweetwaterUrls) {
  const res = spawnSync('curl.exe', ['-s', '-L', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', item.url], { encoding: 'utf8' });
  const matches = [...res.stdout.matchAll(/https:\/\/media\.sweetwater\.com\/images\/items\/(?:750|1000|1600|2000)\/([^\s"']+\.jpg)/g)]
    .map(m => `https://media.sweetwater.com/images/items/1000/${m[1]}`);
  const uniq = [...new Set(matches)];
  console.log(item.slug, 'Sweetwater images:', uniq.length);
  if (uniq.length) console.log(uniq.slice(0, 7));
}
