import { selectBestAvailableOffer } from './offers.ts'
import { buildRequirements } from './requirements.ts'
import type {
  AtelierAlternative,
  AtelierCandidate,
  AtelierCatalogProduct,
  AtelierConflict,
  AtelierGuide,
  AtelierProfile,
  AtelierPackRecommendation,
  AtelierRecommendation,
  AtelierRecommendationPack,
  AtelierRecommendationRequest,
  AtelierRequirement,
  AtelierRole,
  AtelierSetupLine,
} from './types.ts'

interface Candidate extends AtelierCandidate {
  source: AtelierCatalogProduct
}

interface Selection {
  candidate: Candidate
  quantity: number
  locked?: true
}

interface LockedProducts {
  selections: Map<AtelierRole, Selection>
  extras: Selection[]
  ids: Set<string>
  conflicts: AtelierConflict[]
}

const normalized = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '')
const contains = (values: readonly string[], value: string) => values.some(item => normalized(item) === normalized(value))
const owns = (profile: AtelierProfile, role: AtelierRole) => profile.ownedEquipment.some(item => item.role === role)
const ownedCount = (profile: AtelierProfile, role: AtelierRole) => profile.ownedEquipment.filter(item => item.role === role).length

function publicProduct(product: AtelierCatalogProduct): AtelierCandidate['product'] | null {
  const role = product.profile.role
  const bestOffer = selectBestAvailableOffer(product.offers)
  if (!role || !bestOffer) return null

  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    imageUrl: product.imageUrl,
    role,
    price: bestOffer.price,
    bestOffer,
    reason: `Adapté au rôle ${role}.`,
    requires: product.profile.requires,
    status: product.profile.status,
  }
}

function compatible(product: AtelierCatalogProduct, profile: AtelierProfile, role: AtelierRole, allowUnknown = false): boolean {
  const facts = product.profile
  if (facts.role !== role) return false
  if (facts.uses.length && !contains(facts.uses, profile.project)) return false
  if (facts.roomFit.length && !facts.roomFit.includes(profile.room)) return false
  if (profile.mobility === 'mobile' && facts.mobility === 'fixed') return false
  if (profile.mobility === 'mobile' && role === 'camera' && facts.mobility !== 'mobile' && !allowUnknown) return false
  if (role === 'interface') {
    const sources = profile.sourceCount === 2 ? 2 : 1
    if (facts.sourceCapacity === undefined ? !allowUnknown : facts.sourceCapacity < sources) return false
    if (profile.ownedEquipment.some(item => item.role === 'microphone' && item.connection === 'xlr')
      && !contains(facts.connections, 'XLR')) return false
  }
  if (role === 'microphone' && profile.project === 'streaming' && profile.room === 'untreated') {
    const rejectsNoise = normalized(facts.subtype ?? '') === 'dynamic'
      || facts.qualities.some(quality => ['noiserejection', 'broadcast'].includes(normalized(quality)))
    if (!rejectsNoise && (!allowUnknown || Boolean(facts.subtype) || facts.qualities.length > 0)) return false
  }
  return true
}

function candidate(product: AtelierCatalogProduct, profile: AtelierProfile): Candidate | null {
  const role = product.profile.role
  const visible = publicProduct(product)
  if (!role || !visible || product.profile.status !== 'ready' || !compatible(product, profile, role)) return null
  return { role, product: visible, reason: visible.reason, source: product }
}

