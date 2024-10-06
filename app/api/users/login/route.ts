import { NextResponse } from "next/server";
import {PrismaClient} from "@prisma/client"
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient()
async function createUser(clerkId : string) {
    const user = await prisma.user.create({
        data: {
            clerkId
        }
    })
    return user
}
export async function POST(){
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
        where: {
            clerkId: userId
        },
        include: {
            wardrobe: true,
            favorites : true,
            outfits : true
        }
    })
    if (!user) {
        const newUser = await createUser(userId)
        return NextResponse.json({ message: "User created", user: newUser }, { status: 201 });
    }
    return NextResponse.json({ message: "Welcome Back", user }, { status: 200 });

}