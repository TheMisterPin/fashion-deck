'use client'

import React, { useState } from 'react';
import AddOutfitModal from '../../_components/modals/add-outfit-modal';

export default function YourPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);

  const addOutfitToList = (outfit: Outfit) => {
    setOutfits((prevOutfits) => [...prevOutfits, outfit]);
  };

  return (
    <div>
      {/* Other components */}
      <AddOutfitModal addOutfit={addOutfitToList} />
      {/* Display the list of outfits */}
      {outfits.map((outfit) => (
        <div key={outfit.id}>
          <h3>Outfit {outfit.id}</h3>
          {/* Render outfit details */}
        </div>
      ))}
    </div>
  );
}
