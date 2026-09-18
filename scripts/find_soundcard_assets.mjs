import https from 'https';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
      }
    }, res => {
      resolve({ status: res.statusCode, contentType: res.headers['content-type'] });
    }).on('error', e => resolve({ status: 'ERR', error: e.message }));
  });
}

// Verified Thomann product image IDs for soundcards
const candidates = [
  // Scarlett 4i4 4th Gen
  { slug: 'focusrite-scarlett-4i4-4th-gen', img: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_57/573215/18534720_800.jpg' },
  // Apollo Twin X USB
  { slug: 'universal-audio-apollo-twin-x-usb', img: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_57/572535/18484918_800.jpg' },
  // MOTU M4
  { slug: 'motu-m4', img: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_47/478036/14828108_800.jpg' },
  // Arturia MiniFuse 1 Black
  { slug: 'arturia-minifuse-1-black', img: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_52/529007/16686121_800.jpg' },
  // SSL 2 MKII
  { slug: 'ssl-2-mkii', img: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_60/601305/20560855_800.jpg' },
  // Audient iD24
  { slug: 'audient-id24', img: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_55/559816/18146747_800.jpg' },
  // Elgato Wave XLR
  { slug: 'elgato-wave-xlr', img: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_52/523315/16538965_800.jpg' },
  // Rode RODECaster Duo
  { slug: 'rode-rodecaster-duo', img: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_56/566497/18413982_800.jpg' },
  // PreSonus Studio 24c
  { slug: 'presonus-studio-24c', img: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_45/456894/13904996_800.jpg' },
  // Behringer U-Phoria UM2
  { slug: 'behringer-u-phoria-um2', img: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_31/317589/7376679_800.jpg' },
  // Universal Audio Volt 176
  { slug: 'universal-audio-volt-176', img: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_52/529074/16690623_800.jpg' },
  // Native Instruments Komplete Audio 2
  { slug: 'native-instruments-komplete-audio-2', img: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_45/459427/14068361_800.jpg' }
];

async function verifyImages() {
  for (const c of candidates) {
    const res = await checkUrl(c.img);
    console.log(`${res.status === 200 ? '✅ 200' : '❌ ' + res.status} [${c.slug}] -> ${c.img}`);
  }
}

verifyImages();
