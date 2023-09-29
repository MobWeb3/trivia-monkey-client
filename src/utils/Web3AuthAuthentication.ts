import { Web3Auth } from "@web3auth/modal";
// import { getRPCProviderOwner, getZeroDevSigner } from "@zerodevapp/sdk";
import { SolanaWallet } from "@web3auth/solana-provider";
import { MySolanaWallet } from "../solana/MySolanaWallet";
import { Connection } from '@solana/web3.js'

export const login = async (web3auth: Web3Auth) => {
    if (!web3auth) {
        console.log("web3auth not initialized yet");
        return {};
    }
    await web3auth.connect();

    const userInfo = await web3auth.getUserInfo();

    const evmChain = false;

    if (evmChain) {
        // const _signer = await getZeroDevSigner({
        //     projectId: "5682ee04-d8d3-436a-ae63-479e063a23c4",
        //     owner: getRPCProviderOwner(web3auth.provider),
        // })

    } else {
        const publicKey = await getConnectedPublicKey(web3auth);
        console.log(`publick key: ${publicKey?.toString()}`);
        // console.log(`userInfo: ${JSON.stringify(userInfo)}`);
        return userInfo;
    }
    return {}
};

export const getConnectedPublicKey = async (web3auth: Web3Auth) => {
    const web3authProvider = await web3auth?.connect();
    if (web3authProvider) {
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