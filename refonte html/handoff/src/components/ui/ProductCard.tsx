'use client'

import Link from 'next/link'
import { HTMLAttributes, useState } from 'react'
import { cn } from '@/lib/utils'
import { ProductBadge } from './Badge'
import { Star } from '../FluxlabIcons'
import { ArrowRight, Heart } from '../FluxlabIcons'
import type { Product } from '@/types/fluxlab'

/* ─── STAR RATING ────────────────────────────────────────── */
function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-foreground/60">
      <div className="flex items-center gap-0.5 text-primary">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={11}
            fill={i <= Math.round(rating) ? 'currentColor' : 'none'}
            opacity={i <= Math.round(rating) ? 1 : 0.35}
          />
        ))}
      </div>
      <span className="font-mono">
        {rating.toFixed(1)} · {count.toLocaleString('fr-FR')} avis
      </span>
    </div>
  )
}

/* ─── PRODUCT CARD ───────────────────────────────────────── */
export interface ProductCardProps extends HTMLAttributes<HTMLAnchorElement> {
  product: Product
  /** Slot for the product image / SVG placeholder */
  imagePlaceholder?: React.ReactNode
  onWishlistToggle?: (id: string) => void
  isWishlisted?: boolean
}

export function ProductCard({
  product,
  imagePlaceholder,
  onWishlistToggle,
  isWishlisted = false,
  className,
  ...props
}: ProductCardProps) {
  const [wished, setWished] = useState(isWishlisted)
  const isUnavailable = !product.inStock || product.badge === 'out_of_stock'

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWished((v) => !v)
    onWishlistToggle?.(product.id)
  }

  return (
    <Link
      href={product.href}
      className={cn(
        'group flex flex-col bg-card rounded-2xl border overflow-hidden',
        'transition-all duration-300',
        isUnavailable
          ? 'border-border/70 opacity-80 grayscale-[0.6]'
          : 'border-border/70 hover:border-primary/60 hover:shadow-card',
        className
      )}
      {...props}
    >
      {/* Image zone */}
      <div className="aspect-square bg-white relative overflow-hidden">
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 z-10">
            <ProductBadge variant={product.badge} promoLabel={product.promoLabel} />
          </span>
        )}

        {/* Wishlist button */}
        <button
          type="button"
          aria-label={wished ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          onClick={handleWishlist}
          className={cn(
            'absolute top-3 right-3 z-10 w-8 h-8 rounded-full',
            'bg-white/95 backdrop-blur border border-border/70',
            'flex items-center justify-center transition-colors',
            wished ? 'text-primary' : 'text-foreground/60 hover:text-primary'
          )}
        >
          <Heart
            size={14}
            fill={wished ? 'currentColor' : 'none'}
          />
        </button>

        {/* Image / placeholder */}
        <div className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
          {imagePlaceholder}
        </div>
      </div>

      {/* Info zone */}
      <div className="p-5 flex flex-col flex-1 bg-accent">
        {/* Brand + type */}
        <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.18em] uppercase text-foreground/55 mb-2">
          <span>{product.brand}</span>
          <span className="text-foreground/35">{product.type}</span>
        </div>

        {/* Name */}
        <h3 className="font-serif text-[18px] leading-[1.2] text-foreground mb-3">
          <span className="bg-[linear-gradient(90deg,#D3B27B,#D3B27B)] bg-[length:0_1px] bg-no-repeat bg-bottom group-hover:bg-[length:100%_1px] transition-all duration-300">
            {product.name}
          </span>
        </h3>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="mb-5">
            <StarRating rating={product.rating} count={product.reviewCount} />
          </div>
        )}

        {/* Unavailable notice */}
        {isUnavailable && (
          <p className="text-[12px] font-mono uppercase tracking-[0.14em] text-foreground/60 mb-5">
            M&apos;avertir du retour →
          </p>
        )}

        {/* Price + CTA */}
        <div className="mt-auto flex items-end justify-between pt-4 border-t border-foreground/10">
          <div>
            {product.originalPrice && (
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-[22px] leading-none">
                  {product.price.toLocaleString('fr-FR')}&nbsp;
                  <span className="text-[14px] align-top">€</span>
                </span>
                <span className="text-[11px] font-mono text-foreground/40 line-through">
                  {product.originalPrice.toLocaleString('fr-FR')}€
                </span>
              </div>
            )}

            {!product.originalPrice && (
              <>
                {!isUnavailable && (
                  <span className="block text-[10px] font-mono uppercase tracking-[0.16em] text-foreground/55 mb-0.5">
                    à partir de
                  </span>
                )}
                <span
                  className={cn(
                    'font-serif text-[22px] leading-none',
                    isUnavailable && 'text-foreground/55'
                  )}
                >
                  {product.price.toLocaleString('fr-FR')}
                  <span className="text-[14px] align-top">€</span>
                </span>
              </>
            )}

            {product.originalPrice && product.badge === 'promo' && (
              <span className="block text-[10px] font-mono uppercase tracking-[0.16em] text-primary mt-0.5">
                économie {(product.originalPrice - product.price).toLocaleString('fr-FR')}€
              </span>
            )}
          </div>

          {/* Arrow CTA */}
          {isUnavailable ? (
            <button
              type="button"
              disabled
              className="w-9 h-9 rounded-full bg-foreground/10 text-foreground/35 flex items-center justify-center cursor-not-allowed"
              aria-hidden
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
          ) : (
            <span className="w-9 h-9 rounded-full bg-foreground text-white flex items-center justify-center group-hover:bg-primary transition-colors">
              <ArrowRight size={14} />
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
