import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import ProgressiveLoader from '../loaders/progressive-loader'
import { createNewClothigItem } from '@/app/controllers/clothing'

type AddItemModalProps = {
  onAdd: () => void
}

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY as string
const PHOTOROOM_API_KEY = process.env.NEXT_PUBLIC_PHOTOROOOM_API_KEY as string

export default function AddItemModal({ onAdd }: AddItemModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { handleSubmit, control, reset } = useForm<ItemForm>()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('Step1')

  const onSubmit = async (data: ItemForm) => {
    if (!file) {
      alert('Please select an image file')

      return
    }

    setLoading(true)
    setStatus('Step1')

    try {
      const processedImageBlob = await removeBackground(file)

      setStatus('Step2')

      const imageUrl = await uploadToImgbb(processedImageBlob)

      setStatus('Step3')

      // Correctly structure the data for the API
      const newItem = {
        type: data.type,
        image: imageUrl, // This is the key change - ensure the image URL is passed
        color: data.color
      }

      await createNewClothigItem({ item: newItem })
      onAdd()
      setIsOpen(false)
      reset()
      setFile(null)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Failed to process the image. Please try again.')
    } finally {
      setStatus('complete')
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

    console.log('blob done!')

    return outputBlob
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add New Item</Button>
      </DialogTrigger>
      <DialogContent>
        {loading ? (
          <ProgressiveLoader status={status} />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SHIRT">Shirt</SelectItem>
                        <SelectItem value="PANT">Pants</SelectItem>
                        <SelectItem value="JACKET">Jacket</SelectItem>
                        <SelectItem value="JUMPER">Jumper</SelectItem>
                        <SelectItem value="SHOE">Shoes</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Controller
                  name="color"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RED">Red</SelectItem>
                        <SelectItem value="BLUE">Blue</SelectItem>
                        <SelectItem value="BROWN">Brown</SelectItem>
                        <SelectItem value="BEIGE">Beige</SelectItem>
                        <SelectItem value="GREEN">Green</SelectItem>
                        <SelectItem value="BLACK">Black</SelectItem>
                        <SelectItem value="GREY">Black</SelectItem>
                        <SelectItem value="WHITE">White</SelectItem>
                        <SelectItem value="YELLOW">Yellow</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Add Item'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
