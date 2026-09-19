'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { cleanImageUrl } from '@/lib/utils'
import { isDirectSupabaseStorageUrl } from '@/lib/imagePolicy.mjs'
import { ProductBadge } from '@/components/ui/Badge'
import { Star, ArrowRight, Heart } from '@/components/FluxlabIcons'
import { Swords } from 'lucide-react'
import { useComparison } from '@/context/ComparisonContext'
import type { Product as DBProduct } from '@/types/database'

/* ─── MAPPER DB → Card ───────────────────────────────────── */
import type { BadgeVariant } from '@/types/fluxlab'

interface CardProduct {
  id: string
  slug: string
  name: string
  brand: string
  type: string
  price: number
  hasPrice: boolean
  originalPrice?: number
  rating: number
  reviewCount: number
  badge?: BadgeVariant
  promoLabel?: string
  inStock: boolean
  offerCount: number
  availableOfferCount: number
  imageUrl: string
  href: string
  categorySlug?: string
}

function mapProduct(p: DBProduct): CardProduct {
  // Determine badge variant
  let badge: BadgeVariant | undefined
  if (p.badge?.text) {
    const t = p.badge.text.toLowerCase()
    if (t.includes('best') || t.includes('seller')) badge = 'bestseller'
    else if (t.includes('promo') || t.includes('prix')) badge = 'promo'
    else if (t.includes('nouveau') || t.includes('new')) badge = 'new'
  }
  if (!p.inStock) badge = 'out_of_stock'

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand || '',
    type: '',
    price: p.price || 0,
    hasPrice: typeof p.price === 'number' && p.price > 0,
    rating: p.rating || 0,
    reviewCount: p.review_count || p.reviews || 0,
    badge,
    inStock: p.inStock ?? true,
    offerCount: p.offers?.length ?? 0,
    availableOfferCount: p.offers?.filter((offer) => offer.in_stock).length ?? 0,
    imageUrl: cleanImageUrl(p.image_url) || '',
    href: `/produit/${p.slug}`,
    categorySlug: p.category_slug || (p as any).categories?.slug || '',
  }
}

/* ─── STAR RATING ────────────────────────────────────────── */
function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-foreground/60">
      <Star size={11} fill="currentColor" className="text-primary" />
      <span className="font-mono text-foreground/75 font-medium">{rating.toFixed(1)}</span>
      <span className="text-foreground/35">·</span>
      <span className="font-mono">{count.toLocaleString('fr-FR')} avis</span>
    </div>
  )
}

function getAvailabilityLabel(availableOfferCount: number, isUnavailable: boolean) {
  if (isUnavailable) return 'Indisponible'
  if (availableOfferCount > 1) return `${availableOfferCount} offres en stock`
  if (availableOfferCount === 1) return '1 offre en stock'
  return 'En stock'
}

function getMerchantLabel(offerCount: number) {
  if (offerCount > 1) return `${offerCount} marchands`
  if (offerCount === 1) return '1 marchand'
  return 'Prix direct'
}

/* ─── PRODUCT CARD ───────────────────────────────────────── */
interface ProductCardProps {
  product: DBProduct
  className?: string
  editorialBadge?: BadgeVariant
  variant?: 'default' | 'home-showcase'
  technicalTag?: string | null
  priority?: boolean
}

