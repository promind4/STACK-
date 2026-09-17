import assert from 'node:assert/strict'
import test from 'node:test'

import { POST } from '../../app/api/atelier/recommendation/route.ts'

const profile = {
  project: 'podcast',
  sourceCount: 1,
  room: 'untreated',
  mobility: 'fixed',
  ownedEquipment: [],
  budget: 350,
  priority: 'value',
}

const request = (body: unknown) => new Request('http://localhost/api/atelier/recommendation', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: typeof body === 'string' ? body : JSON.stringify(body),
})

const offer = (merchant: string, price: number, inStock = true, overrides: Record<string, unknown> = {}) => ({
  merchant_name: merchant,
  price,
  currency: 'EUR',
  affiliate_link: `https://merchant.example/${merchant}`,
  in_stock: inStock,
  last_checked_at: '2026-09-14T12:00:00Z',
  ...overrides,
})

const row = (id: string, category: string, specs: Record<string, unknown>, offers: ReturnType<typeof offer>[]) => ({
  id,
  slug: `slug-${id}`,
  name: `Produit ${id}`,
  brand: 'Fluxlab Test',
  image_url: null,
  specs,
  categories: { slug: category },
  product_offers: offers,
})

const catalog = [
  { ...row('microphone', 'micros-dynamiques', {
    subtype: 'dynamic', uses: ['podcast'], connections: ['USB'], roomFit: ['untreated'], qualities: ['reliable'],
  }, [offer('rupture', 9, false), offer('valide', 90), offer('prix-invalide', 1, true, { currency: 'USD' })]), categories: [{ slug: 'micros-dynamiques' }] },
  row('interface', 'cartes-son', {
    uses: ['podcast'], connections: ['XLR', 'USB'], sourceCapacity: 1, qualities: ['reliable'],
  }, [offer('interface', 100)]),
  row('headphones', 'casques-studio', {
    subtype: 'closed', uses: ['podcast'], connections: ['jack'], qualities: ['reliable'],
  }, [offer('casque', 50)]),
  row('unknown', 'unknown-category', {}, [offer('unknown', 5)]),
  row('irrelevant-camera', 'hybrides-mirrorless', {
    subtype: 'mirrorless', uses: ['video'], connections: ['HDMI'], mobility: 'fixed', qualities: ['reliable'],
  }, [offer('camera', 500)]),
]

test('returns a server-selected recommendation using valid offers without exposing the full catalog or service key', async () => {
  const priorFetch = globalThis.fetch
  const priorUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const priorAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const priorService = process.env.SUPABASE_SERVICE_ROLE_KEY
  const calls: Array<{ url: URL; authorization: string | null }> = []
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://atelier.test.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-test-key'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-secret-sentinel'
  globalThis.fetch = async (input, init) => {
    const outbound = new Request(input, init)
    calls.push({ url: new URL(outbound.url), authorization: outbound.headers.get('authorization') })
    return Response.json(catalog)
  }

  try {
    const response = await POST(request({ profile }))
    const result = await response.json()

    assert.equal(response.status, 200)
    assert.deepEqual(result.setup.map((line: { productId: string; price: number }) => [line.productId, line.price]), [
      ['microphone', 90], ['headphones', 50],
    ])
    assert.equal(result.proof.chainComplete, true)
    assert.equal(JSON.stringify(result).includes('unknown'), false)
    assert.equal(JSON.stringify(result).includes('irrelevant-camera'), false)
    assert.equal(JSON.stringify(result).includes('service-secret-sentinel'), false)
    assert.equal(calls.length, 1)
    assert.equal(calls[0].url.pathname, '/rest/v1/products')
    assert.equal(calls[0].url.searchParams.get('is_active'), 'eq.true')
    assert.match(calls[0].url.searchParams.get('select') ?? '', /categories\(slug\).*product_offers/)
    assert.equal((calls[0].url.searchParams.get('select') ?? '').includes('recommendation_profile'), true)
    assert.equal(calls[0].authorization, 'Bearer anon-test-key')
  } finally {
    globalThis.fetch = priorFetch
    if (priorUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL
    else process.env.NEXT_PUBLIC_SUPABASE_URL = priorUrl
    if (priorAnon === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = priorAnon
    if (priorService === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY
    else process.env.SUPABASE_SERVICE_ROLE_KEY = priorService
  }
})

test('rejects malformed JSON and invalid profile fields before loading the catalog', async () => {
  const invalid = [
    '{broken',
    {},
    { profile: { ...profile, project: 'other' } },
    { profile: { ...profile, sourceCount: 0 } },
    { profile: { ...profile, room: 'garage' } },
    { profile: { ...profile, mobility: 'teleport' } },
    { profile: { ...profile, ownedEquipment: [{ role: 'unknown' }] } },
    { profile: { ...profile, ownedEquipment: [{ role: 'microphone', connection: 'bluetooth' }] } },
    { profile: { ...profile, budget: 0 } },
    { profile: { ...profile, budget: -1 } },
    JSON.stringify({ profile }).replace('"budget":350', '"budget":1e309'),
    { profile: { ...profile, priority: 'unknown' } },
    { profile, lockedProductIds: [''] },
    { profile, lockedProductIds: [42] },
  ]
  const priorFetch = globalThis.fetch
  globalThis.fetch = async () => { throw new Error('invalid input must not query Supabase') }

  try {
    for (const body of invalid) {
      const response = await POST(request(body))
      assert.equal(response.status, 400, JSON.stringify(body))
      assert.deepEqual(await response.json(), { error: 'invalid_profile' })
    }
  } finally {
    globalThis.fetch = priorFetch
  }
})

test('returns catalog_unavailable when Supabase fails or no ready purchasable product exists', async () => {
  const priorFetch = globalThis.fetch
  const priorUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const priorAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://atelier.test.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-test-key'

  try {
    for (const body of [
      { message: 'database unavailable', code: 'PGRST500' },
      [row('unknown', 'unknown-category', {}, [offer('merchant', 10)])],
      [row('sold-out', 'micros-dynamiques', {
        subtype: 'dynamic', uses: ['podcast'], connections: ['USB'], roomFit: ['untreated'], qualities: ['reliable'],
      }, [offer('merchant', 10, false)])],
    ]) {
      globalThis.fetch = async () => Response.json(body, { status: Array.isArray(body) ? 200 : 503 })
      const response = await POST(request({ profile }))
      assert.equal(response.status, 503)
      assert.deepEqual(await response.json(), { error: 'catalog_unavailable' })
    }
  } finally {
    globalThis.fetch = priorFetch
    if (priorUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL
    else process.env.NEXT_PUBLIC_SUPABASE_URL = priorUrl
    if (priorAnon === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = priorAnon
  }
})
