'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Search, Menu, Close } from '@/components/FluxlabIcons'

/* ─── INLINE SEARCH (dans la navbar) ────────────────────── */
type Hit = { slug: string; name: string; price: number; image_url: string | null; brand: string | null }

function NavSearch({ isTransparent, onClose }: { isTransparent: boolean; onClose: () => void }) {
  const [query, setQuery]     = useState('')
  const [hits, setHits]       = useState<Hit[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef  = useRef<HTMLInputElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router    = useRouter()

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    const onOut  = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) onClose()
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onOut)
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onOut) }
  }, [onClose])

  const doSearch = async (q: string) => {
    if (q.trim().length < 2) { setHits([]); setLoading(false); return }
    setLoading(true)
    try {
      const res  = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)
      const data = await res.json()
      setHits(Array.isArray(data) ? data : [])
    } catch { setHits([]) }
    finally   { setLoading(false) }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setQuery(v)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => doSearch(v), 220)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim().length < 1) return
    onClose()
    router.push(`/recherche?q=${encodeURIComponent(query.trim())}`)
  }

  const tc = isTransparent ? 'text-white' : 'text-foreground'
  const bc = isTransparent ? 'border-white/30 focus:border-primary/70' : 'border-border focus:border-primary'
  const pc = isTransparent ? 'placeholder-white/35' : 'placeholder-foreground/30'

  return (
    <div ref={wrapRef} className="relative flex items-center gap-2">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 220, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={handleChange}
            placeholder="Rechercher…"
            className={cn('w-full h-9 bg-transparent border-b text-[13px] px-2 focus:outline-none transition-colors', tc, bc, pc)}
          />
        </motion.div>
        {/* Bouton submit invisible — active Enter sur mobile */}
        <button type="submit" className="sr-only" aria-label="Lancer la recherche" />
      </form>

      <button type="button" onClick={onClose} aria-label="Fermer"
        className={cn('w-9 h-9 rounded-full border flex items-center justify-center transition-colors shrink-0',
          isTransparent ? 'border-white/15 text-white/70 hover:text-primary hover:border-primary/60' : 'border-border text-foreground/70 hover:text-primary hover:border-primary/60'
        )}>
        <Close size={13} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {(hits.length > 0 || loading) && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full right-0 mt-3 w-[340px] rounded-2xl overflow-hidden border border-border/60 shadow-[0_20px_50px_-10px_rgba(15,15,15,.18)] z-50 bg-white"
          >
            {loading && hits.length === 0 && (
              <div className="px-4 py-3 text-[12px] font-mono text-foreground/40">Recherche…</div>
            )}
            {hits.map(h => (
              <Link key={h.slug} href={`/produit/${h.slug}`} onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors border-t border-border/40 first:border-t-0 group">
                <div className="w-9 h-9 rounded-lg bg-secondary shrink-0 overflow-hidden flex items-center justify-center">
                  {h.image_url
                    ? <img src={h.image_url} alt="" className="w-full h-full object-contain p-1 mix-blend-multiply" loading="lazy" />
                    : <span className="text-foreground/20 text-[9px] font-mono">IMG</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-foreground font-medium truncate group-hover:text-primary transition-colors">{h.name}</p>
                  {h.brand && <p className="text-[11px] font-mono text-foreground/40">{h.brand}</p>}
                </div>
                {h.price > 0 && <span className="text-[12px] font-mono text-primary shrink-0">{h.price}€</span>}
              </Link>
            ))}
            {/* Lien "Voir tous les résultats" */}
            {hits.length > 0 && (
              <Link href={`/recherche?q=${encodeURIComponent(query)}`} onClick={onClose}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary/60 text-[11px] font-mono text-foreground/55 uppercase tracking-wider hover:text-primary transition-colors border-t border-border/40">
                Voir tous les résultats
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── LABO CTA (pill with dark circle arrow) ─────────────── */
/* ─── MOBILE SEARCH (dans le tiroir) ────────────────────── */
function MobileSearch({ onNavigate }: { onNavigate: () => void }) {
  const [query, setQuery]     = useState('')
  const [hits, setHits]       = useState<Hit[]>([])
  const [loading, setLoading] = useState(false)
  const timerRef              = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router                = useRouter()

  const doSearch = async (q: string) => {
    if (q.trim().length < 2) { setHits([]); setLoading(false); return }
    setLoading(true)
    try {
      const res  = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)
      const data = await res.json()
      setHits(Array.isArray(data) ? data : [])
    } catch { setHits([]) }
    finally   { setLoading(false) }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setQuery(v)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => doSearch(v), 220)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim().length < 1) return
    setHits([])
    onNavigate()
    router.push(`/recherche?q=${encodeURIComponent(query.trim())}`)
  }

  const handleSelect = (slug: string) => {
    setHits([])
    onNavigate()
    router.push(`/produit/${slug}`)
  }

  return (
    <div className="relative mb-6">
      <form onSubmit={submit} className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="search"
          value={query}
          onChange={handleChange}
          placeholder="Rechercher un produit…"
          className="w-full h-12 bg-white/5 border border-white/15 rounded-full pl-11 pr-4 text-[15px] text-white placeholder-white/35 focus:outline-none focus:border-primary/60 transition-colors"
        />
      </form>

      {/* Dropdown suggestions */}
      <AnimatePresence>
        {(hits.length > 0 || loading) && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_-10px_rgba(0,0,0,.6)] z-50"
            style={{ background: '#161616' }}
          >
            {loading && hits.length === 0 && (
              <div className="px-4 py-3 text-[12px] font-mono text-white/35">Recherche…</div>
            )}
            {hits.map(h => (
              <button
                key={h.slug}
                type="button"
                onClick={() => handleSelect(h.slug)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-t border-white/8 first:border-t-0 text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-white/8 shrink-0 overflow-hidden flex items-center justify-center">
                  {h.image_url
                    ? <img src={h.image_url} alt="" className="w-full h-full object-contain p-1" loading="lazy" />
                    : <span className="text-white/20 text-[9px] font-mono">IMG</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-white font-medium truncate">{h.name}</p>
                  {h.brand && <p className="text-[11px] font-mono text-white/35">{h.brand}</p>}
                </div>
                {h.price > 0 && <span className="text-[12px] font-mono text-primary shrink-0">{h.price}€</span>}
              </button>
            ))}
            {hits.length > 0 && (
              <button
                type="button"
                onClick={() => { setHits([]); onNavigate(); router.push(`/recherche?q=${encodeURIComponent(query)}`) }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[11px] font-mono text-white/40 uppercase tracking-wider hover:text-primary transition-colors border-t border-white/8"
              >
                Voir tous les résultats
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LaboButton({ className }: { className?: string }) {
  return (
    <Link
      href="/configurateur"
      className={cn(
        'group inline-flex items-center gap-2 h-10 pl-4 sm:pl-5 pr-2 rounded-full',
        'bg-primary text-foreground text-[12px] font-medium uppercase tracking-wider',
        'hover:bg-[#E0C28D] transition-colors',
        className
      )}
    >
      <span className="hidden sm:inline">Le Labo IA</span>
      <span className="sm:hidden">Labo</span>
      <span className="w-6 h-6 rounded-full bg-foreground text-primary flex items-center justify-center shrink-0">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
        </svg>
      </span>
    </Link>
  )
}

/* ─── LOGO ───────────────────────────────────────────────── */
function FluxlabLogo({ variant }: { variant: 'light' | 'dark' }) {
  // Bipartite — Flux (Georgia italic) | (gold line) lab (JetBrains Mono)
  const fluxColor = variant === 'dark' ? '#FAFAFA' : '#0F0F0F'
  const labColor  = variant === 'dark' ? 'rgba(250,250,250,.75)' : 'rgba(15,15,15,.65)'
  return (
    <Link href="/" className="flex items-center shrink-0" aria-label="Fluxlab — Accueil">
      <svg viewBox="0 0 188 36" width="141" height="27" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <text x="0" y="29" fontFamily="Georgia,serif" fontStyle="italic" fontSize="32" fill={fluxColor} letterSpacing="-0.5">Flux</text>
        <line x1="84" y1="5" x2="84" y2="32" stroke="#D3B27B" strokeWidth="1.5"/>
        <text x="91" y="28" fontFamily="'JetBrains Mono',monospace" fontSize="15" fill={labColor} letterSpacing="2">lab</text>
      </svg>
    </Link>
  )
}

/* ─── MEGA MENU DATA ─────────────────────────────────────── */
interface MenuItem {
  id: string
  label: string
  targetPage: string
  eyebrow: string
  columns: { num: string; title: string; items: { label: string; desc: string; slug: string }[] }[]
  promo: { title: string; titleItalic: string; desc: string; target: string }
}

const MENU_DATA: MenuItem[] = [
  {
    id: 'audio',
    label: 'Studio & Son',
    targetPage: '/categorie/audio',
    eyebrow: 'Micros · Interfaces · Casques · Accessoires',
    columns: [
      {
        num: '01', title: 'Microphones',
        items: [
          { label: 'Dynamiques',     desc: 'Pour la voix radio & podcast',   slug: 'micros-dynamiques' },
          { label: 'Condensateurs',  desc: 'Chant & détails sonores',        slug: 'micros-condensateurs' },
          { label: 'USB',            desc: 'Plug & play sans interface',     slug: 'micros-usb' },
          { label: 'Shotgun',        desc: 'Captation vidéo directionnelle', slug: 'micros-shotgun' },
        ],
      },
      {
        num: '02', title: 'Interfaces & monitoring',
        items: [
          { label: 'Cartes son USB',          desc: 'Scarlett, Audient, Motu',              slug: 'cartes-son' },
          { label: 'Préamplis & Cloudlifter', desc: 'Gain propre pour micros dynamiques',   slug: 'preamplis' },
          { label: 'Casques studio',          desc: 'Monitoring de précision',              slug: 'casques-studio' },
          { label: 'Enceintes',               desc: 'Écoute de référence',                  slug: 'enceintes' },
        ],
      },
      {
        num: '03', title: 'Accessoires',
        items: [
          { label: 'Bras articulés',        desc: 'Rode PSA1+, Elgato Wave',          slug: 'bras-articules' },
          { label: 'Câbles XLR',           desc: 'Haute qualité, blindés',            slug: 'cable-xlr' },
          { label: 'Traitement acoustique', desc: 'Mousses, panneaux, bass traps',    slug: 'traitement-acoustique' },
        ],
      },
    ],
    promo: { title: 'Composez votre studio', titleItalic: 'sur-mesure.', desc: "Notre IA combine micro, interface, casque et traitement selon votre voix, votre pièce et votre budget.", target: '/configurateur' },
  },
  {
    id: 'video',
    label: 'Image & Lumière',
    targetPage: '/categorie/video',
    eyebrow: 'Caméras · Éclairage · Objectifs',
    columns: [
      {
        num: '01', title: 'Caméras',
        items: [
          { label: 'Hybrides (Mirrorless)', desc: 'Sony Alpha, Canon R',   slug: 'hybrides-mirrorless' },
          { label: 'Webcams Pro',           desc: 'Elgato Facecam, Razer', slug: 'webcams-pro' },
          { label: 'Action Cams',           desc: 'GoPro, DJI',            slug: 'action-cams' },
        ],
      },
      {
        num: '02', title: 'Éclairage',
        items: [
          { label: 'Key Lights',     desc: 'Lumière principale',  slug: 'keylight' },
          { label: 'Softbox',        desc: 'Diffusion douce',     slug: 'softbox' },
          { label: 'RGB & Ambiance', desc: 'Tubes LED, Rubans',   slug: 'rgb-ambiance' },
        ],
      },
      {
        num: '03', title: 'Objectifs',
        items: [
          { label: 'Grand Angle',       desc: 'Pour le Vlogging', slug: 'grand-angle' },
          { label: 'Zooms Polyvalents', desc: 'Tout terrain',     slug: 'zoom-polyvalent' },
        ],
      },
    ],
    promo: { title: 'Configurez votre setup', titleItalic: 'vidéo.', desc: "Caméra, éclairage, objectif — notre IA choisit la meilleure combinaison pour votre style de contenu.", target: '/configurateur' },
  },
  {
    id: 'streaming',
    label: 'Streaming',
    targetPage: '/categorie/streaming',
    eyebrow: 'Setup live · Captation · Contrôle',
    columns: [
      {
        num: '01', title: 'Setup live',
        items: [
          { label: 'Fonds verts',      desc: 'Incrustation propre',           slug: 'fonds-verts' },
          { label: 'Téléprompteurs',   desc: 'Pour lire vos scripts',         slug: 'teleprompteurs' },
          { label: 'Cable Management', desc: 'Organisation & câblage',        slug: 'cable-management' },
        ],
      },
      {
        num: '02', title: 'Captation & régie',
        items: [
          { label: 'Stream Deck', desc: 'Contrôle total de votre régie', slug: 'stream-deck' },
        ],
      },
    ],
    promo: { title: 'Montez votre régie', titleItalic: 'live.', desc: "Définissez votre format de stream et laissez l'IA assembler la régie parfaite pour Twitch ou YouTube.", target: '/configurateur' },
  },
]

/* ─── NAVBAR ─────────────────────────────────────────────── */
export function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled]   = useState(false)
  const [activeMenu, setActiveMenu]   = useState<string | null>(null)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 20)
  })

  const handleMouseEnter = (menuId: string) => setActiveMenu(menuId)
  const handleMouseLeave = () => setActiveMenu(null)

  // Homepage and configurateur have dark hero — navbar starts transparent
  const isDarkHeroPage = pathname === '/' || pathname === '/configurateur'
  const isTransparent = isDarkHeroPage && !isScrolled && !activeMenu

  const navBg = isScrolled || activeMenu
    ? 'bg-white/90 backdrop-blur-md border-b border-border/70 shadow-[0_4px_20px_rgba(15,15,15,.04)]'
    : isTransparent
      ? ''
      : 'bg-background/95 backdrop-blur-sm border-b border-border/50'

  return (
    <motion.nav
      onMouseLeave={handleMouseLeave}
      className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', navBg)}
    >
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8">
        <div className={cn(
          'flex items-center justify-between transition-all duration-300',
          isScrolled || activeMenu ? 'py-4' : 'py-5'
        )}>

          {/* Logo */}
          <FluxlabLogo variant={isTransparent ? 'dark' : 'light'} />

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {MENU_DATA.map((menu) => {
              const isActive = pathname?.startsWith(menu.targetPage)
              return (
                <div
                  key={menu.id}
                  onMouseEnter={() => handleMouseEnter(menu.id)}
                  className="relative py-2 cursor-pointer"
                >
                  <Link
                    href={menu.targetPage}
                    className={cn(
                      'hover-rule text-[13px] font-medium tracking-wide transition-colors',
                      activeMenu === menu.id || isActive
                        ? 'text-primary font-semibold active'
                        : isTransparent
                          ? 'text-white/85 hover:text-white'
                          : 'text-foreground/85 hover:text-foreground'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {menu.label}
                  </Link>
                </div>
              )
            })}

            <span className={cn('block w-px h-4', isTransparent ? 'bg-white/15' : 'bg-border')} aria-hidden />

            <div className="relative py-2">
              <Link
                href="/guides"
                className={cn(
                  'hover-rule text-[13px] font-medium tracking-wide transition-colors',
                  pathname?.startsWith('/guides')
                    ? 'text-primary font-semibold active'
                    : isTransparent
                      ? 'text-white/85 hover:text-white'
                      : 'text-foreground/85 hover:text-foreground'
                )}
              >
                Guides &amp; Tutos
              </Link>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {isSearchOpen ? (
                <NavSearch
                  key="search-open"
                  isTransparent={isTransparent}
                  onClose={() => setIsSearchOpen(false)}
                />
              ) : (
                <motion.button
                  key="search-btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  type="button"
                  aria-label="Rechercher"
                  onClick={() => setIsSearchOpen(true)}
                  className={cn(
                    'hidden lg:flex w-10 h-10 rounded-full border items-center justify-center transition-colors',
                    isTransparent
                      ? 'border-white/15 text-white/70 hover:text-primary hover:border-primary/60'
                      : 'border-border text-foreground/70 hover:text-primary hover:border-primary/60'
                  )}
                >
                  <Search size={15} />
                </motion.button>
              )}
            </AnimatePresence>

            <LaboButton />

            <button
              type="button"
              aria-label={isMobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              className={cn(
                'lg:hidden w-9 h-9 rounded-full border flex items-center justify-center transition-colors',
                isMobileOpen
                  ? 'bg-primary border-primary text-foreground'
                  : isTransparent
                    ? 'border-white/15 text-white/85'
                    : 'border-border text-foreground/70'
              )}
              onClick={() => setIsMobileOpen((v) => !v)}
            >
              {isMobileOpen ? <Close size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── MEGA MENU ──────────────────────────────────── */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="hidden lg:block absolute top-full left-0 w-full bg-white shadow-[0_30px_60px_-20px_rgba(15,15,15,.15)]"
          >
            {MENU_DATA.map((menu) => {
              if (menu.id !== activeMenu) return null
              return (
                <div key={menu.id} className="max-w-[1600px] mx-auto px-8 pt-6 pb-12">

                  {/* Eyebrow */}
                  <div className="flex items-baseline justify-between mb-10">
                    <div className="flex items-center gap-3">
                      <span className="block w-8 h-px bg-primary" aria-hidden />
                      <p className="frame-label text-primary">{menu.label}</p>
                      <span className="text-[12px] text-muted-foreground">/ {menu.eyebrow}</span>
                    </div>
                    <Link
                      href={menu.targetPage}
                      onClick={() => setActiveMenu(null)}
                      className="text-[12px] font-mono uppercase tracking-wider text-foreground/70 hover:text-primary inline-flex items-center gap-2 transition-colors"
                    >
                      Voir tout l&apos;univers
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                      </svg>
                    </Link>
                  </div>

                  <div className="grid grid-cols-12 gap-8">
                    {/* Columns */}
                    {menu.columns.map((col) => (
                      <div key={col.num} className={`${menu.columns.length === 2 ? 'col-span-4' : 'col-span-3'} space-y-5`}>
                        <p className="frame-label text-foreground/60 flex items-center gap-2">
                          <span className="font-mono text-primary">{col.num}</span>
                          <span>{col.title}</span>
                        </p>
                        <ul className="space-y-3">
                          {col.items.map((item) => (
                            <li key={item.slug}>
                              <Link
                                href={`/categorie/${item.slug}`}
                                onClick={() => setActiveMenu(null)}
                                className="group block"
                              >
                                <div className="font-serif text-[15px] text-foreground group-hover:text-primary transition-colors">
                                  {item.label}
                                </div>
                                <div className="text-[12px] text-muted-foreground mt-0.5">
                                  {item.desc}
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {/* Promo card — dark studio style */}
                    <div className={`col-span-3 ${menu.columns.length === 2 ? 'col-start-9' : 'col-start-10'}`}>
                      <Link
                        href={menu.promo.target}
                        onClick={() => setActiveMenu(null)}
                        className="group block relative h-full min-h-[280px] rounded-2xl overflow-hidden border border-white/10 hover:border-primary/40 transition-colors"
                        style={{
                          background: `
                            radial-gradient(ellipse 70% 60% at 75% 30%, rgba(211,178,123,.15) 0%, transparent 60%),
                            #0A0A0A
                          `
                        }}
                      >
                        {/* Halo */}
                        <div
                          className="absolute -top-10 -right-10 w-[200px] h-[200px] rounded-full pointer-events-none"
                          style={{ background: 'radial-gradient(circle, rgba(211,178,123,.4) 0%, transparent 60%)', filter: 'blur(20px)' }}
                          aria-hidden
                        />
                        <div className="relative z-10 p-6 h-full flex flex-col">
                          <p className="frame-label text-primary mb-4">Le Labo Fluxlab</p>
                          <h4 className="font-serif text-white text-[22px] leading-[1.15] mb-3">
                            {menu.promo.title}<br />
                            <span className="italic text-primary">{menu.promo.titleItalic}</span>
                          </h4>
                          <p className="text-[12px] text-white/55 leading-[1.55] font-light mb-auto">
                            {menu.promo.desc}
                          </p>
                          <div className="mt-5 inline-flex items-center gap-2 text-[11px] font-mono text-primary uppercase tracking-wider">
                            <span className="group-hover:translate-x-1 transition-transform">Lancer le configurateur</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                            </svg>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOBILE DRAWER ─────────────────────────────── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100dvh' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed top-[64px] left-0 w-full z-40 overflow-y-auto grain"
            style={{ background: '#0A0A0A' }}
          >
            <div className="px-6 pt-6 pb-20">
              {/* Recherche */}
              <MobileSearch onNavigate={() => setIsMobileOpen(false)} />

              <p className="frame-label text-primary mb-6 flex items-center gap-2">
                <span className="block w-5 h-px bg-primary" aria-hidden />
                Univers
              </p>

              {/* Category links */}
              <ul className="space-y-1 mb-6">
                {[
                  { label: 'Studio & Son',    href: '/categorie/audio' },
                  { label: 'Image & Lumière', href: '/categorie/video' },
                  { label: 'Streaming',       href: '/categorie/streaming' },
                  { label: 'Guides & Tutos',  href: '/guides' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center justify-between py-3 border-b border-white/10 group"
                    >
                      <span className="font-serif text-white text-[20px] group-hover:text-primary transition-colors">
                        {item.label}
                      </span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/25 group-hover:text-primary transition-colors" aria-hidden><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Labo promo card — dark */}
              <Link
                href="/configurateur"
                onClick={() => setIsMobileOpen(false)}
                className="block relative rounded-xl border border-primary/40 overflow-hidden p-5 mb-5"
                style={{ background: '#0A0A0A' }}
              >
                <div
                  className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(211,178,123,.35) 0%, transparent 60%)', filter: 'blur(16px)' }}
                  aria-hidden
                />
                <p className="frame-label text-primary mb-2 relative z-10">Le Labo Fluxlab</p>
                <p className="font-serif text-white text-[18px] leading-[1.2] mb-3 relative z-10">
                  Composez votre studio <span className="italic text-primary">sur-mesure.</span>
                </p>
                <span className="inline-flex items-center gap-2 text-[11px] font-mono text-primary uppercase tracking-wider relative z-10">
                  Lancer
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </span>
              </Link>

              {/* Legal */}
              <div className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-wider">
                <Link href="/mentions-legales" onClick={() => setIsMobileOpen(false)} className="hover:text-white/70 transition-colors">Mentions</Link>
                <span>·</span>
                <Link href="/confidentialite" onClick={() => setIsMobileOpen(false)} className="hover:text-white/70 transition-colors">Confidentialité</Link>
                <span>·</span>
                <Link href="/a-propos" onClick={() => setIsMobileOpen(false)} className="hover:text-white/70 transition-colors">Contact</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
