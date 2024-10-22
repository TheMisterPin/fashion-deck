'use client'

import { useEffect, useState } from 'react'
import AddItemModal from '@/app/_components/forms/add-item-modal'
import ItemList from '@/app/_components/lists/items-list'
import axios from 'axios'
import { cerateNewClothigItem } from '@/app/controllers/clothing'
import TriangleLoader from '@/app/_components/loaders/triangle-loader'
import { getWardrobe } from '@/app/controllers/wardrobe'
import { motion } from 'framer-motion'

const addItem = async (item: Item) => {
	await cerateNewClothigItem({ item })
}

export default function WardrobePage() {
	const [wardrobe, setWardrobe] = useState([])
	const [isLoading, setIsLoading] = useState<boolean>(true)

	async function login() {
		setIsLoading(true)
		const response = await axios.post('/api/users/login')
		const userWardrobe = await response.data.user.wardrobe
		const clerkId = await response.data.user.clerkId
		const userWardrobeItems = userWardrobe.map(
			(item: WardrobeItem) => item.clothingItem
		)

		setWardrobe(userWardrobeItems)
		const funziona = getWardrobe()
		console.log(funziona)
		console.log(clerkId)
		console.table(userWardrobeItems)
		setIsLoading(false)
	}

	useEffect(() => {
		login()
	}, [])

	return (
		<div className="flex flex-col h-screen bg-gradient-to-b from-stone-50 to-stone-100">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="p-8"
			>
				<h1 className="mb-4 text-4xl font-bold text-center text-stone-800">
					Your Wardrobe
				</h1>
				<div className="flex justify-center mb-4">
					<AddItemModal addItem={addItem} />
				</div>
			</motion.div>

			<div className="flex-grow overflow-hidden">
				{isLoading ? (
					<div className="flex items-center justify-center h-full">
						<TriangleLoader />
					</div>
				) : (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
						className="h-full px-4 pb-8 overflow-y-auto"
					>
						{wardrobe && <ItemList items={wardrobe} />}
					</motion.div>
				)}
			</div>
		</div>
	)
}
