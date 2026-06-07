# Fluxlab — Design System Handoff v1.0

> Maquettes HTML → Implémentation Next.js / TypeScript  
> Dernière mise à jour : Juin 2026

---

## Stack technique recommandé

| Outil | Version | Rôle |
|---|---|---|
| Next.js | 14+ (App Router) | Framework |
| TypeScript | 5+ | Typage |
| Tailwind CSS | 3.4+ | Styles utilitaires |
| `clsx` + `tailwind-merge` | latest | Fusion de classes |
| JetBrains Mono | via Google Fonts | Police mono |
| Inter | via Google Fonts | Police sans |

---

## Structure des fichiers livrés

```
handoff/
├── tailwind.config.ts          ← Tokens complets (colors, fonts, shadows…)
├── src/
│   ├── styles/
│   │   └── globals.css         ← CSS vars + utilities (.frame-label, .grain…)
│   ├── types/
│   │   └── fluxlab.ts          ← Types TS partagés (Product, Stack, NavLink…)
│   └── components/
│       ├── FluxlabIcons.tsx    ← 37 icônes SVG custom (remplace Lucide)
│       ├── ui/
│       │   ├── Button.tsx      ← Button + LaboButton
│       │   ├── Badge.tsx       ← ProductBadge, StatusBadge, FilterChip, FrameLabel
│       │   └── ProductCard.tsx ← Carte produit complète avec wishlist
│       └── layout/
│           ├── Navbar.tsx      ← Navbar sticky avec scroll state
│           └── Footer.tsx      ← Footer complet avec newsletter
```

---

## Setup rapide

### 1. Copier les tokens

```bash
cp handoff/tailwind.config.ts tailwind.config.ts
cp handoff/src/styles/globals.css src/app/globals.css
```

### 2. Copier les types

```bash
cp handoff/src/types/fluxlab.ts src/types/fluxlab.ts
```

### 3. Copier les composants

```bash
cp -r handoff/src/components/* src/components/
```

### 4. Utilitaire `cn` (si absent)

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 5. Fonts dans `layout.tsx`

```tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300','400','500','600','700'],
})

// Dans le layout : className={inter.variable}
```

Pour JetBrains Mono, ajouter dans `globals.css` :
```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
```

---

## Utilisation des composants

### Boutons

```tsx
import { Button, LaboButton } from '@/components/ui/Button'

// CTA principal (fond doré)
<Button variant="primary" withArrow>Trouver mon setup</Button>

// Ghost (sur fond sombre)
<Button variant="ghost">Voir les guides</Button>

// Outline (sur fond clair)
<Button variant="outline">Explorer les produits</Button>

// Navbar CTA
<LaboButton />
```

### Badges

```tsx
import { ProductBadge, StatusBadge, FilterChip, FrameLabel } from '@/components/ui/Badge'

<ProductBadge variant="new" />
<ProductBadge variant="promo" promoLabel="−15 %" />
<ProductBadge variant="bestseller" />
<ProductBadge variant="out_of_stock" />

<StatusBadge variant="in_stock" label="En stock" />
<StatusBadge variant="compatible" label="Compatible" />
<StatusBadge variant="cloudlifter" label="Cloudlifter requis" />

<FilterChip label="Micros USB" onRemove={() => {}} />

// Eyebrow éditorial
<FrameLabel withRule>Sélections expertes — N° 02</FrameLabel>
```

### Carte Produit

```tsx
import { ProductCard } from '@/components/ui/ProductCard'

<ProductCard
  product={{
    id: 'sm7b',
    slug: 'shure-sm7b',
    name: 'Shure SM7B',
    brand: 'Shure',
    category: 'audio',
    subcategory: 'micros',
    type: 'XLR · Dynamique',
    price: 399,
    rating: 4.8,
    reviewCount: 210,
    badge: 'new',
    inStock: true,
    href: '/produit/shure-sm7b',
  }}
  imagePlaceholder={
    <img src="/images/shure-sm7b.png" alt="Shure SM7B" className="w-3/4 h-3/4 object-contain" />
  }
  onWishlistToggle={(id) => console.log('wishlist', id)}
/>
```

### Icônes

```tsx
import { MicBroadcast, Waveform, Compatibility, ArrowRight } from '@/components/FluxlabIcons'

// Taille par défaut : 24px
<MicBroadcast />

// Taille personnalisée
<Waveform size={32} className="text-primary" />

// En inline avec une couleur héritée
<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
```

### Navbar

```tsx
import { Navbar } from '@/components/layout/Navbar'

// Transparente (sur hero sombre) — état par défaut
<Navbar activeHref="/categorie/audio" />

// Forcée en blanc (pages sans hero sombre)
<Navbar forceScrolled activeHref="/guides" />
```

### Footer

```tsx
import { Footer } from '@/components/layout/Footer'

<Footer />
```

---

## Palette de couleurs

| Token | Hex | Usage |
|---|---|---|
| `background` | `#FAFAFA` | Fond général, images produit |
| `foreground` | `#0F0F0F` | Texte principal |
| `deep` | `#0A0A0A` | Hero, footer, configurateur |
| `primary` | `#D3B27B` | CTA, accents, icônes actives |
| `primary-hover` | `#E0C28D` | Hover boutons |
| `accent` | `#E8DCC4` | Pied des cartes, encarts |
| `secondary` | `#F4EFEA` | Fond sections éditorial |
| `border` | `#EBDCC4` | Séparateurs, bordures |
| `card` | `#FFFFFF` | Fond cartes produit |
| `muted.foreground` | `#6F6F6F` | Textes secondaires |

---

## Maquettes HTML de référence

| Fichier | URL de référence |
|---|---|
| Design System complet | `Design-System.html` |
| Homepage | `phase-2/01-Homepage.html` |
| Page Catégorie | `phase-2/02-Categorie.html` |
| Fiche Produit | `phase-3/01-FicheProduit.html` |
| Page Guide | `phase-3/02-PageGuide.html` |
| Configurateur IA | `phase-4/01-Configurateur.html` |
| Icônes SVG | `icons/Fluxlab-Icons.html` |

---

## Notes de développement

- **`frame-label`** : classe utilitaire Tailwind définie dans `globals.css` — appliquer sur tous les eyebrows/labels mono.
- **`.grain`** : la texture de bruit est appliquée via `::after` — ne pas oublier `position: relative` sur l'élément parent.
- **Hover underline** : utiliser la classe `.hover-rule` définie dans `globals.css` pour l'animation de soulignement or.
- **Waveform icon** : strokeWidth par défaut = 2 (légèrement plus épais que les autres icons à 1.5) — c'est intentionnel, c'est l'icône signature.
- **Images produit** : les maquettes utilisent des SVG placeholder sur fond blanc (`#FFFFFF`). En production, utiliser `next/image` avec `objectFit="contain"` sur fond blanc.
- **Affiliation** : tous les liens vers les boutiques externes doivent porter `rel="nofollow sponsored noopener"`.