function suitability(item: Candidate, profile: AtelierProfile): number {
  const facts = item.source.profile
  const subtype = normalized(facts.subtype ?? '')
  const qualities = facts.qualities.map(normalized)
  let score = 0

  if (profile.project === 'music_vocals' && profile.room === 'treated' && item.role === 'microphone') {
    if (subtype === 'condenser') score += 3
    if (contains(facts.connections, 'XLR')) score += 2
    if (qualities.some(quality => quality.includes('studio'))) score += 1
  }
  if (profile.room === 'untreated' && item.role === 'microphone') {
    if (subtype === 'dynamic') score += 2
    if (qualities.some(quality => ['noiserejection', 'broadcast'].includes(quality))) score += 2
  }
  if (profile.mobility === 'mobile' && facts.mobility === 'mobile') score += 2
  if (profile.priority === 'simplicity') score += facts.complexity === 'simple' ? 2 : facts.complexity === 'moderate' ? 1 : 0
  if (profile.priority === 'upgradeability') {
    if (profile.project === 'music_vocals' && profile.room === 'untreated' && item.role === 'microphone' && subtype === 'condenser') score += 5
    if (item.role === 'treatment' && qualities.some(quality => quality.includes('broadband'))) score += 2
    if (item.role === 'microphone' && contains(facts.connections, 'XLR')) score += 2
    if (qualities.some(quality => quality.includes('upgrade') || quality.includes('scalable'))) score += 3
    if (item.role === 'interface') score += Math.max(0, (facts.sourceCapacity ?? 0) - 1)
  }

  // Quality progression for creator essentials
  if (item.role === 'headphones') {
    if (subtype === 'closed') score += 1
    if (item.product.price >= 95) score += 2
    if (item.product.price >= 180) score += 1
  }
  if (item.role === 'camera') {
    if (subtype === 'mirrorless') score += 5
    else if (subtype === 'webcam' && item.product.price >= 65) score += 2
  }
  if (item.role === 'lighting') {
    if (subtype === 'keylight' || subtype === 'softbox') score += 3
  }
  if (item.role === 'monitors' && item.product.price >= 180) {
    score += 2
  }
  if (item.role === 'microphone' && item.product.price >= 150 && contains(facts.connections, 'XLR')) {
    score += 1
  }

  return score
}

function dependencies(item: Candidate): AtelierRole[] {
  const roles = new Set(item.product.requires)
  if (item.role === 'microphone' && contains(item.source.profile.connections, 'XLR')) roles.add('interface')
  return [...roles]
}

function choicesForRole(pool: readonly Candidate[], role: AtelierRole): Candidate[] {
  const choices = new Map<string, Candidate>()
  for (const item of pool) {
    if (item.role !== role) continue
    const key = JSON.stringify([
      dependencies(item).sort(),
      (item.role === 'microphone' || item.role === 'interface') && contains(item.source.profile.connections, 'XLR'),
    ])
    const current = choices.get(key)
    if (!current || item.product.price < current.product.price) choices.set(key, item)
  }
  return [...choices.values()].sort((left, right) => left.product.price - right.product.price)
}

function expand(
  primary: ReadonlyMap<AtelierRole, Selection>,
  pool: readonly Candidate[],
  profile: AtelierProfile,
  extras: readonly Selection[] = [],
): { selections: Map<AtelierRole, Selection>; missing: Array<{ role: AtelierRole; productId: string }> } {
  let best: Map<AtelierRole, Selection> | null = null
  let bestTotal = Number.POSITIVE_INFINITY
  let failed = { selections: new Map(primary), missing: [] as Array<{ role: AtelierRole; productId: string }> }

  const close = (selections: Map<AtelierRole, Selection>) => {
    if (total(selections, extras) > bestTotal) return
    for (const selection of [...selections.values(), ...extras]) {
      for (const role of dependencies(selection.candidate)) {
        const quantity = role === 'interface' ? 1 : selection.quantity
        const remaining = Math.max(0, quantity - ownedCount(profile, role))
        if (remaining === 0) continue
        const needsXlr = role === 'interface'
          && selection.candidate.role === 'microphone'
          && contains(selection.candidate.source.profile.connections, 'XLR')
        const existing = selections.get(role)
        if (existing) {
          if (needsXlr && !contains(existing.candidate.source.profile.connections, 'XLR')) {
            if (!failed.missing.length) failed = {
              selections,
              missing: [{ role, productId: selection.candidate.product.productId }],
            }
            return
          }
          if (role !== 'interface' && existing.quantity < remaining) {
            close(new Map(selections).set(role, { ...existing, quantity: remaining }))
            return
          }
          continue
        }

        const options = choicesForRole(pool, role)
          .filter(item => !needsXlr || contains(item.source.profile.connections, 'XLR'))
        if (!options.length) {
          if (!failed.missing.length) failed = {
            selections,
            missing: [{ role, productId: selection.candidate.product.productId }],
          }
          return
        }
        for (const option of options) close(new Map(selections).set(role, { candidate: option, quantity: remaining }))
        return
      }
    }

    const candidateTotal = total(selections, extras)
    if (candidateTotal < bestTotal) {
      best = selections
      bestTotal = candidateTotal
    }
  }

  close(new Map(primary))
  return best ? { selections: best, missing: [] } : failed
}

