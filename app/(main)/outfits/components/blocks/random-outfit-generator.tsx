'use client'

import React, { useEffect, useRef, useState } from 'react'
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
import { outfitKey, pickOutfit } from '@/utils/outfits/generator'

interface RandomOutfitGeneratorProps {
  wardrobeItems: ResponseWardrobe
  savedOutfits: Outfit[]
  onOutfitSaved: () => void
}

export default function RandomOutfitGenerator({
  wardrobeItems,
  savedOutfits,
  onOutfitSaved
}: RandomOutfitGeneratorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [randomOutfit, setRandomOutfit] = useState<
    ResponseClothingItem[] | null
  >(null)
  const [outfitBlob, setOutfitBlob] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const shownKeys = useRef(new Set<string>())
  const blobUrl = useRef<string | null>(null)

  useEffect(
    () => () => {
      if (blobUrl.current) URL.revokeObjectURL(blobUrl.current)
    },
    []
  )

  const closePreview = () => {
    setIsModalOpen(false)
    if (blobUrl.current) URL.revokeObjectURL(blobUrl.current)
    blobUrl.current = null
    setOutfitBlob(null)
  }

  const handleGenerateOutfit = async () => {
    setIsLoading(true)
    try {
      const items = Object.values(wardrobeItems).flat()
      const outfit = pickOutfit(items, savedOutfits, shownKeys.current)

      if (!outfit) {
        toast.info('No new outfits available. Add a shirt, pants, or shoes.')

        return
      }

      const imageUrls = outfit
        .map((item) => item.picture)
        .filter((url): url is string => url !== null)
      const stackedImageBlob = await createStackedImage(imageUrls)

      if (stackedImageBlob) {
        if (blobUrl.current) URL.revokeObjectURL(blobUrl.current)
        blobUrl.current = URL.createObjectURL(stackedImageBlob)

        setOutfitBlob(blobUrl.current)
        setRandomOutfit(outfit)
        shownKeys.current.add(outfitKey(outfit))
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
        closePreview()
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

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) closePreview()
          else setIsModalOpen(true)
        }}
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
            <Button variant="outline" onClick={closePreview}>
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
