import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  ownsWardrobeItems,
  positiveItemId,
  validOutfitParts
} from './wardrobe-access.ts'

test('accepts only positive integer route IDs', () => {
  assert.equal(positiveItemId('12'), 12)
  for (const value of ['0', '-1', '12oops', '1.5', '9007199254740992']) {
    assert.equal(positiveItemId(value), null)
  }
})

test('rejects duplicate, empty, and malformed outfit parts', () => {
  assert.equal(validOutfitParts([1, 2, 3]), true)
  for (const value of [[], [1, 1], [0], [1.5], ['1'], null]) {
    assert.equal(validOutfitParts(value), false)
  }
})

test('requires every outfit item to belong to the current user', async () => {
  const db = {
    wardrobeItem: {
      count: async ({ where }) => {
        assert.equal(where.userId, 'current-user')
        assert.deepEqual(where.clothingItemId.in, [1, 2])

        return 1 // Only one of two items is owned.
      }
    }
  }

  assert.equal(await ownsWardrobeItems(db, 'current-user', [1, 2]), false)
  assert.equal(await ownsWardrobeItems(db, 'current-user', [1, 1]), false)
  db.wardrobeItem.count = async () => 2
  assert.equal(await ownsWardrobeItems(db, 'current-user', [1, 2]), true)
})
