import test from 'node:test'
import assert from 'node:assert/strict'

import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

const { extractLocation } = require('./parse-keywords.utils.cjs')

test('extracts city and state abbreviation from keyword', () => {
  const result = extractLocation('emergency vet in Jacksonville, FL')
  assert.deepEqual(result, { city: 'Jacksonville', state: 'FL' })
})

test('extracts city and state name', () => {
  const result = extractLocation('24 hour vet Greenville South Carolina')
  assert.deepEqual(result, { city: 'Greenville', state: 'SC' })
})
