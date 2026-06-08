# Fluxlab — Marketing Priorité 2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:dispatching-parallel-agents — les 3 tâches sont entièrement indépendantes.

**Goal:** Ajouter les badges "Notre choix" / "Coup de cœur" sur les pages catégorie, mettre en évidence le prix affilié sur les pages produit, et ajouter des CTA contextuels vers le configurateur IA.

**Architecture:**
- Badge éditorial : nouveau type dans fluxlab.ts → Badge.tsx → ProductCard.tsx → CategoryContent.tsx (calcul auto basé sur rating + reviews)
- Prix affilié : banner compact "X€ chez Thomann" juste après le H1 dans ProductPageContent.tsx
- CTA configurateur : bloc dans la grille CategoryContent + injection HTML mid-article dans guide/[slug]/page.tsx

**Tech Stack:** Next.js 14 · TypeScript · Tailwind CSS

---

## Fichiers concernés

| Agent | Fichiers |
|-------|---------|
| A — Badges + CTA catégorie | `types/fluxlab.ts`, `components/ui/Badge.tsx`, `components/ui/ProductCard.tsx`, `components/client/CategoryContent.tsx` |
| B — Prix affilié | `components/client/ProductPageContent.tsx` |
| C — CTA guide mid-article | `app/guide/[slug]/page.tsx` |

---

## Agent A — Badges éditoriaux + CTA catégorie

### A1 : `types/fluxlab.ts` — Étendre BadgeVariant

- [ ] **Modifier ligne 5**

Remplacer :
```ts
export type BadgeVariant = 'new' | 'bestseller' | 'promo' | 'out_of_stock'
```
Par :
```ts
export type BadgeVariant = 'new' | 'bestseller' | 'promo' | 'out_of_stock' | 'choix' | 'coup-de-coeur'
```

### A2 : `components/ui/Badge.tsx` — Ajouter styles + labels

- [ ] **Ajouter dans `badgeStyles`** (après `out_of_stock`) :
```tsx
  choix:
    'bg-primary text-foreground',
  'coup-de-coeur':
    'bg-white border border-primary/40 text-primary',
```

- [ ] **Ajouter dans `badgeLabels`** :
```tsx
  choix:        'Notre choix',
  'coup-de-coeur': 'Coup de cœur',
```

### A3 : `components/ui/ProductCard.tsx` — Accepter editorialBadge

Contexte : Le composant `ProductCard` a déjà un système de badge interne dérivé du produit DB. On ajoute une prop externe pour les badges éditoriaux Fluxlab, affichés dans la zone image.

- [ ] **Modifier l'import** (ligne 8) pour inclure les nouvelles variantes — elles sont déjà dans `@/types/fluxlab` via `ProductBadge`.

- [ ] **Modifier l'interface `ProductCardProps`** (lignes 72-75) :

Remplacer :
```tsx
interface ProductCardProps {
  product: DBProduct
  className?: string
}
```
Par :
```tsx
interface ProductCardProps {
  product: DBProduct
  className?: string
  editorialBadge?: 'choix' | 'coup-de-coeur'
}
```

- [ ] **Modifier la signature du composant** (ligne 77) :
```tsx
export function ProductCard({ product: dbProduct, className, editorialBadge }: ProductCardProps) {
```

- [ ] **Ajouter le badge éditorial dans la zone image**, juste après le badge produit existant (après `</span>` du badge produit, ligne ~106). Insérer :
```tsx
        {editorialBadge && (
          <span className="absolute bottom-3 left-3 z-10">
            <ProductBadge variant={editorialBadge} />
          </span>
        )}
```

### A4 : `components/client/CategoryContent.tsx` — Calcul badges + CTA grille

Contexte : `CategoryContent` reçoit `products: Product[]` (liste brute non filtrée). Il faut :
1. Calculer quels produits reçoivent un badge éditorial (automatique, basé sur score)
2. Ajouter un CTA configurateur dans la grille principale

- [ ] **Ajouter le calcul des badges après l'import** (après la constante `DEFAULT_BG`, avant la fonction `EditorialCard`) :

