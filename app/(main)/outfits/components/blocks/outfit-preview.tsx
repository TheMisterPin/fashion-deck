'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import {
  createStackedImage,
  getOutfitPreviewLayout,
  OutfitPreviewLayout
} from '@/utils/images'

type OutfitPreviewProps = {
  imageUrls: Array<string | null | undefined>
  alt: string
  className?: string
  fallbackUrl?: string | null
  layout?: OutfitPreviewLayout
  seed?: number
}

export default function OutfitPreview({
  imageUrls,
  alt,
  className = '',
  fallbackUrl,
  layout,
  seed = 0
}: OutfitPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const imageKey = imageUrls.filter(Boolean).join('|')

  useEffect(() => {
    let active = true
    let objectUrl: string | null = null

    const generatePreview = async () => {
      const urls = imageUrls.filter((url): url is string => Boolean(url))

      if (urls.length === 0) return

      const blob = await createStackedImage(
        urls,
        layout ?? getOutfitPreviewLayout(seed)
      )

      if (blob && active) {
        objectUrl = URL.createObjectURL(blob)
        setPreviewUrl(objectUrl)
      }
    }

    setPreviewUrl(null)
    generatePreview()

    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
    // imageKey captures the image list without retriggering for a new array instance.
  }, [imageKey, layout, seed])

  const source = previewUrl || fallbackUrl

  if (!source) {
    return (
      <div
        className={`flex items-center justify-center bg-muted text-muted-foreground ${className}`}
      >
        No Image
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image src={source} alt={alt} fill className="object-contain" />
    </div>
  )
}
