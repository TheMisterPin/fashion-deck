import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

async function createWardrobeItem(userId: string, clothingItemId: number) {
  const wardrobeItem = await prisma.wardrobeItem.create({
    data: {
      userId,
      clothingItemId,
    },
  });
  return wardrobeItem;
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  const data = await req.json(); 
  const { type, picture, color, name } = data;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    
    const newItem = await prisma.clothingItem.create({
      data: {
        type: type.toUpperCase(), 
        picture,
        color: color.toUpperCase(), 
        name,
      },
    });

    await createWardrobeItem(userId, newItem.id);

    return NextResponse.json(
      { message: "Item added to wardrobe", newItem },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error adding item to wardrobe", error },
      { status: 500 }
    );
  }
}
