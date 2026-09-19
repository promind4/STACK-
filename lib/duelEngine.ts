import type { Product } from '@/types/database';

export interface DuelPoint {
  label: string;
  valA: string;
  valB: string;
  winner?: 'A' | 'B' | 'tie' | null;
  detail?: string;
}

export interface DuelAnalysis {
  title: string;
  subtitle: string;
  verdictLead: string;
  card1Title?: string;
  card2Title?: string;
  acousticAnalysis: string;
  hardwareRequirements: string;
  pointsA: string[];
  pointsB: string[];
  chooseAIf: string[];
  chooseBIf: string[];
  conclusion: string;
  specs: DuelPoint[];
  priceDiffText: string;
  bestValueSlug: string | null;
  isComparable?: boolean;
  incompatibleReason?: string;
}

export interface StudioMicProfile {
  name: string;
  transducerType: 'dynamique' | 'condensateur' | 'ruban';
  signature: string;
  toneDesc: string;
  directivityDesc: string;
  sensitivityCategory: 'ultra-low' | 'low' | 'medium' | 'high' | 'active-preamp' | 'condenser-48v';
  gainNeedsDesc: string;
  hasIntegratedPreamp: boolean;
  requiresPhantom48V: boolean;
  proximityDesc: string;
  roomRejection: 'excellente' | 'tres-bonne' | 'bonne' | 'sensible-acoustique';
  primaryUsage: 'broadcast' | 'live-stage' | 'instrument-studio' | 'hybrid-streaming' | 'vocal-studio';
  usageLabel: string;
  keyStrengths: string[];
  keyLimitations: string[];
  recommendedFor: string;
}

/**
 * Clean all HTML tags and normalize whitespace.
 */
