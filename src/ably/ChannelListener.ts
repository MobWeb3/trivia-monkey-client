import { createSession, updateSessionPhase } from "../polybase/SessionHandler";
import { ChannelHandler } from "./ChannelHandler";
import { Web3Auth } from "@web3auth/modal";
import { Messages } from "../utils/Messages";
import { SessionPhase } from "../game-domain/SessionPhase";
import { getConnectedPublicKey } from "../utils/Web3AuthAuthentication";

const getUserInfo = async (web3auth: Web3Auth) => {
    const userInfo = await web3auth?.getUserInfo();
    return userInfo;
}

export const createChannelListenerWrapper = async (web3auth: Web3Auth, data: any) => {

    const publicKey = await getConnectedPublicKey(web3auth);
    if (!publicKey) {
        console.log('publicKey not initialized yet');
        return {};
    }
    const userInfo = await getUserInfo(web3auth);
    data.clientId = userInfo?.email;
    // console.log('createChannelListenerWrapper data:', data);
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
            // console.log('createSession response:', response);
            const pbSessionId = response?.recordData?.data?.id;
            const channel = ChannelHandler.ablyInstance?.ablyInstance.channels.get(channelId);
            channel?.presence.subscribe('enter', async function (member) {
                // console.log(member.clientId + ' entered realtime-chat');
                const presence = await channel?.presence.get();
                // console.log('presence: ', presence);
                if (presence.length == data.numberPlayers) {

                    
                    data.sessionId = pbSessionId;
                    data.channelId = channelId;
                    
                    // Change game state to TURN_ORDER
                    await updateSessionPhase({id: pbSessionId, newPhase: SessionPhase.TURN_ORDER});

                    // Send event to SpinWheelScene, do this last so that update session phase is reflected in the scene
                    window.dispatchEvent(new CustomEvent(Messages.ALL_PLAYERS_JOINED, { detail: data }));
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await channel.publish("start-game", {sessionId: pbSessionId});
                }
            });

            return {sessionId: pbSessionId, channelId, clientId: data.clientId};
        }
    }
    return {channelId}
};

export const enterChannelListenerWrapper = async (web3auth: Web3Auth, data: any) => {

    // console.log('enterChannelListenerWrapper data:', data);

    const publicKey = await getConnectedPublicKey(web3auth);
    if (!publicKey) {
        // console.log('publicKey not initialized yet');
        return;
    }
    const userInfo = await getUserInfo(web3auth);
    data.clientId = userInfo?.email;
    const channelHandler = await new ChannelHandler().initChannelHandler(data.clientId);
    await channelHandler?.enterChannel(data);
    const channel = ChannelHandler.ablyInstance?.ablyInstance.channels.get(data.channelId);
    channel?.subscribe('start-game', async function (message) {
        // console.log('start-game event received with id:', message);
        data.sessionId = message.data.sessionId;
        await new Promise(resolve => setTimeout(resolve, 500));
        window.dispatchEvent(new CustomEvent(Messages.ALL_PLAYERS_JOINED, {detail: data}));
    });
};