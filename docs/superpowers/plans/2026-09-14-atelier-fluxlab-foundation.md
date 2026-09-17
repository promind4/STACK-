# L’Atelier Fluxlab Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire une source de vérité déterministe qui transforme le catalogue Fluxlab en setups complets, achetables et strictement contenus dans le budget.

**Architecture:** Le navigateur envoie un profil compact à une route serveur. Le serveur charge les produits actifs, dérive leur profil depuis la catégorie, les spécifications et les éventuelles données éditoriales, filtre les offres, puis exécute un moteur pur. OpenRouter ne sélectionne jamais les produits.

**Tech Stack:** Next.js 14, TypeScript, Supabase, Node 24 test runner.

**Spec:** `docs/superpowers/specs/2026-09-14-atelier-fluxlab-design.md`

## Global Constraints

- Budget plafond strict, sans tolérance de dépassement.
- `ready` peut être principal ; `partial` seulement alternative avec réserve ; `to_enrich` est exclu.
- Prix calculés uniquement depuis une offre en stock, positive, en EUR et munie d’un lien.
- Aucune classification principale fondée sur le nom, la marque ou le slug produit.
- LLM facultatif et jamais source de vérité.
- Pas de nouvelle dépendance ; pas d’optimisation Vercel des images Supabase.
- Pas de commit, push, merge, migration distante ou déploiement sans autorisation.

## File Map

| Fichier | Responsabilité |
| --- | --- |
| `lib/atelier/types.ts` | Contrats partagés profil, catalogue, setup, preuve et conflit |
| `lib/atelier/categoryDefaults.ts` | Taxonomie déterministe par slug de catégorie |
| `lib/atelier/profile.ts` | Fusion catégorie, specs, éditorial et surcharge |
| `lib/atelier/offers.ts` | Sélection des offres achetables |
| `lib/atelier/requirements.ts` | Conversion du profil visiteur en rôles et contraintes |
| `lib/atelier/engine.ts` | Construction, dépendances, budget, améliorations et alternatives |
| `lib/atelier/repository.ts` | Chargement Supabase côté serveur |
| `app/api/atelier/recommendation/route.ts` | Validation HTTP et appel du moteur |
| `supabase/migrations/20260914_atelier_profiles.sql` | Profil JSONB et index non destructifs |
| `scripts/backfill-atelier-profiles.mjs` | Audit puis écriture explicite des profils |
| `tests/atelier/*.test.ts` | Scénarios fonctionnels purs |

---

### Task 1: Freeze shared contracts and product readiness

**Files:**
- Create: `lib/atelier/types.ts`
- Create: `lib/atelier/categoryDefaults.ts`
- Create: `lib/atelier/profile.ts`
- Create: `tests/atelier/profile.test.ts`
- Modify: `package.json`

**Interfaces:**

```ts
export type RecommendationStatus = 'ready' | 'partial' | 'to_enrich'
export type AtelierRole = 'microphone' | 'interface' | 'headphones' | 'monitors' | 'camera' | 'lighting' | 'treatment' | 'cable' | 'stand'

export interface RecommendationProfile {
  role?: AtelierRole
  subtype?: string
  uses: string[]
  connections: string[]
  requires: AtelierRole[]
  sourceCapacity?: number
  roomFit: Array<'untreated' | 'treated' | 'travel'>
  mobility?: 'fixed' | 'mobile'
  complexity?: 'simple' | 'moderate' | 'advanced'
  qualities: string[]
  status: RecommendationStatus
  uncertainty: string[]
}

export function deriveRecommendationProfile(input: {
  categorySlug: string | null
  specs: Record<string, unknown>
  editorial?: Partial<RecommendationProfile>
  override?: Partial<RecommendationProfile>
}): RecommendationProfile
```

- [ ] Écrire un test qui vérifie qu’une catégorie inconnue donne `to_enrich`, qu’un rôle connu mais incomplet donne `partial`, et qu’un micro XLR documenté donne `ready`.
- [ ] Vérifier l’échec avec `node --experimental-strip-types --test tests/atelier/profile.test.ts`.
- [ ] Ajouter `"test:atelier": "node --experimental-strip-types --test tests/atelier/*.test.ts"` dans `package.json`.
- [ ] Définir les valeurs de catégorie pour les slugs existants, sans marques ni noms commerciaux.
- [ ] Fusionner avec la priorité `override > editorial > specs > categoryDefaults`.
- [ ] Déduire le statut à partir des champs obligatoires du rôle ; ne jamais promouvoir automatiquement un rôle inconnu.
- [ ] Exécuter `npm run test:atelier` et `npx tsc --noEmit --incremental false`.

### Task 2: Select only purchasable offers

