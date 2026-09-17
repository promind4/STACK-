import assert from 'node:assert/strict'
import test from 'node:test'

import { runBackfill } from '../../scripts/backfill-atelier-profiles.mjs'

const row = (id: string, recommendation_profile?: unknown) => ({
  id, specs: {}, description: 'Microphone avec sortie XLR.', pros: [], cons: [],
  categories: { slug: 'micros-dynamiques' }, recommendation_profile,
})

test('default backfill paginates active rows and sends no PATCH', async () => {
  const requests: Request[] = []
  const pages = [[row('a'), row('b')], [row('c')], []]
  const fetchImpl = async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = new Request(input, init)
    requests.push(request)
    const offset = Number(new URL(request.url).searchParams.get('offset'))
    return Response.json(pages[offset === 0 ? 0 : offset === 2 ? 1 : 2])
  }
  const result = await runBackfill({ url: 'https://fixture.test', key: 'anon', fetchImpl, pageSize: 2 })
  assert.equal(result.counts.ready, 3)
  assert.equal(result.counts.active, 3)
  assert.deepEqual(requests.map(request => [request.method, new URL(request.url).searchParams.get('offset')]), [['GET', '0'], ['GET', '2']])
  for (const request of requests) {
    const url = new URL(request.url)
    assert.equal(url.searchParams.get('is_active'), 'eq.true')
    assert.equal((url.searchParams.get('select') ?? '').includes('recommendation_profile'), false)
  }
})

test('write mode fails before mutation when the migration column is absent', async () => {
  const requests: Request[] = []
  const fetchImpl = async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = new Request(input, init)
    requests.push(request)
    return Response.json({ code: '42703', message: 'column products.recommendation_profile does not exist' }, { status: 400 })
  }
  await assert.rejects(
    runBackfill({ url: 'https://fixture.test', key: 'service-fixture', fetchImpl, write: true }),
    /migration.*recommendation_profile/i,
  )
  assert.deepEqual(requests.map(request => request.method), ['GET'])
})

test('write mode preserves an explicit profile and conditionally patches only empty profiles', async () => {
  const requests: Request[] = []
  const fetchImpl = async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = new Request(input, init)
    requests.push(request)
    if (request.method === 'PATCH') return Response.json([{ id: 'empty' }])
    return Response.json([row('protected', { role: 'headphones' }), row('empty', {})])
  }
  const result = await runBackfill({ url: 'https://fixture.test', key: 'service-fixture', fetchImpl, pageSize: 10, write: true })
  assert.equal(result.counts.active, 2)
  assert.equal(result.written, 1)
  const patches = requests.filter(request => request.method === 'PATCH')
  assert.equal(patches.length, 1)
  assert.equal(new URL(patches[0].url).searchParams.get('id'), 'eq.empty')
  assert.equal(new URL(patches[0].url).searchParams.get('recommendation_profile'), 'eq.{}')
  const body = await patches[0].json()
  assert.equal(body.recommendation_profile.status, 'ready')
  assert.deepEqual(body.recommendation_profile.connections, ['XLR'])
})

test('a concurrent profile change yields zero reported writes', async () => {
  const fetchImpl = async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = new Request(input, init)
    return request.method === 'PATCH' ? Response.json([]) : Response.json([row('empty', {})])
  }
  const result = await runBackfill({ url: 'https://fixture.test', key: 'service-fixture', fetchImpl, write: true })
  assert.equal(result.written, 0)
})

test('an authorization error is reported as a read failure, not a missing migration', async () => {
  const fetchImpl = async () => Response.json({ message: 'unauthorized' }, { status: 401 })
  await assert.rejects(
    runBackfill({ url: 'https://fixture.test', key: 'service-fixture', fetchImpl, write: true }),
    /Catalog read failed: HTTP 401/,
  )
})
