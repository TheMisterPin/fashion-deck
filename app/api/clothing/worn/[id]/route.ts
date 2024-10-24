import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(req : NextRequest) {
  const itemId = parseInt(req.nextUrl.searchParams.get('id')!)
  const updatedItem = await prisma.clothingItem.update({
    where: { id: itemId },
    data: {
      lastWorn: new Date(),
      timesWorn: { increment: 1 },
    },
  })
  return NextResponse.json({ updatedItem })
}
