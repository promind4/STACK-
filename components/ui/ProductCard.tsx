'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { cleanImageUrl } from '@/lib/utils'
import { isDirectSupabaseStorageUrl } from '@/lib/imagePolicy.mjs'
import { ProductBadge } from '@/components/ui/Badge'
import { Star, ArrowRight, Heart } from '@/components/FluxlabIcons'
import type { Product as DBProduct } from '@/types/database'

/* ─── MAPPER DB → Card ───────────────────────────────────── */
type BadgeVariant = 'new' | 'bestseller' | 'promo' | 'out_of_stock'

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

/* ─── PRODUCT CARD ───────────────────────────────────────── */
interface ProductCardProps {
  product: DBProduct
  className?: string
  editorialBadge?: 'choix' | 'coup-de-coeur'
  variant?: 'default' | 'home-showcase'
}

export function ProductCard({ product: dbProduct, className, editorialBadge, variant = 'default' }: ProductCardProps) {
  const product = mapProduct(dbProduct)
  const [wished, setWished] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const isUnavailable = !product.inStock || product.badge === 'out_of_stock'

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWished((v) => !v)
  }

  return (
    <Link
      href={product.href}
      className={cn(
        'group bg-card rounded-2xl border overflow-hidden',
        variant === 'home-showcase' ? 'home-showcase-card' : '',
        variant === 'home-showcase'
          ? 'flex flex-col aspect-[4/5] max-sm:aspect-auto sm:grid sm:grid-rows-[58%_42%]'
          : 'flex flex-col',
        'transition-all duration-300',
        isUnavailable
          ? 'border-border/70 opacity-80'
          : 'border-border/70 hover:border-primary/60 hover:shadow-card',
        className
      )}
      >
      {/* Image zone */}
      <div className={cn(
        'bg-white relative overflow-hidden',
        variant === 'home-showcase' ? 'aspect-square sm:aspect-auto sm:h-full' : 'aspect-square'
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

        <button
          type="button"
          aria-label={wished ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          onClick={handleWishlist}
          className={cn(
            'absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full',
            'bg-white/95 backdrop-blur border border-border/70',
            'flex items-center justify-center transition-colors',
            wished ? 'text-primary' : 'text-foreground/60 hover:text-primary'
          )}
        >
          <Heart size={14} fill={wished ? 'currentColor' : 'none'} />
        </button>

        {product.imageUrl && !imageFailed ? (
          <div className="absolute inset-0 flex items-center justify-center p-4 transition-transform duration-500 group-hover:scale-[1.035]">
            <Image
              src={product.imageUrl}
              alt={`${product.name} ${product.brand} – avis et prix | Fluxlab`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain mix-blend-multiply p-4"
              loading="lazy"
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
      <div className={cn(
        'flex flex-col flex-1',
        variant === 'home-showcase'
          ? 'min-h-[128px] bg-white p-3 sm:min-h-0 sm:p-3.5'
          : 'p-3 sm:p-5 bg-[linear-gradient(145deg,hsl(var(--secondary))_0%,hsl(var(--card))_100%)]'
      )}>
        <div className={cn(
          'flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-[0.14em] sm:tracking-[0.18em] uppercase text-foreground/55',
          variant === 'home-showcase' ? 'mb-1 sm:mb-1.5' : 'mb-1.5 sm:mb-2'
        )}>
          <span className="truncate">{product.brand}</span>
        </div>

        <h3 className={cn(
          'font-serif text-[14px] leading-[1.2] text-foreground line-clamp-2',
          variant === 'home-showcase' ? 'mb-1.5 sm:mb-2 sm:text-[16px]' : 'mb-2 sm:mb-3 sm:text-[18px]'
        )}>
          <span className="bg-[linear-gradient(90deg,#D3B27B,#D3B27B)] bg-[length:0_1px] bg-no-repeat bg-bottom group-hover:bg-[length:100%_1px] transition-all duration-300">
            {product.name}
          </span>
        </h3>

        {product.reviewCount > 0 && (
          <div className={variant === 'home-showcase' ? 'mb-1.5 sm:mb-2' : 'mb-3 sm:mb-5'}>
            <StarRating rating={product.rating} count={product.reviewCount} />
          </div>
        )}

        <div className={cn(
          'flex items-center gap-2 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.1em] text-foreground/55',
          variant === 'home-showcase' ? 'mb-2 sm:mb-2.5' : 'mb-3 sm:mb-4'
        )}>
          <span className={cn('w-1.5 h-1.5 rounded-full', isUnavailable ? 'bg-foreground/30' : 'bg-emerald-500')} aria-hidden />
          <span>
            {isUnavailable
              ? 'Indisponible'
              : product.availableOfferCount > 1
                ? `${product.availableOfferCount} offres en stock`
                : 'En stock'}
          </span>
          {product.offerCount > 1 && (
            <span className="text-foreground/35">· {product.offerCount} marchands</span>
          )}
        </div>

        <div className={cn(
          'mt-auto flex items-end justify-between gap-2 border-t border-foreground/10',
          variant === 'home-showcase' ? 'pt-2 sm:pt-2.5' : 'pt-3 sm:pt-4'
        )}>
          <div className="min-w-0">
            <span className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.12em] sm:tracking-[0.16em] text-foreground/55 mb-0.5">
              à partir de
            </span>
            {product.hasPrice ? (
              <span className={cn('font-serif text-[19px] sm:text-[28px] leading-none text-foreground', isUnavailable && 'text-foreground/55')}>
                {product.price.toLocaleString('fr-FR')}
                <span className="text-[12px] sm:text-[16px] align-top">€</span>
              </span>
            ) : (
              <span className="text-[12px] sm:text-sm font-medium text-foreground/55">Prix indisponible</span>
            )}
          </div>

          <span className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-foreground text-white flex items-center justify-center group-hover:bg-primary transition-colors">
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  )
}
