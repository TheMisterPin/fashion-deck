import { auth} from '@clerk/nextjs/server'
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    const { userId } = auth();

    if (!userId) {
        throw new Error("User ID is required for fetching wardrobe items.");
    }

    try {
        const userWardrobe = await prisma.clothingItems.findMany({
            where: {
                userId: userId
            },
            include: {
                clothingItem: true
            }
        });

return NextResponse.json(
        { message: "success" , items : userWardrobe},
        { status: 200 })
    } catch (error) {
        console.error("Failed to retrieve wardrobe items:", error);
        throw new Error("Could not fetch wardrobe items.");
    }
}
