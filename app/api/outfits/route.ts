import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { outfitParts, picture } = data; // outfitParts is an array of clothing item IDs

    // Validate input
    if (!Array.isArray(outfitParts) || outfitParts.length === 0) {
      return NextResponse.json(
        { message: "Invalid outfit parts" },
        { status: 400 }
      );
    }

    // Start a transaction to ensure atomicity
    const result = await prisma.$transaction(async (prisma) => {
      // Create the outfit with nested OutfitItems
      const newOutfit = await prisma.outfit.create({
        data: {
          picture: picture || "Missing Picture",
          User: { connect: { clerkId: userId } },
          items: {
            create: outfitParts.map((clothingItemId) => ({
              clothingItem: { connect: { id: clothingItemId } },
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Update timesWorn and lastWorn for the clothing items
      // await prisma.clothingItem.updateMany({
      //   where: {
      //     id: { in: outfitParts },
      //   },
      //   data: {
      //     timesWorn: { increment: 1 },
      //     lastWorn: new Date(),
      //   },
      // });

      // For each pair of items, upsert the WornWithItem relationship
      const wornWithPromises = [];

      for (let i = 0; i < outfitParts.length; i++) {
        for (let j = i + 1; j < outfitParts.length; j++) {
          const itemId = outfitParts[i];
          const wornWithItemId = outfitParts[j];

          // Upsert the relationship in both directions
          wornWithPromises.push(
            prisma.wornWithItem.upsert({
              where: { itemId_wornWithItemId: { itemId, wornWithItemId } },
              update: { timesWornTogether: { increment: 1 } },
              create: { itemId, wornWithItemId, timesWornTogether: 1 },
            }),
            prisma.wornWithItem.upsert({
              where: { itemId_wornWithItemId: { itemId: wornWithItemId, wornWithItemId: itemId } },
              update: { timesWornTogether: { increment: 1 } },
              create: { itemId: wornWithItemId, wornWithItemId: itemId, timesWornTogether: 1 },
            })
          );
        }
      }

      await Promise.all(wornWithPromises);

      return newOutfit;
    });

    return NextResponse.json(
      { message: "Outfit created successfully", outfit: result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating outfit:", error);
    return NextResponse.json(
      { message: "Error creating outfit", error },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const outfits = await prisma.outfit.findMany({
      where: { userId  },
      include: {
        items: {
          include: {
            clothingItem: true,
          },
        },
        User: true,
      },
    });

    return NextResponse.json({ outfits }, { status: 200 });
  } catch (error) {
    console.error("Error fetching outfits:", error);
    return NextResponse.json(
      { message: "Error fetching outfits", error },
      { status: 500 }
    );
  }
}