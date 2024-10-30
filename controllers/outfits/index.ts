/* eslint-disable consistent-return */
import axios from 'axios'
import { toast } from 'sonner'


export async function getUserOutfits() {
  const response = await axios.get('/api/outfits')
  if (response.status === 200) {
    const { outfits } = response.data
    toast.success('Outfits retrieved')
    return outfits
  }
}

export async function deleteOuftit(id : number) {
  const stringid = id.toString()
  const response = await axios.delete(`/api/outfits/${stringid}`)
  if (response.status === 200) {
    toast.success('Outfit deleted')
  }
}
