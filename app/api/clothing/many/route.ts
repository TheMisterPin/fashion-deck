import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

async function createWardrobeItem(userId: string, clothingItemId: number) {
	const wardrobeItem = await prisma.wardrobeItem.create({
		data: {
			userId,
			clothingItemId
		}
	})
	return wardrobeItem
}

export async function POST(req: NextRequest) {
	const userId = 'user_2n5C2TRZe2g0WFGxbou0m4xGX9s'

	
	const data = await req.json()

	// Check if data is an array of items, handle multiple items creation
	if (!Array.isArray(data)) {
		return NextResponse.json(
			{ message: 'Invalid data format: Expected an array of items.' },
			{ status: 400 }
		)
	}

	try {
		const results = []

		for (const { type, color, picture } of data) {
			const name = `${color} ${type}`.toLowerCase()

			const newItem = await prisma.clothingItem.create({
				data: {
					type: type.toUpperCase(),
					color: color.toUpperCase(),
					picture,
					name: name
				}
			})

			const wardrobeItem = await createWardrobeItem(userId, newItem.id)
			console.log(results)
			results.push({ newItem, wardrobeItem })
		}

		return NextResponse.json(
			{
				message: 'Items added to wardrobe',
				items: results
			},
			{ status: 200 }
		)
	} catch (error) {
		return NextResponse.json(
			{
				message: 'Error adding items to wardrobe',
				error: error
			},
			{ status: 500 }
		)
	}
}
