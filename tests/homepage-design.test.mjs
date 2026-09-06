import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const hero = await readFile(new URL('../components/client/HeroSection.tsx', import.meta.url), 'utf8')
const page = await readFile(new URL('../app/page.tsx', import.meta.url), 'utf8')
const card = await readFile(new URL('../components/ui/ProductCard.tsx', import.meta.url), 'utf8')
const showcase = await readFile(new URL('../components/home/HomeProductShowcase.tsx', import.meta.url), 'utf8')
const compatibility = await readFile(new URL('../components/home/CompatibilityPreview.tsx', import.meta.url), 'utf8')
const contextGrid = await readFile(new URL('../components/home/HeroContextGrid.tsx', import.meta.url), 'utf8')
const trustStrip = await readFile(new URL('../components/home/HomeTrustStrip.tsx', import.meta.url), 'utf8').catch((error) => {
  if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return ''
  throw error
})
const trustStripSvgs = trustStrip.match(/<svg\b[^>]*>/g) ?? []

assert.equal(hero.includes('hero1.webp'), false, 'the legacy homepage photograph must be removed')
assert.match(hero, /HeroContextGrid/, 'the hero must use the context grid component')
assert.match(page, /HomeProductShowcase/, 'the homepage must expose the product and compatibility composition')
assert.match(card, /bg-white/, 'product imagery must remain on a neutral white surface')
assert.equal(hero.includes('Testé en studio'), false, 'unverified trust claims must not be rendered')
assert.equal(hero.includes('Prix temps réel'), false, 'unverified freshness claims must not be rendered')
assert.match(card, /interface ProductCardProps\s*{[^}]*\bvariant\?:\s*(?:'default'\s*\|\s*'home-showcase'|'home-showcase'\s*\|\s*'default')/, 'the product card props must declare the homepage showcase variant')
assert.match(card, /variant\s*===\s*'home-showcase'[\s\S]{0,160}?['"]home-showcase-card['"]/, 'the product card must apply the dedicated home-showcase-card layout marker')
assert.match(card, /variant\s*===\s*'home-showcase'[\s\S]{0,160}?aspect-\[4\/5\]/, 'the product card must apply the near-square home-showcase geometry')
assert.match(showcase, /variant="home-showcase"/, 'the homepage showcase must use the home-showcase product card variant')
assert.match(compatibility, /Votre setup/, 'the compatibility graph must be centered on the visitor setup')
assert.match(compatibility, /roleLabels/, 'the compatibility graph must expose semantic role labels')
assert.doesNotMatch(compatibility, /0\{index \+ 1\}/, 'the compatibility graph must not use dynamic numeric labels')
assert.doesNotMatch(contextGrid, /num:/, 'the hero context grid must not retain repeated numeric labels')
assert.equal(trustStripSvgs.length, 4, 'the illustrated trust strip must contain exactly four SVG illustrations')
trustStripSvgs.forEach((svg, index) => {
  assert.match(svg, /\baria-hidden="true"/, `trust strip SVG ${index + 1} must be hidden from assistive technology`)
})
assert.doesNotMatch(trustStrip, /livraison offerte/i, 'the trust strip must not claim free delivery')

console.log('homepage design contract: ok')
