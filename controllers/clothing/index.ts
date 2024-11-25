import axios from 'axios'

export async function createNewClothingItem({ item }: { item: Item }) {
  try {
    await axios.post('/api/clothing', item)
  } catch (error) {
    console.error('Error:', error)
  }
}

export const deleteClothingItem = async (id: number) => {
  await axios.delete(`/api/clothing/delete/${id}`)
}
