import assert from 'node:assert/strict'
import test from 'node:test'

import { recommendAtelier, recommendAtelierPacks } from '../../lib/atelier/engine.ts'
import type { AtelierCatalogProduct, AtelierProfile, RecommendationProfile } from '../../lib/atelier/types.ts'

const offer = (price: number) => ({
  merchantName: 'Partenaire',
  price,
  currency: 'EUR' as const,
  affiliateLink: `https://example.com/${price}`,
  inStock: true,
})

const recommendationProfile = (
  role: RecommendationProfile['role'],
  overrides: Partial<RecommendationProfile> = {},
): RecommendationProfile => ({
  role,
  subtype: 'standard',
  uses: ['podcast', 'streaming', 'music_vocals', 'video'],
  connections: ['USB'],
  requires: [],
  roomFit: ['untreated', 'treated', 'travel'],
  complexity: 'simple',
  qualities: ['reliable'],
  status: 'ready',
  uncertainty: [],
  ...overrides,
})

const product = (
  id: string,
  role: NonNullable<RecommendationProfile['role']>,
  price: number,
  overrides: Partial<RecommendationProfile> = {},
): AtelierCatalogProduct => ({
  id,
  slug: `slug-${id}`,
  name: `Produit ${id}`,
  brand: 'Fluxlab Test',
  imageUrl: null,
  profile: recommendationProfile(role, overrides),
  offers: [offer(price)],
})

const atelierProfile = (overrides: Partial<AtelierProfile> = {}): AtelierProfile => ({
  project: 'podcast',
  sourceCount: 1,
  room: 'untreated',
  mobility: 'fixed',
  ownedEquipment: [],
  budget: 350,
  priority: 'value',
  ...overrides,
})

test('spends up to the budget on an equally suitable, self-contained microphone instead of stopping at the cheapest complete chain', () => {
  const result = recommendAtelier([
    product('microphone', 'microphone', 90, { subtype: 'dynamic', connections: ['XLR'], qualities: ['noise rejection'] }),
    product('interface', 'interface', 100, { sourceCapacity: 1, connections: ['XLR', 'USB'] }),
    product('headphones', 'headphones', 50),
    product('expensive-microphone', 'microphone', 300, { subtype: 'dynamic', qualities: ['noise rejection'] }),
  ], { profile: atelierProfile() })

  // The 300 EUR USB microphone ties the 90 EUR XLR microphone on suitability (same subtype and
  // noise-rejection quality) but needs no interface, so the engine now closes the gap to the
  // 350 EUR budget instead of settling for the cheapest 240 EUR chain.
  assert.deepEqual(result.setup.map(line => line.productId), ['expensive-microphone', 'headphones'])
  assert.equal(result.setup.reduce((total, line) => total + line.subtotal, 0), 350)
  assert.deepEqual(result.proof, {
    budgetRespected: true,
    chainComplete: true,
    connectionsVerified: true,
    offersAvailable: true,
  })
  assert.deepEqual(result.conflicts, [])
  assert.deepEqual(result.candidates.map(item => item.product.productId), ['microphone'])
})

test('does not charge for a separate interface with a self-contained solo USB microphone', () => {
  const result = recommendAtelier([
    product('usb-microphone', 'microphone', 90, { connections: ['USB'] }),
    product('interface', 'interface', 100, { sourceCapacity: 1, connections: ['XLR', 'USB'] }),
    product('headphones', 'headphones', 50),
  ], { profile: atelierProfile({ budget: 800 }) })

  assert.deepEqual(result.setup.map(line => line.productId), ['usb-microphone', 'headphones'])
  assert.equal(result.setup.reduce((sum, line) => sum + line.subtotal, 0), 140)
  assert.equal(result.proof.chainComplete, true)
})

test('uses quantities and interface source capacity for a duo podcast', () => {
  const result = recommendAtelier([
    product('microphone', 'microphone', 80, { subtype: 'dynamic' }),
    product('one-input', 'interface', 70, { sourceCapacity: 1 }),
    product('two-inputs', 'interface', 120, { sourceCapacity: 2 }),
    product('headphones', 'headphones', 40),
  ], { profile: atelierProfile({ sourceCount: 2, budget: 500 }) })

  assert.deepEqual(result.setup.map(line => [line.productId, line.quantity, line.subtotal]), [
    ['microphone', 2, 160],
    ['two-inputs', 1, 120],
    ['headphones', 2, 80],
  ])
  assert.equal(result.proof.chainComplete, true)
})

