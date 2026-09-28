import { readFile } from 'node:fs/promises'
import { PrismaClient, ClothingType, Color, Occasion } from '@prisma/client'

const prisma = new PrismaClient()
const userId = process.env.SEED_CLERK_USER_ID?.trim()
const source = JSON.parse(
  await readFile(new URL('../data/wardrobe.json', import.meta.url), 'utf8')
)

const outfitPlans = [
  { shirt: 0, pants: 0, shoes: 0, occasion: Occasion.CASUAL },
  { shirt: 1, pants: 1, shoes: 1, occasion: Occasion.WORK },
  { shirt: 2, pants: 2, shoes: 2, occasion: Occasion.CASUAL },
  { shirt: 3, pants: 3, shoes: 0, occasion: Occasion.FORMAL },
  { shirt: 4, pants: 4, shoes: 1, occasion: Occasion.WORK },
  { shirt: 5, pants: 0, shoes: 2, occasion: Occasion.SPORT }
]

function classify(value, values, field) {
  if (typeof value !== 'string' || !Object.values(values).includes(value)) {
    throw new Error(`Invalid ${field} in data/wardrobe.json: ${value}`)
  }

  return value
}

function group(items, type) {
  return items.filter((item) => item.type === type)
}

async function seed() {
  if (!userId) {
    throw new Error(
      'Set SEED_CLERK_USER_ID to the Clerk user ID for this development wardrobe'
    )
  }
  if (!Array.isArray(source) || source.length === 0) {
    throw new Error('data/wardrobe.json must contain clothing items')
  }

  const catalog = source.map((item, index) => {
    const type = classify(item.type, ClothingType, 'type')
    const color = classify(item.color, Color, 'color')

    if (typeof item.picture !== 'string' || !item.picture) {
      throw new Error(`Missing picture for clothing item ${index}`)
    }

    return {
      type,
      color,
      picture: item.picture,
      occasions: new Set([Occasion.CASUAL])
    }
  })
  const sampleShirts = group(catalog, ClothingType.SHIRT)
  const samplePants = group(catalog, ClothingType.PANTS)
  const sampleShoes = group(catalog, ClothingType.SHOES)

  for (const plan of outfitPlans) {
    const parts = [
      sampleShirts[plan.shirt],
      samplePants[plan.pants],
      sampleShoes[plan.shoes]
    ]

    if (parts.some((part) => !part)) {
      throw new Error(
        'Not enough shirts, pants or shoes for the sample outfit plans'
      )
    }
    parts.forEach((part) => part.occasions.add(plan.occasion))
  }

  await prisma.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: { clerkId: userId }
  })

  const items = []
  let createdItems = 0

  for (const sourceItem of catalog) {
    const existing = await prisma.wardrobeItem.findFirst({
      where: { userId, clothingItem: { picture: sourceItem.picture } },
      include: { clothingItem: true }
    })

    if (existing) {
      items.push(existing.clothingItem)
      continue
    }

    const item = await prisma.clothingItem.create({
      data: {
        type: sourceItem.type,
        color: sourceItem.color,
        picture: sourceItem.picture,
        name: `${sourceItem.color} ${sourceItem.type}`.toLowerCase(),
        occasions: [...sourceItem.occasions],
        wardrobes: { create: { userId } }
      }
    })

    items.push(item)
    createdItems += 1
  }

  const shirts = group(items, ClothingType.SHIRT)
  const pants = group(items, ClothingType.PANTS)
  const shoes = group(items, ClothingType.SHOES)
  const saved = await prisma.outfit.findMany({
    where: { userId },
    include: { items: { select: { clothingItemId: true } } }
  })
  const key = (ids) => [...ids].sort((a, b) => a - b).join(':')
  const existing = new Set(
    saved.map((outfit) => key(outfit.items.map((item) => item.clothingItemId)))
  )
  let createdOutfits = 0

  for (const plan of outfitPlans) {
    const parts = [shirts[plan.shirt], pants[plan.pants], shoes[plan.shoes]]

    if (parts.some((part) => !part)) {
      throw new Error(
        'Not enough shirts, pants or shoes for the sample outfit plans'
      )
    }

    const ids = parts.map((part) => part.id)
    const combination = key(ids)

    if (existing.has(combination)) continue

    await prisma.$transaction(async (tx) => {
      await tx.outfit.create({
        data: {
          userId,
          occasion: plan.occasion,
          picture: parts[0].picture,
          preview: parts.map((part) => part.picture),
          isUsed: true,
          items: { create: ids.map((clothingItemId) => ({ clothingItemId })) }
        }
      })

      for (const itemId of ids) {
        for (const wornWithItemId of ids) {
          if (itemId === wornWithItemId) continue

          await tx.wornWithItem.upsert({
            where: { itemId_wornWithItemId: { itemId, wornWithItemId } },
            update: {},
            create: { itemId, wornWithItemId, timesWornTogether: 0 }
          })
        }
      }
    })
    existing.add(combination)
    createdOutfits += 1
  }

  console.log(
    `Seeded ${createdItems} clothing items and ${createdOutfits} outfits for ${userId}.`
  )
}

try {
  await seed()
} catch (error) {
  console.error(error)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
