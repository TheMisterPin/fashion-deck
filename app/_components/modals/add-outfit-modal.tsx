// components/AddOutfitModal.tsx
// components/AddOutfitModal.tsx

import React, { useState } from 'react'

import Modal from '@/components/ui/modal'
import OutfitForm from '../forms/outfit-form'

export default function AddOutfitModal() {
  const [isOpen, setIsOpen] = useState(false)
  const handleFormSubmit = () => {
    setIsOpen(false)
  }
  return (
    <Modal
      description="Create a new outfit."
      title="Add New Outfit"
      triggerText="Add New Outfit"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <OutfitForm onSubmitSuccess={handleFormSubmit} />
    </Modal>
  )
}
