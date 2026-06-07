# Fluxlab Next.js — Contexte & État du Projet

> Fichier de référence pour reprendre la conversation. Dernière mise à jour : juin 2026.

---

## Stack technique

- **Framework** : Next.js 14 (App Router, TypeScript)
- **Base de données** : Supabase PostgreSQL + Storage
- **Style** : Tailwind CSS + design system custom
- **Fonts** : Inter (sans), Georgia (serif), JetBrains Mono (mono)
- **Animations** : Framer Motion
- **Analytics** : Vercel Analytics
- **Email** : Brevo API (`/api/newsletter`)
- **Variable TLS** : `NODE_TLS_REJECT_UNAUTHORIZED=0` dans `.env.local` (contournement antivirus local)

---

## Design System

### Couleurs
| Token | Valeur | Usage |
|---|---|---|
| `primary` | `#D3B27B` | Or — accents, CTAs, titres italiques |
| `primary-hover` | `#E0C28D` | Hover des boutons or |
| `background` | `#FAFAFA` | Fond pages claires |
| `foreground` | `#0F0F0F` | Texte principal |
| `deep` | `#0A0A0A` | Fond hero, footer, configurateur |
| `accent` | `#E8DCC4` | Fond info produits |
| `secondary` | `#F4EFEA` | Fonds sections claires |
| `border` | `#EBDCC4` | Bordures |
| `card` | `#FFFFFF` | Fond cartes produits |

### Classes utilitaires globales
- `.frame-label` — JetBrains Mono, 10px, uppercase, tracking 0.18em
- `.animate-gradient-text` — Gradient or animé (pour titres hero)
- `.hover-rule` — Soulignement or qui s'étend au hover
- `.grain` — Texture bruit SVG en overlay
- `.prose-fluxlab` — Styles article/guide (Georgia h2, bullet or, blockquote)
- `.toc-link` — Liens sommaire avec bordure gauche or au survol/actif

### Shadows (tailwind.config.ts)
- `shadow-card` — Ombre douce pour cartes produits au hover
- `shadow-btn` — Halo or pour CTAs primaires
- `shadow-nav` — Ombre navbar scrollée

---

## Architecture des fichiers clés

```
app/
  page.tsx                          ← Homepage (5 sections)
  layout.tsx                        ← Layout global (Navbar + Footer)
  globals.css                       ← Design system CSS
  configurateur/
    page.tsx                        ← Configurateur IA (4 étapes + résultats)
    layout.tsx                      ← Layout configurateur (metadata)
  categorie/[slug]/
    page.tsx                        ← Page catégorie (header + sidebar + grille)
  produit/[slug]/
    page.tsx                        ← Fiche produit (galerie + tabs + offres)
  guide/[slug]/
    page.tsx                        ← Article guide (hero sombre + TOC + prose)
  guides/
    page.tsx                        ← Liste des guides
  api/newsletter/
    route.ts                        ← POST → Brevo API

components/
  client/
    Navbar.tsx                      ← Navbar (transparent hero / blanc scroll / mega menu)
    HeroSection.tsx                 ← Hero homepage (image fond HERO1.png)
    CategoryContent.tsx             ← Sidebar filtres + grille produits
    ProductPageContent.tsx          ← Fiche produit complète (tabs, galerie, offres)
    EmailCaptureForm.tsx            ← Formulaire newsletter
  server/
    Footer.tsx                      ← Footer sombre (newsletter + liens + wordmark)
    JsonLd.tsx                      ← JSON-LD Schema.org
  ui/
    ProductCard.tsx                 ← Carte produit (bg-accent, serif, étoiles, wishlist)
    Badge.tsx                       ← ProductBadge, StatusBadge, FilterChip
    Button.tsx                      ← Variants primary/ghost/outline/pill-icon + LaboButton
  FluxlabIcons.tsx                  ← 37 icônes SVG custom

lib/
  supabase.ts                       ← Client Supabase
  transformers.ts                   ← transformProduct() DB → type Product
  scoringEngine.ts                  ← Algorithme recommandation configurateur
  utils.ts                          ← cn(), stripHtml(), cleanImageUrl()
  data.ts                           ← ARTICLES (guides statiques)

types/
  database.ts                       ← Type Product DB (avec product_offers)
  fluxlab.ts                        ← Types UI (NavLink, Guide, Category, Stack...)

hooks/
  useProducts.ts                    ← Hook Supabase pour le configurateur

public/
  images/
    hero1.png                       ← Image fond hero homepage
    shure-sm7b.png                  ← Photo Shure SM7B
  branding/
    logo.svg                        ← Logo Fluxlab SVG
    favicon.svg
```

---

## Pages & composants — État du design

### ✅ Fait (refonte complète selon HTML Phase 1-4)

