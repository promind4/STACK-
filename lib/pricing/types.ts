/**
 * FLUXLAB — Système de mise à jour des prix
 * Types & contrats communs à tous les fournisseurs de prix (providers).
 *
 * Principe : chaque marchand (Amazon, Thomann, Woodbrass…) est interrogé via
 * un "provider" interchangeable. Aujourd'hui on utilise le provider `scraping`
 * (API tierce qui contourne les anti-bots). Le jour où l'on obtient la
 * PA-API Amazon ou un flux Awin, on bascule sur le provider correspondant
 * sans rien changer au reste du système.
 */

export type PriceSource = 'scraping' | 'amazon-paapi' | 'awin' | 'manual';

/** Une offre telle que stockée en base, enrichie de son id. */
export interface OfferRow {
  id: string;
  product_id: string;
  merchant_name: string;
  price: number;
  currency: string;
  affiliate_link: string;
  in_stock: boolean;
  price_locked?: boolean;
  last_checked_at?: string | null;
}

/** Résultat d'une interrogation de prix pour une offre. */
export interface PriceQuote {
  offerId: string;
  merchant: string;
  /** Prix trouvé, ou null si introuvable. */
  price: number | null;
  currency: string;
  inStock: boolean;
  source: PriceSource;
  /** Message d'erreur ou note de diagnostic. */
  note?: string;
}

/**
 * Contrat d'un fournisseur de prix.
 * `supports` indique si le provider sait traiter ce marchand.
 * `fetchQuote` renvoie le prix pour une offre donnée.
 */
export interface PriceProvider {
  readonly source: PriceSource;
  supports(offer: OfferRow): boolean;
  fetchQuote(offer: OfferRow): Promise<PriceQuote>;
}

/** Résumé d'un run de mise à jour. */
export interface UpdateRunSummary {
  total: number;
  updated: number;
  unchanged: number;
  failed: number;
  skippedLocked: number;
  skippedFresh: number;   // offre déjà vérifiée récemment (économie)
  skippedQuota: number;   // plafond de requêtes scraping atteint
  scrapingCalls: number;  // nb de requêtes scraping consommées ce run
  details: Array<{
    merchant: string;
    productId: string;
    oldPrice: number;
    newPrice: number | null;
    status: 'updated' | 'unchanged' | 'failed' | 'locked' | 'fresh' | 'quota';
    note?: string;
  }>;
}