test('prefers noise rejection and completes an untreated streaming setup under 800 EUR', () => {
  const result = recommendAtelier([
    product('condenser', 'microphone', 40, { subtype: 'condenser', qualities: ['detailed'] }),
    product('dynamic', 'microphone', 100, { subtype: 'dynamic', connections: ['XLR'], qualities: ['noise_rejection'] }),
    product('interface', 'interface', 100, { sourceCapacity: 1, connections: ['XLR', 'USB'] }),
    product('headphones', 'headphones', 50),
    product('camera', 'camera', 150, { mobility: 'fixed' }),
    product('lighting', 'lighting', 80, { mobility: 'fixed' }),
    product('treatment', 'treatment', 100),
  ], { profile: atelierProfile({ project: 'streaming', budget: 800 }) })

  assert.deepEqual(result.setup.map(line => line.productId), [
    'dynamic', 'headphones', 'camera', 'lighting', 'treatment', 'interface',
  ])
  assert.equal(result.setup.reduce((total, line) => total + line.subtotal, 0), 580)
  assert.equal(result.contextualGuide?.slug, 'piece-non-traitee')
})

test('prefers a studio XLR microphone and paired monitors for music vocals in a treated room', () => {
  const result = recommendAtelier([
    product('dynamic', 'microphone', 100, { subtype: 'dynamic', connections: ['USB'] }),
    product('studio', 'microphone', 150, {
      subtype: 'condenser',
      connections: ['XLR'],
      requires: ['interface'],
      qualities: ['studio detail'],
    }),
    product('interface', 'interface', 100, { sourceCapacity: 1, connections: ['XLR', 'USB'] }),
    product('headphones', 'headphones', 50),
    product('monitors', 'monitors', 100),
  ], { profile: atelierProfile({ project: 'music_vocals', room: 'treated', budget: 800 }) })

  assert.equal(result.setup.find(line => line.role === 'microphone')?.productId, 'studio')
  assert.equal(result.setup.find(line => line.role === 'monitors')?.quantity, 2)
  assert.equal(result.proof.chainComplete, true)
})

test('keeps the best documented microphone when another required role is unavailable', () => {
  const result = recommendAtelier([
    product('generic-usb', 'microphone', 40, { connections: ['USB'] }),
    product('studio-xlr', 'microphone', 150, {
      subtype: 'condenser',
      connections: ['XLR'],
      requires: ['interface'],
      qualities: ['studio detail'],
    }),
    product('interface', 'interface', 100, { sourceCapacity: 1, connections: ['XLR', 'USB'] }),
  ], { profile: atelierProfile({ project: 'music_vocals', room: 'treated', budget: 800 }) })

  assert.equal(result.setup.find(line => line.role === 'microphone')?.productId, 'studio-xlr')
})

test('prefers noise rejection for vocals recorded in an untreated room', () => {
  const result = recommendAtelier([
    product('generic-usb', 'microphone', 40, { connections: ['USB'] }),
    product('dynamic', 'microphone', 120, {
      subtype: 'dynamic',
      connections: ['USB'],
      qualities: ['noise rejection'],
    }),
  ], { profile: atelierProfile({ project: 'music_vocals', room: 'untreated', budget: 800 }) })

  assert.equal(result.setup.find(line => line.role === 'microphone')?.productId, 'dynamic')
})

test('keeps replacement alternatives after a microphone is locked', () => {
  const result = recommendAtelier([
    product('locked-generic', 'microphone', 40, { connections: ['USB'] }),
    product('better-dynamic', 'microphone', 120, {
      subtype: 'dynamic',
      connections: ['USB'],
      qualities: ['noise rejection'],
    }),
    product('headphones', 'headphones', 50),
  ], {
    profile: atelierProfile({ budget: 800 }),
    lockedProductIds: ['locked-generic'],
  })

  assert.equal(result.alternatives.some(item => item.product.productId === 'better-dynamic'), true)
})

