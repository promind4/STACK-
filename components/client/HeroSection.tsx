'use client'

import Link from 'next/link'
import { HeroContextGrid } from '@/components/home/HeroContextGrid'
import ShaderDemo_ATC from '@/components/ui/atc-shader'

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-[var(--home-ink)] text-white">
      <ShaderDemo_ATC className="absolute inset-0 -z-30 opacity-[0.2]" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#090806_0%,rgba(9,8,6,.96)_39%,rgba(9,8,6,.62)_64%,rgba(9,8,6,.22)_100%)]" aria-hidden />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(9,8,6,.08)_0%,rgba(9,8,6,.08)_57%,#090806_100%)]" aria-hidden />
      <div className="hero-ambient absolute right-[-12rem] top-[8%] -z-10 h-[32rem] w-[32rem] rounded-full bg-[rgba(200,155,82,.10)] blur-3xl" aria-hidden />

      <div className="mx-auto flex min-h-[560px] max-w-[1600px] flex-col px-5 pb-6 pt-24 sm:px-8 sm:pt-28 lg:min-h-[680px] lg:px-16 lg:pb-10 lg:pt-32">
        <div className="hero-arrival flex flex-1 flex-col justify-center pb-12 lg:max-w-[58%] lg:pb-20">
          <p className="text-sm text-[var(--home-gold)]">Construire une chaîne audio sans compromis.</p>
          <h1 id="hero-title" className="mt-5 max-w-[10ch] font-serif text-[clamp(3.05rem,7vw,6.35rem)] leading-[.91] tracking-[-.055em] text-[var(--home-ivory)]">
            Faites entendre ce qui compte.
          </h1>
          <p className="mt-7 max-w-[34rem] text-[15px] leading-7 text-white/70 sm:text-[17px] sm:leading-8">
            Micro, interface, monitoring et traitement : comparez les offres et composez une chaîne sonore cohérente pour la voix, le podcast et le home studio.
          </p>
          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link href="/configurateur" className="inline-flex min-h-12 items-center justify-center rounded-sm bg-[var(--home-gold)] px-6 text-sm font-medium text-[var(--home-ink)] transition-colors hover:bg-[#dfb870] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-ivory)]">
              Composer mon setup
            </Link>
            <Link href="#selection" className="inline-flex min-h-12 items-center border-b border-white/35 text-sm text-white/85 transition-colors hover:border-[var(--home-gold)] hover:text-[var(--home-ivory)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-ivory)]">
              Voir les essentiels
            </Link>
          </div>
        </div>

        <div className="lg:ml-[42%]">
          <HeroContextGrid />
        </div>
      </div>
    </section>
  )
}
