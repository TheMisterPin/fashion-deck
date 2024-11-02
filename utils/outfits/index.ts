import axios from 'axios'

export const generateRandomOutfit = (
  wardrobeItems: ResponseWardrobe
): ResponseClothingItem[] => {
  const shirt =
    wardrobeItems.Shirt[Math.floor(Math.random() * wardrobeItems.Shirt.length)]
  const pants =
    wardrobeItems.Pants[Math.floor(Math.random() * wardrobeItems.Pants.length)]
  const shoes =
    wardrobeItems.Shoes[Math.floor(Math.random() * wardrobeItems.Shoes.length)]

  return [shirt, pants, shoes]
}

export const saveOutfit = async (
  randomOutfit: ResponseClothingItem[],
  outfitBlob: Blob
) => {
  const formData = new FormData()

  formData.append('image', outfitBlob, 'outfit.png')
  formData.append('key', process.env.NEXT_PUBLIC_IMGBB_API_KEY || '')

  const uploadResponse = await axios.post(
    'https://api.imgbb.com/1/upload',
    formData
  )
  const imageUrl = uploadResponse.data.data.url

  const outfitData = {
    outfitParts: randomOutfit.map((item) => item.id),
    picture: imageUrl,
    preview: randomOutfit.map((item) => item.picture)
  }

  await axios.post('/api/outfits', outfitData)
}