test('keeps a mobile creator setup on mobile structured profiles', () => {
  const result = recommendAtelier([
    product('fixed-microphone', 'microphone', 50, { roomFit: ['travel'], mobility: 'fixed' }),
    product('mobile-microphone', 'microphone', 80, { roomFit: ['travel'], mobility: 'mobile' }),
    product('headphones', 'headphones', 40),
    product('fixed-camera', 'camera', 100, { mobility: 'fixed' }),
    product('mobile-camera', 'camera', 150, { mobility: 'mobile' }),
    product('fixed-light', 'lighting', 50, { roomFit: ['travel'], mobility: 'fixed' }),
    product('mobile-light', 'lighting', 60, { roomFit: ['travel'], mobility: 'mobile' }),
  ], { profile: atelierProfile({
    project: 'video',
    room: 'travel',
    mobility: 'mobile',
    budget: 500,
  }) })

  assert.deepEqual(result.setup.map(line => line.productId), [
    'mobile-microphone', 'headphones', 'mobile-camera', 'mobile-light',
  ])
})

test('accounts for existing XLR equipment without rebuying it', () => {
  const result = recommendAtelier([
    product('interface', 'interface', 100, { sourceCapacity: 1, connections: ['XLR', 'USB'] }),
    product('headphones', 'headphones', 50),
  ], { profile: atelierProfile({
    ownedEquipment: [{ role: 'microphone', connection: 'xlr' }],
  }) })

  assert.deepEqual(result.setup.map(line => line.productId), ['interface', 'headphones'])
  assert.equal(result.proof.connectionsVerified, true)
})

test('accounts for an existing camera without rebuying it', () => {
  const result = recommendAtelier([
    product('microphone', 'microphone', 80, { subtype: 'dynamic', qualities: ['noise rejection'] }),
    product('interface', 'interface', 80, { sourceCapacity: 1 }),
    product('headphones', 'headphones', 40),
    product('lighting', 'lighting', 50),
    product('treatment', 'treatment', 50),
  ], { profile: atelierProfile({
    project: 'streaming',
    budget: 500,
    ownedEquipment: [{ role: 'camera' }],
  }) })

  assert.equal(result.setup.some(line => line.role === 'camera'), false)
  assert.equal(result.proof.chainComplete, true)
})

test('returns only dependency-closed useful lines and a conflict when budget is insufficient', () => {
  const result = recommendAtelier([
    product('microphone', 'microphone', 90, { requires: ['interface'] }),
    product('interface', 'interface', 100, { sourceCapacity: 1 }),
    product('headphones', 'headphones', 50),
  ], { profile: atelierProfile({ budget: 150 }) })

  assert.ok(result.setup.reduce((total, line) => total + line.subtotal, 0) <= 150)
  assert.equal(result.proof.budgetRespected, true)
  assert.equal(result.proof.chainComplete, false)
  assert.equal(result.conflicts[0]?.code, 'budget_insufficient')
  assert.ok(result.unavailableReason)
})

test('keeps partial products only as reserved alternatives and excludes to_enrich products', () => {
  const partial = product('partial-microphone', 'microphone', 70)
  partial.profile.status = 'partial'
  partial.profile.uncertainty = ['connections']
  const unknown = product('unknown-microphone', 'microphone', 60)
  unknown.profile.status = 'to_enrich'

  const result = recommendAtelier([
    partial,
    unknown,
    product('interface', 'interface', 100, { sourceCapacity: 1 }),
    product('headphones', 'headphones', 50),
  ], { profile: atelierProfile() })

  const visibleProducts = [...result.setup, ...result.candidates.map(item => item.product)]
  assert.equal(visibleProducts.some(item => item.status !== 'ready'), false)
  assert.equal(result.alternatives.some(item => item.product.productId === 'partial-microphone' && item.reason.includes('Réserve')), true)
  assert.equal(JSON.stringify(result).includes('unknown-microphone'), false)
  assert.equal(result.conflicts[0]?.code, 'data_unknown')
})

test('recalculates XLR dependencies and total after an upgrade under the strict 800 EUR ceiling', () => {
  const result = recommendAtelier([
    product('usb-microphone', 'microphone', 300, { connections: ['USB'], requires: ['stand'] }),
    product('xlr-microphone', 'microphone', 500, {
      connections: ['XLR'],
      requires: ['interface', 'stand'],
      qualities: ['upgradeable'],
    }),
    product('headphones', 'headphones', 100),
    product('stand', 'stand', 30),
    product('interface', 'interface', 150, { sourceCapacity: 1, connections: ['XLR', 'USB'] }),
  ], { profile: atelierProfile({
    project: 'video',
    room: 'treated',
    budget: 800,
    priority: 'upgradeability',
    ownedEquipment: [{ role: 'camera' }, { role: 'lighting' }],
  }) })

  assert.equal(result.setup.find(line => line.role === 'microphone')?.productId, 'xlr-microphone')
  assert.equal(result.setup.some(line => line.role === 'interface'), true)
  assert.ok(result.setup.reduce((total, line) => total + line.subtotal, 0) <= 800)
})

