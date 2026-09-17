'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { AtelierPackRecommendation, AtelierRecommendation, AtelierProfile, AtelierRole } from '@/lib/atelier/types'

const money = (value: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)
const projects = [
  { value: 'podcast', name: 'Podcast', detail: 'Une voix claire, enregistrée à la maison.' },
  { value: 'streaming', name: 'Streaming', detail: 'Une prise de son fiable pendant le direct.' },
  { value: 'music_vocals', name: 'Musique et chant', detail: 'Capter les nuances de votre voix.' },
  { value: 'video', name: 'Vidéo', detail: 'Une voix qui accompagne vos images.' },
] as const
type StartingPoint = 'starter' | 'existing' | 'upgrade'
const startingPoints = {
  podcast: [
    { value: 'starter', name: 'Je pars de zéro', detail: 'Créer une première chaîne simple pour enregistrer.' },
    { value: 'existing', name: 'J’ai déjà un micro', detail: 'Compléter ce qui manque sans acheter deux fois.' },
    { value: 'upgrade', name: 'Je veux faire évoluer mon setup', detail: 'Gagner en confort ou accueillir une seconde voix.' },
  ],
  streaming: [
    { value: 'starter', name: 'Je pars de zéro', detail: 'Poser une base fiable pour vos premiers directs.' },
    { value: 'existing', name: 'Le son est déjà couvert', detail: 'Concentrer les choix sur ce qui améliore le direct.' },
    { value: 'upgrade', name: 'Je veux un direct plus propre', detail: 'Faire progresser le son, l’image ou la lumière.' },
  ],
  music_vocals: [
    { value: 'starter', name: 'Je pars de zéro', detail: 'Enregistrer une première voix à la maison.' },
    { value: 'existing', name: 'J’ai déjà un micro', detail: 'Vérifier la chaîne autour de votre matériel actuel.' },
    { value: 'upgrade', name: 'Je veux traiter et faire évoluer', detail: 'Mieux écouter, enregistrer ou maîtriser la pièce.' },
  ],
  video: [
    { value: 'starter', name: 'Je pars de zéro', detail: 'Construire une base image et son pour vos vidéos.' },
    { value: 'existing', name: 'J’ai déjà de quoi filmer', detail: 'Améliorer la voix et la lumière autour de votre caméra.' },
    { value: 'upgrade', name: 'Je veux améliorer le son', detail: 'Faire de l’audio le prochain vrai gain de qualité.' },
  ],
} as const satisfies Record<AtelierProfile['project'], readonly { value: StartingPoint; name: string; detail: string }[]>
const equipmentOptions: Record<AtelierProfile['project'], readonly { role: AtelierRole; connection?: 'usb' | 'xlr'; name: string; detail: string }[]> = {
  podcast: [
    { role: 'microphone', connection: 'usb', name: 'Micro USB', detail: 'Prêt à brancher, sans interface supplémentaire.' },
    { role: 'microphone', connection: 'xlr', name: 'Micro XLR', detail: 'Une interface compatible sera conservée ou ajoutée.' },
    { role: 'interface', name: 'Interface audio', detail: 'Votre connexion micro est déjà couverte.' },
    { role: 'headphones', name: 'Casque', detail: 'Votre écoute est déjà couverte.' },
  ],
  streaming: [
    { role: 'microphone', connection: 'usb', name: 'Micro USB', detail: 'Prêt à brancher pour le direct.' },
    { role: 'interface', name: 'Interface audio', detail: 'Votre connexion micro est déjà couverte.' },
    { role: 'camera', name: 'Caméra', detail: 'Votre image est déjà prise en charge.' },
    { role: 'lighting', name: 'Éclairage', detail: 'Votre lumière est déjà couverte.' },
    { role: 'headphones', name: 'Casque', detail: 'Votre écoute est déjà couverte.' },
  ],
  music_vocals: [
    { role: 'microphone', connection: 'xlr', name: 'Micro XLR', detail: 'Votre prise de voix est déjà couverte.' },
    { role: 'interface', name: 'Interface audio', detail: 'Votre connexion micro est déjà couverte.' },
    { role: 'monitors', name: 'Enceintes de monitoring', detail: 'Votre écoute de référence est déjà en place.' },
    { role: 'headphones', name: 'Casque', detail: 'Votre écoute au casque est déjà couverte.' },
  ],
  video: [
    { role: 'microphone', connection: 'usb', name: 'Micro USB', detail: 'Une base voix déjà prête à enregistrer.' },
    { role: 'camera', name: 'Caméra', detail: 'Vous avez déjà de quoi filmer.' },
    { role: 'lighting', name: 'Éclairage', detail: 'Votre lumière est déjà couverte.' },
    { role: 'headphones', name: 'Casque', detail: 'Votre écoute est déjà couverte.' },
  ],
}
const rooms = [
  { value: 'untreated', name: 'Pièce ordinaire', detail: 'Elle peut renvoyer la voix et laisser entendre les bruits autour de vous.' },
  { value: 'treated', name: 'Pièce traitée', detail: 'L’acoustique est mieux maîtrisée ; on peut viser davantage de détail.' },
  { value: 'travel', name: 'En déplacement', detail: 'Le poids et la simplicité d’installation comptent davantage.' },
] as const
const ownedLabels: Record<string, string> = {
  microphone_usb: 'Micro USB',
  microphone_xlr: 'Micro XLR',
  interface: 'Interface audio',
  camera: 'Caméra',
  lighting: 'Éclairage',
  monitors: 'Enceintes de monitoring',
  headphones: 'Casque',
}
const priorities = [
  { value: 'simplicity', name: 'Le plus simple', detail: 'Moins de réglages et une mise en place rapide.' },
  { value: 'value', name: 'Le bon compromis', detail: 'Dépenser seulement si le gain compte pour votre projet.' },
  { value: 'upgradeability', name: 'Préparer la suite', detail: 'Privilégier un setup que vous pourrez faire évoluer.' },
] as const
const roleNames: Record<string, string> = {
  microphone: 'Capture', interface: 'Connexion', headphones: 'Écoute', monitors: 'Écoute',
  camera: 'Image', lighting: 'Lumière', treatment: 'Acoustique', cable: 'Câble', stand: 'Support',
}
const roleReasons: Record<AtelierRole, string> = {
  microphone: 'Couvre la captation de votre voix.',
  interface: 'Relie et alimente les éléments audio de votre chaîne.',
  headphones: 'Permet de contrôler votre son sans repasser dans le micro.',
  monitors: 'Ajoute une écoute de référence adaptée au travail en studio.',
  camera: 'Couvre la captation de votre image.',
  lighting: 'Stabilise le rendu de votre image, quelle que soit la pièce.',
  treatment: 'Réduit l’influence de la pièce sur vos enregistrements.',
  cable: 'Assure la liaison nécessaire entre les appareils.',
  stand: 'Place le matériel correctement pendant l’enregistrement.',
}
const conflictLabels: Record<AtelierRole, string> = {
  microphone: 'un micro', interface: 'une interface audio', headphones: 'un casque', monitors: 'des enceintes de monitoring',
  camera: 'une caméra', lighting: 'un éclairage', treatment: 'un traitement acoustique', cable: 'un câble', stand: 'un support',
}

