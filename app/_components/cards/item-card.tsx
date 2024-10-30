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
    <>
      <Card
        className="transition-shadow cursor-pointer hover:shadow-lg"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFavorite}
            aria-label={
              isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
          >
            <Star
              className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
            />
            <span className="sr-only">Toggle Favorite</span>
          </Button>
          <Button size="icon" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{timesWorn}</div>
          <p className="text-xs text-muted-foreground">Times Worn</p>
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
