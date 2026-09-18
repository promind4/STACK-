'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface VisualCategory {
  slug: string
  label: string
  reference: string
  image: string
}

export const VISUAL_CATEGORIES: VisualCategory[] = [
  {
    slug: 'micros-dynamiques',
    label: 'Micros dynamiques',
    reference: '',
    image: 'https://media.sweetwater.com/m/products/image/654b44666859HVStX1UqPW27kGXUWiXYVC9X6BoF.jpg',
  },
  {
    slug: 'micros-condensateurs',
    label: 'Condensateurs',
    reference: '',
    image: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_56/561426/18111440_800.jpg',
  },
  {
    slug: 'micros-usb',
    label: 'Micros USB',
    reference: '',
    image: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_61/618361/20357991_800.jpg',
  },
  {
    slug: 'micros-shotgun',
    label: 'Micros shotgun',
    reference: '',
    image: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_47/478961/14673176_800.jpg',
  },
  {
    slug: 'cartes-son',
    label: 'Cartes son USB',
    reference: '',
    image: 'https://images.thomann.de/pics/prod/529059.jpg',
  },
  {
    slug: 'preamplis',
    label: 'Préamplis & Gain',
    reference: '',
    image: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_32/320773/16370363_800.jpg',
  },
  {
    slug: 'casques-studio',
    label: 'Casques studio',
    reference: '',
    image: 'https://images.thomann.de/pics/prod/128926.jpg',
  },
  {
    slug: 'enceintes',
    label: 'Enceintes monitoring',
    reference: '',
    image: 'https://oxzapjwfttrgsometnwq.supabase.co/storage/v1/object/public/images-produit/mackie-cr3-x-gallery-1769881670870.png',
  },
  {
    slug: 'bras-articules',
    label: 'Bras articulés',
    reference: '',
    image: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_22/228455/16390989_800.jpg',
  },
  {
    slug: 'traitement-acoustique',
    label: 'Acoustique',
    reference: '',
    image: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_61/618030/20659157_800.jpg',
  },
  {
    slug: 'cable-xlr',
    label: 'Câbles XLR',
    reference: '',
    image: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_12/128512/8584486_800.jpg',
  },
]

export function CategoryVisualBar() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  const scrollBy = (offset: number) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  return (
    <section
      aria-label="Catégories Studio & Son"
      className="w-full bg-[var(--home-ink)] py-8 sm:py-10"
    >
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-16">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
            <h2 className="text-[13px] font-bold text-white tracking-tight">
              Explorer par catégorie
            </h2>
            <span className="hidden sm:inline text-[11px] text-white/45 font-mono">
              / Équipements de référence
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/categorie/audio"
              className="text-[11px] font-mono uppercase tracking-wider text-white/65 hover:text-primary transition-colors inline-flex items-center gap-1.5"
            >
              <span>Tout l&apos;univers</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>

            {/* Scroll navigation arrows */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                onClick={() => scrollBy(-320)}
                disabled={!canScrollLeft}
                aria-label="Faire défiler vers la gauche"
                className={cn(
                  'w-7 h-7 rounded-full border border-white/15 flex items-center justify-center transition-all',
                  canScrollLeft
                    ? 'text-white hover:border-primary hover:text-primary hover:bg-white/10 cursor-pointer'
                    : 'text-white/20 border-white/5 cursor-default'
                )}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollBy(320)}
                disabled={!canScrollRight}
                aria-label="Faire défiler vers la droite"
                className={cn(
                  'w-7 h-7 rounded-full border border-white/15 flex items-center justify-center transition-all',
                  canScrollRight
                    ? 'text-white hover:border-primary hover:text-primary hover:bg-white/10 cursor-pointer'
                    : 'text-white/20 border-white/5 cursor-default'
                )}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Categories scroll reel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex items-stretch gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 -mx-1 snap-x snap-mandatory"
          >
            {VISUAL_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categorie/${cat.slug}`}
                className={cn(
                  'group flex flex-col items-center shrink-0 w-[124px] sm:w-[138px] p-2.5 sm:p-3 rounded-2xl',
                  'bg-white/5 border border-white/10 hover:border-primary/70',
                  'hover:bg-white/10 shadow-lg',
                  'transition-all duration-200 hover:-translate-y-1 snap-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary'
                )}
              >
                {/* Product photo frame with pedestal effect */}
                <div className="relative w-full aspect-square rounded-xl bg-[#faf7f2] border border-white/10 flex items-center justify-center p-2 overflow-hidden group-hover:border-primary/40 transition-colors">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Category label */}
                <span className="mt-3 mb-1 text-[12px] font-bold text-white text-center leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
