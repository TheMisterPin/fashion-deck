// ItemList.tsx

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"

type Item = {
  name: string
  type: 'top' | 'pants' | 'shoes'
  image: string
}

type ItemListProps = {
  items: Item[]
}

export default function ItemList({ items }: ItemListProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-8">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <Image src={item.image} alt={item.name} width={300} height={100} className="w-full h-32 object-cover mb-2" />
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.type}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
