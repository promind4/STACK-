import { GitCompareArrows, PackageSearch, SlidersHorizontal, Truck, type LucideIcon } from 'lucide-react'

type TrustItem = {
  title: string
  detail: string
  icon: LucideIcon
}

const items: TrustItem[] = [
  { title: 'Offres comparées', detail: 'Selon les partenaires disponibles', icon: GitCompareArrows },
  { title: 'Livraison', detail: 'Conditions indiquées par le marchand', icon: Truck },
  { title: 'Disponibilité', detail: 'Lorsqu’elle est précisée par le marchand', icon: PackageSearch },
  { title: 'Repères utiles', detail: 'Usage, budget et compatibilité', icon: SlidersHorizontal },
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
        <div key={title} className={`flex min-h-28 items-start gap-3 px-5 py-6 sm:px-6 ${cellBorders[index]}`}>
          <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <strong className="block text-sm font-medium text-white/90">{title}</strong>
            <span className="mt-1 block text-xs leading-relaxed text-white/65">{detail}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
