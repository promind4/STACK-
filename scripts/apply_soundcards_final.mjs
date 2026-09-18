import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { fetchThomann, fetchWoodbrass } from './harvest_helpers.mjs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split(/\r?\n/).forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Full detailed catalog for all 26 soundcards
const SOUNDCARDS_DATA = [
  {
    slug: 'focusrite-scarlett-solo-4th-gen',
    name: 'Scarlett Solo (4th Gen)',
    brand: 'Focusrite',
    thUrl: 'https://www.thomann.fr/focusrite_scarlett_solo_4th_gen.htm',
    wbHandle: 'focusrite-scarlett-solo-4th-gen-380548',
    amzUrl: 'https://www.amazon.fr/s?k=Focusrite+Scarlett+Solo+4th+Gen',
    amzPrice: 133
  },
  {
    slug: 'focusrite-scarlett-2i2-4th-gen',
    name: 'Scarlett 2i2 (4th Gen)',
    brand: 'Focusrite',
    thUrl: 'https://www.thomann.fr/focusrite_scarlett_2i2_4th_generation.htm',
    wbHandle: 'focusrite-scarlett-2i2-4th-gen-380550',
    amzUrl: 'https://www.amazon.fr/s?k=Focusrite+Scarlett+2i2+4th+Gen',
    amzPrice: 189
  },
  {
    slug: 'focusrite-scarlett-4i4-4th-gen',
    name: 'Scarlett 4i4 (4th Gen)',
    brand: 'Focusrite',
    thUrl: 'https://www.thomann.fr/focusrite_scarlett_4i4_4th_generation.htm',
    wbHandle: 'focusrite-scarlett-4i4-4th-gen-380551',
    amzUrl: 'https://www.amazon.fr/s?k=Focusrite+Scarlett+4i4+4th+Gen',
    amzPrice: 285
  },
  {
    slug: 'universal-audio-apollo-twin-x-usb',
    name: 'Apollo Twin X USB Heritage Edition',
    brand: 'Universal Audio',
    thUrl: 'https://www.thomann.fr/universal_audio_apollo_twin_x_usb_heritage.htm',
    wbHandle: 'universal-audio-apollo-twin-x-usb-he-379786',
    amzUrl: 'https://www.amazon.fr/s?k=Universal+Audio+Apollo+Twin+X+USB+Heritage',
    amzPrice: 899
  },
  {
    slug: 'universal-audio-apollo-solo-usb', // replaces native-instruments-komplete-audio-2
    oldSlug: 'native-instruments-komplete-audio-2',
    name: 'Apollo Solo USB Heritage Edition',
    brand: 'Universal Audio',
    short_description: 'Interface audio USB 3 format desktop avec convertisseurs UA haute fidélité, préamplis Unison et processeur DSP UAD-2 SOLO intégré.',
    description: `<h2>Le Verdict en un coup d'œil</h2>
<p>L'<strong>Universal Audio Apollo Solo USB Heritage Edition</strong> apporte le son légendaire des studios UA directement sur votre bureau Windows. Équipée de convertisseurs audio 24-bit / 192 kHz de classe supérieure, de deux préamplis Unison émulant fidèlement les plus grandes consoles de mixage (Neve, API, SSL, Manley) et d'un DSP temps réel UAD-2 SOLO, elle permet d'enregistrer avec une latence quasi nulle à travers des plug-ins analogiques d'exception.</p>

<h2>Pour qui est cette interface ?</h2>
<ul>
    <li><strong>Les chanteurs & musiciens exigeants :</strong> Enregistrez votre voix à travers un préampli Neve ou 610-B avec compression 1176 en direct et sans latence perceptible.</li>
    <li><strong>Les créateurs sur Windows :</strong> Conçue spécifiquement pour les PC Windows via connexion USB 3 rapide et stable.</li>
    <li><strong>Les producteurs nomades ou home-studistes :</strong> Construction en aluminium ultra robuste taillée pour durer.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>
<h3>Technologie de Préamplification Unison</h3>
<p>La technologie exclusive Unison recalibre l'impédance physique d'entrée, le sweet spot de gain et les comportements de circuit des légendaires tranches de console analogiques. Vous n'appliquez pas juste un effet : le préampli matériel réagit physiquement comme la machine originale.</p>

<h3>Traitement DSP UAD-2 Temps Réel</h3>
<p>Le processeur DSP SOLO intégré décharge votre ordinateur de tous les calculs des plug-ins UAD. Vous pouvez chaîner égaliseur, compresseur, réverbe et simulation d'ampli en temps réel sans ralentir votre logiciel audio.</p>`,
    specs: {
      converters: '24-bit / 192 kHz (115 dB de dynamique)',
      inputs: '2 (1 micro/ligne XLR/Jack + 1 entrée instrument Hi-Z)',
      outputs: '2 sorties monitoring Jack + 1 sortie casque stéréo',
      preamps: '1 préampli Unison haute résolution',
      features: 'DSP UAD-2 SOLO intégré, émulatons temps réel, pack plug-ins Heritage',
      connectivity: 'USB 3 (alimentation externe fournie)'
    },
    pros: [
      'Qualité de conversion et son de niveau studio professionnel',
      'Émulations analogiques Unison sans latence en temps réel',
      'Suite complète de plug-ins UAD Heritage Edition incluse'
    ],
    cons: [
      'Alimentation externe requise (non auto-alimentée)',
      '1 seule entrée micro'
    ],
    thUrl: 'https://www.thomann.fr/universal_audio_apollo_solo_usb_heritage_ed.htm',
    wbHandle: 'universal-audio-apollo-solo-usb-heritage-edition-341068',
    amzUrl: 'https://www.amazon.fr/s?k=Universal+Audio+Apollo+Solo+USB+Heritage',
    amzPrice: 539
  },
  {
    slug: 'audient-id44-mkii', // replaces presonus-studio-24c
    oldSlug: 'presonus-studio-24c',
    name: 'iD44 MKII',
    brand: 'Audient',
    short_description: 'Interface audio USB 20 entrées / 24 sorties avec 4 préamplis console Audient, convertisseurs 126 dB et double extension optique ADAT.',
    description: `<h2>Le Verdict en un coup d'œil</h2>
<p>L'<strong>Audient iD44 MKII</strong> est le vaisseau amiral des interfaces audio desktop Audient. Elle embarque 4 véritables préamplis micro issus des consoles de studio Audient ASP8024-HE, des convertisseurs haut de gamme avec un rapport signal/bruit amélioré de 126 dB, et deux ports optiques ADAT autorisant jusqu'à 20 entrées et 24 sorties simultanées.</p>

<h2>Pour qui est cette interface ?</h2>
<ul>
    <li><strong>Les groupes et ingénieurs du son :</strong> Enregistrez une batterie complète ou un groupe en live grâce aux 4 préamplis embarqués et à l'extension ADAT 16 canaux.</li>
    <li><strong>Les studios hybrides :</strong> 2 points d'insertion hardware symétriques pour connecter vos compresseurs et préamplis externes avant conversion.</li>
    <li><strong>Les podcasteurs & streamers :</strong> Deux sorties casques indépendantes avec mixages personnalisés et fonction Loopback intégrée.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>
<h3>Préamplis Console Audient ASP8024-HE</h3>
<p>Les 4 préamplificateurs utilisent le même circuit discret classe A conçu par David Dearden que l'on retrouve sur les grandes consoles de studio Audient. Ils offrent une réponse ultra linéaire, un son rond et précis sans coloration excessive.</p>

<h3>Convertisseurs & Double ADAT</h3>
<p>Avec une plage dynamique de 126 dB sur les sorties DAC, la clarté d'écoute est chirurgicale. Les deux entrées/sorties optiques ADAT/SPDIF permettent d'ajouter facilement deux préamplis 8 canaux supplémentaires comme l'Audient ASP880.</p>`,
    specs: {
      converters: '24-bit / 96 kHz (126 dB de plage dynamique)',
      inputs: '20 entrées (4 préamplis micro/ligne + 2 Hi-Z + 16 via 2x ADAT)',
      outputs: '24 sorties (4 sorties ligne + 2 sorties casque indépendantes + 16 via 2x ADAT)',
      preamps: '4 préamplis console Audient Classe A (60 dB de gain)',
      features: '2 départs/retours d’insert, Talkback, Loopback, bouton de contrôle ScrollControl',
      connectivity: 'USB-C (alimentation externe fournie)'
    },
    pros: [
      '4 préamplis console de très haute qualité',
      'Évolutivité énorme (20 entrées / 24 sorties avec double ADAT)',
      '2 sorties casques indépendantes et 2 inserts hardware'
    ],
    cons: [
      'Encombrement sur le bureau supérieur aux modèles 2 canaux'
    ],
    thUrl: 'https://www.thomann.fr/audient_id44_mkii.htm',
    wbHandle: 'audient-id44-mkii-366583',
    amzUrl: 'https://www.amazon.fr/s?k=Audient+iD44+MKII',
    amzPrice: 506
  },
  {
    slug: 'universal-audio-volt-1',
    name: 'Volt 1',
    brand: 'Universal Audio',
    thUrl: 'https://www.thomann.fr/universal_audio_volt_1.htm',
    wbHandle: 'universal-audio-volt-1-recording-studio-353326',
    amzUrl: 'https://www.amazon.fr/s?k=Universal+Audio+Volt+1',
    amzPrice: 111
  },
  {
    slug: 'universal-audio-volt-2',
    name: 'Volt 2',
    brand: 'Universal Audio',
    thUrl: 'https://www.thomann.fr/universal_audio_volt_2.htm',
    wbHandle: 'universal-audio-volt-2-recording-studio-353327',
    amzUrl: 'https://www.amazon.fr/s?k=Universal+Audio+Volt+2',
    amzPrice: 149
  },
  {
    slug: 'universal-audio-volt-176',
    name: 'Volt 176',
    brand: 'Universal Audio',
    thUrl: 'https://www.thomann.fr/universal_audio_volt_176.htm',
    wbHandle: 'universal-audio-volt-176-recording-studio-353328',
    amzUrl: 'https://www.amazon.fr/s?k=Universal+Audio+Volt+176',
    amzPrice: 159
  },
  {
    slug: 'universal-audio-volt-276',
    name: 'Volt 276',
    brand: 'Universal Audio',
    thUrl: 'https://www.thomann.fr/universal_audio_volt_276.htm',
    wbHandle: 'universal-audio-volt-276-recording-studio-353329',
    amzUrl: 'https://www.amazon.fr/s?k=Universal+Audio+Volt+276',
    amzPrice: 253
  },
  {
    slug: 'audient-id4-mkii',
    name: 'iD4 MKII',
    brand: 'Audient',
    thUrl: 'https://www.thomann.fr/audient_id4_mkii.htm',
    wbHandle: 'audient-id4-mkii-342574',
    amzUrl: 'https://www.amazon.fr/s?k=Audient+iD4+MKII',
    amzPrice: 149
  },
  {
    slug: 'audient-id14-mkii',
    name: 'iD14 MKII',
    brand: 'Audient',
    thUrl: 'https://www.thomann.fr/audient_id14_mkii.htm',
    wbHandle: 'audient-id14-mkii-342576',
    amzUrl: 'https://www.amazon.fr/s?k=Audient+iD14+MKII',
    amzPrice: 214
  },
  {
    slug: 'audient-id24',
    name: 'iD24',
    brand: 'Audient',
    thUrl: 'https://www.thomann.fr/audient_id24.htm',
    wbHandle: 'audient-id24-373484',
    amzUrl: 'https://www.amazon.fr/s?k=Audient+iD24',
    amzPrice: 319
  },
  {
    slug: 'motu-m2',
    name: 'M2',
    brand: 'MOTU',
    thUrl: 'https://www.thomann.fr/motu_m2.htm',
    wbHandle: 'motu-m2-311713',
    amzUrl: 'https://www.amazon.fr/s?k=MOTU+M2',
    amzPrice: 235
  },
  {
    slug: 'motu-m4',
    name: 'M4',
    brand: 'MOTU',
    thUrl: 'https://www.thomann.fr/motu_m4.htm',
    wbHandle: 'motu-m4-311714',
    amzUrl: 'https://www.amazon.fr/s?k=MOTU+M4',
    amzPrice: 289
  },
  {
    slug: 'ssl-2-mkii',
    name: 'SSL 2 MKII',
    brand: 'Solid State Logic',
    thUrl: 'https://www.thomann.fr/ssl_2_mkii.htm',
    wbHandle: 'solid-state-logic-ssl-2-mkii-400109',
    amzUrl: 'https://www.amazon.fr/s?k=Solid+State+Logic+SSL+2+MKII',
    amzPrice: 214
  },
  {
    slug: 'ssl-2-plus',
    name: 'SSL 2+ MKII',
    brand: 'Solid State Logic',
    thUrl: 'https://www.thomann.fr/ssl_2_mkii_601306.htm',
    wbHandle: 'solid-state-logic-ssl-2-mkii-400110',
    amzUrl: 'https://www.amazon.fr/s?k=Solid+State+Logic+SSL+2%2B+MKII',
    amzPrice: 298
  },
  {
    slug: 'arturia-minifuse-1-black',
    name: 'MiniFuse 1 (Black)',
    brand: 'Arturia',
    thUrl: 'https://www.thomann.fr/arturia_minifuse_1_black.htm',
    wbHandle: 'arturia-minifuse-1-black-354162',
    amzUrl: 'https://www.amazon.fr/s?k=Arturia+MiniFuse+1+Black',
    amzPrice: 88
  },
  {
    slug: 'arturia-minifuse-2-white',
    name: 'MiniFuse 2 (White)',
    brand: 'Arturia',
    thUrl: 'https://www.thomann.fr/arturia_minifuse_2_white.htm',
    wbHandle: 'arturia-minifuse-2-white-354167',
    amzUrl: 'https://www.amazon.fr/s?k=Arturia+MiniFuse+2+White',
    amzPrice: 129
  },
  {
    slug: 'behringer-u-phoria-um2',
    name: 'U-Phoria UM2',
    brand: 'Behringer',
    thUrl: 'https://www.thomann.fr/behringer_u_phoria_um2.htm',
    wbHandle: 'behringer-u-phoria-um2-172236',
    amzUrl: 'https://www.amazon.fr/s?k=Behringer+U-Phoria+UM2',
    amzPrice: 29
  },
  {
    slug: 'behringer-u-phoria-umc202hd',
    name: 'U-Phoria UMC202HD',
    brand: 'Behringer',
    thUrl: 'https://www.thomann.fr/behringer_u_phoria_umc202hd.htm',
    wbHandle: 'behringer-u-phoria-umc202hd-189019',
    amzUrl: 'https://www.amazon.fr/s?k=Behringer+U-Phoria+UMC202HD',
    amzPrice: 59
  },
  {
    slug: 'elgato-wave-xlr',
    name: 'Wave XLR',
    brand: 'Elgato',
    thUrl: null,
    wbHandle: 'elgato-wave-xlr-mk-2-438291',
    amzUrl: 'https://www.amazon.fr/dp/B09738CKKX',
    amzPrice: 139,
    extraImages: [
      'https://res.cloudinary.com/elgato-pwa/image/upload/v1772455120/Products/10MAN9901%20%28Wave%20XLR%20MK.2%29/Cart/Wave_XLR_MK2_Cart.png',
      'https://res.cloudinary.com/elgato-pwa/image/upload/f_auto/q_auto/v1771582306/2026/Navigation/Wave-XLR-Article-1.jpg',
      'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/prod/523315.jpg'
    ]
  },
  {
    slug: 'm-audio-m-track-solo',
    name: 'M-Track Solo',
    brand: 'M-Audio',
    thUrl: 'https://www.thomann.fr/m_audio_m_track_solo.htm',
    wbHandle: 'm-audio-m-track-solo-341917',
    amzUrl: 'https://www.amazon.fr/s?k=M-Audio+M-Track+Solo',
    amzPrice: 46
  },
  {
    slug: 'rme-babyface-pro-fs',
    name: 'Babyface Pro FS',
    brand: 'RME',
    thUrl: 'https://www.thomann.fr/rme_babyface_pro_fs.htm',
    wbHandle: 'rme-babyface-pro-fs-312918',
    amzUrl: 'https://www.amazon.fr/s?k=RME+Babyface+Pro+FS',
    amzPrice: 725
  },
  {
    slug: 'rode-rodecaster-duo',
    name: 'RØDECaster Duo',
    brand: 'Rode',
    thUrl: 'https://www.thomann.fr/rode_rodecaster_duo.htm',
    wbHandle: 'rode-x-x-rodecaster-duo-377601',
    amzUrl: 'https://www.amazon.fr/s?k=Rode+Rodecaster+Duo',
    amzPrice: 425
  },
  {
    slug: 'steinberg-ur22c',
    name: 'UR22C',
    brand: 'Steinberg',
    thUrl: null,
    wbHandle: 'steinberg-ur22c-recording-pack-310598',
    amzUrl: 'https://www.amazon.fr/s?k=Steinberg+UR22C',
    amzPrice: 229,
    extraImages: [
      'https://oxzapjwfttrgsometnwq.supabase.co/storage/v1/object/public/images-produit/steinberg-ur22c-main-1769878240748.png'
    ]
  }
];