test('reports unavailable offers when an XLR dependency has no purchasable offer', () => {
  const unavailableInterface = product('interface', 'interface', 150, {
    sourceCapacity: 1,
    connections: ['XLR', 'USB'],
  })
  unavailableInterface.offers[0].inStock = false

  const result = recommendAtelier([
    product('xlr-microphone', 'microphone', 100, { connections: ['XLR'], requires: ['interface'] }),
    product('headphones', 'headphones', 50),
    unavailableInterface,
  ], { profile: atelierProfile({
    project: 'video',
    room: 'treated',
    ownedEquipment: [{ role: 'camera' }, { role: 'lighting' }],
  }) })

  assert.equal(result.proof.offersAvailable, false)
  assert.equal(result.conflicts[0]?.code, 'data_unknown')
})

test('chooses the cheapest complete combination instead of the cheapest microphone unit', () => {
  const result = recommendAtelier([
    product('xlr-microphone', 'microphone', 100, { connections: ['XLR'], requires: ['interface'] }),
    product('usb-microphone', 'microphone', 120, { connections: ['USB'] }),
    product('interface', 'interface', 200, { sourceCapacity: 1, connections: ['XLR', 'USB'] }),
    product('headphones', 'headphones', 50),
  ], { profile: atelierProfile({
    project: 'video',
    room: 'treated',
    budget: 200,
    ownedEquipment: [{ role: 'camera' }, { role: 'lighting' }],
  }) })

  assert.deepEqual(result.setup.map(line => line.productId), ['usb-microphone', 'headphones'])
  assert.equal(result.setup.reduce((sum, line) => sum + line.subtotal, 0), 170)
  assert.deepEqual(result.conflicts, [])
})

test('selects an XLR-capable interface for an owned XLR microphone', () => {
  const result = recommendAtelier([
    product('usb-interface', 'interface', 70, { sourceCapacity: 1, connections: ['USB'] }),
    product('xlr-interface', 'interface', 100, { sourceCapacity: 1, connections: ['XLR', 'USB'] }),
    product('headphones', 'headphones', 50),
  ], { profile: atelierProfile({
    ownedEquipment: [{ role: 'microphone', connection: 'xlr' }],
  }) })

  assert.equal(result.setup.find(line => line.role === 'interface')?.productId, 'xlr-interface')
  assert.equal(result.proof.connectionsVerified, true)
  assert.deepEqual(result.conflicts, [])
})

test('scales stand and cable dependencies to a duo microphone quantity', () => {
  const result = recommendAtelier([
    product('microphone', 'microphone', 100, { requires: ['stand', 'cable'] }),
    product('interface', 'interface', 100, { sourceCapacity: 2 }),
    product('headphones', 'headphones', 50),
    product('stand', 'stand', 20),
    product('cable', 'cable', 10),
  ], { profile: atelierProfile({ sourceCount: 2, budget: 500 }) })

  assert.equal(result.setup.find(line => line.role === 'stand')?.quantity, 2)
  assert.equal(result.setup.find(line => line.role === 'cable')?.quantity, 2)
  assert.equal(result.setup.reduce((sum, line) => sum + line.subtotal, 0), 460)
})

test('validates partial alternatives with known compatibility, full quantity, dependencies, and budget', () => {
  const valid = product('partial-usb', 'microphone', 120, { connections: ['USB'] })
  valid.profile.status = 'partial'
  valid.profile.uncertainty = ['qualities']
  const overBudget = product('partial-xlr', 'microphone', 160, { connections: ['XLR'], requires: ['interface'] })
  overBudget.profile.status = 'partial'
  overBudget.profile.uncertainty = ['qualities']
  const wrongUse = product('partial-wrong-use', 'microphone', 80, { uses: ['music_vocals'] })
  wrongUse.profile.status = 'partial'
  wrongUse.profile.uncertainty = ['qualities']

  const result = recommendAtelier([
    product('usb-microphone', 'microphone', 100, { connections: ['USB'] }),
    product('headphones', 'headphones', 50),
    product('interface', 'interface', 150, { sourceCapacity: 2, connections: ['XLR', 'USB'] }),
    valid,
    overBudget,
    wrongUse,
  ], { profile: atelierProfile({
    project: 'video',
    sourceCount: 2,
    room: 'treated',
    budget: 500,
    ownedEquipment: [{ role: 'camera' }, { role: 'lighting' }],
  }) })

  const alternative = result.alternatives.find(item => item.product.productId === 'partial-usb')
  assert.equal(alternative?.priceDelta, 40)
  assert.equal(alternative?.reason, 'Réserve : données incomplètes (qualities).')
  assert.equal(result.alternatives.some(item => item.product.productId === 'partial-xlr'), false)
  assert.equal(result.alternatives.some(item => item.product.productId === 'partial-wrong-use'), false)
})

