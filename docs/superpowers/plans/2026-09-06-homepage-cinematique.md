# Homepage cinématographique Fluxlab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruire la homepage Fluxlab comme une interface sombre, ivoire et or proche de la troisième référence validée, avec une navigation fonctionnelle, un héros cinématographique, de vraies cartes produit et une preuve de compatibilité utilisable.

**Architecture:** La page serveur `app/page.tsx` conserve la récupération Supabase et délègue la présentation à des composants dédiés dans `components/home`. Le décor du héros reste séparé des contenus HTML interactifs. Les produits réels alimentent à la fois les cartes et un aperçu de compatibilité sans score inventé.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion déjà installé, Supabase, `next/image`, tests Node intégrés et contrôles visuels sur `localhost:3001`.

---

## Structure des fichiers

- Modifier `app/page.tsx` : orchestration de la homepage et données produit.
- Modifier `app/globals.css` : tokens premium, profondeur et réduction du mouvement.
- Modifier `components/client/Navbar.tsx` : variante ivoire flottante limitée à la homepage.
- Modifier `components/client/HeroSection.tsx` : nouvelle première vue et suppression de `hero1.webp`.
- Créer `components/home/HeroContextGrid.tsx` : quatre entrées contextuelles.
- Créer `components/home/HomeProductShowcase.tsx` : composition produits + compatibilité.
- Créer `components/home/CompatibilityPreview.tsx` : chaîne de matériel accessible.
- Modifier `components/ui/ProductCard.tsx` : carte blanche, prix et disponibilité robustes.
- Créer `public/images/home/hero-cinematic.webp` : décor sans texte ni contrôles intégrés.
- Créer `tests/homepage-design.test.mjs` : contrat structurel de la refonte.
- Modifier `package.json` : commande de test dédiée.

### Task 1: Verrouiller le contrat de la homepage

**Files:**
- Create: `tests/homepage-design.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Écrire le test en échec**

```js
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const hero = await readFile(new URL('../components/client/HeroSection.tsx', import.meta.url), 'utf8')
const page = await readFile(new URL('../app/page.tsx', import.meta.url), 'utf8')
const card = await readFile(new URL('../components/ui/ProductCard.tsx', import.meta.url), 'utf8')

assert.equal(hero.includes('hero1.webp'), false, 'the legacy homepage photograph must be removed')
assert.match(hero, /HeroContextGrid/, 'the hero must use the context grid component')
assert.match(page, /HomeProductShowcase/, 'the homepage must expose the product and compatibility composition')
assert.match(card, /bg-white/, 'product imagery must remain on a neutral white surface')
assert.equal(hero.includes('Testé en studio'), false, 'unverified trust claims must not be rendered')
assert.equal(hero.includes('Prix temps réel'), false, 'unverified freshness claims must not be rendered')

console.log('homepage design contract: ok')
```

- [ ] **Step 2: Ajouter la commande de test**

Dans `package.json` :

```json
"test:homepage": "node tests/homepage-design.test.mjs"
```

- [ ] **Step 3: Vérifier que le contrat échoue avant la refonte**

Run: `npm run test:homepage`

Expected: échec sur `hero1.webp` ou sur l'absence de `HomeProductShowcase`.

- [ ] **Step 4: Committer le contrat**

```bash
git add package.json tests/homepage-design.test.mjs
git commit -m "test: define cinematic homepage contract"
```

### Task 2: Stabiliser les tokens et le mouvement

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Ajouter les tokens de la scène premium**

Dans `:root` :

```css
--home-ink: #080705;
--home-panel: #11100d;
--home-ivory: #f1eadf;
--home-gold: #d3a85f;
--home-gold-soft: rgba(211, 168, 95, .32);
--home-rule: rgba(211, 168, 95, .24);
```

- [ ] **Step 2: Ajouter les animations limitées à l'ambiance**

```css
@keyframes home-glow-drift {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: .55; }
  50% { transform: translate3d(-2%, 2%, 0) scale(1.05); opacity: .8; }
}

@keyframes home-line-reveal {
  from { stroke-dashoffset: 1; opacity: 0; }
  to { stroke-dashoffset: 0; opacity: 1; }
}

