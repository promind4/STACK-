'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { cleanImageUrl } from '@/lib/utils'
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
  originalPrice?: number
  rating: number
  reviewCount: number
  badge?: BadgeVariant
  promoLabel?: string
  inStock: boolean
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
    rating: p.rating || 0,
    reviewCount: p.review_count || p.reviews || 0,
    badge,
    inStock: p.inStock ?? true,
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
}

export function ProductCard({ product: dbProduct, className, editorialBadge }: ProductCardProps) {
  const product = mapProduct(dbProduct)
  const [wished, setWished] = useState(false)
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
        'group flex flex-col bg-card rounded-2xl border overflow-hidden',
        'transition-all duration-300',
        isUnavailable
          ? 'border-border/70 opacity-80'
          : 'border-border/70 hover:border-primary/60 hover:shadow-card',
        className
      )}
    >
      {/* Image zone */}
      <div className="aspect-square bg-white relative overflow-hidden">
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

        {product.imageUrl ? (
          <div className="absolute inset-0 flex items-center justify-center p-4 group-hover:scale-105 transition-transform duration-500">
            <Image
              src={product.imageUrl}
              alt={`${product.name} ${product.brand} – avis et prix | Fluxlab`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain mix-blend-multiply p-4"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-foreground/15 font-mono text-xs">
            No image
          </div>
        )}
      </div>

      {/* Info zone */}
      <div className="p-3 sm:p-5 flex flex-col flex-1 bg-secondary">
        <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-[0.14em] sm:tracking-[0.18em] uppercase text-foreground/55 mb-1.5 sm:mb-2">
          <span className="truncate">{product.brand}</span>
        </div>

        <h3 className="font-serif text-[14px] sm:text-[18px] leading-[1.2] text-foreground mb-2 sm:mb-3 line-clamp-2">
          <span className="bg-[linear-gradient(90deg,#D3B27B,#D3B27B)] bg-[length:0_1px] bg-no-repeat bg-bottom group-hover:bg-[length:100%_1px] transition-all duration-300">
            {product.name}
          </span>
        </h3>

        {product.reviewCount > 0 && (
          <div className="mb-3 sm:mb-5">
            <StarRating rating={product.rating} count={product.reviewCount} />
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-3 sm:pt-4 border-t border-foreground/10">
          <div className="min-w-0">
            <span className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.12em] sm:tracking-[0.16em] text-foreground/55 mb-0.5">
              à partir de
            </span>
            <span className={cn('font-serif text-[19px] sm:text-[28px] leading-none', isUnavailable && 'text-foreground/55')}>
              {product.price.toLocaleString('fr-FR')}
              <span className="text-[12px] sm:text-[16px] align-top">€</span>
            </span>
          </div>

          <span className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-foreground text-white flex items-center justify-center group-hover:bg-primary transition-colors">
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  )
}