test('marks connections unverified when an owned XLR microphone has no interface', () => {
  const result = recommendAtelier([
    product('headphones', 'headphones', 50),
  ], { profile: atelierProfile({
    project: 'video',
    room: 'treated',
    ownedEquipment: [
      { role: 'microphone', connection: 'xlr' },
      { role: 'camera' },
      { role: 'lighting' },
    ],
  }) })

  assert.equal(result.proof.connectionsVerified, false)
  assert.equal(result.conflicts[0]?.code, 'missing_dependency')
  assert.ok(result.unavailableReason)
})

test('chooses a dependency by complete closure cost instead of local unit price', () => {
  const result = recommendAtelier([
    product('microphone', 'microphone', 100, { requires: ['stand'] }),
    product('headphones', 'headphones', 50),
    product('stand-a', 'stand', 10, { requires: ['interface'] }),
    product('stand-b', 'stand', 20),
    product('interface', 'interface', 300, { sourceCapacity: 1 }),
  ], { profile: atelierProfile({
    project: 'video',
    room: 'treated',
    budget: 200,
    ownedEquipment: [{ role: 'camera' }, { role: 'lighting' }],
  }) })

  assert.deepEqual(result.setup.map(line => line.productId), ['microphone', 'headphones', 'stand-b'])
  assert.equal(result.setup.reduce((sum, line) => sum + line.subtotal, 0), 170)
  assert.equal(result.proof.chainComplete, true)
  assert.deepEqual(result.conflicts, [])
})

test('bounds broad required-role search without dropping the compatible result', () => {
  const roles = ['microphone', 'interface', 'headphones', 'camera', 'lighting', 'treatment'] as const
  let budgetReads = 0
  const catalog = roles.flatMap(role => Array.from({ length: 20 }, (_, index) => {
    return product(`${role}-${index}`, role, 1, {
      ...(role === 'microphone' ? { subtype: 'dynamic', connections: ['XLR'], qualities: ['noise rejection'] } : {}),
      ...(role === 'interface' ? { sourceCapacity: 1, connections: ['XLR', 'USB'] } : {}),
    })
  }))
  const profile = atelierProfile({ project: 'streaming' })
  Object.defineProperty(profile, 'budget', {
    get() {
      budgetReads += 1
      if (budgetReads > 5_000) throw new Error('required-role search exceeded its work bound')
      return 6
    },
  })

  let result: ReturnType<typeof recommendAtelier> | undefined
  assert.doesNotThrow(() => {
    result = recommendAtelier(catalog, { profile })
  })
  assert.equal(result?.proof.chainComplete, true)
  assert.equal(result?.setup.reduce((sum, line) => sum + line.subtotal, 0), 6)
  assert.ok(budgetReads <= 5_000)
})

test('treats an empty setup as complete when every podcast role is already owned', () => {
  const result = recommendAtelier([], { profile: atelierProfile({
    ownedEquipment: [
      { role: 'microphone', connection: 'usb' },
      { role: 'interface' },
      { role: 'headphones' },
    ],
  }) })

  assert.deepEqual(result.setup, [])
  assert.equal(result.proof.chainComplete, true)
  assert.equal(result.proof.connectionsVerified, true)
  assert.equal(result.conflicts.some(conflict => conflict.code === 'missing_dependency'), false)
  assert.equal(result.unavailableReason, undefined)
})

test('preserves a compatible locked product while completing the setup', () => {
  const result = recommendAtelier([
    product('cheaper-microphone', 'microphone', 80),
    product('locked-microphone', 'microphone', 120, { connections: ['XLR'] }),
    product('interface', 'interface', 70, { sourceCapacity: 1, connections: ['XLR', 'USB'] }),
    product('headphones', 'headphones', 40),
  ], {
    profile: atelierProfile({ budget: 300 }),
    lockedProductIds: ['locked-microphone'],
  })

  assert.deepEqual(result.setup.map(line => [line.productId, line.state]), [
    ['locked-microphone', 'locked'],
    ['headphones', 'selected'],
    ['interface', 'selected'],
  ])
  assert.equal(result.setup.reduce((sum, line) => sum + line.subtotal, 0), 230)
  assert.equal(result.proof.chainComplete, true)
  assert.deepEqual(result.conflicts, [])
})

