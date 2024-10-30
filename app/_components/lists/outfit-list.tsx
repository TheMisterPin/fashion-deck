'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { Pencil, Trash2, X } from 'lucide-react'
import axios from 'axios'

interface OutfitCardProps {
  outfit: Outfit
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  similarOutfits: Outfit[]
}

function OutfitCard({
  outfit,
  onEdit,
  onDelete,
  similarOutfits
}: OutfitCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex h-full">
          <div className="w-1/2 h-full relative">
            {outfit.picture ? (
              <Image
                src={outfit.picture}
                alt={`Outfit ${outfit.id}`}
                width={150}
                height={150}
                className="rounded-md object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>
          <CardContent className="w-1/2 flex flex-col justify-between p-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Outfit {outfit.id}</h3>
              <p className="text-sm text-muted-foreground">
                Occasion: {outfit.occasion}
              </p>
              <p className="text-sm text-muted-foreground">
                Times Worn: {outfit.timesWorn}
              </p>
            </div>
          </CardContent>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Outfit {outfit.id}</DialogTitle>
            <Button
              className="absolute right-4 top-4"
              variant="ghost"
              size="icon"
              onClick={() => setIsDialogOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogHeader>
          <div className="grid grid-cols-[1fr_2fr] gap-4">
            <div>
              {outfit.picture ? (
                <Image
                  src={outfit.picture}
                  alt={`Outfit ${outfit.id}`}
                  width={150}
                  height={150}
                  className="rounded-md object-cover"
                />
              ) : (
                <div className="w-[150px] h-[150px] bg-gray-200 flex items-center justify-center rounded-md">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>
            <div>
              <p>
                <strong>Occasion:</strong> {outfit.occasion.toString()}
              </p>
              <p>
                <strong>Times Worn:</strong> {outfit.timesWorn}
              </p>
              <p>
                <strong>Last Worn:</strong>{' '}
                {outfit.lastWorn
                  ? new Date(outfit.lastWorn).toLocaleDateString()
                  : 'Never'}
              </p>
              <p>
                <strong>Available:</strong> {outfit.isAvailable ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Used:</strong> {outfit.isUsed ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Items</h4>
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {outfit.preview.map((item, index) => (
                <div key={index} className="flex-shrink-0">
                  {item ? (
                    <Image
                      src={item}
                      alt={`Item ${index + 1}`}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Similar Outfits</h4>
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {similarOutfits.map(similarOutfit => (
                <div key={similarOutfit.id} className="flex-shrink-0">
                  {similarOutfit.picture ? (
                    <Image
                      src={similarOutfit.picture}
                      alt={`Similar Outfit ${similarOutfit.id}`}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                  <p className="text-xs mt-1">Outfit {similarOutfit.id}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(outfit.id)}
            >
              <Pencil className="w-4 h-4" />
              <span className="sr-only">Edit outfit</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(outfit.id)}
            >
              <Trash2 className="w-4 h-4" />
              <span className="sr-only">Delete outfit</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function OutfitTab({ outfits }: { outfits: Outfit[] }) {
  const [selectedCategory, setSelectedCategory] = useState("Casual")
const [selectedOutfits, setSelectedOutfits] = useState<Outfit[]>(outfits || [])
  const categories = ["Formal", "Casual", "Sport", "Work"]

  const getCategoryOutfits = (category: string): Outfit[] => {
    switch (category) {
      case "Formal":
       return outfits.filter(outfit => outfit.occasion === "FORMAL")
	   
      case "Casual":
        return outfits.filter(outfit => outfit.occasion === "CASUAL")
      case "Sport":
        return outfits.filter(outfit => outfit.occasion === "SPORT")
      case "Work":
        return outfits.filter(outfit => outfit.occasion === "WORK")
      default:
        return outfits
    }
  }

  function handleClick (category : string){
	setSelectedCategory(category)
	setSelectedOutfits(getCategoryOutfits(category))
  }

  const handleEdit = (id: number) => {
    console.log(`Editing outfit ${id}`)
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/outfits/${id}`)

    } catch (error) {
      console.error('Error deleting outfit:', error)
    }
  }

  const getSimilarOutfits = (outfit: Outfit): Outfit[] => {
    return outfits
      .filter(o => o.occasion === outfit.occasion && o.id !== outfit.id)
      .slice(0, 3)
  }

  return (
    <div className="container mx-auto p-4">
      <nav className="flex justify-center space-x-4 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => handleClick(category)}
            variant={selectedCategory === category ? "default" : "outline"}
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
                onDelete={handleDelete}
                similarOutfits={getSimilarOutfits(outfit)}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}