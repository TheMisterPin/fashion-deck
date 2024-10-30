import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

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
      { message: 'Outfit ID is required' },
      { status: 400 }
    )
  }

  const itemId = parseInt(id, 10)

  if (isNaN(itemId)) {
    return NextResponse.json({ message: 'Invalid Outfit ID' }, { status: 400 })
  }

  try {
    await prisma.outfit.delete({
      where: {
        id: itemId,
        userId: userId
      }
    })

    return NextResponse.json(
      { message: 'Outfit deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting outfit:', error)

    return NextResponse.json(
      {
        message: 'Error deleting outfit',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function GET(
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
      { message: 'Outfit ID is required' },
      { status: 400 }
    )
  }

  const itemId = parseInt(id, 10)

  if (isNaN(itemId)) {
    return NextResponse.json({ message: 'Invalid Outfit ID' }, { status: 400 })
  }

  try {
    const outfit = await prisma.outfit.findUnique({
      where: {
        id: itemId,
        userId: userId
      },
      include: {
        items: {
          include: {
            clothingItem: true
          }
        }
      }
    })

    if (!outfit) {
      return NextResponse.json({ message: 'Outfit not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'Outfit retrieved successfully', outfit },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching outfit:', error)

    return NextResponse.json(
      {
        message: 'Error fetching outfit',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function PUT(
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
      { message: 'Outfit ID is required' },
      { status: 400 }
    )
  }

  const itemId = parseInt(id, 10)

  if (isNaN(itemId)) {
    return NextResponse.json({ message: 'Invalid Outfit ID' }, { status: 400 })
  }

  try {
    const {
      picture,
      occasion,
      preview,
      timesWorn,
      lastWorn,
      isUsed,
      isAvailable,
      isWorn
    } = await req.json()

    const updatedOutfit = await prisma.outfit.update({
      where: {
        id: itemId,
        userId: userId
      },
      data: {
        picture,
        occasion,
        preview,
        timesWorn,
        lastWorn,
        isUsed,
        isAvailable,
        isWorn
      }
    })

    return NextResponse.json(
      { message: 'Outfit updated successfully', updatedOutfit },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating outfit:', error)

    return NextResponse.json(
      {
        message: 'Error updating outfit',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
