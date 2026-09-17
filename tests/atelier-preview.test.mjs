import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('the isolated Atelier preview uses the real API and never masks incomplete chains', () => {
  const page = readFileSync(new URL('../app/atelier-apercu/page.tsx', import.meta.url), 'utf8')
  assert.match(page, /\/api\/atelier\/recommendation/)
  assert.match(page, /chainComplete/)
  assert.match(page, /conflicts/)
  assert.match(page, /ownedEquipment/)
  assert.match(page, /Ce que vous gardez/)
  assert.match(page, /Votre point de départ/)
  assert.match(page, /Je pars de zéro/)
  assert.match(page, /J’ai déjà de quoi filmer/)
  assert.match(page, /proposal && <section aria-label="Progression du budget"/)
  assert.match(page, /startingPoint !== 'starter' && ownedEquipment.length === 0/)
  assert.match(page, /item\.value === 'starter' \? 4 : 3/)
  assert.match(page, /project === 'video' && item.value === 'upgrade'/)
  assert.equal((page.match(/role: 'headphones'/g) ?? []).length, 4)
  assert.doesNotMatch(page, /sourcePrompts/)
  assert.match(page, /Votre sélection/)
  assert.match(page, /Couvre la captation de votre voix/)
  assert.match(page, /humanizeConflict/)
  assert.doesNotMatch(page, /Aperçu technique|branche de test|version de test/)
  assert.doesNotMatch(page, /generateRecommendation|useProducts|OpenRouter/)
})

test('the primary navigation names and opens the Atelier consistently', () => {
  const navbar = readFileSync(new URL('../components/client/Navbar.tsx', import.meta.url), 'utf8')
  const footer = readFileSync(new URL('../components/server/Footer.tsx', import.meta.url), 'utf8')
  const configurator = readFileSync(new URL('../app/configurateur/page.tsx', import.meta.url), 'utf8')
  const configuratorLayout = readFileSync(new URL('../app/configurateur/layout.tsx', import.meta.url), 'utf8')
  const guide = readFileSync(new URL('../app/guide/[slug]/page.tsx', import.meta.url), 'utf8')
  assert.doesNotMatch(navbar, /Le Labo IA/)
  assert.match(navbar, /href="\/configurateur"/)
  assert.match(footer, /Le carnet Fluxlab/)
  assert.match(configurator, /atelier-apercu\/page/)
  assert.doesNotMatch(configuratorLayout, /Configurateur IA/)
  assert.doesNotMatch(guide, /Labo IA/)
})

test('the admin stores a derived profile for every saved product', () => {
  const admin = readFileSync(new URL('../app/admin/page.tsx', import.meta.url), 'utf8')
  assert.match(admin, /deriveRecommendationProfile/)
  assert.match(admin, /recommendation_profile/)
  assert.match(admin, /categories\.find\(category => category\.id === formData\.category_id\)/)
})
