import { SolanaNetwork } from "./solana/SolanaNetwork";

export enum SupportedNetworks {
    Sepolia = 'Sepolia',
    Fuji = 'Fuji',
    Mumbai = 'Mumbai'
}

export const SolanaDevnet: SolanaNetwork = {
    "name": "Solana Devnet",
    "network": "solana-devnet",
    "nativeCurrency": {
        "name": "Solana",
        "symbol": "SOL",
        "decimals": 9
    },
    "rpcUrls": {
        "public": {
            "http": ["https://api.devnet.solana.com"]
        },
        "default": {
            "http": ["https://api.devnet.solana.com"]
        }
    },
    "blockExplorers": {
        "default": {
            "name": "Solana Explorer",
            "url": "https://explorer.solana.com"
        }
    },
    "testnet": true
}