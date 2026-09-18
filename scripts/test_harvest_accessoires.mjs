import { fetchThomann, fetchWoodbrass, searchWoodbrass } from './harvest_helpers.mjs';

const CANDIDATES = [
  // --- BRAS ARTICULES ---
  { cat: 'bras-articules', slug: 'rode-psa1', name: 'PSA1', brand: 'Rode', th: 'https://www.thomann.fr/rode_psa1.htm', wb: 'rode-psa1-bras-articule' },
  { cat: 'bras-articules', slug: 'rode-psa1-plus', name: 'PSA1+', brand: 'Rode', th: 'https://www.thomann.fr/rode_psa1_529272.htm', wb: 'rode-psa1-plus-bras-de-table-professionnel-articule' },
  { cat: 'bras-articules', slug: 'elgato-wave-mic-arm-lp', name: 'Wave Mic Arm LP', brand: 'Elgato', th: 'https://www.thomann.fr/elgato_wave_mic_arm_lp.htm', wb: 'elgato-wave-mic-arm-lp-bras-de-micro-low-profile' },
  { cat: 'bras-articules', slug: 'elgato-wave-mic-arm', name: 'Wave Mic Arm High Rise', brand: 'Elgato', th: 'https://www.thomann.fr/elgato_wave_mic_arm.htm', wb: 'elgato-wave-mic-arm' },
  { cat: 'bras-articules', slug: 'km-23860', name: '23860', brand: 'K&M', th: 'https://www.thomann.fr/km_23860.htm', wb: 'km-23860' },
  { cat: 'bras-articules', slug: 'km-23840', name: '23840', brand: 'K&M', th: 'https://www.thomann.fr/km_23840.htm', wb: 'km-23840' },
  { cat: 'bras-articules', slug: 'km-23850', name: '23850', brand: 'K&M', th: 'https://www.thomann.fr/km_23850.htm', wb: 'km-23850' },
  { cat: 'bras-articules', slug: 'millenium-ma-2050', name: 'MA-2050', brand: 'Millenium', th: 'https://www.thomann.fr/millenium_ma2050_tischmikrofonarm.htm', wb: null },
  { cat: 'bras-articules', slug: 'gravity-ms-b-22', name: 'MS B 22', brand: 'Gravity', th: 'https://www.thomann.fr/gravity_ms_b_22.htm', wb: 'gravity-ms-b-22' },
  { cat: 'bras-articules', slug: 'blue-microphones-compass', name: 'Compass Boom Arm', brand: 'Logitech For Creators', th: 'https://www.thomann.fr/blue_microphones_compass.htm', wb: 'blue-microphones-compass' },

  // --- CABLE XLR ---
  { cat: 'cable-xlr', slug: 'cordial-ccm-5-fm', name: 'CCM 5 FM (5m)', brand: 'Cordial', th: 'https://www.thomann.fr/cordial_ccm_5_fm.htm', wb: 'cordial-ccm-5-fm-cable-micro-xlr-f-xlr-m-5m' },
  { cat: 'cable-xlr', slug: 'the-sssnake-sm6bk', name: 'SM6BK (6m)', brand: 'the sssnake', th: 'https://www.thomann.fr/the_sssnake_sk233-6_mikrokabel.htm', wb: null },
  { cat: 'cable-xlr', slug: 'cordial-cpm-2-5-fm', name: 'CPM 2,5 FM (2.5m)', brand: 'Cordial', th: 'https://www.thomann.fr/cordial_cpm_25_fm_flex.htm', wb: 'cordial-cpm-2-5-fm' },
  { cat: 'cable-xlr', slug: 'cordial-cpm-5-fm', name: 'CPM 5 FM (5m)', brand: 'Cordial', th: 'https://www.thomann.fr/cordial_cpm_5_fm_flex.htm', wb: 'cordial-cpm-5-fm' },
  { cat: 'cable-xlr', slug: 'sommer-cable-stage-22-sg04', name: 'Stage 22 Highflex (5m)', brand: 'Sommer Cable', th: 'https://www.thomann.fr/sommer_cable_stage_22_sg04_0500.htm', wb: 'sommer-cable-stage-22-sg04-0500' },
  { cat: 'cable-xlr', slug: 'sommer-cable-galileo-238', name: 'Galileo 238 (5m)', brand: 'Sommer Cable', th: 'https://www.thomann.fr/sommer_cable_galileo_238_50.htm', wb: 'sommer-cable-galileo-238' },
  { cat: 'cable-xlr', slug: 'mogami-2534-neglex-xlr-3m', name: '2534 Neglex Quad XLR (3m)', brand: 'Mogami', th: 'https://www.thomann.fr/mogami_2534_neglex_microphone_cable.htm', wb: 'mogami-cable-micro-2534-xlr-m-xlr-f-3m' },
  { cat: 'cable-xlr', slug: 'klotz-m2fm1-0500', name: 'M2FM1 (5m)', brand: 'Klotz', th: 'https://www.thomann.fr/klotz_m2fm1_0500.htm', wb: 'klotz-m2fm1-0500' },
  { cat: 'cable-xlr', slug: 'rode-xlr-3', name: 'XLR-3 Premium (3m)', brand: 'Rode', th: 'https://www.thomann.fr/rode_xlr_3_black.htm', wb: 'rode-xlr-3-cable-xlr-3m-noir' },

  // --- TRAITEMENT ACOUSTIQUE ---
  { cat: 'traitement-acoustique', slug: 'hofa-absorber-eco', name: 'Absorber Eco', brand: 'Hofa', th: 'https://www.thomann.fr/hofa_absorber_natural_grey.htm', wb: 'hofa-absorber-eco-grey' },
  { cat: 'traitement-acoustique', slug: 'hofa-diffusor', name: 'Diffusor Natural', brand: 'Hofa', th: 'https://www.thomann.fr/hofa_diffusor_natural.htm', wb: 'hofa-diffusor-natural' },
  { cat: 'traitement-acoustique', slug: 'takustik-hilo-p80', name: 'HiLo-P80', brand: 't.akustik', th: 'https://www.thomann.fr/the_takustik_hilo_p80.htm', wb: null },
  { cat: 'traitement-acoustique', slug: 'takustik-micscreen-flex', name: 'Micscreen Flex', brand: 't.akustik', th: 'https://www.thomann.fr/t.akustik_micscreen_flex.htm', wb: null },
  { cat: 'traitement-acoustique', slug: 'elgato-wave-panels-starter-set', name: 'Wave Panels Starter Set', brand: 'Elgato', th: 'https://www.thomann.fr/elgato_wave_panels_starter_set_black.htm', wb: 'elgato-wave-panels-starter-set-noir' },
  { cat: 'traitement-acoustique', slug: 'se-electronics-reflexion-filter-pro', name: 'Reflexion Filter PRO', brand: 'sE Electronics', th: 'https://www.thomann.fr/se_electronics_reflexion_filter.htm', wb: 'se-electronics-reflexion-filter-pro' },
  { cat: 'traitement-acoustique', slug: 'aston-microphones-halo', name: 'Halo Shadow', brand: 'Aston Microphones', th: 'https://www.thomann.fr/aston_microphones_halo_shadow.htm', wb: 'aston-microphones-halo-shadow' },
  { cat: 'traitement-acoustique', slug: 'takustik-was-7-absorber-set', name: 'WAS-7 Absorber Set', brand: 't.akustik', th: 'https://www.thomann.fr/t.akustik_was_7_absorber_set.htm', wb: null },
  { cat: 'traitement-acoustique', slug: 'vicoustic-vicpattern-ultra-wavewood', name: 'VicPattern Ultra Wavewood', brand: 'Vicoustic', th: 'https://www.thomann.fr/vicoustic_vicpattern_ultra_wavewood_mc.htm', wb: 'vicoustic-vicpattern-ultra-wavewood' }
];

async function run() {
  console.log('Testing candidates...');
  for (const item of CANDIDATES) {
    const thRes = fetchThomann(item.th);
    let wbRes = { status: 404, images: [], price: null };
    if (item.wb) {
      wbRes = await fetchWoodbrass(item.wb);
      if (wbRes.status !== 200) {
        // try search
        const s = await searchWoodbrass(`${item.brand} ${item.name}`);
        if (s.length > 0 && s[0].handle) {
          wbRes = await fetchWoodbrass(s[0].handle);
        }
      }
    }
    console.log(`[${item.cat}] ${item.brand} ${item.name} (${item.slug})`);
    console.log(`  TH: ${thRes.status} | Price: ${thRes.price}€ | Imgs: ${thRes.images.length}`);
    console.log(`  WB: ${wbRes.status} | Price: ${wbRes.price}€ | Imgs: ${wbRes.images.length} | Url: ${wbRes.url || ''}`);
  }
}

run();
