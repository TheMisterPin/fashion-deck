// components/OutfitForm.tsx

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from 'axios';


type OutfitFormProps = {
  onSubmitSuccess: () => void;
};

export default function OutfitForm({ onSubmitSuccess }: OutfitFormProps) {
  const [wardrobeItems, setWardrobeItems] = useState<ClothingItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  // const [outfits, setOutfits] = useState<Outfit[]>([])
  const [loading, setLoading] = useState(false);

  // Fetch wardrobe items
  useEffect(() => {
    const fetchWardrobeItems = async () => {
      try {
        const response = await axios.get('/api/wardrobe');
        setWardrobeItems(response.data.items);
      } catch (error) {
        console.error('Error fetching wardrobe items:', error);
      }
    };

    fetchWardrobeItems();
  }, []);

  // Handle item selection
  const handleSelect = (item: ClothingItem) => {
    setSelectedItems((prev) => {
      // Remove any previously selected item of the same type
      const filtered = prev.filter((i) => i.type !== item.type);
      return [...filtered, item];
    });
  };

  // Handle form submission
  const onSubmit = async () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one clothing item');
      return;
    }

    setLoading(true);
    try {
      // Prepare data
      const outfitData = {
        outfitParts: selectedItems.map((item) => item.id),
        picture: null, // No picture for now
        preview: selectedItems.map((item) => item.picture), // Use pictures of selected items
      };

      // Send POST request to the endpoint
      const response = await axios.post('/api/outfits', outfitData);

      if (response.status === 201) {
        // Success
        onSubmitSuccess();
      } else {
        throw new Error('Failed to create outfit');
      }
    } catch (error) {
      console.error('Error creating outfit:', error);
      alert('Failed to create the outfit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Swiper component
  const Swiper = ({ items, type }: { items: ClothingItem[]; type: string }) => (
    <div className="flex overflow-x-auto space-x-4 p-4 bg-gray-100 rounded-lg">
      {items
        .filter((item) => item.type === type)
        .map((item) => (
          <div
            key={item.id}
            className={`flex-shrink-0 w-24 h-24 rounded cursor-pointer border ${
              selectedItems.some((selectedItem) => selectedItem.id === item.id)
                ? 'border-blue-500'
                : 'border-transparent'
            }`}
            style={{
              backgroundImage: `url(${item.picture})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onClick={() => handleSelect(item)}
          >
            <span className="sr-only">{`${item.name} (${item.color} ${item.type})`}</span>
          </div>
        ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <Label>Select Items:</Label>
      <Swiper items={wardrobeItems} type="SHIRT" />
      <Swiper items={wardrobeItems} type="PANT" />
      <Swiper items={wardrobeItems} type="SHOE" />
      <Button
        className="mt-6 w-full"
        onClick={onSubmit}
        disabled={loading || selectedItems.length === 0}
      >
        {loading ? 'Creating Outfit...' : 'Add Outfit'}
      </Button>
    </div>
  );
}
