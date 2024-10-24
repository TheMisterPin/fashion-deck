import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ItemCard from '../cards/item-card'
import ItemDetails from '../modals/item-details'

type ItemListProps = {
  items: ClothingItem[]
};

const ITEMS_PER_PAGE = 5

export default function ItemList({ items }: ItemListProps) {
  const [visibleItems, setVisibleItems] = useState<ClothingItem[]>([])
  const [page, setPage] = useState(1)
  const [selectedItemId, setSelectedItemId] = useState<number | null>(0)

  useEffect(() => {
    setVisibleItems(items.slice(0, ITEMS_PER_PAGE * page))
  }, [items, page])

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1)
  }

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop
      === document.documentElement.offsetHeight
    ) {
      loadMore()
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleOpenDetails = (id: number) => {
    setSelectedItemId(id)
  }

  const handleCloseDetails = () => {
    setSelectedItemId(null)
  }

  if (items.length === 0) return <p>No items found.</p>

  return (
    <React.Fragment>
      <motion.div className="grid w-full max-w-2xl grid-cols-1 gap-4 mt-8">
        {visibleItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ItemCard
              item={item}
              onOpenDetails={handleOpenDetails}
            />
          </motion.div>
        ))}
      </motion.div>
      <ItemDetails
        isOpen={!!selectedItemId}
        onClose={handleCloseDetails}
        itemId={selectedItemId}
      />
    </React.Fragment>
  )
}
