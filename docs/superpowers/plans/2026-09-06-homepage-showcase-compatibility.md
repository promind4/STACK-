# Homepage Showcase & Compatibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recomposer la sélection produits, le parcours de compatibilité et les repères de confiance pour correspondre à la référence cinématique sans numérotation répétitive ni fausse promesse.

**Architecture:** Conserver les données produits et les liens existants, mais introduire une variante de carte réservée à la homepage. Remplacer la liste de compatibilité par un graphe visuel centré sur « Votre setup » : chaque vrai produit se relie à ce centre avec un rôle explicite, ce qui donne un sens aux lignes sans inventer de connexion matérielle. Isoler le bandeau de confiance dans un composant dédié avec des pictogrammes SVG accessibles.

**Tech Stack:** Next.js 14, React, TypeScript, Tailwind CSS, `next/image`, tests de contrat Node.js.

---

### Task 1: Étendre le contrat visuel de la homepage

**Files:**
- Modify: `tests/homepage-design.test.mjs`

- [ ] **Step 1: Ajouter les assertions qui décrivent la nouvelle composition**

Ajouter des assertions qui imposent la variante compacte, le centre du graphe, les pictogrammes et l’absence de numéros décoratifs :

```js
const showcase = await readFile(new URL('../components/home/HomeProductShowcase.tsx', import.meta.url), 'utf8')
const compatibility = await readFile(new URL('../components/home/CompatibilityPreview.tsx', import.meta.url), 'utf8')
const contextGrid = await readFile(new URL('../components/home/HeroContextGrid.tsx', import.meta.url), 'utf8')
const trustStrip = await readFile(new URL('../components/home/HomeTrustStrip.tsx', import.meta.url), 'utf8')

assert.match(card, /home-showcase/)
assert.match(showcase, /variant="home-showcase"/)
assert.match(compatibility, /Votre setup/)
assert.match(compatibility, /roleLabels/)
assert.doesNotMatch(compatibility, /0\{index \+ 1\}/)
assert.doesNotMatch(contextGrid, /num:/)
assert.match(trustStrip, /aria-hidden/)
assert.doesNotMatch(trustStrip, /livraison offerte/i)
```

- [ ] **Step 2: Exécuter le test et constater l’échec**

Run: `npm run test:homepage`

Expected: FAIL car `HomeTrustStrip.tsx`, la variante `home-showcase` et le centre du graphe n’existent pas.

- [ ] **Step 3: Commit du contrat rouge**

```bash
git add tests/homepage-design.test.mjs
git commit -m "test: define product showcase composition"
```

### Task 2: Retirer les numéros des cartes de contexte

**Files:**
- Modify: `components/home/HeroContextGrid.tsx`

- [ ] **Step 1: Remplacer les caractères et numéros par des SVG dédiés**

Définir quatre petits composants SVG (`NoiseIcon`, `PlugIcon`, `BudgetIcon`, `TravelIcon`) utilisant `stroke="currentColor"`, puis réduire les entrées à :

```tsx
const entries = [
  { label: 'Pièce bruyante', description: 'Réduire le bruit, clarifier la voix.', href: '/categorie/espace-bruyant', Icon: NoiseIcon },
  { label: 'Plug & play', description: "Aller à l'essentiel, sans friction.", href: '/categorie/plug-and-play', Icon: PlugIcon },
  { label: 'Budget serré', description: 'Prioriser ce qui change vraiment tout.', href: '/categorie/petit-budget', Icon: BudgetIcon },
  { label: 'Créateur nomade', description: 'Rester léger, compact et prêt.', href: '/categorie/createur-nomade', Icon: TravelIcon },
] as const
```

Dans chaque lien, rendre `<Icon />` dans un cadre carré discret de 38 px et supprimer toute utilisation de `num`.

- [ ] **Step 2: Vérifier la structure**

Run: `npm run test:homepage`

Expected: le contrôle concernant `num:` passe ; les contrôles des tâches suivantes restent rouges.

- [ ] **Step 3: Commit**

```bash
git add components/home/HeroContextGrid.tsx
git commit -m "refactor: simplify homepage context cards"
```

### Task 3: Créer une carte produit presque carrée pour la homepage

**Files:**
- Modify: `components/ui/ProductCard.tsx`
- Modify: `components/home/HomeProductShowcase.tsx`

- [ ] **Step 1: Ajouter une variante sans modifier les cartes des catégories**

Étendre les propriétés :

```tsx
interface ProductCardProps {
  product: DBProduct
  className?: string
  editorialBadge?: 'choix' | 'coup-de-coeur'
  variant?: 'default' | 'home-showcase'
}
```

Pour `home-showcase`, utiliser une grille interne compacte avec un conteneur global à rapport proche de `4/5`, une zone image blanche légèrement majoritaire et des espacements réduits. Conserver `object-contain`, `mix-blend-multiply`, le stock, les offres et le prix. Ne pas changer le rendu de `variant="default"`.

- [ ] **Step 2: Activer la variante dans la sélection**

