import { spawnSync } from 'child_process';

const queries = [
  'elgato wave xlr',
  'native instruments komplete audio 2',
  'presonus studio 24c',
  'steinberg ur22c',
  'apollo twin x usb'
];

for (const q of queries) {
  const url = 'https://www.thomann.fr/search_dir.html?sw=' + encodeURIComponent(q);
  const res = spawnSync('curl.exe', ['-s', '-L', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', url], { encoding: 'utf8' });
  const matches = [...res.stdout.matchAll(/href="(https:\/\/www\.thomann\.fr\/[^"]+\.htm)"/g)].map(m => m[1]);
  const productMatches = [...new Set(matches.filter(u => !u.includes('search_dir') && !u.includes('index.htm') && !u.includes('online_guide') && !u.includes('helpdesk')))];
  console.log('Query:', q);
  console.log('Found:', productMatches.slice(0, 5));
}
