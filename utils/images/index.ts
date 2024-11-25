import axios from 'axios'

import { IMGBB_API_KEY, PHOTOROOM_API_KEY } from '@/constants'

export const removeBackground = async (file: File): Promise<Blob> => {
  const formData = new FormData()

  formData.append('image_file', file)

  const response = await fetch('https://sdk.photoroom.com/v1/segment', {
    method: 'POST',
    headers: {
      'x-api-key': PHOTOROOM_API_KEY
    },
    body: formData
  })

  const outputBlob = await response.blob()

  console.log('blob done!')

  return outputBlob
}

export const uploadToImgbb = async (imageBlob: Blob): Promise<string> => {
  const formData = new FormData()
  const processedFile = new File([imageBlob], 'processed_image.png', {
    type: 'image/png'
  })

  formData.append('image', processedFile)
  formData.append('key', IMGBB_API_KEY || '')

  const response = await axios.post(
    `https://api.imgbb.com/1/upload?expiration=15552000&key=${IMGBB_API_KEY}`,
    formData
  )

  if (response.data.status !== 200) {
    throw new Error('Failed to upload image to ImgBB')
  }
  const imageUrl = response.data.data.url

  return imageUrl
}

export const createStackedImage = async (
  imageUrls: string[]
): Promise<Blob | null> => {
  if (imageUrls.length === 0) return null

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) return null

  canvas.width = 300
  canvas.height = 400

  try {
    const images = await Promise.all(
      imageUrls.map(
        (url) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new window.Image()

            img.crossOrigin = 'anonymous'
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = url
          })
      )
    )

    images.forEach((img, index) => {
      const x = 50 * index
      const y = 50 * index

      ctx.drawImage(img, x, y, 200, 200)
    })

    return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve))
  } catch (error) {
    console.error('Error creating stacked image:', error)

    return null
  }
}

export const uploadDirectly = async (file: File): Promise<string> => {
  const formData = new FormData()

  formData.append('image', file)
  formData.append('key', IMGBB_API_KEY || '')

  const response = await axios.post(
    `https://api.imgbb.com/1/upload?expiration=15552000&key=${IMGBB_API_KEY}`,
    formData
  )

  if (response.data.status !== 200) {
    throw new Error('Failed to upload image to ImgBB')
  }
  const imageUrl = response.data.data.url

  return imageUrl
}
