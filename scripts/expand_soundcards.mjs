import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const NEW_SOUNDCARDS = [
  {
    slug: 'focusrite-scarlett-4i4-4th-gen',
    name: 'Scarlett 4i4 (4th Gen)',
    brand: 'Focusrite',
    short_description: 'Interface audio USB-C 4 entrées / 4 sorties avec convertisseurs 120 dB, mode Air enrichi, Auto Gain et Clip Safe.',
    description: `<h2>Le Verdict en un coup d'œil</h2>
<p>La <strong>Focusrite Scarlett 4i4 4th Gen</strong> est l'interface audio polyvalente de référence pour les home-studios modernes et les créateurs exigeants. Avec 4 entrées et 4 sorties, des convertisseurs RedNet professionnels offrant 120 dB de dynamique et les fonctions intelligentes Auto Gain et Clip Safe, elle élimine toute saturation numérique.</p>

<h2>Pour qui est cette interface ?</h2>
<ul>
    <li><strong>Les home-studistes polyvalents :</strong> Idéale pour brancher simultanément un micro voix, une guitare et un synthétiseur stéréo sans jamais débrancher de câbles.</li>
    <li><strong>Les podcasters & streamers à deux :</strong> Enregistrez deux animateurs avec réglage automatique du gain et sorties casques dédiées.</li>
    <li><strong>Les producteurs de musique électronique :</strong> 4 sorties ligne pour intégrer des processeurs d'effets externes ou deux paires d'enceintes de monitoring.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>
<h3>Convertisseurs & Préamplis RedNet</h3>
<p>Hérités des interfaces de studio haut de gamme RedNet de Focusrite, les convertisseurs 24-bit / 192 kHz offrent 120 dB de plage dynamique. Le niveau de bruit est quasi nul (EIN de -127 dBu). Le mode Air intègre désormais deux étages : une présence d'aigus soyeuse et une saturation harmonique analogique qui donne du corps immédiat aux voix.</p>

<h3>Fonctionnalités Intelligentes : Auto Gain & Clip Safe</h3>
<p>La 4i4 écoute votre signal pendant 10 secondes et calibre le gain idéal. La technologie Clip Safe ajuste en temps réel le niveau si vous criez ou jouez plus fort, évitant tout écrêtage destructeur.</p>

<h2>Spécifications Clés</h2>
<ul>
    <li>4 entrées (2 combinées XLR/Jack en façade + 2 entrées ligne symétriques à l'arrière)</li>
    <li>4 sorties ligne symétriques + 1 sortie casque indépendante haute puissance</li>
    <li>Entrée et sortie MIDI 5 broches standard</li>
    <li>Fonction Loopback stéréo pour le streaming</li>
</ul>`,
    image_url: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/prod/573215.jpg',
    specs: {
      converters: '24-bit / 192 kHz (120 dB de dynamique)',
      inputs: '4 (2 micro/ligne/instrument + 2 ligne)',
      outputs: '4 sorties ligne + 1 sortie casque',
      preamps: '2 préamplis Scarlett 4th Gen (69 dB de gain)',
      features: 'Auto Gain, Clip Safe, Mode Air, Loopback, MIDI I/O',
      connectivity: 'USB-C alimenté'
    },
    pros: [
      'Plage dynamique exceptionnelle de 120 dB',
      'Auto Gain et Clip Safe très efficaces',
      '4 entrées et 4 sorties + MIDI complet'
    ],
    cons: [
      'Nécessite le logiciel Focusrite Control 2 pour le routing avancé'
    ],
    rating: 4.8,
    review_count: 140,
    is_active: true,
    offers: [
      { merchant_name: 'thomann', price: 269, affiliate_link: 'https://www.thomann.fr/focusrite_scarlett_4i4_4th_gen.htm?partner_id=58130' },
      { merchant_name: 'woodbrass', price: 285, affiliate_link: 'https://woodbrass.com/products/focusrite-scarlett-4i4-4th-gen-380551?af=3524' },
      { merchant_name: 'amazon', price: 269, affiliate_link: 'https://www.amazon.fr/s?k=Focusrite+Scarlett+4i4+4th+Gen&tag=stackera-21' }
    ]
  },
  {
    slug: 'universal-audio-apollo-twin-x-usb',
    name: 'Apollo Twin X USB Heritage Edition',
    brand: 'Universal Audio',
    short_description: 'Interface audio USB 3 haut de gamme 10x6 avec traitement DSP UAD-2 DUO Core en temps réel et préamplis Unison.',
    description: `<h2>Le Verdict en un coup d'œil</h2>
<p>L'<strong>Universal Audio Apollo Twin X USB</strong> transpose la qualité studio légendaire d'UA sur Windows. Grâce à ses convertisseurs d'élite (127 dB de dynamique), ses 2 préamplis Unison émulant fidèlement les tranches Neve, SSL et API, et son DSP interne traitant les plug-ins à latence quasi nulle, c'est l'étalon-or des interfaces compactes professionnelles.</p>

<h2>Pour qui est cette interface ?</h2>
<ul>
    <li><strong>Les chanteurs & musiciens pros :</strong> Enregistrez à travers des compresseurs 1176, égaliseurs Pultec et préamplis Neve sans la moindre latence perceptible (< 2ms).</li>
    <li><strong>Les producteurs exigeants sur PC Windows :</strong> Version nativement optimisée pour l'USB 3 sous Windows.</li>
    <li><strong>Les mixeurs nomades :</strong> Écoute ultra-précise sur moniteurs et casques grâce aux convertisseurs D/A de classe mastering.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>
<h3>Technologie Unison Révolutionnaire</h3>
<p>Contrairement aux simples émulations logicielles, la technologie Unison modifie physiquement l'impédance d'entrée et le comportement analogique du circuit pour reproduire au millimètre le son des consoles vintage de légende.</p>

<h3>DSP UAD-2 DUO Intégré</h3>
<p>Le double processeur DSP décharge totalement le processeur de votre ordinateur et calcule les plug-ins d'effets directement dans l'interface, garantissant une stabilité sans faille pendant vos prises.</p>`,
    image_url: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/prod/572535.jpg',
    specs: {
      converters: '24-bit / 192 kHz (127 dB D/A)',
      inputs: '10 entrées (2 Unison XLR/Jack + 1 Hi-Z + 8 optiques ADAT)',
      outputs: '6 sorties (2 Monitor + 2 Line + 1 Casque)',
      dsp: 'UAD-2 DUO Core temps réel',
      connectivity: 'USB 3.0 (Type-C) Windows'
    },
    pros: [
      'Conversion et préamplis Unison de classe mondiale',
      'Traitement DSP temps réel à latence quasi nulle',
      'Pack de plug-ins UAD Heritage Edition inclus'
    ],
    cons: [
      'Tarif premium réservé aux budgets pro',
      'Nécessite une alimentation externe (fournie)'
    ],
    rating: 4.9,
    review_count: 85,
    is_active: true,
    offers: [
      { merchant_name: 'woodbrass', price: 899, affiliate_link: 'https://woodbrass.com/products/universal-audio-apollo-twin-x-usb-he-379786?af=3524' },
      { merchant_name: 'thomann', price: 989, affiliate_link: 'https://www.thomann.fr/universal_audio_apollo_twin_x_usb_he.htm?partner_id=58130' },
      { merchant_name: 'amazon', price: 989, affiliate_link: 'https://www.amazon.fr/s?k=Universal+Audio+Apollo+Twin+X+USB&tag=stackera-21' }
    ]
  },
  {
    slug: 'motu-m4',
    name: 'M4',
    brand: 'MOTU',
    short_description: 'Interface audio USB-C 4x4 avec convertisseurs ESS Sabre32 Ultra, écran couleur LCD et latence ultra-faible.',
    description: `<h2>Le Verdict en un coup d'œil</h2>
<p>La <strong>MOTU M4</strong> surclasse sa catégorie par sa clarté sonore et son ergonomie. Dotée des prestigieux convertisseurs ESS Sabre32 Ultra DAC (les mêmes que dans les équipements de mastering) et d'un écran LCD couleur affichant les vumètres de tous les canaux, elle apporte une précision visuelle et sonore rare sous la barre des 300 €.</p>

<h2>Pour qui est cette interface ?</h2>
<ul>
    <li><strong>Les créateurs de contenu & streamers :</strong> Fonction Loopback matérielle avec canaux dédiés pour mixer micro et sons de jeu sans logiciel tiers.</li>
    <li><strong>Les musiciens avec synthés :</strong> 4 entrées et 4 sorties avec mixage direct matériel en façade.</li>
    <li><strong>Les mélomanes et ingénieurs du son :</strong> Amplificateur casque ultra-transparent et dynamique de 120 dB.</li>
</ul>`,
    image_url: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/prod/478036.jpg',
    specs: {
      converters: 'ESS Sabre32 Ultra DAC (120 dB)',
      inputs: '4 (2 micro/ligne/guitare XLR/Jack + 2 ligne symétriques)',
      outputs: '4 sorties symétriques Jack + 4 sorties RCA + 1 casque',
      display: 'Écran LCD couleur avec bargraphes détaillés',
      connectivity: 'USB-C alimenté + MIDI I/O'
    },
    pros: [
      'Écran LCD couleur avec niveaux précis en façade',
      'Convertisseurs ESS Sabre32 d’une clarté remarquable',
      'Bouton de monitoring matériel et loopback performant'
    ],
    cons: [
      'Châssis compact qui chauffe légèrement en usage intensif'
    ],
    rating: 4.8,
    review_count: 210,
    is_active: true,
    offers: [
      { merchant_name: 'thomann', price: 279, affiliate_link: 'https://www.thomann.fr/motu_m4.htm?partner_id=58130' },
      { merchant_name: 'woodbrass', price: 289, affiliate_link: 'https://woodbrass.com/products/motu-m4-311714?af=3524' },
      { merchant_name: 'amazon', price: 279, affiliate_link: 'https://www.amazon.fr/s?k=MOTU+M4&tag=stackera-21' }
    ]
  },
  {
    slug: 'arturia-minifuse-1-black',
    name: 'MiniFuse 1 (Black)',
    brand: 'Arturia',
    short_description: 'Interface audio USB compacte 1 entrée / 2 sorties avec hub USB intégré et garantie 5 ans.',
    description: `<h2>Le Verdict en un coup d'œil</h2>
<p>L'<strong>Arturia MiniFuse 1</strong> est l'interface nomade idéale pour les chanteurs, guitaristes et créateurs solo. Robuste, élégante et dotée d'une dynamique de 110 dB, elle se distingue par un hub USB intégré à l'arrière pour brancher votre clavier maître ou clé USB, ainsi qu'une garantie constructeur exceptionnelle de 5 ans.</p>`,
    image_url: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/prod/529005.jpg',
    specs: {
      converters: '24-bit / 192 kHz (110 dB)',
      inputs: '1 combinée micro/instrument XLR/Jack',
      outputs: '2 sorties ligne Jack + 1 sortie casque',
      hub: '1 port USB-A intégré (hub pass-through)',
      connectivity: 'USB-C alimenté'
    },
    pros: [
      'Hub USB-A très pratique pour ordinateur portable',
      'Garantie constructeur de 5 ans',
      'Pack logiciel Arturia & Ableton Live Lite inclus'
    ],
    cons: [
      'Une seule entrée micro/instrument'
    ],
    rating: 4.7,
    review_count: 95,
    is_active: true,
    offers: [
      { merchant_name: 'woodbrass', price: 88, affiliate_link: 'https://woodbrass.com/products/arturia-minifuse-1-black-354162?af=3524' },
      { merchant_name: 'amazon', price: 95, affiliate_link: 'https://www.amazon.fr/s?k=Arturia+MiniFuse+1+Black&tag=stackera-21' },
      { merchant_name: 'thomann', price: 98, affiliate_link: 'https://www.thomann.fr/arturia_minifuse_1_black.htm?partner_id=58130' }
    ]
  },
  {
    slug: 'ssl-2-mkii',
    name: 'SSL 2 MKII',
    brand: 'Solid State Logic',
    short_description: 'Interface USB-C 2 entrées / 2 sorties nouvelle génération avec convertisseurs 32-bit / 192 kHz et mode Legacy 4K.',
    description: `<h2>Le Verdict en un coup d'œil</h2>
<p>La <strong>Solid State Logic SSL 2 MKII</strong> réinvente l'interface compacte de studio. Avec l'adoption de convertisseurs de pointe 32-bit / 192 kHz (120 dB de plage dynamique), des entrées instrument repositionnées en façade et le légendaire mode <strong>Legacy 4K</strong> apportant la brillance des consoles SSL série 4000, elle offre un son studio immédiat.</p>`,
    image_url: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/prod/601305.jpg',
    specs: {
      converters: '32-bit / 192 kHz (120 dB D/A)',
      inputs: '2 micro/ligne/instrument avec switch 4K',
      outputs: '2 sorties Jack symétriques + 1 sortie casque',
      preamps: '2 préamplis SSL ultra-faible bruit (64 dB de gain)',
      connectivity: 'USB-C alimenté'
    },
    pros: [
      'Convertisseurs 32-bit / 192 kHz d’une fidélité redoutable',
      'Touche Legacy 4K apportant chaleur et brillance analogique',
      'Design ergonomique inspiré des consoles de mixage'
    ],
    cons: [
      'Pas de port MIDI physique'
    ],
    rating: 4.9,
    review_count: 110,
    is_active: true,
    offers: [
      { merchant_name: 'woodbrass', price: 214, affiliate_link: 'https://woodbrass.com/products/solid-state-logic-ssl-2-mkii-400109?af=3524' },
      { merchant_name: 'thomann', price: 219, affiliate_link: 'https://www.thomann.fr/ssl_2_mkii.htm?partner_id=58130' },
      { merchant_name: 'amazon', price: 219, affiliate_link: 'https://www.amazon.fr/s?k=SSL+2+MKII&tag=stackera-21' }
    ]
  },
  {
    slug: 'audient-id24',
    name: 'iD24',
    brand: 'Audient',
    short_description: 'Interface audio USB-C 10x14 avec préamplis console Audient, inserts symétriques et extension ADAT.',
    description: `<h2>Le Verdict en un coup d'œil</h2>
<p>L'<strong>Audient iD24</strong> s'adresse aux producteurs et ingénieurs du son qui recherchent une console de studio au format bureau. Elle embarque deux préamplis micros de console de classe A, des convertisseurs 32-bit (126 dB de dynamique) et surtout deux inserts symétriques pour brancher directement vos compresseurs ou préamplis analogiques matériels avant conversion.</p>`,
    image_url: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/prod/559816.jpg',
    specs: {
      converters: '32-bit / 96 kHz (126 dB)',
      inputs: '2 préamplis micro classe A + 1 entrée JFET Hi-Z + ADAT optique (jusqu’à 10 entrées)',
      outputs: '4 sorties ligne + 2 sorties casques indépendantes',
      inserts: '2 départs et retours symétriques',
      connectivity: 'USB-C'
    },
    pros: [
      'Inserts analogiques pour intégrer du hardware externe',
      '2 vraies sorties casques indépendantes',
      'Qualité des préamplis micro console Audient'
    ],
    cons: [
      'Nécessite de la place sur le bureau'
    ],
    rating: 4.8,
    review_count: 65,
    is_active: true,
    offers: [
      { merchant_name: 'woodbrass', price: 319, affiliate_link: 'https://woodbrass.com/products/audient-id24-373484?af=3524' },
      { merchant_name: 'thomann', price: 329, affiliate_link: 'https://www.thomann.fr/audient_id24.htm?partner_id=58130' },
      { merchant_name: 'amazon', price: 335, affiliate_link: 'https://www.amazon.fr/s?k=Audient+iD24&tag=stackera-21' }
    ]
  },
  {
    slug: 'elgato-wave-xlr',
    name: 'Wave XLR',
    brand: 'Elgato',
    short_description: 'Interface audio USB-C compacte spécialement pensée pour le streaming avec gain 75 dB et mixeur virtuel Wave Link.',
    description: `<h2>Le Verdict en un coup d'œil</h2>
<p>L'<strong>Elgato Wave XLR</strong> est la référence absolue des streamers et créateurs vidéo. Dotée d'un préampli ultra-puissant délivrant jusqu'à 75 dB de gain (parfait pour alimenter un Shure SM7B sans Cloudlifter) et de la technologie anti-distorsion <strong>Clipguard</strong>, elle est sublimée par le logiciel de mixage virtuel Wave Link.</p>`,
    image_url: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/prod/523315.jpg',
    specs: {
      gain: 'Jusqu’à 75 dB de gain ultra-silencieux',
      inputs: '1 entrée micro XLR avec 48V',
      outputs: '1 sortie casque mini-jack avec zéro latence',
      features: 'Technologie Clipguard, bouton mute capacitif, Wave Link',
      connectivity: 'USB-C'
    },
    pros: [
      'Gain colossal de 75 dB (inutile d’acheter un préampli en ligne)',
      'Bouton mute capacitif silencieux avec retour LED',
      'Logiciel Wave Link ultra-complet pour streamer sur Twitch/YouTube'
    ],
    cons: [
      'Une seule entrée micro, pas d’entrée instrument dédiée'
    ],
    rating: 4.7,
    review_count: 320,
    is_active: true,
    offers: [
      { merchant_name: 'thomann', price: 129, affiliate_link: 'https://www.thomann.fr/elgato_wave_xlr.htm?partner_id=58130' },
      { merchant_name: 'amazon', price: 129, affiliate_link: 'https://www.amazon.fr/s?k=Elgato+Wave+XLR&tag=stackera-21' }
    ]
  },
  {
    slug: 'rode-rodecaster-duo',
    name: 'RØDECaster Duo',
    brand: 'Rode',
    short_description: 'Studio de production audio compact tout-en-un avec 2 préamplis Revolution +76 dB, DSP APHEX et pads SMART.',
    description: `<h2>Le Verdict en un coup d'œil</h2>
<p>Le <strong>Røde RØDECaster Duo</strong> condense la puissance du RØDECaster Pro II dans un format bureau ultra-compact. Avec ses préamplis Revolution à très faible bruit (+76 dB de gain), son moteur DSP APHEX interne (compresseur, noise gate, Aural Exciter, Big Bottom) et ses deux interfaces USB-C pour double PC, c'est l'arme ultime du podcast et du stream professionnel.</p>`,
    image_url: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/prod/566497.jpg',
    specs: {
      preamps: '2 préamplis Revolution (-131,5 dBV EIN, gain 76 dB)',
      inputs: '2 combinées XLR/Jack Neutrik + Bluetooth stéréo',
      outputs: '2 sorties enceintes + 2 sorties casques indépendantes',
      dsp: 'Traitement audio APHEX matériel',
      connectivity: 'Double interface audio USB-C + Wi-Fi/Ethernet'
    },
    pros: [
      'Solution broadcast autonome tout-en-un',
      'Préamplis Revolution surpuissants sans aucun souffle',
      'Double connexion USB-C idéale pour setup streaming 2 PC'
    ],
    cons: [
      'Courbe d’apprentissage pour exploiter tous les menus et pads'
    ],
    rating: 4.9,
    review_count: 175,
    is_active: true,
    offers: [
      { merchant_name: 'woodbrass', price: 420, affiliate_link: 'https://woodbrass.com/products/rode-x-x-rodecaster-duo-377601?af=3524' },
      { merchant_name: 'thomann', price: 519, affiliate_link: 'https://www.thomann.fr/rode_rodecaster_duo.htm?partner_id=58130' },
      { merchant_name: 'amazon', price: 519, affiliate_link: 'https://www.amazon.fr/s?k=Rode+Rodecaster+Duo&tag=stackera-21' }
    ]
  },
  {
    slug: 'presonus-studio-24c',
    name: 'Studio 24c',
    brand: 'PreSonus',
    short_description: 'Interface USB-C 2 entrées / 2 sorties avec préamplis XMAX-L classe A et bargraphes LED précis.',
    description: `<h2>Le Verdict en un coup d'œil</h2>
<p>La <strong>PreSonus Studio 24c</strong> est une valeur sûre pour les musiciens et podcasters. Elle allie la réputation des préamplis XMAX-L à alimentation 48V réelle, des convertisseurs 192 kHz et un affichage en façade par vumètres LED qui permet de doser précisément les niveaux d'entrée et de sortie.</p>`,
    image_url: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/prod/456894.jpg',
    specs: {
      converters: '24-bit / 192 kHz (115 dB)',
      inputs: '2 micro/ligne/instrument XMAX-L en façade',
      outputs: '2 sorties ligne Jack + 1 sortie casque',
      midi: 'Entrée / Sortie MIDI 5 broches',
      connectivity: 'USB-C alimenté'
    },
    pros: [
      'Vumètres LED clairs en façade pour éviter l’écrêtage',
      'Connectique MIDI standard incluse',
      'Livrée avec Studio One Artist et la suite Studio Magic'
    ],
    cons: [
      'Gain de préampli (50 dB) un peu juste pour les micros dynamiques très gourmands'
    ],
    rating: 4.6,
    review_count: 190,
    is_active: true,
    offers: [
      { merchant_name: 'thomann', price: 119, affiliate_link: 'https://www.thomann.fr/presonus_studio_24c.htm?partner_id=58130' },
      { merchant_name: 'amazon', price: 119, affiliate_link: 'https://www.amazon.fr/s?k=PreSonus+Studio+24c&tag=stackera-21' }
    ]
  },
  {
    slug: 'behringer-u-phoria-um2',
    name: 'U-Phoria UM2',
    brand: 'Behringer',
    short_description: 'Interface audio USB ultra-économique 2x2 avec préampli XENYX et alimentation fantôme 48V.',
    description: `<h2>Le Verdict en un coup d'œil</h2>
<p>La <strong>Behringer U-Phoria UM2</strong> est l'interface audio la plus accessible du marché. Pour un tarif imbattable sous les 40 €, elle permet à tout débutant de brancher un vrai microphone de studio XLR avec alimentation fantôme 48V et un instrument (guitare ou basse) directement sur son PC ou Mac.</p>`,
    image_url: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/prod/317589.jpg',
    specs: {
      converters: '16-bit / 48 kHz',
      inputs: '1 XLR/Jack (XENYX) + 1 Jack 6.35mm instrument',
      outputs: 'Sortie stéréo RCA + sortie casque Jack en façade',
      connectivity: 'USB alimenté'
    },
    pros: [
      'Tarif imbattable pour débuter le home studio',
      'Véritable alimentation fantôme 48V pour micros à condensateur',
      'Monitoring direct sans latence'
    ],
    cons: [
      'Boîtier plastique léger',
      'Résolution limitée à 16-bit / 48 kHz'
    ],
    rating: 4.3,
    review_count: 510,
    is_active: true,
    offers: [
      { merchant_name: 'woodbrass', price: 29, affiliate_link: 'https://woodbrass.com/products/behringer-u-phoria-um2-172236?af=3524' },
      { merchant_name: 'thomann', price: 39, affiliate_link: 'https://www.thomann.fr/behringer_u_phoria_um2.htm?partner_id=58130' },
      { merchant_name: 'amazon', price: 42, affiliate_link: 'https://www.amazon.fr/s?k=Behringer+U-Phoria+UM2&tag=stackera-21' }
    ]
  },
  {
    slug: 'universal-audio-volt-176',
    name: 'Volt 176',
    brand: 'Universal Audio',
    short_description: 'Interface audio USB 1 entrée / 2 sorties avec compresseur analogique 1176 et préampli Vintage 610 intégrés.',
    description: `<h2>Le Verdict en un coup d'œil</h2>
<p>La <strong>Universal Audio Volt 176</strong> offre un grain studio analogique unique dans une interface compacte. Elle intègre un préampli émulant la mythique console à lampes UA 610 et surtout un véritable compresseur analogique basé sur le légendaire 1176 avec trois presets optimisés pour les voix, guitares et instruments percussifs.</p>`,
    image_url: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/prod/529073.jpg',
    specs: {
      converters: '24-bit / 192 kHz (115 dB)',
      preamp: '1 entrée avec mode Vintage 610',
      compressor: 'Compresseur analogique 76 intégré (presets Voc, Gtr, Fast)',
      outputs: '2 sorties symétriques Jack + 1 sortie casque',
      connectivity: 'USB-C + MIDI I/O'
    },
    pros: [
      'Véritable compresseur analogique 1176 matériel intégré',
      'Mode Vintage ajoutant une texture harmonique très musicale',
      'Châssis métallique vintage avec flancs en bois très soignés'
    ],
    cons: [
      'Une seule entrée XLR micro/ligne'
    ],
    rating: 4.8,
    review_count: 130,
    is_active: true,
    offers: [
      { merchant_name: 'woodbrass', price: 159, affiliate_link: 'https://woodbrass.com/products/universal-audio-volt-176-recording-studio-353328?af=3524' },
      { merchant_name: 'thomann', price: 179, affiliate_link: 'https://www.thomann.fr/universal_audio_volt_176.htm?partner_id=58130' },
      { merchant_name: 'amazon', price: 179, affiliate_link: 'https://www.amazon.fr/s?k=Universal+Audio+Volt+176&tag=stackera-21' }
    ]
  },
  {
    slug: 'native-instruments-komplete-audio-2',
    name: 'Komplete Audio 2',
    brand: 'Native Instruments',
    short_description: 'Interface audio USB 2 entrées / 2 sorties avec grand potentiomètre supérieur et indicateurs de niveau VU.',
    description: `<h2>Le Verdict en un coup d'œil</h2>
<p>La <strong>Native Instruments Komplete Audio 2</strong> séduit immédiatement par son ergonomie pensée pour les beatmakers et producteurs. Son large potentiomètre de volume situé sur la face supérieure et ses vumètres LED horizontaux offrent un confort d'utilisation remarquable au quotidien.</p>`,
    image_url: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/prod/459427.jpg',
    specs: {
      converters: '24-bit / 192 kHz',
      inputs: '2 combinées XLR/Jack (micro/ligne/instrument)',
      outputs: '2 sorties Jack symétriques + 1 sortie casque',
      controls: 'Grand potentiomètre de volume supérieur',
      connectivity: 'USB alimenté'
    },
    pros: [
      'Gros potentiomètre de volume sur le dessus très agréable',
      'Vumètres LED horizontaux bien visibles',
      'Suite logicielle Native Instruments Komplete Start & effets'
    ],
    cons: [
      'Pas de port MIDI intégré'
    ],
    rating: 4.6,
    review_count: 165,
    is_active: true,
    offers: [
      { merchant_name: 'thomann', price: 115, affiliate_link: 'https://www.thomann.fr/native_instruments_komplete_audio_2.htm?partner_id=58130' },
      { merchant_name: 'amazon', price: 115, affiliate_link: 'https://www.amazon.fr/s?k=Native+Instruments+Komplete+Audio+2&tag=stackera-21' }
    ]
  }
];

