/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params

  if (!id) {
    return NextResponse.json(
      { message: 'Clothing Item ID is required' },
      { status: 400 }
    )
  }

  const itemId = parseInt(id, 10)

  if (isNaN(itemId)) {
    return NextResponse.json(
      { message: 'Invalid Clothing Item ID' },
      { status: 400 }
    )
  }

  try {
    // First verify the item belongs to the user through WardrobeItem
    const wardrobeItem = await prisma.wardrobeItem.findUnique({
      where: {
        userId_clothingItemId: {
          userId: userId,
          clothingItemId: itemId
        }
      }
    })

    if (!wardrobeItem) {
      return NextResponse.json(
        { message: 'Clothing item not found or unauthorized' },
        { status: 404 }
      )
    }

    await prisma.clothingItem.delete({
      where: {
        id: itemId
      }
    })

    return NextResponse.json(
      { message: 'Clothing item deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting clothing item:', error)

    return NextResponse.json(
      {
        message: 'Error deleting clothing item',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params

  if (!id) {
    return NextResponse.json(
      { message: 'Clothing Item ID is required' },
      { status: 400 }
    )
  }

  const itemId = parseInt(id, 10)

  if (isNaN(itemId)) {
    return NextResponse.json(
      { message: 'Invalid Clothing Item ID' },
      { status: 400 }
    )
  }

  try {
    const wardrobeItem = await prisma.wardrobeItem.findUnique({
      where: {
        userId_clothingItemId: {
          userId: userId,
          clothingItemId: itemId
        }
      }
    })

    if (!wardrobeItem) {
      return NextResponse.json(
        { message: 'Clothing item not found or unauthorized' },
        { status: 404 }
      )
    }

    const data = await req.json()

    const { type, color, picture, name } = data
    const baseItem = await prisma.clothingItem.findUnique({
      where: { id: itemId }
    })

    if (!baseItem) {
      return NextResponse.json(
        { message: 'Clothing item not found' },
        { status: 404 }
      )
    }
    const updateData = {
      type: type || baseItem.type,
      color: color || baseItem.color,
      picture: picture || baseItem.picture,
      name: name || baseItem.name
    }
    const updatedItem = await prisma.clothingItem.update({
      where: {
        id: itemId
      },
      data: updateData
    })

    return NextResponse.json(
      { message: 'Clothing item updated successfully', item: updatedItem },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating clothing item:', error)

    return NextResponse.json(
      {
        message: 'Error updating clothing item',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params

  if (!id) {
    return NextResponse.json(
      { message: 'Clothing Item ID is required' },
      { status: 400 }
    )
  }

  const itemId = parseInt(id, 10)

  if (isNaN(itemId)) {
    return NextResponse.json({ message: 'Invalid Clothing Item ID' }, { status: 400 })
  }

  try {
    // First verify the item belongs to the user through WardrobeItem
    const wardrobeItem = await prisma.wardrobeItem.findUnique({
      where: {
        userId_clothingItemId: {
          userId: userId,
          clothingItemId: itemId
        }
      }
    })

    if (!wardrobeItem) {
      return NextResponse.json(
        { message: 'Clothing item not found or unauthorized' },
        { status: 404 }
      )
    }

    // Check if item is already in favorites
    const existingFavorite = await prisma.favoriteItem.findUnique({
      where: {
        userId_clothingItemId: {
          userId: userId,
          clothingItemId: itemId
        }
      }
    })

    let isFavorite: boolean
    
    if (existingFavorite) {
      // Remove from favorites
      await prisma.favoriteItem.delete({
        where: {
          userId_clothingItemId: {
            userId: userId,
            clothingItemId: itemId
          }
        }
      })
      isFavorite = false
    } else {
      // Add to favorites
      await prisma.favoriteItem.create({
        data: {
          userId: userId,
          clothingItemId: itemId
        }
      })
      isFavorite = true
    }

    // Update the clothing item's isFavorite flag
    const updatedItem = await prisma.clothingItem.update({
      where: {
        id: itemId
      },
      data: {
        isFavorite: isFavorite
      }
    })

    return NextResponse.json(
      { 
        message: `Item ${isFavorite ? 'added to' : 'removed from'} favorites successfully`,
        item: updatedItem,
        isFavorite 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error toggling favorite status:', error)

    return NextResponse.json(
      {
        message: 'Error toggling favorite status',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
