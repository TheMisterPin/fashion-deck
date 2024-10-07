// src/types.d.ts

 export {};

declare global  {
  // Enums
 enum ClothingType {
  SHIRT = "SHIRT",
  PANT = "PANT",
  JACKET = "JACKET",
  JUMPER = "JUMPER",
  SHOE = "SHOE",
}

 enum Color {
  RED = "RED",
  BLUE = "BLUE",
  BROWN = "BROWN",
  BEIGE = "BEIGE",
  GREEN = "GREEN",
  BLACK = "BLACK",
  WHITE = "WHITE",
  YELLOW = "YELLOW",
}

 enum Style {
  CASUAL = "CASUAL",
  WORK = "WORK",
  FORMAL = "FORMAL",
}

// Models
 interface Outfit {
  id: number;
  picture?: string | null;
  preview: string[];
  timesWorn: number;
  lastWorn?: Date | null;
  isUsed: boolean;
  isAvailable: boolean;
  isWorn: boolean;
  createdAt: Date;
  updatedAt: Date;
  items: OutfitItem[];
  userId?: string | null;
  User?: User | null;
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
  name?: string | null;
  color?: Color | null;
  picture?: string | null;
  timesWorn: number;
  lastWorn?: Date | null;
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
  timesWornTogether: number;
  item: ClothingItem;
  wornWithItem: ClothingItem;
}

 interface User {
  id: number;
  clerkId: string;
  createdAt: Date;
  updatedAt: Date;
  outfits: Outfit[];
  wardrobe: WardrobeItem[];
  favorites: FavoriteItem[];
}

 interface WardrobeItem {
  userId: string;
  clothingItemId: number;
  user: User;
  clothingItem: ClothingItem;
}

 interface FavoriteItem {
  userId: string;
  clothingItemId: number;
  user: User;
  clothingItem: ClothingItem;
}
type ItemForm = {
  name: string;
  type: 'SHIRT' | 'PANT' | 'JACKET' | 'JUMPER' | 'SHOE';
  color: 'RED' | 'BLUE' | 'BROWN' | 'BEIGE' | 'GREEN' | 'BLACK' | 'WHITE' | 'YELLOW';
}
type Item = {
  name: string;
  type: 'SHIRT' | 'PANT' | 'JACKET' | 'JUMPER' | 'SHOE';
  color: 'RED' | 'BLUE' | 'BROWN' | 'BEIGE' | 'GREEN' | 'BLACK' | 'WHITE' | 'YELLOW';
  image: string;
}
}

