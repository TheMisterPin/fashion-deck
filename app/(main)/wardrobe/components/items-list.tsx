import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/ui/button'
import ItemCard from './item-card'

export default function ItemsTab({ items }: { items: ResponseWardrobe }) {
  const [selectedCategory, setSelectedCategory] = useState('Shirts')

  const categories = ['Shirts', 'Pants', 'Shoes', 'Jumpers']

  const getCategoryItems = (category: string): ResponseClothingItem[] => {
    switch (category) {
      case 'Shirts':
        return items.Shirt
      case 'Pants':
        return items.Pants
      case 'Shoes':
        return items.Shoes
      case 'Jumpers':
        return items.Jumper
      default:
        return []
    }
  }

  const currentItems = getCategoryItems(selectedCategory)

  return (
    <div className="container p-4 mx-auto">
      <nav className="flex justify-center mb-8 space-x-4">
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => setSelectedCategory(category)}
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
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {currentItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <ItemCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
