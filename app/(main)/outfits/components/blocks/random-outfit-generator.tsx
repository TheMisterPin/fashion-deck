'use client'

import React, { useState } from 'react'
import { Shuffle } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { createStackedImage } from '@/utils/images'
import { createOutfit } from '@/controllers/outfits'

interface RandomOutfitGeneratorProps {
  wardrobeItems: ResponseWardrobe
  onOutfitSaved: () => void
}

export default function RandomOutfitGenerator({
  wardrobeItems,
  onOutfitSaved
}: RandomOutfitGeneratorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [randomOutfit, setRandomOutfit] = useState<
    ResponseClothingItem[] | null
  >(null)
  const [outfitBlob, setOutfitBlob] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const generateRandomOutfit = () => {
    const shirt =
      wardrobeItems.Shirt[
        Math.floor(Math.random() * wardrobeItems.Shirt.length)
      ]
    const pants =
      wardrobeItems.Pants[
        Math.floor(Math.random() * wardrobeItems.Pants.length)
      ]
    const shoes =
      wardrobeItems.Shoes[
        Math.floor(Math.random() * wardrobeItems.Shoes.length)
      ]

    return [shirt, pants, shoes]
  }

  const handleGenerateOutfit = async () => {
    setIsLoading(true)
    try {
      const outfit = generateRandomOutfit()

      setRandomOutfit(outfit)

      const imageUrls = outfit
        .map((item) => item.picture)
        .filter((url): url is string => url !== null)
      const stackedImageBlob = await createStackedImage(imageUrls)

      if (stackedImageBlob) {
        const blobUrl = URL.createObjectURL(stackedImageBlob)

        setOutfitBlob(blobUrl)
        setIsModalOpen(true)
      } else {
        toast.error('Failed to generate outfit image')
      }
    } catch (error) {
      console.error('Error generating outfit:', error)
      toast.error('Failed to generate random outfit')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveOutfit = async () => {
    if (!randomOutfit || !outfitBlob) return

    setIsLoading(true)
    try {
      const response = await fetch(outfitBlob)
      const blob = await response.blob()

      const success = await createOutfit(randomOutfit, blob, 'CASUAL')

      if (success) {
        onOutfitSaved()
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error('Error saving outfit:', error)
      toast.error('Failed to save the outfit. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button onClick={handleGenerateOutfit} disabled={isLoading}>
        <Shuffle className="w-4 h-4 mr-2" /> Generate Random Outfit
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Discard
            </Button>
            <Button onClick={handleSaveOutfit} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Outfit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
