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

  try {
    const result = await prisma.wardrobeItem.updateMany({
      where: { userId, clothingItemId: itemId },
      data: {
        lastWorn: new Date(),
        timesWorn: { increment: 1 }
      }
    })

    if (result.count === 0) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 })
    }

    const updatedItem = await prisma.wardrobeItem.findUniqueOrThrow({
      where: { userId_clothingItemId: { userId, clothingItemId: itemId } }
    })

    return NextResponse.json({ updatedItem })
  } catch (error) {
    console.error('Error marking item worn:', error)

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
