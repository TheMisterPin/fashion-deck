// components/Swiper.tsx

import React from 'react'

type ClothingItem = {
  id: number
  picture: string
  type: ClothingType
  color: Color
  name: string
};

type SwiperProps = {
  items: ClothingItem[]
  onSelect: (item: ClothingItem) => void
  selectedItems: ClothingItem[]
};

const Swiper: React.FC<SwiperProps> = ({ items, onSelect, selectedItems }) => {
  console.log('selectedItems', items)
  return (
    <div className="flex overflow-x-auto space-x-4 p-4 bg-gray-100 rounded-lg">
      {items.map((item) => (
        <div
          key={item.id}
          className={`flex-shrink-0 w-24 h-24 rounded cursor-pointer border ${
					  selectedItems.some((selectedItem) => selectedItem.id === item.id)
					    ? 'border-blue-500'
					    : 'border-transparent'
          }`}
          style={{
					  backgroundImage: `url(${item.picture})`,
					  backgroundSize: 'cover',
					  backgroundPosition: 'center',
          }}
          onClick={() => onSelect(item)}
        >
          <span className="sr-only">
            {`${item.name} (${item.color} ${item.type})`}
          </span>
        </div>
      ))}
    </div>
  )
}

export default Swiper