test('keeps an over-budget locked product visible and exposes the lock conflict', () => {
  const result = recommendAtelier([
    product('locked-microphone', 'microphone', 200),
    product('interface', 'interface', 100, { sourceCapacity: 1 }),
    product('headphones', 'headphones', 50),
  ], {
    profile: atelierProfile({ budget: 150 }),
    lockedProductIds: ['locked-microphone'],
  })

  assert.equal(result.setup.find(line => line.productId === 'locked-microphone')?.state, 'locked')
  assert.ok(result.setup.reduce((sum, line) => sum + line.subtotal, 0) > 150)
  assert.equal(result.proof.budgetRespected, false)
  assert.deepEqual(result.conflicts.find(conflict => conflict.code === 'locked_product_incompatible'), {
    code: 'locked_product_incompatible',
    message: 'Le produit verrouillé locked-microphone rend la configuration incompatible avec le budget.',
    productId: 'locked-microphone',
    resolutions: ['unlock_product', 'increase_budget', 'reduce_scope'],
  })
})

test('closes an XLR lock dependency before reporting its complete over-budget setup', () => {
  const result = recommendAtelier([
    product('locked-xlr', 'microphone', 100, { connections: ['XLR'] }),
    product('xlr-interface', 'interface', 90, { sourceCapacity: 1, connections: ['XLR', 'USB'] }),
    product('headphones', 'headphones', 40),
  ], {
    profile: atelierProfile({ budget: 180 }),
    lockedProductIds: ['locked-xlr'],
  })

  assert.deepEqual(result.setup.map(line => [line.productId, line.state]), [
    ['locked-xlr', 'locked'],
    ['headphones', 'selected'],
    ['xlr-interface', 'selected'],
  ])
  assert.equal(result.setup.reduce((sum, line) => sum + line.subtotal, 0), 230)
  assert.equal(result.proof.budgetRespected, false)
  assert.equal(result.conflicts.some(conflict => conflict.code === 'locked_product_incompatible' && conflict.productId === 'locked-xlr'), true)
})

test('reports an unknown lock deterministically without creating a phantom product', () => {
  const catalog = [
    product('microphone', 'microphone', 80),
    product('interface', 'interface', 70, { sourceCapacity: 1 }),
    product('headphones', 'headphones', 40),
  ]
  const first = recommendAtelier(catalog, {
    profile: atelierProfile(),
    lockedProductIds: ['missing-product'],
  })
  const second = recommendAtelier(catalog, {
    profile: atelierProfile(),
    lockedProductIds: ['missing-product'],
  })

  assert.equal(first.setup.some(line => line.productId === 'missing-product'), false)
  assert.deepEqual(first.conflicts, second.conflicts)
  assert.deepEqual(first.conflicts.find(conflict => conflict.productId === 'missing-product'), {
    code: 'data_unknown',
    message: 'Le produit verrouillé missing-product est absent du catalogue.',
    productId: 'missing-product',
    resolutions: ['verify_data', 'unlock_product'],
  })
})

test('treats duplicate lock IDs idempotently', () => {
  const catalog = [
    product('locked-microphone', 'microphone', 100),
    product('interface', 'interface', 70, { sourceCapacity: 1 }),
    product('headphones', 'headphones', 40),
  ]
  const once = recommendAtelier(catalog, {
    profile: atelierProfile(),
    lockedProductIds: ['locked-microphone'],
  })
  const twice = recommendAtelier(catalog, {
    profile: atelierProfile(),
    lockedProductIds: ['locked-microphone', 'locked-microphone'],
  })

  assert.deepEqual(twice, once)
  assert.equal(twice.setup.filter(line => line.productId === 'locked-microphone').length, 1)
  assert.equal(twice.setup.find(line => line.productId === 'locked-microphone')?.state, 'locked')
})

