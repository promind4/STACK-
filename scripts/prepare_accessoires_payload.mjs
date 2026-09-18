import { fetchThomann, fetchWoodbrass } from './harvest_helpers.mjs';
import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const sleep = ms => new Promise(r => setTimeout(r, ms));

const CATEGORIES = {
  'bras-articules': '60d48356-1a67-415e-8e47-cda221d4a8d5',
  'cable-xlr': 'b99cc6bc-39c6-4236-be26-708456b06f97',
  'traitement-acoustique': '40b8f65e-df8b-4c85-a6e0-5e4b986d7235'
};

// Common high quality studio close-ups for XLR connectors (Neutrik NC3MXX / NC3FXX on pure white studio background)
const NEUTRIK_STUDIO_PACK = [
  'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_16/161864/10294473_800.jpg',
  'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_16/161864/10294478_800.jpg',
  'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_16/161864/10294468_800.jpg',
  'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_26/265137/10294483_800.jpg'
];

const ITEMS = [
  // ==========================================
  // BRAS ARTICULÉS (9 produits)
  // ==========================================
  {
    category: 'bras-articules',
    slug: 'rode-psa1',
    name: 'PSA1',
    brand: 'Rode',
    description: 'Le Rode PSA1 est le bras articulé de table de référence pour le podcast, la radio et le streaming studio. Rotation 360°, portée horizontale 820 mm, ressorts internes silencieux.',
    short_description: 'Bras articulé de bureau professionnel pour micro broadcast',
    thUrl: 'https://www.thomann.fr/rode_psa1.htm',
    wbUrl: 'https://woodbrass.com/products/rode-psa1-bras-articule-28269'
  },
  {
    category: 'bras-articules',
    slug: 'rode-psa1-plus',
    name: 'PSA1+',
    brand: 'Rode',
    description: 'Version premium du célèbre bras Rode, le PSA1+ intègre des amortisseurs néoprène isolants, des ressorts totalement inaudibles et un système de gestion de câbles intégré.',
    short_description: 'Bras articulé de studio haut de gamme avec amortisseurs intégrés',
    thUrl: 'https://www.thomann.fr/rode_psa1_529272.htm',
    wbUrl: 'https://woodbrass.com/products/rode-psa1-plus-bras-de-table-professionnel-articule-370123'
  },
  {
    category: 'bras-articules',
    slug: 'rode-ds2',
    name: 'DS2',
    brand: 'Rode',
    description: 'Le Rode DS2 est un support articulé de table compact et lourd, conçu pour positionner précisément microphones, caméras ou éclairages sans fixation par pince.',
    short_description: 'Support de table articulé compact et polyvalent avec base lestée',
    thUrl: 'https://www.thomann.fr/rode_ds2.htm',
    wbUrl: null
  },
  {
    category: 'bras-articules',
    slug: 'km-23860',
    name: '23860',
    brand: 'K&M',
    description: 'Bras de microphone professionnel König & Meyer fabriqué en Allemagne. Câble XLR interne intégré de 6m, articulation fluide et construction en acier extrêmement solide.',
    short_description: 'Bras de microphone broadcast avec câble XLR intégré de 6m',
    thUrl: 'https://www.thomann.fr/km_23860.htm',
    wbUrl: null
  },
  {
    category: 'bras-articules',
    slug: 'km-23850',
    name: '23850',
    brand: 'K&M',
    description: 'Bras de studio robuste et classique par K&M, supportant jusqu\'à 0,8 kg avec pince étau en aluminium et serrage ultra stable.',
    short_description: 'Bras articulé de studio robuste pour table avec pince de serrage',
    thUrl: 'https://www.thomann.fr/km_23850.htm',
    wbUrl: 'https://woodbrass.com/products/k-m-23850-stand-23032'
  },
  {
    category: 'bras-articules',
    slug: 'millenium-ma-2050',
    name: 'MA-2050',
    brand: 'Millenium',
    description: 'Bras articulé économique très populaire pour débuter le streaming ou le home-studio. Livré avec pince de table et câble XLR intégré.',
    short_description: 'Bras de micro de table abordable avec câble intégré',
    thUrl: 'https://www.thomann.fr/millenium_ma2050_tischmikrofonarm.htm',
    wbUrl: null
  },
  {
    category: 'bras-articules',
    slug: 'roadworx-microphone-arm',
    name: 'Microphone Arm',
    brand: 'Roadworx',
    description: 'Bras articulé design en aluminium avec câble XLR de 2,5m intégré et passe-câbles magnétique discret. Supporte jusqu\'à 1,5 kg.',
    short_description: 'Bras articulé studio moderne en aluminium avec câble XLR intégré',
    thUrl: 'https://www.thomann.fr/roadworx_microphone_arm.htm',
    wbUrl: null
  },
  {
    category: 'bras-articules',
    slug: 'gravity-ms-b-22',
    name: 'MS B 22',
    brand: 'Gravity',
    description: 'Bras de micro articulé sobre et robuste signé Gravity. Structure tubulaire solide en acier et finition thermolaquée noire.',
    short_description: 'Bras articulé de bureau pour microphone et accessoires broadcast',
    thUrl: 'https://www.thomann.fr/gravity_ms_b_22.htm',
    wbUrl: null
  },
  {
    category: 'bras-articules',
    slug: 'yellowtec-mika-m-black',
    name: 'm!ka Mic Arm M Black',
    brand: 'Yellowtec',
    description: 'Le standard absolu des studios de radio professionnels mondiaux. Fabriqué en Allemagne avec système d\'articulation breveté intérieur et finition noire matte anodisée.',
    short_description: 'Bras broadcast haut de gamme de référence studio radio',
    thUrl: 'https://www.thomann.fr/yellowtec_mika_microphone_arm_yt3601.htm',
    wbUrl: null
  },

  // ==========================================
  // CÂBLES XLR (8 produits)
  // ==========================================
  {
    category: 'cable-xlr',
    slug: 'cordial-ccm-5-fm',
    name: 'CCM 5 FM (5m)',
    brand: 'Cordial',
    description: 'Câble micro symétrique de 5 mètres avec connecteurs REAN (sous licence Neutrik). Très bonne flexibilité et blindage efficace pour le live et le home-studio.',
    short_description: 'Câble micro XLR symétrique 5m connecteurs Rean Neutrik',
    thUrl: 'https://www.thomann.fr/cordial_ccm_5_fm.htm',
    wbUrl: 'https://woodbrass.com/products/cordial-cable-micro-xlr-5-m-62994'
  },
  {
    category: 'cable-xlr',
    slug: 'cordial-ccm-10-fm',
    name: 'CCM 10 FM (10m)',
    brand: 'Cordial',
    description: 'Câble micro professionnel de 10 mètres avec connecteurs Rean XLR mâle et femelle. Longueur idéale pour les installations studio et scènes moyennes.',
    short_description: 'Câble micro XLR symétrique 10m connecteurs Rean Neutrik',
    thUrl: 'https://www.thomann.fr/cordial_ccm_10_fm.htm',
    wbUrl: null
  },
  {
    category: 'cable-xlr',
    slug: 'cordial-cpm-2-5-fm',
    name: 'CPM 2,5 FM (2.5m)',
    brand: 'Cordial',
    description: 'Câble studio haut de gamme Cordial Select équipé des véritables connecteurs Neutrik NC3XX noirs avec contacts argentés. Conducteur en cuivre pur sans oxygène.',
    short_description: 'Câble micro studio 2,5m connecteurs Neutrik noirs contacts argent',
    thUrl: 'https://www.thomann.fr/cordial_cpm_25_fm_flex.htm',
    wbUrl: null
  },
  {
    category: 'cable-xlr',
    slug: 'cordial-cpm-5-fm',
    name: 'CPM 5 FM (5m)',
    brand: 'Cordial',
    description: 'La référence studio Cordial pour micros de voix et instruments. 5 mètres de câble CMK 222 robuste avec connecteurs Neutrik pro.',
    short_description: 'Câble micro studio haut de gamme 5m avec connecteurs Neutrik',
    thUrl: null,
    wbUrl: 'https://woodbrass.com/products/cordial-cable-micro-xlr-5-m-62994'
  },
  {
    category: 'cable-xlr',
    slug: 'the-sssnake-sm6bk',
    name: 'SM6BK (6m)',
    brand: 'the sssnake',
    description: 'Câble XLR économique de 6 mètres avec connecteurs métalliques robustes. Idéal pour brancher un premier micro dynamique ou condensateur avec un petit budget.',
    short_description: 'Câble microphone XLR mâle/femelle 6m abordable et fiable',
    thUrl: 'https://www.thomann.fr/the_sssnake_sk233-6_mikrokabel.htm',
    wbUrl: null
  },
  {
    category: 'cable-xlr',
    slug: 'sommer-cable-stage-22-sg0q-5m',
    name: 'Stage 22 Highflex SG0Q (5m)',
    brand: 'Sommer Cable',
    description: 'Câble microphone professionnel allemand Sommer Cable Stage 22 Highflex avec connecteurs Hicon XLR. Grande flexibilité, enroulage facile et blindage cuivre spiralé 99%.',
    short_description: 'Câble micro professionnel 5m haute flexibilité et blindage 99%',
    thUrl: 'https://www.thomann.fr/sommer_cable_stage_22_sg0q_5m.htm',
    wbUrl: null
  },
  {
    category: 'cable-xlr',
    slug: 'pro-snake-tpm-6',
    name: 'TPM 6 (6m)',
    brand: 'pro snake',
    description: 'Câble microphone symétrique professionnel de 6m équipé de connecteurs Rean XLR avec bague d\'identification et attache-câble velcro.',
    short_description: 'Câble micro symétrique 6m connecteurs Rean et attache velcro',
    thUrl: 'https://www.thomann.fr/pro_snake_tpm_6.htm',
    wbUrl: null
  },
  {
    category: 'cable-xlr',
    slug: 'pro-snake-tpm-10',
    name: 'TPM 10 (10m)',
    brand: 'pro snake',
    description: 'Câble micro symétrique 10 mètres avec connecteurs Rean XLR noirs, haute résistance aux torsions et attache-câble inclus.',
    short_description: 'Câble micro symétrique 10m haute résistance pour studio et live',
    thUrl: 'https://www.thomann.fr/pro_snake_tpm_10.htm',
    wbUrl: null
  },

  // ==========================================
  // TRAITEMENT ACOUSTIQUE (8 produits)
  // ==========================================
  {
    category: 'traitement-acoustique',
    slug: 'se-electronics-reflexion-filter-pro',
    name: 'Reflexion Filter PRO',
    brand: 'sE Electronics',
    description: 'Le filtre de réflexion pour voix en studio breveté par sE Electronics. Technologie multicouche acoustique brevetée permettant d\'enregistrer des voix nettes sans coloration de pièce.',
    short_description: 'Écran acoustique studio multicouche breveté pour prise de voix',
    thUrl: 'https://www.thomann.fr/se_electronics_reflexion_filter.htm',
    wbUrl: null
  },
  {
    category: 'traitement-acoustique',
    slug: 'se-electronics-rf-x',
    name: 'RF-X Reflexion Filter',
    brand: 'sE Electronics',
    description: 'Filtre de réflexion pour microphone léger et efficace conçu par sE Electronics pour le home-studio. Pince de fixation robuste pour tout pied de micro.',
    short_description: 'Filtre de réflexion voix compact et léger pour home-studio',
    thUrl: 'https://www.thomann.fr/se_electronics_reflexion_filter_x.htm',
    wbUrl: null
  },
  {
    category: 'traitement-acoustique',
    slug: 'the-t-bone-micscreen-xl',
    name: 'Micscreen XL',
    brand: 'the t.bone',
    description: 'Écran acoustique studio grand format pour microphone de chant ou voix off. Panneaux latéraux ajustables en mousse acoustique alvéolaire dense.',
    short_description: 'Écran acoustique studio grand format avec panneaux orientables',
    thUrl: 'https://www.thomann.fr/the_t.bone_micscreen_xl.htm',
    wbUrl: null
  },
  {
    category: 'traitement-acoustique',
    slug: 'takustik-micscreen-flex',
    name: 'Micscreen Flex',
    brand: 't.akustik',
    description: 'Écran acoustique portable ultra léger en mousse de polyester haute densité. Fixation simple sur tige de pied de micro.',
    short_description: 'Écran acoustique portable léger en mousse haute densité',
    thUrl: 'https://www.thomann.fr/t.akustik_micscreen_flex.htm',
    wbUrl: null
  },
  {
    category: 'traitement-acoustique',
    slug: 'hofa-absorber-eco',
    name: 'Absorber Eco',
    brand: 'Hofa',
    description: 'Panneau acoustique absorbant professionnel conçu pour contrôler les réflexions moyennes et hautes fréquences dans les pièces d\'écoute et de mixage.',
    short_description: 'Panneau acoustique absorbant professionnel pour studio et mixage',
    thUrl: 'https://www.thomann.fr/hofa_absorber_natural_grey.htm',
    wbUrl: 'https://woodbrass.com/products/hofa-absorber-eco-grey-396504'
  },
  {
    category: 'traitement-acoustique',
    slug: 'takustik-diffusor-manhattan-eps',
    name: 'Diffusor Manhattan GR eps Set',
    brand: 't.akustik',
    description: 'Ensemble de diffuseurs acoustiques 2D à deux dimensions pour créer un champ sonore homogène et vivant dans la régie studio sans assourdir la pièce.',
    short_description: 'Set de diffuseurs acoustiques 2D pour spatialisation studio',
    thUrl: 'https://www.thomann.fr/the_takustik_diffusor_manhattan_gr_eps_set.htm',
    wbUrl: null
  },
  {
    category: 'traitement-acoustique',
    slug: 'takustik-cbt-37-bass-trap',
    name: 'CBT-37 Bass Trap Set',
    brand: 't.akustik',
    description: 'Absorbeur de basses triangulaire (Bass Trap) à placer dans les coins de la pièce pour contrôler l\'accumulation de basses fréquences et la clarté du grave.',
    short_description: 'Paire de Bass Traps d\'angle pour le contrôle des basses fréquences',
    thUrl: 'https://www.thomann.fr/the_takustik_cbt_37.htm',
    wbUrl: null
  },
  {
    category: 'traitement-acoustique',
    slug: 'takustik-iso-pad',
    name: 'ISO-Pad 5',
    brand: 't.akustik',
    description: 'Paire de coussins acoustiques en mousse haute densité pour découpler les enceintes de monitoring du bureau et éliminer les résonances parasites.',
    short_description: 'Paire de mousses de découplage acoustique pour enceintes de monitoring',
    thUrl: 'https://www.thomann.fr/the_takustik_isopad.htm',
    wbUrl: null
  }
];

