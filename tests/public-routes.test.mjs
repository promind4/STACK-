import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('category and product pages use the shared public scope', () => {
  const categoryPage = readFileSync('app/categorie/[slug]/page.tsx', 'utf8')
  const productPage = readFileSync('app/produit/[slug]/page.tsx', 'utf8')
  assert.match(categoryPage, /isPublicAudioCategory\(slug\)/)
  assert.match(productPage, /categories\(slug\)/)
  assert.match(productPage, /isPublicAudioCategory\(categorySlug\)/)
})

test('guides and search import the shared audio scope', () => {
  const guides = readFileSync('app/guides/page.tsx', 'utf8')
  const guide = readFileSync('app/guide/[slug]/page.tsx', 'utf8')
  const search = readFileSync('app/api/search/route.ts', 'utf8')
  assert.match(guides, /isPublicAudioGuide/)
  assert.match(guide, /isPublicAudioGuide\(article\)/)
  assert.match(search, /categories\(slug\)/)
  assert.match(search, /isPublicAudioCategory/)
})

test('sitemap derives categories and guides from the audio public scope', () => {
  const sitemap = readFileSync('app/sitemap.ts', 'utf8')
  assert.match(sitemap, /AUDIO_CATEGORY_SLUGS/)
  assert.match(sitemap, /isPublicAudioGuide/)
  assert.match(sitemap, /isPublicAudioCategory/)
  assert.doesNotMatch(sitemap, /"video", "streaming"/)
})


