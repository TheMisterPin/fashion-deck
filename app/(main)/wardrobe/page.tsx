'use client'
import { useState } from 'react'
import AddItemModal from '@/app/_components/forms/add-item-modal'
import ItemList from '@/app/_components/lists/items-list'

type Item = {
  name: string
  type: 'top' | 'pants' | 'shoes'
  image: string
}

export default function ItemManager() {
  const [items, setItems] = useState<Item[]>([])

  const addItem = (item: Item) => {
    setItems([...items, item])
  }

  return (
    <div className="container mx-auto p-4">
      <AddItemModal addItem={addItem} />
      <ItemList items={items} />
    </div>
  )
}
