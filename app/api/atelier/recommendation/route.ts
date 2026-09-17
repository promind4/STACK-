import { recommendAtelierPacks } from '../../../../lib/atelier/engine.ts'
import { loadAtelierCatalog } from '../../../../lib/atelier/repository.ts'
import type { AtelierRecommendationRequest, AtelierRole } from '../../../../lib/atelier/types.ts'

export const runtime = 'nodejs'

const roles: AtelierRole[] = ['microphone', 'interface', 'headphones', 'monitors', 'camera', 'lighting', 'treatment', 'cable', 'stand']
const oneOf = <T>(value: unknown, choices: readonly T[]): value is T => choices.includes(value as T)
const object = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value)
const nonempty = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0

function validRequest(value: unknown): value is AtelierRecommendationRequest {
  if (!object(value) || !object(value.profile)) return false
  const profile = value.profile
  if (!oneOf(profile.project, ['podcast', 'streaming', 'music_vocals', 'video'])
    || (profile.sourceCount !== undefined && !oneOf(profile.sourceCount, [1, 2, 'many']))
    || !oneOf(profile.room, ['untreated', 'treated', 'travel'])
    || !oneOf(profile.mobility, ['fixed', 'mobile'])
    || !oneOf(profile.priority, ['simplicity', 'value', 'upgradeability'])
    || typeof profile.budget !== 'number' || !Number.isFinite(profile.budget) || profile.budget <= 0
    || !Array.isArray(profile.ownedEquipment)
    || !profile.ownedEquipment.every(item => object(item)
      && oneOf(item.role, roles)
      && (item.productId === undefined || nonempty(item.productId))
      && (item.connection === undefined || oneOf(item.connection, ['usb', 'xlr', 'other'])))
    || (value.lockedProductIds !== undefined
      && (!Array.isArray(value.lockedProductIds) || !value.lockedProductIds.every(nonempty)))) return false
  return true
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'invalid_profile' }, { status: 400 })
  }
  if (!validRequest(body)) return Response.json({ error: 'invalid_profile' }, { status: 400 })

  try {
    const catalog = await loadAtelierCatalog()
    if (!catalog.some(product => product.profile.status === 'ready')) {
      return Response.json({ error: 'catalog_unavailable' }, { status: 503 })
    }
    const normalizedRequest: AtelierRecommendationRequest = {
      ...body,
      profile: {
        ...body.profile,
        sourceCount: body.profile.sourceCount ?? 1,
      },
    }
    return Response.json(recommendAtelierPacks(catalog, normalizedRequest))
  } catch {
    return Response.json({ error: 'catalog_unavailable' }, { status: 503 })
  }
}
