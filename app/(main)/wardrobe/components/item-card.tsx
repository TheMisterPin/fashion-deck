import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Star, Trash2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'

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
  const [isFavorite, setIsFavorite] = useState(item.isFavorite)
  const [isSavingFavorite, setIsSavingFavorite] = useState(false)
  const { refreshItemsData, refreshOutfitData } = useWardrobeContext()

  useEffect(() => setIsFavorite(item.isFavorite), [item.isFavorite])

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSavingFavorite(true)

    try {
      const response = await axios.put(`/api/clothing/favorites/${item.id}`)

      setIsFavorite(response.data.isFavorite)
      await refreshItemsData()
    } catch (error) {
      console.error('Error updating favorite:', error)
      toast.error('Could not update favorite')
    } finally {
      setIsSavingFavorite(false)
    }
  }
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      await deleteClothingItem(item.id)
      await refreshItemsData()
      refreshOutfitData()
    } catch (error) {
      console.error('Error deleting clothing item:', error)
      toast.error('Could not delete clothing item')
    }
  }

  const timesWorn = item.timesWorn

  return (
    <>
      <Card
        className="overflow-hidden transition-shadow cursor-pointer hover:shadow-lg"
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex h-full">
          <div className="relative h-full  bg-stone-100 border-r-2 border-black">
            {item.picture && (
              <Image
                src={item.picture}
                alt={item.name}
                width={150}
                height={150}
                className="object-cover rounded-md p-1  shadow"
              />
            )}
          </div>
          <CardContent className="flex flex-col justify-between w-1/2 p-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold break-words overflow-hidden line-clamp-1">
                {item.description}
              </h3>
              <p className="text-sm text-muted-foreground">
                Times Worn: <span className="font-bold">{timesWorn}</span>
              </p>
              <p className="text-sm text-muted-foreground">{item.name}</p>
            </div>
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorite}
                disabled={isSavingFavorite}
                aria-pressed={isFavorite}
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
