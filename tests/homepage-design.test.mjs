import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const hero = await readFile(new URL('../components/client/HeroSection.tsx', import.meta.url), 'utf8')
const page = await readFile(new URL('../app/page.tsx', import.meta.url), 'utf8')
const card = await readFile(new URL('../components/ui/ProductCard.tsx', import.meta.url), 'utf8')

assert.equal(hero.includes('hero1.webp'), false, 'the legacy homepage photograph must be removed')
assert.match(hero, /HeroContextGrid/, 'the hero must use the context grid component')
assert.match(page, /HomeProductShowcase/, 'the homepage must expose the product and compatibility composition')
assert.match(card, /bg-white/, 'product imagery must remain on a neutral white surface')
assert.equal(hero.includes('Testé en studio'), false, 'unverified trust claims must not be rendered')
assert.equal(hero.includes('Prix temps réel'), false, 'unverified freshness claims must not be rendered')

console.log('homepage design contract: ok')
