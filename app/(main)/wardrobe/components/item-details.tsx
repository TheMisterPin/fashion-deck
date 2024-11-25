import Image from 'next/image'
import React, { Dispatch, SetStateAction, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import EditItemModal from './edit-item-modal'
import { useWardrobeContext } from '@/context/wardrobe-context'

interface Props {
  item: ResponseClothingItem
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

const ImageModal = ({
  src,
  alt,
  isOpen,
  onClose
}: {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>{alt}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-square w-full">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 90vw, 768px"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function ItemDetails(props: Props) {
  const { item, open: isDialogOpen, onOpenChange } = props
  const { refreshItemsData } = useWardrobeContext()
  const [zoomImage, setZoomImage] = useState<{
    src: string
    alt: string
  } | null>(null)

  const handleImageClick = (src: string, alt: string) => {
    setZoomImage({ src, alt })
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{item.description}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-[1fr_2fr] gap-4">
            <div>
              {item.picture && (
                <Image
                  src={item.picture}
                  alt={item.name}
                  width={150}
                  height={150}
                  className="object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleImageClick(item.picture!, item.name)}
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
            <div>
              <EditItemModal
                item={item}
                onEdit={() => {
                  refreshItemsData()
                }}
              />
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
                      className="object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() =>
                        handleImageClick(outfit.picture!, `Outfit ${outfit.id}`)
                      }
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
                      className="object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() =>
                        handleImageClick(wornItem.picture!, wornItem.name)
                      }
                    />
                  )}
                  <p className="mt-1 text-xs">{wornItem.name}</p>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {zoomImage && (
        <ImageModal
          src={zoomImage.src}
          alt={zoomImage.alt}
          isOpen={!!zoomImage}
          onClose={() => setZoomImage(null)}
        />
      )}
    </>
  )
}