const CLEANUP_EXISTING = [
  { slug: 'arturia-minifuse-2-white', name: 'MiniFuse 2 (White)', brand: 'Arturia' },
  { slug: 'audient-id14-mkii', name: 'iD14 MKII', brand: 'Audient' },
  { slug: 'audient-id4-mkii', name: 'iD4 MKII', brand: 'Audient' },
  { slug: 'behringer-u-phoria-umc202hd', name: 'U-Phoria UMC202HD', brand: 'Behringer' },
  { slug: 'focusrite-scarlett-2i2-4th-gen', name: 'Scarlett 2i2 (4th Gen)', brand: 'Focusrite' },
  { slug: 'focusrite-scarlett-solo-4th-gen', name: 'Scarlett Solo (4th Gen)', brand: 'Focusrite' },
  { slug: 'm-audio-m-track-solo', name: 'M-Track Solo', brand: 'M-Audio' },
  { slug: 'motu-m2', name: 'M2', brand: 'MOTU' },
  { slug: 'rme-babyface-pro-fs', name: 'Babyface Pro FS', brand: 'RME' },
  { slug: 'ssl-2-plus', name: 'SSL 2+ MKII', brand: 'Solid State Logic' },
  { slug: 'steinberg-ur22c', name: 'UR22C', brand: 'Steinberg' },
  { slug: 'universal-audio-volt-1', name: 'Volt 1', brand: 'Universal Audio' },
  { slug: 'universal-audio-volt-2', name: 'Volt 2', brand: 'Universal Audio' },
  { slug: 'universal-audio-volt-276', name: 'Volt 276', brand: 'Universal Audio' },
];

