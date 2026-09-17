import assert from 'node:assert/strict'
import test from 'node:test'

import { deriveRecommendationProfile } from '../../lib/atelier/profile.ts'

test('marks an unknown category as to_enrich', () => {
  const profile = deriveRecommendationProfile({
    categorySlug: 'unknown-category',
    specs: {},
  })

  assert.equal(profile.status, 'to_enrich')
})

test('marks a known role with insufficient facts as partial', () => {
  const profile = deriveRecommendationProfile({
    categorySlug: 'micros-dynamiques',
    specs: {},
  })

  assert.equal(profile.role, 'microphone')
  assert.equal(profile.status, 'partial')
})

test('marks a documented XLR microphone as ready', () => {
  const profile = deriveRecommendationProfile({
    categorySlug: 'micros-dynamiques',
    specs: {
      subtype: 'dynamic',
      uses: ['podcast'],
      connections: ['XLR'],
      requires: ['interface'],
      roomFit: ['untreated', 'treated'],
      qualities: ['cardioid'],
    },
  })

  assert.equal(profile.status, 'ready')
})

test('derives an interface requirement for an XLR microphone without requires', () => {
  const profile = deriveRecommendationProfile({
    categorySlug: 'micros-dynamiques',
    specs: {
      subtype: 'dynamic',
      uses: ['podcast'],
      connections: ['XLR'],
      roomFit: ['untreated', 'treated'],
      qualities: ['cardioid'],
    },
  })

  assert.deepEqual(profile.requires, ['interface'])
  assert.equal(profile.status, 'ready')
})

for (const field of ['uses', 'connections', 'qualities'] as const) {
  test(`does not count a blank ${field} value as a documented fact`, () => {
    const profile = deriveRecommendationProfile({
      categorySlug: 'micros-dynamiques',
      specs: {
        subtype: 'dynamic',
        uses: field === 'uses' ? [' '] : ['podcast'],
        connections: field === 'connections' ? [' '] : ['XLR'],
        requires: ['interface'],
        roomFit: ['untreated', 'treated'],
        qualities: field === 'qualities' ? [''] : ['cardioid'],
      },
    })

    assert.deepEqual(profile[field], [])
    assert.equal(profile.status, field === 'connections' ? 'partial' : 'ready')
  })
}

test('applies override over editorial, specs, and category defaults', () => {
  const profile = deriveRecommendationProfile({
    categorySlug: 'micros-dynamiques',
    specs: {
      role: 'headphones',
      subtype: 'from-specs',
      uses: ['from-specs'],
      connections: ['USB'],
    },
    editorial: {
      uses: ['from-editorial'],
      connections: ['XLR'],
    },
    override: {
      connections: ['USB-C'],
    },
  })

  assert.equal(profile.role, 'headphones')
  assert.equal(profile.subtype, 'from-specs')
  assert.deepEqual(profile.uses, ['from-editorial'])
  assert.deepEqual(profile.connections, ['USB-C'])
})

test('does not promote an unknown role to ready', () => {
  const profile = deriveRecommendationProfile({
    categorySlug: null,
    specs: {
      role: 'unknown',
      uses: ['podcast'],
      connections: ['XLR'],
      qualities: ['cardioid'],
    },
    override: { status: 'ready' },
  })

  assert.equal(profile.status, 'to_enrich')
})
