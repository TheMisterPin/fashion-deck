import axios from "axios";

export async function getUserWardrobe(){
    const response = await axios.get('/api/wardrobe')
    const clothin = response.data.items
    console.table(wardrobeItems)
    return wardrobeItems
}