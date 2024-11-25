/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
// src/types.d.ts

declare global {
  // Enums
  enum ClothingType {
    SHIRT = 'SHIRT',
    PANTS = 'PANTS',
    JACKET = 'JACKET',
    JUMPER = 'JUMPER',
    SHOES = 'SHOES',
    HOODIE = 'HOODIE'
  }

  enum Occasion {
    CASUAL = 'CASUAL',
    WORK = 'WORK',
    SPORT = 'SPORT',
    FORMAL = 'FORMAL'
  }

  enum Color {
    RED = 'RED',
    BLUE = 'BLUE',
    BROWN = 'BROWN',
    PINK = 'PINK',
    GREY = 'GREY',
    BEIGE = 'BEIGE',
    GREEN = 'GREEN',
    BLACK = 'BLACK',
    WHITE = 'WHITE',
    YELLOW = 'YELLOW'
  }

  enum Style {
    CASUAL = 'CASUAL',
    WORK = 'WORK',
    FORMAL = 'FORMAL'
  }

  // Models
  interface Outfit {
    id: number
    occasion: Occasion
    picture?: string | null
    preview: string[]
    timesWorn: number
    lastWorn?: Date | null
    isUsed: boolean
    isAvailable: boolean
    isWorn: boolean
    createdAt: Date
    updatedAt: Date
    items: OutfitItem[]
    userId?: string | null
    User?: User | null
  }

  interface OutfitItem {
    outfitId: number
    clothingItemId: number
    outfit: Outfit
    clothingItem: ClothingItem
  }

  interface ClothingItem {
    id: number
    type: ClothingType
    name?: string | null
    color?: Color | null
    picture?: string | null
    timesWorn: number
    lastWorn?: Date | null
    isFavorite: boolean
    isAvailable: boolean
    isDeleted: boolean
    createdAt: Date
    updatedAt: Date
    outfits: OutfitItem[]
    wardrobes: WardrobeItem[]
    favorites: FavoriteItem[]
    wornWith: WornWithItem[]
    wornBy: WornWithItem[]
  }

  interface WornWithItem {
    itemId: number
    wornWithItemId: number
    timesWornTogether: number
    item: ClothingItem
    wornWithItem: ClothingItem
  }

  interface User {
    id: number
    clerkId: string
    createdAt: Date
    updatedAt: Date
    outfits: Outfit[]
    wardrobe: WardrobeItem[]
    favorites: FavoriteItem[]
  }

  interface WardrobeItem {
    userId: string
    clothingItemId: number
    user: User
    isAvailable: ClothingItem['isAvailable']
    clothingItem: ClothingItem
  }

  interface FavoriteItem {
    userId: string
    clothingItemId: number
    user: User
    clothingItem: ClothingItem
  }

  type ItemForm = {
    type: 'SHIRT' | 'PANTS' | 'JACKET' | 'JUMPER' | 'SHOES'
    color:
      | 'RED'
      | 'BLUE'
      | 'BROWN'
      | 'BEIGE'
      | 'GREEN'
      | 'BLACK'
      | 'WHITE'
      | 'YELLOW'
      | 'GREY'
    description?: string
  }

  type Item = {
    type: 'SHIRT' | 'PANTS' | 'JACKET' | 'JUMPER' | 'SHOES'
    color:
      | 'RED'
      | 'BLUE'
      | 'BROWN'
      | 'BEIGE'
      | 'GREEN'
      | 'BLACK'
      | 'WHITE'
      | 'YELLOW'
      | 'GREY'
    image: string
    description?: string
  }

  type ResponseClothingItem = {
    id: number
    type: ClothingType
    name: string
    occasions: Occasion[]
    description: string | null
    color: Color | null
    picture: string | null
    timesWorn: number
    wornWith: {
      id: number
      type: ClothingType
      description: string | null
      occasions: Occasion[]
      name: string
      color: Color | null
      picture: string | null
    }[]
    outfits: {
      id: number
      picture: string | null
      occasion: Occasion | null
      timesWorn: number
      lastWorn: Date | null
    }[]
  }

  type ResponseWardrobe = {
    Jumper: ResponseClothingItem[]
    Pants: ResponseClothingItem[]
    Shirt: ResponseClothingItem[]
    Shoes: ResponseClothingItem[]
  }

  type ApiResponse = {
    message: string
    data: any
  }
}

export {}
