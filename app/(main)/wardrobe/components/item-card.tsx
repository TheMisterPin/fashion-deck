import { useState } from 'react'
import Image from 'next/image'
import { Star, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { deleteClothingItem } from '@/controllers/clothing'
import { useWardrobeContext } from '@/context/wardrobe-context'
import ItemDetails from './item-details'

interface ItemCardProps {
  item: ResponseClothingItem
}

export default function ItemCard({ item }: ItemCardProps) {
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
      <ItemDetails
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={item}
      />
    </>
  )
}
