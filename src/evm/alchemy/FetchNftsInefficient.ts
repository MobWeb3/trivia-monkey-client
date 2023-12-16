/*
This strategy is inefficient because it fetches all NFTs for a given address, and then filters them down to the ones that are in the collection.
Should be replaced with a strategy that fetches only the NFTs that are in the collection.
Solution: Use the Graph to fetch NFTs that are in the collection.
*/

import { abi as GameSessionAbi } from '../abis/GameSessionNft.json'
import { Address, createPublicClient, http } from 'viem';
import { avalancheFuji } from 'viem/chains';
import { createWeb3AuthSigner, getProvider } from './Web3AuthSigner';
import { MutableNftGameSession, NftGameSession } from '../../game-domain/ nfts/NftGameSession';

export const publicClient = createPublicClient({
    chain: avalancheFuji,
    transport: http()
  })

export async function getNftsForOwner(ownerAddress?: string) {

    // This is to get the smart account address
    const web3authSigner = await createWeb3AuthSigner();
    const smartAccountAddress = await getProvider(web3authSigner).getAddress();

    const tokenCounter = await publicClient.readContract({
        address: '0x7356D3FE47585Cd79FB75ACb766E66eedDaD656D',
        abi: GameSessionAbi,
        functionName: 'getTokenCounter',
        args: [],
    });


    const nftSupply = tokenCounter ? parseInt(tokenCounter.toString()) : 0;
    const ids = [];

    for (let i = 0; i < nftSupply; i++) {
        const owner = await publicClient.readContract({
            address: '0x7356D3FE47585Cd79FB75ACb766E66eedDaD656D', 
            abi: GameSessionAbi,
            functionName: 'ownerOf',
            args: [i],
          }) as Address;
        if (owner === smartAccountAddress) {
            ids.push(i);
        }
    }

    // now for the ids get the tokenUri
    let tokenUris:{[key: number]: string} = {};

    for (let i = 0; i < ids.length; i++) {
        const tokenUri = await publicClient.readContract({
            address: '0x7356D3FE47585Cd79FB75ACb766E66eedDaD656D', 
            abi: GameSessionAbi,
            functionName: 'tokenURI',
            args: [ids[i]],
          }) as string;
        tokenUris[i] = tokenUri;
    }

    let result: NftGameSession[] = [];

    // const size = Object.keys(tokenUris).length;
    // Fetch the NFTs from the tokenUris'
    for (const i in tokenUris) {
        const nft = await fetch(tokenUris[i]);
        
        const nftJson = await nft.json();

        // console.log("nft content: ", nftJson);

        const nftGameSession = nftJson as MutableNftGameSession
        nftGameSession.tokenId = i;
        result.push(nftGameSession as NftGameSession);
    }


    

    return result;
}
