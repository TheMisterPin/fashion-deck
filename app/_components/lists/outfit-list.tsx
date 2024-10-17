/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState, useEffect } from 'react'
import OutfitCard from '../cards/outfit-card'
import { motion } from 'framer-motion'


type OutfitListProps = {
	outfits: Outfit[]
}

const OUTFITS_PER_PAGE = 5

export default function OutfitList({ outfits }: OutfitListProps) {
	const [visibleOutfits, setVisibleOutfits] = useState<Outfit[]>([])
	const [page, setPage] = useState(1)

	useEffect(() => {
		setVisibleOutfits(outfits.slice(0, OUTFITS_PER_PAGE * page))
	}, [outfits, page])

	const loadMore = () => {
		setPage(prevPage => prevPage + 1)
	}

	const handleScroll = () => {
		if (
			window.innerHeight + document.documentElement.scrollTop ===
			document.documentElement.offsetHeight
		) {
			loadMore()
		}
	}

	useEffect(() => {
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])


	if (outfits.length === 0) return <p>No outfits found.</p>

	return (
		<>
			<motion.div className="grid w-full max-w-2xl grid-cols-1 gap-4 mt-8">
				{visibleOutfits.map((outfit, index) => (
					<motion.div
						key={outfit.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: index * 0.1 }}
					>
						<OutfitCard outfit={outfit} onEdit={function (): void {
                            console.log('edit')
                        } } onDelete={function (id: number): void {
                            console.log('delete') 
                        } }/>
					</motion.div>
				))}
			</motion.div>
		</>
	)
}
