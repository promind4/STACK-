/**
 * FLUXLAB — Extraction de prix depuis du HTML.
 *
 * Stratégie en cascade (de la plus fiable à la plus fragile) :
 *  1. JSON-LD schema.org Product → offers.price
 *  2. Microdata / meta : <meta itemprop="price"> , product:price:amount …
 *  3. Regex spécifique au marchand (fallback Amazon notamment)
 *
 * Toutes les fonctions renvoient un nombre (€) ou null si rien de fiable.
 */

/** Normalise une chaîne de prix FR/EN en nombre. "1 299,00 €" → 1299 ; "1,299.00" → 1299 */
export function parsePriceString(raw: string | number | null | undefined): number | null {
  if (raw == null) return null;
  if (typeof raw === 'number') return isFinite(raw) && raw > 0 ? raw : null;

  let s = String(raw).trim();
  if (!s) return null;

  // Retire symboles/espaces/devises, garde chiffres . ,
  s = s.replace(/[^\d.,]/g, '');
  if (!s) return null;

  const hasComma = s.includes(',');
  const hasDot = s.includes('.');

  if (hasComma && hasDot) {
    // Le dernier séparateur est le décimal
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
      s = s.replace(/\./g, '').replace(',', '.'); // format FR : 1.299,00
    } else {
      s = s.replace(/,/g, ''); // format EN : 1,299.00
    }
  } else if (hasComma) {
    // virgule seule : décimal FR si 2 chiffres après, sinon séparateur de milliers
    const parts = s.split(',');
    if (parts[parts.length - 1].length === 2) s = s.replace(',', '.');
    else s = s.replace(/,/g, '');
  }

  const n = parseFloat(s);
  return isFinite(n) && n > 0 ? n : null;
}

/** 1. JSON-LD schema.org */
function fromJsonLd(html: string): number | null {
  const blocks = html.match(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi);
  if (!blocks) return null;

  for (const block of blocks) {
    const jsonText = block.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();
    let data: any;
    try { data = JSON.parse(jsonText); } catch { continue; }

    // Peut être un objet, un tableau, ou un @graph
    const nodes: any[] = Array.isArray(data) ? data : (data['@graph'] || [data]);

    for (const node of nodes) {
      if (!node || typeof node !== 'object') continue;
      const type = node['@type'];
      const isProduct = type === 'Product' || (Array.isArray(type) && type.includes('Product'));
      const offers = node.offers;
      if (!offers) continue;

      const offerList = Array.isArray(offers) ? offers : [offers];
      for (const offer of offerList) {
        const raw = offer?.price ?? offer?.priceSpecification?.price ?? offer?.lowPrice;
        const price = parsePriceString(raw);
        if (price && (isProduct || offer?.['@type'] === 'Offer')) return price;
      }
    }
  }
  return null;
}

/** 2. Microdata / meta tags */
function fromMeta(html: string): number | null {
  const patterns = [
    /<meta[^>]+itemprop=["']price["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+itemprop=["']price["']/i,
    /<meta[^>]+property=["']product:price:amount["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+property=["']og:price:amount["'][^>]+content=["']([^"']+)["']/i,
    /<[^>]+itemprop=["']price["'][^>]+content=["']([^"']+)["']/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) {
      const p = parsePriceString(m[1]);
      if (p) return p;
    }
  }
  return null;
}

/** 3. Regex spécifiques marchand */
function fromMerchantRegex(html: string, merchant: string): number | null {
  const m = merchant.toLowerCase();

  if (m === 'amazon') {
    const candidates = [
      /class=["']a-price-whole["']>([^<]+)</i,
      /class=["']a-offscreen["']>([^<]+)</i,
      /"priceAmount"\s*:\s*([\d.,]+)/i,
      /id=["']priceblock_ourprice["'][^>]*>([^<]+)</i,
    ];
    for (const re of candidates) {
      const match = html.match(re);
      if (match) { const p = parsePriceString(match[1]); if (p) return p; }
    }
  }

  if (m === 'thomann') {
    const match = html.match(/data-price=["']?([\d.,]+)/i) || html.match(/"price"\s*:\s*"?([\d.,]+)/i);
    if (match) { const p = parsePriceString(match[1]); if (p) return p; }
  }

  if (m === 'woodbrass') {
    const match = html.match(/"price"\s*:\s*"?([\d.,]+)/i) || html.match(/class=["'][^"']*price[^"']*["'][^>]*>\s*([\d.,]+\s*€)/i);
    if (match) { const p = parsePriceString(match[1]); if (p) return p; }
  }

  return null;
}

/** Détecte une indisponibilité grossière. */
export function detectOutOfStock(html: string): boolean {
  const lower = html.toLowerCase();
  return /actuellement indisponible|rupture de stock|out of stock|product unavailable|momentanément indisponible/.test(lower);
}

/**
 * Extrait le prix d'une page HTML pour un marchand donné.
 * Renvoie null si aucune stratégie ne donne de résultat fiable.
 */
export function extractPrice(html: string, merchant: string): number | null {
  return fromJsonLd(html) ?? fromMeta(html) ?? fromMerchantRegex(html, merchant);
}
