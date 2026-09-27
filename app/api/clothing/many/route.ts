import { ClothingType, Color } from '@prisma/client'
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

type NewClothingItem = {
  type: string
  color: string
  picture: string
}

function isNewClothingItem(value: unknown): value is NewClothingItem {
  if (!value || typeof value !== 'object') return false

  const item = value as Record<string, unknown>

  return (
    typeof item.type === 'string' &&
    Object.values(ClothingType).includes(
      item.type.toUpperCase() as ClothingType
    ) &&
    typeof item.color === 'string' &&
    Object.values(Color).includes(item.color.toUpperCase() as Color) &&
    typeof item.picture === 'string' &&
    item.picture.length > 0
  )
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  let data: unknown

  try {
    data = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 })
  }

  if (
    !Array.isArray(data) ||
    data.length === 0 ||
    data.length > 50 ||
    !data.every(isNewClothingItem)
  ) {
    return NextResponse.json(
      {
        message:
          'Expected 1–50 clothing items with valid type, color and picture'
      },
      { status: 400 }
    )
  }

  try {
    const items = await prisma.$transaction(async (tx) => {
      const created = []

      for (const { type, color, picture } of data as NewClothingItem[]) {
        const newItem = await tx.clothingItem.create({
          data: {
            type: type.toUpperCase() as ClothingType,
            color: color.toUpperCase() as Color,
            picture,
            name: `${color} ${type}`.toLowerCase()
          }
        })

        const wardrobeItem = await tx.wardrobeItem.create({
          data: { userId, clothingItemId: newItem.id }
        })

        created.push({ newItem, wardrobeItem })
      }

      return created
    })

    return NextResponse.json(
      { message: 'Items added to wardrobe', items },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error adding clothing items:', error)

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
