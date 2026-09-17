export type RecommendationStatus = 'ready' | 'partial' | 'to_enrich'
export type AtelierRole = 'microphone' | 'interface' | 'headphones' | 'monitors' | 'camera' | 'lighting' | 'treatment' | 'cable' | 'stand'

export interface RecommendationProfile {
  role?: AtelierRole
  subtype?: string
  uses: string[]
  connections: string[]
  requires: AtelierRole[]
  sourceCapacity?: number
  roomFit: Array<'untreated' | 'treated' | 'travel'>
  mobility?: 'fixed' | 'mobile'
  complexity?: 'simple' | 'moderate' | 'advanced'
  qualities: string[]
  status: RecommendationStatus
  uncertainty: string[]
  sources?: Partial<Record<'subtype' | 'connections' | 'sourceCapacity', 'override' | 'editorial' | 'specs' | 'categoryDefaults'>>
}

export interface AtelierOffer {
  merchantName: string
  price: number
  currency: 'EUR'
  affiliateLink: string
  inStock: boolean
  lastCheckedAt?: string
}

export interface OwnedEquipment {
  role: AtelierRole
  productId?: string
  connection?: 'usb' | 'xlr' | 'other'
}

export interface AtelierProfile {
  project: 'podcast' | 'streaming' | 'music_vocals' | 'video'
  sourceCount?: 1 | 2 | 'many'
  room: 'untreated' | 'treated' | 'travel'
  mobility: 'fixed' | 'mobile'
  ownedEquipment: OwnedEquipment[]
  budget: number
  priority: 'simplicity' | 'value' | 'upgradeability'
  computer?: 'mac' | 'pc'
  note?: string
}

export interface AtelierRequirement {
  role: AtelierRole
  quantity: number
  required: boolean
  constraints: string[]
}

export interface AtelierCatalogProduct {
  id: string
  slug: string
  name: string
  brand: string
  imageUrl: string | null
  profile: RecommendationProfile
  offers: AtelierOffer[]
}

export interface AtelierRecommendationRequest {
  profile: AtelierProfile
  lockedProductIds?: string[]
}

export interface AtelierSetupLine {
  productId: string
  slug: string
  name: string
  brand: string
  imageUrl: string | null
  role: AtelierRole
  state: 'selected' | 'locked' | 'owned'
  quantity: number
  price: number
  subtotal: number
  bestOffer: AtelierOffer
  reason: string
  requires: AtelierRole[]
  status: RecommendationStatus
}

export interface AtelierCandidate {
  role: AtelierRole
  product: Omit<AtelierSetupLine, 'state' | 'quantity' | 'subtotal'>
  reason: string
}

export interface AtelierAlternative {
  kind: 'save' | 'upgrade'
  replacesProductId: string
  product: AtelierCandidate['product']
  priceDelta: number
  reason: string
}

export interface AtelierProof {
  budgetRespected: boolean
  chainComplete: boolean
  connectionsVerified: boolean
  offersAvailable: boolean
}

export interface AtelierGuide {
  slug: string
  title: string
  reason: string
}

export interface AtelierConflict {
  code: 'budget_insufficient' | 'missing_dependency' | 'locked_product_incompatible' | 'data_unknown'
  message: string
  productId?: string
  resolutions: Array<'unlock_product' | 'increase_budget' | 'reduce_scope' | 'verify_data'>
}

export interface AtelierRecommendation {
  setup: AtelierSetupLine[]
  candidates: AtelierCandidate[]
  alternatives: AtelierAlternative[]
  proof: AtelierProof
  contextualGuide: AtelierGuide | null
  conflicts: AtelierConflict[]
  unavailableReason?: string
}

export interface AtelierRecommendationPack {
  id: 'essential' | 'balance' | 'premium'
  title: string
  detail: string
  recommendation: Omit<AtelierRecommendation, 'packs'>
}

export interface AtelierPackRecommendation extends AtelierRecommendation {
  packs: AtelierRecommendationPack[]
}
