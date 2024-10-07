// src/types.d.ts

// Ensure this is treated as a module by adding this statement
export {};

declare global {
  enum ClothingType {
    SHIRT = "SHIRT",
    PANT = "PANT",
    JACKET = "JACKET",
    JUMPER = "JUMPER",
    SHOE = "SHOE"
  }

  enum Color {
    RED = "RED",
    BLUE = "BLUE",
    BROWN = "BROWN",
    BEIGE = "BEIGE",
    GREEN = "GREEN",
    BLACK = "BLACK",
    WHITE = "WHITE",
    YELLOW = "YELLOW"
  }

  enum Style {
    CASUAL = "CASUAL",
    WORK = "WORK",
    FORMAL = "FORMAL"
  }

  interface Outfit {
    id: number;
    picture?: string;
    timesWorn: number;
    isUsed: boolean;
    isAvailable: boolean;
    isWorn: boolean;
    createdAt: Date;
    updatedAt: Date;
    items: OutfitItem[];
  }

  interface OutfitItem {
    outfitId: number;
    clothingItemId: number;
    outfit: Outfit;
    clothingItem: ClothingItem;
  }

  interface ClothingItem {
    id: number;
    type: ClothingType;
    name?: string;
    color?: Color;
    picture?: string;
    timesWorn: number;
    lastWorn?: Date;
    isFavorite: boolean;
    isAvailable: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    outfits: OutfitItem[];
    wardrobes: WardrobeItem[];
    favorites: FavoriteItem[];
    wornWith: WornWithItem[];
    wornBy: WornWithItem[];
  }

  interface WornWithItem {
    itemId: number;
    wornWithItemId: number;
    item: ClothingItem;
    wornWithItem: ClothingItem;
  }
type Item = {
  name: string;
  type: 'SHIRT' | 'PANT' | 'JACKET' | 'JUMPER' | 'SHOE';
  color: 'RED' | 'BLUE' | 'BROWN' | 'BEIGE' | 'GREEN' | 'BLACK' | 'WHITE' | 'YELLOW';
  image: string;
}

type ItemForm = {
  name: string;
  type: 'SHIRT' | 'PANT' | 'JACKET' | 'JUMPER' | 'SHOE';
  color: 'RED' | 'BLUE' | 'BROWN' | 'BEIGE' | 'GREEN' | 'BLACK' | 'WHITE' | 'YELLOW';
}
  interface User {
    id: number;
    clerkId?: string;
    userName : string;
    createdAt: Date;
    updatedAt: Date;
    wardrobe: WardrobeItem[];
    favorites: FavoriteItem[];
  }

  interface WardrobeItem {
    userId: number;
    clothingItemId: number;
    user: User;
    clothingItem: ClothingItem;
  }

  interface FavoriteItem {
    userId: number;
    clothingItemId: number;
    user: User;
    clothingItem: ClothingItem;
  }
}
