import Link from 'next/link'
import { Waveform } from '../FluxlabIcons'

/* ─── DATA ───────────────────────────────────────────────── */
const UNIVERSE_LINKS = [
  { label: 'Studio & Son',        href: '/categorie/audio' },
  { label: 'Image & Lumière',     href: '/categorie/video' },
  { label: 'Streaming Live',      href: '/categorie/streaming' },
  { label: 'Micros Dynamiques',   href: '/categorie/micros-dynamiques' },
  { label: 'Micros USB',          href: '/categorie/micros-usb' },
  { label: 'Interfaces Audio',    href: '/categorie/interfaces-audio' },
]

const RESOURCES_LINKS = [
  { label: 'Tous les guides',     href: '/guides' },
  { label: 'XLR vs USB',         href: '/guides/xlr-vs-usb' },
  { label: 'Choisir son casque',  href: '/guides/casques' },
  { label: 'Top interfaces',      href: '/guides/interfaces-audio' },
  { label: 'Notre méthodologie',  href: '/methodologie' },
]

const LEGAL_LINKS = [
  { label: 'Mentions légales',    href: '/mentions-legales' },
  { label: 'Confidentialité',     href: '/confidentialite' },
  { label: 'CGU',                 href: '/cgu' },
  { label: 'Contact',             href: '/contact' },
]

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
        <path d="m10 15 5-3-5-3z"/>
      </svg>
    ),
  },
]

/* ─── SUB-COMPONENTS ─────────────────────────────────────── */
function FooterLinkList({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="space-y-3.5" role="list">
      {links.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            className="text-[13px] text-white/65 font-light hover-rule hover:text-white/90 transition-colors"
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
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-4"
      aria-label="Inscription newsletter"
    >
      <label className="frame-label text-white/45 sr-only" htmlFor="footer-email">
        Votre adresse e-mail
      </label>
      <div className="flex items-stretch gap-3 border-b border-white/20 pb-3 focus-within:border-primary transition-colors">
        <input
          id="footer-email"
          type="email"
          placeholder="vous@studio.fr"
          required
          className="flex-1 bg-transparent text-[18px] text-white placeholder:text-white/30 font-light outline-none"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-foreground text-[12px] font-medium uppercase tracking-wider hover:bg-primary-hover transition-colors"
        >
          S&apos;inscrire
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </button>
      </div>
      <p className="text-[11px] text-white/35 font-light max-w-md">
        En vous inscrivant, vous acceptez notre{' '}
        <Link href="/confidentialite" className="hover-rule text-white/55">
          politique de confidentialité
        </Link>
        .
      </p>
    </form>
  )
}

/* ─── FOOTER ─────────────────────────────────────────────── */
export function Footer() {
  return (
    <footer className="relative bg-deep text-white overflow-hidden grain">
      {/* Halo */}
      <div
        className="absolute -top-32 right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(211,178,123,.10) 0%,transparent 60%)', filter: 'blur(40px)' }}
        aria-hidden
      />

      <div className="relative z-10 max-w-layout mx-auto px-10 lg:px-16">

        {/* ── Newsletter ────────────────────────────────────── */}
        <div className="grid grid-cols-12 gap-10 pt-24 pb-20 border-b border-white/10">
          <div className="col-span-12 lg:col-span-6">
            <p className="frame-label text-primary mb-5 flex items-center gap-3">
              <span className="block w-8 h-px bg-primary" aria-hidden />
              La Gazette du Labo
            </p>
            <h2 className="font-serif text-white text-[40px] md:text-[52px] leading-[1.05] tracking-tight mb-6">
              Recevez nos meilleurs<br/>
              <span className="italic text-primary">guides &amp; tests</span>, chaque mois.
            </h2>
            <p className="text-[15px] text-white/55 leading-[1.55] font-light max-w-[500px]">
              Une newsletter dense et soignée — pas de spam, désabonnement en un clic.
              Rejoignez 2&nbsp;400 créateurs.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:pl-12 flex flex-col justify-end">
            <NewsletterForm />
          </div>
        </div>

        {/* ── Main grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-12 gap-10 pt-20 pb-14">

          {/* Brand */}
          <div className="col-span-12 lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <span className="inline-flex items-center justify-center w-10 h-10 border border-primary/60 rounded-md font-serif italic text-primary text-[22px] leading-none">
                F
              </span>
              <span className="font-serif text-white text-[28px] tracking-tight">Fluxlab</span>
            </Link>
            <p className="text-[14px] text-white/55 leading-[1.65] font-light max-w-[340px] mb-8">
              La plateforme de référence pour configurer votre studio créatif — audio, vidéo, streaming.
              Indépendante, exigeante, française.
            </p>

            {/* Trust signals */}
            <ul className="space-y-3 text-[12px] font-mono text-white/50 mb-10" role="list">
              <li className="flex items-center gap-3">
                <span className="block w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 8px rgba(74,222,128,.5)' }} />
                Prix mis à jour il y a 2 min
              </li>
              <li className="flex items-center gap-3 pl-4">
                <span className="text-primary">·</span>
                128 produits testés en studio
              </li>
              <li className="flex items-center gap-3 pl-4">
                <span className="text-primary">·</span>
                0 produit sponsorisé
              </li>
            </ul>

            {/* Social */}
            <p className="frame-label text-white/45 mb-4">Suivre l&apos;atelier</p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-primary hover:border-primary/60 transition-colors"
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Universe */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2 lg:col-start-6">
            <p className="frame-label text-primary mb-6">Univers</p>
            <FooterLinkList links={UNIVERSE_LINKS} />
            <Link
              href="/configurateur"
              className="mt-4 pt-4 border-t border-white/10 inline-flex items-center gap-2 text-primary font-medium text-[13px] tracking-wide hover-rule"
            >
              Le Labo IA
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

        {/* ── Transparency disclaimer ───────────────────────── */}
        <div className="py-10 border-t border-white/10">
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 lg:col-span-3">
              <p className="frame-label text-primary">Transparence</p>
            </div>
            <div className="col-span-12 lg:col-span-9">
              <p className="text-[12px] text-white/50 leading-[1.75] font-light max-w-[800px]">
                Fluxlab participe à des programmes d&apos;affiliation{' '}
                <span className="font-mono text-white/70">(Amazon · Thomann · Woodbrass · Bax-Shop)</span>
                . Un achat via nos liens nous fait percevoir une commission,{' '}
                <em className="not-italic text-white/75">sans surcoût pour vous</em>.
                Cela finance nos tests indépendants et la mise à jour quotidienne des prix.
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────── */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-mono text-white/45 tracking-wider uppercase">
            © {new Date().getFullYear()} Fluxlab — Édité avec exigence à Paris.
          </p>
          <div className="flex items-center gap-6 text-[11px] font-mono text-white/40">
            <span className="flex items-center gap-2">
              <span className="block w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 8px rgba(74,222,128,.5)' }} />
              Statut : opérationnel
            </span>
            <span className="hidden md:inline text-white/20">·</span>
            <span className="hidden md:inline">v 2.1.0</span>
          </div>
        </div>

        {/* ── Wordmark ──────────────────────────────────────── */}
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
