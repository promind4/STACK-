import assert from 'node:assert/strict'
import test from 'node:test'

import { buildRequirements } from '../../lib/atelier/requirements.ts'
import type { AtelierProfile } from '../../lib/atelier/types.ts'

const profile = (overrides: Partial<AtelierProfile> = {}): AtelierProfile => ({
  project: 'podcast',
  sourceCount: 1,
  room: 'untreated',
  mobility: 'fixed',
  ownedEquipment: [],
  budget: 500,
  priority: 'value',
  ...overrides,
})

test('builds capture and monitoring requirements before the solo microphone is selected', () => {
  assert.deepEqual(buildRequirements(profile()), [
    { role: 'microphone', quantity: 1, required: true, constraints: ['podcast', 'untreated room'] },
    { role: 'headphones', quantity: 1, required: true, constraints: ['monitoring'] },
  ])
})

test('does not require a separate interface before a solo microphone connection is known', () => {
  assert.deepEqual(buildRequirements(profile()).map(requirement => requirement.role), [
    'microphone', 'headphones',
  ])
})

test('requires two capture sources and an interface with two inputs for a duo podcast', () => {
  assert.deepEqual(buildRequirements(profile({ sourceCount: 2 })), [
    { role: 'microphone', quantity: 2, required: true, constraints: ['podcast', 'untreated room'] },
    { role: 'interface', quantity: 1, required: true, constraints: ['at least 2 inputs'] },
    { role: 'headphones', quantity: 2, required: true, constraints: ['monitoring'] },
  ])
})

test('adds room control for streaming in an untreated room', () => {
  assert.deepEqual(buildRequirements(profile({ project: 'streaming' })), [
    { role: 'microphone', quantity: 1, required: true, constraints: ['streaming', 'untreated room', 'noise rejection'] },
    { role: 'headphones', quantity: 1, required: true, constraints: ['monitoring'] },
    { role: 'camera', quantity: 1, required: true, constraints: ['streaming'] },
    { role: 'lighting', quantity: 1, required: true, constraints: ['streaming'] },
    { role: 'treatment', quantity: 1, required: true, constraints: ['room noise control'] },
  ])
})

test('adds treated-room monitoring for music vocals', () => {
  assert.deepEqual(buildRequirements(profile({ project: 'music_vocals', room: 'treated' })), [
    { role: 'microphone', quantity: 1, required: true, constraints: ['music_vocals', 'treated room'] },
    { role: 'headphones', quantity: 1, required: true, constraints: ['monitoring'] },
    { role: 'monitors', quantity: 2, required: true, constraints: ['treated room'] },
  ])
})

test('keeps a mobile creator kit portable and excludes fixed elements', () => {
  assert.deepEqual(buildRequirements(profile({ project: 'video', room: 'travel', mobility: 'mobile' })), [
    { role: 'microphone', quantity: 1, required: true, constraints: ['video', 'travel', 'mobile'] },
    { role: 'headphones', quantity: 1, required: true, constraints: ['monitoring', 'mobile'] },
    { role: 'camera', quantity: 1, required: true, constraints: ['video', 'mobile'] },
    { role: 'lighting', quantity: 1, required: true, constraints: ['video', 'mobile'] },
  ])
})

test('does not rebuy an owned XLR microphone but keeps the additional duo source and interface', () => {
  assert.deepEqual(buildRequirements(profile({
    sourceCount: 2,
    ownedEquipment: [{ role: 'microphone', connection: 'xlr' }],
  })), [
    { role: 'microphone', quantity: 1, required: true, constraints: ['podcast', 'untreated room'] },
    { role: 'interface', quantity: 1, required: true, constraints: ['at least 2 inputs', 'XLR microphone'] },
    { role: 'headphones', quantity: 2, required: true, constraints: ['monitoring'] },
  ])
})
