'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteClothingItem } from '@/app/controllers/clothing'

interface ItemCardProps {
  item: ResponseClothingItem
}

export default function ItemCard({ item }: ItemCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteClothingItem(item.id)
  }

  const timesWorn = item.outfits.reduce(
    (sum, outfit) => sum + outfit.timesWorn,
    0
  )

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
 
    >
      <Card 
        className="transition-shadow duration-300 border shadow-md border-stone-200 hover:shadow-lg"
        onClick={() => onOpenDetails(item.id)}
      >
        <CardContent className="flex items-center p-4 space-x-4">
          <Image
            src={item.picture || ''}
            alt={item.name || 'Clothing item'}
            width={100}
            height={100}
            className="object-cover w-24 h-24 rounded-md bg-stone-100"
          />
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-stone-800">{item.name}</h3>
            <p className="text-sm text-stone-600">{item.type}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 transition-colors duration-200 rounded-full hover:bg-stone-100">
                <MoreVertical className="w-5 h-5 text-stone-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit2 className="w-4 h-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Star className="w-4 h-4 mr-2" /> Favorite
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
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
