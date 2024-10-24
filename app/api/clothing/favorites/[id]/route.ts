import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

import prisma from '@/lib/prisma'

export async function PUT(req: NextRequest) {
  const itemId = parseInt(req.nextUrl.searchParams.get('id')!)
  const { userId } = await auth()

  if (!itemId) {
    return NextResponse.json(
      { message: 'Item ID is required' },
      { status: 400 },
    )
  }

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  async function toggleFavorite() {
    // Check if the item is already a favorite
    const favorite = await prisma.favoriteItem.findUnique({
      where: {
        userId_clothingItemId: {
          userId: userId!,
          clothingItemId: itemId,
        },
      },
    })

    // If it exists, remove from favorites
    if (favorite) {
      await prisma.favoriteItem.delete({
        where: {
          userId_clothingItemId: {
            userId: userId!,
            clothingItemId: itemId,
          },
        },
      })
      return NextResponse.json({ message: 'Item removed from favorites' })
    }
    // If it does not exist, add to favorites
    await prisma.favoriteItem.create({
      data: {
        userId: userId!,
        clothingItemId: itemId,
      },
    })
    return NextResponse.json({ message: 'Item added to favorites' })
  }

  // Run the toggle favorite function and handle errors
  try {
    return await toggleFavorite()
  } catch (error) {
    console.error('Error updating favorites:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    )
  }
}
