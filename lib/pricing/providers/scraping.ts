/**
 * PROVIDER : Scraping via API tierce (ScrapingBee par défaut).
 *
 * C'est le SEUL provider fonctionnel sans accès affilié officiel : il délègue
 * la récupération de la page à un service qui gère les proxies résidentiels,
 * le rendu JS et le contournement des anti-bots (captcha Amazon, fingerprint
 * TLS Cloudflare de Thomann/Woodbrass).
 *
 * Configuration via variables d'environnement :
 *   SCRAPING_API_KEY       — clé du service (obligatoire pour activer)
 *   SCRAPING_API_PROVIDER  — 'scrapingbee' (défaut) | 'scraperapi'
 *
 * Paliers gratuits : ScrapingBee ≈ 1000 crédits/mois, ScraperAPI ≈ 1000/mois.
 * Largement suffisant pour un petit catalogue mis à jour 1×/jour.
 */

import type { OfferRow, PriceProvider, PriceQuote } from '../types';
import { extractPrice, detectOutOfStock } from '../extract';

const API_KEY = process.env.SCRAPING_API_KEY;
const API_PROVIDER = (process.env.SCRAPING_API_PROVIDER || 'scrapingbee').toLowerCase();

/** Construit l'URL de l'API de scraping selon le fournisseur choisi. */
function buildScrapingUrl(targetUrl: string): string {
  const target = encodeURIComponent(targetUrl);

  if (API_PROVIDER === 'scraperapi') {
    // https://docs.scraperapi.com
    return `https://api.scraperapi.com/?api_key=${API_KEY}&render=true&country_code=fr&url=${target}`;
  }

  // ScrapingBee (défaut) — https://www.scrapingbee.com/documentation
  // render_js=true : exécute le JS (prix souvent injecté côté client)
  // premium_proxy + country_code=fr : proxy résidentiel français (prix FR corrects)
  return `https://app.scrapingbee.com/api/v1/?api_key=${API_KEY}` +
    `&url=${target}&render_js=true&premium_proxy=true&country_code=fr`;
}

export const scrapingProvider: PriceProvider = {
  source: 'scraping',

  supports(offer: OfferRow): boolean {
    // Fonctionne pour tout marchand tant qu'on a un lien et une clé API
    return Boolean(API_KEY) && Boolean(offer.affiliate_link);
  },

  async fetchQuote(offer: OfferRow): Promise<PriceQuote> {
    const base: PriceQuote = {
      offerId: offer.id,
      merchant: offer.merchant_name,
      price: null,
      currency: offer.currency || 'EUR',
      inStock: offer.in_stock,
      source: 'scraping',
    };

    if (!API_KEY) {
      return { ...base, note: 'SCRAPING_API_KEY manquante — provider inactif.' };
    }

    try {
      const res = await fetch(buildScrapingUrl(offer.affiliate_link), {
        // L'API de scraping peut prendre 10-30s (rendu JS) → on laisse de la marge
        signal: AbortSignal.timeout(45_000),
      });

      if (!res.ok) {
        return { ...base, note: `API scraping HTTP ${res.status}` };
      }

      const html = await res.text();
      const price = extractPrice(html, offer.merchant_name);
      const outOfStock = detectOutOfStock(html);

      if (price == null) {
        return { ...base, inStock: !outOfStock, note: 'Prix introuvable dans la page (sélecteur à ajuster).' };
      }

      return { ...base, price, inStock: !outOfStock };
    } catch (err: any) {
      const msg = err?.name === 'TimeoutError' ? 'Timeout API scraping' : (err?.message || 'Erreur inconnue');
      return { ...base, note: msg };
    }
  },
};
