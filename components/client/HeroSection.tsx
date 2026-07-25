'use client';

import Link from 'next/link';
import Image from 'next/image';

const CHALLENGES = [
  { num: '01', label: 'Mon espace est bruyant',  labelMobile: 'Espace bruyant',  href: '/categorie/espace-bruyant' },
  { num: '02', label: 'Je veux du plug & play',  labelMobile: 'Plug & play',     href: '/categorie/plug-and-play' },
  { num: '03', label: 'Budget serré (< 200€)',   labelMobile: '< 200 €',         href: '/categorie/petit-budget' },
  { num: '04', label: 'Je crée en déplacement',  labelMobile: 'Nomade',          href: '/categorie/createur-nomade' },
];

const TRUST = [
  {
    label: 'Sélection experte',
    sub: 'Testé en studio',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D3B27B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7 9 18l-5-5"/>
      </svg>
    ),
  },
  {
    label: 'Prix temps réel',
    sub: 'Multi-boutiques',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D3B27B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
      </svg>
    ),
  },
  {
    label: 'Compatibilité',
    sub: 'Vérifiée à chaque ajout',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D3B27B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h18"/><path d="M12 3v18"/><circle cx="12" cy="12" r="9"/>
      </svg>
    ),
  },
  {
    label: 'Indépendance',
    sub: 'Aucun sponsor',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D3B27B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4Z"/>
      </svg>
    ),
  },
];

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
    >
      {/* Image de fond HERO1 */}
      <Image
        src="/images/hero1.webp"
        alt="Studio créatif Fluxlab — setup audio vidéo streaming"
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
        quality={90}
      />

      {/* Overlay sombre pour lisibilité du texte */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, rgba(10,10,10,.78) 0%, rgba(10,10,10,.45) 55%, rgba(10,10,10,.2) 100%),
            linear-gradient(to bottom, rgba(10,10,10,.35) 0%, transparent 25%, transparent 70%, rgba(10,10,10,.55) 100%)
          `
        }}
        aria-hidden
      />

      {/* Halo or subtil */}
      <div
        className="absolute -top-32 right-[-8%] w-[600px] h-[600px] rounded-full pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(circle, rgba(211,178,123,.2) 0%, transparent 65%)', filter: 'blur(30px)' }}
        aria-hidden
      />

      <div className="relative z-10 max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-16 pt-32 pb-20 min-h-[90vh] flex flex-col">

        {/* Eyebrow row */}
        <div className="flex items-center justify-between mb-16 pt-10">
          <div className="flex items-center gap-3">
            <span className="block w-8 h-px bg-primary" aria-hidden />
            <span className="frame-label text-primary">Le Labo Fluxlab — N° 01</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[11px] font-mono text-white/45">
            <span>Audio</span>
            <span className="text-white/20">/</span>
            <span>Vidéo</span>
            <span className="text-white/20">/</span>
            <span>Streaming</span>
          </div>
        </div>

        {/* 12-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center flex-1">

          {/* Copy — pleine largeur maintenant que l'image est en fond */}
          <div className="lg:col-span-8 max-w-[820px]">

            <h1 className="font-serif text-white tracking-tight leading-[1.02] sm:leading-[0.98] text-[38px] sm:text-[56px] md:text-[72px] lg:text-[88px] mb-8">
              Trouvez enfin<br />
              le setup parfait<br />
              <span className="animate-gradient-text italic font-normal">pour votre création.</span>
            </h1>

            <p className="text-[18px] md:text-[20px] text-white/65 leading-[1.55] font-light max-w-[560px] mb-12">
              Comparez les prix des meilleures boutiques, vérifiez la compatibilité de votre matériel et laissez notre configurateur IA vous guider vers le setup idéal.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link
                href="/configurateur"
                className="group inline-flex items-center justify-center gap-3 h-14 px-8 rounded-full bg-primary text-foreground font-medium text-[14px] tracking-wide uppercase transition-all hover:shadow-btn hover:bg-primary-hover"
              >
                <span>Trouver mon setup idéal en 2 min</span>
                <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </Link>

              <Link
                href="/categorie/audio"
                className="group inline-flex items-center justify-center gap-3 h-14 px-8 rounded-full border border-white/20 text-white text-[14px] tracking-wide uppercase font-medium transition-all hover:bg-white/5 hover:border-white/40"
              >
                <span>Voir les produits</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden>
                  <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
                </svg>
              </Link>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6 max-w-[640px] pt-10 border-t border-white/10">
              {TRUST.map((t) => (
                <div key={t.label} className="flex flex-col gap-2">
                  {t.icon}
                  <span className="text-[12px] text-white font-medium tracking-wide">{t.label}</span>
                  <span className="text-[11px] text-white/45 leading-snug">{t.sub}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Challenge bubbles */}
        <div className="relative z-10 mt-12 pt-10 border-t border-white/10">
          <div className="flex items-center justify-between mb-5">
            <span className="frame-label text-white/55">Diagnostic rapide — par contrainte</span>
            <span className="text-[11px] font-mono text-white/35">04 entrées</span>
          </div>
          {/* Desktop bubbles */}
          <div className="hidden sm:flex flex-wrap items-center gap-3">
            {CHALLENGES.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group inline-flex items-center gap-2 pl-2 pr-5 py-2 rounded-full border border-white/15 transition-all hover:bg-white/[0.08] hover:border-primary/50"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <span className="frame-label text-primary px-2 py-1 rounded-full" style={{ background: 'rgba(211,178,123,0.15)' }}>
                  {c.num}
                </span>
                <span className="text-[13px] text-white/85 font-medium group-hover:text-white transition-colors">{c.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile bubbles — grille 2×2 alignée */}
          <div className="grid grid-cols-2 gap-2 sm:hidden">
            {CHALLENGES.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="flex items-center gap-2 pl-2 pr-3 py-2 rounded-full border border-white/15 transition-all hover:border-primary/50"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <span className="frame-label text-primary px-1.5 py-0.5 rounded-full text-[8px] shrink-0" style={{ background: 'rgba(211,178,123,0.15)' }}>
                  {c.num}
                </span>
                <span className="text-[11px] text-white/85 truncate">{c.labelMobile}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