export function stripHtml(input?: string | null): string {
  if (!input) return '';
  return input
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract clean editorial verdict text from rich HTML descriptions.
 */
export function extractVerdictExcerpt(htmlOrText?: string | null): string {
  if (!htmlOrText) return '';
  // Check for "Le Verdict en un coup d'œil" section
  const verdictRegex = /<h[23][^>]*>Le Verdict[^<]*<\/h[23]>\s*<p>([\s\S]*?)<\/p>/i;
  const match = htmlOrText.match(verdictRegex);
  if (match && match[1]) {
    return stripHtml(match[1]);
  }
  // Try first <p> paragraph
  const pMatch = htmlOrText.match(/<p>([\s\S]*?)<\/p>/i);
  if (pMatch && pMatch[1]) {
    const text = stripHtml(pMatch[1]);
    if (text.length > 20) return text;
  }
  return stripHtml(htmlOrText).slice(0, 300);
}

export const STUDIO_MIC_PROFILES: Record<string, StudioMicProfile> = {
  // ─── CONDENSATEURS / STATIQUES ──────────────────────────────
  'at2020': {
    name: 'Audio-Technica AT2020',
    transducerType: 'condensateur',
    signature: 'Équilibré, précis, présence nette à 9-10 kHz, standard mondial du home-studio',
    toneDesc: 'Le standard absolu des microphones statiques d\'entrée de gamme. Réponse remarquablement équilibrée avec une clarté immédiate qui fait ressortir les détails vocaux sans lourdeur.',
    directivityDesc: 'Cardioïde avec membrane électret de 16 mm.',
    sensitivityCategory: 'condenser-48v',
    gainNeedsDesc: 'Micro statique (sensibilité élevée -37 dB). Alimentation fantôme +48V requise via interface audio XLR. Aucun booster de gain requis.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: true,
    proximityDesc: 'Basses précises et bien tenues, sans effet de boue.',
    roomRejection: 'sensible-acoustique',
    primaryUsage: 'vocal-studio',
    usageLabel: 'Chant home-studio, voix parlée claire, guitares acoustiques & instruments',
    keyStrengths: [
      'Le standard mondial éprouvé par des millions de créateurs',
      'Construction tout métal moulé ultra-robuste (345 g)',
      'Encaisse des volumes sonores élevés (SPL max 144 dB)',
      'Réponse transitoire rapide pour les instruments et voix percutantes'
    ],
    keyLimitations: [
      'Bruit de fond propre de 20 dB (suffisant en studio standard, mais pas pour ASMR)',
      'Vendu sans suspension araignée élastique (support rigide fourni)'
    ],
    recommendedFor: 'Le meilleur premier micro statique professionnel pour qui veut de la clarté et une fiabilité à toute épreuve.'
  },
  '2003a': {
    name: 'MXL 2003a',
    transducerType: 'condensateur',
    signature: 'Chaud, soyeux, médiums riches typés Neumann U87 vintage',
    toneDesc: 'Un secret de studio bien gardé des ingénieurs du son. Sa véritable capsule large diaphragme de 27 mm pulvérisée à l\'or et son circuit FET sans transformateur s\'inspirent du prestigieux U87 vintage pour apporter de la matière et du velouté.',
    directivityDesc: 'Cardioïde à large diaphragme 27 mm.',
    sensitivityCategory: 'condenser-48v',
    gainNeedsDesc: 'Micro statique (sensibilité -42 dB). Alimentation fantôme +48V obligatoire.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: true,
    proximityDesc: 'Grave profond et chaleureux, idéal pour donner du corps aux voix fines.',
    roomRejection: 'sensible-acoustique',
    primaryUsage: 'vocal-studio',
    usageLabel: 'Chant studio feutré, voix off chaleureuse & instruments acoustiques',
    keyStrengths: [
      'Véritable capsule large diaphragme 27 mm dorée à l\'or fin',
      'Circuit FET inspiré du son U87 vintage : médiums chantants et graves riches',
      'Filtres commutables intégrés sur le corps (pad -10 dB et coupe-bas 150 Hz)',
      'Rapport musicalité/prix exceptionnel sous la barre des 160€'
    ],
    keyLimitations: [
      'Châssis plus léger que les modèles professionnels haut de gamme',
      'Aigus parfois légèrement brillants demandant un filtre anti-pop soigné'
    ],
    recommendedFor: 'Ceux qui cherchent la chaleur, la rondeur et l\'émotion d\'un grand micro studio vintage pour un budget très contenu.'
  },
  '990': {
    name: 'MXL 990',
    transducerType: 'condensateur',
    signature: 'Look champagne vintage, préampli FET soyeux, prix mini',
    toneDesc: 'Micro statique abordable au look vintage emblématique. Préampli FET discret et diaphragme de 20 mm offrant des aigus scintillants et des graves solides.',
    directivityDesc: 'Cardioïde.',
    sensitivityCategory: 'condenser-48v',
    gainNeedsDesc: 'Alimentation fantôme +48V requise.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: true,
    proximityDesc: 'Rondeur agréable de proximité.',
    roomRejection: 'sensible-acoustique',
    primaryUsage: 'vocal-studio',
    usageLabel: 'Enregistrement vocal débutant, podcast & maquettes acoustiques',
    keyStrengths: ['Look rétro champagne avec suspension fournie', 'Son soyeux très accessible (~90€)'],
    keyLimitations: ['Aigus un peu typés nécessitant d\'éviter les voix déjà trop perçantes'],
    recommendedFor: 'Pour monter un premier studio chant/voix avec du style et un petit budget.'
  },
  '770': {
    name: 'MXL 770',
    transducerType: 'condensateur',
    signature: 'Aigus clairs, graves solides, filtres coupe-bas et pad intégrés',
    toneDesc: 'L\'un des micros statiques les plus populaires pour le rap et le streaming. Sa préamplification FET offre des basses percutantes et des aigus très définis.',
    directivityDesc: 'Cardioïde.',
    sensitivityCategory: 'condenser-48v',
    gainNeedsDesc: 'Alimentation fantôme +48V requise.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: true,
    proximityDesc: 'Basses profondes idéales pour le hip-hop.',
    roomRejection: 'sensible-acoustique',
    primaryUsage: 'vocal-studio',
    usageLabel: 'Rap, chant urbain, streaming & voix parlée percutante',
    keyStrengths: ['Switch coupe-bas et atténuateur -10 dB', 'Valise et suspension antichoc incluses'],
    keyLimitations: ['Aigus marqués pouvant accentuer les sifflantes'],
    recommendedFor: 'Les rappeurs et streamers voulant de l\'impact et des fonctionnalités complètes à petit prix.'
  },
  'v67g': {
    name: 'MXL V67G',
    transducerType: 'condensateur',
    signature: 'Robe vert et or vintage, son chaud et rond typé lampe',
    toneDesc: 'Microphone conçu pour émuler la rondeur et la chaleur des micros à lampe traditionnels grâce à un circuit à semi-conducteurs spécialement égalisé.',
    directivityDesc: 'Cardioïde grand diaphragme 32 mm.',
    sensitivityCategory: 'condenser-48v',
    gainNeedsDesc: 'Alimentation fantôme +48V requise.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: true,
    proximityDesc: 'Effet de proximité généreux et enveloppant.',
    roomRejection: 'sensible-acoustique',
    primaryUsage: 'vocal-studio',
    usageLabel: 'Chant chaleureux, voix off douce & guitare acoustique',
    keyStrengths: ['Design rétro vert et or iconique', 'Adoucit les voix agressives avec sa chaleur vintage'],
    keyLimitations: ['Pas de filtre commutable sur le micro'],
    recommendedFor: 'Ceux qui aiment les timbres chauds et les voix enveloppantes à prix doux.'
  },
  'nt1-a-complete-vocal-recording': {
    name: 'Rode NT1-A',
    transducerType: 'condensateur',
    signature: 'Ultra-silencieux (5 dB de bruit propre), ultra-détaillé et lumineux',
    toneDesc: 'Le classique des home-studios du monde entier. Célèbre pour son bruit propre record de seulement 5 dB-A et sa clarté cristalline dans le haut du spectre.',
    directivityDesc: 'Cardioïde large membrane 1 pouce dorée à l\'or pur.',
    sensitivityCategory: 'condenser-48v',
    gainNeedsDesc: 'Alimentation fantôme +48V requise. Niveau de sortie généreux.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: true,
    proximityDesc: 'Basses nettes et définies.',
    roomRejection: 'sensible-acoustique',
    primaryUsage: 'vocal-studio',
    usageLabel: 'Chant studio moderne, voix off détaillée & instruments acoustiques',
    keyStrengths: [
      'Bruit propre parmi les plus faibles au monde (5 dB-A)',
      'Pack complet avec suspension araignée SM6 et filtre anti-pop professionnel',
      'Garantie constructeur Rode 10 ans'
    ],
    keyLimitations: [
      'Bosse d\'aigus marquée qui peut sonner un peu sibilante sur certaines voix aiguës'
    ],
    recommendedFor: 'Ceux qui ont besoin d\'un silence absolu pour capter les moindres nuances et respirations.'
  },
  'austrian-audio-oc16': {
    name: 'Austrian Audio OC16 Studio Set',
    transducerType: 'condensateur',
    signature: 'Capsule CKR6 céramique faite main à Vienne, l\'héritage moderne de l\'AKG C414',
    toneDesc: 'Conçu par les anciens ingénieurs historiques d\'AKG à Vienne. Embarque la capsule céramique brevetée CKR6 dérivée du haut de gamme OC818 pour offrir un son précis et organique à un tarif accessible.',
    directivityDesc: 'Cardioïde avec capsule céramique suspendue.',
    sensitivityCategory: 'condenser-48v',
    gainNeedsDesc: 'Alimentation fantôme +48V requise.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: true,
    proximityDesc: 'Contrôle exemplaire des basses sans bavures.',
    roomRejection: 'sensible-acoustique',
    primaryUsage: 'vocal-studio',
    usageLabel: 'Studio vocal professionnel, cordes, pianos & voix off premium',
    keyStrengths: [
      'Capsule céramique CKR6 exclusive fabriquée à la main à Vienne',
      'Son noble, ouvert et organique digne des références viennoises',
      'Filtres coupe-bas commutables (40 Hz et 160 Hz)',
      'Suspension élastique et étui rigide inclus'
    ],
    keyLimitations: [
      'Tarif plus élevé que les modèles d\'initiation'
    ],
    recommendedFor: 'Ceux qui veulent l\'excellence acoustique viennoise et un timbre studio haute fidélité pour environ 350€.'
  },
  'akg-c214': {
    name: 'AKG C214',
    transducerType: 'condensateur',
    signature: 'La capsule légendaire du C414 en version cardioïde studio',
    toneDesc: 'Déclinaison cardioïde pure de l\'incontournable AKG C414. Même capsule grand diaphragme 1 pouce délivrant un son détaillé, dynamique et flatteur sur les voix comme sur les instruments.',
    directivityDesc: 'Cardioïde avec double membrane 1 pouce.',
    sensitivityCategory: 'condenser-48v',
    gainNeedsDesc: 'Alimentation 48V requise.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: true,
    proximityDesc: 'Basses profondes et présence raffinée.',
    roomRejection: 'sensible-acoustique',
    primaryUsage: 'vocal-studio',
    usageLabel: 'Voix studio professionnelle, guitares, amplis & overheads',
    keyStrengths: [
      'Lignée directe du mythique AKG C414',
      'Pad d\'atténuation -20 dB et coupe-bas 160 Hz',
      'Livré en mallette aluminium avec suspension élastique'
    ],
    keyLimitations: ['Aigus brillants qui exigent un positionnement soigné'],
    recommendedFor: 'La référence intemporelle pour enregistrer voix et instruments en home-studio sérieux.'
  },
  'lct-440-pure': {
    name: 'Lewitt LCT 440 PURE',
    transducerType: 'condensateur',
    signature: 'Modernité autrichienne, capsule 1 pouce dorée, son ultra-détaillé et droit',
    toneDesc: 'L\'un des microphones les plus prisés de la nouvelle génération. Capsule 1 pouce dorée pulvérisée au mylar offrant une netteté chirurgicale et une réponse transitoire phénoménale.',
    directivityDesc: 'Cardioïde.',
    sensitivityCategory: 'condenser-48v',
    gainNeedsDesc: 'Alimentation 48V requise.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: true,
    proximityDesc: 'Basses modernes et percutantes.',
    roomRejection: 'sensible-acoustique',
    primaryUsage: 'vocal-studio',
    usageLabel: 'Chant moderne pop/électro, voix off dynamique & instruments',
    keyStrengths: [
      'Capsule 1 pouce haute technologie avec bruit très faible (7 dB-A)',
      'Design avant-gardiste avec suspension et filtre anti-pop magnétique custom inclus',
      'Rendu moderne ultra-défini qui ressort immédiatement dans le mix'
    ],
    keyLimitations: ['Très sensible aux réflexions d\'une pièce non traitée'],
    recommendedFor: 'Les créateurs qui veulent une production moderne, nette et ultra-précise.'
  },
  'tlm-102': {
    name: 'Neumann TLM 102',
    transducerType: 'condensateur',
    signature: 'L\'accès au son de légende Neumann, compact, doux et velouté',
    toneDesc: 'Le micro qui a rendu la prestigieuse signature sonore de Neumann accessible aux home-studios. Malgré sa taille compacte, sa grande capsule cardioïde encaisse jusqu\'à 144 dB avec cette douceur inimitable dans les hauts médiums.',
    directivityDesc: 'Cardioïde grand diaphragme.',
    sensitivityCategory: 'condenser-48v',
    gainNeedsDesc: 'Alimentation 48V requise.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: true,
    proximityDesc: 'Basses chaudes et autoritaires sans boue.',
    roomRejection: 'sensible-acoustique',
    primaryUsage: 'vocal-studio',
    usageLabel: 'Chant studio haute fidélité, voix off d\'excellence & cuivres',
    keyStrengths: [
      'Le prestige et le savoir-faire acoustique de Neumann Berlin',
      'Adoucit le chant avec un velouté inimitable sans agressivité',
      'Format ultra-compact et discret face caméra'
    ],
    keyLimitations: ['Vendu avec support rigide (suspension EA 4 en option payante)'],
    recommendedFor: 'Ceux qui souhaitent faire le saut vers le haut de gamme professionnel Neumann.'
  },
  'tlm-103-mt': {
    name: 'Neumann TLM 103 mt',
    transducerType: 'condensateur',
    signature: 'La référence absolue du doublage et de la voix off, capsule K103 issue du U87',
    toneDesc: 'Le micro roi des studios de voix off, de radio et de doublage international. Équipé de la capsule K103 dérivée directement du légendaire U87 avec un bruit de fond quasi inexistant (7 dB-A).',
    directivityDesc: 'Cardioïde large membrane dérivée du U87.',
    sensitivityCategory: 'condenser-48v',
    gainNeedsDesc: 'Alimentation 48V requise.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: true,
    proximityDesc: 'Corps et présence vocale monumentale.',
    roomRejection: 'sensible-acoustique',
    primaryUsage: 'vocal-studio',
    usageLabel: 'Voix off professionnelle, doublage cinéma, radio & chant d\'élite',
    keyStrengths: [
      'Le standard industriel incontournable pour la voix parlée commerciale',
      'Capsule K103 dérivée du mythique Neumann U87',
      'Bruit de fond exceptionnellement bas (7 dB-A) et clarté souveraine'
    ],
    keyLimitations: ['Investissement premium (> 1000€)', 'Exige une pièce acoustiquement traitée'],
    recommendedFor: 'Les professionnels de la voix off et studios commerciaux recherchant la signature de référence.'
  },

  // ─── MICROS DYNAMIQUES ───────────────────────────────────────
  'shure-sm7b': {
    name: 'Shure SM7B',
    transducerType: 'dynamique',
    signature: 'Chaud, sombre, velouté, coupe naturellement les sifflantes',
    toneDesc: 'Le grain radio broadcast iconique par excellence. Timbre doux et enveloppant avec un effet de proximité flatteur sans agressivité dans les aigus.',
    directivityDesc: 'Cardioïde à directivité uniforme et blindage électromagnétique contre les interférences d\'ordinateurs.',
    sensitivityCategory: 'ultra-low',
    gainNeedsDesc: 'Sensibilité ultra-faible (-59 dB). Exige un préampli fournissant au moins +60 dB de gain propre ou un boîtier type Cloudlifter / FetHead.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: false,
    proximityDesc: 'Effet de proximité prononcé mais très flatteur : plus on se rapproche, plus la voix gagne en assise et en rondeur.',
    roomRejection: 'excellente',
    primaryUsage: 'broadcast',
    usageLabel: 'Podcast studio, voix off, broadcast radio & chant rock/metal',
    keyStrengths: [
      'Timbre de légende qui adoucit les voix métalliques et élimine les sifflantes',
      'Isolation acoustique passive remarquable en pièce non traitée',
      'Filtres coupe-bas et boost de présence commutables à l\'arrière',
      'Suspension pneumatique interne absorbant les vibrations de table'
    ],
    keyLimitations: [
      'Très gourmand en gain : interface bas de gamme insuffisante sans activateur externe (+100€ à prévoir)',
      'Poids imposant (765 g) nécessitant un bras articulé ou pied robuste'
    ],
    recommendedFor: 'Les créateurs de podcast, voix off ou animateurs cherchant la chaleur et l\'autorité du son radio légendaire.'
  },
  'shure-sm7db': {
    name: 'Shure SM7dB',
    transducerType: 'dynamique',
    signature: 'Même capsule mythique que le SM7B, avec préamplificateur actif Shure intégré',
    toneDesc: 'Conserve fidèlement l\'ADN sonore du SM7B (rondeur, douceur des aigus) tout en éliminant son plus grand défaut historique : le manque de niveau de sortie.',
    directivityDesc: 'Cardioïde avec blindage électromagnétique anti-bourdonnement.',
    sensitivityCategory: 'active-preamp',
    gainNeedsDesc: 'Préampli actif intégré commutable (+18 dB ou +28 dB, bypassable). Alimentation Phantom 48V requise. Plus besoin de Cloudlifter!',
    hasIntegratedPreamp: true,
    requiresPhantom48V: true,
    proximityDesc: 'Effet de proximité chaleureux identique au SM7B original.',
    roomRejection: 'excellente',
    primaryUsage: 'broadcast',
    usageLabel: 'Podcast, streaming de haut niveau & studio d\'enregistrement',
    keyStrengths: [
      'Préampli officiel Shure intégré offrant jusqu\'à +28 dB de gain ultra-propre',
      'Fonctionne directement sur n\'importe quelle interface audio standard avec 48V',
      'Son SM7B authentique sans boîtier intermédiaire ni câblage additionnel',
      'Mode bypass permettant de retrouver le SM7B passif historique'
    ],
    keyLimitations: [
      'Prix d\'achat plus élevé au départ',
      'Nécessite impérativement une alimentation phantom 48V pour activer le préampli'
    ],
    recommendedFor: 'Ceux qui veulent le son SM7B sans s\'encombrer d\'un préampli externe et avec la garantie d\'un niveau parfait sur toute interface.'
  },
  'electro-voice-re20': {
    name: 'Electro-Voice RE20',
    transducerType: 'dynamique',
    signature: 'Neutre, précis, ultra-articulé, technologie Variable-D exclusive',
    toneDesc: 'Le standard absolu des studios radio américains (FM & Talk-Show). Réponse linéaire sur tout le spectre vocal sans coloration artificielle.',
    directivityDesc: 'Cardioïde avec technologie brevetée Variable-D éliminant le gonflement excessif des basses.',
    sensitivityCategory: 'low',
    gainNeedsDesc: 'Sensibilité faible (-56 dB). Nécessite une interface avec une bonne réserve de gain (+55 dB minimum).',
    hasIntegratedPreamp: false,
    requiresPhantom48V: false,
    proximityDesc: 'Zéro effet de proximité indésirable : vous pouvez bouger ou vous reculer, le timbre de la voix reste rigoureusement identique.',
    roomRejection: 'excellente',
    primaryUsage: 'broadcast',
    usageLabel: 'Radio FM, podcast talk-show, cuivres, grosse caisse & voix d\'animation',
    keyStrengths: [
      'Technologie Variable-D : aucune altération tonale même si l\'orateur bouge devant le micro',
      'Intelligibilité et clarté chirurgicales sans booster artificiellement les aigus',
      'Construction indestructible en acier lourd (standard depuis plus de 50 ans)',
      'Polyvalence remarquable sur les instruments (cuivres, percussions, kick)'
    ],
    keyLimitations: [
      'Prix élevé se situant dans le haut du panier dynamique',
      'Format très imposant et esthétique broadcast industrielle typée'
    ],
    recommendedFor: 'Les podcasteurs dynamiques qui bougent souvent la tête, les animateurs radio et les home-studios recherchant une neutralité totale.'
  },
  'electro-voice-re20-black': {
    name: 'Electro-Voice RE20 Black',
    transducerType: 'dynamique',
    signature: 'Finition noire matte moderne du légendaire RE20 Variable-D',
    toneDesc: 'Identique en tous points au RE20 classique en finition beige historique, avec une robe noire matte anti-reflet discrète en vidéo.',
    directivityDesc: 'Cardioïde avec technologie Variable-D.',
    sensitivityCategory: 'low',
    gainNeedsDesc: 'Sensibilité faible (-56 dB). Nécessite un préampli propre de +55 à +60 dB.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: false,
    proximityDesc: 'Zéro effet de proximité gênant.',
    roomRejection: 'excellente',
    primaryUsage: 'broadcast',
    usageLabel: 'Radio, vidéo broadcast & streaming professionnel sobre',
    keyStrengths: [
      'Finition noire satinée très élégante face caméra',
      'Technologie Variable-D éliminant l\'effet de proximité',
      'Timbre naturel et intelligibilité exemplaire'
    ],
    keyLimitations: [
      'Investissement conséquent',
      'Demande une bonne préamplification'
    ],
    recommendedFor: 'Ceux qui recherchent l\'excellence acoustique du RE20 avec une esthétique moderne face caméra.'
  },
  'electro-voice-re320': {
    name: 'Electro-Voice RE320',
    transducerType: 'dynamique',
    signature: 'Brillant, moderne, punchy avec commutateur double profil (Voix / Kick)',
    toneDesc: 'Version plus énergique et moderne du RE20 dotée d\'un aimant néodyme. Son plus clair dans l\'aigu et plus facile à faire ressortir dans un mix.',
    directivityDesc: 'Cardioïde avec Variable-D.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité moyenne (-52 dB), nettement plus simple à amplifier qu\'un SM7B ou un RE20 classique.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: false,
    proximityDesc: 'Contrôlé par Variable-D, très stable.',
    roomRejection: 'excellente',
    primaryUsage: 'broadcast',
    usageLabel: 'Podcast moderne, streaming gaming, kick drum & voix masculine profonde',
    keyStrengths: [
      'Double profil d\'égalisation commutable (Voix broadcast ou Grosse caisse creusée)',
      'Niveau de sortie plus généreux, compatible avec des cartes son modestes',
      'Technologie Variable-D à tarif plus accessible que le RE20 original'
    ],
    keyLimitations: [
      'Aigus plus présents qui peuvent accentuer les voix déjà très perçantes',
      'Look spécifique bicolore'
    ],
    recommendedFor: 'Ceux qui aiment la technologie Variable-D mais souhaitent un son plus vif, plus dynamique et plus facile à amplifier.'
  },
  'rode-podmic': {
    name: 'Rode PodMic',
    transducerType: 'dynamique',
    signature: 'Direct, percutant, précis, rapport qualité-prix imbattable',
    toneDesc: 'Conçu spécifiquement pour le podcasting. Voix intelligible et bien détachée, légèrement plus sèche et tranchante que le velouté d\'un SM7B.',
    directivityDesc: 'Cardioïde serrée avec filtre anti-pop en maille d\'acier interne double couche.',
    sensitivityCategory: 'low',
    gainNeedsDesc: 'Sensibilité de -57 dB. Demande un bon niveau de gain pour éviter le souffle sur des cartes son d\'entrée de gamme.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: false,
    proximityDesc: 'Effet de proximité notable apportant de l\'assise dans le bas.',
    roomRejection: 'tres-bonne',
    primaryUsage: 'broadcast',
    usageLabel: 'Podcast débutant à intermédiaire, streaming & tables rondes',
    keyStrengths: [
      'Rapport qualité/prix incontournable (moins de 80€)',
      'Corps en laiton massif ultra-robuste pesant près de 1 kg',
      'Filtre anti-pop intégré efficace contre les plosives',
      'Bras articulé intégré pour un positionnement facile'
    ],
    keyLimitations: [
      'Timbre un peu métallique dans les hauts médiums par rapport aux modèles studio haut de gamme',
      'Demande tout de même un gain suffisant sur l\'interface'
    ],
    recommendedFor: 'Le meilleur choix pour équiper un studio de podcast ou streamer sans exploser son budget.'
  },
  'procaster': {
    name: 'Rode Procaster',
    transducerType: 'dynamique',
    signature: 'Rondeur broadcast, capsule large néodyme, suspension interne',
    toneDesc: 'Grand frère du PodMic avec une capsule néodyme plus ample et une suspension interne supérieure. Son plus feutré et moins rugueux dans les aigus.',
    directivityDesc: 'Cardioïde avec filtre anti-pop interne.',
    sensitivityCategory: 'low',
    gainNeedsDesc: 'Sensibilité de -56 dB. Exige une interface avec au moins +55 dB de gain.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: false,
    proximityDesc: 'Belle assise broadcast dans le bas du spectre.',
    roomRejection: 'tres-bonne',
    primaryUsage: 'broadcast',
    usageLabel: 'Broadcast radio, doublage voix off & podcast studio',
    keyStrengths: [
      'Suspension élastique interne de la capsule pour limiter les vibrations de bureau',
      'Son plus chaleureux et doux que le PodMic',
      'Conception 100% métal robuste'
    ],
    keyLimitations: [
      'Encombrement important',
      'Se fait concurrencer par les micros à boosters intégrés'
    ],
    recommendedFor: 'Ceux qui aiment la signature Rode mais recherchent un son plus soyeux et mieux isolé mécaniquement que le PodMic.'
  },
  'procaster-b-stock': {
    name: 'Rode Procaster B-Stock',
    transducerType: 'dynamique',
    signature: 'Rondeur broadcast, capsule large néodyme (offre reconditionnée)',
    toneDesc: 'Mêmes spécifications acoustiques que le Rode Procaster neuf, avec un tarif encore plus avantageux.',
    directivityDesc: 'Cardioïde avec filtre anti-pop interne.',
    sensitivityCategory: 'low',
    gainNeedsDesc: 'Sensibilité -56 dB.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: false,
    proximityDesc: 'Belle assise broadcast.',
    roomRejection: 'tres-bonne',
    primaryUsage: 'broadcast',
    usageLabel: 'Broadcast & podcast studio économique',
    keyStrengths: [
      'Prix réduit pour les mêmes performances audio broadcast',
      'Suspension mécanique interne'
    ],
    keyLimitations: [
      'Exige une bonne réserve de préampli'
    ],
    recommendedFor: 'Idéal pour acquérir un micro broadcast réputé au tarif le plus bas.'
  },
  'audio-technica-bp40': {
    name: 'Audio-Technica BP40',
    transducerType: 'dynamique',
    signature: 'Large membrane 37 mm, hypercardioïde, son percutant type statique',
    toneDesc: 'Une véritable pépite d\'ingénierie audio : capsule géante de 37 mm offrant la dynamique d\'un condensateur mais avec l\'isolation d\'un micro dynamique hypercardioïde.',
    directivityDesc: 'Hypercardioïde : réjection latérale maximale, bien plus étroite qu\'un cardioïde classique.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité supérieure (-43 dB). Facile à amplifier sur n\'importe quelle interface audio standard sans aucun booster externe.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: false,
    proximityDesc: 'Basses profondes et maîtrisées grâce au diaphragme surdimensionné.',
    roomRejection: 'excellente',
    primaryUsage: 'broadcast',
    usageLabel: 'Voix off professionnelle, podcast exigeant en pièce difficile & streaming',
    keyStrengths: [
      'Directivité hypercardioïde coupant drastiquement les bruits latéraux et la réverbération',
      'Sortie généreuse (+16 dB de plus qu\'un SM7B!), ne requiert aucun Cloudlifter',
      'Filtre coupe-bas 100 Hz commutable pour nettoyer les grondements',
      'Capsule géante 37 mm procurant des basses riches et des transitoires rapides'
    ],
    keyLimitations: [
      'Angle de captation étroit : demande de rester bien dans l\'axe du micro',
      'Suspension dédiée AT8484 souvent optionnelle'
    ],
    recommendedFor: 'Ceux qui enregistrent dans une pièce non traitée avec du bruit environnant et veulent un son ample sans acheter de préampli coûteux.'
  },
  'at2040': {
    name: 'Audio-Technica AT2040',
    transducerType: 'dynamique',
    signature: 'Hypercardioïde compact, focalisation vocale serrée, budget doux',
    toneDesc: 'Micro broadcast d\'entrée de gamme doté d\'une directivité hypercardioïde. Isole la voix avec une efficacité redoutable face aux bruits de clavier.',
    directivityDesc: 'Hypercardioïde avec filtre anti-pop multi-étage en mousse et maille.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité standard (-53 dB). S\'accommode de la plupart des cartes son d\'entrée de gamme.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: false,
    proximityDesc: 'Effet de proximité contrôlé.',
    roomRejection: 'tres-bonne',
    primaryUsage: 'broadcast',
    usageLabel: 'Streaming gaming, podcast débutant & enregistrement en chambre non traitée',
    keyStrengths: [
      'Directivité hypercardioïde très efficace pour éliminer les clics de souris et frappes de clavier',
      'Suspension interne intégrée absorbant les chocs de bureau',
      'Tarif inférieur à 90€ très compétitif'
    ],
    keyLimitations: [
      'Nécessite de rester strictement face au micro sous peine de perte de niveau',
      'Moins chaud et velouté qu\'un BP40'
    ],
    recommendedFor: 'Les streamers et podcasteurs cherchant à éliminer les bruits parasites de leur bureau à prix doux.'
  },
  'shure-mv7x': {
    name: 'Shure MV7X',
    transducerType: 'dynamique',
    signature: 'Isolation vocale optimisée, format inspiré du SM7B, 100% analogique',
    toneDesc: 'Version purement XLR analogique du Shure MV7. Conçu spécialement pour capturer la voix parlée avec clarté même dans les pièces à l\'acoustique moyenne.',
    directivityDesc: 'Cardioïde étroite avec technologie Voice Isolation passive.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité de -55 dB. Moins gourmand en gain que le SM7B de 4 dB, fonctionne bien sur les interfaces Scarlett ou similaires.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: false,
    proximityDesc: 'Présence vocale immédiate et percutante.',
    roomRejection: 'excellente',
    primaryUsage: 'broadcast',
    usageLabel: 'Podcasting, streaming & voix parlée sur setup XLR',
    keyStrengths: [
      'Isolation acoustique passive remarquable dans les environnements domestiques',
      'Look et ergonomie rappelant le SM7B pour la moitié du prix',
      'Moins exigeant en préamplification que son illustre aîné'
    ],
    keyLimitations: [
      'XLR uniquement (pas de connectique USB comme sur le MV7+)',
      'Bande passante légèrement moins aérée dans les infra-basses que le SM7B'
    ],
    recommendedFor: 'Les créateurs qui veulent le son et le style Shure sur leur carte son sans les contraintes de gain du SM7B.'
  },
  'shure-mv7': {
    name: 'Shure MV7+',
    transducerType: 'dynamique',
    signature: 'Hybride USB-C / XLR avec DSP embarqué, auto-level et filtre denoiser',
    toneDesc: 'Le micro créateur le plus complet du marché. Fonctionne aussi bien branché directement en USB sur un PC qu\'en XLR sur une table de mixage.',
    directivityDesc: 'Cardioïde avec isolation phonique de pointe.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'En USB : gain géré par DSP automatique. En XLR : sensibilité modérée (-55 dB).',
    hasIntegratedPreamp: true,
    requiresPhantom48V: false,
    proximityDesc: 'Gestion intelligente des niveaux en mode USB (Auto Level Mode).',
    roomRejection: 'excellente',
    primaryUsage: 'hybrid-streaming',
    usageLabel: 'Streaming nomade, podcast hybride USB/XLR & télétravail exigeant',
    keyStrengths: [
      'Double sortie simultanée USB-C et XLR pour évoluer avec votre configuration',
      'DSP interne : compresseur, égaliseur, suppression du bruit et anti-pop numérique',
      'Panneau tactile LED personnalisable avec touche mute instantanée',
      'Sortie casque zéro latence intégrée'
    ],
    keyLimitations: [
      'Tarif proche des micros broadcast analogiques purs haut de gamme',
      'Fonctions DSP réservées au mode USB'
    ],
    recommendedFor: 'Les créateurs modernes qui veulent une solution plug-and-play en USB aujourd\'hui, avec la garantie d\'évoluer vers le XLR demain.'
  },
  'shure-sm58': {
    name: 'Shure SM58',
    transducerType: 'dynamique',
    signature: 'Standard live mondial, bosse de présence taillée pour le chant, indestructible',
    toneDesc: 'Le micro de chant le plus vendu au monde depuis 1966. Bosse d\'égalisation calibrée à 4-5 kHz pour faire percer la voix à travers n\'importe quel mix sonore.',
    directivityDesc: 'Cardioïde uniforme avec excellente réjection des larsens.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité standard (-54.5 dB). Alimentation facile avec n\'importe quelle interface d\'entrée de gamme.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: false,
    proximityDesc: 'Effet de proximité équilibré conçu pour l\'utilisation à la main très près de la bouche.',
    roomRejection: 'tres-bonne',
    primaryUsage: 'live-stage',
    usageLabel: 'Chant live, scène, répétition, discours & podcast tout-terrain',
    keyStrengths: [
      'Indestructible : résiste aux chutes, aux tournées et aux environnements extrêmes',
      'Bosse de présence légendaire qui garantit l\'intelligibilité sans retouche',
      'Grille sphérique robuste avec filtre anti-pop en mousse interchangeable',
      'Tarif démocratique très stable et valeur de revente assurée'
    ],
    keyLimitations: [
      'Moins de rondeur et d\'infra-basses qu\'un micro broadcast de studio',
      'Nécessite d\'être utilisé très près des lèvres pour donner son plein potentiel'
    ],
    recommendedFor: 'Les chanteurs, musiciens de scène ou podcasteurs cherchant un micro passe-partout, incassable et éprouvé.'
  },
  'shure-sm57': {
    name: 'Shure SM57',
    transducerType: 'dynamique',
    signature: 'Légende des amplis guitare, caisse claire et voix de discours',
    toneDesc: 'Même capsule que le SM58 mais sans grille sphérique, permettant de coller la membrane au plus près de la source pour une attaque percutante.',
    directivityDesc: 'Cardioïde.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité standard (-56 dB).',
    hasIntegratedPreamp: false,
    requiresPhantom48V: false,
    proximityDesc: 'Très marqué en utilisation ultra-rapprochée.',
    roomRejection: 'tres-bonne',
    primaryUsage: 'instrument-studio',
    usageLabel: 'Enregistrement instruments (guitare, snare), cuivres & voix de président',
    keyStrengths: [
      'Le standard mondial absolu pour repiquer un ampli guitare ou une caisse claire',
      'Attaque rapide et gestion des pressions acoustiques extrêmes (SPL)',
      'Micro officiel des discours présidentiels de la Maison Blanche depuis des décennies'
    ],
    keyLimitations: [
      'Absence de filtre anti-pop intégré : filtre anti-souffle externe obligatoire sur la voix',
      'Esthétique purement studio d\'instrument'
    ],
    recommendedFor: 'Tout home-studio pour la prise d\'instruments et les guitaristes.'
  },
  'se-electronics-v7': {
    name: 'sE Electronics V7',
    transducerType: 'dynamique',
    signature: 'Supercardioïde scène, bobine aluminium sur mesure, son clair et détaillé',
    toneDesc: 'Le challenger moderne du SM58 plébiscité en tournée par Billie Eilish. Bobine mobile en aluminium offrant des aigus plus aérés et une clarté remarquable.',
    directivityDesc: 'Supercardioïde : réjection latérale accrue et résistance aux larsens supérieure au cardioïde.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité de -54 dB, très simple à préamplifier.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: false,
    proximityDesc: 'Contrôlé avec précision.',
    roomRejection: 'excellente',
    primaryUsage: 'live-stage',
    usageLabel: 'Chant live professionnel, chant studio dynamique & broadcast vocal',
    keyStrengths: [
      'Directivité supercardioïde offrant une isolation phonique supérieure au SM58',
      'Bobine mobile en aluminium custom délivrant des aigus cristallins sans agressivité',
      'Grille biseautée anti-roulement pour éviter qu\'il ne tombe de table',
      'Suspension interne brevetée limitant les bruits de manipulation'
    ],
    keyLimitations: [
      'Légère sensibilité arrière typique du supercardioïde (éviter les retours de scène pile dans l\'axe arrière)'
    ],
    recommendedFor: 'Les chanteurs et créateurs qui trouvent le SM58 trop sombre et veulent plus d\'air et de précision dans le haut du spectre.'
  },
  'dynacaster-dcm-8': {
    name: 'sE Electronics DynaCaster DCM 8',
    transducerType: 'dynamique',
    signature: 'Booster Dynamite +30 dB intégré, 6 voicings d\'égalisation matérielle',
    toneDesc: 'Le couteau suisse du broadcast moderne. Intègre directement le fameux préampli sE Dynamite (+30 dB actif) et des switches d\'égalisation pour sculpter le timbre.',
    directivityDesc: 'Cardioïde avec protection anti-pop à trois couches.',
    sensitivityCategory: 'active-preamp',
    gainNeedsDesc: 'Booster actif commutable (+30 dB avec phantom 48V). Fonctionne aussi en mode passif.',
    hasIntegratedPreamp: true,
    requiresPhantom48V: true,
    proximityDesc: 'Ajustable grâce aux switches d\'égalisation de basses.',
    roomRejection: 'excellente',
    primaryUsage: 'broadcast',
    usageLabel: 'Podcast studio professionnel, streaming & chant studio',
    keyStrengths: [
      'Booster Dynamite actif intégré de +30 dB garantissant un niveau optimal sans équipement externe',
      'Deux switches d\'égalisation (Basses et Aigus) offrant 6 configurations sonores distinctes',
      'Système anti-pop interne à triple couche pour une filtration impeccable',
      'Excellente finition métallique tout-en-un'
    ],
    keyLimitations: [
      'Poids conséquent',
      '48V obligatoire pour profiter du booster actif'
    ],
    recommendedFor: 'Ceux qui cherchent une alternative ultra-polyvalente au SM7B avec préampli intégré et égalisation ajustable pour moins de 250€.'
  },
  'dynacaster-dcm6': {
    name: 'sE Electronics DynaCaster DCM 6',
    transducerType: 'dynamique',
    signature: 'Booster Dynamite +30 dB intégré, format compact épuré',
    toneDesc: 'Version simplifiée et plus abordable du DCM 8, conservant le fameux booster actif Dynamite +30 dB pour une utilisation sans prise de tête.',
    directivityDesc: 'Cardioïde.',
    sensitivityCategory: 'active-preamp',
    gainNeedsDesc: 'Booster actif +30 dB commutable.',
    hasIntegratedPreamp: true,
    requiresPhantom48V: true,
    proximityDesc: 'Standard dynamique.',
    roomRejection: 'tres-bonne',
    primaryUsage: 'broadcast',
    usageLabel: 'Podcast & streaming sur carte son d\'entrée de gamme',
    keyStrengths: [
      'Booster +30 dB intégré à un prix imbattable (~120€)',
      'Résout définitivement le problème de gain des micros dynamiques'
    ],
    keyLimitations: [
      'Pas de switches d\'égalisation avancée comme sur le DCM 8'
    ],
    recommendedFor: 'Ceux qui veulent la puissance du booster actif sans payer le prix d\'un SM7dB.'
  },
  'dynacaster-dcm-3': {
    name: 'sE Electronics DynaCaster DCM 3',
    transducerType: 'dynamique',
    signature: 'Micro broadcast passif robuste et direct',
    toneDesc: 'Version passive d\'entrée de gamme de la série DynaCaster, concurrent direct du Rode PodMic.',
    directivityDesc: 'Cardioïde.',
    sensitivityCategory: 'low',
    gainNeedsDesc: 'Passif, demande une bonne interface.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: false,
    proximityDesc: 'Standard broadcast.',
    roomRejection: 'tres-bonne',
    primaryUsage: 'broadcast',
    usageLabel: 'Podcast débutant & voix parlée',
    keyStrengths: ['Construction sE Electronics de qualité à prix d\'accès'],
    keyLimitations: ['Pas de booster intégré'],
    recommendedFor: 'Idéal si vous cherchez un micro broadcast sobre et efficace sous la barre des 90€.'
  },
  'sennheiser-md-421-kompakt': {
    name: 'Sennheiser MD 421 Kompakt',
    transducerType: 'dynamique',
    signature: 'Légende studio grand diaphragme, dynamique percutant pour toms et voix rock',
    toneDesc: 'Réinterprétation compacte du mythique MD 421-II. Capsule dynamique grand diaphragme capable d\'encaisser d\'immenses pressions acoustiques avec une clarté remarquable.',
    directivityDesc: 'Cardioïde avec fixation repensée beaucoup plus fiable.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité standard (-54 dB).',
    hasIntegratedPreamp: false,
    requiresPhantom48V: false,
    proximityDesc: 'Basses profondes et claires sans bavures.',
    roomRejection: 'excellente',
    primaryUsage: 'instrument-studio',
    usageLabel: 'Toms, amplis guitare / basse, cuivres & voix chantée puissante',
    keyStrengths: [
      'Capsule légendaire offrant une précision transitoire digne des meilleurs studios',
      'Nouveau clip de fixation solide remplaçant la pince fragile de l\'ancien MD 421',
      'Encaisse des niveaux sonores extrêmes sans saturation'
    ],
    keyLimitations: [
      'Moins typé broadcast radio feutré qu\'un SM7B pour du podcast pur'
    ],
    recommendedFor: 'Les ingénieurs du son et musiciens voulant la référence mondiale pour la batterie et les voix énergiques.'
  },
  'sennheiser-e-835': {
    name: 'Sennheiser e 835',
    transducerType: 'dynamique',
    signature: 'Chant live clair et dynamique, présence ouverte dans les hauts médiums',
    toneDesc: 'Micro de chant live emblématique de Sennheiser. Timbre plus aéré et brillant que le SM58 dans le haut du spectre, évitant l\'effet de voile sur les voix douces.',
    directivityDesc: 'Cardioïde uniforme.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité standard (-51 dB), généreuse et facile à mixer.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: false,
    proximityDesc: 'Basses régulières même à distance variable.',
    roomRejection: 'tres-bonne',
    primaryUsage: 'live-stage',
    usageLabel: 'Chant scène, chorales, conférences & podcast dynamique',
    keyStrengths: [
      'Clarté vocale naturelle supérieure au SM58 sans égalisation',
      'Insensible aux bruits de manipulation et résistant aux larsens',
      'Excellent rapport qualité/prix sous la barre des 90€'
    ],
    keyLimitations: [
      'Moins rond dans les basses qu\'un micro broadcast studio'
    ],
    recommendedFor: 'Les chanteurs et conférenciers qui recherchent une alternative plus claire et intelligible que le SM58.'
  },
  'heil-sound-pr40': {
    name: 'Heil Sound PR40',
    transducerType: 'dynamique',
    signature: 'Bande passante la plus large (28 Hz - 18 kHz), membrane composite sur mesure',
    toneDesc: 'Le micro dynamique au son le plus proche d\'un statique de studio. Membrane XXL en aluminium sur mesure offrant une réponse dans les graves abyssale et des aigus étincelants.',
    directivityDesc: 'Cardioïde avec rejet hors-axe exceptionnel.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité moyenne (-53.9 dB).',
    hasIntegratedPreamp: false,
    requiresPhantom48V: false,
    proximityDesc: 'Basses amples et fermes.',
    roomRejection: 'excellente',
    primaryUsage: 'broadcast',
    usageLabel: 'Radio, voix d\'acteur, grosse caisse & instruments acoustiques',
    keyStrengths: [
      'Spectre fréquentiel ultra-étendu (28 Hz à 18 kHz)',
      'Définition et rapidité sur les transitoires exceptionnelles pour un dynamique',
      'Excellente réjection des bruits de pièce à 180°'
    ],
    keyLimitations: [
      'Aigus très détaillés qui captent plus facilement les bruits de bouche',
      'Tarif premium'
    ],
    recommendedFor: 'Les voix qui manquent de présence naturelle et ceux qui veulent le piqué d\'un micro statique avec la sécurité d\'un dynamique.'
  },
  'm82': {
    name: 'Telefunken M82',
    transducerType: 'dynamique',
    signature: 'Haut de gamme broadcast & kick drum, switch Kick EQ & High Boost',
    toneDesc: 'Micro dynamique de studio d\'exception fabriqué par Telefunken. Équipé d\'un grand diaphragme de 35 mm et de deux filtres physiques indépendants.',
    directivityDesc: 'Cardioïde.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité standard (-54 dB).',
    hasIntegratedPreamp: false,
    requiresPhantom48V: false,
    proximityDesc: 'Grave monumental et contrôlé.',
    roomRejection: 'excellente',
    primaryUsage: 'broadcast',
    usageLabel: 'Studio broadcast haut de gamme, chant rock & grosse caisse',
    keyStrengths: [
      'Double switch d\'égalisation (Kick EQ et High Boost) pour adapter instantanément le micro',
      'Fabrication Telefunken d\'orfèvre et composantes triées',
      'Timbre noble et riche sans agressivité'
    ],
    keyLimitations: [
      'Investissement haut de gamme (~500€)'
    ],
    recommendedFor: 'Les studios exigeants qui veulent un micro dynamique d\'exception capable d\'exceller autant sur une voix que sur une batterie.'
  },
  'stealth': {
    name: 'Aston Microphones Stealth',
    transducerType: 'dynamique',
    signature: '4 voix sonores distinctes, préampli discret Classe A commutable 48V',
    toneDesc: 'Micro révolutionnaire offrant 4 voicings analogiques indépendants (Vocal 1, Vocal 2, Guitare, Dark) et un préampli Classe A intégré commutable offrant +50 dB de gain propre.',
    directivityDesc: 'Cardioïde avec capsule montée sur suspension interne.',
    sensitivityCategory: 'active-preamp',
    gainNeedsDesc: 'Peut fonctionner en passif pur ou en actif (+50 dB avec 48V activé).',
    hasIntegratedPreamp: true,
    requiresPhantom48V: true,
    proximityDesc: 'Variable selon le profil de voicing choisi.',
    roomRejection: 'excellente',
    primaryUsage: 'broadcast',
    usageLabel: 'Studio polyvalent, voix chantée, broadcast & instruments',
    keyStrengths: [
      '4 réglages sonores analogiques entièrement indépendants',
      'Préampli Classe A intégré offrant une réserve de gain colossale (+50 dB)',
      'Système de suspension interne de capsule sans amortisseur externe requis'
    ],
    keyLimitations: [
      'Design futuriste clivant',
      'Poids et encombrement'
    ],
    recommendedFor: 'Ceux qui cherchent la polyvalence ultime de timbres sans acheter plusieurs micros.'
  },
  'stealth-broadcast': {
    name: 'Aston Microphones Stealth Broadcast',
    transducerType: 'dynamique',
    signature: 'Version orientée diffusion du Stealth avec 4 réglages de voix',
    toneDesc: 'Déclinaison spécifique broadcast avec préampli Classe A commutable.',
    directivityDesc: 'Cardioïde.',
    sensitivityCategory: 'active-preamp',
    gainNeedsDesc: 'Mode actif 48V intégré.',
    hasIntegratedPreamp: true,
    requiresPhantom48V: true,
    proximityDesc: 'Réglable.',
    roomRejection: 'excellente',
    primaryUsage: 'broadcast',
    usageLabel: 'Radio, podcast & voix off',
    keyStrengths: ['Polyvalence de timbre et booster Classe A intégré'],
    keyLimitations: ['Format imposant'],
    recommendedFor: 'Idéal pour le broadcast studio évolutif.'
  },
  'bc-500': {
    name: 'the t.bone BC 500',
    transducerType: 'dynamique',
    signature: 'Format broadcast d\'entrée de gamme avec coupe-bas et boost',
    toneDesc: 'L\'accès le plus économique au design et à l\'ergonomie d\'un micro broadcast de radio.',
    directivityDesc: 'Cardioïde.',
    sensitivityCategory: 'low',
    gainNeedsDesc: 'Sensibilité basse, demande du gain.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: false,
    proximityDesc: 'Standard.',
    roomRejection: 'bonne',
    primaryUsage: 'broadcast',
    usageLabel: 'Premier micro podcast petit budget',
    keyStrengths: ['Tarif très bas (~79€)', 'Filtres commutables à l\'arrière'],
    keyLimitations: ['Composants d\'entrée de gamme, isolation mécanique moyenne'],
    recommendedFor: 'Pour tester le format broadcast avec un budget très limité.'
  },
  'cr77': {
    name: 'MXL CR77',
    transducerType: 'dynamique',
    signature: 'Look rétro vintage chromé, son dynamique chaleureux',
    toneDesc: 'Micro dynamique broadcast revêtu d\'un habillage chrome vintage saisissant face caméra.',
    directivityDesc: 'Cardioïde.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité standard.',
    hasIntegratedPreamp: false,
    requiresPhantom48V: false,
    proximityDesc: 'Grave chaud.',
    roomRejection: 'bonne',
    primaryUsage: 'broadcast',
    usageLabel: 'Vidéos musicales, podcast avec identité visuelle forte & live',
    keyStrengths: ['Design visuel rétro chrome spectaculaire', 'Corps lourd tout métal'],
    keyLimitations: ['Poids important, pas de filtres commutables'],
    recommendedFor: 'Ceux pour qui le look à l\'image compte autant que le son.'
  }
};

/**
 * Detect product category accurately from category_slug, categories relation, or heuristics.
 */
export function detectProductCategory(p: { slug?: string; name?: string; category_slug?: string; categories?: any }): string {
  const cSlug = p.category_slug || (p as any).categories?.slug || '';
  if (cSlug) return cSlug;
  const s = ((p.slug || '') + ' ' + (p.name || '')).toLowerCase();
  if (s.includes('casque') || s.includes('k-702') || s.includes('mdr-') || s.includes('dt-') || s.includes('ath-m') || s.includes('hd-6')) return 'casques-studio';
  if (s.includes('enceinte') || s.includes('monitor') || s.includes('hs-') || s.includes('t8v') || s.includes('t5v') || s.includes('in-5') || s.includes('lp-6')) return 'enceintes';
  if (s.includes('carte') || s.includes('interface') || s.includes('ur22') || s.includes('id24') || s.includes('id14') || s.includes('volt') || s.includes('scarlett') || s.includes('apollo')) return 'cartes-son';
  if (s.includes('cloudlifter') || s.includes('fethead') || s.includes('preamp') || s.includes('préampli') || s.includes('dm1') || s.includes('dynamite')) return 'preamplis';
  if (s.includes('bras') || s.includes('psa1') || s.includes('boom-arm') || s.includes('wave-arm') || s.includes('compass')) return 'bras-articules';
  if (s.includes('cable') || s.includes('câble') || s.includes('xlr-') || s.includes('sommer') || s.includes('cordial')) return 'cable-xlr';
  if (s.includes('acoust') || s.includes('mousse') || s.includes('panneau') || s.includes('absorbeur') || s.includes('bass-trap')) return 'traitement-acoustique';
  if (s.includes('usb') || s.includes('wave') || s.includes('yeti')) return 'micros-usb';
  if (s.includes('shotgun') || s.includes('ntg')) return 'micros-shotgun';
  if (s.includes('dynamic') || s.includes('dynamique') || s.includes('sm58') || s.includes('sm7') || s.includes('podmic') || s.includes('re20')) return 'micros-dynamiques';
  if (s.includes('condensateur') || s.includes('statique') || s.includes('at2020') || s.includes('nt1') || s.includes('c214') || s.includes('tlm') || s.includes('2003')) return 'micros-condensateurs';
  return 'autre';
}

export type ComparableFamily = 
  | 'microphones'
  | 'interfaces'
  | 'casques'
  | 'enceintes'
  | 'preamplis'
  | 'bras'
  | 'cables'
  | 'acoustique';

export function getComparableFamily(p: { slug?: string; name?: string; category_slug?: string; categories?: any }): ComparableFamily | null {
  const cat = detectProductCategory(p);
  if (['micros-dynamiques', 'micros-condensateurs', 'micros-usb', 'micros-shotgun', 'microphones'].includes(cat)) {
    return 'microphones';
  }
  if (['cartes-son', 'interfaces-audio', 'interfaces-monitoring'].includes(cat)) {
    return 'interfaces';
  }
  if (cat === 'casques-studio') {
    return 'casques';
  }
  if (cat === 'enceintes' || cat === 'monitoring') {
    return 'enceintes';
  }
  if (cat === 'preamplis') {
    return 'preamplis';
  }
  if (cat === 'bras-articules') {
    return 'bras';
  }
  if (cat === 'cable-xlr') {
    return 'cables';
  }
  if (cat === 'traitement-acoustique') {
    return 'acoustique';
  }
  return null;
}

export function areProductsComparable(
  pA: { slug?: string; name?: string; category_slug?: string; categories?: any },
  pB: { slug?: string; name?: string; category_slug?: string; categories?: any }
): boolean {
  const famA = getComparableFamily(pA);
  const famB = getComparableFamily(pB);
  if (!famA || !famB) return false;
  return famA === famB;
}

export function getFamilyDisplayName(fam: ComparableFamily | null): string {
  switch (fam) {
    case 'microphones': return 'Microphone';
    case 'interfaces': return 'Interface audio';
    case 'casques': return 'Casque studio';
    case 'enceintes': return 'Enceinte de monitoring';
    case 'preamplis': return 'Préampli studio';
    case 'bras': return 'Bras articulé';
    case 'cables': return 'Câble XLR';
    case 'acoustique': return 'Traitement acoustique';
    default: return 'Matériel audio';
  }
}

/**
 * Clean product name to avoid repeating brand name twice (e.g. 'Elgato Elgato Wave:3' -> 'Elgato Wave:3').
 */
export function formatProductName(brand: string, name: string): string {
  const b = (brand || '').trim();
  const n = (name || '').trim();
  if (!b) return n;
  if (n.toLowerCase().startsWith(b.toLowerCase())) return n;
  return `${b} ${n}`;
}

/**
 * Dynamically build technical comparison criteria tailored to the products' category.
 */
export function buildCategorySpecs(
  cat: string,
  pA: Product,
  pB: Product,
  priceA: number,
  priceB: number,
  priceDiffText: string
): DuelPoint[] {
  const basePricePoint: DuelPoint = {
    label: 'Prix indicatif',
    valA: priceA > 0 ? `${priceA.toLocaleString('fr-FR')} €` : 'N.C.',
    valB: priceB > 0 ? `${priceB.toLocaleString('fr-FR')} €` : 'N.C.',
    winner: priceA > 0 && priceB > 0 ? (priceA < priceB ? 'A' : priceB < priceA ? 'B' : 'tie') : null,
    detail: priceDiffText
  };

  if (cat === 'cartes-son') {
    const inputsA = pA.specs?.inputs || pA.specs?.['Entrées'] || (pA.pros?.some(p => p.toLowerCase().includes('insert')) ? '2 entrées combo + inserts hardware' : '2 entrées combo XLR/Jack');
    const inputsB = pB.specs?.inputs || pB.specs?.['Entrées'] || (pB.pros?.some(p => p.toLowerCase().includes('insert')) ? '2 entrées combo + inserts hardware' : '2 entrées combo XLR/Jack');
    const convA = pA.specs?.converters || (pA.pros?.some(p => p.toLowerCase().includes('32-bit')) ? '32-bit float / 192 kHz' : '24-bit / 192 kHz');
    const convB = pB.specs?.converters || (pB.pros?.some(p => p.toLowerCase().includes('32-bit')) ? '32-bit float / 192 kHz' : '24-bit / 192 kHz');
    const preampsA = pA.pros?.find(p => p.toLowerCase().includes('préampli') || p.toLowerCase().includes('preamp')) || 'Préamplis studio à faible bruit';
    const preampsB = pB.pros?.find(p => p.toLowerCase().includes('préampli') || p.toLowerCase().includes('preamp')) || 'Préamplis studio à faible bruit';
    const phonesA = pA.pros?.find(p => p.toLowerCase().includes('casque')) || '1 sortie casque studio';
    const phonesB = pB.pros?.find(p => p.toLowerCase().includes('casque')) || '1 sortie casque studio';

    return [
      basePricePoint,
      { label: 'Entrées / Sorties (I/O)', valA: String(inputsA), valB: String(inputsB), winner: null },
      { label: 'Résolution & Convertisseurs', valA: String(convA), valB: String(convB), winner: null },
      { label: 'Technologie de Préamplification', valA: String(preampsA), valB: String(preampsB), winner: null },
      { label: 'Section Casques & Monitoring', valA: String(phonesA), valB: String(phonesB), winner: null }
    ];
  }

  if (cat === 'casques-studio') {
    const isClosedA = pA.pros?.some(p => p.toLowerCase().includes('isolation')) || pA.slug.includes('770') || pA.slug.includes('7506') || pA.slug.includes('m50x');
    const isClosedB = pB.pros?.some(p => p.toLowerCase().includes('isolation')) || pB.slug.includes('770') || pB.slug.includes('7506') || pB.slug.includes('m50x');
    const cableA = pA.pros?.find(p => p.toLowerCase().includes('détachable') || p.toLowerCase().includes('câble')) || (pA.slug.includes('702') ? 'Câble détachable mini-XLR' : 'Câble studio professionnel');
    const cableB = pB.pros?.find(p => p.toLowerCase().includes('détachable') || p.toLowerCase().includes('câble')) || (pB.slug.includes('702') ? 'Câble détachable mini-XLR' : 'Câble studio professionnel');

    return [
      basePricePoint,
      { label: 'Type de conception', valA: isClosedA ? 'Fermé (Isolation phonique)' : 'Ouvert (Scène sonore panoramique)', valB: isClosedB ? 'Fermé (Isolation phonique)' : 'Ouvert (Scène sonore panoramique)', winner: null },
      { label: 'Usage studio recommandé', valA: isClosedA ? 'Enregistrement voix sans repisse & monitoring' : 'Mixage, mastering & écoute critique', valB: isClosedB ? 'Enregistrement voix sans repisse & monitoring' : 'Mixage, mastering & écoute critique', winner: null },
      { label: 'Câblage & Modularité', valA: String(cableA), valB: String(cableB), winner: null },
      { label: 'Signature & Équilibre', valA: pA.pros?.[0] || 'Rendu analytique neutre', valB: pB.pros?.[0] || 'Rendu analytique neutre', winner: null }
    ];
  }

  if (cat === 'enceintes') {
    const isSmallA = pA.slug.includes('5') || pA.name.includes('5');
    const isSmallB = pB.slug.includes('5') || pB.name.includes('5');
    const wooferA = isSmallA ? 'Woofer 5 pouces' : 'Woofer 8 pouces';
    const wooferB = isSmallB ? 'Woofer 5 pouces' : 'Woofer 8 pouces';
    const bassA = isSmallA ? 'Médiums précis, basses contrôlées (54 Hz)' : 'Descente profonde dans l\'infra-grave (33-38 Hz)';
    const bassB = isSmallB ? 'Médiums précis, basses contrôlées (54 Hz)' : 'Descente profonde dans l\'infra-grave (33-38 Hz)';

    return [
      basePricePoint,
      { label: 'Taille du haut-parleur grave', valA: wooferA, valB: wooferB, winner: null },
      { label: 'Réponse & Descente dans le grave', valA: bassA, valB: bassB, winner: null },
      { label: 'Espace & Pièce d\'écoute', valA: isSmallA ? 'Petites pièces et bureaux (< 15 m²)' : 'Pièces moyennes à grandes avec recul', valB: isSmallB ? 'Petites pièces et bureaux (< 15 m²)' : 'Pièces moyennes à grandes avec recul', winner: null },
      { label: 'Signature acoustique', valA: pA.pros?.[0] || 'Neutralité et transparence', valB: pB.pros?.[0] || 'Neutralité et transparence', winner: null }
    ];
  }

  if (cat.startsWith('micros-')) {
    const isUsbA = cat === 'micros-usb' || pA.specs?.connection?.toLowerCase().includes('usb') || pA.pros?.some(p => p.toLowerCase().includes('usb'));
    const isUsbB = cat === 'micros-usb' || pB.specs?.connection?.toLowerCase().includes('usb') || pB.pros?.some(p => p.toLowerCase().includes('usb'));
    const isDynamicA = cat === 'micros-dynamiques' || pA.specs?.['Principe acoustique']?.toLowerCase().includes('dynamique') || pA.pros?.some(p => p.toLowerCase().includes('dynamique'));
    const isDynamicB = cat === 'micros-dynamiques' || pB.specs?.['Principe acoustique']?.toLowerCase().includes('dynamique') || pB.pros?.some(p => p.toLowerCase().includes('dynamique'));

    return [
      basePricePoint,
      { label: 'Principe acoustique', valA: isDynamicA ? 'Dynamique' : 'Statique à condensateur', valB: isDynamicB ? 'Dynamique' : 'Statique à condensateur', winner: null },
      { label: 'Connectique & Protocole', valA: isUsbA ? 'USB-C direct numérique' : 'XLR symétrique analogique', valB: isUsbB ? 'USB-C direct numérique' : 'XLR symétrique analogique', winner: null },
      { label: 'Alimentation requise', valA: isUsbA ? 'Auto-alimenté via USB (5V)' : isDynamicA ? 'Aucune (Passif)' : 'Alimentation fantôme +48V', valB: isUsbB ? 'Auto-alimenté via USB (5V)' : isDynamicB ? 'Aucune (Passif)' : 'Alimentation fantôme +48V', winner: null },
      { label: 'Atout clé de captation', valA: pA.pros?.[0] || 'Directivité studio soignée', valB: pB.pros?.[0] || 'Directivité studio soignée', winner: null }
    ];
  }

  return [
    basePricePoint,
    { label: 'Atout principal', valA: pA.pros?.[0] || 'Conception de référence', valB: pB.pros?.[0] || 'Conception de référence', winner: null },
    { label: 'Ergonomie & Spécificités', valA: pA.pros?.[1] || 'Format optimisé pour créateurs', valB: pB.pros?.[1] || 'Format optimisé pour créateurs', winner: null },
    { label: 'Intégration & Connectique', valA: pA.specs?.connection || 'Standard studio', valB: pB.specs?.connection || 'Standard studio', winner: null }
  ];
}

/**
 * Universal dynamic duel generator creating bespoke, highly technical, and unique comparisons across ALL categories.
 */
export function generateUniversalDuelAnalysis(
  productA: Product,
  productB: Product,
  cat: string,
  priceA: number,
  priceB: number,
  priceDiffText: string,
  specs: DuelPoint[]
): DuelAnalysis {
  const nameA = formatProductName(productA.brand, productA.name);
  const nameB = formatProductName(productB.brand, productB.name);

  const proA1 = productA.pros?.[0] || 'qualité de fabrication soignée';
  const proA2 = productA.pros?.[1] || 'performances fiables en studio';
  const proB1 = productB.pros?.[0] || 'qualité de fabrication soignée';
  const proB2 = productB.pros?.[1] || 'performances fiables en studio';

  const conA1 = productA.cons?.[0] || '';
  const conB1 = productB.cons?.[0] || '';

  const priceDiff = Math.abs(priceA - priceB);
  let bestValueSlug: string | null = null;
  if (priceA > 0 && priceB > 0) {
    if (priceA < priceB * 0.78) bestValueSlug = productA.slug;
    else if (priceB < priceA * 0.78) bestValueSlug = productB.slug;
  }

  let card1Title = 'Signature Sonore & Rendu Acoustique';
  let card2Title = 'Chaîne Matérielle & Alimentation';
  let title = `${nameA} vs ${nameB} : Le Duel Expert`;
  let subtitle = `${productA.brand} mise sur ${proA1.toLowerCase()}, face à ${productB.brand} qui réplique par ${proB1.toLowerCase()}.`;
  let verdictLead = '';
  let acousticAnalysis = '';
  let hardwareRequirements = '';
  let chooseAIf: string[] = [];
  let chooseBIf: string[] = [];
  let conclusion = '';

  if (cat === 'cartes-son') {
    card1Title = 'Préamplification, Convertisseurs & Latence';
    card2Title = 'Connectivité, Alimentation & Compatibilité Studio';
    title = `${nameA} vs ${nameB} : Le Duel des Interfaces Audio`;
    verdictLead = `Sur le banc d'essai de l'Atelier Fluxlab, ce face-à-face entre le <strong>${nameA}</strong> (${priceA > 0 ? `${priceA}€` : 'N.C.'}) et le <strong>${nameB}</strong> (${priceB > 0 ? `${priceB}€` : 'N.C.'}) oppose deux visions du centre névralgique de votre studio. ${priceDiffText ? `Positionnement tarifaire : ${priceDiffText}.` : ''}`;
    acousticAnalysis = `Sur le plan de la conversion et de la préamplification, le ${productA.name} met en avant : ${proA1} ainsi que ${proA2}. Face à lui, le ${productB.name} se distingue par : ${proB1}, avec l'atout de ${proB2}. ${conA1 ? `Côté compromis, le ${productA.name} concède : ${conA1.toLowerCase()}.` : ''} ${conB1 ? `Tandis que le ${productB.name} affiche comme limite : ${conB1.toLowerCase()}.` : ''}`;
    hardwareRequirements = `Configuration & compatibilité : Vérifiez les ports USB de votre ordinateur (USB-C vs USB-A) et l'alimentation par bus. Si votre configuration nécessite de brancher du hardware analogique ou d'évoluer avec un parc de micros étendu, l'accès à des inserts ou à une extension optique ADAT fait toute la différence.`;
    chooseAIf = [
      `Vous recherchez en priorité : ${proA1}`,
      `Vous valorisez : ${proA2}`,
      priceA > 0 && priceB > 0 && priceA < priceB ? `Son tarif plus accessible (${priceDiff}€ d'économie)` : `L'intégration dans l'écosystème ${productA.brand}`
    ];
    chooseBIf = [
      `Votre priorité absolue est : ${proB1}`,
      `Vous avez besoin de : ${proB2}`,
      priceA > 0 && priceB > 0 && priceB < priceA ? `Son tarif plus avantageux (${priceDiff}€ d'économie)` : `La fiabilité et les technologies éprouvées de ${productB.brand}`
    ];
    conclusion = `Si votre studio exige ${proA1.toLowerCase()}, le ${nameA} prend l'avantage. En revanche, si vous cherchez avant tout ${proB1.toLowerCase()}, le ${nameB} représente l'option la plus cohérente.`;
  } else if (cat === 'casques-studio') {
    card1Title = 'Signature Acoustique, Image Stéréo & Confort';
    card2Title = 'Amplification Requise & Impédance';
    title = `${nameA} vs ${nameB} : Le Duel des Casques de Référence`;
    verdictLead = `La confrontation entre le <strong>${nameA}</strong> (${priceA > 0 ? `${priceA}€` : 'N.C.'}) et le <strong>${nameB}</strong> (${priceB > 0 ? `${priceB}€` : 'N.C.'}) départage deux références du monitoring au casque. ${priceDiffText ? `Écart budgétaire : ${priceDiffText}.` : ''}`;
    acousticAnalysis = `Sur le plan du rendu sonore et de la spatialisation, le ${productA.name} propose : ${proA1} et ${proA2}. En face, le ${productB.name} répond par : ${proB1} complété par ${proB2}. ${conA1 ? `À noter : le ${productA.name} présente comme réserve : ${conA1.toLowerCase()}.` : ''} ${conB1 ? `Le ${productB.name}, quant à lui, montre une limite sur : ${conB1.toLowerCase()}.` : ''}`;
    hardwareRequirements = `Alimentation & Impédance : Veillez à adapter la source d'écoute. Un casque à haute impédance (supérieure à 80 Ohms) réclame un préampli casque robuste ou une interface audio dédiée avec une bonne réserve de tension, sous peine d'un niveau sonore trop faible et de basses manquant de dynamique.`;
    chooseAIf = [
      `Votre priorité d'écoute : ${proA1}`,
      `Vous cherchez le confort et : ${proA2}`,
      priceA > 0 && priceB > 0 && priceA < priceB ? `Son rapport prix/performances plus doux` : `La fidélité signature ${productA.brand}`
    ];
    chooseBIf = [
      `Votre profil d'utilisation réclame : ${proB1}`,
      `Vous privilégiez : ${proB2}`,
      priceA > 0 && priceB > 0 && priceB < priceA ? `Son tarif plus compétitif sur le marché` : `La robustesse reconnue de ${productB.brand}`
    ];
    conclusion = `Pour une utilisation axée sur ${proA1.toLowerCase()}, le ${nameA} est le partenaire idéal. Si votre session demande plutôt ${proB1.toLowerCase()}, le ${nameB} l'emporte avec brio.`;
  } else if (cat === 'enceintes') {
    card1Title = 'Rendu Fréquentiel, Dispersion & Réponse dans le Grave';
    card2Title = 'Acoustique de Pièce, Câblage & Placement';
    title = `${nameA} vs ${nameB} : Le Duel des Enceintes de Monitoring`;
    verdictLead = `Sur le segment de l'écoute de contrôle, le duel entre le <strong>${nameA}</strong> (${priceA > 0 ? `${priceA}€` : 'N.C.'}) et le <strong>${nameB}</strong> (${priceB > 0 ? `${priceB}€` : 'N.C.'}) confronte deux étalons du home-studio moderne.`;
    acousticAnalysis = `En matière d'équilibre spectral et d'image stéréo, le ${productA.name} s'illustre par : ${proA1}, consolidé par ${proA2}. En face, le ${productB.name} réplique avec : ${proB1} et ${proB2}. ${conA1 ? `Point à anticiper : le ${productA.name} peut montrer ses limites sur : ${conA1.toLowerCase()}.` : ''} ${conB1 ? `Pour le ${productB.name}, attention à : ${conB1.toLowerCase()}.` : ''}`;
    hardwareRequirements = `Placement & Acoustique : La taille du haut-parleur grave conditionne l'exigence acoustique de votre pièce. Pour un petit espace non traité (< 15 m²), une enceinte 5 pouces évite les accumulations d'ondes stationnaires dans le bas, tandis qu'un modèle 8 pouces exige au minimum des bass traps d'angle et un découplage soigné (mousses ou pieds d'isolation).`;
    chooseAIf = [
      `Vous cherchez en premier lieu : ${proA1}`,
      `Votre configuration apprécie : ${proA2}`,
      priceA > 0 && priceB > 0 && priceA < priceB ? `Son tarif plus attractif (${priceDiff}€ d'écart)` : `L'équilibre sonore ${productA.brand}`
    ];
    chooseBIf = [
      `Votre priorité est : ${proB1}`,
      `Vous voulez profiter de : ${proB2}`,
      priceA > 0 && priceB > 0 && priceB < priceA ? `Son tarif plus abordable` : `La conception audio de pointe signée ${productB.brand}`
    ];
    conclusion = `Selon que votre pièce et vos productions demandent ${proA1.toLowerCase()} ou ${proB1.toLowerCase()}, le choix se portera naturellement vers le ${nameA} ou le ${nameB}.`;
  } else if (cat.startsWith('micros-')) {
    card1Title = 'Signature Sonore & Rendu Acoustique';
    card2Title = 'Chaîne Matérielle & Alimentation';
    title = `${nameA} vs ${nameB} : Le Duel des Microphones Studio`;
    verdictLead = `La confrontation entre le <strong>${nameA}</strong> (${priceA > 0 ? `${priceA}€` : 'N.C.'}) et le <strong>${nameB}</strong> (${priceB > 0 ? `${priceB}€` : 'N.C.'}) oppose deux philosophies de captation vocale et instrumentale.`;
    acousticAnalysis = `D'un côté, le ${productA.name} propose : ${proA1}, avec comme avantage déterminant ${proA2}. De l'autre côté, le ${productB.name} mise sur : ${proB1} complété par ${proB2}. ${conA1 ? `Sur le plan des contraintes, le ${productA.name} concède : ${conA1.toLowerCase()}.` : ''} ${conB1 ? `Tandis que le ${productB.name} demande de la vigilance sur : ${conB1.toLowerCase()}.` : ''}`;
    hardwareRequirements = `Préamplification & Alimentation : Si vous optez pour un microphone statique, l'alimentation fantôme +48V est obligatoire via votre interface XLR. Pour un micro dynamique passif à faible niveau, assurez-vous que votre carte son délivre au moins +55 à +60 dB de gain propre ou prévoyez un activateur de gain (booster en ligne).`;
    chooseAIf = [
      `Votre timbre et vos prises réclament : ${proA1}`,
      `Vous appréciez : ${proA2}`,
      priceA > 0 && priceB > 0 && priceA < priceB ? `Son tarif inférieur (${priceDiff}€ d'économie)` : `La réputation acoustique ${productA.brand}`
    ];
    chooseBIf = [
      `Votre chaîne vocale demande : ${proB1}`,
      `Vous recherchez : ${proB2}`,
      priceA > 0 && priceB > 0 && priceB < priceA ? `Son positionnement tarifaire compétitif` : `L'expertise matérielle de ${productB.brand}`
    ];
    conclusion = `Si votre recherche sonore se focalise sur ${proA1.toLowerCase()}, le ${nameA} s'impose. Si votre priorité opérationnelle est plutôt ${proB1.toLowerCase()}, le ${nameB} représente la meilleure option.`;
  } else {
    card1Title = 'Performances, Conception & Ergonomie';
    card2Title = 'Intégration Studio, Connectique & Câblage';
    title = `${nameA} vs ${nameB} : L'Analyse Comparative Fluxlab`;
    verdictLead = `Ce duel oppose le <strong>${nameA}</strong> (${priceA > 0 ? `${priceA}€` : 'N.C.'}) au <strong>${nameB}</strong> (${priceB > 0 ? `${priceB}€` : 'N.C.'}). Deux équipements rigoureusement évalués par l'Atelier Fluxlab.`;
    acousticAnalysis = `D'un côté, le ${productA.name} s'illustre par : ${proA1}, avec comme force ${proA2}. De l'autre côté, le ${productB.name} riposte avec : ${proB1} et ${proB2}. ${conA1 ? `Le principal point de vigilance pour le ${productA.name} concerne : ${conA1.toLowerCase()}.` : ''} ${conB1 ? `Pour le ${productB.name}, attention à : ${conB1.toLowerCase()}.` : ''}`;
    hardwareRequirements = `Intégration & Chaîne de signal : Prenez en compte vos connectiques, câblages et l'environnement d'utilisation pour intégrer parfaitement ce matériel au reste de votre équipement.`;
    chooseAIf = [
      `Vous voulez bénéficier de : ${proA1}`,
      `Vous appréciez : ${proA2}`,
      priceA > 0 && priceB > 0 && priceA < priceB ? `Son tarif inférieur (${priceDiff}€ d'écart)` : `La signature de marque ${productA.brand}`
    ];
    chooseBIf = [
      `Vous recherchez : ${proB1}`,
      `Vous accordez de l'importance à : ${proB2}`,
      priceA > 0 && priceB > 0 && priceB < priceA ? `Son tarif plus accessible` : `La conception éprouvée de ${productB.brand}`
    ];
    conclusion = `Selon que votre priorité va à ${proA1.toLowerCase()} ou à ${proB1.toLowerCase()}, le choix se portera naturellement vers le ${nameA} ou le ${nameB}.`;
  }

  return {
    title,
    subtitle,
    verdictLead,
    card1Title,
    card2Title,
    acousticAnalysis,
    hardwareRequirements,
    pointsA: productA.pros?.map(stripHtml).slice(0, 4) || ['Conception soignée', 'Rendu fidèle'],
    pointsB: productB.pros?.map(stripHtml).slice(0, 4) || ['Conception soignée', 'Rendu fidèle'],
    chooseAIf,
    chooseBIf,
    conclusion,
    specs,
    priceDiffText,
    bestValueSlug
  };
}

/**
 * Generate a dynamic, highly specific, technically accurate duel between two products.
 */
export function generateDuelAnalysis(productA: Product, productB: Product): DuelAnalysis {
  const isComparable = areProductsComparable(productA, productB);
  const famA = getComparableFamily(productA);
  const famB = getComparableFamily(productB);

  // If products are from different categories, generate a respectful complementary explanation instead of an absurd duel
  if (!isComparable) {
    const labelA = getFamilyDisplayName(famA);
    const labelB = getFamilyDisplayName(famB);
    return {
      isComparable: false,
      incompatibleReason: `Un ${labelA.toLowerCase()} et une ${labelB.toLowerCase()} ont des rôles complémentaires, pas concurrents.`,
      title: 'Comparaison Non Applicable : Rôles Complémentaires',
      subtitle: `Le ${productA.name} et le ${productB.name} n'appartiennent pas à la même catégorie.`,
      verdictLead: `Le <strong>${productA.brand} ${productA.name}</strong> (${labelA}) et le <strong>${productB.brand} ${productB.name}</strong> (${labelB}) ne peuvent pas être mis en opposition directe. Dans une chaîne de son studio, ces deux équipements sont <strong>complémentaires</strong> et collaborent ensemble plutôt que de se concurrencer.`,
      card1Title: 'Rôle de chaque équipement',
      card2Title: 'Synergie & Chaîne Audio',
      acousticAnalysis: `Le ${productA.name} assure la fonction de ${labelA.toLowerCase()}, tandis que le ${productB.name} est dédié au rôle de ${labelB.toLowerCase()}. Remplacer l'un par l'autre est impossible car ils interviennent à des maillons différents de votre son.`,
      hardwareRequirements: `Dans une configuration studio cohérente, ces deux éléments travaillent de concert (par exemple brancher un micro dans une interface audio, ou écouter la sortie au casque).`,
      pointsA: productA.pros?.slice(0, 3) || ['Équipement certifié'],
      pointsB: productB.pros?.slice(0, 3) || ['Équipement certifié'],
      chooseAIf: [
        `Vous devez vous équiper ou renouveler votre ${labelA.toLowerCase()}`,
        `Votre chaîne audio manque de cette fonction en priorité`
      ],
      chooseBIf: [
        `Vous devez vous équiper ou renouveler votre ${labelB.toLowerCase()}`,
        `Votre chaîne audio manque de cette fonction en priorité`
      ],
      conclusion: `Pour un duel technique pertinent, comparez le ${productA.name} avec un autre ${labelA.toLowerCase()}, ou le ${productB.name} avec une autre ${labelB.toLowerCase()}.`,
      specs: [
        { label: 'Famille de matériel', valA: labelA, valB: labelB, winner: null },
        { label: 'Rôle dans la chaîne', valA: `Composant ${labelA.toLowerCase()}`, valB: `Composant ${labelB.toLowerCase()}`, winner: null }
      ],
      priceDiffText: '',
      bestValueSlug: null
    };
  }

  const cat = detectProductCategory(productA);
  const profA = STUDIO_MIC_PROFILES[productA.slug];
  const profB = STUDIO_MIC_PROFILES[productB.slug];

  const priceA = productA.price || (productA.offers?.[0]?.price) || 0;
  const priceB = productB.price || (productB.offers?.[0]?.price) || 0;
  const priceDiff = Math.abs(priceA - priceB);

  // Price label
  let priceDiffText = '';
  if (priceA > 0 && priceB > 0) {
    if (priceDiff < 25) {
      priceDiffText = 'Même tranche tarifaire (écart de moins de 25€)';
    } else if (priceA < priceB) {
      const ratio = (priceB / priceA).toFixed(1);
      priceDiffText = `${productA.name} est ${priceDiff}€ moins cher (${ratio}x plus abordable)`;
    } else {
      const ratio = (priceA / priceB).toFixed(1);
      priceDiffText = `${productB.name} est ${priceDiff}€ moins cher (${ratio}x plus abordable)`;
    }
  }

  // Build category-adapted specs table
  const specs = buildCategorySpecs(cat, productA, productB, priceA, priceB, priceDiffText);

  // ─── CURATED HISTORIC DUELS ─────────────────────────────────────────────
  // 1. Audio-Technica AT2020 vs MXL 2003a
  if (
    (productA.slug === 'at2020' && (productB.slug === '2003a' || productB.name.includes('2003'))) ||
    ((productA.slug === '2003a' || productA.name.includes('2003')) && productB.slug === 'at2020')
  ) {
    const isAAt2020 = productA.slug === 'at2020';
    return {
      title: 'Le Standard Industriel face au Secret de Studio U87',
      subtitle: 'L\'incontournable référence japonaise Audio-Technica face à la pépite vintage de MXL.',
      verdictLead: `Ce duel oppose le micro statique d\'entrée de gamme le plus célèbre au monde (${isAAt2020 ? productA.name : productB.name}) à un joyau caché très prisé des home-studistes avertis (${isAAt2020 ? productB.name : productA.name}).`,
      card1Title: 'Signature Sonore & Rendu Acoustique',
      card2Title: 'Chaîne Matérielle & Alimentation',
      acousticAnalysis: `Sur le plan acoustique, l'Audio-Technica AT2020 mise sur la transparence et l'équilibre : sa capsule de 16 mm procure une réponse droite avec une bosse de présence à 9-10 kHz qui fait percer la voix sans lourdeur dans le bas. Face à lui, le MXL 2003a intègre une véritable capsule large diaphragme de 27 mm pulvérisée à l'or et un circuit sans transformateur inspiré du célèbre Neumann U87 : le son est plus chaud, plus dense et plus flatteur sur les voix masculines ou les instruments acoustiques, avec un côté "vintage studio" très prononcé.`,
      hardwareRequirements: `Point technique essentiel : étant tous deux des microphones statiques (condensateurs), l'AT2020 et le MXL 2003a requièrent impérativement une alimentation fantôme +48V fournie par votre interface audio XLR. Contrairement aux micros dynamiques, leur niveau de sortie est élevé et ils ne nécessitent aucun activateur de gain (pas de Cloudlifter). Prévoyez en revanche un filtre anti-pop et une suspension antichoc (souvent incluse avec le 2003a, mais vendue séparément pour l'AT2020).`,
      pointsA: productA.pros || ['Conception soignée', 'Rendu fidèle'],
      pointsB: productB.pros || ['Conception soignée', 'Rendu fidèle'],
      chooseAIf: isAAt2020 ? [
        'Vous cherchez la fiabilité et la robustesse mécanique légendaire d\'Audio-Technica (corps en métal lourd de 345 g)',
        'Vous voulez une réponse nette, aérée et transparente sans coloration excessive',
        'Vous devez encaisser de forts volumes sonores (SPL max de 144 dB)'
      ] : [
        'Vous cherchez la texture sonore chaude et feutrée d\'une capsule large membrane 27 mm dorée',
        'Vous voulez les commutateurs intégrés (pad -10 dB et filtre coupe-bas 150 Hz)',
        'Vous cherchez le meilleur grain vocal vintage pour moins de 160€'
      ],
      chooseBIf: isAAt2020 ? [
        'Vous cherchez la chaleur et la rondeur des médiums d\'une capsule 27 mm inspirée du son Neumann U87',
        'Vous appréciez d\'avoir un atténuateur pad -10 dB et un filtre coupe-bas 150 Hz commutables sur le micro',
        'Vous voulez une suspension antichoc fournie d\'origine'
      ] : [
        'Vous voulez la valeur sûre internationale, indestructible et revendable instantanément',
        'Vous préférez une signature plus moderne, incisive et directe',
        'Vous avez déjà votre propre suspension ou pied de table'
      ],
      conclusion: `L'Audio-Technica AT2020 reste le choix de la raison et de la robustesse pour débuter sans risque. Le MXL 2003a est le coup de cœur de l'ingénieur du son : sa capsule large et son timbre typé U87 apportent une dimension organique et chaleureuse rare dans cette tranche tarifaire.`,
      specs,
      priceDiffText,
      bestValueSlug: isAAt2020 ? productB.slug : productA.slug
    };
  }

  // 2. Shure SM7B vs Rode PodMic
  if (
    (productA.slug === 'shure-sm7b' && productB.slug === 'rode-podmic') ||
    (productA.slug === 'rode-podmic' && productB.slug === 'shure-sm7b')
  ) {
    const isASm7b = productA.slug === 'shure-sm7b';
    return {
      title: 'Le Standard Mondial face au Champion du Rapport Qualité/Prix',
      subtitle: '5x moins cher, le PodMic peut-il rivaliser avec la légende des podcasts Shure SM7B ?',
      verdictLead: `Ce duel oppose la référence absolue des studios broadcast (${isASm7b ? productA.name : productB.name} à ≈${isASm7b ? priceA : priceB}€) au micro qui a démocratisé le podcasting mondial (${isASm7b ? productB.name : productA.name} à ≈${isASm7b ? priceB : priceA}€).`,
      card1Title: 'Signature Sonore & Rendu Acoustique',
      card2Title: 'Chaîne Matérielle & Préamplification',
      acousticAnalysis: `Sur le plan acoustique, le SM7B se distingue par son grain chaud, sombre et très feutré : il absorbe les sifflantes et pardonne les voix acides tout en apportant une belle assise radio. Le PodMic offre une réponse plus tranchante, avec une bosse marquée dans les hauts médiums qui le rend immédiatement intelligible mais parfois un peu sec ou métallique si la voix est déjà aiguë.`,
      hardwareRequirements: `Attention au coût réel du setup : le SM7B possède une sensibilité extrêmement basse (-59 dB) et exige impérativement une interface capable de délivrer +60 dB de gain propre ou l'ajout d'un Cloudlifter/FetHead (+100€ à +150€). Le PodMic demande lui aussi du gain propre, mais son investissement de départ très bas permet d'absorber l'achat d'une bonne carte son.`,
      pointsA: productA.pros || ['Finition broadcast', 'Son feutré'],
      pointsB: productB.pros || ['Finition broadcast', 'Son feutré'],
      chooseAIf: isASm7b ? [
        'Vous cherchez la texture sonore veloutée et chaleureuse des plus grands podcasts pros',
        'Votre voix a tendance à produire des sifflantes ou des aigus agressifs',
        'Vous disposez déjà d\'un préampli à fort gain ou du budget pour un Cloudlifter'
      ] : [
        'Votre budget total micro est inférieur à 100€',
        'Vous équipez une table ronde de plusieurs intervenants',
        'Vous voulez un micro compact, 100% métal, avec filtre anti-pop déjà intégré'
      ],
      chooseBIf: isASm7b ? [
        'Votre budget total micro est inférieur à 100€',
        'Vous équipez une table ronde de 2 à 4 personnes sans vous ruiner',
        'Vous voulez un micro compact, 100% métal, avec filtre anti-pop déjà intégré'
      ] : [
        'Vous voulez la signature vocale iconique et feutrée des studios mondiaux',
        'Vous enregistrez des voix parlées exigeantes ou du chant saturé rock/metal',
        'Vous avez la chaîne de gain nécessaire pour alimenter un micro passif exigeant'
      ],
      conclusion: `Si le budget est votre priorité absolue, le Rode PodMic réalise un sans-faute en offrant 80% des performances d'un micro broadcast pour 20% du prix. En revanche, pour une empreinte sonore premium et un confort d'écoute inégalé sur les sessions longues, le Shure SM7B reste indétrônable.`,
      specs,
      priceDiffText,
      bestValueSlug: isASm7b ? productB.slug : productA.slug
    };
  }

  // 3. Shure SM7B vs Electro-Voice RE20
  if (
    (productA.slug === 'shure-sm7b' && (productB.slug === 'electro-voice-re20' || productB.slug === 'electro-voice-re20-black')) ||
    ((productA.slug === 'electro-voice-re20' || productA.slug === 'electro-voice-re20-black') && productB.slug === 'shure-sm7b')
  ) {
    const isASm7b = productA.slug === 'shure-sm7b';
    return {
      title: 'Le Choc des Titans Broadcast : Rondeur Feutrée vs Neutralité Chirurgicale',
      subtitle: 'Les deux légendes historiques des ondes radiophoniques face à face.',
      verdictLead: `Il s'agit de la confrontation la plus classique et la plus débattue de l'histoire de l'audio broadcast. D'un côté, le timbre chaud et intime du ${isASm7b ? productA.name : productB.name} ; de l'autre, l'intelligibilité chirurgicale et la technologie Variable-D du ${isASm7b ? productB.name : productA.name}.`,
      card1Title: 'Signature Sonore & Rendu Acoustique',
      card2Title: 'Chaîne Matérielle & Alimentation',
      acousticAnalysis: `La différence fondamentale réside dans l'effet de proximité : le SM7B possède un effet de proximité flatteur qui grossit les graves lorsque l'on se colle à la capsule (effet radio intimiste). L'Electro-Voice RE20 élimine presque totalement cet effet grâce à ses fentes acoustiques Variable-D : que l'animateur soit à 2 cm ou à 15 cm du micro, le timbre ne varie pas d'un iota. De plus, le RE20 est plus clair, plus ouvert et plus droit.`,
      hardwareRequirements: `Les deux micros sont passifs et réclament tous deux une préamplification robuste (+55 à +60 dB). Le RE20 est légèrement plus sensible (-56 dB vs -59 dB), mais un préampli propre ou un booster en ligne reste fortement recommandé pour les deux.`,
      pointsA: productA.pros || ['Finition pro', 'Son broadcast'],
      pointsB: productB.pros || ['Finition pro', 'Son broadcast'],
      chooseAIf: isASm7b ? [
        'Vous cherchez une voix chaleureuse, ronde, flatteuse et intimiste (podcast solo, voix off)',
        'Vous voulez calmer des aigus perçants ou des sifflantes naturelles',
        'Le tarif (~398€ vs ~600€) penche en faveur de Shure'
      ] : [
        'Vous bougez la tête devant le micro sans vouloir voir vos basses exploser',
        'Vous cherchez la neutralité FM américaine légendaire',
        'Vous cherchez un micro tout aussi redoutable sur les instruments (cuivres, kick)'
      ],
      chooseBIf: isASm7b ? [
        'Vous bougez souvent la tête ou vous animez des débats vifs (zéro variation de timbre grâce au Variable-D)',
        'Vous privilégiez la neutralité exacte de la voix sans coloration sombre',
        'Vous souhaitez aussi enregistrer des cuivres, des percussions ou une grosse caisse en studio'
      ] : [
        'Vous voulez ce grain feutré et enveloppant si caractéristique des podcasts modernes',
        'Vous avez besoin d\'un filtre coupe-haut naturel pour adoucir le timbre',
        'Vous souhaitez économiser environ 150 à 200€ sur le micro'
      ],
      conclusion: `Victoire du SM7B pour le podcast intimiste et le grain vocal flatteur. Victoire du RE20 pour l'intelligibilité radio pure, la tolérance aux mouvements de tête et la polyvalence instrumentale en studio.`,
      specs,
      priceDiffText,
      bestValueSlug: isASm7b ? productA.slug : productB.slug
    };
  }

  // 4. Shure SM7B vs Shure SM7dB
  if (
    (productA.slug === 'shure-sm7b' && productB.slug === 'shure-sm7db') ||
    (productA.slug === 'shure-sm7db' && productB.slug === 'shure-sm7b')
  ) {
    const isASm7b = productA.slug === 'shure-sm7b';
    return {
      title: 'Classique Passif vs Évolution Active avec Préampli Intégré',
      subtitle: 'Même capsule mythique : le préampli intégré du SM7dB vaut-il son surcoût ?',
      verdictLead: `C'est un duel fratricide : le ${isASm7b ? productB.name : productA.name} reprend rigoureusement la même capsule acoustique et la même signature que le ${isASm7b ? productA.name : productB.name}, mais y ajoute un préamplificateur actif commutable (+18 dB ou +28 dB) sous licence Shure.`,
      card1Title: 'Signature Sonore & Rendu Acoustique',
      card2Title: 'Chaîne Matérielle & Alimentation',
      acousticAnalysis: `En termes de réponse en fréquence et de couleur tonale, les deux micros sont rigoureusement identiques : le SM7dB restitue fidèlement le grain feutré, chaud et blindé du SM7B original. Le son n'est ni dénaturé ni altéré par le circuit actif Shure, qui se distingue par un rapport signal/bruit exceptionnel.`,
      hardwareRequirements: `C'est sur la chaîne matérielle que tout se joue : le SM7B traditionnel réclame une interface haut de gamme ou un boîtier externe (Cloudlifter CL-1 à ~140€ + un câble XLR additionnel). Le SM7dB résout ce problème en intégrant le booster directement dans son corps : alimenté en 48V, il se branche sur n'importe quelle carte son même d'entrée de gamme avec un niveau de sortie parfait. Il offre également un mode bypass pour redevenir un SM7B passif.`,
      pointsA: productA.pros || ['Finition pro', 'Son broadcast'],
      pointsB: productB.pros || ['Finition pro', 'Son broadcast'],
      chooseAIf: isASm7b ? [
        'Vous possédez déjà une interface audio avec d\'excellents préamplis (Apollo, RME, MOTU) ou un Cloudlifter',
        'Vous voulez dépenser le moins possible à l\'achat immédiat (~398€ vs ~525€)',
        'Vous préférez une chaîne 100% analogique passive sans aucun circuit actif'
      ] : [
        'Vous voulez une solution tout-en-un sans boîtier Cloudlifter externe à acheter',
        'Vous utilisez une interface standard et avez besoin de gain propre immédiat',
        'Vous voulez la flexibilité du switch actif/passif officiel Shure'
      ],
      chooseBIf: isASm7b ? [
        'Vous partez de zéro ou vous avez une carte son standard (Focusrite Scarlett, PreSonus, Audient)',
        'Vous voulez une installation propre sans câble supplémentaire ni boîtier externe qui traîne',
        'Vous souhaitez une flexibilité maximale (+18 dB, +28 dB ou bypass passif)'
      ] : [
        'Vous possédez déjà un bon préampli externe dédié',
        'Vous préférez le modèle passif historique à tarif plus doux'
      ],
      conclusion: `Faites le calcul du pack : SM7B (398€) + Cloudlifter (140€) + câble XLR (15€) = ~553€. Le SM7dB à ~525€ s'avère en réalité plus économique et bien plus élégant sur votre bureau si vous ne possédez pas déjà d'activateur de gain!`,
      specs,
      priceDiffText,
      bestValueSlug: isASm7b ? productA.slug : productB.slug
    };
  }

  // 5. Audio-Technica BP40 vs Shure SM7B
  if (
    (productA.slug === 'audio-technica-bp40' && productB.slug === 'shure-sm7b') ||
    (productA.slug === 'shure-sm7b' && productB.slug === 'audio-technica-bp40')
  ) {
    const isABp40 = productA.slug === 'audio-technica-bp40';
    return {
      title: 'Diaphragme Géant Hypercardioïde vs Standard Broadcast Chaud',
      subtitle: 'Le challenger technique d\'Audio-Technica face au ténor de Shure.',
      verdictLead: `Le duel entre l'${isABp40 ? productA.name : productB.name} et le ${isABp40 ? productB.name : productA.name} met aux prises deux visions de l'audio studio : la précision transitoire et la réjection extrême d'un côté, la rondeur et la douceur de l'autre.`,
      card1Title: 'Signature Sonore & Rendu Acoustique',
      card2Title: 'Chaîne Matérielle & Alimentation',
      acousticAnalysis: `Le BP40 embarque une capsule surdimensionnée de 37 mm avec une directivité hypercardioïde, tandis que le SM7B utilise une membrane standard cardioïde. Conséquence directe : le BP40 rejette beaucoup plus les bruits latéraux et les réverbérations de pièce. Son son est plus rapide, plus punchy et plus défini dans les aigus, rappelant presque un micro statique, tandis que le SM7B adoucit et arrondit le message.`,
      hardwareRequirements: `Énorme avantage pour le BP40 en matière de sensibilité : avec -43 dBV/Pa contre -59 dBV/Pa pour le SM7B, le BP40 délivre environ 16 dB de signal supplémentaire! Il n'a aucun besoin d'activateur de gain ou de préampli musclé : n'importe quelle carte son USB le pilote à la perfection.`,
      pointsA: productA.pros || ['Finition pro', 'Son broadcast'],
      pointsB: productB.pros || ['Finition pro', 'Son broadcast'],
      chooseAIf: isABp40 ? [
        'Votre pièce n\'est pas traitée acoustiquement (l\'hypercardioïde rejette bien mieux les réverbérations)',
        'Vous ne voulez pas investir dans un Cloudlifter (sortie 16 dB plus puissante que le SM7B)',
        'Vous cherchez des graves profonds avec l\'attaque et le piqué d\'un grand diaphragme'
      ] : [
        'Vous voulez adoucir une voix perçante et bénéficier de l\'effet feutré studio',
        'Vous disposez déjà de la préamplification adaptée'
      ],
      chooseBIf: isABp40 ? [
        'Vous cherchez à masquer des sifflantes ou un timbre vocal naturellement agressif',
        'Vous préférez le look iconique noir mat Shure sur votre vidéo',
        'Vous voulez un angle de captation un peu plus large (cardioïde plus tolérant que l\'hypercardioïde)'
      ] : [
        'Vous voulez une réjection supérieure des réflexions de votre pièce',
        'Vous refusez d\'acheter un booster de gain externe pour avoir un signal exploitable',
        'Vous cherchez la précision et les basses monumentales de la capsule 37 mm'
      ],
      conclusion: `L'Audio-Technica BP40 est l'arme secrète des acoustiques difficiles : il isole mieux de la pièce que le SM7B, se préamplifie sans aucun accessoire coûteux et coûte moins cher. Le SM7B conserve l'avantage pour les voix qui nécessitent d'être naturellement adoucies.`,
      specs,
      priceDiffText,
      bestValueSlug: isABp40 ? productA.slug : productB.slug
    };
  }

  // 6. Shure SM58 vs Sennheiser e 835 / sE Electronics V7
  if (
    (productA.slug === 'shure-sm58' && (productB.slug === 'sennheiser-e-835' || productB.slug === 'se-electronics-v7')) ||
    ((productA.slug === 'sennheiser-e-835' || productA.slug === 'se-electronics-v7') && productB.slug === 'shure-sm58')
  ) {
    const isASm58 = productA.slug === 'shure-sm58';
    const otherName = isASm58 ? productB.name : productA.name;
    return {
      title: 'Le Monstre Sacré de la Scène vs la Relève Haute Fidélité',
      subtitle: `Le SM58 légendaire peut-il résister à la clarté moderne du ${otherName} ?`,
      verdictLead: `Depuis des décennies, le Shure SM58 règne sur toutes les scènes de la planète. Face à lui, des micros dynamiques modernes comme le ${otherName} viennent corriger son principal reproche : un manque d'air et de brillance dans les hautes fréquences.`,
      card1Title: 'Signature Sonore & Rendu Acoustique',
      card2Title: 'Chaîne Matérielle & Alimentation',
      acousticAnalysis: `Le SM58 a été pensé pour percer les mix de scène saturés grâce à sa bosse à 4-5 kHz, mais son haut du spectre coupe vite au-delà de 15 kHz, ce qui donne parfois un son un peu « carton » ou voilé sur les voix douces. Le ${otherName} offre une réponse bien plus ouverte et cristalline, capturant les respirations et le détail avec une clarté quasi-studio sans égalisation agressive.`,
      hardwareRequirements: `Les deux micros fonctionnent à merveille sur toute interface audio sans aucune exigence particulière de gain, et sont tous deux d'une robustesse éprouvée sur les tournées.`,
      pointsA: productA.pros || ['Finition pro', 'Son live'],
      pointsB: productB.pros || ['Finition pro', 'Son live'],
      chooseAIf: isASm58 ? [
        'Vous voulez la fiabilité absolue et l\'universalité du micro le plus répandu au monde',
        'Votre voix est très puissante ou perçante et a besoin de la limitation naturelle du SM58',
        'Vous cherchez une revente garantie et des pièces de rechange disponibles partout'
      ] : [
        'Vous voulez une captation plus aérée, moderne et intelligible sans retouche EQ',
        'Vous cherchez une meilleure résistance aux larsens'
      ],
      chooseBIf: isASm58 ? [
        `Vous trouvez le SM58 trop sourd ou voilé et voulez plus de clarté naturelle`,
        'Vous voulez une meilleure isolation des retours et bruits ambiants',
        'Vous cherchez un son plus moderne et aéré dès la prise de son brute'
      ] : [
        'Vous voulez le standard éprouvé par 60 ans d\'histoire de la musique',
        'Vous privilégiez la robustesse mécanique absolue'
      ],
      conclusion: `Pour chanter ou animer aujourd'hui, le ${otherName} propose une fidélité et une aération supérieures qui modernisent instantanément le timbre de votre voix. Le SM58 reste le tank indestructible à posséder dans toute trousse de secours.`,
      specs,
      priceDiffText,
      bestValueSlug: isASm58 ? productB.slug : productA.slug
    };
  }

  // ─── 7. GENERAL RECOGNIZED MICROPHONE PROFILES ──────────────────────────
  if (profA && profB) {
    const title = `${profA.name} vs ${profB.name} : Le Duel Acoustique`;
    const subtitle = `Confrontation technique entre deux références de studio.`;
    const verdictLead = `La confrontation entre le <strong>${productA.brand} ${productA.name}</strong> (${priceA > 0 ? `≈ ${priceA}€` : 'N.C.'}) et le <strong>${productB.brand} ${productB.name}</strong> (${priceB > 0 ? `≈ ${priceB}€` : 'N.C.'}) illustre deux approches distinctes de la captation studio.`;
    const acousticAnalysis = `D'un côté, le ${productA.name} se caractérise par : ${profA.signature.toLowerCase()} (${profA.toneDesc}). De l'autre, le ${productB.name} mise sur : ${profB.signature.toLowerCase()} (${profB.toneDesc}).`;
    
    let hardwareRequirements = '';
    let bestValueSlug: string | null = null;

    if (profA.requiresPhantom48V && !profB.requiresPhantom48V) {
      hardwareRequirements = `Point crucial : le ${productA.name} est un statique nécessitant une alimentation fantôme +48V. Le ${productB.name} est un dynamique passif (${profB.gainNeedsDesc}).`;
    } else if (!profA.requiresPhantom48V && profB.requiresPhantom48V) {
      hardwareRequirements = `Point crucial : le ${productB.name} est un statique nécessitant une alimentation fantôme +48V. Le ${productA.name} est un dynamique passif (${profA.gainNeedsDesc}).`;
    } else if (profA.hasIntegratedPreamp && !profB.hasIntegratedPreamp) {
      hardwareRequirements = `Point crucial sur l'amplification : le ${productA.name} intègre un préampli actif commutable. À l'inverse, le ${productB.name} est un modèle passif (${profB.gainNeedsDesc}).`;
      bestValueSlug = productA.slug;
    } else if (!profA.hasIntegratedPreamp && profB.hasIntegratedPreamp) {
      hardwareRequirements = `Point crucial sur l'amplification : le ${productB.name} intègre un préampli actif commutable. À l'inverse, le ${productA.name} est un modèle passif (${profA.gainNeedsDesc}).`;
      bestValueSlug = productB.slug;
    } else {
      hardwareRequirements = `Concernant les besoins matériels : ${profA.name} présente ${profA.gainNeedsDesc.toLowerCase()}, tandis que ${profB.name} présente ${profB.gainNeedsDesc.toLowerCase()}.`;
    }

    const chooseAIf = [
      `Votre usage correspond à : ${profA.usageLabel}`,
      `Vous recherchez cette signature : ${profA.signature}`,
      profA.keyStrengths[0] || `Les atouts de ${profA.name}`
    ];
    const chooseBIf = [
      `Votre usage correspond à : ${profB.usageLabel}`,
      `Vous recherchez cette signature : ${profB.signature}`,
      profB.keyStrengths[0] || `Les atouts de ${profB.name}`
    ];

    if (priceA > 0 && priceB > 0 && priceA < priceB * 0.7) {
      bestValueSlug = productA.slug;
    } else if (priceA > 0 && priceB > 0 && priceB < priceA * 0.7) {
      bestValueSlug = productB.slug;
    }

    const conclusion = `Pour un profil orienté ${profA.usageLabel.toLowerCase()}, le ${productA.name} s'impose naturellement. Si votre priorité s'oriente vers ${profB.usageLabel.toLowerCase()}, le ${productB.name} offre le meilleur compromis technique.`;

    return {
      title,
      subtitle,
      verdictLead,
      card1Title: 'Signature Sonore & Rendu Acoustique',
      card2Title: 'Chaîne Matérielle & Alimentation',
      acousticAnalysis,
      hardwareRequirements,
      pointsA: profA.keyStrengths || ['Conception soignée'],
      pointsB: profB.keyStrengths || ['Conception soignée'],
      chooseAIf,
      chooseBIf,
      conclusion,
      specs,
      priceDiffText,
      bestValueSlug
    };
  }

  // ─── 8. UNIVERSAL DYNAMIC GENERATOR (EVERY PRODUCT & CATEGORY) ─────────
  return generateUniversalDuelAnalysis(productA, productB, cat, priceA, priceB, priceDiffText, specs);
}