function humanizeConflict(message: string) {
  return (Object.entries(conflictLabels) as [AtelierRole, string][]).reduce(
    (text, [role, label]) => text.replace(`pour le rôle ${role}`, `pour ${label}`),
    message,
  )
}

export default function AtelierApercuPage() {
  const [project, setProject] = useState<AtelierProfile['project']>('podcast')
  const [startingPoint, setStartingPoint] = useState<StartingPoint>('starter')
  const [ownedEquipment, setOwnedEquipment] = useState<AtelierProfile['ownedEquipment']>([])
  const [room, setRoom] = useState<AtelierProfile['room']>('untreated')
  const [priority] = useState<AtelierProfile['priority']>('value')
  const [budget, setBudget] = useState(800)
  const [step, setStep] = useState(0)
  const [result, setResult] = useState<AtelierRecommendation | null>(null)
  // ponytail: One lock keeps this preview legible; add multiple locks with role-aware controls if users need them.
  const [lockedProductId, setLockedProductId] = useState<string | null>(null)
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')
  const heading = useRef<HTMLHeadingElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (step === 5 && result) heading.current?.focus()
  }, [result, step])

  async function run(nextRoom: AtelierProfile['room'], nextPriority: AtelierProfile['priority'], destination = 5, nextLock = lockedProductId) {
    setStep(destination)
    setState('loading')
    setResult(null)
    setError('')
    try {
      const response = await fetch('/api/atelier/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: {
          project, sourceCount: 1, room: nextRoom, mobility: nextRoom === 'travel' ? 'mobile' : 'fixed', ownedEquipment,
          budget, priority: nextPriority,
        } satisfies AtelierProfile, ...(nextLock ? { lockedProductIds: [nextLock] } : {}) }),
      })
      if (!response.ok) throw new Error(response.status === 503
        ? 'Le catalogue ne permet pas encore une recommandation fiable.'
        : 'La recommandation ne répond pas. Réessaie.')
      const recommendation = await response.json() as AtelierPackRecommendation
      setResult(recommendation)
      setState('idle')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'La recommandation ne répond pas.')
      setState('error')
    }
  }

  const proposal = result
  const total = proposal?.setup.reduce((sum, line) => sum + line.subtotal, 0) ?? 0
  const budgetUsed = budget > 0 ? Math.min(100, (total / budget) * 100) : 0
  const projectName = projects.find(item => item.value === project)?.name ?? 'Votre projet'
  const pointName = startingPoints[project].find(item => item.value === startingPoint)?.name ?? 'Votre situation'
  const roomName = rooms.find(item => item.value === room)?.name ?? 'Votre lieu'
  const ownedSummary = ownedEquipment.length
    ? ownedEquipment.map(item => item.role === 'microphone' ? ownedLabels[`microphone_${item.connection ?? 'usb'}`] : ownedLabels[item.role] ?? item.role).join(' + ')
    : 'Aucun matériel'

  function toggleOwned(role: AtelierRole, connection?: 'usb' | 'xlr') {
    setOwnedEquipment(current => current.some(item => item.role === role && item.connection === connection)
      ? current.filter(item => item.role !== role || item.connection !== connection)
      : [...current, { role, ...(connection ? { connection } : {}) }])
  }

  function back(target: number) {
    if (state === 'loading') return
    if (target < 5) setLockedProductId(null)
    setResult(null)
    if (target < 3) setOwnedEquipment([])
    if (target < 2) setStartingPoint('starter')
    setError('')
    setState('idle')
    setStep(target)
  }

  function restart() {
    setStep(0)
    setResult(null)
    setLockedProductId(null)
    setOwnedEquipment([])
    setStartingPoint('starter')
    setError('')
    setState('idle')
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-5 pb-24 pt-32 text-[#f4efea] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="mb-5 text-sm tracking-wide text-[#d3b27b]">L’Atelier Fluxlab</p>
        <h1 className="max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">Composez votre setup</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#f4efea]/65">
          Une question à la fois. Vos réponses orientent la sélection ; les produits viennent du vrai catalogue Fluxlab.
        </p>

        {proposal && <section aria-label="Progression du budget" className="sticky top-20 z-10 mt-8 rounded-xl border border-[#d3b27b]/35 bg-[#171613]/95 px-5 py-4 backdrop-blur-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm text-[#f4efea]/70">Budget de votre projet</p>
            <p className="font-serif text-2xl tabular-nums">{money(total)} <span className="text-[#f4efea]/55">/ {money(budget)}</span></p>
          </div>
          <div role="progressbar" aria-valuemin={0} aria-valuemax={Math.max(1, budget)} aria-valuenow={Math.min(total, Math.max(1, budget))} aria-valuetext={`${money(total)} sur ${money(budget)}`} className="mt-3 h-1 overflow-hidden rounded-full bg-[#f4efea]/15">
            <div className="h-full bg-[#d3b27b] transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${budgetUsed}%` }} />
          </div>
          <p className="mt-2 text-xs text-[#f4efea]/55">{proposal ? 'Montant provisoire : dépenser le reste n’est pas un objectif.' : 'Une piste chiffrée apparaîtra quand votre situation sera connue.'}</p>
        </section>}

        <div className="mt-10 grid gap-8 md:grid-cols-[180px_1fr]">
          <nav aria-label="Vos choix" className="hidden md:block">
            <ol className="border-l border-[#d3b27b]/35 pl-5">
              {['Budget', 'Projet', 'Point de départ', 'Votre matériel', 'Environnement', 'Votre sélection'].map((label, index) => <li key={label} className="relative pb-9 last:pb-0">
                <span aria-hidden="true" className={`absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full border-2 ${index <= step ? 'border-[#d3b27b] bg-[#d3b27b]' : 'border-[#d3b27b]/40 bg-[#0b0b0b]'}`} />
                {index < step ? <button type="button" onClick={() => back(index)} className="text-left text-sm text-[#f4efea]/70 underline-offset-4 hover:text-[#d3b27b] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d3b27b]">{label}<span className="mt-1 block text-xs text-[#d3b27b]">{index === 0 ? money(budget) : index === 1 ? projectName : index === 2 ? pointName : index === 3 ? (startingPoint === 'starter' ? 'Aucun matériel' : ownedSummary) : index === 4 ? roomName : 'Setup recommandé'}</span></button>
                  : <span aria-current={index === step ? 'step' : undefined} className={`text-sm ${index === step ? 'text-[#d3b27b]' : 'text-[#f4efea]/40'}`}>{label}</span>}
              </li>)}
            </ol>
          </nav>

          <div className="min-w-0">
            <p className="mb-4 text-sm text-[#f4efea]/55 md:hidden">{step > 0 ? `Budget ${money(budget)}` : 'Votre parcours'}{step > 1 ? ` · ${projectName}` : ''}{step > 2 ? ` · ${pointName}` : ''}{step > 3 && ownedEquipment.length ? ' · matériel conservé' : ''}{step > 4 ? ` · ${roomName}` : ''}</p>
            <AnimatePresence mode="wait">
              <motion.section key={step} initial={reducedMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: -12 }} transition={{ duration: reducedMotion ? 0 : 0.24 }} onAnimationComplete={() => heading.current?.focus()} className="rounded-2xl border border-[#d3b27b]/30 bg-[#171613] p-6 sm:p-9">
                {step === 0 && <>
                  <h2 ref={heading} tabIndex={-1} className="font-serif text-3xl outline-none sm:text-4xl">Quel budget souhaitez-vous prévoir ?</h2>
                  <p className="mt-3 max-w-xl text-[#f4efea]/65">C’est un plafond, pas une somme à dépenser. Nous chercherons d’abord ce dont vous avez besoin.</p>
                  <form onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setStep(1) }} className="mt-8 flex flex-wrap items-end gap-4">
                    <label className="grid gap-2 text-sm text-[#f4efea]/75">Budget maximum (€)
                      <input type="number" min="1" max="100000" step="1" required value={budget} onChange={event => setBudget(Number(event.target.value))} className="h-12 w-48 rounded-md border border-[#d3b27b]/35 bg-[#0b0b0b] px-3 text-[#f4efea] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d3b27b]" />
                    </label>
                    <button type="submit" className="h-12 rounded-md bg-[#d3b27b] px-6 font-medium text-[#0b0b0b] hover:bg-[#e3c897] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d3b27b]">Continuer</button>
                  </form>
                </>}

                {step === 1 && <>
                  <h2 ref={heading} tabIndex={-1} className="font-serif text-3xl outline-none sm:text-4xl">Qu’allez-vous créer ?</h2>
                  <p className="mt-3 text-[#f4efea]/65">Le projet détermine les éléments utiles dans votre setup.</p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">{projects.map(item => <button key={item.value} type="button" onClick={() => { setProject(item.value); setStep(2) }} className="min-h-28 rounded-lg border border-[#d3b27b]/25 bg-[#0b0b0b] p-5 text-left transition-colors hover:border-[#d3b27b] hover:bg-[#d3b27b]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d3b27b]"><span className="block font-serif text-xl">{item.name}</span><span className="mt-2 block text-sm text-[#f4efea]/60">{item.detail}</span></button>)}</div>
                </>}

                {step === 2 && <>
                  <h2 ref={heading} tabIndex={-1} className="font-serif text-3xl outline-none sm:text-4xl">Votre point de départ</h2>
                  <p className="mt-3 text-[#f4efea]/65">Choisissez la situation la plus proche de la vôtre. Les questions et le matériel à conserver s’adapteront ensuite.</p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">{startingPoints[project].map(item => <button key={item.value} type="button" onClick={() => { setStartingPoint(item.value); setOwnedEquipment(project === 'video' && item.value === 'upgrade' ? [{ role: 'camera' }, { role: 'lighting' }] : project === 'video' && item.value === 'existing' ? [{ role: 'camera' }] : []); setStep(item.value === 'starter' ? 4 : 3) }} className="min-h-36 rounded-lg border border-[#d3b27b]/25 bg-[#0b0b0b] p-5 text-left transition-colors hover:border-[#d3b27b] hover:bg-[#d3b27b]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d3b27b]"><span className="block font-serif text-xl">{item.name}</span><span className="mt-2 block text-sm text-[#f4efea]/60">{item.detail}</span></button>)}</div>
                </>}

                {step === 3 && <>
                  <h2 ref={heading} tabIndex={-1} className="font-serif text-3xl outline-none sm:text-4xl">{startingPoint === 'starter' ? 'Ce que vous avez déjà' : 'Ce que vous gardez'}</h2>
                  <p className="mt-3 text-[#f4efea]/65">{startingPoint === 'starter' ? 'Ne sélectionnez que le matériel déjà chez vous. Il ne sera pas ajouté au budget.' : 'Sélectionnez ce que votre setup couvre déjà pour éviter les doublons.'}</p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {equipmentOptions[project].map(item => {
                      const selected = ownedEquipment.some(owned => owned.role === item.role && owned.connection === item.connection)
                      return <button key={`${item.role}-${item.connection ?? 'standard'}`} type="button" aria-pressed={selected} onClick={() => toggleOwned(item.role, item.connection)} className={`min-h-32 rounded-lg border p-5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d3b27b] ${selected ? 'border-[#d3b27b] bg-[#d3b27b]/10' : 'border-[#d3b27b]/25 bg-[#0b0b0b] hover:border-[#d3b27b]'}`}><span className="block font-serif text-xl">{item.name}</span><span className="mt-2 block text-sm text-[#f4efea]/60">{item.detail}</span></button>
                    })}
                  </div>
                  <button type="button" onClick={() => setStep(4)} disabled={startingPoint !== 'starter' && ownedEquipment.length === 0} className="mt-6 h-12 rounded-md bg-[#d3b27b] px-6 font-medium text-[#0b0b0b] hover:bg-[#e3c897] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d3b27b] disabled:cursor-not-allowed disabled:opacity-40">Continuer</button>
                  {startingPoint !== 'starter' && ownedEquipment.length === 0 && <p className="mt-3 text-sm text-[#f4efea]/55">Sélectionnez au moins l’élément que vous possédez déjà.</p>}
                </>}

                {step === 4 && <>
                  <h2 ref={heading} tabIndex={-1} className="font-serif text-3xl outline-none sm:text-4xl">Où allez-vous travailler ?</h2>
                  <p className="mt-3 text-[#f4efea]/65">L’environnement change ce que le matériel doit privilégier.</p>
                  <div className="mt-8 grid gap-3">{rooms.map(item => <button key={item.value} type="button" onClick={() => { setRoom(item.value); void run(item.value, 'value', 5) }} className="rounded-lg border border-[#d3b27b]/25 bg-[#0b0b0b] p-5 text-left transition-colors hover:border-[#d3b27b] hover:bg-[#d3b27b]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d3b27b]"><span className="block font-serif text-xl">{item.name}</span><span className="mt-2 block text-sm text-[#f4efea]/60">{item.detail}</span></button>)}</div>
                </>}

                {step === 5 && <>
                  <h2 ref={heading} tabIndex={-1} className="font-serif text-3xl outline-none sm:text-4xl">{result?.proof.chainComplete ? 'Votre sélection' : 'Votre sélection à compléter'}</h2>
                  <p className="mt-3 text-[#f4efea]/65">{state === 'loading' ? 'Nous préparons votre configuration optimale…' : 'La liste reste provisoire si un rôle manque ou si une offre doit être vérifiée.'}</p>
                  <div aria-live="polite" className="mt-6">
                    {state === 'loading' && <p className="text-[#d3b27b]">Vérification du setup…</p>}
                    {state === 'error' && <button type="button" onClick={() => void run(room, priority, 5)} className="mt-4 text-[#d3b27b] underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d3b27b]">Réessayer</button>}
                    {result && <>
                      <p className="text-[#d3b27b]">{result.setup.length} produit{result.setup.length > 1 ? 's' : ''} envisagé{result.setup.length > 1 ? 's' : ''} · {money(total)} sur {money(budget)}</p>
                      {result.proof.chainComplete && <p className="mt-3 text-sm text-[#f4efea]/70">Les rôles nécessaires sont couverts.</p>}
                      {result.conflicts.length > 0 && <p className="mt-3 text-sm text-amber-200">Un élément du setup reste à compléter ; le détail figure dans la chaîne ci-dessous.</p>}
                    </>}
                  </div>
                </>}

                {step > 0 && <button type="button" onClick={() => back(step === 4 && startingPoint === 'starter' ? 2 : step - 1)} disabled={state === 'loading'} className="mt-8 text-sm text-[#f4efea]/65 underline underline-offset-4 hover:text-[#d3b27b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d3b27b] disabled:opacity-40">Retour au choix précédent</button>}
              </motion.section>
            </AnimatePresence>
          <div aria-live="polite" className="mt-8">
          {error && <p role="alert" className="rounded-lg border border-amber-300/40 p-4 text-amber-200">{error}</p>}
          {step === 5 && result && <>
            <section>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-serif text-3xl">Équipement recommandé</h2>
              </div>
              <ol className="mt-5 border-l border-[#d3b27b]/35 pl-5">
                {result.setup.map(line => <li key={line.productId} className="relative pb-4 last:pb-0">
                  <span aria-hidden="true" className="absolute -left-[26px] top-7 h-2.5 w-2.5 rounded-full bg-[#d3b27b]" />
                  <article className="grid gap-5 rounded-xl border border-[#d3b27b]/20 bg-[#171613] p-5 sm:grid-cols-[160px_1fr]">
                    {line.imageUrl ? <div className="flex h-48 items-center justify-center rounded-lg bg-white p-3 sm:aspect-square sm:h-auto"><img src={line.imageUrl} alt={line.name} className="max-h-full max-w-full object-contain" /></div> : <div className="flex h-48 items-center justify-center rounded-lg bg-[#0b0b0b] text-sm text-[#f4efea]/50 sm:aspect-square sm:h-auto">Visuel indisponible</div>}
                    <div>
                      <p className="text-sm text-[#d3b27b]">{roleNames[line.role] ?? line.role}</p>
                      <h3 className="mt-2 font-serif text-xl">{line.name}</h3>
                      <p className="mt-2 text-sm text-[#f4efea]/65">{roleReasons[line.role]}</p>
                      <p className="mt-4">{money(line.subtotal)}{line.quantity > 1 ? ` · ${line.quantity} × ${money(line.price)}` : ''} · {line.bestOffer.merchantName}</p>
                      <p className="mt-1 text-xs text-[#f4efea]/50">Prix et stock à confirmer chez le vendeur{line.bestOffer.lastCheckedAt ? ` · dernière donnée du ${new Date(line.bestOffer.lastCheckedAt).toLocaleDateString('fr-FR')}` : ' · date de vérification inconnue'}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        <button type="button" disabled={state === 'loading'} onClick={() => { const nextLock = lockedProductId === line.productId ? null : line.productId; setLockedProductId(nextLock); void run(room, priority, 5, nextLock) }} className="rounded-md border border-[#d3b27b]/50 px-3 py-2 text-sm text-[#d3b27b] hover:bg-[#d3b27b]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d3b27b] disabled:opacity-40">{lockedProductId === line.productId ? 'Libérer ce produit' : lockedProductId ? 'Garder à la place' : 'Garder ce produit'}</button>
                        <Link href={`/produit/${line.slug}`} className="text-sm text-[#d3b27b] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d3b27b]">Voir la fiche produit</Link>
                      </div>
                    </div>
                  </article>
                </li>)}
                {result.conflicts.length > 0 && <li className="relative rounded-xl border border-amber-300/30 bg-[#171613] p-5 text-amber-200">
                  <span aria-hidden="true" className="absolute -left-[26px] top-7 h-2.5 w-2.5 rounded-full border border-amber-200 bg-[#171613]" />
                  <h3 className="font-serif text-xl">À compléter avant l’achat</h3>
                  <ul className="mt-2 space-y-1 text-sm">{result.conflicts.map((conflict, index) => <li key={`${conflict.code}-${index}`}>{humanizeConflict(conflict.message)}</li>)}</ul>
                </li>}
              </ol>
            </section>
            {result.alternatives.some(alternative => alternative.product.status === 'ready') && <section className="mt-10">
              <h2 className="font-serif text-3xl">Autres pistes</h2>
              <p className="mt-2 max-w-xl text-sm text-[#f4efea]/60">Un autre produit peut modifier le prix ou les connexions nécessaires. Gardez-le pour recalculer le setup.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">{result.alternatives.filter(alternative => alternative.product.status === 'ready').slice(0, 4).map(alternative => <article key={alternative.product.productId} className="rounded-xl border border-[#d3b27b]/20 bg-[#171613] p-5">
                <p className="text-sm text-[#d3b27b]">{alternative.kind === 'save' ? 'Dépenser moins' : 'Investir davantage'}</p>
                <h3 className="mt-2 font-serif text-xl">{alternative.product.name}</h3>
                <p className="mt-2 text-sm text-[#f4efea]/65">{alternative.reason}</p>
                <p className="mt-3">{money(alternative.product.price)} l’unité{result.proof.chainComplete ? ` · ${alternative.priceDelta >= 0 ? '+' : ''}${money(alternative.priceDelta)} sur le setup` : ''}</p>
                <button type="button" disabled={state === 'loading'} onClick={() => { setLockedProductId(alternative.product.productId); void run(room, priority, 5, alternative.product.productId) }} className="mt-4 rounded-md border border-[#d3b27b]/50 px-3 py-2 text-sm text-[#d3b27b] hover:bg-[#d3b27b]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d3b27b] disabled:opacity-40">Garder et recalculer</button>
              </article>)}</div>
            </section>}
            <button type="button" onClick={restart} className="mt-10 rounded-md bg-[#d3b27b] px-5 py-3 font-medium text-[#0b0b0b] hover:bg-[#e3c897] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d3b27b]">Recommencer avec un autre besoin</button>
          </>}
        </div>
          </div>
        </div>
      </div>
    </main>
  )
}
