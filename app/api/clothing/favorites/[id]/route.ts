import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

import prisma from '@/lib/prisma'
import { positiveItemId } from '@/lib/wardrobe-access'

export async function PUT(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const itemId = positiveItemId(params.id)

  if (!itemId) {
    return NextResponse.json({ message: 'Invalid item ID' }, { status: 400 })
  }

  const actorUserId = userId
  const clothingItemId = itemId

  async function toggleFavorite() {
    // Check if the item is already a favorite
    const favorite = await prisma.favoriteItem.findUnique({
      where: {
        userId_clothingItemId: {
          userId: actorUserId,
          clothingItemId
        }
      }
    })

    // If it exists, remove from favorites
    if (favorite) {
      await prisma.favoriteItem.delete({
        where: {
          userId_clothingItemId: {
            userId: actorUserId,
            clothingItemId
          }
        }
      })

      return NextResponse.json({
        message: 'Item removed from favorites',
        isFavorite: false
      })
    }
    // If it does not exist, add to favorites
    await prisma.favoriteItem.create({
      data: {
        userId: actorUserId,
        clothingItemId
      }
    })

    return NextResponse.json({
      message: 'Item added to favorites',
      isFavorite: true
    })
  }

  // Run the toggle favorite function and handle errors
  try {
    const owned = await prisma.wardrobeItem.findUnique({
      where: { userId_clothingItemId: { userId, clothingItemId: itemId } }
    })

    if (!owned) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 })
    }

    return await toggleFavorite()
  } catch (error) {
    console.error('Error updating favorites:', error)

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
