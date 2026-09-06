import Link from 'next/link'
import type { Product } from '@/types/database'
import { ProductCard } from '@/components/ui/ProductCard'
import { CompatibilityPreview } from '@/components/home/CompatibilityPreview'

export function HomeProductShowcase({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <section className="bg-[var(--home-ink)] px-5 pb-20 text-white sm:px-8">
        <div className="mx-auto max-w-[1600px] border border-white/10 p-8">
          <h2 className="font-serif text-3xl">La sélection est momentanément indisponible.</h2>
          <p className="mt-3 text-sm text-white/55">Explorez les univers Fluxlab pendant son actualisation.</p>
          <Link href="/categorie/audio" className="mt-6 inline-flex text-xs font-mono uppercase tracking-[.14em] text-primary">Explorer les univers →</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="relative bg-[var(--home-ink)] px-5 pb-20 text-white sm:px-8 lg:px-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_center,rgba(211,168,95,.09),transparent_68%)]" aria-hidden />
      <div className="relative mx-auto grid max-w-[1600px] border border-[var(--home-rule)] bg-[#0c0b09] lg:grid-cols-12">
        <div className="p-5 sm:p-7 lg:col-span-7 lg:p-8 xl:p-10">
          <div className="mb-7 flex items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div>
              <p className="frame-label text-primary">Sélectionné pour vous</p>
              <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">Les essentiels du moment.</h2>
            </div>
            <Link href="/categorie/audio" className="hidden shrink-0 text-[10px] font-mono uppercase tracking-[.14em] text-primary/75 transition-colors hover:text-primary sm:inline-flex">
              Voir la sélection →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:gap-4">
            {products.slice(0, 3).map((product, index) => (
              <ProductCard key={product.id} product={product} editorialBadge={index === 1 ? 'choix' : undefined} />
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--home-rule)] lg:col-span-5 lg:border-l lg:border-t-0">
          <CompatibilityPreview products={products} />
        </div>
      </div>

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-2 border-x border-b border-[var(--home-rule)] bg-[#0a0907] md:grid-cols-4">
        {[
          ['Offres comparées', 'Selon les marchands disponibles'],
          ['Livraison', 'Conditions affichées par le marchand'],
          ['Disponibilité', 'Stock visible avant le choix'],
          ['Décision guidée', 'Besoin, budget, compatibilité'],
        ].map(([title, detail], index) => (
          <div key={title} className={`min-h-24 px-5 py-6 ${index > 0 ? 'border-l border-[var(--home-rule)]' : ''} ${index > 1 ? 'border-t border-[var(--home-rule)] md:border-t-0' : ''}`}>
            <span className="frame-label text-primary">0{index + 1}</span>
            <strong className="ml-3 text-xs font-medium text-white/80">{title}</strong>
            <span className="mt-2 block text-[10px] leading-relaxed text-white/35">{detail}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
