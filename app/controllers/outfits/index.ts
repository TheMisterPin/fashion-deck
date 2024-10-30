import axios from 'axios';


export async function getUserOutfits(){
    const response = await axios.get('/api/outfits')
    if (response.status === 200) {
        const outfits = response.data.outfits;
        return outfits;
    }
}