export function ProductCard({ product: dbProduct, className, editorialBadge, variant = 'default', technicalTag, priority = false }: ProductCardProps) {
  const product = mapProduct(dbProduct)
  const [wished, setWished] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const { toggleProduct, isInComparison, selectedProducts } = useComparison()
  const inComparison = isInComparison(product.id) || isInComparison(product.slug)
  const isUnavailable = !product.inStock || product.badge === 'out_of_stock'
  const availabilityLabel = getAvailabilityLabel(product.availableOfferCount, isUnavailable)
  const merchantLabel = getMerchantLabel(product.offerCount)

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWished((v) => !v)
  }

  const handleDuelToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleProduct({
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image_url: product.imageUrl,
      price: product.price,
      category_slug: product.categorySlug,
    })
  }

  return (
    <article
      className={cn(
        'group relative overflow-hidden border transition-all duration-300 motion-reduce:transition-none',
        inComparison ? 'ring-2 ring-primary ring-offset-2 border-primary' : '',
        variant === 'home-showcase' ? 'home-showcase-card' : '',
        variant === 'home-showcase'
          ? 'bg-white rounded-none xl:aspect-[1/1]'
          : 'bg-card rounded-2xl',
        isUnavailable
          ? 'border-border/70 opacity-80'
          : inComparison
            ? 'shadow-card'
            : 'border-border/70 hover:border-primary/60 hover:shadow-card',
        className
      )}
    >
      <Link
        href={product.href}
        className={variant === 'home-showcase'
          ? 'grid h-full grid-cols-[42%_minmax(0,1fr)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary sm:flex sm:flex-col xl:grid xl:grid-cols-1 xl:grid-rows-[52%_48%]'
          : 'flex h-full flex-col'}
      >
      {/* Image zone */}
      <div className={cn(
        'bg-white relative overflow-hidden',
        variant === 'home-showcase' ? 'h-full sm:aspect-square sm:h-auto xl:aspect-auto xl:h-full' : 'aspect-square'
      )}>
        {product.badge && (
          <span className="absolute top-3 left-3 z-10">
            <ProductBadge variant={product.badge} promoLabel={product.promoLabel} />
          </span>
        )}
        {editorialBadge && (
          <span className="absolute bottom-3 left-3 z-10">
            <ProductBadge variant={editorialBadge} />
          </span>
        )}

        {product.imageUrl && !imageFailed ? (
          <div className="absolute inset-0 flex items-center justify-center p-4 transition-transform duration-500 group-hover:scale-[1.035] motion-reduce:transform-none motion-reduce:transition-none">
            <Image
              src={product.imageUrl}
              alt={`${product.name} ${product.brand} – avis et prix | Fluxlab`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain mix-blend-multiply"
              loading={priority ? undefined : "lazy"}
              priority={priority}
              unoptimized={isDirectSupabaseStorageUrl(product.imageUrl)}
              onError={() => setImageFailed(true)}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-foreground/15 font-mono text-xs">
            Image indisponible
          </div>
        )}
      </div>

      {/* Info zone */}
      {variant === 'home-showcase' ? (
        <div className="flex min-h-0 min-w-0 flex-col bg-white p-3 sm:p-3.5 xl:p-2.5">
          <div className="mb-1 flex items-center justify-between text-[11px] font-mono font-medium uppercase tracking-[0.12em] text-foreground/75">
            <span className="truncate">{product.brand}</span>
            {technicalTag && (
              <span className="text-[10px] font-mono text-primary tracking-normal uppercase shrink-0 ml-2">
                {technicalTag}
              </span>
            )}
          </div>

          <h3 className="line-clamp-2 font-serif text-[15px] leading-[1.22] text-foreground sm:text-[14px] xl:!line-clamp-1 xl:text-[15px] text-balance">
            <span>{product.name}</span>
          </h3>

          <div className="mt-2 flex min-w-0 items-center gap-1.5 text-[12px] font-medium leading-tight text-foreground/80 xl:mt-1">
            <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', isUnavailable ? 'bg-foreground/30' : 'bg-emerald-500')} aria-hidden />
            <span className="truncate">{availabilityLabel}</span>
          </div>

          <div className="mt-auto flex items-end justify-between gap-2 border-t border-foreground/10 pt-2">
            <div className="min-w-0">
              <span className="mb-0.5 block text-[11px] font-mono uppercase tracking-[0.1em] text-foreground/70">à partir de</span>
              {product.hasPrice ? (
                <span className={cn('whitespace-nowrap font-serif text-[21px] leading-none text-foreground sm:text-[19px] xl:text-[22px]', isUnavailable && 'text-foreground/65')}>
                  {product.price.toLocaleString('fr-FR')}
                  <span className="align-top text-[12px]">€</span>
                </span>
              ) : (
                <span className="whitespace-nowrap text-[12px] font-medium text-foreground/65">Prix indisponible</span>
              )}
            </div>

            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-white transition-colors group-hover:bg-primary">
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3 sm:p-5 flex flex-col flex-1 bg-[linear-gradient(145deg,hsl(var(--secondary))_0%,hsl(var(--card))_100%)]">
          <div className="flex items-center justify-between text-[11px] sm:text-[12px] font-mono font-medium tracking-[0.14em] uppercase text-foreground/75 mb-1.5 sm:mb-2">
            <span className="truncate">{product.brand}</span>
            {technicalTag && (
              <span className="text-[10px] sm:text-[11px] font-mono text-primary tracking-normal uppercase shrink-0 ml-2">
                {technicalTag}
              </span>
            )}
          </div>

          <h3 className="font-serif text-[15px] sm:text-[18px] leading-[1.24] text-foreground mb-2 sm:mb-3 line-clamp-2 text-balance">
            <span className="bg-[linear-gradient(90deg,#D3B27B,#D3B27B)] bg-[length:0_1px] bg-no-repeat bg-bottom group-hover:bg-[length:100%_1px] transition-all duration-300">
              {product.name}
            </span>
          </h3>

          {product.reviewCount > 0 && (
            <div className="mb-3 sm:mb-5">
              <StarRating rating={product.rating} count={product.reviewCount} />
            </div>
          )}

          <div className="flex items-center gap-2 mb-3 sm:mb-4 text-[11px] sm:text-[12px] font-mono text-foreground/75">
            <span className={cn('w-1.5 h-1.5 rounded-full', isUnavailable ? 'bg-foreground/30' : 'bg-emerald-500')} aria-hidden />
            <span>
              {availabilityLabel}
            </span>
            {merchantLabel && (
              <span className="text-foreground/45">· {merchantLabel}</span>
            )}
          </div>

          <div className="mt-auto flex items-end justify-between gap-2 pt-3 sm:pt-4 border-t border-foreground/10">
            <div className="min-w-0">
              <span className="block text-[11px] sm:text-[12px] font-mono uppercase tracking-[0.12em] text-foreground/70 mb-0.5">
                à partir de
              </span>
              {product.hasPrice ? (
                <span className={cn('font-serif text-[20px] sm:text-[28px] leading-none text-foreground', isUnavailable && 'text-foreground/55')}>
                  {product.price.toLocaleString('fr-FR')}
                  <span className="text-[13px] sm:text-[16px] align-top">€</span>
                </span>
              ) : (
                <span className="text-[13px] sm:text-sm font-medium text-foreground/70">Prix indisponible</span>
              )}
            </div>

            <span className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-foreground text-white flex items-center justify-center group-hover:bg-primary transition-colors">
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      )}
      </Link>

      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 flex flex-col gap-1.5">
        <button
          type="button"
          aria-label={inComparison ? 'Retirer du duel' : 'Ajouter au duel'}
          title={inComparison ? 'Retirer du duel' : 'Comparer / Lancer un duel'}
          onClick={handleDuelToggle}
          className={cn(
            'w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-200 flex items-center justify-center shadow-sm',
            inComparison
              ? 'bg-primary text-primary-foreground border border-primary ring-2 ring-primary/40 scale-105'
              : 'bg-white/95 backdrop-blur border border-border/70 text-foreground/65 hover:text-primary hover:border-primary/50'
          )}
        >
          <Swords size={13} className="sm:w-3.5 sm:h-3.5" />
        </button>

        <button
          type="button"
          aria-label={wished ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          onClick={handleWishlist}
          className={cn(
            'w-7 h-7 sm:w-8 sm:h-8 rounded-full',
            'bg-white/95 backdrop-blur border border-border/70',
            'flex items-center justify-center transition-colors',
            wished ? 'text-primary' : 'text-foreground/60 hover:text-primary'
          )}
        >
          <Heart size={14} fill={wished ? 'currentColor' : 'none'} />
        </button>
      </div>
    </article>
  )
}