```tsx
/* ─── EDITORIAL BADGES ───────────────────────────────────── */
function computeEditorialBadges(products: Product[], total: number) {
  if (total === 0) return { choixId: null, coupDeCoeurId: null };

  // Notre choix : meilleur score combiné rating × log(reviews+1)
  const sorted = [...products].sort((a, b) => {
    const scoreA = (a.rating || 0) * Math.log10((a.review_count || 0) + 1);
    const scoreB = (b.rating || 0) * Math.log10((b.review_count || 0) + 1);
    return scoreB - scoreA;
  });
  const choixId = sorted[0]?.id ?? null;

  // Coup de cœur : meilleur rapport qualité parmi les produits < médiane de prix, différent du choix
  // (seulement si ≥ 20 produits)
  let coupDeCoeurId: string | null = null;
  if (total >= 20) {
    const prices = products.map(p => p.price || 0).sort((a, b) => a - b);
    const median = prices[Math.floor(prices.length / 2)];
    const candidates = sorted.filter(p => (p.price || 0) <= median && p.id !== choixId && (p.rating || 0) >= 4.0);
    coupDeCoeurId = candidates[0]?.id ?? null;
  }

  return { choixId, coupDeCoeurId };
}
```

Note : le type `Product` utilisé ici est `Product` de `@/types/database` (déjà importé sous l'alias `Product`). Vérifier que `Product` dans ce contexte a les champs `id`, `rating`, `review_count`, `price` — c'est le cas d'après `types/database.ts`.

- [ ] **Dans la fonction `CategoryContent`**, après `const hasFilters = ...` (ligne ~193), ajouter :

```tsx
  const { choixId, coupDeCoeurId } = useMemo(
    () => computeEditorialBadges(products, products.length),
    [products]
  );
```

- [ ] **Modifier le rendu de `ProductCard`** dans la grille (ligne ~345) :

Remplacer :
```tsx
                  <ProductCard key={product.id} product={product} />
```
Par :
```tsx
                  <ProductCard
                    key={product.id}
                    product={product}
                    editorialBadge={
                      product.id === choixId ? 'choix' :
                      product.id === coupDeCoeurId ? 'coup-de-coeur' :
                      undefined
                    }
                  />
```

- [ ] **Ajouter le CTA configurateur dans la grille**, juste après la balise ouvrante `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">` (ligne ~342), avant le `{filtered.map(...)}` :

```tsx
              {/* CTA Configurateur — au-dessus de la grille */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 mb-2">
                <Link
                  href="/configurateur"
                  className="group flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all"
                >
                  <div>
                    <p className="frame-label text-primary mb-1">Vous ne savez pas quoi choisir ?</p>
                    <p className="text-[15px] font-serif text-foreground">Notre IA compose votre setup complet <span className="italic text-primary">en 2 minutes.</span></p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-2 h-10 px-6 rounded-full bg-primary text-foreground text-[12px] font-medium uppercase tracking-wider group-hover:bg-primary-hover transition-colors">
                    Lancer le Labo IA
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
                </Link>
              </div>
```

---

## Agent B — Prix affilié mis en évidence

**Fichier** : `components/client/ProductPageContent.tsx`

Contexte : La page produit a déjà une `Prix box` complète (lignes 276-299) avec merchant logos dans les `OfferRow`. Le plan demande d'ajouter une ligne compacte "X€ chez Thomann" juste après le bloc rating/stock (ligne ~231), avant le Verdict.

Le `bestOffer` et `getMerchantLogo` sont déjà disponibles dans le scope du composant.

- [ ] **Ajouter le bloc prix compact** entre la fin du bloc rating/stock (ligne ~231) et le début du Verdict (ligne ~234) :

```tsx
            {/* Prix compact — meilleur prix mis en évidence */}
            {bestOffer && (
              <div className="flex items-center gap-3 mb-6 py-3 px-4 rounded-xl bg-secondary border border-border/70">
                <span className="font-serif text-[26px] leading-none text-foreground">
                  {bestOffer.price}<span className="text-[14px] align-top ml-0.5">€</span>
                </span>
                <span className="text-[13px] text-foreground/50">chez</span>
                {getMerchantLogo(bestOffer) ? (
                  <Image
                    src={getMerchantLogo(bestOffer)!}
                    alt={`Logo ${bestOffer.merchant_name}`}
                    width={70}
                    height={22}
                    className="object-contain h-5 w-auto"
                  />
                ) : (
                  <span className="text-[14px] font-medium text-foreground/80">{bestOffer.merchant_name}</span>
                )}
                <a
                  href={bestOffer.affiliate_link}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-mono text-primary uppercase tracking-wider hover:underline"
                >
                  Voir l&apos;offre
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                </a>
              </div>
            )}
```

Placement exact : entre `</div>` du bloc rating/stock (après ligne `{anyInStock ? 'En stock' : 'Indisponible'}`) et `{/* Verdict */}`.

---

## Agent C — CTA mid-article dans les guides

**Fichier** : `app/guide/[slug]/page.tsx`

Contexte : Le contenu article est manipulé comme une chaîne HTML dans `dynamicContent` avant d'être injecté via `dangerouslySetInnerHTML`. Il existe déjà un CTA final après l'article (lignes 406-425). On veut ajouter un CTA compact au milieu du contenu — après la 2ème occurrence de `</h2>` dans `dynamicContent`.

- [ ] **Ajouter la logique d'injection** juste avant la ligne `return (` (vers la fin des manipulations de `dynamicContent`, après le bloc `dynamicContent = modifiedContent`) :

```tsx
    // Injecter un CTA configurateur au milieu de l'article (après le 2ème h2)
    const CTAmidArticle = `
      <div class="not-prose my-10 p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center gap-5" style="background:rgba(211,178,123,0.06);border-color:rgba(211,178,123,0.2);">
        <div class="flex-1">
          <p class="text-[10px] font-mono uppercase tracking-widest mb-1" style="color:#D3B27B;">Labo IA · Fluxlab</p>
          <p class="font-serif text-[20px] leading-snug mb-1">Besoin d&apos;aide pour choisir votre matériel&nbsp;?</p>
          <p class="text-[13px] leading-relaxed" style="color:rgba(15,15,15,0.6);">Budget, usage, contraintes — l&apos;IA compose votre setup complet en 2 minutes.</p>
        </div>
        <a href="/configurateur" class="shrink-0 inline-flex items-center gap-2 h-10 px-6 rounded-full text-[12px] font-medium uppercase tracking-wider transition-colors" style="background:#D3B27B;color:#0F0F0F;text-decoration:none;">
          Lancer le Labo IA →
        </a>
      </div>
    `;

    // Trouver la position après le 2ème </h2> et injecter
    let h2Count = 0;
    const h2CloseTag = '</h2>';
    let insertPos = -1;
    let searchFrom = 0;
    while (h2Count < 2) {
      const idx = dynamicContent.indexOf(h2CloseTag, searchFrom);
      if (idx === -1) break;
      h2Count++;
      if (h2Count === 2) insertPos = idx + h2CloseTag.length;
      else searchFrom = idx + h2CloseTag.length;
    }
    if (insertPos !== -1) {
      dynamicContent = dynamicContent.slice(0, insertPos) + CTAmidArticle + dynamicContent.slice(insertPos);
    }
```

---

## Vérification finale

- [ ] `npx tsc --noEmit` → 0 erreurs TypeScript
- [ ] Confirmer que `Badge.tsx` a les 6 variants (dont `choix` et `coup-de-coeur`)
- [ ] Confirmer que `ProductCard.tsx` accepte `editorialBadge` prop
- [ ] Confirmer que `CategoryContent.tsx` calcule et passe le badge
- [ ] Confirmer que `ProductPageContent.tsx` affiche le prix compact avant le Verdict
- [ ] Confirmer que `guide/[slug]/page.tsx` injecte le CTA après le 2ème h2
