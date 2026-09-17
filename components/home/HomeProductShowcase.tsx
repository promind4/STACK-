import Link from 'next/link'
import type { Product } from '@/types/database'
import { ProductCard } from '@/components/ui/ProductCard'
import { CompatibilityPreview } from '@/components/home/CompatibilityPreview'
import { HomeTrustStrip } from '@/components/home/HomeTrustStrip'

export function HomeProductShowcase({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <section id="selection" className="bg-[var(--home-ink)] px-5 pb-20 text-white sm:px-8">
        <div className="mx-auto max-w-[1600px] border border-white/10 p-8">
          <h2 className="font-serif text-3xl">La sélection est momentanément indisponible.</h2>
          <p className="mt-3 text-sm text-white/55">Explorez le catalogue audio pendant son actualisation.</p>
          <Link href="/categorie/audio" className="mt-6 inline-flex text-xs font-mono uppercase tracking-[.14em] text-primary">Explorer le catalogue audio →</Link>
        </div>
      </section>
    )
  }

  const showcaseProducts = products.slice(0, 3)

  return (
    <section id="selection" className="relative bg-[var(--home-ink)] px-5 pb-20 text-white sm:px-8 lg:px-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_center,rgba(211,168,95,.09),transparent_68%)]" aria-hidden />
      <div className="relative mx-auto max-w-[1600px] border border-[var(--home-rule)] bg-[#0c0b09] xl:grid xl:grid-cols-[minmax(0,2fr)_minmax(0,.9fr)]">
        <div className="min-w-0 p-5 sm:p-7 lg:p-8 xl:p-10">
          <div className="mb-7 flex items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div>
              <p className="text-sm text-primary">Notre sélection</p>
              <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">Les essentiels du moment.</h2>
            </div>
            <Link href="/categorie/audio" className="hidden shrink-0 text-[12px] font-mono font-medium uppercase tracking-[.14em] text-primary/80 transition-colors hover:text-primary sm:inline-flex">
              Voir l’audio
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:gap-4">
            {showcaseProducts.map((product) => (
              <ProductCard key={product.id} product={product} editorialBadge={product.slug === 'shure-sm7b' ? 'choix' : undefined} variant="home-showcase" />
            ))}
          </div>
        </div>

        <div className="min-w-0 border-t border-[var(--home-rule)] xl:border-l xl:border-t-0">
          <CompatibilityPreview />
        </div>
      </div>

      <HomeTrustStrip />
    </section>
  )
}
