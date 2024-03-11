import { SolanaNetwork } from "./SolanaNetwork";
import { PublicKey, Connection, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';

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

        return totalSol;
}

export async function getUSDCBalance(publicKey: string) {
    // Connect to Solana mainnet
    let connection = new Connection(clusterApiUrl('devnet'));

    // The address of the account to fetch the USDC balance from
    const accountAddress = new PublicKey(publicKey);
    console.log(`Your public key is ${accountAddress.toBase58()}`);
    
    // USDC token mint address on Solana mainnet
    const usdcMintAddress = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');

    const associatedTokenAddress = await getAssociatedTokenAddress(
        usdcMintAddress,
        accountAddress
    );

    const associatedTokenAddressStr = associatedTokenAddress.toBase58();

    console.log(associatedTokenAddress);
    console.log(`Your associated token address is ${associatedTokenAddressStr}`);

    // Get the token account balance for USDC
    const balanceUsdc = await connection.getTokenAccountBalance(new PublicKey(associatedTokenAddress))

    // Fetch and display the balance
    // const balance = await connection.getTokenAccountBalance(associatedTokenAddress);
    console.log(`USDC Balance: ${balanceUsdc.value.uiAmount}`);

    return balanceUsdc.value.uiAmount;
}