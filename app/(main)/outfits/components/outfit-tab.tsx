'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/ui/button'
import OutfitCard from './outfit-card'

export default function OutfitTab({ outfits }: { outfits: Outfit[] }) {
  const [selectedCategory, setSelectedCategory] = useState('Casual')
  const [selectedOutfits, setSelectedOutfits] = useState<Outfit[]>(
    outfits || []
  )
  const categories = ['Formal', 'Casual', 'Sport', 'Work']

  const getCategoryOutfits = (category: string): Outfit[] => {
    switch (category) {
      case 'Formal':
        return outfits.filter((outfit) => outfit.occasion === 'FORMAL')

      case 'Casual':
        return outfits.filter((outfit) => outfit.occasion === 'CASUAL')
      case 'Sport':
        return outfits.filter((outfit) => outfit.occasion === 'SPORT')
      case 'Work':
        return outfits.filter((outfit) => outfit.occasion === 'WORK')
      default:
        return outfits
    }
  }

  function handleClick(category: string) {
    setSelectedCategory(category)
    setSelectedOutfits(getCategoryOutfits(category))
  }

  const handleEdit = (id: number) => {
    console.log(`Editing outfit ${id}`)
  }

  const getSimilarOutfits = (outfit: Outfit): Outfit[] => {
    return outfits
      .filter((o) => o.occasion === outfit.occasion && o.id !== outfit.id)
      .slice(0, 3)
  }

  return (
    <div className="container mx-auto p-4">
      <nav className="flex justify-center space-x-4 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => handleClick(category)}
            variant={selectedCategory === category ? 'default' : 'outline'}
          >
            {category}
          </Button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {selectedOutfits.map((outfit) => (
            <motion.div
              key={outfit.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <OutfitCard
                outfit={outfit}
                onEdit={handleEdit}
                similarOutfits={getSimilarOutfits(outfit)}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