.home-glow { animation: home-glow-drift 12s ease-in-out infinite; }
.home-link-line { pathLength: 1; stroke-dasharray: 1; animation: home-line-reveal 1.4s ease-out both; }

@media (prefers-reduced-motion: reduce) {
  .home-glow,
  .home-link-line,
  .animate-gradient-text { animation: none !important; }
}
```

- [ ] **Step 3: Vérifier TypeScript et le test existant des images**

Run: `npx tsc --noEmit`

Expected: sortie vide et code 0.

Run: `npm run test:images`

Expected: `image policy tests passed`.

- [ ] **Step 4: Committer les fondations visuelles**

```bash
git add app/globals.css
git commit -m "style: add cinematic homepage tokens"
```

### Task 3: Produire un décor de héros exploitable

**Files:**
- Create: `public/images/home/hero-cinematic.webp`

- [ ] **Step 1: Générer une scène sans interface intégrée**

Utiliser l'outil d'image avec ce brief :

```text
Wide 16:9 luxury editorial still life for a French creative equipment website. Deep black studio, warm brushed-gold rim lighting, an abstract microphone silhouette, camera body and compact audio interface arranged on the right half, large clean negative space on the left for HTML typography. Cinematic, restrained, refined, realistic materials, subtle dust particles, black and amber palette. No words, no letters, no logos, no buttons, no UI, no watermark, no border.
```

- [ ] **Step 2: Exporter le résultat au bon format**

Conserver une largeur maximale de 2400 px, convertir en WebP qualité 86 et enregistrer exactement sous `public/images/home/hero-cinematic.webp`.

- [ ] **Step 3: Vérifier les dimensions et le poids**

Run:

```powershell
node -e "const sharp=require('sharp'); sharp('public/images/home/hero-cinematic.webp').metadata().then(m=>{if(m.width<1800||m.width>2400)process.exit(1); console.log(m.width,m.height,m.format)})"
```

Expected: largeur comprise entre 1800 et 2400, format `webp`, code 0.

- [ ] **Step 4: Committer le décor**

```bash
git add public/images/home/hero-cinematic.webp
git commit -m "assets: add cinematic homepage scene"
```

### Task 4: Construire la première vue fonctionnelle

**Files:**
- Modify: `components/client/Navbar.tsx`
- Modify: `components/client/HeroSection.tsx`
- Create: `components/home/HeroContextGrid.tsx`

- [ ] **Step 1: Extraire la grille contextuelle**

Créer `HeroContextGrid.tsx` avec quatre liens réels :

```tsx
import Link from 'next/link'

const entries = [
  ['01', 'Pièce bruyante', 'Réduire le bruit, clarifier la voix.', '/categorie/espace-bruyant'],
  ['02', 'Plug & play', "Aller à l'essentiel, sans friction.", '/categorie/plug-and-play'],
  ['03', 'Budget serré', 'Prioriser ce qui change vraiment tout.', '/categorie/petit-budget'],
  ['04', 'Créateur nomade', 'Rester léger, compact et prêt.', '/categorie/createur-nomade'],
] as const

