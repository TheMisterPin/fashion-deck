// components/AddOutfitModal.tsx
// components/AddOutfitModal.tsx

import React, { useEffect, useState } from 'react'
import Modal from '@/components/ui/modal'
import OutfitForm from '../forms/outfit-form'

export default function AddOutfitModal({ items } : { items : ResponseWardrobe }) {
  const [isOpen, setIsOpen] = useState(false)
  const handleFormSubmit = () => {
    setIsOpen(false)
  }
  useEffect(() => {
    console.log('items', items)
  }, [])
  return (
    <Modal
      description="Create a new outfit."
      title="Add New Outfit"
      triggerText="Add New Outfit"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <OutfitForm
        onSubmitSuccess={handleFormSubmit}
        wardrobeItems={items}
      />
    </Modal>
  )
}
