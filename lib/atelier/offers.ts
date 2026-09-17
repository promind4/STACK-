import type { AtelierOffer } from './types.ts'

export function selectAvailableOffers(
  offers: readonly AtelierOffer[],
): AtelierOffer[] {
  return offers
    .filter(offer => offer.inStock
      && Number.isFinite(offer.price)
      && offer.price > 0
      && offer.currency === 'EUR'
      && typeof offer.affiliateLink === 'string'
      && offer.affiliateLink.trim().length > 0)
    .sort((left, right) => left.price - right.price)
}

export function selectBestAvailableOffer(
  offers: readonly AtelierOffer[],
): AtelierOffer | null {
  return selectAvailableOffers(offers)[0] ?? null
}
