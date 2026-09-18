import { fetchThomann, fetchWoodbrass, searchWoodbrass } from './harvest_helpers.mjs';
import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// List of all Casques Studio (existing 13 + new ~11)
const CASQUES = [
  // --- Existing 13 ---
  {
    slug: 'beyerdynamic-dt-770-pro-80-ohm',
    name: 'DT 770 Pro (80 Ohm)',
    brand: 'Beyerdynamic',
    thUrl: 'https://www.thomann.fr/beyerdynamic_dt770_pro80_ohm.htm',
    wbQuery: 'Beyerdynamic DT 770 Pro 80',
    amzKeyword: 'Beyerdynamic DT 770 Pro 80 Ohm'
  },
  {
    slug: 'beyerdynamic-dt-990-pro',
    name: 'DT 990 Pro (250 Ohm)',
    brand: 'Beyerdynamic',
    thUrl: 'https://www.thomann.fr/beyerdynamic_dt990pro.htm',
    wbQuery: 'Beyerdynamic DT 990 Pro 250',
    amzKeyword: 'Beyerdynamic DT 990 Pro'
  },
  {
    slug: 'audio-technica-ath-m50-x',
    name: 'ATH-M50x',
    brand: 'Audio-Technica',
    thUrl: 'https://www.thomann.fr/audio_technica_ath_m50_x.htm',
    wbQuery: 'Audio-Technica ATH-M50x',
    amzKeyword: 'Audio-Technica ATH-M50x'
  },
  {
    slug: 'audio-technica-ath-m40-x',
    name: 'ATH-M40x',
    brand: 'Audio-Technica',
    thUrl: 'https://www.thomann.fr/audio_technica_ath_m40_x.htm',
    wbQuery: 'Audio-Technica ATH-M40x',
    amzKeyword: 'Audio-Technica ATH-M40x'
  },
  {
    slug: 'audio-technica-ath-m20x',
    name: 'ATH-M20x',
    brand: 'Audio-Technica',
    thUrl: 'https://www.thomann.fr/audio_technica_ath_m20_x.htm',
    wbQuery: 'Audio-Technica ATH-M20x',
    amzKeyword: 'Audio-Technica ATH-M20x'
  },
  {
    slug: 'sony-mdr-7506',
    name: 'MDR-7506',
    brand: 'Sony',
    thUrl: 'https://www.thomann.fr/sony_mdr7506.htm',
    wbQuery: 'Sony MDR-7506',
    amzKeyword: 'Sony MDR-7506'
  },
  {
    slug: 'sennheiser-hd-600',
    name: 'HD 600',
    brand: 'Sennheiser',
    thUrl: 'https://www.thomann.fr/sennheiser_hd_600.htm',
    wbQuery: 'Sennheiser HD 600',
    amzKeyword: 'Sennheiser HD 600'
  },
  {
    slug: 'sennheiser-hd-280-pro-new',
    name: 'HD 280 Pro',
    brand: 'Sennheiser',
    thUrl: 'https://www.thomann.fr/sennheiser_hd_280_pro_new.htm',
    wbQuery: 'Sennheiser HD 280 Pro',
    amzKeyword: 'Sennheiser HD 280 Pro'
  },
  {
    slug: 'akg-k-240-studio',
    name: 'K-240 Studio',
    brand: 'AKG',
    thUrl: 'https://www.thomann.fr/akg_k_240_studio_kopfhoerer.htm',
    wbQuery: 'AKG K240 Studio',
    amzKeyword: 'AKG K240 Studio'
  },
  {
    slug: 'akg-k-702',
    name: 'K-702',
    brand: 'AKG',
    thUrl: 'https://www.thomann.fr/akg_k_702.htm',
    wbQuery: 'AKG K-702',
    amzKeyword: 'AKG K702'
  },
  {
    slug: 'focal-listen-professional',
    name: 'Listen Professional',
    brand: 'Focal',
    thUrl: 'https://www.thomann.fr/focal_listen_professional.htm',
    wbQuery: 'Focal Listen Professional',
    amzKeyword: 'Focal Listen Professional'
  },
  {
    slug: 'shure-srh840a',
    name: 'SRH840A',
    brand: 'Shure',
    thUrl: 'https://www.thomann.fr/shure_srh840a_efs.htm',
    wbQuery: 'Shure SRH840A',
    amzKeyword: 'Shure SRH840A'
  },
  {
    slug: 'neumann-ndh-20',
    name: 'NDH 20',
    brand: 'Neumann',
    thUrl: 'https://www.thomann.fr/neumann_ndh_20.htm',
    wbQuery: 'Neumann NDH 20',
    amzKeyword: 'Neumann NDH 20'
  },

  // --- New additions ---
  {
    slug: 'beyerdynamic-dt-700-pro-x',
    name: 'DT 700 Pro X',
    brand: 'Beyerdynamic',
    thUrl: 'https://www.thomann.fr/beyerdynamic_dt_700_pro_x.htm',
    wbQuery: 'Beyerdynamic DT 700 Pro X',
    amzKeyword: 'Beyerdynamic DT 700 Pro X'
  },
  {
    slug: 'beyerdynamic-dt-900-pro-x',
    name: 'DT 900 Pro X',
    brand: 'Beyerdynamic',
    thUrl: 'https://www.thomann.fr/beyerdynamic_dt_900_pro_x.htm',
    wbQuery: 'Beyerdynamic DT 900 Pro X',
    amzKeyword: 'Beyerdynamic DT 900 Pro X'
  },
  {
    slug: 'sennheiser-hd-650',
    name: 'HD 650',
    brand: 'Sennheiser',
    thUrl: 'https://www.thomann.fr/sennheiser_hd_650.htm',
    wbQuery: 'Sennheiser HD 650',
    amzKeyword: 'Sennheiser HD 650'
  },
  {
    slug: 'sennheiser-hd-400-pro',
    name: 'HD 400 Pro',
    brand: 'Sennheiser',
    thUrl: 'https://www.thomann.fr/sennheiser_hd_400_pro.htm',
    wbQuery: 'Sennheiser HD 400 Pro',
    amzKeyword: 'Sennheiser HD 400 Pro'
  },
  {
    slug: 'sennheiser-hd-25',
    name: 'HD 25',
    brand: 'Sennheiser',
    thUrl: 'https://www.thomann.fr/sennheiser_hd_25.htm',
    wbQuery: 'Sennheiser HD 25',
    amzKeyword: 'Sennheiser HD 25'
  },
  {
    slug: 'rode-nth-100',
    name: 'NTH-100',
    brand: 'Rode',
    thUrl: 'https://www.thomann.fr/rode_nth_100.htm',
    wbQuery: 'Rode NTH-100',
    amzKeyword: 'Rode NTH-100'
  },
  {
    slug: 'audio-technica-ath-r70x',
    name: 'ATH-R70x',
    brand: 'Audio-Technica',
    thUrl: 'https://www.thomann.fr/audio_technica_ath_r70_x.htm',
    wbQuery: 'Audio-Technica ATH-R70x',
    amzKeyword: 'Audio-Technica ATH-R70x'
  },
  {
    slug: 'shure-srh440a',
    name: 'SRH440A',
    brand: 'Shure',
    thUrl: 'https://www.thomann.fr/shure_srh440a.htm',
    wbQuery: 'Shure SRH440A',
    amzKeyword: 'Shure SRH440A'
  },
  {
    slug: 'austrian-audio-hi-x15',
    name: 'Hi-X15',
    brand: 'Austrian Audio',
    thUrl: 'https://www.thomann.fr/austrian_audio_hi_x15.htm',
    wbQuery: 'Austrian Audio Hi-X15',
    amzKeyword: 'Austrian Audio Hi-X15'
  },
  {
    slug: 'austrian-audio-hi-x65',
    name: 'Hi-X65',
    brand: 'Austrian Audio',
    thUrl: 'https://www.thomann.fr/austrian_audio_hi_x65.htm',
    wbQuery: 'Austrian Audio Hi-X65',
    amzKeyword: 'Austrian Audio Hi-X65'
  },
  {
    slug: 'sony-mdr-m1',
    name: 'MDR-M1',
    brand: 'Sony',
    thUrl: 'https://www.thomann.fr/sony_mdr_m1.htm',
    wbQuery: 'Sony MDR-M1',
    amzKeyword: 'Sony MDR-M1'
  }
];

async function run() {
  console.log(`=== HARVESTING ${CASQUES.length} CASQUES STUDIO ===\n`);
  const results = [];

  for (const item of CASQUES) {
    console.log(`[${item.slug}] Checking ${item.brand} ${item.name}...`);
    
    // Thomann
    const thData = fetchThomann(item.thUrl);
    
    // Woodbrass
    let wbData = { status: 404, price: null, url: null, images: [] };
    const searchRes = await searchWoodbrass(item.wbQuery);
    if (searchRes && searchRes.length > 0) {
      const validItem = searchRes.find(p => !p.title.toLowerCase().includes('cable') && !p.title.toLowerCase().includes('coussinet') && !p.title.toLowerCase().includes('reconditionn') && !p.title.toLowerCase().includes('housse')) || searchRes[0];
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

  fs.writeFileSync('casques_harvest.json', JSON.stringify(results, null, 2));
  console.log('\nSaved to casques_harvest.json');
}

run();
