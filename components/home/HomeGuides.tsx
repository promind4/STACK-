import Image from 'next/image'
import Link from 'next/link'
import { ARTICLES } from '@/lib/articles-meta'
import { guideCoverImage } from '@/lib/guide-images'
import { isPublicAudioGuide } from '@/lib/public-audio-scope'

const guideSlugs = [
  'meilleur-micro-podcast-2026',
  'xlr-vs-usb',
  'top-5-interfaces',
  'focusrite-scarlett-2i2-vs-audient-id4',
]

export function HomeGuides() {
  const guides = ARTICLES
    .filter(isPublicAudioGuide)
    .filter(article => guideSlugs.includes(article.slug))
    .sort((a, b) => guideSlugs.indexOf(a.slug) - guideSlugs.indexOf(b.slug))
  const [featuredGuide, ...secondaryGuides] = guides

  if (!featuredGuide) return null

  return (
    <section className="border-b border-border/40 bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-16">
        <div className="mb-10 flex items-end justify-between gap-8 sm:mb-12">
          <div>
            <h2 className="max-w-4xl font-serif text-[32px] leading-[1.1] tracking-tight text-foreground sm:text-[44px] md:text-[52px] text-balance">
              Des guides pour choisir&nbsp;juste.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/65 sm:text-base">Comparatifs, méthodes et retours de terrain pour composer un setup qui vous ressemble.</p>
          </div>
          <Link href="/guides" className="hidden text-sm text-foreground/65 underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:inline-flex">
            Tous les guides
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <Link href={`/guide/${featuredGuide.slug}`} className="group relative overflow-hidden bg-[#171510] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:col-span-7">
            <div className="relative min-h-[22rem] sm:aspect-[16/10] sm:min-h-0 lg:h-full lg:aspect-auto">
              {featuredGuide.image ? <Image src={guideCoverImage(featuredGuide)} alt="" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover h-full w-full opacity-60 transition-opacity duration-300 group-hover:opacity-75" /> : <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,155,82,.3),transparent_45%)]" aria-hidden />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 z-10 p-7 sm:p-9">
                <p className="text-sm text-white/65">{featuredGuide.category} · {featuredGuide.readTime}</p>
                <h3 className="max-w-2xl font-serif text-[27px] leading-[1.08] text-white sm:text-[34px] lg:text-[40px]">{featuredGuide.title}</h3>
                <p className="mt-5 text-sm text-white/55">Par {featuredGuide.author} · {featuredGuide.date}</p>
              </div>
            </div>
          </Link>

          <div className="grid gap-6 lg:col-span-5">
            {secondaryGuides.slice(0, 3).map(guide => (
              <Link key={guide.id} href={`/guide/${guide.slug}`} className="group flex gap-5 border border-border/70 bg-card p-5 transition-colors hover:border-primary/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                <div className="relative aspect-square w-24 shrink-0 overflow-hidden bg-secondary sm:w-28">
                  {guide.image ? <Image src={guideCoverImage(guide)} alt="" fill sizes="(min-width: 640px) 112px, 96px" className="object-cover h-full w-full" /> : <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,155,82,.24),transparent_55%)]" aria-hidden />}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div><p className="mb-2 text-sm text-foreground/60">{guide.category}</p><h3 className="font-serif text-lg leading-tight text-foreground transition-colors group-hover:text-primary">{guide.title}</h3></div>
                  <p className="mt-4 text-sm text-foreground/60">{guide.readTime} · {guide.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
