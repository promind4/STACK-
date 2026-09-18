import { Product } from '@/types/database';

export interface SubfamilyFilter {
  id: string;
  label: string;
  badgeShort?: string;
}

export const CATEGORY_SUBFAMILIES: Record<string, SubfamilyFilter[]> = {
  'micros-condensateurs': [
    { id: 'all', label: 'Tous' },
    { id: 'large-membrane', label: 'Large membrane (Voix & Studio)' },
    { id: 'petite-membrane', label: 'Petite membrane (Instruments)' },
    { id: 'premier-prix', label: 'Premier équipement (< 150 €)' },
  ],
  'micros-dynamiques': [
    { id: 'all', label: 'Tous' },
    { id: 'broadcast', label: 'Voix & Broadcast (Podcast/Stream)' },
    { id: 'polyvalent', label: 'Scène & Polyvalent' },
    { id: 'premier-prix', label: 'Premier équipement (< 100 €)' },
  ],
  'casques-studio': [
    { id: 'all', label: 'Tous' },
    { id: 'ferme', label: 'Casques fermés (Isolation)' },
    { id: 'ouvert', label: 'Casques ouverts (Mixage)' },
    { id: 'premier-prix', label: 'Premier budget (< 100 €)' },
  ],
  'enceintes': [
    { id: 'all', label: 'Tous' },
    { id: '5-pouces', label: '5 pouces (Home-studio)' },
    { id: '7-8-pouces', label: '7-8 pouces (Basses étendues)' },
    { id: 'compactes', label: 'Compactes & Mobiles' },
  ],
  'cartes-son': [
    { id: 'all', label: 'Tous' },
    { id: '1-2-in', label: '1 à 2 entrées (Solo & Podcast)' },
    { id: '4-plus-in', label: '4+ entrées (Multi-micros)' },
    { id: 'premier-prix', label: 'Premier budget (< 120 €)' },
  ],
  'bras-articules': [
    { id: 'all', label: 'Tous' },
    { id: 'articule', label: 'Bras articulés de bureau' },
    { id: 'base-lestee', label: 'Supports de table lestés' },
    { id: 'premier-prix', label: 'Premier budget (< 50 €)' },
  ],
  'cable-xlr': [
    { id: 'all', label: 'Tous' },
    { id: '3m', label: '2,5m - 3m' },
    { id: '5-6m', label: '5m - 6m' },
    { id: '10m', label: '10 mètres' },
  ],
  'traitement-acoustique': [
    { id: 'all', label: 'Tous' },
    { id: 'ecrans', label: 'Écrans de réflexion voix' },
    { id: 'panneaux', label: 'Panneaux & Diffuseurs' },
    { id: 'bass-traps', label: 'Bass Traps & Découpleurs' },
  ],
};

