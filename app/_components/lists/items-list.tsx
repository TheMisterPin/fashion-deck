'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Star, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { deleteClothingItem } from '@/app/controllers/clothing'
import { useWardrobeContext } from '@/context/wardrobe-context'

interface ItemCardProps {
  item: ResponseClothingItem
}

function ItemCard({ item }: ItemCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const { refreshItemsData, refreshOutfitData } = useWardrobeContext()
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteClothingItem(item.id)
    refreshItemsData()
    refreshOutfitData()
  }

  const timesWorn = item.outfits.reduce(
    (sum, outfit) => sum + outfit.timesWorn,
    0
  )

  return (
    <>
      <Card
        className="overflow-hidden transition-shadow cursor-pointer hover:shadow-lg"
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex h-full">
          <div className="relative w-1/2 h-full">
            {item.picture && (
              <Image
                src={item.picture}
                alt={item.name}
                width={150}
                height={150}
                className="object-cover rounded-md"
              />
            )}
          </div>
          <CardContent className="flex flex-col justify-between w-1/2 p-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-muted-foreground">
                Times Worn: <span className="font-bold">{timesWorn}</span>
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorite}
                className="self-end"
                aria-label={
                  isFavorite ? 'Remove from favorites' : 'Add to favorites'
                }
              >
                <Star
                  className={`h-5 w-5 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                />
                <span className="sr-only">Toggle Favorite</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{item.name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-[1fr_2fr] gap-4">
            <div>
              {item.picture && (
                <Image
                  src={item.picture}
                  alt={item.name}
                  width={150}
                  height={150}
                  className="object-cover rounded-md"
                />
              )}
            </div>
            <div>
              <p>
                <strong>Type:</strong> {item.type}
              </p>
              <p>
                <strong>Color:</strong> {item.color}
              </p>
              <p>
                <strong>Times Worn:</strong> {timesWorn}
              </p>
              <p>
                <strong>Last Worn:</strong>{' '}
                {item.outfits[0]?.lastWorn
                  ? new Date(item.outfits[0].lastWorn).toLocaleDateString()
                  : 'Never'}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="mb-2 font-semibold">Outfits</h4>
            <div className="flex pb-2 space-x-2 overflow-x-auto">
              {item.outfits.map((outfit) => (
                <div key={outfit.id} className="flex-shrink-0">
                  {outfit.picture && (
                    <Image
                      src={outfit.picture}
                      alt={`Outfit ${outfit.id}`}
                      width={100}
                      height={100}
                      className="object-cover rounded-md"
                    />
                  )}
                  <p className="mt-1 text-xs">Worn: {outfit.timesWorn}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <h4 className="mb-2 font-semibold">Worn With</h4>
            <div className="flex pb-2 space-x-2 overflow-x-auto">
              {item.wornWith.map((wornItem) => (
                <div key={wornItem.id} className="flex-shrink-0">
                  {wornItem.picture && (
                    <Image
                      src={wornItem.picture}
                      alt={wornItem.name}
                      width={80}
                      height={80}
                      className="object-cover rounded-md"
                    />
                  )}
                  <p className="mt-1 text-xs">{wornItem.name}</p>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

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