**Files:**
- Modify: `lib/atelier/types.ts`
- Create: `lib/atelier/offers.ts`
- Create: `tests/atelier/offers.test.ts`
- Modify: `lib/transformers.ts`

**Interfaces:**

```ts
export interface AtelierOffer {
  merchantName: string
  price: number
  currency: 'EUR'
  affiliateLink: string
  inStock: boolean
  lastCheckedAt?: string
}

export function selectBestAvailableOffer(
  offers: readonly AtelierOffer[],
): AtelierOffer | null
```

- [ ] Tester qu’une offre moins chère hors stock perd face à une offre en stock et qu’un prix nul, une autre devise ou un lien vide est rejeté.
- [ ] Vérifier l’échec ciblé.
- [ ] Implémenter un filtre puis un tri croissant stable ; retourner `null` sans offre exploitable.
- [ ] Faire utiliser la même règle à `transformProduct` pour son prix façade et son offre affichée.
- [ ] Vérifier `npm run test:atelier`, `npm run test:images` et TypeScript.

### Task 3: Convert answers into explicit requirements

**Files:**
- Modify: `lib/atelier/types.ts`
- Create: `lib/atelier/requirements.ts`
- Create: `tests/atelier/requirements.test.ts`

**Interfaces:**

```ts
export interface OwnedEquipment {
  role: AtelierRole
  productId?: string
  connection?: 'usb' | 'xlr' | 'other'
}

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

export interface AtelierRequirement {
  role: AtelierRole
  quantity: number
  required: boolean
  constraints: string[]
}

export function buildRequirements(profile: AtelierProfile): AtelierRequirement[]
```

- [ ] Tester podcast solo, podcast duo, streaming en pièce bruyante, musique traitée, nomade et micro XLR déjà possédé.
- [ ] Vérifier que le duo exige deux sources et une interface d’au moins deux entrées ; le XLR possédé exige une interface ; le nomade exclut les éléments fixes.
- [ ] Implémenter uniquement les branches couvertes par ces scénarios.
- [ ] Exécuter les tests ciblés puis toute la suite Atelier.

### Task 4: Build one deterministic recommendation engine

**Files:**
- Modify: `lib/atelier/types.ts`
- Create: `lib/atelier/engine.ts`
- Create: `tests/atelier/engine.test.ts`

**Interfaces:**

```ts
export interface AtelierCatalogProduct {
  id: string
  slug: string
  name: string
  brand: string
  imageUrl: string | null
  profile: RecommendationProfile
  offers: AtelierOffer[]
}

export interface AtelierRecommendationRequest {
  profile: AtelierProfile
  lockedProductIds?: string[]
}

export interface AtelierSetupLine {
  productId: string
  slug: string
  name: string
  brand: string
  imageUrl: string | null
  role: AtelierRole
  state: 'selected' | 'locked' | 'owned'
  quantity: number
  price: number
  subtotal: number
  bestOffer: AtelierOffer
  reason: string
  requires: AtelierRole[]
  status: RecommendationStatus
}

export interface AtelierCandidate {
  role: AtelierRole
  product: Omit<AtelierSetupLine, 'state' | 'quantity' | 'subtotal'>
  reason: string
}

export interface AtelierAlternative {
  kind: 'save' | 'upgrade'
  replacesProductId: string
  product: AtelierCandidate['product']
  priceDelta: number
  reason: string
}

export interface AtelierProof {
  budgetRespected: boolean
  chainComplete: boolean
  connectionsVerified: boolean
  offersAvailable: boolean
}

export interface AtelierGuide {
  slug: string
  title: string
  reason: string
}

export interface AtelierConflict {
  code: 'budget_insufficient' | 'missing_dependency' | 'locked_product_incompatible' | 'data_unknown'
  message: string
  productId?: string
  resolutions: Array<'unlock_product' | 'increase_budget' | 'reduce_scope' | 'verify_data'>
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

export function recommendAtelier(
  catalog: readonly AtelierCatalogProduct[],
  request: AtelierRecommendationRequest,
): AtelierRecommendation
```

- [ ] Écrire les fixtures et assertions des huit scénarios de la spec.
- [ ] Ajouter la reproduction : budget 800 €, micro USB 300 €, micro XLR 500 €, casque 100 €, pied 30 €, interface 150 €. Toute substitution vers XLR doit inclure l’interface et rester à 800 € maximum.
- [ ] Vérifier les échecs avant implémentation.
- [ ] Implémenter dans cet ordre : exigences, candidats principaux `ready`, setup minimal, fermeture des dépendances, total, améliorations, recalcul complet, alternatives. Un produit `partial` ne peut apparaître que dans `alternatives` avec sa réserve ; `to_enrich` est absent.
- [ ] Calculer chaque ligne depuis `quantity * bestOffer.price`; ne jamais lire un prix façade.
- [ ] Si un setup complet est impossible, retourner les lignes possibles avec un conflit et `unavailableReason`.
- [ ] Produire des preuves booléennes, pas un score : `budgetRespected`, `chainComplete`, `connectionsVerified`, `offersAvailable`.
- [ ] Exécuter `npm run test:atelier` et TypeScript.

