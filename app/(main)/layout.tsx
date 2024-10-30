'use client'

import { useWardrobeData } from '@/hooks/use-wardrobe-data'
import { WardrobeContext } from '@/context/wardrobe-context'
import Loader from '../_components/loaders/loader'

export default function AuthenticatedLayout({
  children
}: {
  children: React.ReactNode
}) {
  const {
    wardrobeItems,
    isLoading,
    refreshItemsData,
    refreshOutfitData,
    outfits
  } = useWardrobeData()

  if (isLoading) {
    return <Loader />
  }

  return (
    <WardrobeContext.Provider
      value={{
        wardrobeItems,
        isLoading,
        refreshItemsData,
        refreshOutfitData,
        outfits
      }}
    >
      {children}
    </WardrobeContext.Provider>
  )
}