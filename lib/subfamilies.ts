import type { Product } from '../types/database';

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
    { id: 'scene', label: 'Chant & Scène (Live)' },
    { id: 'instruments', label: 'Instruments & Polyvalent' },
    { id: 'actifs', label: 'Actifs (Préampli intégré)' },
    { id: 'premier-prix', label: 'Premier équipement (< 100 €)' },
  ],
  'micros-usb': [
    { id: 'all', label: 'Tous' },
    { id: 'dynamique', label: 'Capsule Dynamique (Anti-bruit ambiant)' },
    { id: 'condensateur', label: 'Capsule Condensateur (Studio & Voix)' },
    { id: 'compact', label: 'Compact & Gaming' },
    { id: 'premier-prix', label: 'Premier budget (< 100 €)' },
  ],
  'micros-shotgun': [
    { id: 'all', label: 'Tous' },
    { id: 'canon-xlr', label: 'Canons XLR (Tournage & Perche)' },
    { id: 'camera', label: 'Sur caméra (Vlog & Nomade)' },
    { id: 'hybride', label: 'Hybrides USB / Caméra' },
    { id: 'premier-prix', label: 'Premier budget (< 150 €)' },
  ],
  'casques-studio': [
    { id: 'all', label: 'Tous' },
    { id: 'ferme', label: 'Casques fermés (Isolation prise)' },
    { id: 'ouvert', label: 'Casques ouverts (Mixage & Détail)' },
    { id: 'premier-prix', label: 'Premier budget (< 100 €)' },
  ],
  'enceintes': [
    { id: 'all', label: 'Tous' },
    { id: '5-pouces', label: '5 - 6.5 pouces (Home-studio standard)' },
    { id: '7-8-pouces', label: '7 - 8 pouces (Basses étendues)' },
    { id: 'compactes', label: 'Compactes (3 - 4.5 pouces)' },
    { id: 'premier-prix', label: 'Premier budget (< 200 €)' },
  ],
  'cartes-son': [
    { id: 'all', label: 'Tous' },
    { id: '1-2-in', label: '1 à 2 entrées (Solo & Podcast)' },
    { id: '4-plus-in', label: '4+ entrées (Multi-micros / Groupes)' },
    { id: 'premier-prix', label: 'Premier budget (< 120 €)' },
  ],
  'preamplis': [
    { id: 'all', label: 'Tous' },
    { id: 'booster', label: 'Boosters inline (+25dB / Cloudlifter)' },
    { id: 'studio-rack', label: 'Préamplis & Tranches Studio' },
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
  'microphones': [
    { id: 'all', label: 'Tous les micros' },
    { id: 'dynamiques', label: 'Micros Dynamiques' },
    { id: 'condensateurs', label: 'Micros Condensateurs' },
    { id: 'usb', label: 'Micros USB' },
    { id: 'shotgun', label: 'Micros Shotgun' },
  ],
  'interfaces-monitoring': [
    { id: 'all', label: 'Tous les équipements' },
    { id: 'cartes-son', label: 'Cartes son & Interfaces' },
    { id: 'preamplis', label: 'Préamplis & Boosters' },
    { id: 'casques', label: 'Casques studio' },
    { id: 'enceintes', label: 'Enceintes de monitoring' },
  ],
  'interfaces': [
    { id: 'all', label: 'Tous les équipements' },
    { id: 'cartes-son', label: 'Cartes son & Interfaces' },
    { id: 'preamplis', label: 'Préamplis & Boosters' },
    { id: 'casques', label: 'Casques studio' },
    { id: 'enceintes', label: 'Enceintes de monitoring' },
  ],
  'accessoires': [
    { id: 'all', label: 'Tous les accessoires' },
    { id: 'bras', label: 'Bras articulés' },
    { id: 'cables', label: 'Câbles XLR' },
    { id: 'acoustique', label: 'Traitement acoustique' },
  ],
  'audio': [
    { id: 'all', label: 'Tout le studio' },
    { id: 'micros', label: 'Microphones' },
    { id: 'interfaces', label: 'Cartes son & Préamplis' },
    { id: 'monitoring', label: 'Casques & Enceintes' },
    { id: 'accessoires', label: 'Accessoires studio' },
  ],
};