export function getProductTechnicalTag(product: Product, categorySlug: string): string | null {
  const name = (product.name || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();
  const text = `${name} ${desc} ${brand}`;

  if (categorySlug === 'micros-condensateurs') {
    if (text.includes('petite membrane') || text.includes('instrument') || name.includes('nt5') || name.includes('km 184') || name.includes('012')) {
      return 'Petite membrane';
    }
    if (text.includes('lampe') || text.includes('tube')) {
      return 'À lampe';
    }
    return 'Large membrane';
  }

  if (categorySlug === 'micros-dynamiques') {
    if (text.includes('broadcast') || text.includes('podcast') || name.includes('sm7b') || name.includes('podmic') || name.includes('re20') || name.includes('mv7') || name.includes('procaster')) {
      return 'Voix · Broadcast';
    }
    if (text.includes('scene') || text.includes('live') || name.includes('sm58') || name.includes('e835') || name.includes('v7')) {
      return 'Scène & Voix';
    }
    if (name.includes('sm57') || text.includes('instrument')) {
      return 'Instruments';
    }
    return 'Dynamique Studio';
  }

  if (categorySlug === 'casques-studio') {
    if (text.includes('ouvert') || name.includes('990') || name.includes('600') || name.includes('702') || name.includes('650') || name.includes('k-240') || name.includes('k 240')) {
      return 'Casque ouvert';
    }
    return 'Casque fermé';
  }

  if (categorySlug === 'enceintes') {
    if (name.includes('8') || name.includes('7') || name.includes('65') || name.includes('7v')) {
      return '7 - 8 pouces';
    }
    if (name.includes('8010') || name.includes('cr3') || name.includes('iloud') || name.includes('3.5')) {
      return 'Ultra compact';
    }
    return '5 pouces';
  }

  if (categorySlug === 'cartes-son') {
    if (name.includes('4i4') || name.includes('18i') || name.includes('evo 8') || name.includes('4pre') || name.includes('clarett')) {
      return '4+ entrées';
    }
    return '1 à 2 entrées';
  }

  if (categorySlug === 'bras-articules') {
    if (name.includes('ds2') || text.includes('lestee') || text.includes('base')) {
      return 'Base de table';
    }
    if (name.includes('lp') || text.includes('low profile')) {
      return 'Profil bas';
    }
    return 'Bras articulé';
  }

  if (categorySlug === 'cable-xlr') {
    if (name.includes('10m') || name.includes('10 m') || name.includes('10')) {
      return 'Longueur 10m';
    }
    if (name.includes('2.5m') || name.includes('2,5') || name.includes('3m') || name.includes('3 m')) {
      return 'Longueur 3m';
    }
    return 'Longueur 5-6m';
  }

  if (categorySlug === 'traitement-acoustique') {
    if (text.includes('reflexion') || text.includes('screen') || text.includes('filtre')) {
      return 'Écran voix';
    }
    if (text.includes('bass trap') || text.includes('iso-pad') || text.includes('isopad') || text.includes('decouplage')) {
      return 'Acoustique basse';
    }
    return 'Absorbant';
  }

  return null;
}

export function matchesSubfamily(product: Product, categorySlug: string, subfamilyId: string): boolean {
  if (subfamilyId === 'all') return true;

  const price = product.price || 0;
  const name = (product.name || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();
  const text = `${name} ${desc}`;

  // Premier équipement / budget
  if (subfamilyId === 'premier-prix') {
    if (categorySlug === 'micros-condensateurs') return price > 0 && price <= 150;
    if (categorySlug === 'micros-dynamiques') return price > 0 && price <= 100;
    if (categorySlug === 'casques-studio') return price > 0 && price <= 100;
    if (categorySlug === 'cartes-son') return price > 0 && price <= 120;
    if (categorySlug === 'bras-articules') return price > 0 && price <= 50;
    return price > 0 && price <= 100;
  }

  // Micros condensateurs
  if (categorySlug === 'micros-condensateurs') {
    const isSmall = text.includes('petite membrane') || text.includes('instrument') || name.includes('nt5') || name.includes('km 184') || name.includes('012');
    if (subfamilyId === 'petite-membrane') return isSmall;
    if (subfamilyId === 'large-membrane') return !isSmall;
  }

  // Micros dynamiques
  if (categorySlug === 'micros-dynamiques') {
    const isBroadcast = text.includes('broadcast') || text.includes('podcast') || name.includes('sm7b') || name.includes('podmic') || name.includes('re20') || name.includes('mv7') || name.includes('procaster');
    if (subfamilyId === 'broadcast') return isBroadcast;
    if (subfamilyId === 'polyvalent') return !isBroadcast;
  }

  // Casques
  if (categorySlug === 'casques-studio') {
    const isOuvert = text.includes('ouvert') || name.includes('990') || name.includes('600') || name.includes('702') || name.includes('650') || name.includes('k-240') || name.includes('k 240');
    if (subfamilyId === 'ouvert') return isOuvert;
    if (subfamilyId === 'ferme') return !isOuvert;
  }

  // Enceintes
  if (categorySlug === 'enceintes') {
    const isLarge = name.includes('8') || name.includes('7') || name.includes('65') || name.includes('7v');
    const isCompact = name.includes('8010') || name.includes('cr3') || name.includes('iloud') || name.includes('3.5');
    if (subfamilyId === '7-8-pouces') return isLarge;
    if (subfamilyId === 'compactes') return isCompact;
    if (subfamilyId === '5-pouces') return !isLarge && !isCompact;
  }

  // Cartes son
  if (categorySlug === 'cartes-son') {
    const isMulti = name.includes('4i4') || name.includes('18i') || name.includes('evo 8') || name.includes('4pre') || name.includes('clarett');
    if (subfamilyId === '4-plus-in') return isMulti;
    if (subfamilyId === '1-2-in') return !isMulti;
  }

  // Bras
  if (categorySlug === 'bras-articules') {
    const isBase = name.includes('ds2') || text.includes('lestee') || text.includes('base');
    if (subfamilyId === 'base-lestee') return isBase;
    if (subfamilyId === 'articule') return !isBase;
  }

  // Câbles
  if (categorySlug === 'cable-xlr') {
    if (subfamilyId === '10m') return name.includes('10m') || name.includes('10 m') || name.includes('10');
    if (subfamilyId === '3m') return name.includes('2.5m') || name.includes('2,5') || name.includes('3m') || name.includes('3 m');
    if (subfamilyId === '5-6m') return !name.includes('10m') && !name.includes('10 m') && !name.includes('2.5') && !name.includes('3m');
  }

  // Traitement
  if (categorySlug === 'traitement-acoustique') {
    if (subfamilyId === 'ecrans') return text.includes('reflexion') || text.includes('screen') || text.includes('filtre');
    if (subfamilyId === 'bass-traps') return text.includes('bass trap') || text.includes('iso-pad') || text.includes('isopad') || text.includes('decouplage');
    if (subfamilyId === 'panneaux') return !text.includes('reflexion') && !text.includes('screen') && !text.includes('bass trap') && !text.includes('iso-pad');
  }

  return true;
}

// Poids éditorial pour le tri par défaut : place les références incontournables et débutant en tête
export function getCuratedSortWeight(product: Product): number {
  const slug = (product.slug || '').toLowerCase();
  const name = (product.name || '').toLowerCase();

  // Top incontournables universels (Poids 100)
  const topTier = [
    'rode-nt1-signature', 'rode-nt1', 'at2020', 'audio-technica-at2020', 'shure-sm7b',
    'rode-podmic', 'beyerdynamic-dt-770-pro-80-ohm', 'audio-technica-ath-m50-x',
    'focusrite-scarlett-2i2', 'audient-id4', 'yamaha-hs-5', 'rode-psa1',
    'se-electronics-reflexion-filter-pro', 'cordial-ccm-5-fm'
  ];
  if (topTier.some(t => slug.includes(t) || name.includes(t))) return 100;

  // Deuxième palier : très fortes références (Poids 80)
  const midTier = [
    'akg-c214', 'aston-origin', 'sennheiser-mk4', 'shure-sm58', 'shure-sm57',
    'rode-nt-usb', 'elgato-wave-3', 'beyerdynamic-dt-990-pro', 'sennheiser-hd-600',
    'adam-t5v', 'focal-alpha-50-evo', 'motu-m2', 'rode-psa1-plus', 'hofa-absorber-eco'
  ];
  if (midTier.some(t => slug.includes(t) || name.includes(t))) return 80;

  // Troisième palier : références confirmées (Poids 60)
  if ((product.rating || 0) >= 4.5 && (product.price || 0) <= 300) return 60;

  // Standard
  return 40;
}
