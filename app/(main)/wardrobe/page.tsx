'use client'
import { useEffect, useState } from 'react'
import AddItemModal from '@/app/_components/forms/add-item-modal'
import ItemList from '@/app/_components/lists/items-list'
import axios from 'axios'
import { cerateNewClothigItem } from '@/app/controllers/clothing'


const login = async () => {
  const response = await axios.post('/api/users/login')
  const user = await response.data 
  return user
}
const addItem = async (item: Item) => {
   await cerateNewClothigItem({item})
  
}

export default function ItemManager() {
  const [wardrobe, setWardobe] = useState<ClothingItem[]>([])
  
  useEffect(() => {
  login()
    .then(user => {
      setWardobe(user.wardrobe)
    })
    .catch(error => {
      console.error('Error:', error)
    })
  }, [])
  

  return (
    <div className="container mx-auto p-4">
      <AddItemModal addItem={addItem} />
    {
      wardrobe && <ItemList items={wardrobe} />
    }
   
    </div>
  )
}
