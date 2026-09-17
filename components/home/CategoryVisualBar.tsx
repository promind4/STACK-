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
    reference: 'Shure SM7B',
    image: 'https://oxzapjwfttrgsometnwq.supabase.co/storage/v1/object/public/images-produit/shure-sm7b-studio.webp',
  },
  {
    slug: 'micros-condensateurs',
    label: 'Condensateurs',
    reference: 'Røde NT1',
    image: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_56/561426/18111440_800.jpg',
  },
  {
    slug: 'micros-usb',
    label: 'Micros USB',
    reference: 'AT2040 USB',
    image: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_61/618361/20357991_800.jpg',
  },
  {
    slug: 'micros-shotgun',
    label: 'Micros shotgun',
    reference: 'Røde NTG5',
    image: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_47/478961/14673176_800.jpg',
  },
  {
    slug: 'cartes-son',
    label: 'Cartes son USB',
    reference: 'Scarlett 2i2',
    image: 'https://oxzapjwfttrgsometnwq.supabase.co/storage/v1/object/public/images-produit/focusrite-scarlett-2i2-4th-gen-main-1769876888992.png',
  },
  {
    slug: 'preamplis',
    label: 'Préamplis & Gain',
    reference: 'Cloudlifter CL-1',
    image: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_32/320773/16370363_800.jpg',
  },
  {
    slug: 'casques-studio',
    label: 'Casques studio',
    reference: 'DT 770 Pro',
    image: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_17/174334/18443592_800.jpg',
  },
  {
    slug: 'enceintes',
    label: 'Enceintes monitoring',
    reference: 'Mackie CR3.5',
    image: 'https://oxzapjwfttrgsometnwq.supabase.co/storage/v1/object/public/images-produit/mackie-cr3-x-gallery-1769881670870.png',
  },
  {
    slug: 'bras-articules',
    label: 'Bras articulés',
    reference: 'K&M Studio',
    image: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_22/228455/16390989_800.jpg',
  },
  {
    slug: 'traitement-acoustique',
    label: 'Acoustique',
    reference: 'Hofa Absorber',
    image: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_61/618030/20659157_800.jpg',
  },
  {
    slug: 'cable-xlr',
    label: 'Câbles XLR',
    reference: 'the sssnake SM6',
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
      className="w-full bg-[#f2ebdf] border-b border-[#e2d8c9] pt-24 sm:pt-28 pb-4"
    >
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-16">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
            <h2 className="text-[13px] font-bold text-[#0F0F0F] tracking-tight">
              Explorer par catégorie
            </h2>
            <span className="hidden sm:inline text-[11px] text-[#0F0F0F]/45 font-mono">
              / Équipements de référence
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/categorie/audio"
              className="text-[11px] font-mono uppercase tracking-wider text-[#0F0F0F]/65 hover:text-primary transition-colors inline-flex items-center gap-1.5"
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
                  'w-7 h-7 rounded-full border border-[#0F0F0F]/15 flex items-center justify-center transition-all',
                  canScrollLeft
                    ? 'text-[#0F0F0F] hover:border-primary hover:text-primary hover:bg-white/60 cursor-pointer'
                    : 'text-[#0F0F0F]/20 border-[#0F0F0F]/8 cursor-default'
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
                  'w-7 h-7 rounded-full border border-[#0F0F0F]/15 flex items-center justify-center transition-all',
                  canScrollRight
                    ? 'text-[#0F0F0F] hover:border-primary hover:text-primary hover:bg-white/60 cursor-pointer'
                    : 'text-[#0F0F0F]/20 border-[#0F0F0F]/8 cursor-default'
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
                  'bg-white border border-[#e4d9cb] hover:border-primary/70',
                  'shadow-[0_2px_8px_rgba(15,15,15,0.03)] hover:shadow-[0_10px_24px_-4px_rgba(211,178,123,0.22)]',
                  'transition-all duration-200 hover:-translate-y-1 snap-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary'
                )}
              >
                {/* Product photo frame with pedestal effect */}
                <div className="relative w-full aspect-square rounded-xl bg-[#faf7f2] border border-[#eee6db] flex items-center justify-center p-2 overflow-hidden group-hover:border-primary/40 transition-colors">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Category label */}
                <span className="mt-2.5 text-[12px] font-bold text-[#0F0F0F] text-center leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                  {cat.label}
                </span>

                {/* Reference model pill */}
                <span className="mt-1 text-[10px] font-mono text-[#0F0F0F]/45 text-center uppercase tracking-wider group-hover:text-[#0F0F0F]/75 transition-colors line-clamp-1">
                  {cat.reference}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
