import assert from 'node:assert/strict'
import test from 'node:test'

import { deriveRecommendationProfile } from '../../lib/atelier/profile.ts'
import { loadAtelierCatalog } from '../../lib/atelier/repository.ts'

test('a documented USB microphone needs no guessed room or marketing qualities', () => {
  const profile = deriveRecommendationProfile({ categorySlug: 'micros-usb', specs: {} })
  assert.equal(profile.status, 'ready')
  assert.deepEqual(profile.connections, ['USB'])
  assert.deepEqual(profile.requires, [])
  assert.equal(profile.sources?.connections, 'categoryDefaults')
})

test('explicit editorial XLR output makes a dynamic microphone ready and requires an interface', () => {
  const profile = deriveRecommendationProfile({
    categorySlug: 'micros-dynamiques', specs: {},
    description: 'Microphone dynamique avec sortie XLR pour la voix.',
  })
  assert.equal(profile.status, 'ready')
  assert.equal(profile.subtype, 'dynamic')
  assert.deepEqual(profile.connections, ['XLR'])
  assert.deepEqual(profile.requires, ['interface'])
  assert.equal(profile.sources?.connections, 'editorial')
})

test('mixed or negated XLR/USB mentions do not become microphone connections', () => {
  for (const description of [
    'Compatible XLR/USB selon configuration.',
    'Sans sortie XLR, connexion USB non confirmée.',
    'Sortie XLR ou USB selon la version.',
  ]) {
    const profile = deriveRecommendationProfile({ categorySlug: 'micros-dynamiques', specs: {}, description })
    assert.equal(profile.status, 'partial', description)
    assert.deepEqual(profile.connections, [], description)
    assert.ok(profile.uncertainty.includes('connections'), description)
  }
})

test('documented combo XLR inputs establish interface capacity; output counts do not', () => {
  const good = deriveRecommendationProfile({
    categorySlug: 'cartes-son', specs: {}, description: 'Interface avec deux entrées combo XLR et connexion USB à ordinateur.',
  })
  assert.equal(good.status, 'ready')
  assert.equal(good.sourceCapacity, 2)
  assert.deepEqual(good.connections, ['XLR', 'USB'])
  assert.equal(good.sources?.sourceCapacity, 'editorial')

  const outputs = deriveRecommendationProfile({ categorySlug: 'cartes-son', specs: {}, description: 'Deux sorties XLR et connexion USB.' })
  assert.equal(outputs.status, 'partial')
  assert.equal(outputs.sourceCapacity, undefined)

  const noHost = deriveRecommendationProfile({ categorySlug: 'cartes-son', specs: {}, description: 'Deux entrées combo XLR.' })
  assert.equal(noHost.sourceCapacity, 2)
  assert.equal(noHost.status, 'partial')
  assert.ok(noHost.uncertainty.includes('computerConnection'))
})

test('explicit interface USB host link is trusted, but negated or mixed labels are not', () => {
  const ready = deriveRecommendationProfile({ categorySlug: 'cartes-son', specs: {}, description: 'Interface audio USB avec deux entrées combo XLR.' })
  assert.equal(ready.status, 'ready')
  assert.deepEqual(ready.connections.sort(), ['USB', 'XLR'])

  for (const description of [
    'Interface sans USB avec deux entrées combo XLR.',
    'Interface USB/XLR avec deux entrées combo XLR.',
  ]) {
    const profile = deriveRecommendationProfile({ categorySlug: 'cartes-son', specs: {}, description })
    assert.equal(profile.status, 'partial', description)
    assert.equal(profile.connections.includes('USB'), false, description)
  }
})

test('the wired studio-headphone category supplies its standard jack connection', () => {
  const categoryDefault = deriveRecommendationProfile({ categorySlug: 'casques-studio', specs: {}, description: 'Casque de monitoring fermé.' })
  assert.equal(categoryDefault.status, 'ready')
  assert.deepEqual(categoryDefault.connections, ['jack'])
  const ready = deriveRecommendationProfile({ categorySlug: 'casques-studio', specs: {}, description: 'Casque de monitoring fermé avec prise jack 3,5 mm.' })
  assert.equal(ready.status, 'ready')
  assert.equal(ready.subtype, 'closed')
  assert.deepEqual(ready.connections, ['jack'])
})

test('explicit override retains precedence over editorial inference and structured specs', () => {
  const profile = deriveRecommendationProfile({
    categorySlug: 'micros-dynamiques',
    specs: { connections: ['XLR'], sourceCapacity: 2 },
    description: 'Sortie XLR.',
    editorial: { connections: ['USB'] },
    override: { connections: ['USB-C'] },
  })
  assert.deepEqual(profile.connections, ['USB-C'])
  assert.equal(profile.sources?.connections, 'override')
})

