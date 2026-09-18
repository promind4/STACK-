import { fetchThomann, fetchWoodbrass, searchWoodbrass } from './harvest_helpers.mjs';
import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const ENCEINTES = [
  // --- Existing 11 ---
  {
    slug: 'yamaha-hs-5',
    name: 'HS 5',
    brand: 'Yamaha',
    thUrl: 'https://www.thomann.fr/yamaha_hs_5.htm',
    wbQuery: 'Yamaha HS 5',
    amzKeyword: 'Yamaha HS5'
  },
  {
    slug: 'yamaha-hs-7',
    name: 'HS 7',
    brand: 'Yamaha',
    thUrl: 'https://www.thomann.fr/yamaha_hs_7.htm',
    wbQuery: 'Yamaha HS 7',
    amzKeyword: 'Yamaha HS7'
  },
  {
    slug: 'yamaha-hs-8',
    name: 'HS 8',
    brand: 'Yamaha',
    thUrl: 'https://www.thomann.fr/yamaha_hs_8.htm',
    wbQuery: 'Yamaha HS 8',
    amzKeyword: 'Yamaha HS8'
  },
  {
    slug: 'adam-t5v',
    name: 'T5V',
    brand: 'Adam Audio',
    thUrl: 'https://www.thomann.fr/adam_t5v.htm',
    wbQuery: 'Adam Audio T5V',
    amzKeyword: 'Adam Audio T5V'
  },
  {
    slug: 'adam-t7v',
    name: 'T7V',
    brand: 'Adam Audio',
    thUrl: 'https://www.thomann.fr/adam_t7v.htm',
    wbQuery: 'Adam Audio T7V',
    amzKeyword: 'Adam Audio T7V'
  },
  {
    slug: 'focal-alpha-50-evo',
    name: 'Alpha 50 Evo',
    brand: 'Focal',
    thUrl: 'https://www.thomann.fr/focal_alpha_50_evo.htm',
    wbQuery: 'Focal Alpha 50 Evo',
    amzKeyword: 'Focal Alpha 50 Evo'
  },
  {
    slug: 'focal-alpha-65-evo',
    name: 'Alpha 65 Evo',
    brand: 'Focal',
    thUrl: 'https://www.thomann.fr/focal_alpha_65_evo.htm',
    wbQuery: 'Focal Alpha 65 Evo',
    amzKeyword: 'Focal Alpha 65 Evo'
  },
  {
    slug: 'genelec-8010-ap',
    name: '8010 AP',
    brand: 'Genelec',
    thUrl: 'https://www.thomann.fr/genelec_8010_ap.htm',
    wbQuery: 'Genelec 8010 AP',
    amzKeyword: 'Genelec 8010 AP'
  },
  {
    slug: 'jbl-305p-mkii',
    name: '305P MKII',
    brand: 'JBL',
    thUrl: 'https://www.thomann.fr/jbl_lsr_305p_mkii.htm',
    wbQuery: 'JBL 305P MKII',
    amzKeyword: 'JBL 305P MKII'
  },
  {
    slug: 'krk-rokit-rp5-g4',
    name: 'Rokit RP5 G5',
    brand: 'KRK',
    thUrl: 'https://www.thomann.fr/krk_rokit_rp5_g5.htm',
    wbQuery: 'KRK Rokit RP5 G5',
    amzKeyword: 'KRK Rokit 5 G5'
  },
  {
    slug: 'mackie-cr3-x',
    name: 'CR3.5',
    brand: 'Mackie',
    thUrl: 'https://www.thomann.fr/mackie_cr3.5.htm',
    wbQuery: 'Mackie CR3.5',
    amzKeyword: 'Mackie CR3.5'
  },

  // --- New additions ---
  {
    slug: 'kali-audio-lp-6-2nd-wave',
    name: 'LP-6 2nd Wave',
    brand: 'Kali Audio',
    thUrl: 'https://www.thomann.fr/kali_audio_lp_6_2nd_wave.htm',
    wbQuery: 'Kali Audio LP-6 2nd Wave',
    amzKeyword: 'Kali Audio LP-6 2nd Wave'
  },
  {
    slug: 'kali-audio-lp-8-2nd-wave',
    name: 'LP-8 2nd Wave',
    brand: 'Kali Audio',
    thUrl: 'https://www.thomann.fr/kali_audio_lp_8_2nd_wave.htm',
    wbQuery: 'Kali Audio LP-8 2nd Wave',
    amzKeyword: 'Kali Audio LP-8 2nd Wave'
  },
  {
    slug: 'kali-audio-in-5',
    name: 'IN-5 2nd Wave',
    brand: 'Kali Audio',
    thUrl: 'https://www.thomann.fr/kali_audio_in_5_2nd_wave.htm',
    wbQuery: 'Kali Audio IN-5',
    amzKeyword: 'Kali Audio IN-5'
  },
  {
    slug: 'adam-t8v',
    name: 'T8V',
    brand: 'Adam Audio',
    thUrl: 'https://www.thomann.fr/adam_t8v.htm',
    wbQuery: 'Adam Audio T8V',
    amzKeyword: 'Adam Audio T8V'
  },
  {
    slug: 'adam-a7v',
    name: 'A7V',
    brand: 'Adam Audio',
    thUrl: 'https://www.thomann.fr/adam_a7v.htm',
    wbQuery: 'Adam Audio A7V',
    amzKeyword: 'Adam Audio A7V'
  },
  {
    slug: 'yamaha-hs-3',
    name: 'HS 3',
    brand: 'Yamaha',
    thUrl: 'https://www.thomann.fr/yamaha_hs_3.htm',
    wbQuery: 'Yamaha HS 3',
    amzKeyword: 'Yamaha HS3'
  },
  {
    slug: 'yamaha-hs-4',
    name: 'HS 4',
    brand: 'Yamaha',
    thUrl: 'https://www.thomann.fr/yamaha_hs_4.htm',
    wbQuery: 'Yamaha HS 4',
    amzKeyword: 'Yamaha HS4'
  },
  {
    slug: 'ik-multimedia-iloud-micro-monitor',
    name: 'iLoud Micro Monitor',
    brand: 'IK Multimedia',
    thUrl: 'https://www.thomann.fr/ik_multimedia_iloud_micro_monitor.htm',
    wbQuery: 'IK Multimedia iLoud Micro Monitor',
    amzKeyword: 'IK Multimedia iLoud Micro Monitor'
  },
  {
    slug: 'ik-multimedia-iloud-mtm-mkii',
    name: 'iLoud MTM MKII',
    brand: 'IK Multimedia',
    thUrl: 'https://www.thomann.fr/ik_multimedia_iloud_mtm_mkii.htm',
    wbQuery: 'IK Multimedia iLoud MTM',
    amzKeyword: 'IK Multimedia iLoud MTM'
  },
  {
    slug: 'presonus-eris-3-5-2nd-gen',
    name: 'Eris 3.5 (2nd Gen)',
    brand: 'PreSonus',
    thUrl: 'https://www.thomann.fr/presonus_eris_3.5_2nd_gen.htm',
    wbQuery: 'PreSonus Eris 3.5 2nd Gen',
    amzKeyword: 'PreSonus Eris 3.5 2nd Gen'
  },
  {
    slug: 'genelec-8020-dpm',
    name: '8020 DPM',
    brand: 'Genelec',
    thUrl: 'https://www.thomann.fr/genelec_8020_dpm.htm',
    wbQuery: 'Genelec 8020 DPM',
    amzKeyword: 'Genelec 8020 DPM'
  },
  {
    slug: 'genelec-8030-cp',
    name: '8030 CP',
    brand: 'Genelec',
    thUrl: 'https://www.thomann.fr/genelec_8030_cp.htm',
    wbQuery: 'Genelec 8030 CP',
    amzKeyword: 'Genelec 8030 CP'
  },
  {
    slug: 'focal-alpha-80-evo',
    name: 'Alpha 80 Evo',
    brand: 'Focal',
    thUrl: 'https://www.thomann.fr/focal_alpha_80_evo.htm',
    wbQuery: 'Focal Alpha 80 Evo',
    amzKeyword: 'Focal Alpha 80 Evo'
  }
];

