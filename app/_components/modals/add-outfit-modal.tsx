/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import Modal from '../../../components/ui/modal';
import OutfitForm from '../forms/outfit-form';


type AddOutfitModalProps = {
  addOutfit: (outfit: any) => void;
};

export default function AddOutfitModal({ addOutfit }: AddOutfitModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFormSubmit = (newOutfit: any) => {
    addOutfit(newOutfit);
    setIsOpen(false);
  };

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
  );
}
