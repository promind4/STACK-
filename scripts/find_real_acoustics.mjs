import { fetchThomann } from './harvest_helpers.mjs';

const acousticCandidates = [
  'hofa_absorber_natural_grey',
  'the_takustik_hilo_p80',
  't.akustik_micscreen_flex',
  't_akustik_micscreen_flex',
  'the_takustik_micscreen',
  'the_takustik_micscreen_flex',
  'se_electronics_reflexion_filter',
  'aston_microphones_halo_ghost',
  'the_takustik_was_7',
  'the_takustik_was7',
  'the_takustik_cbt_37',
  'the_takustik_sap80',
  'the_takustik_sap_80',
  'the_takustik_noppenschaum',
  'the_takustik_pyramiden_100_4er_set',
  'the_takustik_pyramide_100',
  'the_takustik_basotect_pyramide_70',
  'the_takustik_basotect_pyramide',
  'the_takustik_diffusor_manhattan_gr_eps',
  'the_takustik_spektrum_d30_diffusor',
  'vicoustic_vicpattern_ultra_wavewood',
  'vicoustic_cinema_round_premium',
  'hofa_diffusor_natural'
];

for (const slug of acousticCandidates) {
  const url = `https://www.thomann.fr/${slug}.htm`;
  const res = fetchThomann(url);
  if (res.status === 200) {
    console.log(`FOUND ACOUSTIC: ${slug} | Price: ${res.price}€ | Imgs: ${res.images.length}`);
  }
}
