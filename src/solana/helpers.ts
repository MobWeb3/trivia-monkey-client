import { SolanaNetwork } from "./SolanaNetwork";

// check if it is a solana network
export const isSolanaNetwork = (network: unknown) => {
    //check if network is of type SolanaNetwork
    const networkCast = network as SolanaNetwork;
    return networkCast && networkCast.network !== undefined
    && networkCast.nativeCurrency !== undefined &&
    networkCast.nativeCurrency.name === 'Solana';
}