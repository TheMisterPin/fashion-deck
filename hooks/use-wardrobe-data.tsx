'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import axios from 'axios'

import { getUserOutfits } from '@/app/controllers/outfits'

export function useWardrobeData() {
  const [wardrobeItems, setWardrobeItems] = useState<ResponseWardrobe | null>(null)
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadItemsData = useCallback(async () => {
    try {
      const response = await fetch('/api/wardrobe')

      if (response.status === 404) {
        setWardrobeItems({ Shirt: [], Pants: [], Shoes: [], Jumper: [] })
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch wardrobe items')
      }

      const result: ApiResponse = await response.json()
      setWardrobeItems(result.data)
    } catch (error) {
      toast.error('Failed to load wardrobe items')
    }
  }, [])

  const loadOutfitData = useCallback(async () => {
    try {
      const fetchedOutfits = await getUserOutfits()
      setOutfits(fetchedOutfits ?? [])
    } catch (error) {
      console.error('Error fetching outfits:', error)
      toast.error('Failed to fetch outfits')
    }
  }, [])

  useEffect(() => {
    // Older releases stored private data under keys shared by all accounts.
    localStorage.removeItem('wardrobeItems')
    localStorage.removeItem('outfitItems')

    let active = true

    async function initialize() {
      try {
        await axios.post('/api/users/login')
        if (active) {
          await Promise.all([loadItemsData(), loadOutfitData()])
        }
      } catch (error) {
        toast.error('Failed to initialize your wardrobe')
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void initialize()

    return () => {
      active = false
    }
  }, [loadItemsData, loadOutfitData])

  const refreshItemsData = useCallback(() => {
    return loadItemsData()
  }, [loadItemsData])

  const refreshOutfitData = useCallback(() => {
    return loadOutfitData()
  }, [loadOutfitData])

  const clearStorage = useCallback(() => {
    setWardrobeItems(null)
    setOutfits([])
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }, [])

  return {
    wardrobeItems,
    outfits,
    isLoading,
    refreshItemsData,
    refreshOutfitData,
    clearStorage
  }
}

export default useWardrobeData