| Page / Composant | État | Notes |
|---|---|---|
| `Navbar` | ✅ | Transparent hero, mega menu, drawer mobile sombre |
| `Footer` | ✅ | Sombre grain, newsletter, wordmark |
| `HeroSection` | ✅ | Image fond HERO1.png, overlay, texte blanc |
| `Homepage` | ✅ | 6 sections (catégories, produits, stack engine, guides, CTA) |
| `CategoryPage` | ✅ | Header éditorial, sidebar filtres, grille + interstitiel |
| `ProductPage` | ✅ | Galerie, verdict, specs, prix box, tabs, produits liés |
| `GuidePage` | ✅ | Hero sombre, TOC sidebar, prose-fluxlab, CTA in-article |
| `Configurateur` | ✅ | 4 étapes, loading ring, résultats + score ring |
| `ProductCard` | ✅ | bg-accent, serif, étoiles or, wishlist |
| `Badge` | ✅ | new/bestseller/promo/out_of_stock |
| `Button / LaboButton` | ✅ | Pill or avec cercle sombre embarqué |

---

## Navbar — Logique de couleurs

```
Page homepage (/) ou configurateur (/configurateur)
  → Fond sombre (hero dark)
  → Navbar : TRANSPARENTE, texte blanc
  → Au scroll : bg-white/90 backdrop-blur, texte foreground

Autres pages
  → Fond clair
  → Navbar : bg-background/95 dès le début, texte foreground
```

Le mega menu s'ouvre au **hover** sur les liens "Studio & Son", "Image & Lumière", "Streaming".  
Carte promo à droite : fond sombre `#0A0A0A` avec halo or.

---

## Configurateur — Logique scoring

**Fichier** : `lib/scoringEngine.ts`  
**Hook** : `hooks/useProducts.ts` (charge tous les produits Supabase côté client)

**UserContext** (état du formulaire) :
```typescript
{
  usage: 'streaming' | 'podcast' | 'music_vocals' | 'video_calls'
  room: 'untreated_bedroom' | 'treated_studio' | 'travel'
  experience: 'beginner' | 'intermediate' | 'pro'
  budget: number  // 200–5000€
  vibe: 'minimalist' | 'rgb_gamer' | 'pro_studio' | 'vintage'
  computer: 'mac' | 'pc'
  hasMic: boolean
  hasInterface: boolean
  hasCamera: boolean
  hasLights: boolean
}
```

**Retourne** `RecommendationResult` : mic, audioInterface, headphones, camera, lights, acousticTreatment, totalCost, budgetUtilization, matchScore, explanations.

---

## Données produits — Supabase

**Table** `products` :
- `id`, `slug`, `name`, `brand`, `category_id`, `price`, `rating`, `review_count`
- `image_url`, `gallery_images[]`, `description` (HTML)
- `pros[]`, `cons[]`, `specs` (JSON), `badge` (JSON `{text, color}`)
- `inStock`, `is_active`, `reviews_summary` (JSON)

**Table** `product_offers` (joint) :
- `product_id`, `merchant_name`, `price`, `affiliate_link`, `in_stock`, `merchant_logo_url`

**Table** `categories` :
- `id`, `slug`, `name`

---

## 🔲 Ce qui reste à faire

### Priorité haute
- [ ] **Vérifier tous les liens** — certains `href` pointent vers des slugs qui n'existent peut-être pas en DB (ex: challenge bubbles `espace-bruyant`, `plug-and-play`, `petit-budget`, `createur-nomade`)
- [ ] **Bouton recherche** (loupe dans Navbar) — non connecté, page de recherche à créer
- [ ] **Page `/guides`** — vérifier que le listing des articles s'affiche correctement
- [ ] **Liens footer** — vérifier `/mentions-legales`, `/confidentialite`, `/cgu`, `/methodologie`, `/a-propos`

### Priorité moyenne
- [ ] **Images guides** dans section homepage — utilise `article.image` de `lib/data.ts`, vérifier que les chemins sont corrects
- [ ] **Thumbnails guides** dans la section "articles liés" (page guide) — SVG placeholder actuellement
- [ ] **Page `/methodologie`** et **`/a-propos`** — à créer ou vérifier
- [ ] **Email capture** — tester le formulaire newsletter avec la clé BREVO en prod
- [ ] **Réseaux sociaux** — commentés dans le footer, à décommenter quand comptes actifs

### Priorité basse
- [ ] **Breadcrumb catégorie** — `parentVertical` à vérifier pour toutes les sous-catégories
- [ ] **Pagination** page catégorie — non implémentée (affiche tous les produits)
- [ ] **Fonctionnalité wishlist** — état local seulement, non persisté
- [ ] **TOC scrollspy** (page guide) — premier lien actif statiquement, pas de highlight dynamique au scroll
- [ ] **Mobile responsive** — vérifier configurateur sur petit écran

### Variables d'environnement à vérifier en prod
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
BREVO_API_KEY=
```

---

## Commandes utiles

```bash
# Démarrer le serveur de dev
npm run dev

# Vérifier TypeScript
npx tsc --noEmit

# Build de production
npm run build
```

---

## Fichiers de référence design (NE PAS MODIFIER)

```
D:\Stackera\phase-1\    ← Navbar, Footer, HeroSection, ProductCard (HTML)
D:\Stackera\phase-2\    ← Homepage, CategoryPage (HTML)
D:\Stackera\phase-3\    ← ProductPage, GuidePage (HTML)
D:\Stackera\phase-4\    ← Configurateur (HTML)
D:\Stackera\Design-System.html  ← Tokens, règles, palettes
D:\Stackera\fluxlab-next\image\ ← Images source (HERO1.png, shure.png)
```
