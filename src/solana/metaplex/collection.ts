import axios from "axios"
import { BASE_URL } from "../../ApiServiceConfig"

type NftCollection = {
    name: string
    symbol: string
    description?: string
    imageUri?: string
    uri?: string
    sellerFeeBasisPoints: number,
    tokenOwner?: string
}
export const createNftCollection = async (data: NftCollection) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/bubblegum/createNftCollection`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const uploadCollectionMetadata = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/bubblegum/uploadCollectionMetadata`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}