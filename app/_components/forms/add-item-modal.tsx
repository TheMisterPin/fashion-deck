// AddItemModal.tsx

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import axios from 'axios'

type Item = {
  name: string
  type: 'top' | 'pants' | 'shoes'
  image: string
}

type ItemForm = {
  name: string
  type: 'top' | 'pants' | 'shoes'
}

type AddItemModalProps = {
  addItem: (item: Item) => void
}

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY as string
const PHOTOROOM_API_KEY = process.env.NEXT_PUBLIC_PHOTOROOOM_API_KEY as string

export default function AddItemModal({ addItem }: AddItemModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { register, handleSubmit, control, reset } = useForm<ItemForm>()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: ItemForm) => {
    if (!file) {
      alert('Please select an image file')
      return
    }

    setLoading(true)
    try {
      // Step 1: Remove background using PhotoRoom API
      const processedImageBlob = await removeBackground(file)

      // Step 2: Upload the processed image to ImgBB
      const imageUrl = await uploadToImgbb(processedImageBlob)

      // Step 3: Add the new item with the image URL
      const newItem: Item = { ...data, image: imageUrl }
      addItem(newItem)
      setIsOpen(false)
      reset()
      setFile(null)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Failed to process the image. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const removeBackground = async (file: File): Promise<Blob> => {
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
    return outputBlob
  }

  const uploadToImgbb = async (imageBlob: Blob): Promise<string> => {
    const formData = new FormData()
    // Convert Blob to File to set a filename (optional)
    const processedFile = new File([imageBlob], 'processed_image.png', { type: 'image/png' })
    formData.append('image', processedFile)
    formData.append('key', IMGBB_API_KEY)

    const response = await axios.post(`https://api.imgbb.com/1/upload?expiration=15552000&key=${IMGBB_API_KEY}`, formData)
    if (response.data.status !== 200) {
      throw new Error('Failed to upload image to ImgBB')
    }
    const imageUrl = response.data.data.url
    return imageUrl
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add New Item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name', { required: true })} />
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0])
                }
              }}
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Controller
              name="type"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="pants">Pants</SelectItem>
                    <SelectItem value="shoes">Shoes</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Add Item'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
