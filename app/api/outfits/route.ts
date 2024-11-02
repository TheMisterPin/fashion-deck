/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await req.json()
    const { outfitParts, picture, preview, occasion } = data

    // Validate input
    if (!Array.isArray(outfitParts) || outfitParts.length === 0) {
      return NextResponse.json(
        { message: 'Invalid outfit parts' },
        { status: 400 }
      )
    }

    if (!picture || !preview || !Array.isArray(preview)) {
      return NextResponse.json(
        { message: 'Missing picture or preview' },
        { status: 400 }
      )
    }

    // Start a transaction to ensure atomicity
    const result = await prisma.$transaction(async () => {
      // Create the outfit with nested OutfitItems
      const newOutfit = await prisma.outfit.create({
        data: {
          picture,
          preview,
          occasion,
          User: { connect: { clerkId: userId } },
          items: {
            create: outfitParts.map((clothingItemId) => ({
              clothingItem: { connect: { id: clothingItemId } }
            }))
          },
          isUsed: true,
          isWorn: false,
          timesWorn: 0,
          lastWorn: null
        },
        include: {
          items: {
            include: {
              clothingItem: true
            }
          },
          User: true
        }
      })

      // Create WornWithItem relationships (but don't increment timesWornTogether)
      const wornWithPromises = outfitParts
        .flatMap((itemId, i) =>
          outfitParts.slice(i + 1).map((wornWithItemId) => [
            prisma.wornWithItem.upsert({
              where: { itemId_wornWithItemId: { itemId, wornWithItemId } },
              update: {},
              create: { itemId, wornWithItemId, timesWornTogether: 0 }
            }),
            prisma.wornWithItem.upsert({
              where: {
                itemId_wornWithItemId: {
                  itemId: wornWithItemId,
                  wornWithItemId: itemId
                }
              },
              update: { timesWornTogether: +1 },
              create: {
                itemId: wornWithItemId,
                wornWithItemId: itemId,
                timesWornTogether: 0
              }
            })
          ])
        )
        .flat()

      await Promise.all(wornWithPromises)

      return newOutfit
    })

    return NextResponse.json(
      {
        message: 'Outfit created successfully',
        outfit: {
          id: result.id,
          picture: result.picture,
          preview: result.preview,
          occasion: result.occasion,
          timesWorn: result.timesWorn,
          lastWorn: result.lastWorn,
          isUsed: result.isUsed,
          isWorn: result.isWorn,
          items: result.items.map((item: any) => ({
            id: item.clothingItem.id,
            type: item.clothingItem.type,
            name: item.clothingItem.name,
            color: item.clothingItem.color,
            picture: item.clothingItem.picture
          }))
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating outfit:', error)

    return NextResponse.json(
      {
        message: 'Error creating outfit',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  try {
    const outfits = await prisma.outfit.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            clothingItem: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedOutfits = outfits.map((outfit: any) => ({
      id: outfit.id,
      picture: outfit.picture,
      occasion: outfit.occasion.toString(),
      preview: outfit.preview,
      timesWorn: outfit.timesWorn,
      lastWorn: outfit.lastWorn,
      items: outfit.items.map((item: any) => ({
        id: item.clothingItem.id,
        type: item.clothingItem.type,
        name: item.clothingItem.name,
        color: item.clothingItem.color,
        picture: item.clothingItem.picture
      }))
    }))

    return NextResponse.json(
      { message: 'Outfits retrieved successfully', outfits: formattedOutfits },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching outfits:', error)

    return NextResponse.json(
      {
        message: 'Error fetching outfits',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
