'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import ClothingItemSelector from './clothing-item-selector'
import ClothingTypeSelector from './clothing-type-selector'
import { Shirt } from 'lucide-react'
import { PiPants as Pants, PiHoodie as Sweater } from 'react-icons/pi'
import { GiConverseShoe as Shoe } from 'react-icons/gi'
import Image from 'next/image'

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY

type OutfitFormProps = {
	onSubmitSuccess: () => void
	wardrobeItems: ResponseWardrobe
}

export default function OutfitForm({
	onSubmitSuccess,
	wardrobeItems
}: OutfitFormProps) {
	const [selectedItems, setSelectedItems] = useState<ResponseClothingItem[]>([])
	const [loading, setLoading] = useState(false)
	const [activeSelector, setActiveSelector] = useState<string | null>(null)
	const [stackedImageBlob, setStackedImageBlob] = useState<Blob | null>(null)

	const shirts = wardrobeItems.Shirt
	const pants = wardrobeItems.Pants
	const shoes = wardrobeItems.Shoes
	const jumpers = wardrobeItems.Jumper

	const handleSelect = (item: ResponseClothingItem) => {
		setSelectedItems(prev => {
			const filtered = prev.filter(i => i.type !== item.type)
			return [...filtered, item]
		})
		setActiveSelector(null)
	}

	useEffect(() => {
		const createStackedImage = async () => {
			if (selectedItems.length === 0) return

			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')
			if (!ctx) return

			canvas.width = 300
			canvas.height = 400

			const images = await Promise.all(
				selectedItems.map(item => {
					return new Promise<HTMLImageElement>((resolve, reject) => {
						const img = new window.Image()
						img.crossOrigin = 'anonymous'
						img.onload = () => resolve(img)
						img.onerror = reject
						img.src = item.picture!
					})
				})
			)

			images.forEach((img, index) => {
				const x = 50 * index
				const y = 50 * index
				ctx.drawImage(img, x, y, 200, 200)
			})

			const blob = await new Promise<Blob | null>(resolve =>
				canvas.toBlob(resolve)
			)
			if (blob) {
				setStackedImageBlob(blob)
			}
		}

		createStackedImage()
	}, [selectedItems])

	const uploadToImgbb = async (imageBlob: Blob): Promise<string> => {
		const formData = new FormData()
		const processedFile = new File([imageBlob], 'processed_image.png', {
			type: 'image/png'
		})
		formData.append('image', processedFile)
		formData.append('key', IMGBB_API_KEY || '')

		const response = await axios.post(
			`https://api.imgbb.com/1/upload?expiration=15552000&key=${IMGBB_API_KEY}`,
			formData
		)
		if (response.data.status !== 200) {
			throw new Error('Failed to upload image to ImgBB')
		}
		const imageUrl = response.data.data.url
		return imageUrl
	}

	const onSubmit = async () => {
		if (selectedItems.length === 0) {
			alert('Please select at least one clothing item')
			return
		}
		setLoading(true)
		try {
			let pictureUrl = null
			if (stackedImageBlob) {
				pictureUrl = await uploadToImgbb(stackedImageBlob)
			}

			const outfitData = {
				outfitParts: selectedItems.map(item => item.id),
				picture: pictureUrl,
				preview: selectedItems.map(item => item.picture)
			}
			const response = await axios.post('/api/outfits', outfitData)
			if (response.status === 201) {
				onSubmitSuccess()
			} else {
				throw new Error('Failed to create outfit')
			}
		} catch (error) {
			console.error('Error creating outfit:', error)
			alert('Failed to create the outfit. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const getSelectedItem = (type: string) => {
		return selectedItems.find(item => item.type === type)
	}

	return (
		<div className="space-y-6">
			<Label>Select Items:</Label>
			<div className="flex justify-between">
				<ClothingTypeSelector
					icon={<Shirt size={24} />}
					label="Shirt"
					onClick={() => setActiveSelector('Shirt')}
					selected={!!getSelectedItem('SHIRT')}
				/>
				<ClothingTypeSelector
					icon={<Pants size={24} />}
					label="Pants"
					onClick={() => setActiveSelector('Pants')}
					selected={!!getSelectedItem('PANTS')}
				/>
				<ClothingTypeSelector
					icon={<Shoe size={24} />}
					label="Shoes"
					onClick={() => setActiveSelector('Shoes')}
					selected={!!getSelectedItem('SHOES')}
				/>
				<ClothingTypeSelector
					icon={<Sweater size={24} />}
					label="Jumper"
					onClick={() => setActiveSelector('Jumper')}
					selected={!!getSelectedItem('JUMPER')}
				/>
			</div>
			{activeSelector === 'Shirt' && (
				<ClothingItemSelector
					items={shirts}
					onSelect={handleSelect}
					onClose={() => setActiveSelector(null)}
				/>
			)}
			{activeSelector === 'Pants' && (
				<ClothingItemSelector
					items={pants}
					onSelect={handleSelect}
					onClose={() => setActiveSelector(null)}
				/>
			)}
			{activeSelector === 'Shoes' && (
				<ClothingItemSelector
					items={shoes}
					onSelect={handleSelect}
					onClose={() => setActiveSelector(null)}
				/>
			)}
			{activeSelector === 'Jumper' && (
				<ClothingItemSelector
					items={jumpers}
					onSelect={handleSelect}
					onClose={() => setActiveSelector(null)}
				/>
			)}
			<div className="mt-4">
				<h3 className="mb-2 font-semibold">Selected Items:</h3>
				<div className="flex flex-wrap gap-2">
					{selectedItems
						.sort((a, b) => {
							const order = ['SHIRT', 'JUMPER', 'PANTS', 'SHOES']
							return order.indexOf(a.type) - order.indexOf(b.type)
						})
						.map(item => (
							<div key={item.id} className="relative w-40 h-40">
								<Image
									src={item.picture || ''}
									alt={item.name || 'No Image'}
									fill
									style={{ objectFit: 'contain' }}
								/>
							</div>
						))}
				</div>
			</div>

			<Button
				className="w-full mt-6"
				onClick={onSubmit}
				disabled={loading || selectedItems.length === 0}
			>
				{loading ? 'Creating Outfit...' : 'Add Outfit'}
			</Button>
		</div>
	)
}
