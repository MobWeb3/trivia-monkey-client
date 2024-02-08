import { chains } from "@alchemy/aa-core";
import { Chain } from "viem";

// Given a network, return the proper chain configuration
export const detectNetwork = async (network: string) => {

    const evmChain = Object.values(chains).find((chain) => chain.network === network);

    if (evmChain) {
        // console.log('is EVM chain')
        // console.log('network: ', evmChain.name);
        return evmChain
    }
    else if (network === "solana-devnet") {
        console.log('is Solana chain')
        return await import("../SupportedNetworksConfig").then((module) => module.SolanaDevnet);
    }
    else {
        throw new Error("Unsupported blockchain network");
    }
}

function isChain(obj: any): obj is Chain {
    return obj && obj.id !== undefined;
}

export const isEvmChain = (chain: unknown): chain is Chain => {
    return isChain(chain);
}