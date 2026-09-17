# L’Atelier Fluxlab Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer le configurateur linéaire « Labo IA » par un parcours arborescent accessible qui compose progressivement une liste d’achat depuis le moteur fiable de L’Atelier.

**Architecture:** Un reducer client pilote réponses et produits verrouillés. L’interface consomme exclusivement `POST /api/atelier/recommendation` fourni par le plan foundation ; elle ne charge ni ne score le catalogue complet et n’appelle jamais OpenRouter.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind, Framer Motion, Lucide React.

**Spec:** `docs/superpowers/specs/2026-09-14-atelier-fluxlab-design.md`

## Global Constraints

- Exécuter d’abord `docs/superpowers/plans/2026-09-14-atelier-fluxlab-foundation.md`.
- Aucune nouvelle dépendance, aucun visuel généré, aucun appel OpenRouter dans le parcours.
- Nom public : **L’Atelier Fluxlab** ; retirer les promesses et scores IA.
- Les prix, preuves, réserves et conflits viennent du moteur et ne sont jamais embellis côté client.
- Ne pas optimiser les images Supabase via Vercel.
- Vérifier 1440, 820 et 390 px, clavier, focus et mouvement réduit.
- Pas de commit, push, merge ou déploiement sans autorisation.

## Contract Consumed

```ts
export interface AtelierProfile {
  project: 'podcast' | 'streaming' | 'music_vocals' | 'video'
  sourceCount: 1 | 2 | 'many'
  room: 'untreated' | 'treated' | 'travel'
  mobility: 'fixed' | 'mobile'
  ownedEquipment: OwnedEquipment[]
  budget: number
  priority: 'simplicity' | 'value' | 'upgradeability'
  computer?: 'mac' | 'pc'
  note?: string
}

export interface AtelierRecommendationRequest {
  profile: AtelierProfile
  lockedProductIds?: string[]
}

export interface AtelierRecommendation {
  setup: AtelierSetupLine[]
  candidates: AtelierCandidate[]
  alternatives: AtelierAlternative[]
  proof: AtelierProof
  contextualGuide: AtelierGuide | null
  conflicts: AtelierConflict[]
  unavailableReason?: string
}
```

## File Map

| Fichier | Responsabilité |
| --- | --- |
| `app/configurateur/page.tsx` | Route shell |
| `lib/atelier/questions.ts` | Arbre conditionnel pur |
| `lib/atelier/flow.ts` | Reducer, verrous et adaptateur HTTP |
| `lib/atelier/analytics.ts` | Événements anonymes |
| `components/atelier/AtelierFlow.tsx` | Orchestration responsive |
| `components/atelier/AtelierQuestionTree.tsx` | Question et branches |
| `components/atelier/AtelierWorkbench.tsx` | Aperçu progressif et verrous |
| `components/atelier/AtelierResultChain.tsx` | Chaîne, preuves, offres et guide |
| `tests/atelier-experience.test.mjs` | Contrat UI sans dépendance |

---

### Task 1: Rename the public surface and reduce the route shell

**Files:**
- Modify: `app/configurateur/page.tsx`, `app/configurateur/layout.tsx`, `app/configurateur/loading.tsx`, `components/client/Navbar.tsx`
- Create: `tests/atelier-experience.test.mjs`

**Interfaces:**
- Produces: route `/configurateur` rendue par `<AtelierFlow />`.

- [ ] Écrire les assertions en échec :

```js
assert.match(layout, /title:\s*['"]L’Atelier Fluxlab/)
assert.match(page, /<AtelierFlow\s*\/>/)
assert.doesNotMatch(page + navbar, /Labo IA|score IA|générer avec l’IA|IA en réflexion/i)
```

- [ ] Vérifier l’échec avec `node tests/atelier-experience.test.mjs`.
- [ ] Réduire la page à l’import et au rendu d’`AtelierFlow`.
- [ ] Utiliser la description « Composez une liste d’achat cohérente, adaptée à votre projet et à votre budget. »
- [ ] Renommer les CTA en « L’Atelier Fluxlab » et « Ouvrir l’Atelier ».
- [ ] Relancer le test et TypeScript.

### Task 2: Define the pure guided tree and client state

**Files:**
- Create: `lib/atelier/questions.ts`
- Create: `lib/atelier/flow.ts`
- Modify: `tests/atelier-experience.test.mjs`

**Interfaces:**

```ts
export type AtelierQuestionId =
  | 'project' | 'sourceCount' | 'room' | 'mobility'
  | 'ownedEquipment' | 'budget' | 'priority' | 'computer' | 'note'

export interface AtelierQuestion {
  id: AtelierQuestionId
  prompt: string
  options?: readonly AtelierOption[]
  isComplete(profile: Partial<AtelierProfile>): boolean
}

export function getNextQuestion(profile: Partial<AtelierProfile>): AtelierQuestion | null
export function getQuestionPath(profile: Partial<AtelierProfile>): AtelierQuestionId[]

export interface AtelierFlowState {
  profile: Partial<AtelierProfile>
  currentQuestionId: AtelierQuestionId
  lockedProductIds: string[]
  recommendation: AtelierRecommendation | null
  status: 'answering' | 'loading' | 'ready' | 'catalog_unavailable' | 'error'
}

export function atelierFlowReducer(state: AtelierFlowState, action: AtelierFlowAction): AtelierFlowState
export function buildAtelierRequest(state: AtelierFlowState): AtelierRecommendationRequest | null
export function requestRecommendation(request: AtelierRecommendationRequest, signal?: AbortSignal): Promise<AtelierRecommendation>
```