### Task 5: Preserve locked products and expose conflicts

**Files:**
- Modify: `lib/atelier/engine.ts`
- Modify: `tests/atelier/engine.test.ts`

**Interfaces:**
- Consumes: `lockedProductIds`.
- Produces: lignes `state: 'locked'` ou conflit `locked_product_incompatible`.

- [ ] Tester un produit verrouillé compatible, un produit trop cher et un micro XLR verrouillé sans marge pour son interface.
- [ ] Vérifier les échecs.
- [ ] Insérer les produits verrouillés avant la sélection automatique, fermer leurs dépendances, puis calculer le budget.
- [ ] Ne jamais remplacer silencieusement un verrou ; retourner les résolutions `unlock_product`, `increase_budget` ou `reduce_scope`.
- [ ] Relancer toute la suite Atelier.

### Task 6: Add server repository and stable API

**Files:**
- Create: `lib/atelier/repository.ts`
- Create: `app/api/atelier/recommendation/route.ts`
- Create: `tests/atelier/api-contract.test.ts`

**Interfaces:**

```ts
export async function loadAtelierCatalog(): Promise<AtelierCatalogProduct[]>
// POST /api/atelier/recommendation
// body: AtelierRecommendationRequest
// 200: AtelierRecommendation
// 400: { error: 'invalid_profile' }
// 503: { error: 'catalog_unavailable' }
```

- [ ] Tester le contrat de validation et vérifier qu’aucune clé service n’est envoyée au navigateur.
- [ ] Charger côté serveur `products` actifs avec `categories(slug)` et `product_offers`.
- [ ] Dériver les profils, sélectionner les offres et exclure `to_enrich` avant le moteur.
- [ ] Retourner 400 pour un profil invalide et 503 si Supabase échoue ou si aucun produit éligible n’existe.
- [ ] Vérifier tests, TypeScript et absence de `useProducts` dans la route.

### Task 7: Add progressive persistence and switch off AI-first selection

**Files:**
- Create: `supabase/migrations/20260914_atelier_profiles.sql`
- Create: `scripts/backfill-atelier-profiles.mjs`
- Modify: `app/configurateur/page.tsx`
- Modify: `app/api/ai-setup/route.ts` or delete after all callers are removed
- Create: `tests/atelier/migration-contract.test.ts`

**Interfaces:**

```sql
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS recommendation_profile jsonb NOT NULL DEFAULT '{}'::jsonb;
CREATE INDEX IF NOT EXISTS idx_products_recommendation_profile
  ON products USING gin (recommendation_profile);
```

- [ ] Tester que la migration est additive et que le script est en lecture seule sans `--write`.
- [ ] Le script doit paginer, dériver un profil, afficher les comptes par statut et n’écrire qu’avec `--write`.
- [ ] Ne jamais écraser une valeur explicitement présente dans `recommendation_profile`.
- [ ] Faire appeler `POST /api/atelier/recommendation` au configurateur existant avant sa refonte visuelle.
- [ ] Supprimer le chemin `/api/ai-setup` seulement après `rg "ai-setup|OPENROUTER" app components lib` sans appel de sélection restant.
- [ ] Vérifier qu’un catalogue sans colonnes enrichies continue de fonctionner par dérivation catégorie + specs.
- [ ] Exécuter `npm run test:atelier`, `npm run test:homepage`, `npm run test:images`, TypeScript, `npm run build` et `git diff --check`.

## Self-Review

| Exigence | Tâches |
| --- | --- |
| États catalogue et nouveaux produits | 1, 6, 7 |
| Prix et stock fiables | 2, 4, 6 |
| Profils et dépendances | 3, 4 |
| Budget et montée en gamme | 4 |
| Produit verrouillé | 5 |
| Un moteur unique sans LLM requis | 4, 6, 7 |
| Migration progressive des 347 produits | 6, 7 |
| Scénarios de référence | 3, 4, 5, 7 |

## Execution Handoff

Exécuter ce plan avant `docs/superpowers/plans/2026-09-14-atelier-fluxlab-experience.md`. L’utilisateur a déjà choisi l’exécution par sous-agents ; chaque tâche reçoit un agent frais et une revue avant la suivante.
