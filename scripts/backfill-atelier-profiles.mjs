import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

import { deriveRecommendationProfile } from '../lib/atelier/profile.ts'

export async function runBackfill({ url, key, fetchImpl = globalThis.fetch, pageSize = 100, write = false }) {
  if (!url || !key) throw new Error('Supabase URL and key are required')
  const counts = { active: 0, ready: 0, partial: 0, to_enrich: 0 }
  const byRole = {}
  let written = 0
  for (let offset = 0; ; offset += pageSize) {
    const endpoint = new URL('/rest/v1/products', url)
    endpoint.searchParams.set('select', 'id,specs,description,pros,cons,categories(slug)' + (write ? ',recommendation_profile' : ''))
    endpoint.searchParams.set('is_active', 'eq.true')
    endpoint.searchParams.set('limit', String(pageSize))
    endpoint.searchParams.set('offset', String(offset))
    const headers = { apikey: key, Authorization: `Bearer ${key}` }
    const response = await fetchImpl(endpoint, { headers })
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}))
      if (write && response.status === 400
        && (detail.code === '42703' || String(detail.message ?? '').includes('recommendation_profile'))) {
        throw new Error('Apply migration 20260914_atelier_profiles.sql (recommendation_profile) before --write')
      }
      throw new Error(`Catalog read failed: HTTP ${response.status}`)
    }
    const rows = await response.json()
    if (!Array.isArray(rows)) throw new Error('Catalog response must be an array')
    for (const row of rows) {
      const category = Array.isArray(row.categories) ? row.categories[0] : row.categories
      const profile = deriveRecommendationProfile({
        categorySlug: category?.slug ?? null,
        specs: row.specs && typeof row.specs === 'object' && !Array.isArray(row.specs) ? row.specs : {},
        description: row.description,
        pros: row.pros,
      })
      counts.active++
      counts[profile.status]++
      if (profile.role) {
        byRole[profile.role] ??= { ready: 0, partial: 0, to_enrich: 0 }
        byRole[profile.role][profile.status]++
      }
      if (write && row.recommendation_profile && typeof row.recommendation_profile === 'object'
        && !Array.isArray(row.recommendation_profile) && Object.keys(row.recommendation_profile).length === 0) {
        const patchUrl = new URL('/rest/v1/products', url)
        patchUrl.searchParams.set('id', `eq.${row.id}`)
        patchUrl.searchParams.set('recommendation_profile', 'eq.{}')
        const patchResponse = await fetchImpl(patchUrl, {
          method: 'PATCH',
          headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=representation' },
          body: JSON.stringify({ recommendation_profile: profile }),
        })
        if (!patchResponse.ok) throw new Error(`Backfill update failed: HTTP ${patchResponse.status}`)
        const patched = await patchResponse.json()
        if (!Array.isArray(patched)) throw new Error('Backfill update response must be an array')
        written += patched.length
      }
    }
    if (rows.length < pageSize) break
  }
  return { counts, byRole, written }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    if (process.argv.slice(2).some(arg => arg !== '--write')) throw new Error('Only --write is supported')
    process.loadEnvFile('.env.local')
    const write = process.argv.includes('--write')
    const key = write ? process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (write && !key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for --write after migration')
    const result = await runBackfill({ url: process.env.NEXT_PUBLIC_SUPABASE_URL, key, write })
    console.log(JSON.stringify({ mode: write ? 'write' : 'read-only', ...result }))
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
