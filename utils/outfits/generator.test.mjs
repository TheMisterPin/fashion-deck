import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getOutfitCombinations, outfitKey, pickOutfit } from './generator.ts'

const item = (id, type, timesWorn = 0) => ({ id, type, timesWorn })
const wardrobe = [
  item(1, 'Shirt', 5), item(2, 'Shirt', 0),
  item(3, 'Pants'), item(4, 'Shoes')
]

test('generates combinations from a supplied subset without mutating it', () => {
  assert.deepEqual(getOutfitCombinations(wardrobe).map(outfitKey), ['1:3:4', '2:3:4'])
  assert.deepEqual(getOutfitCombinations(wardrobe.slice(0, 3)), [])
  assert.deepEqual(wardrobe.map((part) => part.id), [1, 2, 3, 4])
})

test('prefers unworn items and excludes saved combinations in any order', () => {
  assert.equal(outfitKey(pickOutfit(wardrobe, [], new Set(), () => 0)), '2:3:4')
  assert.equal(
    outfitKey(pickOutfit(wardrobe, [{ items: [{ id: 4 }, { id: 2 }, { id: 3 }] }])),
    '1:3:4'
  )
})

test('does not repeat a preview until remaining candidates are shown', () => {
  assert.equal(outfitKey(pickOutfit(wardrobe, [], new Set(['2:3:4']))), '1:3:4')
  assert.equal(outfitKey(pickOutfit(wardrobe, [], new Set(['1:3:4', '2:3:4']))), '2:3:4')
  assert.equal(pickOutfit(wardrobe, [{ items: wardrobe.filter((part) => part.id !== 2) },
    { items: wardrobe.filter((part) => part.id !== 1) }]), null)
})

test('prefers favorites, then cycles through other combinations', () => {
  const withFavorite = wardrobe.map((part) => ({
    ...part,
    isFavorite: part.id === 1
  }))

  assert.equal(outfitKey(pickOutfit(withFavorite, [])), '1:3:4')
  assert.equal(
    outfitKey(pickOutfit(withFavorite, [], new Set(['1:3:4']))),
    '2:3:4'
  )
})
