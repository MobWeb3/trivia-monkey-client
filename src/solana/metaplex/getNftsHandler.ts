import axios from "axios";
import { BASE_URL } from "../../ApiServiceConfig";
import { NftMintData } from "./NftMintDataModel";
import { NftGameSession } from "../../game-domain/ nfts/NftGameSession";

interface ApiPostParams {
    url: string;
    data: any;
}

async function apiPost({ url, data }: ApiPostParams): Promise<NftMintData[]> {
    try {
        const response = await axios.post(`${BASE_URL}${url}`, data);
        return response.data as NftMintData[];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getNftsByOwner = async (data:
    {
        address: string,
        start: number,
        end: number
    }) => {
    const response = await apiPost({
        url: '/api/solana/getNftsByOwner',
        data,
    });
    return parseNftGameSession(response);
}

const parseNftGameSession = async (nft: NftMintData[]) => {

    // Get nft game session metadata from nft url
    // using fetch
    const nftGameSessions: NftGameSession[] = await Promise.all(nft.map(async (nft) => {
        const response = await fetch(nft.uri);
        const metadata = await response.json();
        return {
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            tokenId: nft.mint,
        } as NftGameSession;
    }));

    return nftGameSessions
}