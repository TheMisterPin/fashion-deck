import axios from 'axios'

export async function getWardrobe() {
  const response = await axios.get('/api/wardrobe')
  if (response.status !== 200) {
    throw new Error('Failed to fetch wardrobe');
  }
  const userWardrobe = response.data
  const items = userWardrobe.map(
    (item: WardrobeItem) => item.clothingItem,
	);

  console.log(items)

}
