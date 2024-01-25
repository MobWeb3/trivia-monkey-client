import { Web3Auth } from "@web3auth/modal";
// import { getRPCProviderOwner, getZeroDevSigner } from "@zerodevapp/sdk";
import { SolanaWallet } from "@web3auth/solana-provider";
import { MySolanaWallet } from "../solana/MySolanaWallet";
import { Connection } from '@solana/web3.js'
import { getWeb3AuthSigner } from "../evm/Login";

const isEvmChain = import.meta.env.VITE_APP_EVM_CHAIN === 'true';

export const login = async () => {

    if (isEvmChain) {
        const web3authSigner = await getWeb3AuthSigner();
        const web3auth = web3authSigner.inner;
        return await web3auth?.getUserInfo();

    } else {
        // const publicKey = await getConnectedPublicKey(web3auth);
        // console.log(`publick key: ${publicKey?.toString()}`);
        // console.log(`userInfo: ${JSON.stringify(userInfo)}`);
        // return userInfo;
    }
    return {}
};

export const getConnectedPublicKey = async (web3auth?: Web3Auth) => {
    const web3authProvider = await web3auth?.connect();
    if (web3authProvider && !isEvmChain) { // solana
        const solanaWallet = new SolanaWallet(web3authProvider as any);
        const accounts = await solanaWallet.requestAccounts();
        const account1 = accounts[0];
        if (account1) {

            const connectionConfig: any = await solanaWallet.request({
                method: "solana_provider_config",
                params: [],
            });

            const connection = new Connection(connectionConfig.rpcTarget);
            const mySolanaWallet = new MySolanaWallet(solanaWallet, connection);
            return await mySolanaWallet.getPublicKey();
        }
    }

    return null;
}