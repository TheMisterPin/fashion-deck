'use client'

import React, { useState } from 'react'
import { Shuffle } from 'lucide-react'
import Image from 'next/image'
import axios from 'axios'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface RandomOutfitGeneratorProps {
  wardrobeItems: ResponseWardrobe
  onOutfitSaved: () => void
}

export default function RandomOutfitGenerator({
  wardrobeItems,
  onOutfitSaved,
}: RandomOutfitGeneratorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [randomOutfit, setRandomOutfit] = useState<
  ResponseClothingItem[] | null
  >(null)
  const [outfitBlob, setOutfitBlob] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const generateRandomOutfit = () => {
    const shirt =			wardrobeItems.Shirt[
			  Math.floor(Math.random() * wardrobeItems.Shirt.length)
    ]
    const pants =			wardrobeItems.Pants[
			  Math.floor(Math.random() * wardrobeItems.Pants.length)
    ]
    const shoes =			wardrobeItems.Shoes[
			  Math.floor(Math.random() * wardrobeItems.Shoes.length)
    ]
    return [shirt, pants, shoes]
  }

  const createOutfitBlob = async (items: ResponseClothingItem[]) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    canvas.width = 300
    canvas.height = 400

    const images = await Promise.all(
      items.map((item) => new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = item.picture!
      })),
    )

    images.forEach((img, index) => {
      const x = 50 * index
      const y = 50 * index
      ctx.drawImage(img, x, y, 200, 200)
    })

    return new Promise<string | null>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob))
        } else {
          resolve(null)
        }
      })
    })
  }

  const handleGenerateOutfit = async () => {
    setIsLoading(true)
    const outfit = generateRandomOutfit()
    setRandomOutfit(outfit)
    const blob = await createOutfitBlob(outfit)
    setOutfitBlob(blob)
    setIsModalOpen(true)
    setIsLoading(false)
  }

  const handleSaveOutfit = async () => {
    if (!randomOutfit || !outfitBlob) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      const response = await fetch(outfitBlob)
      const blob = await response.blob()
      formData.append('image', blob, 'outfit.png')
      formData.append('key', process.env.NEXT_PUBLIC_IMGBB_API_KEY || '')

      const uploadResponse = await axios.post(
        'https://api.imgbb.com/1/upload',
        formData,
      )
      const imageUrl = uploadResponse.data.data.url

      const outfitData = {
        outfitParts: randomOutfit.map((item) => item.id),
        picture: imageUrl,
        preview: randomOutfit.map((item) => item.picture),
      }

      await axios.post('/api/outfits', outfitData)
      onOutfitSaved()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving outfit:', error)
      alert('Failed to save the outfit. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <React.Fragment>
      <Button
        onClick={handleGenerateOutfit}
        disabled={isLoading}
      >
        <Shuffle className="w-4 h-4 mr-2" />
        {' '}
        Generate Random Outfit
      </Button>

      <Dialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Random Outfit</DialogTitle>
          </DialogHeader>
          {outfitBlob && (
            <div className="relative w-64 h-64 mx-auto">
              <Image
                src={outfitBlob}
                alt="Random outfit"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Discard
            </Button>
            <Button
              onClick={handleSaveOutfit}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Outfit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
