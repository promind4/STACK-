import Image from 'next/image'
import Link from 'next/link'
import { isDirectSupabaseStorageUrl } from '@/lib/imagePolicy.mjs'
import { cleanImageUrl } from '@/lib/utils'
import type { Product } from '@/types/database'

const roleLabels = ['Interface', 'Voix', 'Image'] as const
type EquipmentRole = (typeof roleLabels)[number] | 'Équipement'

function inferRole(product: Pick<Product, 'slug' | 'name'>): EquipmentRole {
  const descriptor = `${product.slug} ${product.name}`
    .toLocaleLowerCase('fr-FR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (/\b(interface|focusrite|scarlett|audient|universal[\s-]+audio)\b/.test(descriptor)) {
    return roleLabels[0]
  }

  if (/\b(camera|sony|zv|canon|lumix|webcam)\b/.test(descriptor)) {
    return roleLabels[2]
  }

  if (/\b(micro(?:phone)?|mic|shure|sm7b|audio[\s-]+technica|rode|røde)\b/.test(descriptor)) {
    return roleLabels[1]
  }

  return 'Équipement'
}

function responsiveGridLayout(nodeCount: number) {
  if (nodeCount <= 1) {
    return 'mx-auto w-full max-w-md grid-cols-1 lg:max-w-none xl:max-w-none'
  }

  if (nodeCount === 2) {
    return 'mx-auto w-full max-w-4xl grid-cols-1 sm:grid-cols-2 lg:max-w-none lg:grid-cols-1 xl:max-w-none'
  }

  return 'w-full grid-cols-1 sm:grid-cols-3 lg:grid-cols-1'
}

const nodeLayouts = [
  'xl:left-[12%] xl:right-[12%] xl:top-[4%] xl:h-[22%]',
  'xl:bottom-[4%] xl:left-0 xl:h-[22%] xl:w-[48%]',
  'xl:bottom-[4%] xl:right-0 xl:h-[22%] xl:w-[48%]',
] as const

const connections = [
  { path: 'M 50 37 L 50 26', start: [50, 37], end: [50, 26] },
  { path: 'M 41 57 L 24 74', start: [41, 57], end: [24, 74] },
  { path: 'M 59 57 L 76 74', start: [59, 57], end: [76, 74] },
] as const

export function CompatibilityPreview({ products }: { products: Product[] }) {
  const nodes = products.slice(0, roleLabels.length)
  const gridLayout = responsiveGridLayout(nodes.length)

  return (
    <section aria-labelledby="compatibility-title" className="flex h-full flex-col overflow-hidden bg-[#0b0a08] p-6 lg:p-7 xl:p-9">
      <p className="frame-label text-primary">Cohérence du setup</p>
      <h3 id="compatibility-title" className="mt-3 max-w-md font-serif text-[32px] leading-tight text-white xl:text-[38px]">
        Un ensemble, <span className="italic text-primary">pas une liste.</span>
      </h3>

      <div className={`relative mt-7 grid gap-3 xl:block xl:min-h-[440px] xl:flex-1 ${gridLayout}`}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(circle_at_50%_47%,rgba(211,168,95,.16),transparent_27%),radial-gradient(circle_at_20%_78%,rgba(255,255,255,.035),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(255,255,255,.025),transparent_28%)] xl:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden opacity-25 [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.018)_1px,transparent_1px)] [background-size:28px_28px] xl:block"
        />

        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden h-full w-full xl:block"
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

        <div className="relative z-10 flex min-h-24 items-center justify-center border border-primary/35 bg-[#12100c]/95 px-5 py-4 text-center shadow-[0_0_40px_rgba(211,168,95,.08)] sm:col-span-full xl:absolute xl:left-1/2 xl:top-[37%] xl:h-[20%] xl:min-h-0 xl:w-[42%] xl:-translate-x-1/2 xl:px-3 xl:py-3">
          {nodes[0] && <span aria-hidden="true" className="absolute left-1/2 top-0 hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0b0a08] bg-primary shadow-[0_0_12px_rgba(211,168,95,.75)] xl:block" />}
          {nodes[1] && <span aria-hidden="true" className="absolute bottom-0 left-[28.57%] hidden h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full border border-[#0b0a08] bg-primary shadow-[0_0_12px_rgba(211,168,95,.75)] xl:block" />}
          {nodes[2] && <span aria-hidden="true" className="absolute bottom-0 left-[71.43%] hidden h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full border border-[#0b0a08] bg-primary shadow-[0_0_12px_rgba(211,168,95,.75)] xl:block" />}
          <div>
            <strong className="block font-serif text-lg font-normal text-white">Votre setup</strong>
            <span className="mt-1 block text-[10px] font-mono uppercase tracking-[.13em] text-white/65">Un ensemble cohérent</span>
          </div>
        </div>

        {nodes.map((product, index) => {
          const imageUrl = cleanImageUrl(product.image_url)

          return (
            <article
              key={product.id}
              className={`relative z-10 flex min-w-0 items-center gap-3 border border-white/12 bg-[#11100d]/95 p-2.5 sm:flex-col sm:items-stretch sm:p-3 lg:flex-row lg:items-center lg:p-2.5 xl:absolute ${nodeLayouts[index]}`}
            >
              <span
                aria-hidden="true"
                className={`absolute left-1/2 hidden h-2 w-2 -translate-x-1/2 rounded-full border border-[#0b0a08] bg-primary shadow-[0_0_12px_rgba(211,168,95,.75)] xl:block ${index === 0 ? 'bottom-0 translate-y-1/2' : 'top-0 -translate-y-1/2'}`}
              />
              <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden bg-white sm:h-24 sm:w-full lg:h-[72px] lg:w-[72px] xl:h-16 xl:w-16">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 72px, (min-width: 640px) 28vw, 76px"
                    className="object-contain p-2 mix-blend-multiply"
                    unoptimized={isDirectSupabaseStorageUrl(imageUrl)}
                  />
                ) : (
                  <span className="flex h-full items-center justify-center px-2 text-center text-[10px] font-mono uppercase tracking-[.1em] text-black/65">
                    Visuel indisponible
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <span className="frame-label text-primary/75">{inferRole(product)}</span>
                <strong className="mt-1.5 block break-words font-serif text-sm font-normal leading-snug text-white/90 xl:text-[12px]">
                  {product.name}
                </strong>
              </div>
            </article>
          )
        })}
      </div>

      <Link href="/configurateur" className="group mt-7 inline-flex border-t border-white/10 pt-5 text-[10px] font-mono uppercase tracking-[.13em] text-primary">
        Tester la cohérence de mon setup <span className="ml-2 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" aria-hidden="true">→</span>
      </Link>
    </section>
  )
}