export function getProductTechnicalTag(product: Product, categorySlug: string): string | null {
  // If viewing a major parent vertical, delegate to product's specific subcategory
  if (['audio', 'microphones', 'interfaces-monitoring', 'interfaces', 'accessoires'].includes(categorySlug)) {
    const actualSubcategory = product.category_slug || '';
    if (actualSubcategory && actualSubcategory !== categorySlug) {
      return getProductTechnicalTag(product, actualSubcategory);
    }
  }

  const name = (product.name || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();
  const slug = (product.slug || '').toLowerCase();
  const text = `${name} ${desc} ${brand} ${slug}`;

  // 1. CONDENSATEURS
  if (categorySlug === 'micros-condensateurs') {
    if (text.includes('petite membrane') || text.includes('instrument') || slug.includes('nt5') || slug.includes('km-184') || slug.includes('012')) {
      return 'Petite membrane';
    }
    if (text.includes('lampe') || text.includes('tube')) {
      return 'À lampe';
    }
    return 'Large membrane';
  }

  // 2. DYNAMIQUES
  if (categorySlug === 'micros-dynamiques') {
    // Actif avec préampli intégré (+28dB)
    if (slug.includes('sm7db') || slug.includes('stealth') || slug.includes('dcm-6') || slug.includes('dcm-8') || slug.includes('dcm6') || slug.includes('dcm8')) {
      return 'Actif (+28dB)';
    }
    // Slugs Scène spécifiques
    if (slug.includes('sm58') || slug.includes('e-835') || (slug.includes('v7') && !slug.includes('mv7'))) {
      return 'Chant · Scène';
    }
    // Slugs Instruments spécifiques
    if (slug.includes('sm57') || slug.includes('md-421') || slug.includes('md421') || slug.includes('m82')) {
      return 'Instrument · Studio';
    }
    // Slugs Broadcast spécifiques
    if (
      slug.includes('sm7b') || slug.includes('podmic') || slug.includes('procaster') ||
      slug.includes('mv7') || slug.includes('re20') || slug.includes('re320') ||
      slug.includes('pr40') || slug.includes('bp40') || slug.includes('bc-500') ||
      slug.includes('at2040') || slug.includes('cr77') || slug.includes('dcm-3')
    ) {
      return 'Voix · Broadcast';
    }
    // Fallback par mots-clés textuels
    if (text.includes('instrument')) return 'Instrument · Studio';
    if (text.includes('scene') || text.includes('live')) return 'Chant · Scène';
    if (text.includes('broadcast') || text.includes('podcast')) return 'Voix · Broadcast';
    return 'Dynamique Studio';
  }

  // 3. USB
  if (categorySlug === 'micros-usb') {
    if (
      slug.includes('podmic-usb') || slug.includes('at2040-usb') || slug.includes('mv6') ||
      text.includes('dynamique') || text.includes('dynamic')
    ) {
      return 'Dynamique USB';
    }
    return 'Condensateur USB';
  }

  // 4. SHOTGUN
  if (categorySlug === 'micros-shotgun') {
    if (slug.includes('videomic-ntg') || text.includes('hybride')) {
      return 'Hybride USB/Jack';
    }
    if (
      slug.includes('videomic-pro') || slug.includes('videomic-go') ||
      slug.includes('mke-400') || slug.includes('mke-200') || text.includes('camera') || text.includes('caméra')
    ) {
      return 'Sur caméra';
    }
    return 'Canon XLR · Perche';
  }

  // 5. CASQUES STUDIO
  if (categorySlug === 'casques-studio') {
    // Casques ouverts réels
    const isOpen =
      slug.includes('990') || slug.includes('900-pro-x') || slug.includes('hd-600') ||
      slug.includes('hd-400-pro') || slug.includes('hd-490-pro') || slug.includes('r70x') ||
      slug.includes('hi-x65') || slug.includes('k-702') || slug.includes('k-240') ||
      text.includes('ouvert') || text.includes('open-back');

    if (isOpen) return 'Casque ouvert';
    return 'Casque fermé';
  }

  // 6. ENCEINTES MONITORING
  if (categorySlug === 'enceintes') {
    // Ultra compactes : 3" à 4.5"
    if (
      slug.includes('8010') || slug.includes('8020') || slug.includes('cr3') ||
      slug.includes('hs-3') || slug.includes('hs-4') || slug.includes('iloud-micro') ||
      slug.includes('eris-3')
    ) {
      return '3.5 - 4.5 pouces';
    }
    // Grandes enceintes : 7" à 8"
    if (
      slug.includes('hs-7') || slug.includes('hs-8') || slug.includes('t7v') ||
      slug.includes('t8v') || slug.includes('a7v') || slug.includes('alpha-80') ||
      slug.includes('lp-8')
    ) {
      return '7 - 8 pouces';
    }
    // Standard : 5" à 6.5"
    return '5 - 6.5 pouces';
  }

  // 7. CARTES SON
  if (categorySlug === 'cartes-son') {
    if (slug.includes('rodecaster') || slug.includes('caster')) {
      return 'Console Broadcast';
    }
    if (
      slug.includes('4i4') || slug.includes('18i') || slug.includes('evo-8') ||
      slug.includes('id44') || slug.includes('motu-m4') || slug.includes('m4') ||
      slug.includes('clarett')
    ) {
      return '4+ entrées';
    }
    return '1 à 2 entrées';
  }

  // 8. PRÉAMPLIS
  if (categorySlug === 'preamplis') {
    if (slug.includes('cloudlifter') || slug.includes('fethead') || text.includes('inline') || text.includes('booster')) {
      return 'Booster Inline (+25dB)';
    }
    if (slug.includes('dbx') || slug.includes('286') || text.includes('strip') || text.includes('rack')) {
      return 'Tranche & Rack Studio';
    }
    if (slug.includes('pre-73') || slug.includes('pre73') || text.includes('vintage')) {
      return 'Préampli Vintage 1073';
    }
    return 'Préampli Studio';
  }

  // 9. BRAS ARTICULÉS
  if (categorySlug === 'bras-articules') {
    if (slug.includes('ds2') || text.includes('lestee') || text.includes('base')) {
      return 'Base de table';
    }
    if (slug.includes('lp') || text.includes('low profile')) {
      return 'Profil bas';
    }
    return 'Bras articulé';
  }

  // 10. CÂBLES XLR
  if (categorySlug === 'cable-xlr') {
    if (slug.includes('10m') || slug.includes('10-m') || name.includes('10m') || name.includes('10 m')) {
      return 'Longueur 10m';
    }
    if (slug.includes('2-5m') || slug.includes('2.5m') || slug.includes('3m') || name.includes('2.5m') || name.includes('3m')) {
      return 'Longueur 3m';
    }
    return 'Longueur 5-6m';
  }

  // 11. TRAITEMENT ACOUSTIQUE
  if (categorySlug === 'traitement-acoustique') {
    if (text.includes('reflexion') || text.includes('screen') || text.includes('filtre') || slug.includes('filter')) {
      return 'Écran voix';
    }
    if (text.includes('bass trap') || text.includes('iso-pad') || text.includes('isopad') || text.includes('decouplage')) {
      return 'Acoustique basse';
    }
    return 'Absorbant & Diffuseur';
  }

  return null;
}

export function matchesSubfamily(product: Product, categorySlug: string, subfamilyId: string): boolean {
  if (subfamilyId === 'all') return true;

  const price = product.price || 0;
  const name = (product.name || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();
  const slug = (product.slug || '').toLowerCase();
  const text = `${name} ${desc} ${slug}`;
  const catSlug = product.category_slug || '';

  // ── Filtres pour la grande catégorie Microphones
  if (categorySlug === 'microphones') {
    if (subfamilyId === 'dynamiques') {
      return catSlug === 'micros-dynamiques' || slug.includes('sm7') || slug.includes('podmic') || slug.includes('sm58') || slug.includes('re20') || text.includes('dynamique');
    }
    if (subfamilyId === 'condensateurs') {
      return catSlug === 'micros-condensateurs' || slug.includes('nt1') || slug.includes('c414') || slug.includes('tlm') || slug.includes('at2020') || text.includes('condensateur');
    }
    if (subfamilyId === 'usb') {
      return catSlug === 'micros-usb' || slug.includes('usb') || text.includes('usb');
    }
    if (subfamilyId === 'shotgun') {
      return catSlug === 'micros-shotgun' || slug.includes('shotgun') || slug.includes('videomic') || slug.includes('mke') || slug.includes('ntg');
    }
  }

  // ── Filtres pour la grande catégorie Interfaces & Monitoring
  if (categorySlug === 'interfaces-monitoring' || categorySlug === 'interfaces') {
    if (subfamilyId === 'cartes-son') {
      return catSlug === 'cartes-son' || slug.includes('scarlett') || slug.includes('volt') || slug.includes('evo') || slug.includes('motu') || slug.includes('apollo') || text.includes('carte son') || text.includes('interface');
    }
    if (subfamilyId === 'preamplis') {
      return catSlug === 'preamplis' || slug.includes('cloudlifter') || slug.includes('fethead') || slug.includes('dbx') || slug.includes('pre-73') || text.includes('preampli');
    }
    if (subfamilyId === 'casques') {
      return catSlug === 'casques-studio' || slug.includes('dt-') || slug.includes('dt770') || slug.includes('dt990') || slug.includes('ath-m') || slug.includes('hd-') || text.includes('casque');
    }
    if (subfamilyId === 'enceintes') {
      return catSlug === 'enceintes' || slug.includes('hs') || slug.includes('lp-') || slug.includes('in-') || slug.includes('alpha') || slug.includes('t5v') || slug.includes('t7v') || text.includes('enceinte') || text.includes('moniteur');
    }
  }

  // ── Filtres pour la grande catégorie Accessoires
  if (categorySlug === 'accessoires') {
    if (subfamilyId === 'bras') {
      return catSlug === 'bras-articules' || slug.includes('arm') || slug.includes('psa1') || slug.includes('wave-mic-arm') || slug.includes('ds2') || text.includes('bras');
    }
    if (subfamilyId === 'cables') {
      return catSlug === 'cable-xlr' || slug.includes('cable') || slug.includes('xlr') || slug.includes('cordial') || text.includes('cable');
    }
    if (subfamilyId === 'acoustique') {
      return catSlug === 'traitement-acoustique' || slug.includes('mousse') || slug.includes('panneau') || slug.includes('screen') || slug.includes('trap') || text.includes('acoustique');
    }
  }

  // ── Filtres pour la catégorie globale Audio
  if (categorySlug === 'audio') {
    if (subfamilyId === 'micros') {
      return ['micros-dynamiques', 'micros-condensateurs', 'micros-usb', 'micros-shotgun', 'microphones'].includes(catSlug) || text.includes('micro');
    }
    if (subfamilyId === 'interfaces') {
      return ['cartes-son', 'preamplis', 'interfaces-monitoring', 'interfaces'].includes(catSlug) || text.includes('interface') || text.includes('carte son') || text.includes('preampli');
    }
    if (subfamilyId === 'monitoring') {
      return ['casques-studio', 'enceintes'].includes(catSlug) || text.includes('casque') || text.includes('enceinte');
    }
    if (subfamilyId === 'accessoires') {
      return ['bras-articules', 'cable-xlr', 'traitement-acoustique', 'accessoires'].includes(catSlug) || text.includes('bras') || text.includes('cable');
    }
  }

  // ── Premier équipement / budget
  if (subfamilyId === 'premier-prix') {
    if (categorySlug === 'micros-condensateurs') return price > 0 && price <= 150;
    if (categorySlug === 'micros-dynamiques') return price > 0 && price <= 100;
    if (categorySlug === 'micros-usb') return price > 0 && price <= 100;
    if (categorySlug === 'micros-shotgun') return price > 0 && price <= 150;
    if (categorySlug === 'casques-studio') return price > 0 && price <= 100;
    if (categorySlug === 'enceintes') return price > 0 && price <= 200;
    if (categorySlug === 'cartes-son') return price > 0 && price <= 120;
    if (categorySlug === 'bras-articules') return price > 0 && price <= 50;
    return price > 0 && price <= 100;
  }

  // ── Micros condensateurs
  if (categorySlug === 'micros-condensateurs') {
    const isSmall = text.includes('petite membrane') || text.includes('instrument') || slug.includes('nt5') || slug.includes('km-184') || slug.includes('012');
    if (subfamilyId === 'petite-membrane') return isSmall;
    if (subfamilyId === 'large-membrane') return !isSmall;
  }

  // ── Micros dynamiques
  if (categorySlug === 'micros-dynamiques') {
    const isActif = slug.includes('sm7db') || slug.includes('stealth') || slug.includes('dcm-6') || slug.includes('dcm-8') || slug.includes('dcm6') || slug.includes('dcm8');
    if (subfamilyId === 'actifs') return isActif;

    const isScene = slug.includes('sm58') || slug.includes('e-835') || ((slug.includes('v7') && !slug.includes('mv7'))) || text.includes('scene') || text.includes('live');
    if (subfamilyId === 'scene') return isScene;

    const isInstrument = slug.includes('sm57') || slug.includes('md-421') || slug.includes('m82') || text.includes('instrument');
    if (subfamilyId === 'instruments') return isInstrument;

    if (subfamilyId === 'broadcast') {
      return (
        slug.includes('sm7b') || slug.includes('podmic') || slug.includes('procaster') ||
        slug.includes('mv7') || slug.includes('re20') || slug.includes('re320') ||
        slug.includes('pr40') || slug.includes('bp40') || slug.includes('bc-500') ||
        slug.includes('at2040') || slug.includes('cr77') || slug.includes('dcm-3') ||
        isActif
      );
    }
  }

  // ── Micros USB
  if (categorySlug === 'micros-usb') {
    const isDynamique = slug.includes('podmic-usb') || slug.includes('at2040-usb') || slug.includes('mv6') || text.includes('dynamique') || text.includes('dynamic');
    if (subfamilyId === 'dynamique') return isDynamique;
    if (subfamilyId === 'condensateur') return !isDynamique;
    if (subfamilyId === 'compact') {
      return slug.includes('solocast') || slug.includes('wave-neo') || slug.includes('mini') || slug.includes('profile');
    }
  }

  // ── Micros Shotgun
  if (categorySlug === 'micros-shotgun') {
    const isHybride = slug.includes('videomic-ntg') || text.includes('hybride');
    if (subfamilyId === 'hybride') return isHybride;

    const isCamera = slug.includes('videomic-pro') || slug.includes('videomic-go') || slug.includes('mke-400') || slug.includes('mke-200');
    if (subfamilyId === 'camera') return isCamera;

    if (subfamilyId === 'canon-xlr') return !isCamera && !isHybride;
  }

  // ── Casques
  if (categorySlug === 'casques-studio') {
    const isOuvert =
      slug.includes('990') || slug.includes('900-pro-x') || slug.includes('hd-600') ||
      slug.includes('hd-400-pro') || slug.includes('hd-490-pro') || slug.includes('r70x') ||
      slug.includes('hi-x65') || slug.includes('k-702') || slug.includes('k-240') ||
      text.includes('ouvert') || text.includes('open-back');
    if (subfamilyId === 'ouvert') return isOuvert;
    if (subfamilyId === 'ferme') return !isOuvert;
  }

  // ── Enceintes
  if (categorySlug === 'enceintes') {
    const isCompact =
      slug.includes('8010') || slug.includes('8020') || slug.includes('cr3') ||
      slug.includes('hs-3') || slug.includes('hs-4') || slug.includes('iloud-micro') ||
      slug.includes('eris-3');
    if (subfamilyId === 'compactes') return isCompact;

    const isLarge =
      slug.includes('hs-7') || slug.includes('hs-8') || slug.includes('t7v') ||
      slug.includes('t8v') || slug.includes('a7v') || slug.includes('alpha-80') ||
      slug.includes('lp-8');
    if (subfamilyId === '7-8-pouces') return isLarge;

    if (subfamilyId === '5-pouces') return !isCompact && !isLarge;
  }

  // ── Cartes son
  if (categorySlug === 'cartes-son') {
    const isMulti =
      slug.includes('4i4') || slug.includes('18i') || slug.includes('evo-8') ||
      slug.includes('id44') || slug.includes('motu-m4') || slug.includes('m4') ||
      slug.includes('clarett');
    if (subfamilyId === '4-plus-in') return isMulti;
    if (subfamilyId === '1-2-in') return !isMulti;
  }

  // ── Préamplis
  if (categorySlug === 'preamplis') {
    const isBooster = slug.includes('cloudlifter') || slug.includes('fethead') || text.includes('inline') || text.includes('booster');
    if (subfamilyId === 'booster') return isBooster;
    if (subfamilyId === 'studio-rack') return !isBooster;
  }

  // ── Bras
  if (categorySlug === 'bras-articules') {
    const isBase = slug.includes('ds2') || text.includes('lestee') || text.includes('base');
    if (subfamilyId === 'base-lestee') return isBase;
    if (subfamilyId === 'articule') return !isBase;
  }

  // ── Câbles
  if (categorySlug === 'cable-xlr') {
    if (subfamilyId === '10m') return slug.includes('10m') || slug.includes('10-m') || name.includes('10m') || name.includes('10 m');
    if (subfamilyId === '3m') return slug.includes('2-5m') || slug.includes('2.5m') || slug.includes('3m') || name.includes('2.5m') || name.includes('3m');
    if (subfamilyId === '5-6m') return !slug.includes('10m') && !slug.includes('10-m') && !slug.includes('2-5m') && !slug.includes('3m');
  }

  // ── Traitement
  if (categorySlug === 'traitement-acoustique') {
    if (subfamilyId === 'ecrans') return text.includes('reflexion') || text.includes('screen') || text.includes('filtre') || slug.includes('filter');
    if (subfamilyId === 'bass-traps') return text.includes('bass trap') || text.includes('iso-pad') || text.includes('isopad') || text.includes('decouplage');
    if (subfamilyId === 'panneaux') return !text.includes('reflexion') && !text.includes('screen') && !text.includes('bass trap') && !text.includes('iso-pad');
  }

  return true;
}

// Poids éditorial pour le tri par défaut : place les références incontournables et essentiels en tête
export function getCuratedSortWeight(product: Product): number {
  const slug = (product.slug || '').toLowerCase();
  const name = (product.name || '').toLowerCase();

  // Top incontournables universels (Poids 100)
  const topTier = [
    'rode-nt1-signature', 'rode-nt1', 'at2020', 'audio-technica-at2020', 'shure-sm7b',
    'rode-podmic', 'beyerdynamic-dt-770-pro-80-ohm', 'audio-technica-ath-m50-x',
    'focusrite-scarlett-2i2', 'audient-id4', 'yamaha-hs-5', 'rode-psa1',
    'se-electronics-reflexion-filter-pro', 'cordial-ccm-5-fm', 'elgato-wave-3',
    'rode-ntg5', 'cloud-microphones-cloudlifter-cl-1'
  ];
  if (topTier.some(t => slug.includes(t) || name.includes(t))) return 100;

  // Deuxième palier : très fortes références (Poids 80)
  const midTier = [
    'akg-c214', 'aston-origin', 'sennheiser-mk4', 'shure-sm58', 'shure-sm57', 'shure-mv7',
    'electro-voice-re20', 'rode-nt-usb', 'sennheiser-profile', 'sennheiser-mke-600',
    'beyerdynamic-dt-990-pro', 'sennheiser-hd-600', 'sennheiser-hd-25',
    'adam-t5v', 'focal-alpha-50-evo', 'motu-m2', 'solid-state-logic-ssl-2',
    'rode-psa1-plus', 'hofa-absorber-eco', 'tritonaudio-fethead', 'dbx-286-s'
  ];
  if (midTier.some(t => slug.includes(t) || name.includes(t))) return 80;

  // Troisième palier : références confirmées (Poids 60)
  if ((product.rating || 0) >= 4.5 && (product.price || 0) <= 300) return 60;

  // Standard
  return 40;
}
