import { PrismaClient } from '@prisma/client'
import wardrobeData from '@/data/wardrobe.json'

const prisma = new PrismaClient()

// Function to create wardrobe item for the user
async function createWardrobeItem(userId: string, clothingItemId: number) {
	const wardrobeItem = await prisma.wardrobeItem.create({
		data: {
			userId,
			clothingItemId
		}
	})
	return wardrobeItem
}

async function main() {
	const userId = '' // Replace with actual user ID

	// Loop through wardrobe data and add items to the database
	try {
		const results = []

		for (const { type, color, picture } of wardrobeData) {
			const name = `${color} ${type}`.toLowerCase() // Generate a name for the clothing item

			// Create clothing item in the database
			const newItem = await prisma.clothingItem.create({
				data: {
					type: type.toUpperCase() as ClothingType,
					color: color.toUpperCase() as Color,
					picture,
					name: name
				}
			})

			// Associate the clothing item with the user's wardrobe
			const wardrobeItem = await createWardrobeItem(userId, newItem.id)
			results.push({ newItem, wardrobeItem })
		}

		console.log('Items added to wardrobe:', results)
	} catch (error) {
		console.error('Error adding items to wardrobe:', error)
	} finally {
		await prisma.$disconnect()
	}
}

main().catch(error => {
	console.error(error)
	process.exit(1)
})
