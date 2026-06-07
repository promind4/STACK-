/**
 * FLUXLAB — Orchestrateur de mise à jour des prix.
 *
 * Pour chaque offre :
 *  1. Choisit le meilleur provider disponible (ordre de priorité)
 *  2. Récupère le prix
 *  3. Met à jour product_offers + products.price (façade) si changement
 *  4. Journalise dans price_history
 *
 * Respecte `price_locked` (override manuel) : ces offres ne sont jamais écrasées.
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { OfferRow, PriceProvider, PriceQuote, UpdateRunSummary } from './types';
import { amazonPaapiProvider } from './providers/amazon-paapi';
import { awinProvider } from './providers/awin';
import { scrapingProvider } from './providers/scraping';

/**
 * Ordre de priorité des providers : on prend le premier qui sait traiter
 * l'offre. Les sources officielles (PA-API, Awin) passent avant le scraping.
 */
const PROVIDERS: PriceProvider[] = [amazonPaapiProvider, awinProvider, scrapingProvider];

function pickProvider(offer: OfferRow): PriceProvider | null {
  return PROVIDERS.find(p => p.supports(offer)) ?? null;
}

/** Client Supabase avec service role (écritures, bypass RLS). Serveur uniquement. */
function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error('Variables Supabase serveur manquantes (URL / SERVICE_ROLE_KEY).');
  return createSupabaseClient(url, key, { auth: { persistSession: false } });
}

interface RunOptions {
  /** Limiter à un seul produit (pour tester depuis l'admin). */
  productId?: string;
  /** Ne rien écrire en base, juste simuler. */
  dryRun?: boolean;
  /** Concurrence (nb de fetchs simultanés). */
  concurrency?: number;
  /** Ignore les garde-fous (staleness + plafond) — pour un test manuel. */
  force?: boolean;
  /** Ne re-vérifie pas une offre contrôlée depuis moins de N jours. */
  minAgeDays?: number;
  /** Plafond de requêtes scraping (payantes) par run. 0 = illimité. */
  maxScrapingCalls?: number;
}

// Valeurs par défaut pilotables par variables d'environnement
const DEFAULT_MIN_AGE_DAYS = Number(process.env.PRICE_REFRESH_MIN_AGE_DAYS ?? 7);
const DEFAULT_MAX_SCRAPING = Number(process.env.PRICE_MAX_SCRAPING_CALLS ?? 0); // 0 = pas de plafond

/** Une offre est "fraîche" si vérifiée il y a moins de minAgeDays jours. */
function isFresh(offer: OfferRow, minAgeDays: number): boolean {
  if (minAgeDays <= 0 || !offer.last_checked_at) return false;
  const ageMs = Date.now() - new Date(offer.last_checked_at).getTime();
  return ageMs < minAgeDays * 24 * 60 * 60 * 1000;
}

