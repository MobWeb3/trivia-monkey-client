import { createSession } from "../polybase/SessionHandler";
import { ChannelHandler } from "./ChannelHandler";
import { Web3Auth } from "@web3auth/modal";

const getUserInfo = async (web3auth: Web3Auth) => {
    const userInfo = await web3auth?.getUserInfo();
    return userInfo;
}

export const createChannelListenerWrapper = async (web3auth: Web3Auth, data: any) => {
    const userInfo = await getUserInfo(web3auth);
    data.clientId = userInfo?.email;
    // console.log('createChannelListenerWrapper data:', data);
    const channelHandler = await ChannelHandler.getInstance().initChannelHandler(data.clientId);

    // Create the channel Id that will be used for the game session
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
            const pbSessionId = response?.recordData?.data?.id;

            return {sessionId: pbSessionId, channelId, clientId: data.clientId};
        }
    }
    return {channelId}
};