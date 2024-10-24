import { auth } from '@clerk/nextjs/server'

import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const wardrobe = await prisma.wardrobeItem.findMany({
      where: { userId },
      include: {
        clothingItem: {
          select: {
            id: true,
            type: true,
            name: true,
            color: true,
            picture: true,
            wornWith: {
              include: {
                wornWithItem: {
                  select: {
                    id: true,
                    type: true,
                    name: true,
                    color: true,
                    picture: true,
                  },
                },
              },
            },
            outfits: {
              select: {
                outfit: {
                  select: {
                    id: true,
                    occasion: true,
                    picture: true,
                    timesWorn: true,
                    lastWorn: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!wardrobe.length) {
      return NextResponse.json(
        { message: 'Wardrobe is empty' },
        { status: 404 },
      )
    }

    // Helper function to capitalize the first letter of the name
    function capitalizeFirstLetter(name: string) {
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    }

    // Group the wardrobe items by their clothing type
    const groupedItems = wardrobe.reduce((acc, item) => {
      const { type } = item.clothingItem
      const formattedType = capitalizeFirstLetter(
        type.toString(),
      ) as ClothingType

      // Initialize array if this type isn't already in the accumulator
      if (!acc[formattedType]) {
        acc[formattedType] = []
      }

      // Format the worn with items
      const wornWithItems = item.clothingItem.wornWith.map((ww) => ({
        id: ww.wornWithItem.id,
        type: capitalizeFirstLetter(ww.wornWithItem.type) as ClothingType,
        name: capitalizeFirstLetter(ww.wornWithItem.name),
        color: ww.wornWithItem.color?.toUpperCase() as Color,
        picture: ww.wornWithItem.picture,
      }))

      // Format the outfits
      const outfits = item.clothingItem.outfits.map((o) => ({
        id: o.outfit.id,
        picture: o.outfit.picture,
        occasion: o.outfit.occasion,
        timesWorn: o.outfit.timesWorn,
        lastWorn: o.outfit.lastWorn,
      }))

      // Push the formatted item to the correct type group
      const formattedItem = {
        id: item.clothingItem.id,
        type: formattedType,
        name: capitalizeFirstLetter(item.clothingItem.name),
        color: item.clothingItem.color?.toUpperCase() as Color,
        picture: item.clothingItem.picture,
        wornWith: wornWithItems,
        outfits,
      }

      acc[formattedType].push(formattedItem)
      return acc
    }, {} as Record<ClothingType, ResponseClothingItem[]>)
    console.log(groupedItems)
    // Return the grouped items as a response with a success message
    return NextResponse.json(
      {
        message: 'Wardrobe items retrieved successfully',
        data: groupedItems,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error fetching wardrobe items:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}
