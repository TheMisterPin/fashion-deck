import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

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
import { createNewClothingItem } from '@/controllers/clothing'
import { uploadDirectly } from '@/utils/images'
import { useWardrobeContext } from '@/context/wardrobe-context'

type AddItemModalProps = {
  onAdd: () => void
}

export default function AddItemModal({ onAdd }: AddItemModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { handleSubmit, control } = useForm<ItemForm>()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('Step1')
  const { refreshItemsData } = useWardrobeContext()

  const onSubmit = async (data: ItemForm) => {
    if (!file) {
      alert('Please select an image file')

      return
    }

    setLoading(true)
    setStatus('Uploading image...')

    try {
      const imageUrl = await uploadDirectly(file)

      setStatus('Creating item...')

      const newItem = {
        type: data.type,
        image: imageUrl,
        description: data.description,
        color: data.color
      }

      await createNewClothingItem({ item: newItem })
      onAdd()
      setFile(null)
      refreshItemsData()
      setStatus('complete')
      setLoading(false)
      setTimeout(() => {
        setIsOpen(false)
      }, 700)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload the image. Please try again.')

      setLoading(false)
    }
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
                  defaultValue=""
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
                {loading ? 'Uploading...' : 'Add Item'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
