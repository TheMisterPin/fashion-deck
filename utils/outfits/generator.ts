type OutfitParts = Pick<ResponseClothingItem, 'id' | 'timesWorn'>

export const outfitKey = (items: Pick<ResponseClothingItem, 'id'>[]): string =>
  items
    .map((item) => item.id)
    .sort((a, b) => a - b)
    .join(':')

// Keep the input flexible so a subset of the wardrobe can be used for packing
// or an occasion filter without changing the generator.
export function getOutfitCombinations(
  items: ResponseClothingItem[]
): ResponseClothingItem[][] {
  const byType = (type: string) =>
    items.filter((item) => item.type.toUpperCase() === type)
  const shirts = byType('SHIRT')
  const pants = byType('PANTS')
  const shoes = byType('SHOES')

  return shirts.flatMap((shirt) =>
    pants.flatMap((pairOfPants) =>
      shoes.map((pairOfShoes) => [shirt, pairOfPants, pairOfShoes])
    )
  )
}

export function pickOutfit(
  items: ResponseClothingItem[],
  savedOutfits: { items: { id: number }[] }[],
  shownKeys: ReadonlySet<string> = new Set(),
  random: () => number = Math.random
): ResponseClothingItem[] | null {
  const savedKeys = new Set(
    savedOutfits.map((outfit) => outfitKey(outfit.items))
  )
  const available = getOutfitCombinations(items).filter(
    (outfit) => !savedKeys.has(outfitKey(outfit))
  )

  if (available.length === 0) return null

  // Cycle through the remaining combinations before showing one again.
  const fresh = available.filter((outfit) => !shownKeys.has(outfitKey(outfit)))
  const candidates = fresh.length ? fresh : available
  const favoriteCount = (outfit: ResponseClothingItem[]) =>
    outfit.filter((item) => item.isFavorite).length
  const mostFavorites = Math.max(...candidates.map(favoriteCount))
  const preferred = candidates.filter(
    (outfit) => favoriteCount(outfit) === mostFavorites
  )
  const wearCount = (outfit: OutfitParts[]) =>
    outfit.reduce((total, item) => total + item.timesWorn, 0)
  const fewestWears = Math.min(...preferred.map(wearCount))
  const leastWorn = preferred.filter(
    (outfit) => wearCount(outfit) === fewestWears
  )

  return leastWorn[Math.floor(random() * leastWorn.length)]
}
