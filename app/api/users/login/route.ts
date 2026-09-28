import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

import prisma from '@/lib/prisma'

export async function POST() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  // The data provider may mount twice in development or in separate tabs.
  await prisma.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: { clerkId: userId }
  })

  return NextResponse.json({ message: 'Ready' })
}
