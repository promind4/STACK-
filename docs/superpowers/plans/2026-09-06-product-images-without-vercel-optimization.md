# Product Images Without Vercel Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep Supabase-hosted product images visible when Vercel Image Optimization returns HTTP 402, while retaining optimization for editorial and local assets.

**Architecture:** A pure URL policy identifies direct Supabase Storage object URLs. Product-image components pass that policy to `next/image` through its `unoptimized` prop, making those requests go straight to Supabase instead of `/_next/image`. The reusable product card also removes a failed image from the DOM and renders a deliberate fallback state.

**Tech Stack:** Next.js 14, React 18, TypeScript, Node.js built-in test runner.

---

### Task 1: Specify the image-source policy

**Files:**
- Create: `tests/image-policy.test.mjs`
- Create: `lib/imagePolicy.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write the failing test**

Create `tests/image-policy.test.mjs` to import `isDirectSupabaseStorageUrl` from `lib/imagePolicy.ts` and assert these cases:

```js
assert.equal(isDirectSupabaseStorageUrl('https://project.supabase.co/storage/v1/object/public/images-produit/item.png'), true)
assert.equal(isDirectSupabaseStorageUrl('https://project.supabase.co/storage/v1/render/image/public/images-produit/item.png?width=320'), false)
assert.equal(isDirectSupabaseStorageUrl('/images/editorial/hero.webp'), false)
assert.equal(isDirectSupabaseStorageUrl('https://images.unsplash.com/photo-1'), false)
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node tests/image-policy.test.mjs`

Expected: failure because `lib/imagePolicy.mjs` does not yet export the policy.

- [ ] **Step 3: Implement the minimal URL policy and test command**

Create `lib/imagePolicy.mjs` with an exported function that parses absolute URLs, accepts only a `*.supabase.co` hostname with `/storage/v1/object/` in its pathname, and returns `false` for malformed, local, transformed, or unrelated URLs. Add `"test:images": "node tests/image-policy.test.mjs"` to `package.json`.

- [ ] **Step 4: Run the policy test**

Run: `npm run test:images`

Expected: all four assertions pass.

### Task 2: Bypass Vercel optimization for product-card images

**Files:**
- Modify: `components/ui/ProductCard.tsx`
- Test: `tests/image-policy.test.mjs`

- [ ] **Step 1: Add the image-failure expectation to the component review checklist**

Confirm the card must render a text fallback after its `Image` `onError` handler fires, instead of retaining a broken browser-image icon.

- [ ] **Step 2: Implement the smallest component change**

Import `isDirectSupabaseStorageUrl`, derive `shouldBypassOptimization` from `product.imageUrl`, pass it to `<Image unoptimized={shouldBypassOptimization}>`, and hold a local `imageFailed` state set by `onError`. When failed, replace the image element with the existing neutral image zone and an `Image indisponible` label.

- [ ] **Step 3: Run the policy test and type-check**

Run: `npm run test:images; npx tsc --noEmit`

Expected: exit code 0.

### Task 3: Apply the same transport policy to product detail images

**Files:**
- Modify: `components/client/ProductGallery.tsx`
- Modify: `components/client/ProductPageContent.tsx`
- Modify: `app/configurateur/page.tsx`
- Modify: `app/guide/[slug]/page.tsx`

- [ ] **Step 1: Update every dynamic product `<Image>` in the listed files**

Import `isDirectSupabaseStorageUrl` and pass `unoptimized={isDirectSupabaseStorageUrl(imageUrl)}` to each image whose source is product data, gallery data, or a Supabase merchant logo. Do not add the prop to local `/images/...` assets or unrelated remote editorial images.

- [ ] **Step 2: Run the policy test and production build**

Run: `npm run test:images; npm run build`

Expected: both commands exit 0.

### Task 4: Verify the browser behaviour and deploy-ready diff

**Files:**
- Modify: `docs/superpowers/plans/2026-09-06-product-images-without-vercel-optimization.md`

- [ ] **Step 1: Verify the local category**

Open `/categorie/video` locally and confirm product images load directly from `*.supabase.co/storage/v1/object/...`, not a `/_next/image` URL.

- [ ] **Step 2: Verify a product detail page**

Open one category product and confirm its gallery loads without an image-optimization request.

- [ ] **Step 3: Record outcome and commit**

Append the actual test and build outcomes to this plan, then commit the code and plan with:

```bash
git add lib/imagePolicy.mjs tests/image-policy.test.mjs package.json components/ui/ProductCard.tsx components/client/ProductGallery.tsx components/client/ProductPageContent.tsx app/configurateur/page.tsx app/guide/[slug]/page.tsx docs/superpowers/plans/2026-09-06-product-images-without-vercel-optimization.md
git commit -m "fix: bypass Vercel optimization for Supabase product images"
```

## Verification record — 2026-09-06

- `node tests/image-policy.test.mjs` failed before implementation because the policy export did not exist, then passed after implementation.
- `npx tsc --noEmit` completed with exit code 0.
- `npm run build` completed with exit code 0 and generated all 425 static pages.
- Local checks confirmed the category cards on `/categorie/keylight` and the gallery, thumbnails, merchant logo, and related products on `/produit/elgato-key-light-mini` render with their product images.
- The initial product-page development error followed a concurrent `next build` and `next dev` run sharing `.next`; restarting the dev server restored the page. It was not caused by the image policy.
