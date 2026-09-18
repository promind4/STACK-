import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const PRODUCT_IMAGES = {
  // ─── USB MICROPHONES ──────────────────────────────────────────
  'elgato-wave-3': {
    primary: 'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/6f6b8efbc27522b4b0b38ea27d83fb4cd8db7b2d_ELGATO_ELGATOWAVE3.jpg?v=1789390969',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/6f6b8efbc27522b4b0b38ea27d83fb4cd8db7b2d_ELGATO_ELGATOWAVE3.jpg?v=1789390969',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/d953ac92f2d7cc273d9439e083b19e988c331363_ELGATO_ELGATOWAVE3_1.jpg?v=1789390968',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/98d69650bb91de568e7435f918448f94682e7eae_ELGATO_ELGATOWAVE3_2.jpg?v=1789390968',
      'https://res.cloudinary.com/elgato-pwa/image/upload/v1772454877/Products/10MAO9901%20%28Wave:3%20MK.2%29/Cart/Wave_3_MK2.png',
      'https://res.cloudinary.com/elgato-pwa/image/upload/f_auto/q_auto/v1772263730/Products/10MAO9901%20(Wave:3%20MK.2)/Explorer/Wave-3-MK2-Article_1.jpg',
      'https://res.cloudinary.com/elgato-pwa/image/upload/f_auto/q_auto/v1772263971/Products/10MAO9901%20(Wave:3%20MK.2)/Explorer/Wave-3-MK2-Article_2.jpg'
    ]
  },
  'elgato-wave-neo': {
    primary: 'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/dc54156dee2d9528caa910e94ca02c1733f6e494_ELGATO_ELGATOWAVENEO.jpg?v=1788185181',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/dc54156dee2d9528caa910e94ca02c1733f6e494_ELGATO_ELGATOWAVENEO.jpg?v=1788185181',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/7a7fb8bd2864bfbdc727f204a7fff259a83265a1_ELGATO_ELGATOWAVENEO_1.jpg?v=1788185181',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/97a20b5ae7ce5a197ac3132c688d792fb24db878_ELGATO_ELGATOWAVENEO_2.jpg?v=1788185181',
      'https://res.cloudinary.com/elgato-pwa/image/upload/v1712835251/Products/Neo%20Product%20Line/10MAI9901%20%28Wave%20Neo%29/ATF/ATF%20New%20Images/wave_neo_ATF_WEB_01.jpg',
      'https://res.cloudinary.com/elgato-pwa/image/upload/v1712835253/Products/Neo%20Product%20Line/10MAI9901%20%28Wave%20Neo%29/ATF/ATF%20New%20Images/wave_neo_ATF_WEB_02.jpg',
      'https://res.cloudinary.com/elgato-pwa/image/upload/v1712835253/Products/Neo%20Product%20Line/10MAI9901%20%28Wave%20Neo%29/ATF/ATF%20New%20Images/wave_neo_ATF_WEB_03.jpg'
    ]
  },
  'shure-mv6': {
    primary: 'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/ce4eab2c41665dd6d5a6a5108cb6596f0bdb3667_SSE_MV6.jpg?v=1789691615',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/ce4eab2c41665dd6d5a6a5108cb6596f0bdb3667_SSE_MV6.jpg?v=1789691615',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/9f215a3e5d49c6931067b5826bfa54c1249a1619_SSE_MV6_1.jpg?v=1789691616',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/a4eba4c30cad852245bf735512110f23446a27f2_SSE_MV6_2.jpg?v=1789691616',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/451d2b2833b3f17a3ddadc2cc4f93d02e2e61f93_SSE_MV6_3.jpg?v=1789691615',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/2de8e3215699c98bf0b0d54e3057ab58179de146_SSE_MV6_4.jpg?v=1789691616',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/94267f3a4d4eb43ba08f8267e15e6873bd6c1283_SSE_MV6_5.jpg?v=1789691616'
    ]
  },
  'rode-nt-usb-plus': {
    primary: 'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/a526aafd501f96bc33b98e2dd588f1e122c3a68e_RODE_NTUSBPLUS.jpg?v=1788184749',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/a526aafd501f96bc33b98e2dd588f1e122c3a68e_RODE_NTUSBPLUS.jpg?v=1788184749',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/2c54d65651e07865d81b549d62115ed984af1bc0_RODE_NTUSBPLUS_1.jpg?v=1788184749',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/06f1f14fd8f5e4515df751022d5283ff284c87a6_RODE_NTUSBPLUS_2.jpg?v=1788184749',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/e856ef534d14af0371ccf1de50994c4e3ebbfa76_RODE_NTUSBPLUS_3.jpg?v=1788184749',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/40c8b1f28e2c7f0f155cb9c851359af28ea66faf_RODE_NTUSBPLUS_4.jpg?v=1788184749',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/20f83dc26fbd47fa6793209ab07ad3a7080c7f92_RODE_NTUSBPLUS_5_f861c112-010d-4944-aaf6-589c58db295b.jpg?v=1788184749'
    ]
  },
  'hyperx-quadcast-s': {
    primary: 'https://cdn.shopify.com/s/files/1/0561/8345/5901/files/hyperx_quadcast_s_1_front_f8ac522c-c5f8-4769-9890-17da065f6540.jpg?v=1763563165',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0561/8345/5901/files/hyperx_quadcast_s_1_front_f8ac522c-c5f8-4769-9890-17da065f6540.jpg?v=1763563165',
      'https://cdn.shopify.com/s/files/1/0561/8345/5901/files/hyperx_quadcast_s_2_side_094bebe1-47ee-4336-bce3-41ee5b1e14ef.jpg?v=1763563165',
      'https://cdn.shopify.com/s/files/1/0561/8345/5901/files/hyperx_quadcast_s_3_back_3e1d1055-5e64-493a-b9b2-f17835995548.jpg?v=1763563165',
      'https://cdn.shopify.com/s/files/1/0561/8345/5901/files/hyperx_quadcast_s_4_angled.jpg?v=1763563165',
      'https://cdn.shopify.com/s/files/1/0561/8345/5901/files/hyperx_quadcast_s_5_mute.jpg?v=1763563165',
      'https://cdn.shopify.com/s/files/1/0561/8345/5901/files/hyperx_quadcast_s_6_back_features_df9c687a-3dfc-40bf-9bb7-f02df3bf1a29.jpg?v=1763563165'
    ]
  },
  'hyperx-solocast': {
    primary: 'https://cdn.shopify.com/s/files/1/0564/3612/9997/products/hyperx_solocast_01_main.jpg?v=1662449693',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0564/3612/9997/products/hyperx_solocast_01_main.jpg?v=1662449693',
      'https://cdn.shopify.com/s/files/1/0564/3612/9997/products/hyperx_solocast_02_side.jpg?v=1662449693',
      'https://cdn.shopify.com/s/files/1/0564/3612/9997/products/hyperx_solocast_03_tilted.jpg?v=1662449693',
      'https://cdn.shopify.com/s/files/1/0564/3612/9997/products/hyperx_solocast_04_back.jpg?v=1662449693',
      'https://cdn.shopify.com/s/files/1/0564/3612/9997/products/hyperx_solocast_05_angled.jpg?v=1662449693',
      'https://cdn.shopify.com/s/files/1/0564/3612/9997/products/hyperx_solocast_06_features.jpg?v=1662449693'
    ]
  },
  'blue-yeti': {
    primary: 'https://resource.logitechg.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/streaming-gear/yeti-premium-usb-microphone/2025/gallery/yeti-front-angle-silver-gallery-1.png',
    gallery: [
      'https://resource.logitechg.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/streaming-gear/yeti-premium-usb-microphone/2025/gallery/yeti-front-angle-silver-gallery-1.png',
      'https://resource.logitechg.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/streaming-gear/yeti-premium-usb-microphone/2025/gallery/yeti-3qtr-left-angle-silver-gallery-4.png',
      'https://resource.logitechg.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/streaming-gear/yeti-premium-usb-microphone/2025/gallery/yeti-3qtr-right-angle-silver-gallery-5.png',
      'https://resource.logitechg.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/streaming-gear/yeti-premium-usb-microphone/2025/gallery/yeti-profile-angle-silver-gallery-6.png',
      'https://resource.logitechg.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/streaming-gear/yeti-premium-usb-microphone/2025/gallery/yeti-back-angle-silver-gallery-7.png'
    ]
  },

  // ─── SHOTGUN MICROPHONES ──────────────────────────────────────
  'rode-ntg1': {
    primary: 'https://thumbs.static-thomann.de/thumb/orig/pics/bdb/_17/179392/12066531_800.jpg',
    gallery: [
      'https://thumbs.static-thomann.de/thumb/orig/pics/bdb/_17/179392/12066531_800.jpg',
      'https://thumbs.static-thomann.de/thumb/orig/pics/bdb/_17/179392/12066536_800.jpg',
      'https://thumbs.static-thomann.de/thumb/orig/pics/bdb/_17/179392/12066516_800.jpg',
      'https://thumbs.static-thomann.de/thumb/orig/pics/bdb/_17/179392/12066521_800.jpg',
      'https://thumbs.static-thomann.de/thumb/orig/pics/bdb/_17/179392/12066526_800.jpg',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/8fd2b571088b8cbef72f929f9f4d758349a0a7da_RODE_R100023.jpg?v=1788779623'
    ]
  },
  'rode-ntg2': {
    primary: 'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/fc0e68683c4afe018f2e540aa22c9afaffdf054d_RODE_NTG2_MICRO_BROADCAST.jpg?v=1788180396',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/fc0e68683c4afe018f2e540aa22c9afaffdf054d_RODE_NTG2_MICRO_BROADCAST.jpg?v=1788180396',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/913ce0d56ec07d96bc28245fce2d818ed2f0dfe0_RODE_NTG2_MICRO_BROADCAST_1_2a613390-d059-4333-9808-ce11bbf99843.jpg?v=1788180397',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/4e6bc909f65f99e0d4decb8ce6357f5fdded64c9_RODE_NTG2_MICRO_BROADCAST_2.jpg?v=1788180397',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/76e278c5a3c8addf8594d9ddde2fcfd18545d57f_RODE_NTG2_MICRO_BROADCAST_3_d602dbd1-87b6-481d-8bf4-d5fca42ca736.jpg?v=1788180397',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/3150c8c4831bd4250c5bd0f7cf95178dd83e7413_RODE_NTG2_MICRO_BROADCAST_4.jpg?v=1788180397',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/42868820cab4d1176ca3576e39f42e62e3fcbcea_RODE_NTG2_MICRO_BROADCAST_5.jpg?v=1788180396'
    ]
  },
  'rode-ntg4-plus': {
    primary: 'https://edge.rode.com//images/page/346/modules/1210/R%C3%98DE_NTG4+_FRONT_1080x1080.png',
    gallery: [
      'https://edge.rode.com//images/page/346/modules/1210/R%C3%98DE_NTG4+_FRONT_1080x1080.png',
      'https://edge.rode.com//images/page/346/modules/1210/R%C3%98DE_NTG4+_3_QUARTER_LEFT_FRONT_1080x1080.png',
      'https://edge.rode.com//images/page/346/modules/1210/R%C3%98DE_NTG4+_BACK_1080x1080.png',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/0c50837323b7288c8394f35507b782547f614e54_RODE_R100256.jpg?v=1788183439',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/458b99b2beaf8b57c6f65e5c2c2abe95a9147991_RODE_R100256_1_84811992-06a6-4acd-966e-4ea7e1bcedbb.jpg?v=1788183439',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/06b5f8bbcc5d06a5528a24fde05d1b3239553986_RODE_R100256_2_2d16ab10-8d0e-453a-90ba-716cc03d7e32.jpg?v=1788183439'
    ]
  },
  'rode-videomic-pro-plus': {
    primary: 'https://thumbs.static-thomann.de/thumb/orig/pics/bdb/_41/419329/14780806_800.jpg',
    gallery: [
      'https://thumbs.static-thomann.de/thumb/orig/pics/bdb/_41/419329/14780806_800.jpg',
      'https://thumbs.static-thomann.de/thumb/orig/pics/bdb/_41/419329/14780811_800.jpg',
      'https://thumbs.static-thomann.de/thumb/orig/pics/bdb/_41/419329/14780816_800.jpg',
      'https://thumbs.static-thomann.de/thumb/orig/pics/bdb/_41/419329/14780821_800.jpg',
      'https://thumbs.static-thomann.de/thumb/orig/pics/bdb/_41/419329/14780826_800.jpg',
      'https://thumbs.static-thomann.de/thumb/orig/pics/bdb/_41/419329/14780836_800.jpg',
      'https://thumbs.static-thomann.de/thumb/orig/pics/bdb/_41/419329/14780846_800.jpg',
      'https://thumbs.static-thomann.de/thumb/orig/pics/bdb/_41/419329/14780856_800.jpg'
    ]
  },
  'rode-videomic-ntg': {
    primary: 'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/626438432fbaac08a143174e6310b36dfb9d6bbb_4RODE_NTG.jpg?v=1788184742',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/626438432fbaac08a143174e6310b36dfb9d6bbb_4RODE_NTG.jpg?v=1788184742',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/26c092285fe5db8239a2820775ab946db8f315d5_4RODE_NTG_1.jpg?v=1788184742',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/a0954795057fcc6b6139a9cfd6e8fb3f04cd582a_4RODE_NTG_2.jpg?v=1788184742',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/f7492c833d6aebe83aeeb4a67513cb42414c9559_4RODE_NTG_3.jpg?v=1788184742',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/b70471d5265b6ff7505de0ae13b264107f440fa6_4RODE_NTG_4_bcbecbcf-bb23-4cce-a1dc-511fb999464f.jpg?v=1788184742',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/6550b1372e920007eb06d5fc75eff946895ec624_4RODE_NTG_5_26a1c278-d874-474f-8985-34c3658e49b5.jpg?v=1788184742'
    ]
  },
  'audio-technica-at875r': {
    primary: 'https://www.audio-technica.com/media/catalog/product/cache/4c54125f062bf26160bb6e241a5e0899/a/t/at875r_01.png',
    gallery: [
      'https://www.audio-technica.com/media/catalog/product/cache/4c54125f062bf26160bb6e241a5e0899/a/t/at875r_01.png',
      'https://www.audio-technica.com/media/catalog/product/cache/4c54125f062bf26160bb6e241a5e0899/a/t/at875r_02.png',
      'https://www.audio-technica.com/media/catalog/product/cache/4c54125f062bf26160bb6e241a5e0899/a/t/at875r_03.png',
      'https://www.audio-technica.com/media/catalog/product/cache/4c54125f062bf26160bb6e241a5e0899/a/t/at875r_04.png',
      'https://www.audio-technica.com/media/catalog/product/cache/4c54125f062bf26160bb6e241a5e0899/a/t/at875r_05.png',
      'https://www.audio-technica.com/media/catalog/product/cache/4c54125f062bf26160bb6e241a5e0899/a/t/at875r_06.png'
    ]
  },
  'audio-technica-at897': {
    primary: 'https://www.audio-technica.com/media/catalog/product/cache/4c54125f062bf26160bb6e241a5e0899/a/t/at897_01.png',
    gallery: [
      'https://www.audio-technica.com/media/catalog/product/cache/4c54125f062bf26160bb6e241a5e0899/a/t/at897_01.png',
      'https://www.audio-technica.com/media/catalog/product/cache/4c54125f062bf26160bb6e241a5e0899/a/t/at897_02.png',
      'https://www.audio-technica.com/media/catalog/product/cache/4c54125f062bf26160bb6e241a5e0899/a/t/at897_03.png',
      'https://www.audio-technica.com/media/catalog/product/cache/4c54125f062bf26160bb6e241a5e0899/a/t/at897_04.png',
      'https://www.audio-technica.com/media/catalog/product/cache/4c54125f062bf26160bb6e241a5e0899/a/t/at897_05.png',
      'https://www.audio-technica.com/media/catalog/product/cache/4c54125f062bf26160bb6e241a5e0899/a/t/at897_06.png'
    ]
  },
  'sennheiser-mke-400-mkii': {
    primary: 'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/badfe8b3d2d80b4fbd8415dcedd35e7aab6b543f_SENNHEISER_508898.jpg?v=1788196215',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/badfe8b3d2d80b4fbd8415dcedd35e7aab6b543f_SENNHEISER_508898.jpg?v=1788196215',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/1cfc75c0b892ecb07d87f6d09a701df374427fb3_SENNHEISER_508898_1.jpg?v=1788196215',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/984eaf44ded045f027c851ed0341d0445c4d0155_SENNHEISER_508898_2.jpg?v=1788196215',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/56c99c8c5e4b838bba1e1e2c25dce39995459a70_SENNHEISER_508898_3.jpg?v=1788196216',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/9de462b42255473d5d36e8bd2c3feb0a78bf9b11_SENNHEISER_508898_4.jpg?v=1788196215',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/4a22248e3caaec7edce96a4664fe75c86f1701a2_SENNHEISER_508898_5.jpg?v=1788196215'
    ]
  },
  'sennheiser-mke-200': {
    primary: 'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/c5c3d526968b9a6d435d24503115f15bc701fbae_SENNHEISER_MKE_200.jpg?v=1788180396',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/c5c3d526968b9a6d435d24503115f15bc701fbae_SENNHEISER_MKE_200.jpg?v=1788180396',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/4d7a54c71d2bef8910c43f31b7bb403480043495_SENNHEISER_MKE_200_1.jpg?v=1788180396',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/eec2e14f0a1d188cd64d034f720b5c43cc0557df_SENNHEISER_MKE_200_2.jpg?v=1788180396',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/4a25fecb5e9bad74d4e4fd698661dc5673427b72_SENNHEISER_MKE_200_3.jpg?v=1788180396',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/6aa1dbb48df29fb4c997c2201a8fd25ae88e97ba_SENNHEISER_MKE_200_4.jpg?v=1788180396',
      'https://cdn.shopify.com/s/files/1/0984/0872/6803/files/59b427b05f158278608b35bbfe4d114733a5f066_SENNHEISER_MKE_200_5.jpg?v=1788180396'
    ]
  }
};

async function applyImages() {
  console.log('Applying authentic images and galleries to Supabase products...');
  for (const [slug, imgData] of Object.entries(PRODUCT_IMAGES)) {
    const { data, error } = await supabase
      .from('products')
      .update({
        image_url: imgData.primary,
        gallery_images: imgData.gallery
      })
      .eq('slug', slug)
      .select('id, name, slug, image_url, gallery_images');

    if (error) {
      console.error(`Error updating ${slug}:`, error.message);
    } else if (!data || data.length === 0) {
      console.warn(`Product not found for slug: ${slug}`);
    } else {
      console.log(`✓ Updated [${slug}] - ${data[0].name}: primary image set, ${data[0].gallery_images.length} gallery images.`);
    }
  }
  console.log('\nAll products updated successfully!');
}

applyImages();
