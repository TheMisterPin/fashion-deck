import Image from 'next/image'
import React, { Dispatch, SetStateAction } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
interface Props {
  item: ResponseClothingItem
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

export default function ItemDetails(props: Props) {
  const { item, open: isDialogOpen, onOpenChange } = props

  return (
    <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
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
              <strong>Times Worn:</strong> {item.timesWorn}
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
  )
}
