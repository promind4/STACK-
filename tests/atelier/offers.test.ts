import assert from 'node:assert/strict'
import test from 'node:test'

import { selectBestAvailableOffer } from '../../lib/atelier/offers.ts'
import { transformProduct } from '../../lib/transformers.ts'
import type { AtelierOffer } from '../../lib/atelier/types.ts'

const validOffer = (overrides: Partial<AtelierOffer> = {}): AtelierOffer => ({
  merchantName: 'Atelier partenaire',
  price: 49,
  currency: 'EUR',
  affiliateLink: 'https://example.com/offer',
  inStock: true,
  ...overrides,
})

test('selects the cheapest in-stock offer over a cheaper out-of-stock offer', () => {
  const available = validOffer({ merchantName: 'Disponible', price: 59 })

  assert.equal(selectBestAvailableOffer([
    validOffer({ merchantName: 'Rupture', price: 19, inStock: false }),
    available,
  ]), available)
})

test('rejects unusable prices, currencies, and affiliate links', () => {
  assert.equal(selectBestAvailableOffer([
    validOffer({ price: 0 }),
    validOffer({ price: -1 }),
    validOffer({ price: Number.POSITIVE_INFINITY }),
    validOffer({ currency: 'USD' as never }),
    validOffer({ affiliateLink: '   ' }),
    validOffer({ affiliateLink: null as never }),
  ]), null)
})

test('transformProduct exposes the selected purchasable offer and its price', () => {
  const product = transformProduct({
    id: 'product-1',
    category_id: 'microphones',
    name: 'Test microphone',
    slug: 'test-microphone',
    price: 9,
    product_offers: [
      { merchant_name: 'Rupture', price: 15, currency: 'EUR', affiliate_link: 'https://example.com/sold-out', in_stock: false },
      { merchant_name: 'Deuxième', price: 59, currency: 'EUR', affiliate_link: 'https://example.com/second', in_stock: true },
      { merchant_name: 'Disponible', price: 49, currency: 'EUR', affiliate_link: 'https://example.com/in-stock', in_stock: true },
      { merchant_name: 'Devise erronée', price: 20, currency: 'USD', affiliate_link: 'https://example.com/usd', in_stock: true },
    ],
  })

  assert.equal(product.price, 49)
  assert.equal(product.inStock, true)
  assert.deepEqual(product.offers?.map(offer => offer.merchant_name), ['Disponible', 'Deuxième'])
  assert.equal('offer' in (product.offers?.[0] ?? {}), false)
})
