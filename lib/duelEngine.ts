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
}

interface DynamicMicProfile {
  name: string;
  signature: string;
  toneDesc: string;
  directivityDesc: string;
  sensitivityCategory: 'ultra-low' | 'low' | 'medium' | 'high' | 'active-preamp';
  gainNeedsDesc: string;
  hasIntegratedPreamp: boolean;
  proximityDesc: string;
  roomRejection: 'excellente' | 'tres-bonne' | 'bonne' | 'standard';
  primaryUsage: 'broadcast' | 'live-stage' | 'instrument-studio' | 'hybrid-streaming';
  usageLabel: string;
  keyStrengths: string[];
  keyLimitations: string[];
  recommendedFor: string;
}

export const DYNAMIC_MIC_PROFILES: Record<string, DynamicMicProfile> = {
  'shure-sm7b': {
    name: 'Shure SM7B',
    signature: 'Chaud, sombre, velouté, coupe naturellement les sifflantes',
    toneDesc: 'Le grain radio broadcast iconique par excellence. Timbre doux et enveloppant avec un effet de proximité flatteur sans agressivité dans les aigus.',
    directivityDesc: 'Cardioïde à directivité uniforme et blindage électromagnétique contre les interférences d\'ordinateurs.',
    sensitivityCategory: 'ultra-low',
    gainNeedsDesc: 'Sensibilité ultra-faible (-59 dB). Exige un préampli fournissant au moins +60 dB de gain propre ou un boîtier type Cloudlifter / FetHead.',
    hasIntegratedPreamp: false,
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
    signature: 'Même capsule mythique que le SM7B, avec préamplificateur actif Shure intégré',
    toneDesc: 'Conserve fidèlement l\'ADN sonore du SM7B (rondeur, douceur des aigus) tout en éliminant son plus grand défaut historique : le manque de niveau de sortie.',
    directivityDesc: 'Cardioïde avec blindage électromagnétique anti-bourdonnement.',
    sensitivityCategory: 'active-preamp',
    gainNeedsDesc: 'Préampli actif intégré commutable (+18 dB ou +28 dB, bypassable). Alimentation Phantom 48V requise. Plus besoin de Cloudlifter!',
    hasIntegratedPreamp: true,
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
    signature: 'Neutre, précis, ultra-articulé, technologie Variable-D exclusive',
    toneDesc: 'Le standard absolu des studios radio américains (FM & Talk-Show). Réponse linéaire sur tout le spectre vocal sans coloration artificielle.',
    directivityDesc: 'Cardioïde avec technologie brevetée Variable-D éliminant le gonflement excessif des basses.',
    sensitivityCategory: 'low',
    gainNeedsDesc: 'Sensibilité faible (-56 dB). Nécessite une interface avec une bonne réserve de gain (+55 dB minimum).',
    hasIntegratedPreamp: false,
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
    signature: 'Finition noire matte moderne du légendaire RE20 Variable-D',
    toneDesc: 'Identique en tous points au RE20 classique en finition beige historique, avec une robe noire matte anti-reflet discrète en vidéo.',
    directivityDesc: 'Cardioïde avec technologie Variable-D.',
    sensitivityCategory: 'low',
    gainNeedsDesc: 'Sensibilité faible (-56 dB). Nécessite un préampli propre de +55 à +60 dB.',
    hasIntegratedPreamp: false,
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
    signature: 'Brillant, moderne, punchy avec commutateur double profil (Voix / Kick)',
    toneDesc: 'Version plus énergique et moderne du RE20 dotée d\'un aimant néodyme. Son plus clair dans l\'aigu et plus facile à faire ressortir dans un mix.',
    directivityDesc: 'Cardioïde avec Variable-D.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité moyenne (-52 dB), nettement plus simple à amplifier qu\'un SM7B ou un RE20 classique.',
    hasIntegratedPreamp: false,
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
    signature: 'Direct, percutant, précis, rapport qualité-prix imbattable',
    toneDesc: 'Conçu spécifiquement pour le podcasting. Voix intelligible et bien détachée, légèrement plus sèche et tranchante que le velouté d\'un SM7B.',
    directivityDesc: 'Cardioïde serrée avec filtre anti-pop en maille d\'acier interne double couche.',
    sensitivityCategory: 'low',
    gainNeedsDesc: 'Sensibilité de -57 dB. Demande un bon niveau de gain pour éviter le souffle sur des cartes son d\'entrée de gamme.',
    hasIntegratedPreamp: false,
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
    signature: 'Rondeur broadcast, capsule large néodyme, suspension interne',
    toneDesc: 'Grand frère du PodMic avec une capsule néodyme plus ample et une suspension interne supérieure. Son plus feutré et moins rugueux dans les aigus.',
    directivityDesc: 'Cardioïde avec filtre anti-pop interne.',
    sensitivityCategory: 'low',
    gainNeedsDesc: 'Sensibilité de -56 dB. Exige une interface avec au moins +55 dB de gain.',
    hasIntegratedPreamp: false,
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
    signature: 'Rondeur broadcast, capsule large néodyme (offre reconditionnée)',
    toneDesc: 'Mêmes spécifications acoustiques que le Rode Procaster neuf, avec un tarif encore plus avantageux.',
    directivityDesc: 'Cardioïde avec filtre anti-pop interne.',
    sensitivityCategory: 'low',
    gainNeedsDesc: 'Sensibilité -56 dB.',
    hasIntegratedPreamp: false,
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
    signature: 'Large membrane 37 mm, hypercardioïde, son percutant type statique',
    toneDesc: 'Une véritable pépite d\'ingénierie audio : capsule géante de 37 mm offrant la dynamique d\'un condensateur mais avec l\'isolation d\'un micro dynamique hypercardioïde.',
    directivityDesc: 'Hypercardioïde : réjection latérale maximale, bien plus étroite qu\'un cardioïde classique.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité supérieure (-43 dB). Facile à amplifier sur n\'importe quelle interface audio standard sans aucun booster externe.',
    hasIntegratedPreamp: false,
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
    signature: 'Hypercardioïde compact, focalisation vocale serrée, budget doux',
    toneDesc: 'Micro broadcast d\'entrée de gamme doté d\'une directivité hypercardioïde. Isole la voix avec une efficacité redoutable face aux bruits de clavier.',
    directivityDesc: 'Hypercardioïde avec filtre anti-pop multi-étage en mousse et maille.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité standard (-53 dB). S\'accommode de la plupart des cartes son d\'entrée de gamme.',
    hasIntegratedPreamp: false,
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
    signature: 'Isolation vocale optimisée, format inspiré du SM7B, 100% analogique',
    toneDesc: 'Version purement XLR analogique du Shure MV7. Conçu spécialement pour capturer la voix parlée avec clarté même dans les pièces à l\'acoustique moyenne.',
    directivityDesc: 'Cardioïde étroite avec technologie Voice Isolation passive.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité de -55 dB. Moins gourmand en gain que le SM7B de 4 dB, fonctionne bien sur les interfaces Scarlett ou similaires.',
    hasIntegratedPreamp: false,
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
    signature: 'Hybride USB-C / XLR avec DSP embarqué, auto-level et filtre denoiser',
    toneDesc: 'Le micro créateur le plus complet du marché. Fonctionne aussi bien branché directement en USB sur un PC qu\'en XLR sur une table de mixage.',
    directivityDesc: 'Cardioïde avec isolation phonique de pointe.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'En USB : gain géré par DSP automatique. En XLR : sensibilité modérée (-55 dB).',
    hasIntegratedPreamp: true,
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
    signature: 'Standard live mondial, bosse de présence taillée pour le chant, indestructible',
    toneDesc: 'Le micro de chant le plus vendu au monde depuis 1966. Bosse d\'égalisation calibrée à 4-5 kHz pour faire percer la voix à travers n\'importe quel mix sonore.',
    directivityDesc: 'Cardioïde uniforme avec excellente réjection des larsens.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité standard (-54.5 dB). Alimentation facile avec n\'importe quelle interface d\'entrée de gamme.',
    hasIntegratedPreamp: false,
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
    signature: 'Légende des amplis guitare, caisse claire et voix de discours',
    toneDesc: 'Même capsule que le SM58 mais sans grille sphérique, permettant de coller la membrane au plus près de la source pour une attaque percutante.',
    directivityDesc: 'Cardioïde.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité standard (-56 dB).',
    hasIntegratedPreamp: false,
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
    signature: 'Supercardioïde scène, bobine aluminium sur mesure, son clair et détaillé',
    toneDesc: 'Le challenger moderne du SM58 plébiscité en tournée par Billie Eilish. Bobine mobile en aluminium offrant des aigus plus aérés et une clarté remarquable.',
    directivityDesc: 'Supercardioïde : réjection latérale accrue et résistance aux larsens supérieure au cardioïde.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité de -54 dB, très simple à préamplifier.',
    hasIntegratedPreamp: false,
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
    signature: 'Booster Dynamite +30 dB intégré, 6 voicings d\'égalisation matérielle',
    toneDesc: 'Le couteau suisse du broadcast moderne. Intègre directement le fameux préampli sE Dynamite (+30 dB actif) et des switches d\'égalisation pour sculpter le timbre.',
    directivityDesc: 'Cardioïde avec protection anti-pop à trois couches.',
    sensitivityCategory: 'active-preamp',
    gainNeedsDesc: 'Booster actif commutable (+30 dB avec phantom 48V). Fonctionne aussi en mode passif.',
    hasIntegratedPreamp: true,
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
    signature: 'Booster Dynamite +30 dB intégré, format compact épuré',
    toneDesc: 'Version simplifiée et plus abordable du DCM 8, conservant le fameux booster actif Dynamite +30 dB pour une utilisation sans prise de tête.',
    directivityDesc: 'Cardioïde.',
    sensitivityCategory: 'active-preamp',
    gainNeedsDesc: 'Booster actif +30 dB commutable.',
    hasIntegratedPreamp: true,
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
    signature: 'Micro broadcast passif robuste et direct',
    toneDesc: 'Version passive d\'entrée de gamme de la série DynaCaster, concurrent direct du Rode PodMic.',
    directivityDesc: 'Cardioïde.',
    sensitivityCategory: 'low',
    gainNeedsDesc: 'Passif, demande une bonne interface.',
    hasIntegratedPreamp: false,
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
    signature: 'Légende studio grand diaphragme, dynamique percutant pour toms et voix rock',
    toneDesc: 'Réinterprétation compacte du mythique MD 421-II. Capsule dynamique grand diaphragme capable d\'encaisser d\'immenses pressions acoustiques avec une clarté remarquable.',
    directivityDesc: 'Cardioïde avec fixation repensée beaucoup plus fiable.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité standard (-54 dB).',
    hasIntegratedPreamp: false,
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
    signature: 'Chant live clair et dynamique, présence ouverte dans les hauts médiums',
    toneDesc: 'Micro de chant live emblématique de Sennheiser. Timbre plus aéré et brillant que le SM58 dans le haut du spectre, évitant l\'effet de voile sur les voix douces.',
    directivityDesc: 'Cardioïde uniforme.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité standard (-51 dB), généreuse et facile à mixer.',
    hasIntegratedPreamp: false,
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
    signature: 'Bande passante la plus large (28 Hz - 18 kHz), membrane composite sur mesure',
    toneDesc: 'Le micro dynamique au son le plus proche d\'un statique de studio. Membrane XXL en aluminium sur mesure offrant une réponse dans les graves abyssale et des aigus étincelants.',
    directivityDesc: 'Cardioïde avec rejet hors-axe exceptionnel.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité moyenne (-53.9 dB).',
    hasIntegratedPreamp: false,
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
    signature: 'Haut de gamme broadcast & kick drum, switch Kick EQ & High Boost',
    toneDesc: 'Micro dynamique de studio d\'exception fabriqué par Telefunken. Équipé d\'un grand diaphragme de 35 mm et de deux filtres physiques indépendants.',
    directivityDesc: 'Cardioïde.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité standard (-54 dB).',
    hasIntegratedPreamp: false,
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
    signature: '4 voix sonores distinctes, préampli discret Classe A commutable 48V',
    toneDesc: 'Micro révolutionnaire offrant 4 voicings analogiques indépendants (Vocal 1, Vocal 2, Guitare, Dark) et un préampli Classe A intégré commutable offrant +50 dB de gain propre.',
    directivityDesc: 'Cardioïde avec capsule montée sur suspension interne.',
    sensitivityCategory: 'active-preamp',
    gainNeedsDesc: 'Peut fonctionner en passif pur ou en actif (+50 dB avec 48V activé).',
    hasIntegratedPreamp: true,
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
    signature: 'Version orientée diffusion du Stealth avec 4 réglages de voix',
    toneDesc: 'Déclinaison spécifique broadcast avec préampli Classe A commutable.',
    directivityDesc: 'Cardioïde.',
    sensitivityCategory: 'active-preamp',
    gainNeedsDesc: 'Mode actif 48V intégré.',
    hasIntegratedPreamp: true,
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
    signature: 'Format broadcast d\'entrée de gamme avec coupe-bas et boost',
    toneDesc: 'L\'accès le plus économique au design et à l\'ergonomie d\'un micro broadcast de radio.',
    directivityDesc: 'Cardioïde.',
    sensitivityCategory: 'low',
    gainNeedsDesc: 'Sensibilité basse, demande du gain.',
    hasIntegratedPreamp: false,
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
    signature: 'Look rétro vintage chromé, son dynamique chaleureux',
    toneDesc: 'Micro dynamique broadcast revêtu d\'un habillage chrome vintage saisissant face caméra.',
    directivityDesc: 'Cardioïde.',
    sensitivityCategory: 'medium',
    gainNeedsDesc: 'Sensibilité standard.',
    hasIntegratedPreamp: false,
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
 * Generate a dynamic, highly specific, technically accurate duel between two products.
 */
export function generateDuelAnalysis(productA: Product, productB: Product): DuelAnalysis {
  const profA = DYNAMIC_MIC_PROFILES[productA.slug];
  const profB = DYNAMIC_MIC_PROFILES[productB.slug];

  const priceA = productA.price || 0;
  const priceB = productB.price || 0;
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

  // Determine specs comparison table
  const specs: DuelPoint[] = [
    {
      label: 'Prix indicatif',
      valA: priceA > 0 ? `${priceA.toLocaleString('fr-FR')} €` : 'N.C.',
      valB: priceB > 0 ? `${priceB.toLocaleString('fr-FR')} €` : 'N.C.',
      winner: priceA > 0 && priceB > 0 ? (priceA < priceB ? 'A' : priceB < priceA ? 'B' : 'tie') : null,
      detail: priceDiffText
    },
    {
      label: 'Usage principal',
      valA: profA?.usageLabel || productA.specs?.['Usage recommandé'] || 'Studio / Voix',
      valB: profB?.usageLabel || productB.specs?.['Usage recommandé'] || 'Studio / Voix',
      winner: null
    },
    {
      label: 'Directivité & Rejet',
      valA: profA ? `${productA.specs?.['Directivité'] || 'Cardioïde'} (${profA.roomRejection} en pièce brute)` : (productA.specs?.['Directivité'] || 'Cardioïde'),
      valB: profB ? `${productB.specs?.['Directivité'] || 'Cardioïde'} (${profB.roomRejection} en pièce brute)` : (productB.specs?.['Directivité'] || 'Cardioïde'),
      winner: null
    },
    {
      label: 'Préamplification & Gain',
      valA: profA?.gainNeedsDesc || (productA.specs?.['Sensibilité'] ? `Sensibilité: ${productA.specs['Sensibilité']}` : 'Interface standard requise'),
      valB: profB?.gainNeedsDesc || (productB.specs?.['Sensibilité'] ? `Sensibilité: ${productB.specs['Sensibilité']}` : 'Interface standard requise'),
      winner: profA?.hasIntegratedPreamp && !profB?.hasIntegratedPreamp ? 'A' : profB?.hasIntegratedPreamp && !profA?.hasIntegratedPreamp ? 'B' : null
    },
    {
      label: 'Signature de timbre',
      valA: profA?.signature || 'Dynamique équilibré',
      valB: profB?.signature || 'Dynamique équilibré',
      winner: null
    },
    {
      label: 'Comportement de proximité',
      valA: profA?.proximityDesc || 'Standard dynamique',
      valB: profB?.proximityDesc || 'Standard dynamique',
      winner: null
    }
  ];

  // Specific duel title & analysis logic
  let title = `${productA.name} vs ${productB.name}`;
  let subtitle = `Comparatif d'ingénierie sonore et synergie de setup créatif`;
  let verdictLead = '';
  let acousticAnalysis = '';
  let hardwareRequirements = '';
  let pointsA: string[] = profA?.keyStrengths || (productA.pros && productA.pros.length > 0 ? productA.pros.slice(0, 4) : ['Conception soignée', 'Rendu fidèle']);
  let pointsB: string[] = profB?.keyStrengths || (productB.pros && productB.pros.length > 0 ? productB.pros.slice(0, 4) : ['Conception soignée', 'Rendu fidèle']);
  let chooseAIf: string[] = [];
  let chooseBIf: string[] = [];
  let conclusion = '';
  let bestValueSlug: string | null = null;

  // 1. Shure SM7B vs Rode PodMic
  if (
    (productA.slug === 'shure-sm7b' && productB.slug === 'rode-podmic') ||
    (productA.slug === 'rode-podmic' && productB.slug === 'shure-sm7b')
  ) {
    const isASm7b = productA.slug === 'shure-sm7b';
    title = 'Le Standard Mondial face au Champion du Rapport Qualité/Prix';
    subtitle = '5x moins cher, le PodMic peut-il rivaliser avec la légende des podcasts Shure SM7B ?';
    verdictLead = `Ce duel oppose la référence absolue des studios broadcast (${isASm7b ? productA.name : productB.name} à ≈${isASm7b ? priceA : priceB}€) au micro qui a démocratisé le podcasting mondial (${isASm7b ? productB.name : productA.name} à ≈${isASm7b ? priceB : priceA}€).`;
    acousticAnalysis = `Sur le plan acoustique, le SM7B se distingue par son grain chaud, sombre et très feutré : il absorbe les sifflantes et pardonne les voix acides tout en apportant une belle assise radio. Le PodMic offre une réponse plus tranchante, avec une bosse marquée dans les hauts médiums qui le rend immédiatement intelligible mais parfois un peu sec ou métallique si la voix est déjà aiguë.`;
    hardwareRequirements = `Attention au coût réel du setup : le SM7B possède une sensibilité extrêmement basse (-59 dB) et exige impérativement une interface capable de délivrer +60 dB de gain propre ou l'ajout d'un Cloudlifter/FetHead (+100€ à +150€). Le PodMic demande lui aussi du gain propre, mais son investissement de départ très bas permet d'absorber l'achat d'une bonne carte son.`;
    
    if (isASm7b) {
      chooseAIf = [
        'Vous cherchez la texture sonore veloutée et chaleureuse des plus grands podcasts pros',
        'Votre voix a tendance à produire des sifflantes ou des aigus agressifs',
        'Vous disposez déjà d\'un préampli à fort gain ou du budget pour un Cloudlifter'
      ];
      chooseBIf = [
        'Votre budget total micro est inférieur à 100€',
        'Vous équipez une table ronde de 2 à 4 personnes sans vous ruiner',
        'Vous voulez un micro compact, 100% métal, avec filtre anti-pop déjà intégré'
      ];
      bestValueSlug = productB.slug;
    } else {
      chooseAIf = [
        'Votre budget total micro est inférieur à 100€',
        'Vous équipez une table ronde de plusieurs intervenants',
        'Vous voulez un châssis en laiton lourd indestructible sans dépenser 400€'
      ];
      chooseBIf = [
        'Vous voulez la signature vocale iconique et feutrée des studios mondiaux',
        'Vous enregistrez des voix parlées exigeantes ou du chant saturé rock/metal',
        'Vous avez la chaîne de gain nécessaire pour alimenter un micro passif exigeant'
      ];
      bestValueSlug = productA.slug;
    }
    conclusion = `Si le budget est votre priorité absolue, le Rode PodMic réalise un sans-faute en offrant 80% des performances d'un micro broadcast pour 20% du prix. En revanche, pour une empreinte sonore premium et un confort d'écoute inégalé sur les sessions longues, le Shure SM7B reste indétrônable.`;
  }
  // 2. Shure SM7B vs Electro-Voice RE20
  else if (
    (productA.slug === 'shure-sm7b' && (productB.slug === 'electro-voice-re20' || productB.slug === 'electro-voice-re20-black')) ||
    ((productA.slug === 'electro-voice-re20' || productA.slug === 'electro-voice-re20-black') && productB.slug === 'shure-sm7b')
  ) {
    const isASm7b = productA.slug === 'shure-sm7b';
    title = 'Le Choc des Titans Broadcast : Rondeur Feutrée vs Neutralité Chirurgicale';
    subtitle = 'Les deux légendes historiques des ondes radiophoniques face à face.';
    verdictLead = `Il s\'agit de la confrontation la plus classique et la plus débattue de l\'histoire de l\'audio broadcast. D\'un côté, le timbre chaud et intime du ${isASm7b ? productA.name : productB.name} ; de l\'autre, l\'intelligibilité chirurgicale et la technologie Variable-D du ${isASm7b ? productB.name : productA.name}.`;
    acousticAnalysis = `La différence fondamentale réside dans l\'effet de proximité : le SM7B possède un effet de proximité flatteur qui grossit les graves lorsque l'on se colle à la capsule (effet radio intimiste). L'Electro-Voice RE20 élimine presque totalement cet effet grâce à ses fentes acoustiques Variable-D : que l'animateur soit à 2 cm ou à 15 cm du micro, le timbre ne varie pas d'un iota. De plus, le RE20 est plus clair, plus ouvert et plus droit.`;
    hardwareRequirements = `Les deux micros sont passifs et réclament tous deux une préamplification robuste (+55 à +60 dB). Le RE20 est légèrement plus sensible (-56 dB vs -59 dB), mais un préampli propre ou un booster en ligne reste fortement recommandé pour les deux.`;
    
    if (isASm7b) {
      chooseAIf = [
        'Vous cherchez une voix chaleureuse, ronde, flatteuse et intimiste (podcast solo, voix off)',
        'Vous voulez calmer des aigus perçants ou des sifflantes naturelles',
        'Le tarif (~398€ vs ~600€) penche en faveur de Shure'
      ];
      chooseBIf = [
        'Vous bougez souvent la tête ou vous animez des débats vifs (zéro variation de timbre grâce au Variable-D)',
        'Vous privilégiez la neutralité exacte de la voix sans coloration sombre',
        'Vous souhaitez aussi enregistrer des cuivres, des percussions ou une grosse caisse en studio'
      ];
    } else {
      chooseAIf = [
        'Vous bougez la tête devant le micro sans vouloir voir vos basses exploser',
        'Vous cherchez la neutralité FM américaine légendaire',
        'Vous cherchez un micro tout aussi redoutable sur les instruments (cuivres, kick)'
      ];
      chooseBIf = [
        'Vous voulez ce grain feutré et enveloppant si caractéristique des podcasts modernes',
        'Vous avez besoin d\'un filtre coupe-haut naturel pour adoucir le timbre',
        'Vous souhaitez économiser environ 150 à 200€ sur le micro'
      ];
    }
    conclusion = `Victoire du SM7B pour le podcast intimiste et le grain vocal flatteur. Victoire du RE20 pour l'intelligibilité radio pure, la tolérance aux mouvements de tête et la polyvalence instrumentale en studio.`;
  }
  // 3. Shure SM7B vs Shure SM7dB
  else if (
    (productA.slug === 'shure-sm7b' && productB.slug === 'shure-sm7db') ||
    (productA.slug === 'shure-sm7db' && productB.slug === 'shure-sm7b')
  ) {
    const isASm7b = productA.slug === 'shure-sm7b';
    title = 'Classique Passif vs Évolution Active avec Préampli Intégré';
    subtitle = 'Même capsule mythique : le préampli intégré du SM7dB vaut-il son surcoût ?';
    verdictLead = `C\'est un duel fratricide : le ${isASm7b ? productB.name : productA.name} reprend rigoureusement la même capsule acoustique et la même signature que le ${isASm7b ? productA.name : productB.name}, mais y ajoute un préamplificateur actif commutable (+18 dB ou +28 dB) sous licence Shure.`;
    acousticAnalysis = `En termes de réponse en fréquence et de couleur tonale, les deux micros sont rigoureusement identiques : le SM7dB restitue fidèlement le grain feutré, chaud et blindé du SM7B original. Le son n\'est ni dénaturé ni altéré par le circuit actif Shure, qui se distingue par un rapport signal/bruit exceptionnel.`;
    hardwareRequirements = `C'est sur la chaîne matérielle que tout se joue : le SM7B traditionnel réclame une interface haut de gamme ou un boîtier externe (Cloudlifter CL-1 à ~140€ + un câble XLR additionnel). Le SM7dB résout ce problème en intégrant le booster directement dans son corps : alimenté en 48V, il se branche sur n'importe quelle carte son même d'entrée de gamme avec un niveau de sortie parfait. Il offre également un mode bypass pour redevenir un SM7B passif.`;
    
    if (isASm7b) {
      chooseAIf = [
        'Vous possédez déjà une interface audio avec d\'excellents préamplis (Apollo, RME, MOTU) ou un Cloudlifter',
        'Vous voulez dépenser le moins possible à l\'achat immédiat (~398€ vs ~525€)',
        'Vous préférez une chaîne 100% analogique passive sans aucun circuit actif'
      ];
      chooseBIf = [
        'Vous partez de zéro ou vous avez une carte son standard (Focusrite Scarlett, PreSonus, Audient)',
        'Vous voulez une installation propre sans câble supplémentaire ni boîtier externe qui traîne',
        'Vous souhaitez une flexibilité maximale (+18 dB, +28 dB ou bypass passif)'
      ];
      bestValueSlug = productA.slug;
    } else {
      chooseAIf = [
        'Vous voulez une solution tout-en-un sans boîtier Cloudlifter externe à acheter',
        'Vous utilisez une interface standard et avez besoin de gain propre immédiat',
        'Vous voulez la flexibilité du switch actif/passif officiel Shure'
      ];
      chooseBIf = [
        'Vous possédez déjà un bon préampli externe dédié',
        'Vous préférez le modèle passif historique à tarif plus doux'
      ];
      bestValueSlug = productB.slug;
    }
    conclusion = `Faites le calcul du pack : SM7B (398€) + Cloudlifter (140€) + câble XLR (15€) = ~553€. Le SM7dB à ~525€ s\'avère en réalité plus économique et bien plus élégant sur votre bureau si vous ne possédez pas déjà d'activateur de gain!`;
  }
  // 4. Audio-Technica BP40 vs Shure SM7B
  else if (
    (productA.slug === 'audio-technica-bp40' && productB.slug === 'shure-sm7b') ||
    (productA.slug === 'shure-sm7b' && productB.slug === 'audio-technica-bp40')
  ) {
    const isABp40 = productA.slug === 'audio-technica-bp40';
    title = 'Diaphragme Géant Hypercardioïde vs Standard Broadcast Chaud';
    subtitle = 'Le challenger technique d\'Audio-Technica face au ténor de Shure.';
    verdictLead = `Le duel entre l\'${isABp40 ? productA.name : productB.name} et le ${isABp40 ? productB.name : productA.name} met aux prises deux visions de l\'audio studio : la précision transitoire et la réjection extrême d'un côté, la rondeur et la douceur de l'autre.`;
    acousticAnalysis = `Le BP40 embarque une capsule surdimensionnée de 37 mm avec une directivité **hypercardioïde**, tandis que le SM7B utilise une membrane standard cardioïde. Conséquence directe : le BP40 rejette beaucoup plus les bruits latéraux et les réverbérations de pièce. Son son est plus rapide, plus punchy et plus défini dans les aigus, rappelant presque un micro statique, tandis que le SM7B adoucit et arrondit le message.`;
    hardwareRequirements = `Énorme avantage pour le BP40 en matière de sensibilité : avec -43 dBV/Pa contre -59 dBV/Pa pour le SM7B, le BP40 délivre environ **16 dB de signal supplémentaire**! Il n'a aucun besoin d'activateur de gain ou de préampli musclé : n'importe quelle carte son USB le pilote à la perfection.`;
    
    if (isABp40) {
      chooseAIf = [
        'Votre pièce n\'est pas traitée acoustiquement (l\'hypercardioïde rejette bien mieux les réverbérations)',
        'Vous ne voulez pas investir dans un Cloudlifter (sortie 16 dB plus puissante que le SM7B)',
        'Vous cherchez des graves profonds avec l\'attaque et le piqué d\'un grand diaphragme'
      ];
      chooseBIf = [
        'Vous cherchez à masquer des sifflantes ou un timbre vocal naturellement agressif',
        'Vous préférez le look iconique noir mat Shure sur votre vidéo',
        'Vous voulez un angle de captation un peu plus large (cardioïde plus tolérant que l\'hypercardioïde)'
      ];
      bestValueSlug = productA.slug;
    } else {
      chooseAIf = [
        'Vous voulez adoucir une voix perçante et bénéficier de l\'effet feutré studio',
        'Vous disposez déjà de la préamplification adaptée'
      ];
      chooseBIf = [
        'Vous voulez une réjection supérieure des réflexions de votre pièce',
        'Vous refusez d\'acheter un booster de gain externe pour avoir un signal exploitable',
        'Vous cherchez la précision et les basses monumentales de la capsule 37 mm'
      ];
      bestValueSlug = productB.slug;
    }
    conclusion = `L'Audio-Technica BP40 est l'arme secrète des acoustiques difficiles : il isole mieux de la pièce que le SM7B, se préamplifie sans aucun accessoire coûteux et coûte moins cher. Le SM7B conserve l'avantage pour les voix qui nécessitent d'être naturellement adoucies.`;
  }
  // 5. Shure SM58 vs Sennheiser e 835 / sE Electronics V7
  else if (
    (productA.slug === 'shure-sm58' && (productB.slug === 'sennheiser-e-835' || productB.slug === 'se-electronics-v7')) ||
    ((productA.slug === 'sennheiser-e-835' || productA.slug === 'se-electronics-v7') && productB.slug === 'shure-sm58')
  ) {
    const isASm58 = productA.slug === 'shure-sm58';
    const otherName = isASm58 ? productB.name : productA.name;
    title = 'Le Monstre Sacré de la Scène vs la Relève Haute Fidélité';
    subtitle = `Le SM58 légendaire peut-il résister à la clarté moderne du ${otherName} ?`;
    verdictLead = `Depuis des décennies, le Shure SM58 règne sur toutes les scènes de la planète. Face à lui, des micros dynamiques modernes comme le ${otherName} viennent corriger son principal reproche : un manque d'air et de brillance dans les hautes fréquences.`;
    acousticAnalysis = `Le SM58 a été pensé pour percer les mix de scène saturés grâce à sa bosse à 4-5 kHz, mais son haut du spectre coupe vite au-delà de 15 kHz, ce qui donne parfois un son un peu « carton » ou voilé sur les voix douces. Le ${otherName} offre une réponse bien plus ouverte et cristalline, capturant les respirations et le détail avec une clarté quasi-studio sans égalisation agressive.`;
    hardwareRequirements = `Les deux micros fonctionnent à merveille sur toute interface audio sans aucune exigence particulière de gain, et sont tous deux d'une robustesse éprouvée sur les tournées.`;
    
    if (isASm58) {
      chooseAIf = [
        'Vous voulez la fiabilité absolue et l\'universalité du micro le plus répandu au monde',
        'Votre voix est très puissante ou perçante et a besoin de la limitation naturelle du SM58',
        'Vous cherchez une revente garantie et des pièces de rechange disponibles partout'
      ];
      chooseBIf = [
        `Vous trouvez le SM58 trop sourd ou voilé et voulez plus de clarté naturelle`,
        'Vous voulez une meilleure isolation des retours et bruits ambiants',
        'Vous cherchez un son plus moderne et aéré dès la prise de son brute'
      ];
      bestValueSlug = productB.slug;
    } else {
      chooseAIf = [
        'Vous voulez une captation plus aérée, moderne et intelligible sans retouche EQ',
        'Vous cherchez une meilleure résistance aux larsens'
      ];
      chooseBIf = [
        'Vous voulez le standard éprouvé par 60 ans d\'histoire de la musique',
        'Vous privilégiez la robustesse mécanique absolue'
      ];
      bestValueSlug = productA.slug;
    }
    conclusion = `Pour chanter ou animer aujourd'hui, le ${otherName} propose une fidélité et une aération supérieures qui modernisent instantanément le timbre de votre voix. Le SM58 reste le tank indestructible à posséder dans toute trousse de secours.`;
  }
  // 6. Shure SM58 vs Shure SM7B
  else if (
    (productA.slug === 'shure-sm58' && productB.slug === 'shure-sm7b') ||
    (productA.slug === 'shure-sm7b' && productB.slug === 'shure-sm58')
  ) {
    const isASm58 = productA.slug === 'shure-sm58';
    title = 'Micro Main Scénique vs Micro Référence Studio Broadcast';
    subtitle = 'Deux philosophies opposées de la marque Shure : la scène mobile contre la perche fixe.';
    verdictLead = `Beaucoup de créateurs hésitent entre démarrer avec l\'indéboulonnable Shure SM58 (~115€) ou investir directement dans le saint-graal Shure SM7B (~398€). Ces deux micros partagent des gènes communs (la capsule Unidyne III), mais leurs applications sont diamétralement opposées.`;
    acousticAnalysis = `Le SM58 est optimisé pour être tenu en main à quelques millimètres de la bouche en environnement bruyant : son bas du spectre est écourté pour éviter les bruits de manipulation et son haut médium est renforcé pour percer le mix. Le SM7B possède une chambre acoustique beaucoup plus volumineuse, un blindage électromagnétique épais et une réponse étendue dans les infra-basses, offrant un son infiniment plus rond, intimiste et cinématographique.`;
    hardwareRequirements = `Le SM58 délivre un niveau de sortie standard qui fonctionne sur n'importe quel port XLR. Le SM7B pèse 765g (il lui faut un bras de table solide) et réclame un gain colossal (+60 dB) qui oblige souvent à doubler l'investissement en préampli ou Cloudlifter.`;
    
    if (isASm58) {
      chooseAIf = [
        'Votre budget est serré et vous voulez un micro polyvalent voix chantée / répétition / podcast',
        'Vous avez besoin d\'un micro mobile que l\'on peut tenir en main ou emporter en déplacement',
        'Vous utilisez une petite carte son d\'entrée de gamme sans préampli musclé'
      ];
      chooseBIf = [
        'Vous enregistrez exclusivement assis à votre bureau sur perche (podcast, voix off, streaming)',
        'Vous voulez ce timbre broadcast feutré et profond impossible à reproduire avec un micro main',
        'Vous avez le budget pour une perche lourde et une interface/préampli à fort gain'
      ];
      bestValueSlug = productA.slug;
    } else {
      chooseAIf = [
        'Vous cherchez la sonorité studio broadcast définitive pour votre poste fixe',
        'Vous voulez une isolation magnétique contre les parasites de vos écrans de montage'
      ];
      chooseBIf = [
        'Vous cherchez un micro passe-partout 4 fois moins cher, nomade et incassable',
        'Vous voulez chanter en live ou répéter sans équipement lourd'
      ];
      bestValueSlug = productB.slug;
    }
    conclusion = `Ne comparez pas leur prix mais leur destination : le SM58 est l\'outil nomade et scénique par excellence ; le SM7B est une pièce maîtresse de studio sédentaire taillée pour la voix parlée d'autorité.`;
  }
  // 7. General Dynamic Microphones Pairings
  else if (profA && profB) {
    title = `${profA.name} vs ${profB.name} : Le Duel Acoustique`;
    subtitle = `Confrontation technique entre deux micros dynamiques de référence.`;
    verdictLead = `La confrontation entre le <strong>${productA.brand} ${productA.name}</strong> (${priceA > 0 ? `≈ ${priceA}€` : 'N.C.'}) et le <strong>${productB.brand} ${productB.name}</strong> (${priceB > 0 ? `≈ ${priceB}€` : 'N.C.'}) illustre deux approches distinctes de la captation dynamique en studio.`;
    
    acousticAnalysis = `D'un côté, le ${productA.name} se caractérise par : ${profA.signature.toLowerCase()} (${profA.toneDesc}). De l'autre, le ${productB.name} mise sur : ${profB.signature.toLowerCase()} (${profB.toneDesc}).`;
    
    // Check gain comparison
    if (profA.hasIntegratedPreamp && !profB.hasIntegratedPreamp) {
      hardwareRequirements = `Point crucial sur l'amplification : le ${productA.name} intègre un préampli actif commutable et ne nécessite aucun boîtier additionnel. À l'inverse, le ${productB.name} est un modèle passif (${profB.gainNeedsDesc}).`;
      bestValueSlug = productA.slug;
    } else if (!profA.hasIntegratedPreamp && profB.hasIntegratedPreamp) {
      hardwareRequirements = `Point crucial sur l'amplification : le ${productB.name} intègre un préampli actif commutable et ne nécessite aucun boîtier additionnel. À l'inverse, le ${productA.name} est un modèle passif (${profA.gainNeedsDesc}).`;
      bestValueSlug = productB.slug;
    } else {
      hardwareRequirements = `Concernant les besoins en équipement : ${profA.name} présente ${profA.gainNeedsDesc.toLowerCase()}, tandis que ${profB.name} présente ${profB.gainNeedsDesc.toLowerCase()}.`;
    }

    chooseAIf = [
      `Votre usage correspond à : ${profA.usageLabel}`,
      `Vous recherchez cette signature : ${profA.signature}`,
      profA.keyStrengths[0] || `Les atouts de ${profA.name}`
    ];
    chooseBIf = [
      `Votre usage correspond à : ${profB.usageLabel}`,
      `Vous recherchez cette signature : ${profB.signature}`,
      profB.keyStrengths[0] || `Les atouts de ${profB.name}`
    ];

    if (priceA > 0 && priceB > 0 && priceA < priceB * 0.7) {
      bestValueSlug = productA.slug;
    } else if (priceA > 0 && priceB > 0 && priceB < priceA * 0.7) {
      bestValueSlug = productB.slug;
    }

    conclusion = `Pour un profil orienté ${profA.primaryUsage === 'live-stage' ? 'scène et polyvalence' : profA.primaryUsage === 'broadcast' ? 'broadcast et podcast de table' : 'studio'}, le ${productA.name} s'impose naturellement. Si votre priorité s'oriente vers ${profB.primaryUsage === 'live-stage' ? 'la scène et la clarté' : profB.primaryUsage === 'broadcast' ? 'le son radio de référence' : 'la précision'}, le ${productB.name} offre le meilleur compromis technique.`;
  }
  // 8. Fallback for non-dynamic mics or generic products
  else {
    title = `${productA.name} vs ${productB.name}`;
    subtitle = `Analyse comparative de matériel studio par l'Atelier Fluxlab`;
    verdictLead = `Le duel entre le <strong>${productA.brand} ${productA.name}</strong> et le <strong>${productB.brand} ${productB.name}</strong> compare deux solutions complémentaires du catalogue audio.`;
    acousticAnalysis = `Le ${productA.name} (${productA.brand}) propose une approche axée sur ses caractéristiques : ${productA.short_description || productA.description || 'conception robuste et performances studio'}. Face à lui, le ${productB.name} (${productB.brand}) se positionne avec ses spécificités propres.`;
    hardwareRequirements = priceDiffText ? `Sur le plan budgétaire : ${priceDiffText}. Vérifiez la compatibilité avec votre interface et vos accessoires.` : `Analysez les offres marchands pour obtenir le meilleur prix en direct.`;
    
    chooseAIf = pointsA.slice(0, 3).map(p => `Vous privilégiez : ${p}`);
    chooseBIf = pointsB.slice(0, 3).map(p => `Vous privilégiez : ${p}`);
    conclusion = `Votre choix dépendra de votre configuration actuelle et de votre budget global d'accessoires.`;
  }

  return {
    title,
    subtitle,
    verdictLead,
    acousticAnalysis,
    hardwareRequirements,
    pointsA,
    pointsB,
    chooseAIf,
    chooseBIf,
    conclusion,
    specs,
    priceDiffText,
    bestValueSlug
  };
}
