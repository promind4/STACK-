import { spawnSync } from 'child_process';

const list = [
  'sony mdr 7506',
  'sennheiser hd 600',
  'sennheiser hd 650',
  'audio technica ath r70x',
  'shure srh440a'
];

for (const q of list) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(q + ' site:thomann.fr')}`;
  const res = spawnSync('curl.exe', ['-s', '-L', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', url], { encoding: 'utf8' });
  const matches = [...res.stdout.matchAll(/https:\/\/www\.thomann\.fr\/([^\s"&<>]+\.htm)/g)].map(m => `https://www.thomann.fr/${m[1]}`);
  console.log(q, '=>', [...new Set(matches)].slice(0, 3));
}