function total(selections: ReadonlyMap<AtelierRole, Selection>, extras: readonly Selection[] = []): number {
  return [...selections.values(), ...extras].reduce((sum, selection) => sum + selection.quantity * selection.candidate.product.price, 0)
}

function lines(selections: ReadonlyMap<AtelierRole, Selection>, extras: readonly Selection[] = []): AtelierSetupLine[] {
  return [...selections.values(), ...extras].map(({ candidate: item, quantity, locked }) => ({
    ...item.product,
    state: locked ? 'locked' : 'selected',
    quantity,
    subtotal: quantity * item.product.bestOffer.price,
  }))
}

function resolveLockedProducts(
  catalog: readonly AtelierCatalogProduct[],
  lockedProductIds: readonly string[],
  profile: AtelierProfile,
  requirements: readonly AtelierRequirement[],
): LockedProducts {
  const selections = new Map<AtelierRole, Selection>()
  const extras: Selection[] = []
  const ids = new Set(lockedProductIds)
  const conflicts: AtelierConflict[] = []

  for (const productId of ids) {
    const source = catalog.find(product => product.id === productId)
    if (!source) {
      conflicts.push({
        code: 'data_unknown',
        message: `Le produit verrouillé ${productId} est absent du catalogue.`,
        productId,
        resolutions: ['verify_data', 'unlock_product'],
      })
      continue
    }

    const visible = publicProduct(source)
    if (!visible) {
      conflicts.push({
        code: 'data_unknown',
        message: `Le produit verrouillé ${productId} n'a pas d'offre achetable ou de rôle vérifié.`,
        productId,
        resolutions: ['verify_data', 'unlock_product'],
      })
      continue
    }

    const item: Candidate = { role: visible.role, product: visible, reason: visible.reason, source }
    const selection: Selection = {
      candidate: item,
      quantity: requirements.find(requirement => requirement.role === visible.role)?.quantity ?? 1,
      locked: true,
    }
    if (selections.has(visible.role)) {
      extras.push(selection)
      conflicts.push({
        code: 'locked_product_incompatible',
        message: `Plusieurs produits verrouillés couvrent le rôle ${visible.role}.`,
        productId,
        resolutions: ['unlock_product', 'reduce_scope'],
      })
    } else {
      selections.set(visible.role, selection)
    }

    if (source.profile.status !== 'ready') {
      conflicts.push({
        code: 'locked_product_incompatible',
        message: `Le produit verrouillé ${productId} a le statut ${source.profile.status} et ne peut pas être une recommandation principale fiable.`,
        productId,
        resolutions: ['unlock_product', 'reduce_scope', 'verify_data'],
      })
    } else if (!compatible(source, profile, visible.role)) {
      conflicts.push({
        code: 'locked_product_incompatible',
        message: `Le produit verrouillé ${productId} n'est pas compatible avec le profil.`,
        productId,
        resolutions: ['unlock_product', 'reduce_scope'],
      })
    }
  }

  return { selections, extras, ids, conflicts }
}

function complete(
  requirements: readonly AtelierRequirement[],
  selections: ReadonlyMap<AtelierRole, Selection>,
  missing: readonly unknown[],
): boolean {
  return missing.length === 0 && requirements.every(requirement => (selections.get(requirement.role)?.quantity ?? 0) >= requirement.quantity)
}