async function main() {
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'cartes-son').single();
  console.log('Category ID:', cat.id);

  console.log('\n--- ÉTAPE 1 : Nettoyage des 14 fiches existantes ---');
  for (const c of CLEANUP_EXISTING) {
    const { error } = await supabase
      .from('products')
      .update({ name: c.name, brand: c.brand })
      .eq('slug', c.slug);
    console.log(`Cleaned [${c.slug}] -> "${c.brand} ${c.name}":`, error ? error.message : 'OK');
  }

  // Fix Scarlett 2i2 Thomann URL
  const { data: s2i2 } = await supabase.from('products').select('id').eq('slug', 'focusrite-scarlett-2i2-4th-gen').single();
  if (s2i2) {
    await supabase.from('product_offers').update({
      affiliate_link: 'https://www.thomann.fr/focusrite_scarlett_2i2_4th_generation.htm?partner_id=58130',
      price: 179
    }).eq('product_id', s2i2.id).eq('merchant_name', 'thomann');
    console.log('Fixed Scarlett 2i2 Thomann URL to focusrite_scarlett_2i2_4th_generation.htm');
  }

  console.log('\n--- ÉTAPE 2 : Insertion des 12 nouvelles cartes son ---');
  for (const p of NEW_SOUNDCARDS) {
    const { offers, ...prodData } = p;
    // Check if product already exists
    const { data: existing } = await supabase.from('products').select('id').eq('slug', p.slug);
    let productId;
    if (existing && existing.length > 0) {
      productId = existing[0].id;
      const { error: updErr } = await supabase.from('products').update({
        ...prodData,
        category_id: cat.id
      }).eq('id', productId);
      console.log(`Updated existing product [${p.slug}]:`, updErr ? updErr.message : 'OK');
    } else {
      const { data: inserted, error: insErr } = await supabase.from('products').insert({
        ...prodData,
        category_id: cat.id
      }).select('id').single();
      if (insErr) {
        console.error(`Error inserting [${p.slug}]:`, insErr);
        continue;
      }
      productId = inserted.id;
      console.log(`Inserted new product [${p.slug}] (id: ${productId})`);
    }

    // Insert or update offers
    for (const off of offers) {
      const { data: exOff } = await supabase.from('product_offers').select('id').eq('product_id', productId).eq('merchant_name', off.merchant_name);
      if (exOff && exOff.length > 0) {
        await supabase.from('product_offers').update({
          price: off.price,
          affiliate_link: off.affiliate_link,
          in_stock: true
        }).eq('id', exOff[0].id);
      } else {
        await supabase.from('product_offers').insert({
          product_id: productId,
          merchant_name: off.merchant_name,
          price: off.price,
          currency: 'EUR',
          affiliate_link: off.affiliate_link,
          in_stock: true
        });
      }
    }
  }

  console.log('\n=== Opération terminée avec succès ===');
}

main().catch(console.error);
