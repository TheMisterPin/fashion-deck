import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

import prisma from '@/lib/prisma'
async function createUser(clerkId: string) {
  const user = await prisma.user.create({
    data: {
      clerkId
    }
  })

  return user
}

export async function POST() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId
    }
  })

  if (!user) {
    const newUser = await createUser(userId)

    return NextResponse.json(
      { message: 'User created', user: newUser },
      { status: 201 }
    )
  }

  return NextResponse.json({ message: 'Welcome Back', user }, { status: 200 })
}
