import { createWeb3AuthSigner, getProvider } from "../alchemy/Web3AuthSigner";

export const getWeb3AuthSigner = async () => {
    const web3authSigner = await createWeb3AuthSigner();
    const publicKey = await getProvider(web3authSigner).getAddress();
    console.log("Smart Account Address: ", publicKey); // Log the smart account address
    console.log("Owner Address: ", await web3authSigner.getAddress()); // Log the owner address

    return web3authSigner;
}