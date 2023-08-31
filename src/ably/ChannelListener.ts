import { useContext } from "react";
import { createSession } from "../polybase/SessionHandler";
import { ChannelHandler } from "./ChannelHandler";
import { SignerContext } from "../components/SignerContext";
import { SolanaWallet } from "@web3auth/solana-provider";
import { MySolanaWallet } from "../solana/MySolanaWallet";
import { Connection } from '@solana/web3.js'
import { Web3Auth } from "@web3auth/modal";
import { Messages } from "../utils/Messages";

const getUserInfo = async (web3auth: Web3Auth) => {
    const userInfo = await web3auth?.getUserInfo();
    return userInfo;
}

export const getConnectedPublicKey = async (web3auth: Web3Auth) => {
    const web3authProvider = await web3auth?.connect();
    if (web3authProvider) {
        const solanaWallet = new SolanaWallet(web3authProvider);
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

export const createChannelListenerWrapper = async (web3auth: Web3Auth, data: any) => {

    const publicKey = await getConnectedPublicKey(web3auth);
    if (!publicKey) {
        console.log('publicKey not initialized yet');
        return;
    }
    const userInfo = await getUserInfo(web3auth);
    data.clientId = userInfo?.email;
    console.log('createChannelListenerWrapper data:', data);
    const channelHandler = await new ChannelHandler().initChannelHandler(data.clientId);
    // setAblyInstance(await initAblyHandler(data.clientId) ?? null);
    const channelId = await channelHandler?.createChannel(data);

    if (channelId && data) {
        // Create polybase game session
        const response = await createSession({
            clientId: data.clientId,
            numberPlayers: data.numberPlayers,
            pointsToWin: data.pointsToWin,
            channelId,
        });

        if (response) {
            console.log('createSession response:', response);
            const channel = ChannelHandler.ablyInstance?.ablyInstance.channels.get(channelId);
            channel?.presence.subscribe('enter', async function (member) {
                console.log(member.clientId + ' entered realtime-chat');
                const presence = await channel?.presence.get();
                console.log('presence: ', presence);
                if (presence.length == data.numberPlayers) {
                    console.log('All players are here!!');
                    window.dispatchEvent(new CustomEvent(Messages.ALL_PLAYERS_JOINED, {}));
                }
            });

        }
    }
};

export const enterChannelListenerWrapper = async (web3auth: Web3Auth, data: any) => {

    const publicKey = await getConnectedPublicKey(web3auth);
    if (!publicKey) {
        console.log('publicKey not initialized yet');
        return;
    }
    const userInfo = await getUserInfo(web3auth);
    data.clientId = userInfo?.email;
    const channelHandler = await new ChannelHandler().initChannelHandler(data.clientId);
    await channelHandler?.enterChannel(data);
};