function connectionsVerified(
  selections: ReadonlyMap<AtelierRole, Selection>,
  profile: AtelierProfile,
  includeOwned = true,
  extras: readonly Selection[] = [],
): boolean {
  for (const selection of [...selections.values(), ...extras]) {
    if (dependencies(selection.candidate).some(role => !owns(profile, role) && !selections.has(role))) return false
    if (selection.candidate.role === 'microphone' && contains(selection.candidate.source.profile.connections, 'XLR')) {
      const audioInterface = selections.get('interface')
      if (!audioInterface && !owns(profile, 'interface')) return false
      if (audioInterface && !contains(audioInterface.candidate.source.profile.connections, 'XLR')) return false
    }
  }

  if (includeOwned && profile.ownedEquipment.some(item => item.role === 'microphone' && item.connection === 'xlr')) {
    const audioInterface = selections.get('interface')
    if (!audioInterface && !owns(profile, 'interface')) return false
    if (audioInterface && !contains(audioInterface.candidate.source.profile.connections, 'XLR')) return false
  }
  return selections.size > 0 || extras.length > 0 || (includeOwned && profile.ownedEquipment.length > 0)
}

function lockBlockers(
  missing: readonly { role: AtelierRole; productId: string }[],
  selections: ReadonlyMap<AtelierRole, Selection>,
  extras: readonly Selection[],
): Set<string> {
  const blockers = new Set<string>()
  const locked = [...selections.values(), ...extras].filter(selection => selection.locked)

  const reaches = (
    selection: Selection,
    target: { role: AtelierRole; productId: string },
    visited: Set<string>,
  ): boolean => {
    const productId = selection.candidate.product.productId
    if (productId === target.productId) return true
    if (visited.has(productId)) return false
    visited.add(productId)
    return dependencies(selection.candidate).some(role => {
      const dependency = selections.get(role)
      return (!dependency && role === target.role)
        || Boolean(dependency && reaches(dependency, target, visited))
    })
  }

  for (const target of missing) {
    const occupied = selections.get(target.role)
    if (occupied?.locked) blockers.add(occupied.candidate.product.productId)
    for (const selection of locked) {
      if (reaches(selection, target, new Set())) blockers.add(selection.candidate.product.productId)
    }
  }
  return blockers
}

function safePartial(
  primary: ReadonlyMap<AtelierRole, Selection>,
  requirements: readonly AtelierRequirement[],
  pool: readonly Candidate[],
  profile: AtelierProfile,
): Map<AtelierRole, Selection> {
  let accepted = new Map<AtelierRole, Selection>()
  for (const requirement of requirements) {
    const selection = primary.get(requirement.role)
    if (!selection) continue
    const trialPrimary = new Map(accepted).set(requirement.role, selection)
    const trial = expand(trialPrimary, pool, profile)
    if (trial.missing.length === 0
      && connectionsVerified(trial.selections, profile, false)
      && total(trial.selections) <= profile.budget) accepted = trialPrimary
  }
  return expand(accepted, pool, profile).selections
}

function guide(profile: AtelierProfile): AtelierGuide | null {
  if (profile.mobility === 'mobile') {
    return { slug: 'creation-mobile', title: 'Créer en mobilité', reason: 'La portabilité est la contrainte principale.' }
  }
  if (profile.room === 'untreated') {
    return { slug: 'piece-non-traitee', title: 'Maîtriser une pièce non traitée', reason: 'La pièce influence directement la captation.' }
  }
  return null
}

