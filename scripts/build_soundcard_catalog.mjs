import { fetchThomann, fetchWoodbrass, searchWoodbrass } from './harvest_helpers.mjs';
import fs from 'fs';

// Full list of 26 soundcards with initial candidate URLs
const SOUNDCARDS_MAP = [
  {
    slug: 'focusrite-scarlett-solo-4th-gen',
    name: 'Scarlett Solo (4th Gen)',
    brand: 'Focusrite',
    thUrl: 'https://www.thomann.fr/focusrite_scarlett_solo_4th_gen.htm',
    wbQuery: 'Focusrite Scarlett Solo 4th Gen',
    amzKeyword: 'Focusrite Scarlett Solo 4th Gen'
  },
  {
    slug: 'focusrite-scarlett-2i2-4th-gen',
    name: 'Scarlett 2i2 (4th Gen)',
    brand: 'Focusrite',
    thUrl: 'https://www.thomann.fr/focusrite_scarlett_2i2_4th_generation.htm',
    wbQuery: 'Focusrite Scarlett 2i2 4th Gen',
    amzKeyword: 'Focusrite Scarlett 2i2 4th Gen'
  },
  {
    slug: 'focusrite-scarlett-4i4-4th-gen',
    name: 'Scarlett 4i4 (4th Gen)',
    brand: 'Focusrite',
    thUrl: 'https://www.thomann.fr/focusrite_scarlett_4i4_4th_generation.htm',
    wbQuery: 'Focusrite Scarlett 4i4 4th Gen',
    amzKeyword: 'Focusrite Scarlett 4i4 4th Gen'
  },
  {
    slug: 'universal-audio-apollo-twin-x-usb',
    name: 'Apollo Twin X USB Heritage Edition',
    brand: 'Universal Audio',
    thUrl: 'https://www.thomann.fr/universal_audio_apollo_twin_x_usb_heritage.htm',
    wbQuery: 'Universal Audio Apollo Twin X USB HE',
    amzKeyword: 'Universal Audio Apollo Twin X USB Heritage Edition'
  },
  {
    slug: 'universal-audio-volt-1',
    name: 'Volt 1',
    brand: 'Universal Audio',
    thUrl: 'https://www.thomann.fr/universal_audio_volt_1.htm',
    wbQuery: 'Universal Audio Volt 1 Recording Studio',
    amzKeyword: 'Universal Audio Volt 1'
  },
  {
    slug: 'universal-audio-volt-2',
    name: 'Volt 2',
    brand: 'Universal Audio',
    thUrl: 'https://www.thomann.fr/universal_audio_volt_2.htm',
    wbQuery: 'Universal Audio Volt 2',
    amzKeyword: 'Universal Audio Volt 2'
  },
  {
    slug: 'universal-audio-volt-176',
    name: 'Volt 176',
    brand: 'Universal Audio',
    thUrl: 'https://www.thomann.fr/universal_audio_volt_176.htm',
    wbQuery: 'Universal Audio Volt 176 Recording Studio',
    amzKeyword: 'Universal Audio Volt 176'
  },
  {
    slug: 'universal-audio-volt-276',
    name: 'Volt 276',
    brand: 'Universal Audio',
    thUrl: 'https://www.thomann.fr/universal_audio_volt_276.htm',
    wbQuery: 'Universal Audio Volt 276',
    amzKeyword: 'Universal Audio Volt 276'
  },
  {
    slug: 'audient-id4-mkii',
    name: 'iD4 MKII',
    brand: 'Audient',
    thUrl: 'https://www.thomann.fr/audient_id4_mkii.htm',
    wbQuery: 'Audient iD4 MKII',
    amzKeyword: 'Audient iD4 MKII'
  },
  {
    slug: 'audient-id14-mkii',
    name: 'iD14 MKII',
    brand: 'Audient',
    thUrl: 'https://www.thomann.fr/audient_id14_mkii.htm',
    wbQuery: 'Audient iD14 MKII',
    amzKeyword: 'Audient iD14 MKII'
  },
  {
    slug: 'audient-id24',
    name: 'iD24',
    brand: 'Audient',
    thUrl: 'https://www.thomann.fr/audient_id24.htm',
    wbQuery: 'Audient iD24',
    amzKeyword: 'Audient iD24'
  },
  {
    slug: 'motu-m2',
    name: 'M2',
    brand: 'MOTU',
    thUrl: 'https://www.thomann.fr/motu_m2.htm',
    wbQuery: 'MOTU M2',
    amzKeyword: 'MOTU M2'
  },
  {
    slug: 'motu-m4',
    name: 'M4',
    brand: 'MOTU',
    thUrl: 'https://www.thomann.fr/motu_m4.htm',
    wbQuery: 'MOTU M4',
    amzKeyword: 'MOTU M4'
  },
  {
    slug: 'ssl-2-mkii',
    name: 'SSL 2 MKII',
    brand: 'Solid State Logic',
    thUrl: 'https://www.thomann.fr/ssl_2_mkii.htm',
    wbQuery: 'Solid State Logic SSL 2 MKII',
    amzKeyword: 'Solid State Logic SSL 2 MKII'
  },
  {
    slug: 'ssl-2-plus',
    name: 'SSL 2+ MKII',
    brand: 'Solid State Logic',
    thUrl: 'https://www.thomann.fr/ssl_2_mkii_601306.htm',
    wbQuery: 'Solid State Logic SSL 2+ MKII',
    amzKeyword: 'Solid State Logic SSL 2+ MKII'
  },
  {
    slug: 'arturia-minifuse-1-black',
    name: 'MiniFuse 1 (Black)',
    brand: 'Arturia',
    thUrl: 'https://www.thomann.fr/arturia_minifuse_1_black.htm',
    wbQuery: 'Arturia MiniFuse 1 Black',
    amzKeyword: 'Arturia MiniFuse 1 Black'
  },
  {
    slug: 'arturia-minifuse-2-white',
    name: 'MiniFuse 2 (White)',
    brand: 'Arturia',
    thUrl: 'https://www.thomann.fr/arturia_minifuse_2_white.htm',
    wbQuery: 'Arturia MiniFuse 2 White',
    amzKeyword: 'Arturia MiniFuse 2 White'
  },
  {
    slug: 'behringer-u-phoria-um2',
    name: 'U-Phoria UM2',
    brand: 'Behringer',
    thUrl: 'https://www.thomann.fr/behringer_u_phoria_um2.htm',
    wbQuery: 'Behringer U-Phoria UM2',
    amzKeyword: 'Behringer U-Phoria UM2'
  },
  {
    slug: 'behringer-u-phoria-umc202hd',
    name: 'U-Phoria UMC202HD',
    brand: 'Behringer',
    thUrl: 'https://www.thomann.fr/behringer_u_phoria_umc202hd.htm',
    wbQuery: 'Behringer U-Phoria UMC204HD',
    amzKeyword: 'Behringer U-Phoria UMC202HD'
  },
  {
    slug: 'elgato-wave-xlr',
    name: 'Wave XLR',
    brand: 'Elgato',
    thUrl: null, // Elgato not sold on Thomann
    wbQuery: 'Elgato Wave XLR MK.2',
    amzKeyword: 'Elgato Wave XLR'
  },
  {
    slug: 'm-audio-m-track-solo',
    name: 'M-Track Solo',
    brand: 'M-Audio',
    thUrl: 'https://www.thomann.fr/m_audio_m_track_solo.htm',
    wbQuery: 'M-Audio M-Track Solo',
    amzKeyword: 'M-Audio M-Track Solo'
  },
  {
    slug: 'native-instruments-komplete-audio-2',
    name: 'Komplete Audio 2',
    brand: 'Native Instruments',
    thUrl: null, // Discontinued on Thomann
    wbQuery: 'Native Instruments Komplete Audio 2',
    amzKeyword: 'Native Instruments Komplete Audio 2'
  },
  {
    slug: 'presonus-studio-24c',
    name: 'Studio 24c',
    brand: 'PreSonus',
    thUrl: null, // Discontinued on Thomann
    wbQuery: 'PreSonus Studio 24c',
    amzKeyword: 'PreSonus Studio 24c'
  },
  {
    slug: 'rme-babyface-pro-fs',
    name: 'Babyface Pro FS',
    brand: 'RME',
    thUrl: 'https://www.thomann.fr/rme_babyface_pro_fs.htm',
    wbQuery: 'RME Babyface Pro FS',
    amzKeyword: 'RME Babyface Pro FS'
  },
  {
    slug: 'rode-rodecaster-duo',
    name: 'RØDECaster Duo',
    brand: 'Rode',
    thUrl: 'https://www.thomann.fr/rode_rodecaster_duo.htm',
    wbQuery: 'Rode Rodecaster Duo',
    amzKeyword: 'Rode Rodecaster Duo'
  },
  {
    slug: 'steinberg-ur22c',
    name: 'UR22C',
    brand: 'Steinberg',
    thUrl: null,
    wbQuery: 'Yamaha UR22 MK3',
    amzKeyword: 'Steinberg UR22C'
  }
];

