import Image from 'next/image'
import Link from 'next/link'
import { isDirectSupabaseStorageUrl } from '@/lib/imagePolicy.mjs'
import { cleanImageUrl } from '@/lib/utils'
import type { Product } from '@/types/database'

const roleLabels = ['Interface', 'Voix', 'Image'] as const

const nodeLayouts = [
  'lg:left-[12%] lg:right-[12%] lg:top-[4%] lg:h-[22%]',
  'lg:bottom-[4%] lg:left-0 lg:h-[22%] lg:w-[48%]',
  'lg:bottom-[4%] lg:right-0 lg:h-[22%] lg:w-[48%]',
] as const

const connections = [
  { path: 'M 50 37 L 50 26', start: [50, 37], end: [50, 26] },
  { path: 'M 41 57 L 24 74', start: [41, 57], end: [24, 74] },
  { path: 'M 59 57 L 76 74', start: [59, 57], end: [76, 74] },
] as const

export function CompatibilityPreview({ products }: { products: Product[] }) {
  const nodes = products.slice(0, roleLabels.length)

  return (
    <section aria-labelledby="compatibility-title" className="flex h-full flex-col overflow-hidden bg-[#0b0a08] p-6 lg:p-7 xl:p-9">
      <p className="frame-label text-primary">Cohérence du setup</p>
      <h3 id="compatibility-title" className="mt-3 max-w-md font-serif text-[32px] leading-tight text-white xl:text-[38px]">
        Un ensemble, <span className="italic text-primary">pas une liste.</span>
      </h3>

      <div className="relative mt-7 grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3 lg:block lg:min-h-[440px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(circle_at_50%_47%,rgba(211,168,95,.16),transparent_27%),radial-gradient(circle_at_20%_78%,rgba(255,255,255,.035),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(255,255,255,.025),transparent_28%)] lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden opacity-25 [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.018)_1px,transparent_1px)] [background-size:28px_28px] lg:block"
        />

        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {connections.slice(0, nodes.length).map((connection) => (
            <g key={connection.path}>
              <path d={connection.path} fill="none" stroke="rgba(211,168,95,.48)" strokeWidth="0.45" vectorEffect="non-scaling-stroke" />
              <circle cx={connection.start[0]} cy={connection.start[1]} r="0.85" fill="#d3a85f" vectorEffect="non-scaling-stroke" />
              <circle cx={connection.end[0]} cy={connection.end[1]} r="0.85" fill="#d3a85f" vectorEffect="non-scaling-stroke" />
            </g>
          ))}
        </svg>

        <div className="relative z-10 flex min-h-24 items-center justify-center border border-primary/35 bg-[#12100c]/95 px-5 py-4 text-center shadow-[0_0_40px_rgba(211,168,95,.08)] sm:col-span-3 lg:absolute lg:left-1/2 lg:top-[37%] lg:h-[20%] lg:min-h-0 lg:w-[42%] lg:-translate-x-1/2 lg:px-3 lg:py-3">
          {nodes[0] && <span aria-hidden="true" className="absolute left-1/2 top-0 hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0b0a08] bg-primary shadow-[0_0_12px_rgba(211,168,95,.75)] lg:block" />}
          {nodes[1] && <span aria-hidden="true" className="absolute bottom-0 left-[28.57%] hidden h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full border border-[#0b0a08] bg-primary shadow-[0_0_12px_rgba(211,168,95,.75)] lg:block" />}
          {nodes[2] && <span aria-hidden="true" className="absolute bottom-0 left-[71.43%] hidden h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full border border-[#0b0a08] bg-primary shadow-[0_0_12px_rgba(211,168,95,.75)] lg:block" />}
          <div>
            <strong className="block font-serif text-lg font-normal text-white">Votre setup</strong>
            <span className="mt-1 block text-[9px] font-mono uppercase tracking-[.13em] text-white/38">Un ensemble cohérent</span>
          </div>
        </div>

        {nodes.map((product, index) => {
          const imageUrl = cleanImageUrl(product.image_url)

          return (
            <article
              key={product.id}
              className={`relative z-10 flex min-w-0 items-center gap-3 border border-white/12 bg-[#11100d]/95 p-2.5 sm:flex-col sm:items-stretch sm:p-3 lg:absolute lg:flex-row lg:items-center lg:p-2.5 ${nodeLayouts[index]}`}
            >
              <span
                aria-hidden="true"
                className={`absolute left-1/2 hidden h-2 w-2 -translate-x-1/2 rounded-full border border-[#0b0a08] bg-primary shadow-[0_0_12px_rgba(211,168,95,.75)] lg:block ${index === 0 ? 'bottom-0 translate-y-1/2' : 'top-0 -translate-y-1/2'}`}
              />
              <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden bg-white sm:h-24 sm:w-full lg:h-[72px] lg:w-[72px]">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 72px, (min-width: 640px) 28vw, 76px"
                    className="object-contain p-2 mix-blend-multiply"
                    unoptimized={isDirectSupabaseStorageUrl(imageUrl)}
                  />
                ) : (
                  <span className="flex h-full items-center justify-center px-2 text-center text-[8px] font-mono uppercase tracking-[.12em] text-black/35">
                    Visuel indisponible
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <span className="frame-label text-primary/75">{roleLabels[index]}</span>
                <strong className="mt-1.5 line-clamp-2 block font-serif text-sm font-normal leading-snug text-white/90">
                  {product.name}
                </strong>
              </div>
            </article>
          )
        })}
      </div>

      <Link href="/configurateur" className="group mt-7 inline-flex border-t border-white/10 pt-5 text-[10px] font-mono uppercase tracking-[.13em] text-primary">
        Tester la cohérence de mon setup <span className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
      </Link>
    </section>
  )
}