function buildAlternatives(
  catalog: readonly AtelierCatalogProduct[],
  primary: ReadonlyMap<AtelierRole, Selection>,
  selected: ReadonlyMap<AtelierRole, Selection>,
  pool: readonly Candidate[],
  profile: AtelierProfile,
  relevantRoles: ReadonlySet<AtelierRole>,
  requirements: readonly AtelierRequirement[],
  lockedIds: ReadonlySet<string>,
  extras: readonly Selection[],
): AtelierAlternative[] {
  const alternatives: AtelierAlternative[] = []
  const selectedTotal = total(selected, extras)

  for (const option of pool) {
    const current = primary.get(option.role)
    if (!current || current.candidate.product.productId === option.product.productId) continue
    const trial = expand(new Map(primary).set(option.role, { candidate: option, quantity: current.quantity }), pool, profile, extras)
    if (trial.missing.length || total(trial.selections, extras) > profile.budget) continue
    const delta = total(trial.selections, extras) - selectedTotal
    const kind = delta < 0 ? 'save' : suitability(option, profile) > suitability(current.candidate, profile) ? 'upgrade' : null
    if (!kind) continue
    alternatives.push({
      kind,
      replacesProductId: current.candidate.product.productId,
      product: option.product,
      priceDelta: delta,
      reason: kind === 'save' ? 'Économie compatible avec la chaîne.' : 'Gain pertinent pour ce profil.',
    })
  }

  for (const product of catalog) {
    const role = product.profile.role
    if (!role || lockedIds.has(product.id) || product.profile.status !== 'partial' || !relevantRoles.has(role) || !compatible(product, profile, role, true)) continue
    const visible = publicProduct(product)
    if (!visible) continue
    const current = primary.get(role)
    if (current?.locked) continue
    const quantity = current?.quantity ?? requirements.find(requirement => requirement.role === role)?.quantity
    if (!quantity) continue
    const option: Candidate = { role, product: visible, reason: visible.reason, source: product }
    const trial = expand(new Map(primary).set(role, { candidate: option, quantity }), pool, profile, extras)
    if (trial.missing.length
      || !connectionsVerified(trial.selections, profile, true, extras)
      || total(trial.selections, extras) > profile.budget) continue
    alternatives.push({
      kind: 'upgrade',
      replacesProductId: current?.candidate.product.productId ?? '',
      product: visible,
      priceDelta: total(trial.selections, extras) - selectedTotal,
      reason: `Réserve : données incomplètes (${product.profile.uncertainty.join(', ') || 'à vérifier'}).`,
    })
  }
  return alternatives
}

function cheapestPrimary(
  requirements: readonly AtelierRequirement[],
  pool: readonly Candidate[],
  profile: AtelierProfile,
  locked: ReadonlyMap<AtelierRole, Selection>,
  extras: readonly Selection[],
): Map<AtelierRole, Selection> {
  const fallback = new Map(locked)
  const choices = new Map(requirements.map(requirement => [requirement.role, choicesForRole(pool, requirement.role)]))
  for (const requirement of requirements) {
    if (fallback.has(requirement.role)) continue
    const option = choices.get(requirement.role)?.[0]
    if (option) fallback.set(requirement.role, { candidate: option, quantity: requirement.quantity })
  }

  let best: Map<AtelierRole, Selection> | null = null
  let bestTotal = Number.POSITIVE_INFINITY
  const search = (index: number, selections: Map<AtelierRole, Selection>) => {
    const subtotal = total(selections, extras)
    if (subtotal > profile.budget || subtotal > bestTotal) return
    if (index === requirements.length) {
      const expanded = expand(selections, pool, profile, extras)
      const candidateTotal = total(expanded.selections, extras)
      if (!expanded.missing.length
        && connectionsVerified(expanded.selections, profile, false, extras)
        && candidateTotal <= profile.budget
        && candidateTotal < bestTotal) {
        best = new Map(selections)
        bestTotal = candidateTotal
      }
      return
    }

    const requirement = requirements[index]
    if (selections.has(requirement.role)) {
      search(index + 1, selections)
      return
    }
    for (const option of choices.get(requirement.role) ?? []) {
      search(index + 1, new Map(selections).set(requirement.role, { candidate: option, quantity: requirement.quantity }))
    }
  }

  search(0, new Map(locked))
  return best ?? fallback
}

