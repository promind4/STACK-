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
