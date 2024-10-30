'use client'

import { motion } from 'framer-motion'

import AddItemModal from '@/app/_components/forms/add-item-modal'
import ItemList from '@/app/_components/lists/items-list'
import { useWardrobeContext } from '@/context/wardrobe-context'
import Loader from '@/app/_components/loaders/loader'

export default function WardrobePage() {
  const { wardrobeItems, refreshItemsData, isLoading } = useWardrobeContext()
  const onAdd = () => {
    refreshItemsData()
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
          Your Wardrobe
        </h1>
        <div className="flex justify-center mb-4">
          <AddItemModal onAdd={onAdd} />
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
            {wardrobeItems && <ItemList items={wardrobeItems} />}
          </motion.div>
        )}
      </div>
    </div>
  )
}