export function HeroContextGrid() {
  return (
    <div className="grid grid-cols-1 gap-px border border-[var(--home-rule)] bg-[var(--home-rule)] sm:grid-cols-2 lg:grid-cols-4">
      {entries.map(([num, label, description, href]) => (
        <Link key={href} href={href} className="group min-h-28 bg-[var(--home-panel)] p-5 transition-colors hover:bg-[#17140f]">
          <span className="frame-label text-primary">{num}</span>
          <strong className="mt-5 block font-serif text-lg font-normal text-white">{label}</strong>
          <span className="mt-2 block text-xs leading-relaxed text-white/50">{description}</span>
        </Link>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Remplacer l'ancien héros**

Dans `HeroSection.tsx`, utiliser `hero-cinematic.webp` comme décor non interactif, conserver le texte et les boutons en HTML, et intégrer `<HeroContextGrid />`. Le conteneur principal doit employer :

```tsx
<section className="relative isolate overflow-hidden bg-[var(--home-ink)] text-white">
  <Image
    src="/images/home/hero-cinematic.webp"
    alt=""
    fill
    priority
    sizes="100vw"
    className="-z-20 object-cover object-[68%_center] opacity-90"
  />
  <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#080705_0%,rgba(8,7,5,.94)_34%,rgba(8,7,5,.28)_72%,rgba(8,7,5,.58)_100%)]" />
  <div className="home-glow absolute right-[18%] top-[8%] -z-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
  <div className="mx-auto flex min-h-[920px] max-w-[1600px] flex-col px-5 pb-10 pt-36 sm:px-8 lg:px-16 lg:pt-44">
    <p className="frame-label text-primary">Matériel créatif · choisi pour former un tout</p>
    <div className="flex flex-1 items-center">
      <div className="max-w-[760px]">
        <h1 className="font-serif text-[42px] leading-[.98] tracking-tight sm:text-6xl lg:text-[86px]">
          Le matériel qui<br />donne forme à<br /><em className="font-normal text-primary">vos idées.</em>
        </h1>
        <p className="mt-8 max-w-xl text-lg font-light leading-relaxed text-white/65">
          Comparez les prix, vérifiez les compatibilités et composez un équipement adapté à votre usage et à votre budget.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link href="/configurateur" className="inline-flex h-14 items-center justify-center bg-primary px-8 text-xs font-medium uppercase tracking-[.12em] text-foreground">Composer mon setup →</Link>
          <Link href="/categorie/audio" className="inline-flex h-14 items-center justify-center px-4 text-xs font-medium uppercase tracking-[.12em] text-white">Explorer par univers ↗</Link>
        </div>
      </div>
    </div>
    <HeroContextGrid />
  </div>
</section>
```

Le titre retenu est :

```tsx
<h1>Le matériel qui<br />donne forme à<br /><em>vos idées.</em></h1>
```

Le CTA principal reste `Composer mon setup` vers `/configurateur`. Le CTA secondaire reste `Explorer par univers` vers `/categorie/audio`.

- [ ] **Step 3: Finaliser la navbar ivoire de la homepage**

Dans `Navbar.tsx`, calculer :

```ts
const isPremiumHome = pathname === '/' && !isScrolled && !activeMenu
```

La variante desktop initiale utilise `bg-[#f2ebdf]/95`, texte sombre, une bordure claire, un rayon de 10 px et une marge supérieure de 20 px. Après défilement ou ouverture d'un menu, elle retrouve le comportement blanc existant. Les autres routes restent inchangées.

- [ ] **Step 4: Faire passer le premier contrat**

Run: `npm run test:homepage`

Expected: l'assertion `hero1.webp` passe ; l'assertion `HomeProductShowcase` échoue encore.

- [ ] **Step 5: Vérifier la première vue dans le navigateur**

Ouvrir `http://localhost:3001/` à 1440 × 960 et 390 × 844. Vérifier que le titre, les deux CTA et les quatre panneaux sont visibles et qu'aucun texte n'est intégré à l'image.

- [ ] **Step 6: Committer le héros**

```bash
git add components/client/Navbar.tsx components/client/HeroSection.tsx components/home/HeroContextGrid.tsx
git commit -m "feat: rebuild cinematic homepage hero"
```

### Task 5: Rendre les cartes produit fiables et cohérentes

**Files:**
- Modify: `components/ui/ProductCard.tsx`

- [ ] **Step 1: Ajouter un état de prix explicite**

Dans le mapper, conserver `price` et ajouter :

```ts
hasPrice: typeof p.price === 'number' && p.price > 0,
```

Ajouter `hasPrice: boolean` à `CardProduct`, puis remplacer le prix par :

```tsx
{product.hasPrice ? (
  <span className="font-serif text-[19px] leading-none sm:text-[28px]">
    {product.price.toLocaleString('fr-FR')}<span className="align-top text-[12px] sm:text-[16px]">€</span>
  </span>
) : (
  <span className="text-sm font-medium text-foreground/55">Prix indisponible</span>
)}
```

- [ ] **Step 2: Stabiliser le survol**

Conserver la zone image exactement en `bg-white`. Limiter le survol à une élévation de la carte, une bordure dorée et un zoom produit maximal de `1.035`. Ne pas appliquer de fond ivoire ou doré sur l'image.

- [ ] **Step 3: Vérifier les états réels**

Sur la homepage locale, contrôler au moins une carte avec plusieurs offres et une carte avec une seule offre. Le texte doit afficher respectivement `N offres en stock · N marchands` et `En stock`.

- [ ] **Step 4: Vérifier TypeScript**

Run: `npx tsc --noEmit`

Expected: sortie vide et code 0.

- [ ] **Step 5: Committer les cartes**

```bash
git add components/ui/ProductCard.tsx
git commit -m "feat: strengthen homepage product cards"
```

### Task 6: Construire la sélection et la preuve de compatibilité

**Files:**
- Create: `components/home/CompatibilityPreview.tsx`
- Create: `components/home/HomeProductShowcase.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Créer la chaîne de compatibilité accessible**

Créer `CompatibilityPreview.tsx` :

```tsx
import Link from 'next/link'
import type { Product } from '@/types/database'

export function CompatibilityPreview({ products }: { products: Product[] }) {
  const nodes = products.slice(0, 3)
  return (
    <section aria-labelledby="compatibility-title" className="border border-[var(--home-rule)] bg-[#0b0a08] p-6 lg:p-8">
      <p className="frame-label text-primary">Parcours de compatibilité</p>
      <h3 id="compatibility-title" className="mt-3 font-serif text-3xl text-white">Un ensemble, pas une liste.</h3>
      <div className="relative mt-10 grid gap-6 sm:grid-cols-3">
        <span aria-hidden className="absolute left-[12%] right-[12%] top-5 hidden h-px bg-primary/45 sm:block" />
        {nodes.map((product, index) => (
          <div key={product.id} className="relative z-10">
            <span className="mx-auto block h-10 w-10 border border-primary/60 bg-[#0b0a08] text-center font-mono text-xs leading-10 text-primary">0{index + 1}</span>
            <strong className="mt-4 block text-center font-serif font-normal text-white">{product.name}</strong>
            <span className="mt-1 block text-center text-xs text-white/45">{index === 0 ? 'Source' : index === 1 ? 'Interface' : 'Contrôle'}</span>
          </div>
        ))}
      </div>
      <p className="mt-10 border-t border-white/10 pt-5 text-sm leading-relaxed text-white/60">Exemple de chaîne : vérifiez les connexions, le gain nécessaire et le budget avant l'achat.</p>
      <Link href="/configurateur" className="mt-6 inline-flex text-xs font-mono uppercase tracking-[.14em] text-primary">Vérifier mon setup →</Link>
    </section>
  )
}
```

- [ ] **Step 2: Composer le bloc produits**

Créer `HomeProductShowcase.tsx` :

```tsx
import type { Product } from '@/types/database'
import { ProductCard } from '@/components/ui/ProductCard'
import { CompatibilityPreview } from './CompatibilityPreview'

export function HomeProductShowcase({ products }: { products: Product[] }) {
  return (
    <section className="bg-[var(--home-ink)] px-5 pb-20 text-white sm:px-8 lg:px-16">
      <div className="mx-auto grid max-w-[1600px] border border-[var(--home-rule)] lg:grid-cols-12">
        <div className="p-5 lg:col-span-7 lg:p-8">
          <div className="mb-6 flex items-end justify-between">
            <div><p className="frame-label text-primary">Sélectionné pour vous</p><h2 className="mt-3 font-serif text-3xl">Les essentiels du moment.</h2></div>
          </div>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
            {products.slice(0, 3).map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
        <div className="border-t border-[var(--home-rule)] lg:col-span-5 lg:border-l lg:border-t-0">
          <CompatibilityPreview products={products} />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Gérer la liste vide dans le composant**

Avant le `return` principal :

```tsx
if (products.length === 0) {
  return (
    <section className="bg-[var(--home-ink)] px-5 pb-20 text-white">
      <div className="mx-auto max-w-[1600px] border border-white/10 p-8">
        <h2 className="font-serif text-3xl">La sélection est momentanément indisponible.</h2>
        <p className="mt-3 text-sm text-white/55">Explorez les univers Fluxlab pendant son actualisation.</p>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Brancher le bloc dans `app/page.tsx`**

Importer `HomeProductShowcase`, remplacer l'ancienne section claire « Sélections expertes » et le bloc de score décoratif par :

```tsx
<HomeProductShowcase products={featuredProducts} />
```

Conserver les guides éditoriaux sous cette nouvelle composition.

- [ ] **Step 5: Faire passer le contrat complet**

Run: `npm run test:homepage`

Expected: `homepage design contract: ok`.

- [ ] **Step 6: Committer la composition**

```bash
git add app/page.tsx components/home/CompatibilityPreview.tsx components/home/HomeProductShowcase.tsx
git commit -m "feat: add product compatibility showcase"
```

### Task 7: Retirer les promesses invérifiables et vérifier le contenu

**Files:**
- Modify: `components/client/HeroSection.tsx`
- Modify: `components/home/CompatibilityPreview.tsx`

- [ ] **Step 1: Remplacer les quatre preuves du héros**

Utiliser uniquement des formulations démontrables :

```ts
const TRUST = [
  ['Offres comparées', 'Selon les marchands disponibles'],
  ['Stock affiché', 'D'après les données reçues'],
  ['Choix contextualisé', 'Usage, budget, environnement'],
  ['Liens directs', 'Vers les offres marchandes'],
] as const
```

- [ ] **Step 2: Supprimer tout score non documenté**

Run:

```powershell
rg -n "98 / 100|Testé en studio|Prix temps réel|Aucun sponsor" app/page.tsx components/client/HeroSection.tsx components/home
```

Expected: aucune sortie.

- [ ] **Step 3: Relancer les tests**

Run: `npm run test:homepage`

Expected: `homepage design contract: ok`.

Run: `npx tsc --noEmit`

Expected: sortie vide et code 0.

- [ ] **Step 4: Committer les contenus fiables**

```bash
git add components/client/HeroSection.tsx components/home/CompatibilityPreview.tsx
git commit -m "fix: align homepage claims with available data"
```

### Task 8: Validation responsive, production et livraison

**Files:**
- Modify only if a verified defect is found in: `app/globals.css`, `components/client/Navbar.tsx`, `components/client/HeroSection.tsx`, `components/home/HeroContextGrid.tsx`, `components/home/HomeProductShowcase.tsx`, `components/home/CompatibilityPreview.tsx`, `components/ui/ProductCard.tsx`

- [ ] **Step 1: Vérifier la homepage desktop**

Sur `http://localhost:3001/` à 1440 × 960, contrôler : barre ivoire, titre lisible, scène à droite, CTA, quatre panneaux, cartes blanches et compatibilité.

- [ ] **Step 2: Vérifier la homepage mobile**

À 390 × 844, contrôler : aucune coupure horizontale, menu utilisable, CTA visible, ordre de lecture logique, panneaux tactiles et cartes lisibles.

- [ ] **Step 3: Vérifier le mouvement réduit**

Activer `prefers-reduced-motion: reduce`. Expected: halos et tracés statiques, aucun contenu manquant.

- [ ] **Step 4: Exécuter la validation automatisée**

Run: `npm run test:images`

Expected: `image policy tests passed`.

Run: `npm run test:homepage`

Expected: `homepage design contract: ok`.

Run: `npx tsc --noEmit`

Expected: sortie vide et code 0.

- [ ] **Step 5: Construire la version de production**

Arrêter uniquement le serveur Fluxlab sur le port 3001, sans toucher au port 3000, puis lancer :

Run: `npm run build`

Expected: build Next.js terminé avec code 0.

Redémarrer Fluxlab sur le port 3001 après le build.

- [ ] **Step 6: Vérifier le diff et committer les dernières corrections éventuelles**

Run: `git diff --check`

Expected: aucune erreur d'espacement.

Si des corrections de validation ont été nécessaires :

```bash
git add app/globals.css components/client/Navbar.tsx components/client/HeroSection.tsx components/home components/ui/ProductCard.tsx
git commit -m "fix: polish cinematic homepage responsiveness"
```

- [ ] **Step 7: Présenter la version locale à l'utilisateur**

Ne pousser la branche `mobile-responsive-seo-fixes` et ne déployer qu'après validation visuelle explicite de la homepage locale.