- [ ] Tester le chemin `project → sourceCount conditionnel → room → mobility → ownedEquipment → budget → priority → computer conditionnel → note`.
- [ ] Limiter chaque question à deux à quatre choix et demander USB/XLR/autre pour un micro existant inconnu.
- [ ] Tester `lock`, `unlock`, retour et invalidation d’une recommandation devenue obsolète.
- [ ] Implémenter l’unique requête :

```ts
const response = await fetch('/api/atelier/recommendation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(request),
  signal,
})
```

- [ ] Transformer 503 en `catalog_unavailable`, les autres échecs en `error`.
- [ ] Vérifier l’absence de `useProducts`, `generateRecommendation` et OpenRouter dans ce flux.
- [ ] Exécuter test UI et TypeScript.

### Task 3: Build the accessible tree and progressive workbench

**Files:**
- Create: `components/atelier/AtelierQuestionTree.tsx`
- Create: `components/atelier/AtelierWorkbench.tsx`
- Modify: `tests/atelier-experience.test.mjs`

**Interfaces:**

```ts
export function AtelierQuestionTree(props: {
  state: AtelierFlowState
  question: AtelierQuestion | null
  dispatch: React.Dispatch<AtelierFlowAction>
  onComplete(): void
}): JSX.Element

export function AtelierWorkbench(props: {
  profile: Partial<AtelierProfile>
  recommendation: AtelierRecommendation | null
  lockedProductIds: readonly string[]
  dispatch: React.Dispatch<AtelierFlowAction>
}): JSX.Element
```

- [ ] Tester `aria-labelledby`, `aria-live="polite"`, `aria-pressed`, retour et classes `motion-reduce`.
- [ ] Rendre une seule question visible avec des boutons natifs ; conserver le chemin répondu comme navigation de retour.
- [ ] Faire apparaître deux à quatre branches dont chaque liaison correspond à une conséquence textuelle.
- [ ] Afficher dans l’établi Capture, Interface/traitement, Écoute et Image/lumière selon le profil.
- [ ] Afficher une proposition maximum par rôle avec « Envisagé », « Conservé », « Partiel » ou « À vérifier ».
- [ ] Ajouter « Garder dans mon setup » et « Libérer ce produit ».
- [ ] Utiliser `unoptimized={isDirectSupabaseStorageUrl(imageUrl)}` pour les images Supabase.
- [ ] Vérifier établi sticky à 1440, sous la question à 820 et une colonne sans débordement à 390.

### Task 4: Compose the flow and final purchase chain

**Files:**
- Create: `components/atelier/AtelierFlow.tsx`
- Create: `components/atelier/AtelierResultChain.tsx`
- Modify: `tests/atelier-experience.test.mjs`

- [ ] Tester `useReducer(atelierFlowReducer)`, les trois composants, le chargement et les erreurs.
- [ ] Composer le desktop en arbre + établi, puis la lecture verticale tablette/mobile.
- [ ] Afficher le résultat comme chaîne sémantique : Capture → Interface/traitement → Écoute → Image/lumière.
- [ ] Pour chaque ligne afficher rôle, état, quantité, sous-total, raison, offre en stock, marchand et date si connue.
- [ ] Afficher « Liste d’achat », marge budgétaire, alternative économique et montée en gamme uniquement si renvoyées.
- [ ] Remplacer le score par : Plafond respecté, Chaîne complète, Connexions vérifiées et Offres disponibles.
- [ ] Afficher les conflits avant les liens ; conserver à l’écran un produit verrouillé incompatible.
- [ ] Utiliser `target="_blank"` et `rel="nofollow sponsored noopener"` ; aucun CTA pour une offre indisponible.
- [ ] Afficher un seul guide avec « Pourquoi ce guide ».
- [ ] Sur 503, conserver profil et verrous puis proposer « Réessayer ».
- [ ] Utiliser une animation de composition unique ; `useReducedMotion()` conserve toute l’information sans animation.

### Task 5: Add minimal analytics and acceptance verification

**Files:**
- Create: `lib/atelier/analytics.ts`
- Modify: `components/atelier/AtelierFlow.tsx`
- Modify: `components/atelier/AtelierResultChain.tsx`
- Modify: `tests/atelier-experience.test.mjs`

**Interfaces:**

```ts
export type AtelierAnalyticsEvent =
  | 'atelier_started'
  | 'atelier_answered'
  | 'atelier_lock_changed'
  | 'atelier_recommendation_ready'
  | 'atelier_catalog_unavailable'
  | 'atelier_offer_opened'

export function trackAtelier(
  event: AtelierAnalyticsEvent,
  properties: Record<string, string | number | boolean | undefined>,
): void
```

- [ ] Tester tous les noms d’événements et l’absence de note libre ou réponse brute.
- [ ] Envoyer seulement project, question_id, answer_value, budget, product_id, merchant_name, price et is_locked.
- [ ] Vérifier les huit scénarios de la spec avec OpenRouter absent.
- [ ] Vérifier visuellement 1440, 820 et 390 px, focus clavier et mouvement réduit.
- [ ] Exécuter :

```powershell
npm run test:atelier
node tests/atelier-experience.test.mjs
npm run test:homepage
npm run test:images
npx tsc --noEmit --incremental false
npm run build
git diff --check
```

## Self-Review

| Exigence | Tâches |
| --- | --- |
| Renommage et indépendance LLM | 1, 2, 4 |
| Arbre conditionnel | 2, 3 |
| Établi et verrouillage | 2, 3 |
| Chaîne, offres, alternatives et guide | 4 |
| Erreurs, conflits et incertitudes | 3, 4 |
| Responsive, accessibilité et mouvement | 3, 4, 5 |
| Mesure produit sans texte privé | 5 |

## Execution Handoff

L’utilisateur a choisi l’exécution par sous-agents. Commencer ce plan uniquement après validation du contrat API du plan foundation, avec un agent frais et une revue par tâche.
