import Link from 'next/link'

function NoiseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 8c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0" />
      <path d="M4 12c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0" />
      <path d="M4 16c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0" />
    </svg>
  )
}

function PlugIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden="true">
      <path d="M8 4v6m8-6v6M6 10h12v2a6 6 0 0 1-6 6v2" />
      <path d="M9 20h6" />
    </svg>
  )
}

function BudgetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 7.5h16v10H4z" />
      <path d="M4 10.5h16M15 14h2" />
      <path d="M7 4.5h10" />
    </svg>
  )
}

function TravelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden="true">
      <rect x="7" y="4" width="10" height="16" rx="1" />
      <path d="M10 4V2h4v2M7 9h10M10 17h.01M14 17h.01" />
    </svg>
  )
}

const entries = [
  { label: 'Pièce bruyante', description: 'Réduire le bruit, clarifier la voix.', href: '/categorie/espace-bruyant', Icon: NoiseIcon },
  { label: 'Plug & play', description: "Aller à l'essentiel, sans friction.", href: '/categorie/plug-and-play', Icon: PlugIcon },
  { label: 'Budget serré', description: 'Prioriser ce qui change vraiment tout.', href: '/categorie/petit-budget', Icon: BudgetIcon },
  { label: 'Créateur nomade', description: 'Rester léger, compact et prêt.', href: '/categorie/createur-nomade', Icon: TravelIcon },
] as const

export function HeroContextGrid() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="frame-label text-primary">Choisissez votre point de départ</p>
        <p className="hidden text-[10px] font-mono uppercase tracking-[.16em] text-white/35 sm:block">
          Un besoin concret, une sélection adaptée
        </p>
      </div>
      <div className="grid grid-cols-1 gap-px border border-[var(--home-rule)] bg-[var(--home-rule)] sm:grid-cols-2 lg:grid-cols-4">
        {entries.map(({ label, description, href, Icon }) => (
          <Link key={href} href={href} className="group relative min-h-28 overflow-hidden bg-[var(--home-panel)] p-5 transition-colors duration-300 hover:bg-[#18150f]">
            <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" aria-hidden />
            <div className="flex items-start">
              <span className="flex size-[38px] items-center justify-center border border-primary/55 text-primary/80 transition-colors duration-300 group-hover:text-primary">
                <Icon />
              </span>
            </div>
            <strong className="mt-4 block font-serif text-lg font-normal text-white">{label}</strong>
            <span className="mt-1.5 block text-xs leading-relaxed text-white/50">{description}</span>
            <span className="absolute bottom-5 right-5 text-primary/60 transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
