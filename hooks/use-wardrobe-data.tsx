'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'
import axios from 'axios'

import { getUserOutfits } from '@/app/controllers/outfits'
import useLocalStorage from './useLocalStorage'

export function useWardrobeData() {
  const { isSignedIn, isLoaded } = useAuth()
  const [wardrobeItems, setWardrobeItems] =
    useLocalStorage<ResponseWardrobe | null>('wardrobeItems', null)
  const [outfits, setOutfits] = useLocalStorage<Outfit[]>('outfitItems', [])
  const [isLoading, setIsLoading] = useState(false)

  const loadItemsData = useCallback(async () => {
    if (wardrobeItems) {
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
    } catch (error) {
      toast.error('Failed to load wardrobe items')
    }
  }, [wardrobeItems, setWardrobeItems])

  const loadOutfitData = useCallback(async () => {
    if (outfits.length > 0) {
      return
    }

    try {
      const fetchedOutfits = await getUserOutfits()

      setOutfits(fetchedOutfits)
    } catch (error) {
      console.error('Error fetching outfits:', error)
      toast.error('Failed to fetch outfits')
    }
  }, [outfits, setOutfits])

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
  }, [loadItemsData, loadOutfitData])

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        setIsLoading(true)
        Promise.all([loadItemsData(), loadOutfitData()]).finally(() =>
          setIsLoading(false)
        )
      } else {
        login()
      }
    }
  }, [])

  const refreshItemsData = useCallback(() => {
    setWardrobeItems(null)
    loadItemsData()
  }, [setWardrobeItems, loadItemsData])

  const refreshOutfitData = useCallback(() => {
    setOutfits([])
    loadOutfitData()
  }, [setOutfits, loadOutfitData])

  const clearStorage = useCallback(() => {
    setWardrobeItems(null)
    setOutfits([])
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }, [setWardrobeItems, setOutfits])

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
