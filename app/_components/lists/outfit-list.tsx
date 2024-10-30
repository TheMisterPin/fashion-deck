'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Pencil, Trash2, X } from 'lucide-react'
import axios from 'axios'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'

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
        className="overflow-hidden transition-shadow cursor-pointer hover:shadow-lg"
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex h-full">
          <div className="relative w-1/2 h-full">
            {outfit.picture ? (
              <Image
                src={outfit.picture}
                alt={`Outfit ${outfit.id}`}
                width={150}
                height={150}
                className="object-cover rounded-md"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>
          <CardContent className="flex flex-col justify-between w-1/2 p-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold">Outfit {outfit.id}</h3>
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
              <X className="w-4 h-4" />
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
                  className="object-cover rounded-md"
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
            <h4 className="mb-2 font-semibold">Items</h4>
            <div className="flex pb-2 space-x-2 overflow-x-auto">
              {outfit.preview.map((item, index) => (
                <div key={index} className="flex-shrink-0">
                  {item ? (
                    <Image
                      src={item}
                      alt={`Item ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-20 h-20 bg-gray-200 rounded-md">
                      <span className="text-xs text-gray-400">No Image</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <h4 className="mb-2 font-semibold">Similar Outfits</h4>
            <div className="flex pb-2 space-x-2 overflow-x-auto">
              {similarOutfits.map((similarOutfit) => (
                <div key={similarOutfit.id} className="flex-shrink-0">
                  {similarOutfit.picture ? (
                    <Image
                      src={similarOutfit.picture}
                      alt={`Similar Outfit ${similarOutfit.id}`}
                      width={80}
                      height={80}
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-20 h-20 bg-gray-200 rounded-md">
                      <span className="text-xs text-gray-400">No Image</span>
                    </div>
                  )}
                  <p className="mt-1 text-xs">Outfit {similarOutfit.id}</p>
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

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/outfits/${id}`)
    } catch (error) {
      console.error('Error deleting outfit:', error)
    }
  }

  const getSimilarOutfits = (outfit: Outfit): Outfit[] => {
    return outfits
      .filter((o) => o.occasion === outfit.occasion && o.id !== outfit.id)
      .slice(0, 3)
  }

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
            <OutfitCard
              outfit={outfit}
              onEdit={function (): void {
                console.log('edit')
              }}
              onDelete={function (id: number): void {
                console.log('delete')
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </>
  )
}
