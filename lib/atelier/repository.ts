import { createClient } from '../supabase.ts'
import { buildAffiliateLink } from '../utils.ts'
import { selectAvailableOffers } from './offers.ts'
import { deriveRecommendationProfile } from './profile.ts'
import type { AtelierCatalogProduct, AtelierOffer } from './types.ts'

interface RawOffer {
  merchant_name: string | null
  price: number | null
  currency: string | null
  affiliate_link: string | null
  in_stock: boolean | null
  last_checked_at: string | null
}

interface RawProduct {
  id: string
  slug: string
  name: string
  brand: string | null
  image_url: string | null
  specs: unknown
  description: string | null
  pros: unknown
  cons: unknown
  recommendation_profile: unknown
  categories: { slug: string } | { slug: string }[] | null
  product_offers: RawOffer[] | null
}

export async function loadAtelierCatalog(): Promise<AtelierCatalogProduct[]> {
  const { data, error } = await createClient()
    .from('products')
    .select('id,slug,name,brand,image_url,specs,description,pros,cons,recommendation_profile,categories(slug),product_offers(merchant_name,price,currency,affiliate_link,in_stock,last_checked_at)')
    .eq('is_active', true)

  if (error) throw error

  return ((data ?? []) as RawProduct[]).flatMap(raw => {
    const category = Array.isArray(raw.categories) ? raw.categories[0] : raw.categories
    const profile = deriveRecommendationProfile({
      categorySlug: category?.slug ?? null,
      specs: raw.specs && typeof raw.specs === 'object' && !Array.isArray(raw.specs)
        ? raw.specs as Record<string, unknown> : {},
      description: raw.description,
      pros: raw.pros,
      override: raw.recommendation_profile && typeof raw.recommendation_profile === 'object' && !Array.isArray(raw.recommendation_profile)
        ? raw.recommendation_profile : undefined,
    })
    if (profile.status === 'to_enrich') return []

    const offers: AtelierOffer[] = (raw.product_offers ?? []).map(offer => ({
      merchantName: offer.merchant_name ?? '',
      price: typeof offer.price === 'number' ? offer.price : Number.NaN,
      currency: offer.currency as AtelierOffer['currency'],
      affiliateLink: typeof offer.affiliate_link === 'string'
        ? buildAffiliateLink(offer.affiliate_link, offer.merchant_name) : '',
      inStock: offer.in_stock === true,
      ...(typeof offer.last_checked_at === 'string' ? { lastCheckedAt: offer.last_checked_at } : {}),
    }))
    const availableOffers = selectAvailableOffers(offers)
    if (!availableOffers.length) return []

    return [{
      id: raw.id,
      slug: raw.slug,
      name: raw.name,
      brand: raw.brand ?? 'Marque Inconnue',
      imageUrl: raw.image_url,
      profile,
      offers: availableOffers,
    }]
  })
}
