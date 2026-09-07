'use client'

import React, { useState, useEffect } from 'react'
import { Shirt } from 'lucide-react'
import { PiPants as Pants, PiHoodie as Sweater } from 'react-icons/pi'
import { GiConverseShoe as Shoe } from 'react-icons/gi'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import ClothingTypeSelector from './clothing-type-selector'
import ClothingItemSelector from './clothing-item-selector'
import { useWardrobeContext } from '@/context/wardrobe-context'
import { createStackedImage } from '@/utils/images'
import { createOutfit } from '@/controllers/outfits'
import OutfitPreview from './outfit-preview'

enum Occasion {
  CASUAL = 'CASUAL',
  WORK = 'WORK',
  FORMAL = 'FORMAL',
  SPORT = 'SPORT'
}

type OutfitFormProps = {
  onSubmitSuccess: () => void
}

export default function OutfitForm({ onSubmitSuccess }: OutfitFormProps) {
  const [selectedItems, setSelectedItems] = useState<ResponseClothingItem[]>([])
  const [loading, setLoading] = useState(false)
  const [activeSelector, setActiveSelector] = useState<string | null>(null)
  const [stackedImageBlob, setStackedImageBlob] = useState<Blob | null>(null)
  const [occasion, setOccasion] = useState<Occasion>(Occasion.CASUAL)
  const { wardrobeItems } = useWardrobeContext()

  const shirts = wardrobeItems?.Shirt
  const pants = wardrobeItems?.Pants
  const shoes = wardrobeItems?.Shoes
  const jumpers = wardrobeItems?.Jumper

  const handleSelect = (item: ResponseClothingItem) => {
    setSelectedItems((prev) => {
      const filtered = prev.filter((i) => i.type !== item.type)

      return [...filtered, item]
    })
    setActiveSelector(null)
  }

  useEffect(() => {
    const generateStackedImage = async () => {
      const imageUrls = selectedItems
        .map((item) => item.picture)
        .filter((url): url is string => url !== null)

      const blob = await createStackedImage(imageUrls)

      setStackedImageBlob(blob)
    }

    generateStackedImage()
  }, [selectedItems])

  const onSubmit = async () => {
    setLoading(true)
    try {
      const success = await createOutfit(
        selectedItems,
        stackedImageBlob,
        occasion
      )

      if (success) {
        onSubmitSuccess()
      }
    } finally {
      setLoading(false)
    }
  }

  const getSelectedItem = (type: string) =>
    selectedItems.find((item) => item.type === type)

  return (
    <div className="space-y-6">
      <Label>Select Items:</Label>
      <div className="flex justify-between">
        <ClothingTypeSelector
          icon={<Shirt size={24} />}
          label="Shirt"
          onClick={() => setActiveSelector('Shirt')}
          selected={!!getSelectedItem('SHIRT')}
        />
        <ClothingTypeSelector
          icon={<Pants size={24} />}
          label="Pants"
          onClick={() => setActiveSelector('Pants')}
          selected={!!getSelectedItem('PANTS')}
        />
        <ClothingTypeSelector
          icon={<Shoe size={24} />}
          label="Shoes"
          onClick={() => setActiveSelector('Shoes')}
          selected={!!getSelectedItem('SHOES')}
        />
        <ClothingTypeSelector
          icon={<Sweater size={24} />}
          label="Jumper"
          onClick={() => setActiveSelector('Jumper')}
          selected={!!getSelectedItem('JUMPER')}
        />
      </div>
      {activeSelector === 'Shirt' && shirts && (
        <ClothingItemSelector
          items={shirts}
          onSelect={handleSelect}
          onClose={() => setActiveSelector(null)}
        />
      )}
      {activeSelector === 'Pants' && pants && (
        <ClothingItemSelector
          items={pants}
          onSelect={handleSelect}
          onClose={() => setActiveSelector(null)}
        />
      )}
      {activeSelector === 'Shoes' && shoes && (
        <ClothingItemSelector
          items={shoes}
          onSelect={handleSelect}
          onClose={() => setActiveSelector(null)}
        />
      )}
      {activeSelector === 'Jumper' && jumpers && (
        <ClothingItemSelector
          items={jumpers}
          onSelect={handleSelect}
          onClose={() => setActiveSelector(null)}
        />
      )}
      <div className="mt-4">
        <h3 className="mb-2 font-semibold">Selected Items:</h3>
        <OutfitPreview
          imageUrls={selectedItems.map((item) => item.picture)}
          alt="Selected outfit preview"
          className="mx-auto h-64 w-64 rounded-md"
          layout="stack"
        />
      </div>

      <div className="mt-4">
        <Label htmlFor="occasion">Select Occasion:</Label>
        <Select
          value={occasion}
          onValueChange={(value) => setOccasion(value as Occasion)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an occasion" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Occasion).map((value) => (
              <SelectItem key={value} value={value}>
                {value.charAt(0) + value.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        className="w-full mt-6"
        onClick={onSubmit}
        disabled={loading || selectedItems.length === 0}
      >
        {loading ? 'Creating Outfit...' : 'Add Outfit'}
      </Button>
    </div>
  )
}
