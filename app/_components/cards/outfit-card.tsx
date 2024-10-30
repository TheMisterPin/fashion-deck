import React from 'react'
import Image from 'next/image'
import { Pencil, Trash2 } from 'lucide-react'
import axios from 'axios'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface OutfitCardProps {
  outfit: Outfit
  onEdit: (id: number) => void
  onDelete?: (id: number) => void
}

export default function OutfitCard({ outfit, onEdit }: OutfitCardProps) {
  const handleDelete = async () => {
    await axios.delete(`/api/outfits/${outfit.id}`)
  }

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>My Outfit {outfit.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          {outfit.picture && (
            <div className="relative w-64 h-64">
              <Image
                src={outfit.picture}
                alt="Stacked outfit preview"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>occasion : {outfit.occasion}</p>
          <p>Times worn: {outfit.timesWorn}</p>
          <p>
            Last worn:{' '}
            {outfit.lastWorn
              ? new Date(outfit.lastWorn).toLocaleDateString()
              : 'Never'}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="icon" onClick={() => onEdit(outfit.id)}>
          <Pencil className="w-4 h-4" />
          <span className="sr-only">Edit outfit</span>
        </Button>
        <Button variant="outline" size="icon" onClick={() => handleDelete()}>
          <Trash2 className="w-4 h-4" />
          <span className="sr-only">Delete outfit</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
