# Audio First Focus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition Fluxlab as a focused Studio & Son catalogue, hide the Video and Streaming public surfaces without deleting Supabase data, and preserve SEO through intentional public availability rules.

**Architecture:** Add one small, shared public-scope module that defines the audio category and guide allowlists. Pages, search, sitemap and navigation consume this same boundary, so an inactive public vertical cannot accidentally remain discoverable through another route. Supabase tables and product records are retained unchanged; public rendering and indexation are narrowed at the application layer.

**Tech Stack:** Next.js 14 App Router, TypeScript, React, Supabase, Tailwind CSS, existing Node test runner.

**Spec:** `docs/fluxlab-premium-refonte-plan.md`, plus this plan.

## Global Constraints

- Work only in `D:\Stackera\fluxlab-audio-first-free-focus` on branch `audio-first-free-focus`.
- Do not delete Supabase tables, categories, products, offers, images or existing source articles.
- The public catalogue scope is Studio & Son only: microphones, interfaces/preamps, monitoring, acoustic treatment and audio accessories.
- Public navigation must not promise Video, Image & Lumière or Streaming hardware.
- Keep the existing `/categorie/audio` URL as the Studio & Son landing page.
- Do not redirect deleted Video/Streaming documents to unrelated Audio pages; use a genuine relevant successor only when one exists.
- Use 404 for retired pages in this first implementation. A permanent 410 endpoint can be added later only if a verified Next.js route strategy is chosen.
- Do not use `noindex` as a substitute for removing dead content: pages removed from the public offer must become unavailable and leave the sitemap.
- Keep the configurator visible, but present it only for audio projects until its Video/Streaming catalogue is independently reliable.
- Do not add dependencies. Reuse the existing TypeScript, Next.js and test setup.
- Every task ends with its stated focused test and a commit; do not mix this work with the snapshot branch.

---

## Public-scope decisions

### Audio category allowlist

These category slugs remain public:

```ts
export const AUDIO_CATEGORY_SLUGS = [
  'audio',
  'micros-dynamiques',
  'micros-condensateurs',
  'micros-usb',
  'micros-shotgun',
  'cartes-son',
  'preamplis',
  'casques-studio',
  'enceintes',
  'bras-articules',
  'cable-xlr',
  'traitement-acoustique',
] as const
```

`micros-shotgun` remains because it is an audio capture category, even if many of its use cases involve video. The former root `video`, root `streaming`, their child hardware categories and their products remain in Supabase but leave the public site for this phase.

### Guide scope

Only articles whose `category === 'Audio'` remain publicly listed and addressable. Articles labelled `Vidéo`, `Streaming`, `Matériel` and `Acoustique` are retained in source/Supabase history but are hidden for this focused launch. This is intentionally strict: it avoids presenting a mixed catalogue while the new positioning is tested.

### Homepage selection

The three essentials must be audio products:

```ts
const AUDIO_FEATURED_SLUGS = [
  'focusrite-scarlett-2i2-4th-gen',
  'shure-sm7b',
  'beyerdynamic-dt-770-pro-80-ohm',
]
```

If an offer is unavailable, do not silently show a Video/Streaming fallback. Return the available audio subset and display the existing empty-state message when none can be loaded.

## File map

| File | Action | Reason |
| --- | --- | --- |
| `lib/public-audio-scope.ts` | Create | Single source of truth for category and guide public eligibility. |
| `tests/public-audio-scope.test.mjs` | Create | Locks the allowlist and prevents accidental re-exposure. |
| `components/client/Navbar.tsx` | Modify | Remove Video/Streaming menus and expose direct Studio & Son routes. |
| `components/server/Footer.tsx` | Modify | Remove public links to retired verticals. |
| `app/page.tsx` | Modify | Replace Sony/Stream Deck featured products and update metadata/schema. |
| `components/client/HeroSection.tsx` | Modify | Make the homepage promise audio expertise only. |
| `components/home/HomeGuides.tsx` | Modify | Use only public Audio articles; remove YouTube/Video selection. |
| `app/guides/page.tsx` | Modify | List only Audio articles and remove retired category filters. |
| `components/client/GuidesClient.tsx` | Modify | Render only passed public categories; no change to filtering mechanics. |
| `app/guide/[slug]/page.tsx` | Modify | Return `notFound()` for retired guide URLs, including metadata. |
| `app/categorie/[slug]/page.tsx` | Modify | Return `notFound()` for non-audio category URLs before product queries. |
| `app/produit/[slug]/page.tsx` | Modify | Hide non-audio products from direct public URLs and static params. |
| `app/api/search/route.ts` | Modify | Search only public audio products. |
| `app/sitemap.ts` | Modify | Remove retired category, product and guide URLs from sitemap. |
| `next.config.mjs` | Modify only if needed | Add a 301 only for an old URL with an exact Audio successor. |
| `tests/homepage-design.test.mjs` | Modify | Assert three audio essentials and Audio-only guide selection. |
| `tests/public-routes.test.mjs` | Create | Contract-test scope helper and sitemap inputs without network access. |