test('keeps every distinct same-role lock visible while exposing their conflict', () => {
  const result = recommendAtelier([
    product('first-microphone', 'microphone', 80),
    product('second-microphone', 'microphone', 90),
    product('interface', 'interface', 70, { sourceCapacity: 1 }),
    product('headphones', 'headphones', 40),
  ], {
    profile: atelierProfile({ budget: 400 }),
    lockedProductIds: ['first-microphone', 'second-microphone'],
  })

  assert.deepEqual(
    result.setup.filter(line => line.state === 'locked').map(line => line.productId),
    ['first-microphone', 'second-microphone'],
  )
  assert.equal(result.proof.chainComplete, false)
  assert.equal(result.conflicts.some(conflict =>
    conflict.code === 'locked_product_incompatible' && conflict.productId === 'second-microphone'), true)
})

test('keeps incompatible and uncertain locks visible without trusting them as primary recommendations', () => {
  const incompatible = product('wrong-use', 'microphone', 90, { uses: ['music_vocals'] })
  const partial = product('partial-microphone', 'microphone', 100)
  partial.profile.status = 'partial'
  partial.profile.uncertainty = ['connections']
  const toEnrich = product('to-enrich-microphone', 'microphone', 110)
  toEnrich.profile.status = 'to_enrich'
  toEnrich.profile.uncertainty = ['role validation']

  for (const locked of [incompatible, partial, toEnrich]) {
    const result = recommendAtelier([
      locked,
      product('ready-microphone', 'microphone', 80),
      product('interface', 'interface', 70, { sourceCapacity: 1 }),
      product('headphones', 'headphones', 40),
    ], {
      profile: atelierProfile(),
      lockedProductIds: [locked.id],
    })

    assert.equal(result.setup.find(line => line.productId === locked.id)?.state, 'locked')
    assert.equal(result.proof.chainComplete, false)
    assert.equal(result.conflicts.some(conflict => conflict.code === 'locked_product_incompatible' && conflict.productId === locked.id), true)
    assert.equal(result.setup.some(line => line.productId === 'ready-microphone'), false)
  }
})

test('closes and verifies dependencies introduced by an additional same-role lock', () => {
  const result = recommendAtelier([
    product('locked-usb', 'microphone', 80, { connections: ['USB'] }),
    product('locked-xlr', 'microphone', 90, { connections: ['XLR'] }),
    product('xlr-interface', 'interface', 70, { sourceCapacity: 1, connections: ['XLR', 'USB'] }),
    product('headphones', 'headphones', 40),
  ], {
    profile: atelierProfile({
      project: 'video',
      room: 'treated',
      budget: 400,
      ownedEquipment: [{ role: 'camera' }, { role: 'lighting' }],
    }),
    lockedProductIds: ['locked-usb', 'locked-xlr'],
  })

  assert.deepEqual(
    result.setup.filter(line => line.state === 'locked').map(line => line.productId),
    ['locked-usb', 'locked-xlr'],
  )
  assert.equal(result.setup.find(line => line.role === 'interface')?.productId, 'xlr-interface')
  assert.equal(result.proof.connectionsVerified, true)
  assert.equal(result.conflicts.some(conflict =>
    conflict.code === 'locked_product_incompatible' && conflict.productId === 'locked-xlr'), true)
})

test('attributes direct and transitive closure failures to the lock that causes them', () => {
  const blockedByInterface = recommendAtelier([
    product('locked-usb-interface', 'interface', 70, { sourceCapacity: 1, connections: ['USB'] }),
    product('xlr-microphone', 'microphone', 80, { connections: ['XLR'] }),
    product('headphones', 'headphones', 40),
  ], {
    profile: atelierProfile({
      project: 'video',
      room: 'treated',
      budget: 400,
      ownedEquipment: [{ role: 'camera' }, { role: 'lighting' }],
    }),
    lockedProductIds: ['locked-usb-interface'],
  })

  const directConflict = blockedByInterface.conflicts.find(conflict =>
    conflict.code === 'locked_product_incompatible' && conflict.productId === 'locked-usb-interface')
  assert.ok(directConflict?.resolutions.includes('unlock_product'))

  const missingTransitiveDependency = recommendAtelier([
    product('locked-microphone', 'microphone', 80, { requires: ['stand'] }),
    product('stand', 'stand', 30, { requires: ['cable'] }),
    product('headphones', 'headphones', 40),
  ], {
    profile: atelierProfile({
      project: 'video',
      room: 'treated',
      budget: 400,
      ownedEquipment: [{ role: 'camera' }, { role: 'lighting' }],
    }),
    lockedProductIds: ['locked-microphone'],
  })

  const transitiveConflict = missingTransitiveDependency.conflicts.find(conflict =>
    conflict.code === 'locked_product_incompatible' && conflict.productId === 'locked-microphone')
  assert.ok(transitiveConflict?.resolutions.includes('unlock_product'))
})

