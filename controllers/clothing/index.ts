import axios from 'axios';

export async function cerateNewClothigItem({ item } :{ item : Item }) {
  try {
    await axios.post('/api/clothing', item)
  } catch (error) {
    console.error('Error:', error)
  }
}
