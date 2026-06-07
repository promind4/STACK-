/**
 * PROVIDER : Amazon Product Advertising API 5.0 (PA-API).
 *
 * ⚠️  PRÉREQUIS : compte Amazon Partenaires validé (3 ventes minimum) pour
 *     débloquer l'accès API. Tant que ce n'est pas le cas, ce provider reste
 *     inactif (`supports` renvoie false) et le système bascule sur le scraping.
 *
 * Une fois actif, c'est LA source idéale pour Amazon : prix temps réel, légal,
 * gratuit, sans risque de blocage.
 *
 * Variables d'environnement requises :
 *   AMAZON_PAAPI_ACCESS_KEY
 *   AMAZON_PAAPI_SECRET_KEY
 *   AMAZON_PARTNER_TAG       (ex: stackera-21)
 *   AMAZON_PAAPI_HOST        (défaut: webservices.amazon.fr)
 *   AMAZON_PAAPI_REGION      (défaut: eu-west-1)
 */

import type { OfferRow, PriceProvider, PriceQuote } from '../types';

const ACCESS_KEY = process.env.AMAZON_PAAPI_ACCESS_KEY;
const SECRET_KEY = process.env.AMAZON_PAAPI_SECRET_KEY;
const PARTNER_TAG = process.env.AMAZON_PARTNER_TAG;
const HOST = process.env.AMAZON_PAAPI_HOST || 'webservices.amazon.fr';
const REGION = process.env.AMAZON_PAAPI_REGION || 'eu-west-1';

/** Extrait l'ASIN d'une URL Amazon (/dp/XXXX, /gp/product/XXXX, ?asin=XXXX). */
export function extractAsin(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/i,
    /\/gp\/product\/([A-Z0-9]{10})/i,
    /\/product\/([A-Z0-9]{10})/i,
    /[?&]asin=([A-Z0-9]{10})/i,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1].toUpperCase();
  }
  return null;
}

const isConfigured = Boolean(ACCESS_KEY && SECRET_KEY && PARTNER_TAG);

export const amazonPaapiProvider: PriceProvider = {
  source: 'amazon-paapi',

  supports(offer: OfferRow): boolean {
    return (
      isConfigured &&
      offer.merchant_name.toLowerCase() === 'amazon' &&
      extractAsin(offer.affiliate_link) !== null
    );
  },

  async fetchQuote(offer: OfferRow): Promise<PriceQuote> {
    const base: PriceQuote = {
      offerId: offer.id,
      merchant: offer.merchant_name,
      price: null,
      currency: offer.currency || 'EUR',
      inStock: offer.in_stock,
      source: 'amazon-paapi',
    };

    const asin = extractAsin(offer.affiliate_link);
    if (!asin) return { ...base, note: 'ASIN introuvable dans le lien.' };
    if (!isConfigured) return { ...base, note: 'PA-API non configurée (clés manquantes).' };

    // ── Appel PA-API GetItems ──────────────────────────────────────────
    // L'appel réel nécessite la signature AWS SigV4. Recommandé : le SDK
    // officiel `paapi5-nodejs-sdk` ou `amazon-paapi`. Installer puis activer :
    //
    //   import amazonPaapi from 'amazon-paapi';
    //   const data = await amazonPaapi.GetItems(
    //     { AccessKey: ACCESS_KEY, SecretKey: SECRET_KEY, PartnerTag: PARTNER_TAG,
    //       PartnerType: 'Associates', Marketplace: 'www.amazon.fr' },
    //     { ItemIds: [asin], Resources: ['Offers.Listings.Price', 'Offers.Listings.Availability.Message'] }
    //   );
    //   const listing = data.ItemsResult?.Items?.[0]?.Offers?.Listings?.[0];
    //   const price = listing?.Price?.Amount ?? null;
    //   const inStock = !/indisponible|unavailable/i.test(listing?.Availability?.Message || '');
    //   return { ...base, price, inStock };
    //
    // Tant que le SDK n'est pas branché, on signale clairement l'état :
    return {
      ...base,
      note: `PA-API prête (ASIN ${asin}) — brancher le SDK amazon-paapi pour activer (host ${HOST}/${REGION}).`,
    };
  },
};
