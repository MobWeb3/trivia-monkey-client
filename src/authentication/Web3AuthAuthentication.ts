// import { getRPCProviderOwner, getZeroDevSigner } from "@zerodevapp/sdk";
import { createWeb3AuthSigner, getProvider } from "../evm/alchemy/Web3AuthSigner";
import { SolanaDevnet } from "../SupportedNetworksConfig";
import { createWeb3AuthSolanaSigner } from "../solana/web3auth";
import { detectNetwork, isEvmChain } from "./NetworkDetector";
import { getConnectedSolanaPublicKey } from "./solana/utils";

export const getWeb3AuthSigner = async () => {

    const blockchainNetwork = await detectNetwork(import.meta.env.VITE_DEFAULT_BLOCKCHAIN_NETWORK);

    if (isEvmChain(blockchainNetwork)) {
        const web3authSigner = await createWeb3AuthSigner();
        const smartAccountAddress = await getProvider(web3authSigner).getAddress();
        console.log("Smart Account Address: ", smartAccountAddress); // Log the smart account address
        console.log("Owner Address: ", await web3authSigner.getAddress()); // Log the owner address
        return web3authSigner;
    }
    else if (blockchainNetwork.name === SolanaDevnet.name) {
        const web3authSigner = await createWeb3AuthSolanaSigner();
        const publicKey = await getConnectedSolanaPublicKey(web3authSigner.inner);
        console.log("Solana current account Address: ", publicKey?.toBase58()); // Log the smart account address
        return web3authSigner;
    }
    else {
        throw new Error("Unsupported blockchain network");
    }
}

