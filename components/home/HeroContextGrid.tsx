import Link from 'next/link'

function NoiseIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 8c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0" />
      <path d="M4 12c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0" />
      <path d="M4 16c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0" />
    </svg>
  )
}

function PlugIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden="true">
      <path d="M8 4v6m8-6v6M6 10h12v2a6 6 0 0 1-6 6v2" />
      <path d="M9 20h6" />
    </svg>
  )
}

function BudgetIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 7.5h16v10H4z" />
      <path d="M4 10.5h16M15 14h2" />
      <path d="M7 4.5h10" />
    </svg>
  )
}

function TravelIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden="true">
      <rect x="7" y="4" width="10" height="16" rx="1" />
      <path d="M10 4V2h4v2M7 9h10M10 17h.01M14 17h.01" />
    </svg>
  )
}

const entries = [
  { label: 'Pièce bruyante', href: '/categorie/espace-bruyant', Icon: NoiseIcon },
  { label: 'Plug & play', href: '/categorie/plug-and-play', Icon: PlugIcon },
  { label: 'Budget serré', href: '/categorie/petit-budget', Icon: BudgetIcon },
  { label: 'Créateur nomade', href: '/categorie/createur-nomade', Icon: TravelIcon },
] as const

export function HeroContextGrid() {
  return (
    <nav aria-label="Choisir selon votre besoin" className="border-t border-white/15">
      <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
        {entries.map(({ label, href, Icon }) => (
          <li key={href} className="border-b border-white/15 lg:border-b-0 lg:border-r lg:border-white/15 last:lg:border-r-0">
            <Link href={href} className="group flex h-full items-center gap-3 px-4 py-4 text-sm text-white/80 transition-colors hover:bg-white/[.06] hover:text-[var(--home-ivory)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[var(--home-gold)]">
              <span className="text-[var(--home-gold)] transition-transform duration-300 motion-reduce:transform-none motion-reduce:transition-none group-hover:-translate-y-0.5"><Icon /></span>
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