## Task 1: Define the single public Audio scope

**Files:**
- Create: `lib/public-audio-scope.ts`
- Create: `tests/public-audio-scope.test.mjs`

**Interfaces:**
- Produces `AUDIO_CATEGORY_SLUGS`, `isPublicAudioCategory(slug)`, `isPublicAudioGuide(article)`.
- Consumed by category pages, product pages, search, guides, homepage and sitemap.

- [ ] **Step 1: Write the failing scope test**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { isPublicAudioCategory, isPublicAudioGuide } from '../lib/public-audio-scope.ts'

test('keeps Studio & Son categories and rejects retired verticals', () => {
  assert.equal(isPublicAudioCategory('cartes-son'), true)
  assert.equal(isPublicAudioCategory('traitement-acoustique'), true)
  assert.equal(isPublicAudioCategory('video'), false)
  assert.equal(isPublicAudioCategory('stream-deck'), false)
})

test('keeps only Audio articles in the public guide scope', () => {
  assert.equal(isPublicAudioGuide({ category: 'Audio' }), true)
  assert.equal(isPublicAudioGuide({ category: 'Vidéo' }), false)
  assert.equal(isPublicAudioGuide({ category: 'Streaming' }), false)
})
```

- [ ] **Step 2: Run the test and confirm it fails because the module is absent**

Run: `node --experimental-strip-types --test tests/public-audio-scope.test.mjs`

Expected: module-resolution failure for `lib/public-audio-scope.ts`.

- [ ] **Step 3: Add the smallest shared scope module**

```ts
export const AUDIO_CATEGORY_SLUGS = [
  'audio', 'micros-dynamiques', 'micros-condensateurs', 'micros-usb',
  'micros-shotgun', 'cartes-son', 'preamplis', 'casques-studio',
  'enceintes', 'bras-articules', 'cable-xlr', 'traitement-acoustique',
] as const

const PUBLIC_AUDIO_CATEGORY_SET = new Set<string>(AUDIO_CATEGORY_SLUGS)

export function isPublicAudioCategory(slug: string | null | undefined): boolean {
  return typeof slug === 'string' && PUBLIC_AUDIO_CATEGORY_SET.has(slug)
}

