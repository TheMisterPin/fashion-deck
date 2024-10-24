'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shirt, Layers } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-100">
      <main className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 className="mb-12 text-4xl font-bold text-center text-stone-800">
          Welcome to Your Fashion Deck
        </h1>
        <div className="grid gap-8 md:grid-cols-2">
          <Link href="/wardrobe">
            <motion.div
              className="p-6 transition-shadow bg-white rounded-lg shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Shirt className="w-12 h-12 mb-4 text-stone-700" />
              <h2 className="mb-2 text-2xl font-semibold text-stone-800">Your Wardrobe</h2>
              <p className="text-stone-600">
                Explore and manage your clothing items. Add new pieces, categorize, and keep your wardrobe organized.
              </p>
            </motion.div>
          </Link>
          <Link href="/outfits">
            <motion.div
              className="p-6 transition-shadow bg-white rounded-lg shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Layers className="w-12 h-12 mb-4 text-stone-700" />
              <h2 className="mb-2 text-2xl font-semibold text-stone-800">Your Outfits</h2>
              <p className="text-stone-600">
                Create and browse your outfit combinations. Mix and match items to plan your perfect look.
              </p>
            </motion.div>
          </Link>
        </div>
      </main>
    </div>
  )
}
