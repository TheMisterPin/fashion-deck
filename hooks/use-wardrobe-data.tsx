'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'
import axios from 'axios'

import { getUserOutfits } from '@/app/controllers/outfits'

export function useWardrobeData() {
  const { isSignedIn, isLoaded } = useAuth()
  const [wardrobeItems, setWardrobeItems] = useState<ResponseWardrobe | null>(
    null
  )
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axios.post('/api/users/login')

      if (response.status === 200) {
        toast.success('Logged in successfully')
        await Promise.all([loadItemsData(), loadOutfitData()])
      }
    } catch (error) {
      toast.error('Login failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadItemsData = useCallback(async () => {
    const storedWardrobe = localStorage.getItem('wardrobeItems')

    if (storedWardrobe) {
      setWardrobeItems(JSON.parse(storedWardrobe))

      return
    }

    try {
      const response = await fetch('/api/wardrobe')

      if (!response.ok) {
        throw new Error('Failed to fetch wardrobe items')
      }
      const result: ApiResponse = await response.json()

      setWardrobeItems(result.data)
      toast.success(result.message)
      localStorage.setItem('wardrobeItems', JSON.stringify(result.data))
    } catch (error) {
      toast.error('Failed to load wardrobe items')
    }
  }, [])

  const loadOutfitData = useCallback(async () => {
    const storedOutfits = localStorage.getItem('outfitItems')

    if (storedOutfits && storedOutfits !== '[]') {
      setOutfits(JSON.parse(storedOutfits))

      return
    }

    try {
      const fetchedOutfits = await getUserOutfits()

      setOutfits(fetchedOutfits)
      localStorage.setItem('outfitItems', JSON.stringify(fetchedOutfits))
    } catch (error) {
      console.error('Error fetching outfits:', error)
      toast.error('Failed to fetch outfits')
    }
  }, [])

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        Promise.all([loadItemsData(), loadOutfitData()]).finally(() =>
          setIsLoading(false)
        )
      } else {
        login()
      }
    }
  }, [isLoaded, isSignedIn, login, loadItemsData, loadOutfitData])

  const refreshItemsData = useCallback(() => {
    localStorage.removeItem('wardrobeItems')
    loadItemsData()
  }, [loadItemsData])

  const refreshOutfitData = useCallback(() => {
    localStorage.removeItem('outfitItems')
    loadOutfitData()
  }, [loadOutfitData])

  return {
    wardrobeItems,
    outfits,
    isLoading,
    refreshItemsData,
    refreshOutfitData
  }
}