export function isPublicAudioGuide(article: { category: string }): boolean {
  return article.category === 'Audio'
}
```

- [ ] **Step 4: Run the focused test**

Run: `node --experimental-strip-types --test tests/public-audio-scope.test.mjs`

Expected: 2 passing tests.

- [ ] **Step 5: Commit**

```powershell
git add lib/public-audio-scope.ts tests/public-audio-scope.test.mjs
git commit -m "feat: define public audio catalogue scope"
```

## Task 2: Rebuild the public navigation around Studio & Son

**Files:**
- Modify: `components/client/Navbar.tsx`
- Modify: `components/server/Footer.tsx`

**Interfaces:**
- Consumes `AUDIO_CATEGORY_SLUGS` conceptually; links must point only to its category routes.
- Produces desktop and mobile navigation with no Video/Streaming hardware entry point.

- [ ] **Step 1: Add a source-level regression test to the existing homepage/navigation test file**

```js
test('navbar no longer exposes retired Video or Streaming verticals', () => {
  const navbar = readFileSync('components/client/Navbar.tsx', 'utf8')
  assert.doesNotMatch(navbar, /label:\s*'Image & Lumière'/)
  assert.doesNotMatch(navbar, /label:\s*'Streaming'/)
  assert.match(navbar, /label:\s*'Microphones'/)
  assert.match(navbar, /label:\s*'Interfaces'/)
  assert.match(navbar, /label:\s*'Monitoring'/)
})
```

- [ ] **Step 2: Run it and confirm failure against the current three-vertical menu**

Run: `node --test tests/homepage-design.test.mjs`

Expected: failure because the current navbar still contains `Image & Lumière` and `Streaming`.

- [ ] **Step 3: Replace the three-universe menu with direct audio navigation**

Use these visible items and targets; preserve existing search and Atelier CTA:

```ts
const AUDIO_NAV = [
  { label: 'Microphones', href: '/categorie/micros-dynamiques' },
  { label: 'Interfaces', href: '/categorie/cartes-son' },
  { label: 'Monitoring', href: '/categorie/casques-studio' },
  { label: 'Acoustique', href: '/categorie/traitement-acoustique' },
  { label: 'Accessoires', href: '/categorie/bras-articules' },
]
```

Keep the existing Studio & Son mega-menu content if useful, but remove its numbered decorative framing only if it obstructs direct navigation. Remove all Video and Streaming menu objects and mobile links. In the footer, retain only Audio category links, Guides and Atelier.

- [ ] **Step 4: Run the source-level test and inspect desktop/mobile**

Run: `node --test tests/homepage-design.test.mjs`

Expected: the navigation test passes.

Manual check: open `http://localhost:3001/` at desktop and mobile width; confirm there is no link to `/categorie/video` or `/categorie/streaming`.

- [ ] **Step 5: Commit**

```powershell
git add components/client/Navbar.tsx components/server/Footer.tsx tests/homepage-design.test.mjs
git commit -m "feat: focus navigation on studio and sound"
```

