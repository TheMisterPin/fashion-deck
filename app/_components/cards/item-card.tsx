import { motion } from 'framer-motion'
import {
  MoreVertical, Trash2, Edit2, Star,
} from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Props {
  item: ClothingItem
  onOpenDetails: (id: number) => void
}

export default function ItemCard({ item, onOpenDetails }: Props) {
  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        className="transition-shadow duration-300 border shadow-md border-stone-200 hover:shadow-lg"
        onClick={() => onOpenDetails(item.id)}
      >
        <CardContent className="flex items-center p-4 space-x-4">
          <Image
            src={item.picture || ''}
            alt={item.name || 'Clothing item'}
            width={100}
            height={100}
            className="object-cover w-24 h-24 rounded-md bg-stone-100"
          />
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-stone-800">
              {item.name}
            </h3>
            <p className="text-sm text-stone-600">
              {item.type}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 transition-colors duration-200 rounded-full hover:bg-stone-100">
                <MoreVertical className="w-5 h-5 text-stone-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit2 className="w-4 h-4 mr-2" />
                {' '}
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Star className="w-4 h-4 mr-2" />
                {' '}
                Favorite
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                {' '}
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>
    </motion.div>
  )
}
