import { SolanaNetwork } from "./SolanaNetwork";
import { PublicKey, Connection, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

// check if it is a solana network
export const isSolanaNetwork = (network: unknown) => {
    //check if network is of type SolanaNetwork
    const networkCast = network as SolanaNetwork;
    return networkCast && networkCast.network !== undefined
    && networkCast.nativeCurrency !== undefined &&
    networkCast.nativeCurrency.name === 'Solana';
}

// check the bolance of a given solana account
export const getSolanaBalance = async (publicKey: string) => {
    // get the balance of the account
        // Connect to the cluster (mainnet in this case)
        let connection = new Connection(clusterApiUrl('devnet'));
    
        // Get the balance
        let balance = await connection.getBalance(new PublicKey(publicKey));
    
        console.log(`Your public key is ${publicKey}`)

        const totalSol = Number(balance) / Number(LAMPORTS_PER_SOL);
        console.log(`balance: ${totalSol.toFixed(6)} SOL`, balance);
}

// get usdc balance of a given solana account
export const getUsdcBalance = async (publicKey: string) => {
    // get the balance of the account
    // Connect to the cluster (mainnet in this case)
    let connection = new Connection(clusterApiUrl('devnet'));

    // Get the balance
    let balance = await connection.getTokenAccountBalance(new PublicKey(publicKey));

    console.log(`Your public key is ${publicKey}`)

    console.log(`balance: ${balance}`);
}