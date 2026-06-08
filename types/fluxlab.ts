/* ─── FLUXLAB — TypeScript Types ────────────────────────────
   Partagés entre tous les composants.
   ──────────────────────────────────────────────────────────── */

export type BadgeVariant = 'new' | 'bestseller' | 'promo' | 'out_of_stock' | 'choix' | 'coup-de-coeur'

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  category: string
  subcategory: string
  type: string          // e.g. 'XLR · Dynamique'
  price: number
  originalPrice?: number
  currency?: string     // default 'EUR'
  rating: number        // 0–5
  reviewCount: number
  badge?: BadgeVariant
  promoLabel?: string   // e.g. '−15 %'
  inStock: boolean
  imageUrl?: string
  href: string
}

export interface NavLink {
  label: string
  href: string
  isActive?: boolean
  children?: NavLink[]
}

export interface Guide {
  id: string
  slug: string
  title: string
  category: string
  subcategory?: string
  readingTime: number   // minutes
  publishedAt: string   // ISO date
  excerpt: string
  imageUrl?: string
  href: string
}

export interface Category {
  id: string
  slug: string
  name: string
  count: number
  href: string
}

export interface StackItem {
  role: 'source' | 'interface' | 'headphones' | 'software' | 'accessory'
  product: Pick<Product, 'id' | 'name' | 'brand' | 'type' | 'price' | 'href'>
  connector?: string     // e.g. 'Câble XLR · 5 m'
  compatNote?: string   // e.g. '+60 dB — Suffisant'
}

export interface Stack {
  id: string
  score: number          // 0–100
  scoreLabel: string
  savingsNote?: string
  totalPrice: number
  items: StackItem[]
}

export type ButtonVariant = 'primary' | 'ghost' | 'outline' | 'pill-icon'
export type ButtonSize    = 'sm' | 'md' | 'lg'
