/* eslint-disable consistent-return */
import axios from 'axios'
import { toast } from 'sonner'

import { uploadToImgbb } from '@/utils/images'

export async function getUserOutfits() {
  const response = await axios.get('/api/outfits')

  if (response.status === 200) {
    const { outfits } = response.data

    toast.success('Outfits retrieved')

    return outfits
  }
}

export async function deleteOuftit(id: number) {
  const stringid = id.toString()
  const response = await axios.delete(`/api/outfits/${stringid}`)

  if (response.status === 200) {
    toast.success('Outfit deleted')
  }
}

export const createOutfit = async (
  selectedItems: ResponseClothingItem[],
  stackedImageBlob: Blob | null,
  occasion: string
): Promise<boolean> => {
  try {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one clothing item')

      return false
    }

    let pictureUrl = null

    if (stackedImageBlob) {
      try {
        pictureUrl = await uploadToImgbb(stackedImageBlob)
      } catch (error) {
        console.error('Failed to upload image:', error)
        toast.error('Failed to upload outfit image. Please try again.')

        return false
      }
    }

    const outfitData = {
      outfitParts: selectedItems.map((item) => item.id),
      picture: pictureUrl,
      preview: selectedItems.map((item) => item.picture),
      occasion: occasion
    }

    const response = await axios.post('/api/outfits', outfitData)

    if (response.status === 201) {
      toast.success('Outfit created successfully!')

      return true
    } else {
      toast.error('Failed to create outfit. Please try again.')

      return false
    }
  } catch (error) {
    console.error('Failed to create outfit:', error)
    if (axios.isAxiosError(error) && error.response) {
      // Handle specific API errors
      toast.error(
        `Failed to create outfit: ${error.response.data.message || 'Unknown error'}`
      )
    } else {
      toast.error('An unexpected error occurred. Please try again.')
    }

    return false
  }
}
