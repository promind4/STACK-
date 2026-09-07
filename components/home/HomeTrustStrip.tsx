type TrustItem = {
  title: string
  detail: string
  icon: () => JSX.Element
}

function CompareIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
      <path d="M5 5h14M5 12h14M5 19h14" />
      <path d="M8 3v4M16 10v4M11 17v4" />
    </svg>
  )
}

function DeliveryIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
      <path d="M3 6h11v11H3zM14 9h4l3 3v5h-7z" />
      <path d="M6 19h.01M17 19h.01" />
    </svg>
  )
}

function StockIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
      <path d="M4 7 12 3l8 4-8 4zM4 12l8 4 8-4M4 17l8 4 8-4" />
    </svg>
  )
}

function GuidanceIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
      <path d="M12 21a9 9 0 1 0-9-9" />
      <path d="m9 12 2 2 5-5M12 3v2M3 12h2" />
    </svg>
  )
}

const items: TrustItem[] = [
  { title: 'Offres comparées', detail: 'Selon les marchands disponibles', icon: CompareIcon },
  { title: 'Livraison', detail: 'Conditions affichées par le marchand', icon: DeliveryIcon },
  { title: 'Disponibilité', detail: 'Stock visible avant le choix', icon: StockIcon },
  { title: 'Décision guidée', detail: 'Besoin, budget, compatibilité', icon: GuidanceIcon },
]

const cellBorders = [
  '',
  'border-l border-[var(--home-rule)]',
  'border-t border-[var(--home-rule)] md:border-l md:border-t-0',
  'border-l border-t border-[var(--home-rule)] md:border-t-0',
]

export function HomeTrustStrip() {
  return (
    <div className="relative mx-auto grid max-w-[1600px] grid-cols-2 border-x border-b border-[var(--home-rule)] bg-[#0a0907] md:grid-cols-4">
      {items.map(({ title, detail, icon: Icon }, index) => (
        <div key={title} className={`min-h-32 px-5 py-6 sm:px-6 ${cellBorders[index]}`}>
          <div className="flex size-10 items-center justify-center border border-primary/80 text-primary">
            <Icon />
          </div>
          <strong className="mt-4 block text-xs font-medium text-white/90">{title}</strong>
          <span className="mt-2 block text-[10px] leading-relaxed text-white/65">{detail}</span>
        </div>
      ))}
    </div>
  )
}
