import axios from "axios";
import { BASE_URL } from "../ApiServiceConfig";
import { GameSession } from "../game-domain/GameSession";

interface ApiPostParams {
    url: string;
    data: any;
}

export interface NftReceipt {
    success?: boolean;
    transactionHash?: string;
    mintAddress?: string;
}

async function apiPost({ url, data }: ApiPostParams): Promise<NftReceipt> {
    try {
        const response = await axios.post(`${BASE_URL}${url}`, data);
        return response.data as NftReceipt;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

interface MintNftParams {
    playerId: string;
    session: GameSession;
    nftCollectionName: string;
    mintToAddress: string;
}

export async function mintNft(data: MintNftParams): Promise<NftReceipt> {
    return await apiPost({ url: "/api/solana/mintToAddress", data });
}