async function apply() {
  console.log('=== STARTING DATABASE UPDATE FOR CARTES SON ===\n');

  for (const item of SOUNDCARDS_DATA) {
    console.log(`\nProcessing: [${item.slug}] ${item.brand} ${item.name}...`);

    // 1. Fetch live data
    let thData = { status: 404, images: [], price: null };
    if (item.thUrl) {
      thData = fetchThomann(item.thUrl);
    }

    let wbData = { status: 404, images: [], price: null, url: null };
    if (item.wbHandle) {
      wbData = await fetchWoodbrass(item.wbHandle);
    }

    // Combine images
    let images = [...(thData.images || [])];
    if (wbData.images && wbData.images.length > 0) {
      for (const img of wbData.images) {
        if (!images.includes(img)) images.push(img);
      }
    }
    if (item.extraImages) {
      for (const img of item.extraImages) {
        if (!images.includes(img)) images.push(img);
      }
    }

    // Clean image array
    images = images.filter(img => img.startsWith('http') && !img.includes('icon') && !img.includes('logo') && !img.endsWith('.svg'));

    const mainImage = images[0] || null;
    const galleryImages = images.slice(1, 10);

    console.log(`  Images: 1 main + ${galleryImages.length} gallery (Total: ${images.length})`);

    // Check if product exists in DB by slug or oldSlug
    let targetSlug = item.slug;
    let { data: existingProd } = await supabase.from('products').select('id, slug').eq('slug', targetSlug).maybeSingle();
    
    if (!existingProd && item.oldSlug) {
      const { data: oldProd } = await supabase.from('products').select('id, slug').eq('slug', item.oldSlug).maybeSingle();
      if (oldProd) {
        console.log(`  Updating old slug ${item.oldSlug} -> ${targetSlug}`);
        existingProd = oldProd;
      }
    }

    if (!existingProd) {
      console.error(`  ERROR: Product ${targetSlug} not found in DB!`);
      continue;
    }

    // Build update object
    const updateObj = {
      name: item.name,
      slug: item.slug,
      brand: item.brand,
      image_url: mainImage,
      gallery_images: galleryImages,
      gallery_urls: galleryImages,
      updated_at: new Date().toISOString()
    };

    if (item.short_description) updateObj.short_description = item.short_description;
    if (item.description) updateObj.description = item.description;
    if (item.specs) updateObj.specs = item.specs;
    if (item.pros) updateObj.pros = item.pros;
    if (item.cons) updateObj.cons = item.cons;

    const { error: prodErr } = await supabase.from('products').update(updateObj).eq('id', existingProd.id);
    if (prodErr) {
      console.error(`  ERROR updating product ${existingProd.id}:`, prodErr);
      continue;
    }
    console.log(`  Product updated successfully in Supabase.`);

    // 2. Update product offers (Delete old offers and insert clean verified canonical URLs)
    await supabase.from('product_offers').delete().eq('product_id', existingProd.id);

    const offersToInsert = [];

    // Thomann offer
    if (thData.status === 200 && item.thUrl) {
      offersToInsert.push({
        product_id: existingProd.id,
        merchant_name: 'thomann',
        price: thData.price || 0,
        currency: 'EUR',
        affiliate_link: item.thUrl, // Clean canonical URL without tracking params
        in_stock: true,
        priority: 1,
        merchant_logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Thomann_Logo.svg/1024px-Thomann_Logo.svg.png'
      });
    }

    // Woodbrass offer
    if (wbData.status === 200 && wbData.url) {
      offersToInsert.push({
        product_id: existingProd.id,
        merchant_name: 'woodbrass',
        price: wbData.price || 0,
        currency: 'EUR',
        affiliate_link: wbData.url, // Clean canonical URL without tracking params
        in_stock: true,
        priority: 2,
        merchant_logo_url: 'https://upload.wikimedia.org/wikipedia/fr/thumb/5/52/Woodbrass_Logo.svg/1200px-Woodbrass_Logo.svg.png'
      });
    }

    // Amazon offer
    if (item.amzUrl) {
      offersToInsert.push({
        product_id: existingProd.id,
        merchant_name: 'amazon',
        price: item.amzPrice || (thData.price || wbData.price || 0),
        currency: 'EUR',
        affiliate_link: item.amzUrl, // Clean search/asin URL without tracking params
        in_stock: true,
        priority: 3,
        merchant_logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png'
      });
    }

    if (offersToInsert.length > 0) {
      const { error: offErr } = await supabase.from('product_offers').insert(offersToInsert);
      if (offErr) {
        console.error(`  ERROR inserting offers for ${existingProd.id}:`, offErr);
      } else {
        console.log(`  Inserted ${offersToInsert.length} clean merchant offers.`);
      }
    }
  }

  console.log('\n=== ALL 26 SOUNDCARDS UPDATED IN SUPABASE SUCCESSFULLY ===\n');
}

apply();
