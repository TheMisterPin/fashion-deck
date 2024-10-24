import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Occasion } from '@prisma/client'

export async function GET(
  req: NextRequest,
  { params }: { params: { occasion: string } },
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { occasion } = params
  if (!occasion) {
    return NextResponse.json(
      { message: 'Must specify occasion' },
      { status: 400 }
    )
  }

  const formattedOccasion = occasion.toUpperCase() as Occasion

  if (!Object.values(Occasion).includes(formattedOccasion)) {
    return NextResponse.json(
      { message: 'Invalid occasion specified' },
      { status: 400 }
    )
  }

  try {
    const outfits = await prisma.outfit.findMany({
      where: {
        userId,
        occasion: formattedOccasion,
      },
      include: {
        items: {
          include: {
            clothingItem: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const formattedOutfits = outfits.map((outfit) => ({
      id: outfit.id,
      picture: outfit.picture,
      occasion: outfit.occasion,
      preview: outfit.preview,
      timesWorn: outfit.timesWorn,
      lastWorn: outfit.lastWorn,
      isUsed: outfit.isUsed,
      isAvailable: outfit.isAvailable,
      isWorn: outfit.isWorn,
      items: outfit.items.map((item) => ({
        id: item.clothingItem.id,
        type: item.clothingItem.type,
        name: item.clothingItem.name,
        color: item.clothingItem.color,
        picture: item.clothingItem.picture,
      })),
    }))

    return NextResponse.json(
      { message: 'Outfits retrieved successfully', outfits: formattedOutfits },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error fetching outfits:', error)
    return NextResponse.json(
      {
        message: 'Error fetching outfits',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}