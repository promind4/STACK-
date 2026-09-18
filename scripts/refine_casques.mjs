import { spawnSync } from 'child_process';
import { fetchThomann, fetchWoodbrass } from './harvest_helpers.mjs';

const testUrls = [
  'https://www.thomann.fr/audio_technica_ath_r70xa.htm',
  'https://www.thomann.fr/audio_technica_ath_r70_xa.htm',
  'https://www.thomann.fr/shure_srh440a_efs.htm',
  'https://www.thomann.fr/sony_mdr_7506_pro.htm',
  'https://www.thomann.fr/sennheiser_hd_600_new.htm',
  'https://www.thomann.fr/sennheiser_hd_650_new.htm'
];

for (const u of testUrls) {
  const t = fetchThomann(u);
  console.log(u, '=>', t.status, 'images:', t.images.length, 'price:', t.price);
}
