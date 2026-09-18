import { fetchThomann, fetchWoodbrass } from './harvest_helpers.mjs';

const list = [
  { slug: 'kali-audio-in-5', url: 'https://www.thomann.fr/kali_audio_in_5.htm', alt: 'https://www.thomann.fr/kali_audio_in_5_2nd_wave.htm' },
  { slug: 'ik-multimedia-iloud-micro-monitor', url: 'https://www.thomann.fr/ik_multimedia_iloud_micro_monitor.htm' },
  { slug: 'ik-multimedia-iloud-mtm-mkii', url: 'https://www.thomann.fr/ik_multimedia_iloud_mtm_mkii.htm' },
  { slug: 'presonus-eris-3-5-2nd-gen', url: 'https://www.thomann.fr/presonus_eris_3.5_2nd_gen.htm' },
  { slug: 'genelec-8030-cp', url: 'https://www.thomann.fr/genelec_8030_cp.htm' },
  { slug: 'jbl-305p-mkii', wbHandle: 'jbl-305p-mkii-264652' }
];

async function run() {
  for (const item of list) {
    if (item.url) {
      let t = fetchThomann(item.url);
      if (t.status !== 200 && item.alt) t = fetchThomann(item.alt);
      console.log(item.slug, 'TH status:', t.status, 'price:', t.price, 'images:', t.images.length);
    }
    if (item.wbHandle) {
      const w = await fetchWoodbrass(item.wbHandle);
      console.log(item.slug, 'WB status:', w.status, 'price:', w.price, 'images:', w.images.length);
    }
    await new Promise(r => setTimeout(r, 600));
  }
}

run();
