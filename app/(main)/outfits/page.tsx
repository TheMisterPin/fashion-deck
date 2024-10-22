'use client'

import { useEffect, useState } from 'react'
import { getUserOutfits } from '@/app/controllers/outfits'
import AddOutfitModal from '@/app/_components/modals/add-outfit-modal'
import OutfitCard from '@/app/_components/cards/outfit-card'
import RandomOutfitGenerator from '@/app/_components/misc/random-outfit-generator'
import TriangleLoader from '@/app/_components/loaders/triangle-loader'
import { toast } from 'sonner'

export default function OutfitPage() {
	const [outfits, setOutfits] = useState<Outfit[]>([])
	const [wardrobeItems, setWardrobeItems] = useState<ResponseWardrobe | null>(
		null
	)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		fetchWardrobeItems()
		fetchOutfits()
	}, [])

	const fetchWardrobeItems = async () => {
		setIsLoading(true)
		try {
			const response = await fetch('/api/wardrobe')
			if (!response.ok) {
				throw new Error('Failed to fetch wardrobe items')
			}
			const result: ApiResponse = await response.json()
			setWardrobeItems(result.data)
			toast.success(result.message)
		} catch (error) {
			console.error('Error fetching wardrobe items:', error)
			toast.error('Failed to fetch wardrobe items')
		} finally {
			setIsLoading(false)
		}
	}

	async function fetchOutfits() {
		setIsLoading(true)
		try {
			const fetchedOutfits = await getUserOutfits()
			setOutfits(fetchedOutfits)
		} catch (error) {
			console.error('Error fetching outfits:', error)
			toast.error('Failed to fetch outfits')
		} finally {
			setIsLoading(false)
		}
	}

	const handleEdit = (id: number) => {
		// Implement edit functionality
		console.log(`Editing outfit ${id}`)
	}

	const handleDelete = async (id: number) => {
		try {
			// Implement actual delete API call here
			// const response = await fetch(`/api/outfits/${id}`, { method: 'DELETE' })
			// if (!response.ok) throw new Error('Failed to delete outfit')

			setOutfits(prevOutfits => prevOutfits.filter(outfit => outfit.id !== id))
			toast.success('Outfit deleted successfully')
		} catch (error) {
			console.error('Error deleting outfit:', error)
			toast.error('Failed to delete outfit')
		}
	}

	const handleOutfitSaved = () => {
		fetchOutfits()
		toast.success('New outfit saved')
	}

	return (
		<div className="container p-4 mx-auto">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold text-stone-800">Your Outfits</h1>
				{wardrobeItems ? (
					<>
						<AddOutfitModal
							items={wardrobeItems}
							
						/>
						<RandomOutfitGenerator
							wardrobeItems={wardrobeItems}
							onOutfitSaved={handleOutfitSaved}
						/>
					</>
				) : (
					<p className="text-stone-600">No Wardrobe Items</p>
				)}
			</div>
			{isLoading ? (
				<TriangleLoader />
			) : outfits.length === 0 ? (
				<p className="text-center text-stone-600">
					No outfits found. Create your first outfit!
				</p>
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{outfits.map(outfit => (
						<OutfitCard
							key={outfit.id}
							outfit={outfit}
							onEdit={() => handleEdit(outfit.id)}
							onDelete={() => handleDelete(outfit.id)}
						/>
					))}
				</div>
			)}
		</div>
	)
}