async function run() {
  console.log('Starting full catalog build & verification...\n');
  const catalog = [];

  for (const item of SOUNDCARDS_MAP) {
    console.log(`Processing: [${item.slug}] ${item.brand} ${item.name}...`);
    
    // 1. Thomann
    let thData = { status: 404, images: [], price: null };
    if (item.thUrl) {
      thData = fetchThomann(item.thUrl);
    }

    // 2. Woodbrass
    let wbData = { status: 404, images: [], price: null, url: null };
    const wbSearch = await searchWoodbrass(item.wbQuery);
    if (wbSearch.length > 0) {
      // Find best match
      const first = wbSearch[0];
      const directWb = await fetchWoodbrass(first.url);
      if (directWb.status === 200) {
        wbData = directWb;
      }
    }

    // 3. Pool images: prefer Thomann, enrich with Woodbrass
    let allImages = [...(thData.images || [])];
    if (wbData.images && wbData.images.length > 0) {
      for (const wimg of wbData.images) {
        if (!allImages.includes(wimg)) {
          allImages.push(wimg);
        }
      }
    }

    // Clean image array (filter out icons/badges/svg)
    allImages = allImages.filter(img => img.startsWith('http') && !img.includes('icon') && !img.includes('logo') && !img.endsWith('.svg'));

    // Amazon clean URL
    const amzUrl = `https://www.amazon.fr/s?k=${encodeURIComponent(item.amzKeyword)}`;

    catalog.push({
      slug: item.slug,
      name: item.name,
      brand: item.brand,
      thUrl: thData.status === 200 ? item.thUrl : null,
      thPrice: thData.price,
      wbUrl: wbData.status === 200 ? wbData.url : null,
      wbPrice: wbData.price,
      amzUrl,
      imagesCount: allImages.length,
      mainImage: allImages[0] || null,
      galleryImages: allImages.slice(1, 10),
      images: allImages
    });

    console.log(`  -> Thomann: ${thData.status === 200 ? thData.price + '€' : 'N/A'} | Woodbrass: ${wbData.status === 200 ? wbData.price + '€ (' + wbData.url + ')' : 'N/A'} | Images: ${allImages.length}`);
  }

  fs.writeFileSync('soundcards_catalog_audit.json', JSON.stringify(catalog, null, 2));
  console.log('\nAudit written to soundcards_catalog_audit.json');
}

run();
