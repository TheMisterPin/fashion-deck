import { createContext, useContext } from 'react'

type WardrobeContextType = {
  wardrobeItems: ResponseWardrobe | null
  outfits: Outfit[] | null
  isLoading: boolean
  refreshItemsData: () => void
  refreshOutfitData: () => void
  clearStorage: () => void
}

export const WardrobeContext = createContext<WardrobeContextType | undefined>(
  undefined
)

export function useWardrobeContext() {
  const context = useContext(WardrobeContext)

  if (context === undefined) {
    throw new Error('useWardrobeContext must be used within a WardrobeProvider')
  }

  return context
}
