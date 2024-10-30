import React from 'react'
import Image from 'next/image'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

type ClothingItemSelectorProps = {
  items: ResponseClothingItem[]
  onSelect: (item: ResponseClothingItem) => void
  onClose: () => void
}

export default function ClothingItemSelector({
  items,
  onSelect,
  onClose
}: ClothingItemSelectorProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select an Item</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="transition-opacity cursor-pointer hover:opacity-80"
              onClick={() => onSelect(item)}
            >
              <Image
                src={item.picture || ''}
                alt={item.name || 'No Image'}
                width={150}
                height={150}
                className="object-contain"
              />
              <p className="mt-2 text-center">{item.name}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