/** Met à jour les prix. Renvoie un résumé détaillé. */
export async function updatePrices(opts: RunOptions = {}): Promise<UpdateRunSummary> {
  const {
    productId,
    dryRun = false,
    concurrency = 4,
    force = false,
    minAgeDays = DEFAULT_MIN_AGE_DAYS,
    maxScrapingCalls = DEFAULT_MAX_SCRAPING,
  } = opts;
  const supabase = adminClient();

  // 1. Charger les offres à traiter
  let query = supabase
    .from('product_offers')
    .select('id, product_id, merchant_name, price, currency, affiliate_link, in_stock, price_locked, last_checked_at');
  if (productId) query = query.eq('product_id', productId);

  const { data, error } = await query;
  if (error) throw new Error(`Lecture offres impossible : ${error.message}`);

  const offers = (data ?? []) as OfferRow[];

  const summary: UpdateRunSummary = {
    total: offers.length, updated: 0, unchanged: 0, failed: 0,
    skippedLocked: 0, skippedFresh: 0, skippedQuota: 0, scrapingCalls: 0, details: [],
  };

  // Produits dont le prix façade devra être recalculé
  const touchedProducts = new Set<string>();
  const effectiveMinAge = force ? 0 : minAgeDays;

  // 2. Traiter par lots (concurrence limitée)
  for (let i = 0; i < offers.length; i += concurrency) {
    const batch = offers.slice(i, i + concurrency);

    // Pré-filtrage AVANT tout appel réseau (économie de crédits) :
    const toFetch: OfferRow[] = [];
    for (const offer of batch) {
      // Verrouillé → jamais touché
      if (offer.price_locked) {
        summary.skippedLocked++;
        summary.details.push({ merchant: offer.merchant_name, productId: offer.product_id, oldPrice: offer.price, newPrice: offer.price, status: 'locked' });
        continue;
      }
      // Déjà vérifié récemment → on saute (pas d'appel = pas de crédit)
      if (isFresh(offer, effectiveMinAge)) {
        summary.skippedFresh++;
        summary.details.push({ merchant: offer.merchant_name, productId: offer.product_id, oldPrice: offer.price, newPrice: offer.price, status: 'fresh' });
        continue;
      }
      // Plafond scraping atteint → on saute les offres qui passeraient par le scraping
      const provider = pickProvider(offer);
      if (provider?.source === 'scraping' && maxScrapingCalls > 0 && summary.scrapingCalls >= maxScrapingCalls) {
        summary.skippedQuota++;
        summary.details.push({ merchant: offer.merchant_name, productId: offer.product_id, oldPrice: offer.price, newPrice: offer.price, status: 'quota', note: 'Plafond scraping du run atteint.' });
        continue;
      }
      if (provider?.source === 'scraping') summary.scrapingCalls++;
      toFetch.push(offer);
    }

    const quotes = await Promise.all(toFetch.map(processOffer));

    for (let j = 0; j < toFetch.length; j++) {
      const offer = toFetch[j];
      const quote = quotes[j];

      if (quote.price == null) {
        summary.failed++;
        summary.details.push({ merchant: offer.merchant_name, productId: offer.product_id, oldPrice: offer.price, newPrice: null, status: 'failed', note: quote.note });
        continue;
      }

      const changed = Math.abs(quote.price - offer.price) >= 0.01 || quote.inStock !== offer.in_stock;

      if (!changed) {
        summary.unchanged++;
        summary.details.push({ merchant: offer.merchant_name, productId: offer.product_id, oldPrice: offer.price, newPrice: quote.price, status: 'unchanged' });
        if (!dryRun) await markChecked(supabase, offer.id, quote.source);
        continue;
      }

      // 3. Écrire le nouveau prix
      if (!dryRun) {
        await applyQuote(supabase, offer, quote);
        touchedProducts.add(offer.product_id);
      }
      summary.updated++;
      summary.details.push({ merchant: offer.merchant_name, productId: offer.product_id, oldPrice: offer.price, newPrice: quote.price, status: 'updated', note: quote.source });
    }
  }

  // 4. Recalculer le prix "façade" des produits modifiés (= prix min des offres)
  if (!dryRun) {
    for (const pid of touchedProducts) await refreshProductFacadePrice(supabase, pid);
  }

  return summary;
}

async function processOffer(offer: OfferRow): Promise<PriceQuote> {
  const provider = pickProvider(offer);
  if (!provider) {
    return {
      offerId: offer.id, merchant: offer.merchant_name, price: null,
      currency: offer.currency || 'EUR', inStock: offer.in_stock, source: 'scraping',
      note: 'Aucun provider disponible (configurer SCRAPING_API_KEY, PA-API ou Awin).',
    };
  }
  return provider.fetchQuote(offer);
}

async function markChecked(supabase: any, offerId: string, source: string) {
  await supabase.from('product_offers')
    .update({ last_checked_at: new Date().toISOString(), last_price_source: source })
    .eq('id', offerId);
}

async function applyQuote(supabase: any, offer: OfferRow, quote: PriceQuote) {
  await supabase.from('product_offers').update({
    price: quote.price,
    in_stock: quote.inStock,
    last_checked_at: new Date().toISOString(),
    last_price_source: quote.source,
  }).eq('id', offer.id);

  await supabase.from('price_history').insert({
    offer_id: offer.id,
    product_id: offer.product_id,
    merchant_name: offer.merchant_name,
    price: quote.price,
    currency: quote.currency,
    source: quote.source,
  });
}

/** Le prix affiché du produit = le plus bas de ses offres en stock. */
async function refreshProductFacadePrice(supabase: any, productId: string) {
  const { data } = await supabase
    .from('product_offers')
    .select('price, in_stock')
    .eq('product_id', productId);

  const prices = (data ?? [])
    .filter((o: any) => o.in_stock && o.price > 0)
    .map((o: any) => o.price);

  if (prices.length > 0) {
    await supabase.from('products').update({ price: Math.min(...prices) }).eq('id', productId);
  }
}
