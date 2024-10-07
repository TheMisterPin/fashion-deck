/* eslint-disable @typescript-eslint/no-explicit-any */
// components/OutfitForm.tsx

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';

type ClothingItem = {
  id: number;
  name: string;
  type: string;
  color: string;
  picture: string;
  // ...other fields
};

type OutfitFormInputs = {
  outfitParts: number[]; // IDs of selected clothing items
  // We handle images separately
};

type OutfitFormProps = {
  onSubmitSuccess: (newOutfit: any) => void;
};

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY as string;

export default function OutfitForm({ onSubmitSuccess }: OutfitFormProps) {
  const { handleSubmit } = useForm<OutfitFormInputs>();
  const [wardrobeItems, setWardrobeItems] = useState<ClothingItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
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

  // Handle form submission
  const onSubmit = async () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one clothing item');
      return;
    }

    setLoading(true);
    try {
      // Upload picture if provided
      let pictureUrl = '';
      if (pictureFile) {
        pictureUrl = await uploadToImgbb(pictureFile);
      }

      // Upload preview images if provided
      const previewUrls: string[] = [];
      for (const file of previewFiles) {
        const url = await uploadToImgbb(file);
        previewUrls.push(url);
      }

      // Prepare data
      const outfitData = {
        outfitParts: selectedItems,
        picture: pictureUrl || null,
        preview: previewUrls.length > 0 ? previewUrls : null,
      };

      // Send POST request to the endpoint
      const response = await axios.post('/api/outfits', outfitData);

      if (response.status === 201) {
        // Success
        onSubmitSuccess(response.data.outfit);
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

  // Handle item selection
  const handleItemSelection = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  // Upload images to ImgBB
  const uploadToImgbb = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', IMGBB_API_KEY);

    const response = await axios.post(`https://api.imgbb.com/1/upload`, formData);
    if (response.status !== 200) {
      throw new Error('Failed to upload image to ImgBB');
    }
    return response.data.data.url;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Clothing Items Selection */}
      <div>
        <Label>Select Clothing Items:</Label>
        <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto">
          {wardrobeItems.map((item) => (
            <div key={item.id} className="flex items-center">
              <input
                type="checkbox"
                id={`item-${item.id}`}
                checked={selectedItems.includes(item.id)}
                onChange={() => handleItemSelection(item.id)}
              />
              <Label htmlFor={`item-${item.id}`} className="ml-2">
                {item.name} ({item.type})
              </Label>
            </div>
          ))}
        </div>
      </div>
      {/* Picture Upload */}
      <div>
        <Label htmlFor="picture">Picture</Label>
        <Input
          id="picture"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setPictureFile(e.target.files[0]);
            }
          }}
        />
      </div>
      {/* Preview Images Upload */}
      <div>
        <Label htmlFor="preview">Preview Images</Label>
        <Input
          id="preview"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setPreviewFiles(Array.from(e.target.files));
            }
          }}
        />
      </div>
      {/* Submit Button */}
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating Outfit...' : 'Create Outfit'}
      </Button>
    </form>
  );
}
