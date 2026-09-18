import { spawnSync } from 'child_process';
import { fetchThomann, fetchWoodbrass } from './harvest_helpers.mjs';

const testUrls = [
  // Bras
  { name: 'Rode PSA1', th: 'https://www.thomann.fr/rode_psa1.htm', wb: 'rode-psa1-bras-articule-28269' },
  { name: 'Rode PSA1+', th: 'https://www.thomann.fr/rode_psa1_529272.htm', wb: 'rode-psa1-plus-bras-de-table-professionnel-articule-370123' },
  { name: 'Elgato Wave Mic Arm LP', th: 'https://www.thomann.fr/elgato_wave_mic_arm_lp.htm', wb: null },
  { name: 'Elgato Wave Mic Arm', th: 'https://www.thomann.fr/elgato_wave_mic_arm.htm', wb: null },
  { name: 'K&M 23860', th: 'https://www.thomann.fr/km_23860.htm', wb: null },
  { name: 'K&M 23850', th: 'https://www.thomann.fr/km_23850.htm', wb: 'k-m-23850-stand-23032' },
  { name: 'Millenium MA-2050', th: 'https://www.thomann.fr/millenium_ma2050_tischmikrofonarm.htm', wb: null },
  { name: 'Gravity MS B 22', th: 'https://www.thomann.fr/gravity_ms_b_22.htm', wb: null },

  // Câbles XLR
  { name: 'Cordial CCM 5 FM', th: 'https://www.thomann.fr/cordial_ccm_5_fm.htm', wb: null },
  { name: 'the sssnake SM6BK', th: 'https://www.thomann.fr/the_sssnake_sk233-6_mikrokabel.htm', wb: null },
  { name: 'Cordial CPM 2.5 FM', th: 'https://www.thomann.fr/cordial_cpm_25_fm_flex.htm', wb: null },
  { name: 'Cordial CPM 5 FM', th: 'https://www.thomann.fr/cordial_cpm_5_fm_flex.htm', wb: null },
  { name: 'Cordial CRM 5 FM-Gold', th: 'https://www.thomann.fr/cordial_crm_5_fm_gold.htm', wb: null },
  { name: 'Sommer Cable Stage 22', th: 'https://www.thomann.fr/sommer_cable_stage_22_sg04_0500.htm', wb: null },
  { name: 'Sommer Cable Galileo 238', th: 'https://www.thomann.fr/sommer_cable_galileo_238_50.htm', wb: null },
  { name: 'Rode XLR-3', th: 'https://www.thomann.fr/rode_xlr_3m_orange.htm', wb: null },
  { name: 'Rode XLR-3 Black', th: 'https://www.thomann.fr/rode_xlr_cable_3m_black.htm', wb: null },
  { name: 'Mogami 2534', th: 'https://www.thomann.fr/mogami_2534_neglex_quad_cable.htm', wb: null },

  // Traitement acoustique
  { name: 'Hofa Absorber Eco', th: 'https://www.thomann.fr/hofa_absorber_natural_grey.htm', wb: 'hofa-absorber-eco-grey-396504' },
  { name: 'Hofa Diffusor Natural', th: 'https://www.thomann.fr/hofa_diffusor_natural.htm', wb: 'hofa-diffusor-natural-396505' },
  { name: 't.akustik HiLo-P80', th: 'https://www.thomann.fr/the_takustik_hilo_p80.htm', wb: null },
  { name: 't.akustik Micscreen Flex', th: 'https://www.thomann.fr/t.akustik_micscreen_flex.htm', wb: null },
  { name: 'sE Electronics Reflexion Filter PRO', th: 'https://www.thomann.fr/se_electronics_reflexion_filter.htm', wb: null },
  { name: 'Aston Microphones Halo', th: 'https://www.thomann.fr/aston_microphones_halo.htm', wb: 'aston-microphones-halo-shadow-237519' },
  { name: 'Aston Microphones Halo Shadow', th: 'https://www.thomann.fr/aston_microphones_halo_shadow.htm', wb: 'aston-microphones-halo-shadow-237519' },
  { name: 't.akustik Basotect Pyramide 70', th: 'https://www.thomann.fr/the_takustik_pyramide_70_weiss.htm', wb: null },
  { name: 't.akustik WAS-7', th: 'https://www.thomann.fr/the_takustik_was_7_absorber_8er_set.htm', wb: null },
  { name: 'Elgato Wave Panels', th: 'https://www.thomann.fr/elgato_wave_panels_starter_black.htm', wb: null },
  { name: 'Elgato Wave Panels 2', th: 'https://www.thomann.fr/elgato_wave_panels_starter_set_black.htm', wb: null }
];

async function main() {
  for (const item of testUrls) {
    const thRes = fetchThomann(item.th);
    let wbRes = { status: 404, price: null, images: [] };
    if (item.wb) {
      wbRes = await fetchWoodbrass(item.wb);
    }
    console.log(`[${item.name}]`);
    console.log(`  TH: ${thRes.status} | ${thRes.price}€ | ${thRes.images.length} imgs | ${item.th}`);
    if (item.wb) {
      console.log(`  WB: ${wbRes.status} | ${wbRes.price}€ | ${wbRes.images.length} imgs | https://woodbrass.com/products/${item.wb}`);
    }
  }
}

main();
