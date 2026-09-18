import { fetchThomann } from './harvest_helpers.mjs';

const testCables = [
  'cordial_ccm_5_fm',
  'cordial_ccm_2_5_fm',
  'cordial_ccm_10_fm',
  'the_sssnake_sk233_6_mikrokabel',
  'the_sssnake_sk233-6_mikrokabel',
  'cordial_cpm_25_fm_flex',
  'cordial_cpm_5_fm_v',
  'cordial_cpm_5_fm_flex',
  'cordial_ctm_5_fm_black',
  'sommer_cable_stage_22_highflex_50',
  'sommer_cable_stage_22_sg04_0500',
  'sommer_cable_galileo_238_50',
  'sommer_cable_source_xlr_5_0m',
  'pro_snake_tpm_6',
  'pro_snake_tpm_10',
  'pro_snake_camera_cable_xlr_0_3',
  'pro_snake_audiomaster_xlr_5m',
  'mogami_2534_neglex_quad_cable',
  'mogami_2534_xlr_3m',
  'klotz_m2fm1_0500',
  'klotz_m1fm1k0500',
  'rode_xlr_cable_3m_black',
  'rode_xlr_cable_6m_black',
  'rode_xlr_3m_orange'
];

for (const slug of testCables) {
  const url = `https://www.thomann.fr/${slug}.htm`;
  const res = fetchThomann(url);
  if (res.status === 200) {
    console.log(`FOUND: ${slug} | Price: ${res.price}€ | Imgs: ${res.images.length}`);
  }
}
