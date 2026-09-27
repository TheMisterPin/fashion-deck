import axios from 'axios'
export { getOutfitCombinations, outfitKey, pickOutfit } from './generator'

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
