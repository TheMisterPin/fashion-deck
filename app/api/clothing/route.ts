import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

import prisma from '@/lib/prisma'

async function createWardrobeItem(userId: string, clothingItemId: number) {
  const wardrobeItem = await prisma.wardrobeItem.create({
    data: {
      userId,
      clothingItemId
    }
  })

  return wardrobeItem
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  const data = await req.json()
  const { type, image, color, description } = await data
  const name = [color, type]
  const newName = name.join(' ')

  if (!type || !image || !color) {
    return NextResponse.json(
      { message: 'Missing required fields' },
      { status: 400 }
    )
  }
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  if (!description) {
    data.description = ''
  }

  try {
    const newItem = await prisma.clothingItem.create({
      data: {
        type: type.toUpperCase() as ClothingType,
        picture: image,
        description,
        color: color.toUpperCase() as Color,
        name: newName.toLowerCase()
      }
    })

    await createWardrobeItem(userId, newItem.id)

    return NextResponse.json(
      { message: 'Item added to wardrobe', newItem },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error adding item to wardrobe', error },
      { status: 500 }
    )
  }
}
