'use client'

import { motion } from 'framer-motion'

import AddOutfitModal from '@/app/_components/modals/add-outfit-modal'
import RandomOutfitGenerator from '@/app/_components/misc/random-outfit-generator'
import { useWardrobeContext } from '@/context/wardrobe-context'
import Loader from '@/app/_components/loaders/loader'
import OutfitTab from '@/app/_components/lists/outfit-list'

export default function OutfitPage() {
  const { isLoading, outfits, wardrobeItems, refreshOutfitData } =
    useWardrobeContext()

  const handleOutfitSaved = () => {
    refreshOutfitData()
  }

  return (
    <div className="container p-4 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-stone-800">Your Outfits</h1>
        {wardrobeItems ? (
          <>
            <AddOutfitModal items={wardrobeItems} />
            <RandomOutfitGenerator
              wardrobeItems={wardrobeItems}
              onOutfitSaved={handleOutfitSaved}
            />
          </>
        ) : (
          <p className="text-stone-600">No Wardrobe Items</p>
        )}
      </div>
      {isLoading ? (
        <TriangleLoader />
      ) : outfits.length === 0 ? (
        <p className="text-center text-stone-600">
          No outfits found. Create your first outfit!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {outfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              onEdit={() => handleEdit(outfit.id)}
              onDelete={() => handleDelete(outfit.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
