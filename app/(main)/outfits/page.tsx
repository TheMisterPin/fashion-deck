'use client'

import { motion } from 'framer-motion'

import { AddOutfitModal, RandomOutfitGenerator, OutfitTab } from './components'
import { useWardrobeContext } from '@/context/wardrobe-context'
import Loader from '@/components/loaders/loader'

export default function OutfitPage() {
  const { isLoading, outfits, wardrobeItems, refreshOutfitData } =
    useWardrobeContext()

  const handleOutfitSaved = () => {
    refreshOutfitData()
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8"
      >
        <h1 className="mb-4 text-4xl font-bold text-center text-stone-800">
          Your Outfits
        </h1>
        <div className="flex justify-center mb-4 space-x-2">
          <AddOutfitModal />
          {wardrobeItems && (
            <RandomOutfitGenerator
              wardrobeItems={wardrobeItems}
              onOutfitSaved={handleOutfitSaved}
            />
          )}
        </div>
      </motion.div>

      <div className="flex-grow overflow-hidden">
        {isLoading ? (
          <Loader />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full px-4 pb-8 overflow-y-auto"
          >
            {outfits && <OutfitTab outfits={outfits} />}
          </motion.div>
        )}
      </div>
    </div>
  )
}
