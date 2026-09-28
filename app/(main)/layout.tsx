'use client'

import { useAuth } from '@clerk/nextjs'

import { useWardrobeData } from '@/hooks/use-wardrobe-data'
import { WardrobeContext } from '@/context/wardrobe-context'
import Loader from '../../components/loaders/loader'

export default function AuthenticatedLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { isLoaded, userId } = useAuth()

  if (!isLoaded || !userId) {
    return <Loader />
  }

  // Remount the data provider when the account changes in this browser.
  return <WardrobeSession key={userId}>{children}</WardrobeSession>
}

function WardrobeSession({ children }: { children: React.ReactNode }) {
  const {
    wardrobeItems,
    isLoading,
    refreshItemsData,
    refreshOutfitData,
    outfits,
    clearStorage
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
        outfits,
        clearStorage
      }}
    >
      {children}
    </WardrobeContext.Provider>
  )
}
