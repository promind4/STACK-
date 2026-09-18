import { spawnSync } from 'child_process';

const res = spawnSync('curl.exe', ['-s', '-L', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', 'https://www.amazon.fr/dp/B000186VD0'], { encoding: 'utf8' });
const matches = [...res.stdout.matchAll(/https:\/\/m\.media-amazon\.com\/images\/I\/[^\s"']+\.jpg/g)].map(m => m[0]);
console.log('Found Amazon:', [...new Set(matches)].slice(0, 10));
