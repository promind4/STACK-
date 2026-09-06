import Link from 'next/link'

const entries = [
  { num: '01', label: 'Pièce bruyante', description: 'Réduire le bruit, clarifier la voix.', href: '/categorie/espace-bruyant', icon: '⌁' },
  { num: '02', label: 'Plug & play', description: "Aller à l'essentiel, sans friction.", href: '/categorie/plug-and-play', icon: '□' },
  { num: '03', label: 'Budget serré', description: 'Prioriser ce qui change vraiment tout.', href: '/categorie/petit-budget', icon: '≋' },
  { num: '04', label: 'Créateur nomade', description: 'Rester léger, compact et prêt.', href: '/categorie/createur-nomade', icon: '◇' },
] as const

export function HeroContextGrid() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="frame-label text-primary">Choisissez votre point de départ</p>
        <p className="hidden text-[10px] font-mono uppercase tracking-[.16em] text-white/35 sm:block">
          Un besoin concret, une sélection adaptée
        </p>
      </div>
      <div className="grid grid-cols-1 gap-px border border-[var(--home-rule)] bg-[var(--home-rule)] sm:grid-cols-2 lg:grid-cols-4">
        {entries.map(({ num, label, description, href, icon }) => (
          <Link key={href} href={href} className="group relative min-h-28 overflow-hidden bg-[var(--home-panel)] p-5 transition-colors duration-300 hover:bg-[#18150f]">
            <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" aria-hidden />
            <div className="flex items-start justify-between gap-4">
              <span className="font-serif text-2xl font-light text-primary/80" aria-hidden>{icon}</span>
              <span className="frame-label text-primary/65">{num}</span>
            </div>
            <strong className="mt-4 block font-serif text-lg font-normal text-white">{label}</strong>
            <span className="mt-1.5 block text-xs leading-relaxed text-white/50">{description}</span>
            <span className="absolute bottom-5 right-5 text-primary/60 transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
