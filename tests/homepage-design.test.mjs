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

assert.equal(hero.includes('hero1.webp'), false, 'the legacy homepage photograph must be removed')
assert.match(hero, /HeroContextGrid/, 'the hero must use the context grid component')
assert.match(page, /HomeProductShowcase/, 'the homepage must expose the product and compatibility composition')
assert.match(card, /bg-white/, 'product imagery must remain on a neutral white surface')
assert.equal(hero.includes('Testé en studio'), false, 'unverified trust claims must not be rendered')
assert.equal(hero.includes('Prix temps réel'), false, 'unverified freshness claims must not be rendered')
assert.match(card, /home-showcase/, 'the product card must expose the nearly-square homepage showcase variant')
assert.match(card, /interface ProductCardProps\s*{[\s\S]*?variant\?: 'default' \| 'home-showcase'/, 'the product card props must declare the homepage showcase variant')
assert.match(card, /variant === 'home-showcase'/, 'the product card must apply a dedicated homepage showcase layout branch')
assert.match(showcase, /variant="home-showcase"/, 'the homepage showcase must use the home-showcase product card variant')
assert.match(compatibility, /Votre setup/, 'the compatibility graph must be centered on the visitor setup')
assert.match(compatibility, /roleLabels/, 'the compatibility graph must expose semantic role labels')
assert.doesNotMatch(compatibility, /0\{index \+ 1\}/, 'the compatibility graph must not use dynamic numeric labels')
assert.doesNotMatch(contextGrid, /num:/, 'the hero context grid must not retain repeated numeric labels')
assert.match(trustStrip, /<svg[\s\S]*?aria-hidden/, 'the illustrated trust strip must mark decorative SVG artwork as hidden')
assert.doesNotMatch(trustStrip, /livraison offerte/i, 'the trust strip must not claim free delivery')

console.log('homepage design contract: ok')
