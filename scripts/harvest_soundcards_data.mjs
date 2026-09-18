import { spawnSync } from 'child_process';
import fs from 'fs';

function fetchWithCurl(url) {
  try {
    const res = spawnSync('curl.exe', [
      '-s',
      '-L',
      '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      '-w', '\nHTTP_STATUS:%{http_code}',
      url
    ], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });

    const output = res.stdout || '';
    const parts = output.split('\nHTTP_STATUS:');
    const status = parseInt(parts[1]?.trim() || '0', 10);
    const html = parts[0] || '';
    return { status, html };
  } catch (e) {
    return { status: 'ERR', html: '' };
  }
}

const SOUNDCARDS = [
  { slug: 'focusrite-scarlett-solo-4th-gen', thUrl: 'https://www.thomann.fr/focusrite_scarlett_solo_4th_generation.htm', altUrl: 'https://www.thomann.fr/focusrite_scarlett_solo_4th_gen.htm' },
  { slug: 'focusrite-scarlett-2i2-4th-gen', thUrl: 'https://www.thomann.fr/focusrite_scarlett_2i2_4th_generation.htm', altUrl: 'https://www.thomann.fr/focusrite_scarlett_2i2_4th_gen.htm' },
  { slug: 'focusrite-scarlett-4i4-4th-gen', thUrl: 'https://www.thomann.fr/focusrite_scarlett_4i4_4th_generation.htm', altUrl: 'https://www.thomann.fr/focusrite_scarlett_4i4_4th_gen.htm' },
  { slug: 'universal-audio-apollo-twin-x-usb', thUrl: 'https://www.thomann.fr/universal_audio_apollo_twin_x_usb_heritage.htm', altUrl: 'https://www.thomann.fr/universal_audio_apollo_twin_x_usb_he.htm' },
  { slug: 'universal-audio-volt-1', thUrl: 'https://www.thomann.fr/universal_audio_volt_1.htm' },
  { slug: 'universal-audio-volt-2', thUrl: 'https://www.thomann.fr/universal_audio_volt_2.htm' },
  { slug: 'universal-audio-volt-176', thUrl: 'https://www.thomann.fr/universal_audio_volt_176.htm' },
  { slug: 'universal-audio-volt-276', thUrl: 'https://www.thomann.fr/universal_audio_volt_276.htm' },
  { slug: 'audient-id4-mkii', thUrl: 'https://www.thomann.fr/audient_id4_mkii.htm' },
  { slug: 'audient-id14-mkii', thUrl: 'https://www.thomann.fr/audient_id14_mkii.htm' },
  { slug: 'audient-id24', thUrl: 'https://www.thomann.fr/audient_id24.htm' },
  { slug: 'motu-m2', thUrl: 'https://www.thomann.fr/motu_m2.htm' },
  { slug: 'motu-m4', thUrl: 'https://www.thomann.fr/motu_m4.htm' },
  { slug: 'ssl-2-mkii', thUrl: 'https://www.thomann.fr/ssl_2_mkii.htm', altUrl: 'https://www.thomann.fr/solid_state_logic_ssl_2_plus_mkii.htm' },
  { slug: 'ssl-2-plus', thUrl: 'https://www.thomann.fr/solid_state_logic_ssl_2_plus_mkii.htm', altUrl: 'https://www.thomann.fr/ssl_2_mkii_601306.htm' },
  { slug: 'arturia-minifuse-1-black', thUrl: 'https://www.thomann.fr/arturia_minifuse_1_black.htm' },
  { slug: 'arturia-minifuse-2-white', thUrl: 'https://www.thomann.fr/arturia_minifuse_2_white.htm' },
  { slug: 'behringer-u-phoria-um2', thUrl: 'https://www.thomann.fr/behringer_u_phoria_um2.htm' },
  { slug: 'behringer-u-phoria-umc202hd', thUrl: 'https://www.thomann.fr/behringer_u_phoria_umc202hd.htm' },
  { slug: 'elgato-wave-xlr', thUrl: 'https://www.thomann.fr/elgato_wave_xlr.htm' },
  { slug: 'm-audio-m-track-solo', thUrl: 'https://www.thomann.fr/m_audio_m_track_solo.htm' },
  { slug: 'native-instruments-komplete-audio-2', thUrl: 'https://www.thomann.fr/native_instruments_komplete_audio_2.htm' },
  { slug: 'presonus-studio-24c', thUrl: 'https://www.thomann.fr/presonus_studio_24c.htm' },
  { slug: 'rme-babyface-pro-fs', thUrl: 'https://www.thomann.fr/rme_babyface_pro_fs.htm' },
  { slug: 'rode-rodecaster-duo', thUrl: 'https://www.thomann.fr/rode_rodecaster_duo.htm' },
  { slug: 'steinberg-ur22c', thUrl: 'https://www.thomann.fr/steinberg_ur22c.htm' },
];

const results = [];

for (const sc of SOUNDCARDS) {
  let res = fetchWithCurl(sc.thUrl);
  let activeUrl = sc.thUrl;
  if (res.status !== 200 && sc.altUrl) {
    const altRes = fetchWithCurl(sc.altUrl);
    if (altRes.status === 200) {
      res = altRes;
      activeUrl = sc.altUrl;
    }
  }

  // Extract images
  const matches = [...res.html.matchAll(/https:\/\/thumbs\.static-thomann\.de\/thumb\/(?:padthumb[0-9]+x[0-9]+|orig)\/pics\/bdb\/([^\s"']+\.jpg)/g)]
    .map(m => `https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/${m[1]}`);
  const uniqueImages = [...new Set(matches)];

  // Extract price
  const priceMatch = res.html.match(/"price":\s*"?([\d.,]+)"?/) || res.html.match(/data-price=["']?([\d.,]+)/);
  const price = priceMatch ? parseFloat(priceMatch[1]) : null;

  console.log(`[${sc.slug}] Status: ${res.status} | Price: ${price}€ | Images: ${uniqueImages.length} | URL: ${activeUrl}`);
  results.push({
    slug: sc.slug,
    status: res.status,
    url: activeUrl,
    price,
    images: uniqueImages
  });
}

fs.writeFileSync('soundcards_harvest.json', JSON.stringify(results, null, 2));
console.log('Saved to soundcards_harvest.json');
