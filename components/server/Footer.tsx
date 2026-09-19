'use client'

import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'

/* ─── DATA ───────────────────────────────────────────────── */
const UNIVERSE_LINKS = [
  { label: 'Studio & Son',          href: '/categorie/audio' },
  { label: 'Micros Dynamiques',     href: '/categorie/micros-dynamiques' },
  { label: 'Micros Condensateurs',  href: '/categorie/micros-condensateurs' },
  { label: 'Micros USB',            href: '/categorie/micros-usb' },
  { label: 'Interfaces Audio',      href: '/categorie/cartes-son' },
  { label: 'Casques Studio',        href: '/categorie/casques-studio' },
  { label: 'Traitement Acoustique', href: '/categorie/traitement-acoustique' },
]

const RESOURCES_LINKS = [
  { label: 'Tous les guides',       href: '/guides' },
  { label: 'Micro podcast & YouTube', href: '/guide/meilleur-micro-podcast-2026' },
  { label: 'XLR vs USB',            href: '/guide/xlr-vs-usb' },
  { label: 'Choisir son casque',    href: '/guide/meilleur-casque-studio-home-studio-2026' },
  { label: 'Top interfaces',        href: '/guide/top-5-interfaces' },
  { label: 'Notre méthodologie',    href: '/methodologie' },
  { label: "L'Atelier Fluxlab",     href: '/configurateur' },
]

const LEGAL_LINKS = [
  { label: 'Mentions légales',  href: '/mentions-legales' },
  { label: 'Confidentialité',   href: '/confidentialite' },
  { label: 'CGU',               href: '/cgu' },
  { label: 'Administration',    href: '/admin' },
]

/* ─── SUB-COMPONENTS ─────────────────────────────────────── */
function FooterLinkList({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="space-y-3.5" role="list">
      {links.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            className="text-[14px] text-white/75 font-normal hover-rule hover:text-white transition-colors"
          >
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

/* ─── NEWSLETTER FORM ────────────────────────────────────── */
function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) {
        (window as any).gtag?.('event', 'newsletter_signup', { location: 'footer' })
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-[18px] text-primary font-light">
        Parfait — vous recevrez le prochain guide.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" aria-label="Inscription newsletter">
      <div className={cn(
        'flex items-stretch gap-3 border-b pb-3 transition-colors',
        status === 'error' ? 'border-red-400/60' : 'border-white/20 focus-within:border-primary'
      )}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@studio.fr"
          required
          className="flex-1 min-w-0 bg-transparent text-[18px] text-white placeholder:text-white/30 font-light outline-none"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-foreground text-[12px] font-medium uppercase tracking-wider hover:bg-primary-hover transition-colors disabled:opacity-60"
        >
          {status === 'loading' ? '…' : "S'inscrire"}
          {status !== 'loading' && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          )}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-[11px] text-red-400">Une erreur s&apos;est produite, réessayez.</p>
      )}
      <p className="text-[12px] text-white/60 font-normal max-w-md">
        En vous inscrivant, vous acceptez notre{' '}
        <Link href="/confidentialite" className="hover-rule text-white/80">politique de confidentialité</Link>.
        Désabonnement en un clic.
      </p>
    </form>
  )
}

