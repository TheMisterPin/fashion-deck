import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from 'lucide-react'

interface OutfitCardProps {
  outfit: Outfit
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export default function OutfitCard({ outfit, onEdit, onDelete }: OutfitCardProps) {
  const [stackedImageUrl, setStackedImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const createStackedImage = async () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = 300
      canvas.height = 400

      const images = await Promise.all(
        outfit.preview.map(src => {
          return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new window.Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = src
          })
        })
      )

      images.forEach((img, index) => {
        const x = 50 * index
        const y = 50 * index
        ctx.drawImage(img, x, y, 200, 200)
      })

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve))
      if (blob) {
        setStackedImageUrl(URL.createObjectURL(blob))
      }
    }

    createStackedImage()

    return () => {
      if (stackedImageUrl) {
        URL.revokeObjectURL(stackedImageUrl)
      }
    }
  }, [outfit.preview])

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>My Outfit {outfit.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          {stackedImageUrl && (
            <div className="relative w-64 h-64">
              <Image
                src={stackedImageUrl}
                alt="Stacked outfit preview"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>Times worn: {outfit.timesWorn}</p>
          <p>Last worn: {outfit.lastWorn ? new Date(outfit.lastWorn).toLocaleDateString() : 'Never'}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="icon" onClick={() => onEdit(outfit.id)}>
          <Pencil className="w-4 h-4" />
          <span className="sr-only">Edit outfit</span>
        </Button>
        <Button variant="outline" size="icon" onClick={() => onDelete(outfit.id)}>
          <Trash2 className="w-4 h-4" />
          <span className="sr-only">Delete outfit</span>
        </Button>
      </CardFooter>
    </Card>
  )
}