## Task 3: Re-scope homepage messaging, essentials and guides

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/client/HeroSection.tsx`
- Modify: `components/home/HomeProductShowcase.tsx`
- Modify: `components/home/HomeGuides.tsx`
- Modify: `tests/homepage-design.test.mjs`

**Interfaces:**
- Consumes the three explicit featured audio slugs and `isPublicAudioGuide`.
- Produces an Audio-first homepage with exactly three Studio & Son essentials.

- [ ] **Step 1: Write failing assertions for the homepage scope**

```js
test('homepage selection uses three audio products and no video or streaming products', () => {
  const page = readFileSync('app/page.tsx', 'utf8')
  assert.match(page, /focusrite-scarlett-2i2-4th-gen/)
  assert.match(page, /shure-sm7b/)
  assert.match(page, /beyerdynamic-dt-770-pro-80-ohm/)
  assert.doesNotMatch(page, /sony-zv-e10/)
  assert.doesNotMatch(page, /elgato-stream-deck-mk2/)
})
```

- [ ] **Step 2: Run it and confirm failure**

Run: `node --test tests/homepage-design.test.mjs`

Expected: failure because Sony and Stream Deck are currently selected.

- [ ] **Step 3: Apply the smallest content and query changes**

- In `app/page.tsx`, replace featured slugs with the three audio slugs above.
- Change homepage metadata, WebPage schema `name`, `description` and `about` to Studio & Son / matériel audio. Do not claim Video or Streaming.
- In `HeroSection.tsx`, keep the approved design system but rewrite the promise around building a reliable audio chain: voice, podcast, recording and home studio.
- In `HomeProductShowcase.tsx`, make the empty-state and CTA say `Explorer le catalogue audio`.
- In `HomeGuides.tsx`, remove `setup-youtube-debutant-2026`, use three or four Audio guide slugs only, and filter through `isPublicAudioGuide` before rendering.

- [ ] **Step 4: Run tests and browser-check the section**

Run: `node --test tests/homepage-design.test.mjs`

Expected: passing homepage tests.

Manual check: the three visible cards are an interface, a microphone and a monitoring product. No camera or Stream Deck appears in “Les essentiels du moment”.

- [ ] **Step 5: Commit**

```powershell
git add app/page.tsx components/client/HeroSection.tsx components/home/HomeProductShowcase.tsx components/home/HomeGuides.tsx tests/homepage-design.test.mjs
git commit -m "feat: refocus homepage on studio and sound"
```

## Task 4: Restrict public category and product pages without deleting database records

**Files:**
- Modify: `app/categorie/[slug]/page.tsx`
- Modify: `app/produit/[slug]/page.tsx`
- Modify: `tests/public-routes.test.mjs`

**Interfaces:**
- Consumes `isPublicAudioCategory` from `lib/public-audio-scope.ts`.
- Produces 404 responses for retired category/product URLs while retaining every row in Supabase.

- [ ] **Step 1: Write the failing public-route contract test**

```js
test('category and product pages use the shared public scope', () => {
  const categoryPage = readFileSync('app/categorie/[slug]/page.tsx', 'utf8')
  const productPage = readFileSync('app/produit/[slug]/page.tsx', 'utf8')
  assert.match(categoryPage, /isPublicAudioCategory\(slug\)/)
  assert.match(productPage, /categories\(slug\)/)
  assert.match(productPage, /isPublicAudioCategory\(categorySlug\)/)
})
```

- [ ] **Step 2: Run it and confirm failure**

Run: `node --test tests/public-routes.test.mjs`

Expected: assertions fail because the current routes have no public scope guard.

- [ ] **Step 3: Gate categories before querying products**

At the start of both `generateMetadata` and the default page in `app/categorie/[slug]/page.tsx`:

```ts
if (!isPublicAudioCategory(slug)) notFound()
```

Then reduce `CATEGORY_METADATA`, `VERTICALS`, `CATEGORY_SLUGS`-equivalent values and category page cross-links to Audio-only values. Retain the old category data in Supabase; no migration is required.

- [ ] **Step 4: Gate direct product URLs by their category**

Update `getProduct` to select its category alongside its offers:

```ts
.select('*, categories(slug), product_offers(*)')
```

Resolve the possibly-array `categories` relation, then return `null` when `isPublicAudioCategory(categorySlug)` is false. Apply the same scope to `generateStaticParams` by selecting `slug, categories(slug)` and filtering before returning slugs. `notFound()` will therefore make legacy non-audio product URLs return 404 without deleting their record.

- [ ] **Step 5: Run contract test and manually test status behavior**

Run: `node --test tests/public-routes.test.mjs`

Expected: passing route contract.

Manual check:

```text
/categorie/cartes-son          -> 200
/categorie/video               -> 404
/produit/focusrite-scarlett-2i2-4th-gen -> 200
/produit/sony-zv-e10           -> 404
```

- [ ] **Step 6: Commit**

```powershell
git add app/categorie/[slug]/page.tsx app/produit/[slug]/page.tsx tests/public-routes.test.mjs
git commit -m "feat: hide retired catalogue routes from public site"
```

## Task 5: Restrict search, Guides and individual guide routes

**Files:**
- Modify: `app/api/search/route.ts`
- Modify: `app/guides/page.tsx`
- Modify: `components/client/GuidesClient.tsx`
- Modify: `app/guide/[slug]/page.tsx`
- Modify: `tests/public-routes.test.mjs`

**Interfaces:**
- Consumes `isPublicAudioCategory` and `isPublicAudioGuide`.
- Produces audio-only product search, guide listing and direct guide rendering.

- [ ] **Step 1: Extend the failing route test**

```js
test('guides and search import the shared audio scope', () => {
  const guides = readFileSync('app/guides/page.tsx', 'utf8')
  const guide = readFileSync('app/guide/[slug]/page.tsx', 'utf8')
  const search = readFileSync('app/api/search/route.ts', 'utf8')
  assert.match(guides, /isPublicAudioGuide/)
  assert.match(guide, /isPublicAudioGuide\(article\)/)
  assert.match(search, /categories\(slug\)/)
  assert.match(search, /isPublicAudioCategory/)
})
```

- [ ] **Step 2: Run it and confirm failure**

Run: `node --test tests/public-routes.test.mjs`

Expected: scope imports are absent.

- [ ] **Step 3: Filter guides at the server boundary**

In `app/guides/page.tsx`, create `publicArticles` before sorting:

```ts
const publicArticles = ARTICLES.filter(isPublicAudioGuide)
const sortedArticles = [...publicArticles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
const categories = ['Tous', 'Audio']
```

Pass only `otherArticles` to `GuidesClient`. Do not keep empty Video or Streaming filter buttons.

In `app/guide/[slug]/page.tsx`, return the existing `notFound()` result whenever `article` is absent **or** `!isPublicAudioGuide(article)`. Repeat the condition in `generateMetadata` so hidden guides do not keep issuing metadata.

- [ ] **Step 4: Filter product search by category relation**

Select `categories(slug)` in `app/api/search/route.ts`, then filter returned rows in TypeScript:

```ts
const publicRows = (data ?? []).filter((product: any) => {
  const category = Array.isArray(product.categories) ? product.categories[0] : product.categories
  return isPublicAudioCategory(category?.slug)
})
```

Map `publicRows`, not `data`, to JSON. This avoids a fragile hard-coded category UUID and preserves Supabase records.

- [ ] **Step 5: Run test and browser-check**

Run: `node --test tests/public-routes.test.mjs`

Expected: all public-route contracts pass.

Manual check: `/guides` offers only Audio; a former Video/Streaming guide returns 404; navbar search never returns Sony, Elgato camera/light or Stream Deck products.

- [ ] **Step 6: Commit**

```powershell
git add app/api/search/route.ts app/guides/page.tsx components/client/GuidesClient.tsx app/guide/[slug]/page.tsx tests/public-routes.test.mjs
git commit -m "feat: limit guides and search to audio catalogue"
```

## Task 6: Generate an Audio-only sitemap and clean internal discovery

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `components/client/CategoryContent.tsx`
- Modify: `next.config.mjs` only for verified one-to-one redirects
- Modify: `tests/public-routes.test.mjs`

**Interfaces:**
- Consumes the shared category/guide scope.
- Produces a sitemap containing only URLs intended to remain indexed.

- [ ] **Step 1: Add a failing sitemap source test**

```js
test('sitemap derives categories and guides from the audio public scope', () => {
  const sitemap = readFileSync('app/sitemap.ts', 'utf8')
  assert.match(sitemap, /AUDIO_CATEGORY_SLUGS/)
  assert.match(sitemap, /isPublicAudioGuide/)
  assert.match(sitemap, /isPublicAudioCategory/)
  assert.doesNotMatch(sitemap, /"video", "streaming"/)
})
```

- [ ] **Step 2: Run it and confirm failure**

Run: `node --test tests/public-routes.test.mjs`

Expected: old hard-coded `video` and `streaming` sitemap entries make the test fail.

- [ ] **Step 3: Scope sitemap URLs**

- Replace the hard-coded vertical list with `AUDIO_CATEGORY_SLUGS`.
- Filter `ARTICLES` with `isPublicAudioGuide` before producing guide URLs.
- Select `slug, updated_at, categories(slug)` for product URLs and filter with `isPublicAudioCategory` before mapping.
- Filter `PATHWAYS` or remove it from sitemap if an audio-only predicate cannot be established from its actual data. Do not keep a pathway that links to retired hardware.

Update `components/client/CategoryContent.tsx` mappings so retained Audio categories never point to a hidden Video or Streaming article.

Only add a permanent redirect in `next.config.mjs` when the old URL and destination cover exactly the same user intent. Example: an old duplicate Audio guide can redirect to a newer Audio guide. Do **not** redirect `/categorie/video` or a Sony camera guide to `/categorie/audio`.

- [ ] **Step 4: Run the test and inspect sitemap output**

Run: `node --test tests/public-routes.test.mjs`

Expected: sitemap source test passes.

Manual check after starting the site: inspect `http://localhost:3001/sitemap.xml`. It must not contain `/categorie/video`, `/categorie/streaming`, retired child categories, Video/Streaming guides or their products.

- [ ] **Step 5: Commit**

```powershell
git add app/sitemap.ts components/client/CategoryContent.tsx next.config.mjs tests/public-routes.test.mjs
git commit -m "feat: publish audio-only sitemap"
```

## Task 7: End-to-end verification and deployment handoff

**Files:**
- Modify only if a verification reveals a defect in Tasks 1–6.
- Do not create unrelated design work.

**Interfaces:**
- Verifies public scope, UI, sitemap and existing project build.

- [ ] **Step 1: Run the focused tests**

```powershell
node --experimental-strip-types --test tests/public-audio-scope.test.mjs
node --test tests/public-routes.test.mjs
node --test tests/homepage-design.test.mjs
```

Expected: all tests pass.

- [ ] **Step 2: Run project checks**

```powershell
npx tsc --noEmit --incremental false
npm run test:atelier
npm run build
```

Expected: TypeScript, Atelier tests and production build pass. If `npm run lint` prompts for initial setup, do not claim it ran successfully; it is not a release gate until configured.

- [ ] **Step 3: Perform browser acceptance checks on port 3001**

```powershell
npm run dev -- -p 3001
```

Check desktop, tablet and mobile:

1. Homepage: Audio-first promise and exactly three audio essentials.
2. Navbar / footer: no public Image & Lumière or Streaming hardware menu.
3. `/categorie/audio`, `/categorie/cartes-son`, `/categorie/casques-studio`: visible and coherent.
4. `/categorie/video`, `/categorie/streaming`: 404.
5. `/guides`: Audio articles only; hidden guide direct URL: 404.
6. Search: only Audio products.
7. `/sitemap.xml`: only public Audio URLs.
8. `/configurateur`: no visual claim that it configures camera, lighting or streaming hardware.

Never stop or reuse port 3000: it belongs to Inbetune.

- [ ] **Step 4: Commit verification fixes, then push only this branch**

```powershell
git status --short
git add <verified-files>
git commit -m "fix: complete audio-first public scope"
git push -u origin audio-first-free-focus
```

Do not merge to `mobile-responsive-seo-fixes`, `master` or deploy Vercel until the user has reviewed the branch in a preview.

## Google Search Console and indexation checklist

This is not a code task; complete it only **after** the Audio-first branch is deployed to a preview and then to the intended production branch.

1. Confirm the production sitemap at `https://fluxlab.fr/sitemap.xml` contains only public Audio pages.
2. Resubmit the same sitemap URL in Google Search Console. Google discovers changed URLs when it recrawls; it does not require a new sitemap URL.
3. Use URL Inspection on `/categorie/audio`, an Audio product and an Audio guide; request indexing for the important revised pages only.
4. Inspect a retired Video/Streaming URL after deployment. It should return 404. Google will eventually remove it after recrawl.
5. Use the Search Console **Removals** tool only when a URL must disappear quickly from results; it is temporary and does not replace a 404/410 response.
6. Monitor the Pages report over the following weeks. “Not found (404)” for intentionally retired pages is expected while Google processes the change.
7. If an old page has a genuine equivalent Audio replacement, create a 301 to that exact replacement; otherwise keep the 404. Redirecting every removed page to the homepage or Audio landing page is a poor signal and may be treated as a soft 404.

## Coverage review

| Requirement | Plan coverage |
| --- | --- |
| Preserve Supabase tables/data | Global constraints; Tasks 4 and 5 gate rendering only. |
| Keep Studio & Son products | Task 1 allowlist; Tasks 3–6 consume it. |
| Remove public Image/Lumière and Streaming | Tasks 2, 4, 5 and 6. |
| Replace Sony home essential | Task 3 explicit audio product list. |
| Keep exactly three essentials | Task 3 test and homepage selection. |
| Hide non-audio articles | Task 5 and sitemap Task 6. |
| Rework URLs/indexation | Tasks 4–6 and Search Console checklist. |
| Preserve previous version | Worktree is based on `snapshot-premium-atelier-guides-2026-09-17`; no changes to that branch. |

## AntiGravity execution note

Work in short batches: Tasks 1–3, show the homepage/nav for review; Tasks 4–6, show the route/sitemap behavior; then run Task 7. Do not undertake the catalogue-enrichment or configurator-backend work described in `docs/atelier-fluxlab-handoff-antigravity.md` during this refocus. It is intentionally a separate stream.
