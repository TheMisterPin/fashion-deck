import type { Prisma } from '@prisma/client'

type WardrobeReader = Pick<Prisma.TransactionClient, 'wardrobeItem'>

export function positiveItemId(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) return null
  const id = Number(value)

  return Number.isSafeInteger(id) ? id : null
}

export function validOutfitParts(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((id) => Number.isSafeInteger(id) && id > 0) &&
    new Set(value).size === value.length
  )
}

export async function ownsWardrobeItems(
  db: WardrobeReader,
  userId: string,
  itemIds: number[]
): Promise<boolean> {
  if (!validOutfitParts(itemIds)) return false

  const ownedCount = await db.wardrobeItem.count({
    where: { userId, clothingItemId: { in: itemIds } }
  })

  return ownedCount === itemIds.length
}
