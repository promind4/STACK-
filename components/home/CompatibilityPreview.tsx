import Link from 'next/link'
import type { Product } from '@/types/database'

const roles = ['Interface', 'Source', 'Image'] as const
const notes = ['Centralise les entrées', 'Capte la voix', 'Cadre la création'] as const

export function CompatibilityPreview({ products }: { products: Product[] }) {
  const nodes = products.slice(0, 3)

  return (
    <section aria-labelledby="compatibility-title" className="flex h-full flex-col bg-[#0b0a08] p-6 lg:p-8 xl:p-10">
      <p className="frame-label text-primary">Parcours de compatibilité</p>
      <h3 id="compatibility-title" className="mt-4 max-w-md font-serif text-[32px] leading-tight text-white xl:text-[40px]">
        Un ensemble,<br /><span className="italic text-primary">pas une liste.</span>
      </h3>
      <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-white/52">
        Chaque choix prend sa valeur quand les connexions, l'usage et le budget restent cohérents.
      </p>

      <div className="relative mt-10 grid flex-1 gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        <span aria-hidden className="absolute left-[12%] right-[12%] top-6 hidden h-px bg-primary/35 sm:block lg:hidden xl:block" />
        <span aria-hidden className="absolute bottom-[12%] left-6 top-[12%] hidden w-px bg-primary/35 lg:block xl:hidden" />
        {nodes.map((product, index) => (
          <div key={product.id} className="relative z-10 flex items-start gap-4 sm:block sm:text-center lg:flex lg:text-left xl:block xl:text-center">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-primary/60 bg-[#0b0a08] font-serif text-lg text-primary shadow-[0_0_24px_rgba(211,168,95,.12)]">
              0{index + 1}
            </span>
            <div className="sm:mt-4 lg:mt-0 xl:mt-4">
              <span className="frame-label text-primary/70">{roles[index]}</span>
              <strong className="mt-2 block font-serif text-base font-normal leading-snug text-white">{product.name}</strong>
              <span className="mt-1 block text-[11px] text-white/40">{notes[index]}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t border-white/10 pt-6">
        <p className="text-[13px] leading-relaxed text-white/55">
          Exemple de chaîne : vérifiez les connexions, le gain nécessaire et le budget avant l'achat.
        </p>
        <Link href="/configurateur" className="group mt-6 inline-flex items-center gap-3 text-[11px] font-mono uppercase tracking-[.14em] text-primary">
          Vérifier mon setup <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
        </Link>
      </div>
    </section>
  )
}
