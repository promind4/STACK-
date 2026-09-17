import { CATEGORY_DEFAULTS } from './categoryDefaults.ts'
import type { AtelierRole, RecommendationProfile } from './types.ts'

const roles: AtelierRole[] = ['microphone', 'interface', 'headphones', 'monitors', 'camera', 'lighting', 'treatment', 'cable', 'stand']
const roomFits = ['untreated', 'treated', 'travel'] as const
const mobilities = ['fixed', 'mobile'] as const
const complexities = ['simple', 'moderate', 'advanced'] as const
const requiredFields: Record<AtelierRole, Array<keyof RecommendationProfile>> = {
  microphone: ['connections'],
  interface: ['connections', 'sourceCapacity'],
  headphones: ['connections'],
  monitors: ['connections'],
  camera: ['connections'],
  lighting: [],
  treatment: ['subtype', 'roomFit'],
  cable: ['subtype', 'connections'],
  stand: ['subtype'],
}

function structuredEvidence(specs: Record<string, unknown>, role?: AtelierRole): Partial<RecommendationProfile> {
  const result: Partial<RecommendationProfile> = {}
  const connection = specs.connexion ?? specs.connector
  if (typeof connection === 'string' && /^(XLR|USB|USB-C|jack)$/i.test(connection.trim())) {
    result.connections = [connection.trim().toUpperCase() === 'JACK' ? 'jack' : connection.trim().toUpperCase()]
  }
  if (role === 'interface' && typeof specs.entrees === 'string') {
    const match = specs.entrees.trim().match(/^(\d+|une?|deux)\s+entrées?\s+combo\s+XLR$/i)
    if (match) {
      result.sourceCapacity = match[1].toLowerCase() === 'deux' ? 2 : /^une?$/.test(match[1].toLowerCase()) ? 1 : Number(match[1])
      result.connections = [...new Set([...(result.connections ?? []), 'XLR'])]
    }
  }
  return result
}

function editorialEvidence(role: AtelierRole | undefined, fragments: string[]): Partial<RecommendationProfile> {
  const result: Partial<RecommendationProfile> = {}
  if (!role) return result
  const connections = new Set<string>()
  for (const fragment of fragments) {
    for (const sentence of fragment.split(/[.!?;]/)) {
      if (role === 'microphone' && /\b(?:XLR\s*\/\s*USB|USB\s*\/\s*XLR|XLR\s+ou\s+USB|USB\s+ou\s+XLR|XLR\s+et\s+USB)\b/i.test(sentence)) continue
      if (role === 'interface') {
        const host = sentence.match(/\binterface(?:\s+audio)?\s+(USB(?:-C)?)\b/i)
        if (host && !/\b(?:USB\s*\/\s*XLR|XLR\s*\/\s*USB|sans\s+USB|pas\s+de\s+USB)\b/i.test(sentence)) {
          connections.add(host[1].toUpperCase())
        }
        const inputs = sentence.match(/\b(\d+|une?|deux)\s+entrées?\s+combo\s+XLR\b/i)
        if (inputs && !/\b(?:sans|aucune?|pas\s+de)\s+(?:\w+\s+){0,3}entrées?\b/i.test(sentence)) {
          result.sourceCapacity = inputs[1].toLowerCase() === 'deux' ? 2 : /^une?$/.test(inputs[1].toLowerCase()) ? 1 : Number(inputs[1])
          connections.add('XLR')
        }
      }
      if (role === 'headphones') {
        if (/\b(?:casque|monitoring)\s+ferm[ée]/i.test(sentence)) result.subtype = 'closed'
        if (/\bprise\s+jack\s+3[,.]5\s*mm\b/i.test(sentence) && !/\b(?:sans|pas\s+de)\s+prise\s+jack\b/i.test(sentence)) connections.add('jack')
      }
      if (role === 'monitors') {
        for (const match of sentence.matchAll(/\b(XLR|TRS|RCA|mini[- ]?jack|jack)\b/gi)) {
          const value = match[1].toUpperCase().replace(/MINI[- ]?JACK/, 'jack')
          connections.add(value === 'JACK' ? 'jack' : value)
        }
      }
      if (role === 'microphone' || role === 'interface') {
        const phrase = /\b(?:sortie|connexion|connecteur|prise)\s+(?:audio\s+)?(XLR|USB)\b/gi
        for (const match of sentence.matchAll(phrase)) {
          const before = sentence.slice(Math.max(0, match.index! - 25), match.index!)
          const after = sentence.slice(match.index! + match[0].length, match.index! + match[0].length + 25)
          if (/\b(?:sans|aucune?|pas\s+de)\s*$/i.test(before) || /\bnon\s+confirm[ée]/i.test(after)) continue
          connections.add(match[1].toUpperCase())
        }
      }
    }
  }
  if (connections.size) result.connections = [...connections]
  return result
}

