import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params
  const itemId = parseInt(id, 10)
  console.log(itemId)
  await prisma.outfit.delete({ where: { id: itemId } })
  return NextResponse.json({ message: 'Outfit Deleted' }, { status: 200 })
}

export async function GET(req : NextRequest) {
  const itemId = parseInt(req.nextUrl.searchParams.get('id')!)
  const item = await prisma.outfit.findUnique({
    where: { id: itemId },

  })
  return NextResponse.json({ item })
}

export async function PUT(req : NextRequest) {
  const itemId = parseInt(req.nextUrl.searchParams.get('id')!)
  const {
    name, type, color, picture,
  } = await req.json()
  const updatedItem = await prisma.clothingItem.update({
    where: { id: itemId },
    data: {
      name, type, color, picture,
    },
  })
  return NextResponse.json({ updatedItem })
}
