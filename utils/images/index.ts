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

export type OutfitPreviewLayout = 'stack' | 'fan' | 'spread'

type ImagePlacement = {
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

const CANVAS_SIZE = 600
const ITEM_SIZE = 330

export const getOutfitPreviewLayout = (seed: number): OutfitPreviewLayout => {
  const layouts: OutfitPreviewLayout[] = ['stack', 'fan', 'spread']

  return layouts[Math.abs(seed) % layouts.length]
}

const getPlacements = (
  count: number,
  layout: OutfitPreviewLayout
): ImagePlacement[] => {
  const center = CANVAS_SIZE / 2

  if (count === 1) {
    return [
      {
        x: center,
        y: center,
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        rotation: 0
      }
    ]
  }

  return Array.from({ length: count }, (_, index) => {
    const progress = count === 1 ? 0 : index / (count - 1) - 0.5

    if (layout === 'fan') {
      return {
        x: center + progress * 190,
        y: center + Math.abs(progress) * 55,
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        rotation: progress * 24
      }
    }

    if (layout === 'spread') {
      const columns = Math.min(count, 2)
      const row = Math.floor(index / columns)
      const column = index % columns

      return {
        x: count === 2 ? 205 + column * 190 : 205 + column * 190,
        y: count <= 2 ? center : 205 + row * 190,
        width: count <= 2 ? 300 : 270,
        height: count <= 2 ? 300 : 270,
        rotation: index % 2 === 0 ? -4 : 4
      }
    }

    return {
      x: center + progress * 115,
      y: center + progress * 70,
      width: ITEM_SIZE,
      height: ITEM_SIZE,
      rotation: progress * 10
    }
  })
}

const loadImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image()

    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Unable to load image: ${url}`))
    image.src = url
  })

const drawContainedImage = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  placement: ImagePlacement
) => {
  const scale = Math.min(
    placement.width / image.naturalWidth,
    placement.height / image.naturalHeight
  )
  const width = image.naturalWidth * scale
  const height = image.naturalHeight * scale

  context.save()
  context.translate(placement.x, placement.y)
  context.rotate((placement.rotation * Math.PI) / 180)
  context.drawImage(image, -width / 2, -height / 2, width, height)
  context.restore()
}

export const createStackedImage = async (
  imageUrls: string[],
  layout: OutfitPreviewLayout = 'stack'
): Promise<Blob | null> => {
  const validImageUrls = imageUrls.filter(Boolean)

  if (validImageUrls.length === 0) return null

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) return null

  canvas.width = CANVAS_SIZE
  canvas.height = CANVAS_SIZE

  try {
    const images = await Promise.all(validImageUrls.map(loadImage))
    const placements = getPlacements(images.length, layout)

    images.forEach((image, index) => {
      drawContainedImage(ctx, image, placements[index])
    })

    return new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png')
    )
  } catch (error) {
    console.error('Error creating stacked image:', error)

    return null
  }
}
