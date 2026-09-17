import test from 'node:test'
import assert from 'node:assert/strict'
import { isPublicAudioCategory, isPublicAudioGuide } from '../lib/public-audio-scope.ts'

test('keeps Studio & Son categories and rejects retired verticals', () => {
  assert.equal(isPublicAudioCategory('cartes-son'), true)
  assert.equal(isPublicAudioCategory('traitement-acoustique'), true)
  assert.equal(isPublicAudioCategory('video'), false)
  assert.equal(isPublicAudioCategory('stream-deck'), false)
})

test('keeps only Audio articles in the public guide scope', () => {
  assert.equal(isPublicAudioGuide({ category: 'Audio' }), true)
  assert.equal(isPublicAudioGuide({ category: 'Vidéo' }), false)
  assert.equal(isPublicAudioGuide({ category: 'Streaming' }), false)
})