async function run() {
  console.log(`=== HARVESTING ${ENCEINTES.length} ENCEINTES MONITORING ===\n`);
  const results = [];

  for (const item of ENCEINTES) {
    console.log(`[${item.slug}] Checking ${item.brand} ${item.name}...`);
    
    // Thomann
    const thData = fetchThomann(item.thUrl);
    
    // Woodbrass
    let wbData = { status: 404, price: null, url: null, images: [] };
    const searchRes = await searchWoodbrass(item.wbQuery);
    if (searchRes && searchRes.length > 0) {
      const validItem = searchRes.find(p => !p.title.toLowerCase().includes('stand') && !p.title.toLowerCase().includes('support') && !p.title.toLowerCase().includes('reconditionn') && !p.title.toLowerCase().includes('housse')) || searchRes[0];
      if (validItem) {
        wbData = await fetchWoodbrass(validItem.url);
      }
    }

    // Pool images
    let images = [...(thData.images || [])];
    if (wbData.images) {
      for (const img of wbData.images) {
        if (!images.includes(img)) images.push(img);
      }
    }
    images = images.filter(img => img.startsWith('http') && !img.includes('icon') && !img.includes('logo') && !img.endsWith('.svg'));

    console.log(`  Thomann: ${thData.status === 200 ? thData.price + '€' : 'FAIL (' + thData.status + ')'}`);
    console.log(`  Woodbrass: ${wbData.status === 200 ? wbData.price + '€ (' + wbData.url + ')' : 'FAIL (' + wbData.status + ')'}`);
    console.log(`  Total images: ${images.length}`);

    results.push({
      slug: item.slug,
      name: item.name,
      brand: item.brand,
      thUrl: thData.status === 200 ? item.thUrl : null,
      thPrice: thData.price,
      wbUrl: wbData.status === 200 ? wbData.url : null,
      wbPrice: wbData.price,
      amzUrl: `https://www.amazon.fr/s?k=${encodeURIComponent(item.amzKeyword)}`,
      imagesCount: images.length,
      images
    });
  }

  fs.writeFileSync('enceintes_harvest.json', JSON.stringify(results, null, 2));
  console.log('\nSaved to enceintes_harvest.json');
}

run();
