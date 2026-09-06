'use client'

import Image from 'next/image'
import Link from 'next/link'
import { HeroContextGrid } from '@/components/home/HeroContextGrid'

const TRUST = [
  ['Offres comparées', 'Selon les marchands disponibles'],
  ['Stock affiché', "D'après les données reçues"],
  ['Choix contextualisé', 'Usage, budget, environnement'],
  ['Liens directs', 'Vers les offres marchandes'],
] as const

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--home-ink)] text-white">
      <Image
        src="/images/home/hero-cinematic.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-30 object-cover object-[72%_center] opacity-85 sm:object-[68%_center] lg:opacity-95"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#080705_0%,rgba(8,7,5,.97)_34%,rgba(8,7,5,.5)_62%,rgba(8,7,5,.32)_78%,rgba(8,7,5,.7)_100%)]" aria-hidden />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(8,7,5,.18)_0%,transparent_52%,#080705_96%)]" aria-hidden />
      <div className="home-glow absolute right-[14%] top-[6%] -z-10 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" aria-hidden />

      <svg className="pointer-events-none absolute inset-0 -z-10 hidden h-full w-full lg:block" viewBox="0 0 1600 980" preserveAspectRatio="none" fill="none" aria-hidden>
        <path className="home-link-line" pathLength="1" d="M765 440 C900 415 930 260 1085 250 S1270 330 1450 240" stroke="rgba(211,168,95,.52)" strokeWidth="1" />
        <path className="home-link-line" pathLength="1" d="M820 520 C980 590 1065 620 1190 560 S1370 470 1510 515" stroke="rgba(211,168,95,.38)" strokeWidth="1" />
        <circle cx="935" cy="337" r="4" fill="#D3A85F" />
        <circle cx="1190" cy="560" r="4" fill="#D3A85F" />
        <circle cx="1450" cy="240" r="3" fill="#D3A85F" />
      </svg>

      <div className="pointer-events-none absolute left-5 top-[35%] hidden -translate-y-1/2 items-center gap-5 xl:flex" aria-hidden>
        <span className="h-28 w-px bg-primary/35" />
        <span className="frame-label rotate-180 text-primary/55 [writing-mode:vertical-rl]">48° 51′ N · Paris</span>
      </div>
      <div className="pointer-events-none absolute right-[18%] top-[24%] z-10 hidden text-right lg:block" aria-hidden>
        <span className="frame-label block text-primary">Capter avec clarté</span>
        <span className="mt-1 block text-[9px] font-mono uppercase tracking-[.18em] text-white/45">voix · présence · détail</span>
      </div>
      <div className="pointer-events-none absolute right-[5%] top-[49%] z-10 hidden text-right xl:block" aria-hidden>
        <span className="frame-label block text-primary">Créer sans compromis</span>
        <span className="mt-1 block text-[9px] font-mono uppercase tracking-[.18em] text-white/45">image · lumière · rythme</span>
      </div>

      <div className="mx-auto flex min-h-[900px] max-w-[1600px] flex-col px-5 pb-10 pt-32 sm:px-8 lg:min-h-[960px] lg:px-16 lg:pt-44">
        <div className="flex items-center justify-between gap-6">
          <p className="frame-label flex items-center gap-3 text-primary">
            <span className="h-px w-8 bg-primary" aria-hidden />
            Matériel créatif · choisi pour former un tout
          </p>
          <p className="hidden text-[10px] font-mono uppercase tracking-[.18em] text-white/40 md:block">Audio · Vidéo · Streaming</p>
        </div>

        <div className="flex flex-1 items-center py-16 lg:py-20">
          <div className="max-w-[760px]">
            <h1 className="font-serif text-[43px] leading-[.98] tracking-[-.035em] text-[var(--home-ivory)] sm:text-[62px] md:text-[72px] lg:text-[86px]">
              Le matériel qui<br />
              donne forme à<br />
              <span className="animate-gradient-text italic font-normal">vos idées.</span>
            </h1>
            <div className="mt-7 h-px w-8 bg-primary" aria-hidden />
            <p className="mt-7 max-w-[570px] text-[17px] font-light leading-[1.7] text-white/65 sm:text-lg">
              Comparez les prix, vérifiez les compatibilités et composez un équipement adapté à votre usage comme à votre budget.
            </p>
            <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <Link href="/configurateur" className="group inline-flex h-14 items-center justify-center gap-5 rounded-[2px] bg-primary px-8 text-[11px] font-medium uppercase tracking-[.16em] text-foreground transition-all hover:bg-primary-hover hover:shadow-btn">
                Composer mon setup
                <span className="text-base transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
              </Link>
              <Link href="/categorie/audio" className="group inline-flex h-12 items-center gap-3 border-b border-white/25 px-1 text-[11px] font-medium uppercase tracking-[.16em] text-white/80 transition-colors hover:border-primary hover:text-primary">
                Explorer par univers <span aria-hidden>↗</span>
              </Link>
            </div>

            <div className="mt-12 grid max-w-[650px] grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-7 sm:grid-cols-4">
              {TRUST.map(([label, detail]) => (
                <div key={label}>
                  <span className="block text-[11px] font-medium text-white/90">{label}</span>
                  <span className="mt-1 block text-[9px] leading-relaxed text-white/40">{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <HeroContextGrid />
      </div>
    </section>
  )
}