function isOneOf<T extends string>(value: unknown, values: readonly T[]): value is T {
  return typeof value === 'string' && values.includes(value as T)
}

function strings(value: unknown): string[] | undefined {
  if (!Array.isArray(value) || !value.every(item => typeof item === 'string')) return undefined
  const cleaned = value.map(item => item.trim()).filter(Boolean)
  return cleaned.length ? cleaned : undefined
}

function profilePatch(value: unknown): Partial<RecommendationProfile> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}

  const source = value as Record<string, unknown>
  const patch: Partial<RecommendationProfile> = {}
  const add = <K extends keyof RecommendationProfile>(key: K, candidate: RecommendationProfile[K] | undefined) => {
    if (candidate !== undefined) patch[key] = candidate
  }

  add('role', isOneOf(source.role, roles) ? source.role : undefined)
  add('subtype', typeof source.subtype === 'string' && source.subtype.trim() ? source.subtype.trim() : undefined)
  add('uses', strings(source.uses))
  add('connections', strings(source.connections))

  const requires = strings(source.requires)
  add('requires', requires?.every(role => isOneOf(role, roles)) ? requires as AtelierRole[] : undefined)

  add('sourceCapacity', typeof source.sourceCapacity === 'number' && Number.isFinite(source.sourceCapacity) && source.sourceCapacity >= 0 ? source.sourceCapacity : undefined)

  const roomFit = strings(source.roomFit)
  add('roomFit', roomFit?.every(room => isOneOf(room, roomFits)) ? roomFit as RecommendationProfile['roomFit'] : undefined)
  add('mobility', isOneOf(source.mobility, mobilities) ? source.mobility : undefined)
  add('complexity', isOneOf(source.complexity, complexities) ? source.complexity : undefined)
  add('qualities', strings(source.qualities))
  add('uncertainty', strings(source.uncertainty))

  return patch
}

function hasFact(profile: RecommendationProfile, field: keyof RecommendationProfile): boolean {
  const value = profile[field]
  return Array.isArray(value) ? value.length > 0 : typeof value === 'number' ? value > 0 : Boolean(value)
}

export function deriveRecommendationProfile(input: {
  categorySlug: string | null
  specs: Record<string, unknown>
  description?: string | null
  pros?: unknown
  editorial?: Partial<RecommendationProfile>
  override?: Partial<RecommendationProfile>
}): RecommendationProfile {
  const category = profilePatch(input.categorySlug ? CATEGORY_DEFAULTS[input.categorySlug] : undefined)
  const evidence = editorialEvidence(category.role, [
    ...(typeof input.description === 'string' ? [input.description] : []),
    ...(Array.isArray(input.pros) ? input.pros.filter((item): item is string => typeof item === 'string') : []),
  ])
  const specs = { ...structuredEvidence(input.specs, category.role), ...profilePatch(input.specs) }
  const editorial = profilePatch(input.editorial)
  const override = profilePatch(input.override)
  const sources: NonNullable<RecommendationProfile['sources']> = {}
  for (const [name, layer] of [
    ['categoryDefaults', category], ['editorial', evidence], ['specs', specs], ['editorial', editorial], ['override', override],
  ] as const) {
    for (const field of ['subtype', 'connections', 'sourceCapacity'] as const) if (layer[field] !== undefined) sources[field] = name
  }
  const profile: RecommendationProfile = {
    uses: [],
    connections: [],
    requires: [],
    roomFit: [],
    qualities: [],
    status: 'to_enrich',
    uncertainty: [],
    ...category,
    ...evidence,
    ...specs,
    ...editorial,
    ...override,
    sources,
  }

  const completedProfile = profile.role === 'microphone'
    && profile.connections.some(connection => connection.toUpperCase() === 'XLR')
    && !profile.requires.includes('interface')
    ? { ...profile, requires: [...profile.requires, 'interface' as AtelierRole] }
    : profile

  if (!completedProfile.role) {
    return { ...completedProfile, status: 'to_enrich', uncertainty: [...new Set([...completedProfile.uncertainty, 'role'])] }
  }

  const missing = requiredFields[completedProfile.role].filter(field => !hasFact(completedProfile, field)).map(String)
  if (completedProfile.role === 'interface'
    && !completedProfile.connections.some(connection => ['USB', 'USB-C', 'THUNDERBOLT'].includes(connection.toUpperCase()))) {
    missing.push('computerConnection')
  }
  return {
    ...completedProfile,
    status: missing.length ? 'partial' : 'ready',
    uncertainty: [...new Set([...completedProfile.uncertainty, ...missing])],
  }
}
