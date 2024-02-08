import { Web3Auth } from "@web3auth/modal";
import { SolanaWallet } from "@web3auth/solana-provider";
import { Connection } from '@solana/web3.js'
import { MySolanaWallet } from "../../solana/MySolanaWallet";

export const getConnectedSolanaPublicKey = async (web3auth: Web3Auth) => {
    const web3authProvider = await web3auth?.connect();
    if (web3authProvider) { // solana
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