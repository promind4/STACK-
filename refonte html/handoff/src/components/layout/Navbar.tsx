'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Search, Menu, Close } from '../FluxlabIcons'
import { LaboButton } from '../ui/Button'
import type { NavLink } from '@/types/fluxlab'

/* ─── DEFAULT NAV LINKS ──────────────────────────────────── */
export const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: 'Studio & Son',      href: '/categorie/audio' },
  { label: 'Image & Lumière',   href: '/categorie/video' },
  { label: 'Streaming',         href: '/categorie/streaming' },
  { label: 'Guides & Tutos',    href: '/guides' },
]

/* ─── LOGO ───────────────────────────────────────────────── */
function FluxlabLogo({ variant }: { variant: 'light' | 'dark' }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0">
      <span className={cn(
        'inline-flex items-center justify-center w-9 h-9 border rounded-md',
        'font-serif italic text-[20px] leading-none text-primary',
        variant === 'light' ? 'border-primary' : 'border-primary/60'
      )}>
        F
      </span>
      <span className={cn(
        'font-serif text-[22px] tracking-tight',
        variant === 'light' ? 'text-foreground' : 'text-white'
      )}>
        Fluxlab
      </span>
    </Link>
  )
}

/* ─── PROPS ──────────────────────────────────────────────── */
export interface NavbarProps {
  links?: NavLink[]
  activeHref?: string
  /** Force the scrolled (white) appearance regardless of scroll position */
  forceScrolled?: boolean
}

/* ─── COMPONENT ──────────────────────────────────────────── */
export function Navbar({
  links = DEFAULT_NAV_LINKS,
  activeHref,
  forceScrolled = false,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(forceScrolled)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (forceScrolled) return
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [forceScrolled])

  const isScrolled = forceScrolled || scrolled

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-border/70 shadow-nav'
          : ''
      )}
    >
      <div className="max-w-layout mx-auto px-8 py-4 flex items-center justify-between gap-8">

        {/* Logo */}
        <FluxlabLogo variant={isScrolled ? 'light' : 'dark'} />

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Navigation principale">
          {links.map((link, i) => {
            const isActive = link.isActive ?? link.href === activeHref
            const isSep = i === links.length - 2  // separator before last item
            return (
              <>
                {isSep && (
                  <span
                    key={`sep-${i}`}
                    className={cn(
                      'block w-px h-4',
                      isScrolled ? 'bg-border' : 'bg-white/15'
                    )}
                    aria-hidden
                  />
                )}
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'hover-rule text-[13px] font-medium tracking-wide transition-colors',
                    isActive
                      ? 'text-primary font-semibold active'
                      : isScrolled
                        ? 'text-foreground/85 hover:text-foreground'
                        : 'text-white/85 hover:text-white'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </>
            )
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button
            type="button"
            aria-label="Rechercher"
            className={cn(
              'w-10 h-10 rounded-full border flex items-center justify-center transition-colors',
              isScrolled
                ? 'border-border text-foreground/70 hover:text-primary hover:border-primary/60'
                : 'border-white/15 text-white/70 hover:text-primary hover:border-primary/60'
            )}
          >
            <Search size={15} />
          </button>

          {/* Labo IA CTA */}
          <LaboButton />

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
            className={cn(
              'lg:hidden w-10 h-10 rounded-full border flex items-center justify-center transition-colors',
              isScrolled
                ? 'border-border text-foreground/70'
                : 'border-white/15 text-white/70'
            )}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <Close size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <nav
          className={cn(
            'lg:hidden border-t px-8 py-6 flex flex-col gap-5',
            isScrolled
              ? 'bg-white/95 backdrop-blur-md border-border'
              : 'bg-deep/95 backdrop-blur-md border-white/10'
          )}
          aria-label="Menu mobile"
        >
          {links.map((link) => {
            const isActive = link.isActive ?? link.href === activeHref
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'font-serif text-[20px] tracking-tight transition-colors',
                  isActive
                    ? 'text-primary italic'
                    : isScrolled
                      ? 'text-foreground hover:text-primary'
                      : 'text-white hover:text-primary'
                )}
              >
                {link.label}
              </Link>
            )
          })}
          <LaboButton className="w-fit mt-2" />
        </nav>
      )}
    </header>
  )
}