export function recommendAtelier(
  catalog: readonly AtelierCatalogProduct[],
  request: AtelierRecommendationRequest,
): AtelierRecommendation {
  const { profile } = request
  const requirements = buildRequirements(profile)
  const pool = catalog.map(product => candidate(product, profile)).filter((item): item is Candidate => item !== null)
  const locked = resolveLockedProducts(catalog, request.lockedProductIds ?? [], profile, requirements)
  let primary = cheapestPrimary(requirements, pool, profile, locked.selections, locked.extras)

  let expanded = expand(primary, pool, profile, locked.extras)
  if (total(expanded.selections, locked.extras) <= profile.budget) {
    const upgradeRoles = new Set<AtelierRole>([
      ...requirements.map(requirement => requirement.role),
      ...expanded.selections.keys(),
    ])

    // Repeatedly sweep every role for a strictly better or strictly pricier (never worse)
    // fit until nothing changes, instead of stopping at the first improvement per role.
    const sweep = (pickCandidates: (role: AtelierRole, current: Selection) => Candidate[]) => {
      let changed = true
      while (changed) {
        changed = false
        for (const role of upgradeRoles) {
          const current = primary.get(role) ?? expanded.selections.get(role)
          if (!current || current.locked) continue
          for (const candidate of pickCandidates(role, current)) {
            const trialPrimary = new Map(primary).set(role, { candidate, quantity: current.quantity })
            const trial = expand(trialPrimary, pool, profile, locked.extras)
            if (connectionsVerified(trial.selections, profile, false, locked.extras)
              && total(trial.selections, locked.extras) <= profile.budget) {
              primary = trialPrimary
              expanded = trial
              for (const dependencyRole of expanded.selections.keys()) upgradeRoles.add(dependencyRole)
              changed = true
              break
            }
          }
        }
      }
    }

    // Pass 1: apply every quality upgrade available (strictly better suitability), not just one.
    sweep((role, current) => pool
      .filter(item => item.role === role && suitability(item, profile) > suitability(current.candidate, profile))
      .sort((a, b) => suitability(b, profile) - suitability(a, profile) || a.product.price - b.product.price))

    // Pass 2: once quality is maxed out, spend remaining budget on pricier options of at
    // least equal suitability (never a downgrade), closing the gap to the budget ceiling.
    sweep((role, current) => pool
      .filter(item => item.role === role
        && item.product.price > current.candidate.product.price
        && suitability(item, profile) >= suitability(current.candidate, profile))
      .sort((a, b) => b.product.price - a.product.price))
  }

  const connectionFailure = !connectionsVerified(expanded.selections, profile, true, locked.extras)
  const blockingLocks = lockBlockers(expanded.missing, expanded.selections, locked.extras)
  const lockDependencyFailure = blockingLocks.size > 0
  const locksTrusted = locked.conflicts.length === 0 && !lockDependencyFailure
  const fullChain = complete(requirements, expanded.selections, expanded.missing) && !connectionFailure && locksTrusted
  const overBudget = total(expanded.selections, locked.extras) > profile.budget
  const conflicts: AtelierConflict[] = [...locked.conflicts]
  const missingRoles = requirements.filter(requirement => !primary.has(requirement.role)).map(requirement => requirement.role)
  const unresolved = [...missingRoles.map(role => ({ role, productId: '' })), ...expanded.missing]

  for (const productId of blockingLocks) {
    if (conflicts.some(conflict => conflict.productId === productId)) continue
    conflicts.push({
      code: 'locked_product_incompatible',
      message: `Le produit verrouillé ${productId} ne peut pas fermer sa chaîne de dépendances.`,
      productId,
      resolutions: ['unlock_product', 'reduce_scope', 'verify_data'],
    })
  }
  for (const item of unresolved) {
    if (conflicts.some(conflict => conflict.productId === item.productId && conflict.code !== 'budget_insufficient')) continue
    const uncertain = catalog.find(product => product.profile.role === item.role && product.profile.status === 'partial')
    const documentedWithoutOffer = catalog.find(product => product.profile.role === item.role && product.profile.status === 'ready')
    conflicts.push(uncertain || documentedWithoutOffer ? {
      code: 'data_unknown',
      message: `Les données achetables pour le rôle ${item.role} sont insuffisantes.`,
      productId: uncertain?.id ?? documentedWithoutOffer?.id,
      resolutions: ['verify_data', 'reduce_scope'],
    } : {
      code: 'missing_dependency',
      message: `Aucun produit compatible ne couvre le rôle ${item.role}.`,
      productId: item.productId || undefined,
      resolutions: ['reduce_scope', 'verify_data'],
    })
  }
  if (connectionFailure && complete(requirements, expanded.selections, expanded.missing)) {
    conflicts.push({
      code: 'missing_dependency',
      message: 'Les connexions de la chaîne sélectionnée ne sont pas compatibles.',
      resolutions: ['reduce_scope', 'verify_data'],
    })
  }
  if (overBudget) {
    for (const selection of [...locked.selections.values(), ...locked.extras]) {
      const productId = selection.candidate.product.productId
      if (conflicts.some(conflict => conflict.code === 'locked_product_incompatible' && conflict.productId === productId)) continue
      conflicts.push({
        code: 'locked_product_incompatible',
        message: `Le produit verrouillé ${productId} rend la configuration incompatible avec le budget.`,
        productId,
        resolutions: ['unlock_product', 'increase_budget', 'reduce_scope'],
      })
    }
    const budgetConflict: AtelierConflict = {
      code: 'budget_insufficient',
      message: 'Le budget ne permet pas une chaîne complète avec les offres disponibles.',
      resolutions: ['increase_budget', 'reduce_scope'],
    }
    if (locked.selections.size || locked.extras.length) conflicts.push(budgetConflict)
    else conflicts.unshift(budgetConflict)
  }

  const hasVisibleLock = locked.selections.size > 0 || locked.extras.length > 0
  const outputSelections = hasVisibleLock || (fullChain && !overBudget)
    ? expanded.selections
    : safePartial(primary, requirements, pool, profile)
  const outputMissing = hasVisibleLock ? expanded.missing : []
  const relevantRoles = new Set(requirements.map(requirement => requirement.role))
  for (const selection of primary.values()) dependencies(selection.candidate).forEach(role => relevantRoles.add(role))
  for (const selection of locked.extras) dependencies(selection.candidate).forEach(role => relevantRoles.add(role))
  const setup = lines(outputSelections, locked.extras)
  const selectedIds = new Set(setup.map(line => line.productId))
  const alternatives = buildAlternatives(
    catalog,
    primary,
    outputSelections,
    pool,
    profile,
    relevantRoles,
    requirements,
    locked.ids,
    locked.extras,
  )
  const availableForRequirements = requirements.every(requirement => pool.some(item => item.role === requirement.role))
  const setupTotal = setup.reduce((sum, line) => sum + line.subtotal, 0)

  return {
    setup,
    candidates: pool.filter(item => relevantRoles.has(item.role) && !selectedIds.has(item.product.productId)).map(({ source: _source, ...item }) => item),
    alternatives,
    proof: {
      budgetRespected: setupTotal <= profile.budget,
      chainComplete: complete(requirements, outputSelections, outputMissing) && locksTrusted,
      connectionsVerified: connectionsVerified(outputSelections, profile, true, locked.extras),
      offersAvailable: availableForRequirements
        && expanded.missing.length === 0
        && !locked.conflicts.some(conflict => conflict.code === 'data_unknown'),
    },
    contextualGuide: guide(profile),
    conflicts,
    ...(conflicts[0] ? { unavailableReason: conflicts[0].message } : {}),
  }
}

export function recommendAtelierPacks(
  catalog: readonly AtelierCatalogProduct[],
  request: AtelierRecommendationRequest,
): AtelierPackRecommendation {
  const recommendation = recommendAtelier(catalog, request)
  const packs: AtelierRecommendationPack[] = [
    {
      id: 'balance',
      title: 'Votre setup recommandé',
      detail: 'Le meilleur compromis entre qualité, confort et budget.',
      recommendation,
    },
  ]
  return { ...recommendation, packs }
}