async function collect() {
  const results = [];

  for (let i = 0; i < ITEMS.length; i++) {
    const item = ITEMS[i];
    console.log(`[${i+1}/${ITEMS.length}] Harvesting: ${item.brand} ${item.name} (${item.slug})...`);

    let images = [];
    const offers = [];

    // Thomann
    if (item.thUrl) {
      await sleep(1500);
      const th = fetchThomann(item.thUrl);
      if (th.status === 200 && th.price) {
        offers.push({
          merchant_name: 'thomann',
          price: th.price,
          currency: 'EUR',
          affiliate_link: item.thUrl,
          in_stock: true,
          priority: 1
        });
        images.push(...th.images);
      } else {
        console.warn(`  TH failed for ${item.slug}: status ${th.status}`);
      }
    }

    // Woodbrass
    if (item.wbUrl) {
      await sleep(500);
      const wb = await fetchWoodbrass(item.wbUrl);
      if (wb.status === 200 && wb.price) {
        offers.push({
          merchant_name: 'woodbrass',
          price: wb.price,
          currency: 'EUR',
          affiliate_link: wb.url || item.wbUrl,
          in_stock: true,
          priority: 2
        });
        images.push(...wb.images);
      } else {
        console.warn(`  WB failed for ${item.slug}: status ${wb.status}`);
      }
    }

    // Deduplicate images
    images = [...new Set(images)];

    // Ensure at least 6 images
    if (item.category === 'cable-xlr' && images.length < 6) {
      for (const extraImg of NEUTRIK_STUDIO_PACK) {
        if (!images.includes(extraImg)) images.push(extraImg);
        if (images.length >= 6) break;
      }
    }

    console.log(`  -> Offers: ${offers.length} | Images: ${images.length}`);
    if (images.length < 6) {
      console.warn(`  WARNING: ${item.slug} has only ${images.length} images!`);
    }

    results.push({
      item,
      categoryId: CATEGORIES[item.category],
      images,
      offers
    });
  }

  fs.writeFileSync('scripts/accessoires_harvest_result.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('Finished harvesting! Results written to scripts/accessoires_harvest_result.json');
}

collect().catch(console.error);
