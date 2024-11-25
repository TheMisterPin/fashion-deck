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

// PATCH function for partial updates
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

    const data = await req.json()
    const { type, image, color, description } = data

    const baseItem = await prisma.clothingItem.findUnique({
      where: { id: itemId }
    })

    if (!baseItem) {
      return NextResponse.json(
        { message: 'Clothing item not found' },
        { status: 404 }
      )
    }

    // Only update the fields that are provided
    const updateData: any = {}

    if (type) updateData.type = type.toUpperCase()
    if (image) updateData.picture = image
    if (description) updateData.description = description
    if (color) updateData.color = color.toUpperCase()

    // Only update name if both color and type are changed or if either is changed (using existing values)
    if (type || color) {
      const newColor = color || baseItem.color
      const newType = type || baseItem.type

      updateData.name = `${newColor} ${newType}`.toLowerCase()
    }

    const updatedItem = await prisma.clothingItem.update({
      where: {
        id: itemId
      },
      data: updateData
    })

    return NextResponse.json(
      {
        message: 'Item modified successfully',
        item: updatedItem
      },
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
