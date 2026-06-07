/**
 * PROVIDER : Awin Product Datafeed (Thomann, Woodbrass…).
 *
 * ⚠️  PRÉREQUIS : compte Awin avec accès au flux produit du marchand.
 *     Tant qu'aucune URL de flux n'est configurée, ce provider reste inactif.
 *
 * Principe : Awin fournit un flux (CSV) contenant TOUS les produits du
 * marchand avec leur prix. On télécharge le flux une fois par run, on l'indexe
 * par lien produit, puis on associe chaque offre Fluxlab à sa ligne de flux.
 *
 * Variables d'environnement (une par marchand, optionnelles) :
 *   AWIN_FEED_URL_THOMANN
 *   AWIN_FEED_URL_WOODBRASS
 *
 * Le flux Awin doit inclure au minimum les colonnes :
 *   merchant_deep_link (ou aw_deep_link), search_price (ou store_price), in_stock
 */

import type { OfferRow, PriceProvider, PriceQuote } from '../types';
import { parsePriceString } from '../extract';

const FEED_URLS: Record<string, string | undefined> = {
  thomann: process.env.AWIN_FEED_URL_THOMANN,
  woodbrass: process.env.AWIN_FEED_URL_WOODBRASS,
};

interface FeedRow { price: number | null; inStock: boolean; }

// Cache des flux indexés, valable le temps d'un run (process).
const feedCache = new Map<string, Map<string, FeedRow>>();

/** Normalise une URL pour le matching (retire protocole, params de tracking, slash final). */
function normalizeUrl(url: string): string {
  return url
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('?')[0]
    .replace(/\/$/, '');
}

/** Parseur CSV minimal gérant les guillemets. */
function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const splitLine = (line: string): string[] => {
    const out: string[] = [];
    let cur = '', inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) { out.push(cur); cur = ''; }
      else cur += c;
    }
    out.push(cur);
    return out;
  };

  const headers = splitLine(lines[0]).map(h => h.trim().toLowerCase());
  return lines.slice(1).map(line => {
    const cells = splitLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = (cells[i] ?? '').trim(); });
    return row;
  });
}

/** Télécharge et indexe le flux d'un marchand (avec cache de run). */
async function loadFeed(merchant: string): Promise<Map<string, FeedRow> | null> {
  const key = merchant.toLowerCase();
  if (feedCache.has(key)) return feedCache.get(key)!;

  const url = FEED_URLS[key];
  if (!url) return null;

  const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  if (!res.ok) return null;

  const rows = parseCsv(await res.text());
  const index = new Map<string, FeedRow>();

  for (const row of rows) {
    const link = row['merchant_deep_link'] || row['aw_deep_link'] || row['product_url'] || row['merchant_product_url'];
    if (!link) continue;
    const price = parsePriceString(row['search_price'] || row['store_price'] || row['price']);
    const stockRaw = (row['in_stock'] || row['stock_status'] || '').toLowerCase();
    const inStock = stockRaw === '' ? true : !/0|out|no|rupture|indispo/.test(stockRaw);
    index.set(normalizeUrl(link), { price, inStock });
  }

  feedCache.set(key, index);
  return index;
}

export const awinProvider: PriceProvider = {
  source: 'awin',

  supports(offer: OfferRow): boolean {
    return Boolean(FEED_URLS[offer.merchant_name.toLowerCase()]) && Boolean(offer.affiliate_link);
  },

  async fetchQuote(offer: OfferRow): Promise<PriceQuote> {
    const base: PriceQuote = {
      offerId: offer.id,
      merchant: offer.merchant_name,
      price: null,
      currency: offer.currency || 'EUR',
      inStock: offer.in_stock,
      source: 'awin',
    };

    try {
      const feed = await loadFeed(offer.merchant_name);
      if (!feed) return { ...base, note: 'Flux Awin non configuré pour ce marchand.' };

      // Matching : on cherche la ligne de flux dont l'URL produit correspond.
      const target = normalizeUrl(offer.affiliate_link);
      let hit = feed.get(target);

      // Fallback : matching partiel (le lien affilié peut différer du deep link brut)
      if (!hit) {
        for (const [feedUrl, row] of feed) {
          if (target.includes(feedUrl) || feedUrl.includes(target)) { hit = row; break; }
        }
      }

      if (!hit) return { ...base, note: 'Produit non trouvé dans le flux (vérifier le lien).' };
      return { ...base, price: hit.price, inStock: hit.inStock };
    } catch (err: any) {
      return { ...base, note: err?.message || 'Erreur lecture flux Awin.' };
    }
  },
};

/** Vide le cache de flux (à appeler en fin de run si besoin). */
export function clearAwinCache() { feedCache.clear(); }