/* ─── FOOTER ─────────────────────────────────────────────── */
export function Footer() {
  return (
    <footer className="relative bg-deep text-white overflow-hidden grain">
      {/* Halo décoratif */}
      <div
        className="absolute -top-32 right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(211,178,123,.10) 0%,transparent 60%)', filter: 'blur(40px)' }}
        aria-hidden
      />

      <div className="relative z-10 max-w-layout mx-auto px-6 lg:px-16">

        {/* ── Newsletter ─────────────────────────────────────── */}
        <div className="border-b border-white/10 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="col-span-12 lg:col-span-4">
              <p className="frame-label text-primary mb-3">Le carnet Fluxlab</p>
              <p className="text-[22px] font-serif italic text-white/90 leading-snug mb-2">
                Le setup parfait, une fois par mois.
              </p>
              <p className="text-[14px] text-white/70 font-normal">
                Guides exclusifs, bons plans matériel, nouvelles de l&apos;Atelier.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-7 lg:col-start-6">
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* ── Main grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 gap-y-10 md:gap-10 pt-16 pb-14">

          {/* Brand */}
          <div className="col-span-12 lg:col-span-4">
            <Link href="/" className="inline-flex items-center mb-6" aria-label="Fluxlab — Accueil">
              <svg viewBox="0 0 188 36" width="160" height="31" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <text x="0" y="29" fontFamily="var(--font-switzer),system-ui,sans-serif" fontWeight="800" fontStyle="italic" fontSize="30" fill="#FAFAFA" letterSpacing="-0.5">Flux</text>
                <line x1="82" y1="5" x2="82" y2="32" stroke="#D3B27B" strokeWidth="1.5"/>
                <text x="89" y="28" fontFamily="'JetBrains Mono',monospace" fontWeight="600" fontSize="15" fill="rgba(250,250,250,.85)" letterSpacing="2">lab</text>
              </svg>
            </Link>
            <p className="text-[15px] text-white/75 leading-[1.65] font-normal max-w-[340px] mb-8">
              La plateforme de référence pour configurer votre studio audio &amp; son.
              Indépendante, exigeante, française.
            </p>

            {/* Trust signals */}
            <ul className="space-y-2.5 text-[12px] font-mono text-white/70 mb-10" role="list">
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                Avis vérifiés multi-marchands (Thomann, Amazon...)
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                Données techniques constructeurs contrôlées
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                0 produit sponsorisé · 100% impartial
              </li>
            </ul>

            {/* Réseaux sociaux — décommenter quand les comptes sont actifs
            <p className="frame-label text-white/45 mb-4">Suivre l&apos;atelier</p>
            <div className="flex items-center gap-2">
              <a href="https://www.instagram.com/the_fluxlab" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-primary hover:border-primary/60 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
            </div>
            */}
          </div>

          {/* Universe */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2 lg:col-start-6">
            <p className="frame-label text-primary mb-6">Univers</p>
            <FooterLinkList links={UNIVERSE_LINKS} />
            <Link
              href="/configurateur"
              className="mt-4 pt-4 border-t border-white/10 inline-flex items-center gap-2 text-primary font-medium text-[13px] tracking-wide hover-rule"
            >
              L’Atelier Fluxlab
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {/* Resources */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2">
            <p className="frame-label text-primary mb-6">Ressources</p>
            <FooterLinkList links={RESOURCES_LINKS} />
          </div>

          {/* Legal */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2">
            <p className="frame-label text-primary mb-6">Légal</p>
            <FooterLinkList links={LEGAL_LINKS} />
          </div>
        </div>

        {/* ── Transparence ───────────────────────────────────── */}
        <div className="py-10 border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            <div className="col-span-12 lg:col-span-3">
              <p className="frame-label text-primary">Transparence</p>
            </div>
            <div className="col-span-12 lg:col-span-9">
              <p className="text-[13px] text-white/70 leading-[1.75] font-normal max-w-[800px]">
                Fluxlab est un comparateur audio indépendant. Les avis sont directement agrégés auprès d&apos;acheteurs vérifiés des plateformes partenaires{' '}
                <span className="font-mono text-white/85">(Amazon · Thomann · Woodbrass)</span>.
                Nous participons à leurs programmes d&apos;affiliation : un achat via nos liens peut nous faire percevoir une commission,{' '}
                <em className="not-italic text-white/90">sans aucun surcoût pour vous</em>.
                Cette indépendance garantit des comparaisons objectives et un configurateur sans parti pris ni produit sponsorisé.
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────── */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-mono text-white/45 tracking-wider uppercase">
            © {new Date().getFullYear()} Fluxlab — Tous droits réservés.
          </p>
        </div>

        {/* ── Wordmark ───────────────────────────────────────── */}
        <div className="pt-4 pb-10 overflow-hidden" aria-hidden>
          <p
            className="font-serif italic text-white/[0.04] tracking-tighter leading-none whitespace-nowrap select-none"
            style={{ fontSize: 'clamp(8rem,18vw,22rem)', margin: '0 -2vw' }}
          >
            Fluxlab — pour votre création.
          </p>
        </div>

      </div>
    </footer>
  )
}
