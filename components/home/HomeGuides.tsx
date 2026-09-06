import Image from 'next/image'
import Link from 'next/link'
import { ARTICLES } from '@/lib/articles-meta'

const guideSlugs = [
  'meilleur-micro-podcast-2026',
  'xlr-vs-usb',
  'top-5-interfaces',
  'setup-youtube-debutant-2026',
]

export function HomeGuides() {
  const guides = ARTICLES.filter(article => guideSlugs.includes(article.slug)).sort(
    (a, b) => guideSlugs.indexOf(a.slug) - guideSlugs.indexOf(b.slug)
  )
  const [featuredGuide, ...secondaryGuides] = guides

  if (!featuredGuide) return null

  return (
    <section className="border-b border-border/40 bg-background py-24">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-16">
        <div className="mb-12 flex items-end justify-between gap-8">
          <div>
            <p className="frame-label mb-4 flex items-center gap-3 text-primary">
              <span className="h-px w-8 bg-primary" aria-hidden />
              Le journal du Labo — N° 04
            </p>
            <h2 className="max-w-2xl font-serif text-[34px] leading-[1.06] tracking-tight text-foreground sm:text-[48px] md:text-[58px]">
              Guides &amp; tests<br /><span className="italic text-primary">rédigés par des pros.</span>
            </h2>
          </div>
          <Link href="/guides" className="hidden items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-foreground/65 transition-colors hover:text-primary md:inline-flex">
            Tous les guides →
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <Link href={`/guide/${featuredGuide.slug}`} className="group relative col-span-12 overflow-hidden border border-border/70 lg:col-span-7">
            <div className="relative aspect-[16/10] bg-[#0a0a0a]">
              {featuredGuide.image && <Image src={featuredGuide.image} alt="" fill className="object-cover opacity-55 transition-opacity group-hover:opacity-65" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
              <div className="absolute left-6 top-6 z-10 flex items-center gap-3">
                <span className="frame-label border border-primary/30 bg-black/45 px-3 py-2 text-primary backdrop-blur">Guide complet</span>
                <span className="frame-label text-white/55">{featuredGuide.readTime}</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 z-10 p-7 sm:p-9">
                <p className="frame-label mb-3 text-white/45">{featuredGuide.category}</p>
                <h3 className="max-w-2xl font-serif text-[30px] leading-[1.06] text-white sm:text-[40px]">{featuredGuide.title}</h3>
                <div className="mt-5 flex items-center gap-4 text-[11px] font-mono text-white/55">
                  <span>Par l'équipe Fluxlab</span><span>·</span><span>{featuredGuide.date}</span><span className="ml-auto text-primary">Lire →</span>
                </div>
              </div>
            </div>
          </Link>

          <div className="col-span-12 grid gap-6 lg:col-span-5">
            {secondaryGuides.slice(0, 3).map(guide => (
              <Link key={guide.id} href={`/guide/${guide.slug}`} className="group flex gap-5 border border-border/70 bg-card p-5 transition-all hover:border-primary/60 hover:shadow-lg">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden bg-secondary">
                  {guide.image && <Image src={guide.image} alt="" fill sizes="112px" className="object-cover" />}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div><p className="frame-label mb-2 text-foreground/45">{guide.category}</p><h3 className="font-serif text-lg leading-tight text-foreground transition-colors group-hover:text-primary">{guide.title}</h3></div>
                  <p className="text-[10px] font-mono text-foreground/40">{guide.readTime} · {guide.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