```tsx
<ProductCard
  key={product.id}
  product={product}
  variant="home-showcase"
  editorialBadge={index === 1 ? 'choix' : undefined}
/>
```

Élargir la zone de sélection desktop et conserver `grid-cols-2 sm:grid-cols-3` pour le responsive.

- [ ] **Step 3: Vérifier TypeScript et le test de contrat**

Run: `npx tsc --noEmit && npm run test:homepage`

Expected: TypeScript PASS et assertion de variante PASS.

- [ ] **Step 4: Commit**

```bash
git add components/ui/ProductCard.tsx components/home/HomeProductShowcase.tsx
git commit -m "style: square homepage product cards"
```

### Task 4: Remplacer la liste de compatibilité par un graphe cohérent

**Files:**
- Modify: `components/home/CompatibilityPreview.tsx`

- [ ] **Step 1: Définir les rôles sans prétendre connaître toutes les connectiques**

```tsx
const roleLabels = ['Interface', 'Voix', 'Image'] as const
```

Chaque produit devient une tuile avec son image réelle, son nom et son rôle. Les trois tuiles sont positionnées autour d’un centre « Votre setup ». Une ligne SVG part du centre et se termine à l’ancrage visible de chaque tuile ; les points de départ et d’arrivée sont matérialisés.

- [ ] **Step 2: Construire le décor abstrait**

Utiliser uniquement des couches CSS (`radial-gradient`, grain en pseudo-couche, halo doré) afin qu’aucun objet du fond ne puisse contredire les produits réels. Les tuiles restent en HTML et les images utilisent `next/image`, `object-contain`, un fond blanc neutre et `unoptimized` pour les URL Supabase directes.

- [ ] **Step 3: Gérer les données incomplètes**

Créer les lignes depuis `nodes.length` et ne rendre une tuile que si son produit existe. Si une image manque, afficher le nom et le rôle dans une tuile neutre ; aucune ligne orpheline ne doit rester.

- [ ] **Step 4: Garder une action courte**

Sous la scène, conserver uniquement :

```tsx
<Link href="/configurateur">Tester la cohérence de mon setup →</Link>
```

Supprimer la liste 01–03 et le paragraphe long.

- [ ] **Step 5: Vérifier**

Run: `npx tsc --noEmit && npm run test:homepage && npm run test:images`

Expected: les trois commandes PASS.

- [ ] **Step 6: Commit**

```bash
git add components/home/CompatibilityPreview.tsx
git commit -m "feat: visualize product compatibility graph"
```

### Task 5: Créer le bandeau de confiance illustré

**Files:**
- Create: `components/home/HomeTrustStrip.tsx`
- Modify: `components/home/HomeProductShowcase.tsx`

- [ ] **Step 1: Créer quatre entrées vérifiables**

```tsx
const assurances = [
  { title: 'Offres comparées', detail: 'Selon les marchands disponibles', Icon: CompareIcon },
  { title: 'Livraison', detail: 'Conditions affichées par le marchand', Icon: DeliveryIcon },
  { title: 'Disponibilité', detail: 'Stock visible avant le choix', Icon: StockIcon },
  { title: 'Décision guidée', detail: 'Besoin, budget, compatibilité', Icon: GuidanceIcon },
] as const
```

Les icônes sont des SVG linéaires dorés, placés dans des carrés ouverts sans pastille ronde. Leur `svg` porte `aria-hidden="true"`, tandis que les textes restent lisibles.

- [ ] **Step 2: Remplacer le tableau numéroté**

Importer puis rendre `<HomeTrustStrip />` sous le bloc sélection/compatibilité. Supprimer le `.map()` qui génère les numéros `01` à `04`.

- [ ] **Step 3: Exécuter le contrat complet**

Run: `npm run test:homepage`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add components/home/HomeTrustStrip.tsx components/home/HomeProductShowcase.tsx tests/homepage-design.test.mjs
git commit -m "feat: add illustrated homepage trust strip"
```

### Task 6: Validation visuelle et technique

**Files:**
- Modify only if inspection reveals a scoped responsive defect.

- [ ] **Step 1: Contrôler la homepage à 1440 px**

Vérifier dans `http://localhost:3001/` que les trois cartes ont une silhouette compacte, que les lignes du graphe touchent leurs ancrages et que les pictogrammes remplacent tous les numéros concernés.

- [ ] **Step 2: Contrôler la homepage à 390 px**

Vérifier l’absence de débordement horizontal, la lisibilité des cartes en deux colonnes et le repli du graphe sans ligne orpheline.

- [ ] **Step 3: Contrôler les erreurs navigateur**

Inspecter les logs `error` et `warning`. Corriger toute nouvelle erreur introduite par cette itération.

- [ ] **Step 4: Exécuter la validation finale**

```bash
npm run test:homepage
npm run test:images
npx tsc --noEmit
npm run build
git diff --check
```

Expected: toutes les commandes terminent avec le code 0.

- [ ] **Step 5: Commit du polissage éventuel**

```bash
git add components/home components/ui/ProductCard.tsx tests/homepage-design.test.mjs
git commit -m "fix: polish homepage showcase responsiveness"
```