test('includes additional locks in upgrade and alternative budget checks', () => {
  const result = recommendAtelier([
    product('first-microphone', 'microphone', 80, { connections: ['XLR'] }),
    product('second-microphone', 'microphone', 90, { connections: ['XLR'] }),
    product('base-interface', 'interface', 70, { sourceCapacity: 1, connections: ['XLR', 'USB'] }),
    product('upgrade-interface', 'interface', 250, { sourceCapacity: 2, connections: ['XLR', 'USB'] }),
    product('headphones', 'headphones', 40),
  ], {
    profile: atelierProfile({ budget: 400, priority: 'upgradeability' }),
    lockedProductIds: ['first-microphone', 'second-microphone'],
  })

  assert.equal(result.setup.find(line => line.role === 'interface')?.productId, 'base-interface')
  assert.equal(result.setup.reduce((sum, line) => sum + line.subtotal, 0), 280)
  assert.equal(result.proof.budgetRespected, true)
  assert.equal(result.alternatives.some(item => item.product.productId === 'upgrade-interface'), false)
})

test('returns a single recommended pack without exceeding the cap', () => {
  const result = recommendAtelierPacks([
    product('simple-usb', 'microphone', 90, { connections: ['USB'], complexity: 'simple' }),
    product('studio-xlr', 'microphone', 260, { connections: ['XLR'], complexity: 'advanced', qualities: ['scalable'] }),
    product('interface', 'interface', 150, { sourceCapacity: 2, connections: ['XLR', 'USB'] }),
    product('headphones', 'headphones', 60),
  ], { profile: atelierProfile({ budget: 600 }) })

  assert.equal(result.packs.length, 1)
  assert.equal(result.packs[0].id, 'balance')
  assert.equal(result.packs[0].title, 'Votre setup recommandé')
  assert.equal(result.proof.budgetRespected, true)
  assert.equal(result.packs[0].recommendation.proof.budgetRespected, true)
})

test('includes optimal setup matching the profile and budget in the recommended pack', () => {
  const result = recommendAtelierPacks([
    product('microphone', 'microphone', 50, { connections: ['USB'] }),
    product('cheap-headphones', 'headphones', 20, { connections: ['jack'], complexity: 'moderate' }),
    product('simple-headphones', 'headphones', 100, { connections: ['jack'], complexity: 'simple' }),
  ], { profile: atelierProfile({ budget: 300 }) })

  assert.equal(result.packs.length, 1)
  assert.equal(result.packs[0].id, 'balance')
  assert.equal(result.proof.budgetRespected, true)
  assert.ok(result.setup.some(line => line.role === 'microphone'))
  assert.ok(result.setup.some(line => line.role === 'headphones'))
})

test('offers acoustic treatment and microphone for vocals in an untreated room', () => {
  const result = recommendAtelierPacks([
    product('dynamic', 'microphone', 180, { subtype: 'dynamic', connections: ['USB'], qualities: ['noise rejection'] }),
    product('condenser', 'microphone', 320, { subtype: 'condenser', connections: ['XLR'] }),
    product('interface', 'interface', 120, { sourceCapacity: 2, connections: ['XLR', 'USB'] }),
    product('upgrade-interface', 'interface', 220, { sourceCapacity: 2, connections: ['XLR', 'USB'], qualities: ['upgradeable'] }),
    product('headphones', 'headphones', 80, { connections: ['jack'] }),
    product('basic-treatment', 'treatment', 40, { subtype: 'absorption', roomFit: ['untreated', 'treated'] }),
    product('broadband-treatment', 'treatment', 90, { subtype: 'absorption', roomFit: ['untreated', 'treated'], qualities: ['broadband absorption'] }),
  ], { profile: atelierProfile({ project: 'music_vocals', room: 'untreated', budget: 800 }) })

  assert.equal(result.packs.length, 1)
  assert.equal(result.packs[0].id, 'balance')
  assert.ok(result.setup.some(line => line.role === 'microphone'))
  assert.ok(result.setup.some(line => line.role === 'treatment'))
  assert.ok(result.setup.some(line => line.role === 'headphones'))
  assert.equal(result.proof.budgetRespected, true)
})
