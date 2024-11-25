import prisma from "@/lib/prisma"

export async function createPublicItem(clothingItemId: number) {
	const clothingItem = await prisma.clothingItem.findUnique(
		{
			where: {
				id: clothingItemId
			}
		}
	)
	if (!clothingItem) {
		throw new Error('Clothing item not found')
	}
	const publicItem = await prisma.publicItem.create({
		data: {
			name : clothingItem.name,
			type: clothingItem.type,
			color: clothingItem.color,
			picture: clothingItem.picture
		}
	})
	
	return publicItem
}