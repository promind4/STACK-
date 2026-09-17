import Link from 'next/link'

const setupNodes = [
  { label: 'Source', detail: 'Micro, caméra ou instrument' },
  { label: 'Traitement', detail: 'Interface, acquisition et liaison' },
  { label: 'Restitution', detail: 'Casque, enceintes ou diffusion' },
] as const

export function CompatibilityPreview() {
  return (
    <section aria-labelledby="compatibility-title" className="overflow-hidden bg-[#0b0a08] p-6 lg:p-8 xl:p-5">
      <h3 id="compatibility-title" className="max-w-md font-serif text-[30px] leading-[1.08] text-white xl:text-[28px] xl:leading-[1.06]">
        Composer une chaîne qui tient ensemble.
      </h3>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65 xl:mt-2 xl:text-[13px] xl:leading-5">
        Le configurateur relie chaque rôle selon votre usage et votre budget, puis vous aide à repérer ce qui manque.
      </p>

      <ol className="mt-6 xl:mt-4">
        {setupNodes.map((node, index) => (
          <li key={node.label} className="relative flex items-center gap-3 py-1.5 xl:gap-2 xl:py-0.5">
            {index > 0 && (
              <span className="setup-connector absolute left-[5.5px] top-0 h-1/2 w-px bg-white/15" aria-hidden>
                <span className="absolute inset-0 bg-primary/70 motion-safe:animate-pulse motion-reduce:animate-none" />
              </span>
            )}
            <span className="relative z-10 h-3 w-3 shrink-0 rounded-full border border-primary/70 bg-[#0b0a08] shadow-[0_0_14px_rgba(200,155,82,.22)]" aria-hidden />
            <div className="min-w-0 flex-1 border border-white/10 bg-white/[.025] px-4 py-3.5 xl:px-3 xl:py-2">
              <strong className="block font-serif text-base font-normal text-white xl:text-[15px]">{node.label}</strong>
              <span className="mt-0.5 block text-xs leading-relaxed text-white/55 xl:leading-4">{node.detail}</span>
            </div>
            {index < setupNodes.length - 1 && (
              <span className="setup-connector absolute bottom-0 left-[5.5px] top-1/2 w-px bg-white/15" aria-hidden>
                <span className="absolute inset-0 bg-primary/70 motion-safe:animate-pulse motion-reduce:animate-none" />
              </span>
            )}
          </li>
        ))}
      </ol>

      <p className="mt-5 text-xs leading-relaxed text-white/45 xl:mt-3">
        Une aide à la composition, pas une validation technique automatique.
      </p>
      <Link
        href="/configurateur"
        className="mt-5 inline-flex border-b border-primary/45 pb-1 text-sm font-medium text-primary transition-colors hover:border-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none xl:mt-3"
      >
        Ouvrir l’Atelier
      </Link>
    </section>
  )
}
