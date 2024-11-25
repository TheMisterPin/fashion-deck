import { useState, useEffect } from 'react'
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
import ProgressiveLoader from '@/components/loaders/progressive-loader'
import { uploadDirectly } from '@/utils/images'
import { useWardrobeContext } from '@/context/wardrobe-context'

interface ItemForm {
  type: ClothingType
  description?: string
  color: Color
}

interface EditItemModalProps {
  item: ResponseClothingItem
  trigger?: React.ReactNode
  onEdit?: () => void
}

export default function EditItemModal({
  item,
  trigger,
  onEdit
}: EditItemModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { handleSubmit, control, reset } = useForm<ItemForm>({
    defaultValues: {
      type: item.type as ClothingType,
      description: item.description || '',
      color: item.color as Color
    }
  })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('Step1')
  const { refreshItemsData } = useWardrobeContext()

  useEffect(() => {
    reset({
      type: item.type as ClothingType,
      description: item.description || '',
      color: item.color as Color
    })
  }, [item, reset])

  const onSubmit = async (formData: ItemForm) => {
    setLoading(true)
    setStatus('Updating item...')

    try {
      let imageUrl = item.picture // Use existing image by default

      if (file) {
        setStatus('Uploading new image...')
        imageUrl = await uploadDirectly(file)
      }

      setStatus('Saving changes...')

      // Only include changed fields in the update
      const updateData: Partial<{
        type: ClothingType
        image: string | null
        description: string | null
        color: Color
      }> = {}

      if (formData.type !== item.type) {
        updateData.type = formData.type
      }

      if (imageUrl !== item.picture) {
        updateData.image = imageUrl
      }

      if (formData.description !== item.description) {
        updateData.description = formData.description || null
      }

      if (formData.color !== item.color) {
        updateData.color = formData.color
      }

      const response = await axios.patch(
        `/api/clothing/edit/${item.id}`,
        updateData
      )

      if (response.status !== 200) {
        throw new Error('Failed to update the item')
      }

      onEdit?.()
      setFile(null)
      refreshItemsData()
      setStatus('complete')
      setLoading(false)
      setTimeout(() => {
        setIsOpen(false)
      }, 700)
    } catch (error) {
      console.error('Error updating item:', error)
      alert('Failed to update the item. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Edit</Button>}
      </DialogTrigger>
      <DialogContent>
        {loading ? (
          <ProgressiveLoader status={status} />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="image">Image (Optional)</Label>
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
                {!file && item.picture && (
                  <p className="text-sm text-gray-500 mt-1">
                    Current image will be kept if no new image is selected
                  </p>
                )}
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
                        <SelectItem value="PANTS">Pants</SelectItem>
                        <SelectItem value="JACKET">Jacket</SelectItem>
                        <SelectItem value="JUMPER">Jumper</SelectItem>
                        <SelectItem value="SHOE">Shoes</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Controller
                  name="description"
                  control={control}
                  defaultValue={item.description || ''}
                  render={({ field }) => (
                    <Input
                      id="description"
                      type="text"
                      placeholder="Description"
                      {...field}
                    />
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
                        <SelectItem value="GREY">Grey</SelectItem>
                        <SelectItem value="WHITE">White</SelectItem>
                        <SelectItem value="YELLOW">Yellow</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
