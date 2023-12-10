import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { Alchemy, Network } from "alchemy-sdk";

const API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY_SEPOLIA ?? "";

const alchemy = new Alchemy({
    network: Network.ETH_SEPOLIA,
    apiKey: API_KEY,
});

export const providerWithAlchemyEnhancedApis = (provider: AlchemyProvider) => {

    return provider.withAlchemyEnhancedApis(alchemy);
}
export const getNftsFromSmartAccount = async (provider: AlchemyProvider & Alchemy) => {
    const address = await provider.getAddress();
    const nfts = await provider.nft.getNftsForOwner(address);

    console.log("NFTs by smart account", address, ": ", nfts);
    return nfts;
}