test('known structured connection and input formats outrank category guesses', () => {
  const microphone = deriveRecommendationProfile({ categorySlug: 'micros-dynamiques', specs: { connexion: 'XLR' } })
  assert.deepEqual(microphone.connections, ['XLR'])
  assert.equal(microphone.sources?.connections, 'specs')
  const audioInterface = deriveRecommendationProfile({ categorySlug: 'cartes-son', specs: { entrees: '2 entrées combo XLR', connexion: 'USB' } })
  assert.equal(audioInterface.sourceCapacity, 2)
  assert.deepEqual(audioInterface.connections.sort(), ['USB', 'XLR'])
  assert.equal(audioInterface.status, 'ready')
})

test('a webcam subtype comes only from its invariant category and its structured USB fact', () => {
  const profile = deriveRecommendationProfile({ categorySlug: 'webcams-pro', specs: { connexion: 'USB' } })
  assert.equal(profile.status, 'ready')
  assert.equal(profile.subtype, 'webcam')
  assert.deepEqual(profile.connections, ['USB'])
  assert.equal(profile.sources?.subtype, 'categoryDefaults')
  assert.equal(profile.sources?.connections, 'specs')
})

test('a documented microphone, interface and headphones can all be ready without invented qualities', () => {
  const inputs = [
    ['micros-dynamiques', 'Microphone avec sortie XLR.'],
    ['cartes-son', 'Interface avec deux entrées combo XLR et connexion USB.'],
    ['casques-studio', 'Casque monitoring fermé avec prise jack 3,5 mm.'],
  ] as const
  assert.deepEqual(inputs.map(([categorySlug, description]) => deriveRecommendationProfile({ categorySlug, specs: {}, description }).status), ['ready', 'ready', 'ready'])
})

test('catalog category facts survive an older partial stored profile', () => {
  const inputs = [
    ['casques-studio', 'headphones', 'jack'],
    ['webcams-pro', 'camera', 'USB'],
  ] as const

  for (const [categorySlug, role, connection] of inputs) {
    const profile = deriveRecommendationProfile({
      categorySlug,
      specs: {},
      override: { role, connections: [], uncertainty: ['connections'] },
    })
    assert.equal(profile.status, 'ready')
    assert.deepEqual(profile.connections, [connection])
  }
})

test('standalone lighting and acoustic treatment use category invariants', () => {
  const lighting = deriveRecommendationProfile({ categorySlug: 'keylight', specs: {}, override: { connections: [] } })
  assert.equal(lighting.status, 'ready')

  const treatment = deriveRecommendationProfile({ categorySlug: 'traitement-acoustique', specs: {}, override: { roomFit: [] } })
  assert.equal(treatment.status, 'ready')
  assert.equal(treatment.subtype, 'absorption')
  assert.deepEqual(treatment.roomFit, ['untreated', 'treated'])
})

test('monitor connections are extracted from explicit editorial copy', () => {
  const profile = deriveRecommendationProfile({
    categorySlug: 'enceintes',
    specs: {},
    description: 'Enceinte de monitoring avec entrées XLR et TRS.',
    override: { connections: [] },
  })
  assert.equal(profile.status, 'ready')
  assert.deepEqual(profile.connections.sort(), ['TRS', 'XLR'])
})

test('repository reads the persisted recommendation profile before falling back to editorial evidence', async () => {
  const previousFetch = globalThis.fetch
  const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const previousKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const requests: URL[] = []
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://atelier.test.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-fixture'
  const offer = { merchant_name: 'fixture', price: 50, currency: 'EUR', affiliate_link: 'https://offer.test/p', in_stock: true, last_checked_at: '2026-09-14T12:00:00Z' }
  const row = (id: string, category: string, description: string, recommendation_profile = {}) => ({
    id, slug: id, name: id, brand: 'fixture', image_url: null, specs: {},
    description, pros: [], cons: [], categories: { slug: category }, product_offers: [offer], recommendation_profile,
  })
  globalThis.fetch = async (input, init) => {
    const outbound = new Request(input, init)
    requests.push(new URL(outbound.url))
    return Response.json([
      row('ready-mic', 'micros-dynamiques', 'Microphone avec sortie XLR.'),
      row('stored-mic', 'micros-dynamiques', 'Microphone avec sortie XLR.', { connections: ['USB'] }),
      row('reserved-mic', 'micros-condensateurs', 'Conception élégante.'),
      row('unknown', 'unknown-category', 'Microphone avec sortie XLR.'),
    ])
  }
  try {
    const catalog = await loadAtelierCatalog()
    assert.deepEqual(catalog.map(item => [item.id, item.profile.status]), [['ready-mic', 'ready'], ['stored-mic', 'ready'], ['reserved-mic', 'partial']])
    assert.deepEqual(catalog.find(item => item.id === 'stored-mic')?.profile.connections, ['USB'])
    assert.equal(requests.length, 1)
    const selected = requests[0].searchParams.get('select') ?? ''
    for (const field of ['description', 'pros', 'cons']) assert.ok(selected.includes(field), field)
    assert.equal(selected.includes('recommendation_profile'), true)
  } finally {
    globalThis.fetch = previousFetch
    if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl
    if (previousKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = previousKey
  }
})
