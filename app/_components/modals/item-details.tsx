import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

interface Props {
  isOpen: boolean
  onClose: () => void
  itemId: number | null
}

export default function ItemDetails({ isOpen, onClose, itemId }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Item Details</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p>
            This is the modal for the component with ID:
            {itemId}
          </p>
          {/* Add more details here when you have the actual item data */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
