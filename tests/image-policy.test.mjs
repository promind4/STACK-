import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const policyPath = path.resolve('lib/imagePolicy.mjs')

let module
try {
  await readFile(policyPath, 'utf8')
  module = await import(pathToFileURL(policyPath).href)
} catch {
  module = {}
}

assert.equal(
  typeof module.isDirectSupabaseStorageUrl,
  'function',
  'image policy must export isDirectSupabaseStorageUrl',
)

const { isDirectSupabaseStorageUrl } = module

assert.equal(
  isDirectSupabaseStorageUrl('https://project.supabase.co/storage/v1/object/public/images-produit/item.png'),
  true,
)
assert.equal(
  isDirectSupabaseStorageUrl('https://project.supabase.co/storage/v1/render/image/public/images-produit/item.png?width=320'),
  false,
)
assert.equal(isDirectSupabaseStorageUrl('/images/editorial/hero.webp'), false)
assert.equal(isDirectSupabaseStorageUrl('https://images.unsplash.com/photo-1'), false)

console.log('image policy: all assertions passed')
