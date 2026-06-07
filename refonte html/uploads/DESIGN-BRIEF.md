# Fluxlab — Brief de Refonte UI

> Document de référence à joindre à chaque requête de redesign.  
> Généré depuis l'analyse complète du codebase (juin 2026).

---

## Contexte du projet

**Fluxlab** est un comparateur de matériel audio/vidéo/streaming pour créateurs français, déployé sur [fluxlab.fr](https://fluxlab.fr).

- Stack : **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**, **Supabase**
- Modèle économique : affiliation (Amazon, Thomann, Woodbrass)
- Cible : créateurs de contenu francophones (podcasteurs, streamers, vidéastes)

---

## Mission de la refonte

**Objectif** : Moderniser radicalement l'esthétique sans toucher à la logique technique.  
Le site est fonctionnel. Il manque d'autorité visuelle et de "wow effect". L'objectif est qu'au premier coup d'oeil, le visiteur perçoive un site travaillé, éditorial, premium — pas un site généré par IA.

**Ambiance cible** : Studio indépendant, labo de référence, éditorial premium.  
Penser : densité d'information maîtrisée, typographie forte, hiérarchie visuelle claire, détails soignés.

---

## Ce qu'il faut GARDER (identité de marque intouchable)

### Palette de couleurs — valeurs exactes

Ne jamais hardcoder de HEX/RGB directement. Toujours utiliser les tokens Tailwind ci-dessous.

| Token Tailwind | HSL | HEX | Usage |
|---|---|---|---|
| `bg-background` / `text-background` | `0 0% 98%` | `#FAFAFA` | Fond général |
| `bg-foreground` / `text-foreground` | `0 0% 6%` | `#0F0F0F` | Texte principal |
| `bg-primary` / `text-primary` | `38 52% 65%` | `#D3B27B` | Or doux — CTA, accents actifs |
| `bg-primary-foreground` | `0 0% 100%` | `#FFFFFF` | Texte sur fond doré |
| `bg-secondary` / `text-secondary` | `30 24% 94%` | `#F4EFEA` | Surface crème — fonds sections |
| `bg-muted` / `text-muted-foreground` | `40 38% 84%` / `0 0% 44%` | `#E8DCC4` / `#6F6F6F` | Zones atténuées / texte secondaire |
| `bg-accent` | `40 38% 84%` | `#E8DCC4` | Sable — hover states |
| `border-border` | `40 38% 84%` | `#E8DCC4` | Toutes les bordures |
| `bg-card` | `0 0% 100%` | `#FFFFFF` | Fond des cartes produits |

### Typographies

| Rôle | Classe Tailwind | Famille réelle |
|---|---|---|
| Corps de texte | `font-sans` | Inter (Google Fonts) |
| Labels techniques, badges, codes | `font-mono` | JetBrains Mono (Google Fonts) |
| Titres éditoriaux (H1, H2 sections) | `font-serif` | Georgia |

**Règle** : les `font-serif` (Georgia) doivent rester sur les grands titres de sections pour l'autorité éditoriale. Ne pas les remplacer par Inter ou JetBrains.

### Rayons de bordure

| Classe Tailwind | Valeur CSS | Usage |
|---|---|---|
| `rounded-2xl` | 16px | Base — cartes, boutons principaux |
| `rounded-xl` | 12px | Minimum acceptable |
| `rounded-full` | 9999px | Boutons CTA ronds uniquement |

Ne pas descendre en dessous de `rounded-xl`. Ne pas utiliser `rounded-none` sauf cas très spécifique justifié.

### Animation existante à conserver

```css
/* Hero — texte animé "pour votre création." */
.animate-gradient {
  animation: gradient 3s ease infinite;
  background-size: 200% auto;
}
/* Gradient : from-primary via-amber-500 to-primary */
```

---

## Ce qu'il faut CHANGER

- Mise en page des sections : espacement, hiérarchie, densité visuelle
- Composition des composants : disposition des éléments, proportions
- Effets visuels : ombres, gradients décoratifs, overlays, transitions hover
- Traitement typographique : tailles, poids, espacements entre lettres (`tracking-*`), `leading-*`
- Suppression de tout emoji dans les textes hardcodés
- Élévation du niveau de finition : micro-détails, états hover, états actifs

---

## Règles absolues pour l'IA de design

### NE JAMAIS modifier

```
- Les props et leur typage TypeScript
- Les imports (sauf ajouter une icône lucide-react)
- Les attributs fonctionnels : href, onClick, onChange, onSubmit, value, key, ref
- Les attributs d'accessibilité : aria-*, role, tabIndex
- La logique JavaScript/TypeScript : useState, useMemo, useEffect, fonctions, conditions
- Les éléments HTML liés aux données : {product.name}, {article.title}, etc.
- Les directives Next.js : 'use client', export default, generateMetadata, revalidate, generateStaticParams
- Les noms de variables CSS (--primary, --background, --foreground, etc.)
- Les composants enfants importés (ex: <ProductCard />, <JsonLd />, <Link />)
- Les attributs rel="nofollow sponsored noopener" sur les liens d'affiliation
```

### AUTORISER uniquement

```
- Remplacer / ajouter / supprimer des classes Tailwind sur n'importe quel élément
- Modifier la structure HTML décorative (div, section, span, p, h1-h6 sans handler)
- Changer les SVG et icônes purement décoratifs (sans onClick)
- Modifier les textes statiques hardcodés (pas les {variables})
- Ajouter des éléments HTML purement décoratifs (div d'overlay, span de badge visuel)
- Réorganiser l'ordre des éléments visuels si ça n'impacte pas la logique
```

---

## Format de retour attendu

Le fichier `.tsx` complet, sans commentaire explicatif, sans bloc markdown de code,  
prêt à remplacer directement l'original dans le projet.

---

## Ordre de traitement recommandé

Traiter un composant à la fois. Ne pas envoyer plusieurs fichiers en même temps.

### Phase 1 — Composants partagés (impact maximal, risque faible)
1. `components/ui/ProductCard.tsx` — carte produit utilisée partout
2. `components/client/HeroSection.tsx` — première impression du site
3. `components/server/Footer.tsx` — présent sur toutes les pages
4. `components/client/Navbar.tsx` — navigation principale *(attention : état scroll + menu actif)*

### Phase 2 — Pages principales
5. `app/page.tsx` — homepage complète
6. `app/categorie/[slug]/page.tsx` — template catégorie (génère toutes les pages catégorie)

### Phase 3 — Templates de contenu
7. `app/produit/[slug]/page.tsx` — fiche produit *(template unique pour tous les produits)*
8. `app/guides/page.tsx` — liste des guides
9. `app/guide/[slug]/page.tsx` — article guide *(template unique pour tous les guides)*

### Phase 4 — Configurateur (en dernier, logique métier complexe)
10. `app/configurateur/page.tsx` — logique de scoring et recommandation intégrée

---

## Ce qui fonctionne bien et ne doit PAS être touché conceptuellement

- Structure du menu de navigation (mega menu par vertical)
- Filtres de besoins en homepage ("espace bruyant", "plug & play", etc.)
- Positionnement "indépendant + E-E-A-T" affiché dans la section méthodologie
- Architecture des fiches produits (buy box gauche / droite, pros/cons, produits liés)
- Le configurateur multi-étapes (expérience de questionnaire)

---

## Prompt type à utiliser

Copier-coller ce bloc en tête de chaque requête, puis ajouter le fichier `.tsx` à la suite.

```
Tu es un expert UI/UX spécialisé en Tailwind CSS et Next.js 14.

MISSION : Moderniser l'esthétique du composant ci-dessous pour le projet Fluxlab.
Direction artistique : site éditorial premium pour créateurs, style "labo / studio indépendant".
Ambiance : autorité, précision, densité d'information maîtrisée. Pas minimaliste vide, pas chargé générique.
Référence visuelle : voir les images jointes.

IDENTITÉ DE MARQUE À RESPECTER ABSOLUMENT :
- Couleur primaire : #D3B27B (Or doux) → token Tailwind : bg-primary / text-primary
- Fond général : #FAFAFA → bg-background
- Texte principal : #0F0F0F → text-foreground
- Surface crème : #F4EFEA → bg-secondary
- Police corps : Inter → font-sans
- Police titres éditoriaux : Georgia → font-serif
- Police technique/labels : JetBrains Mono → font-mono
- Radius minimum : rounded-xl (12px)
- Toujours utiliser les tokens Tailwind, jamais de HEX hardcodé

RÈGLES ABSOLUES — NE JAMAIS :
- Modifier les props, leur typage, ou les imports existants
- Toucher aux attributs fonctionnels : href, onClick, onChange, onSubmit, value, key, ref, aria-*
- Modifier la logique JS/TS (useState, useMemo, fonctions, conditions)
- Changer les directives Next.js ('use client', export default, revalidate)
- Supprimer ou renommer les variables CSS (--primary, --background, etc.)
- Ajouter des emojis

TU PEUX UNIQUEMENT :
- Remplacer/ajouter/supprimer des classes Tailwind
- Modifier la structure HTML d'affichage (div, span, p, titres)
- Réorganiser visuellement sans toucher à la logique
- Ajouter des éléments HTML purement décoratifs

RETOUR ATTENDU : Le fichier .tsx complet et opérationnel, sans commentaire ni markdown.

--- FICHIER À MODIFIER ---
[coller le contenu du fichier .tsx ici]
```

---

*Document généré le 02/06/2026 — à mettre à jour si la palette ou la stack évolue.*
