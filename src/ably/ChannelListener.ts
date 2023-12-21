import { createSession } from "../polybase/SessionHandler";
import { ChannelHandler } from "./ChannelHandler";

export const createChannelListenerWrapper = async (data: any) => {
    const channelHandler = await ChannelHandler.getInstance().initChannelHandler(data.clientId);

    // Create the channel Id that will be used for the game session
    const channelId = await channelHandler?.createChannel(data);

    if (channelId && data.clientId && data.numberPlayers && data.pointsToWin) {
        // Create polybase game session
        const response = await createSession({
            clientId: data.clientId,
            numberPlayers: data.numberPlayers,
            pointsToWin: data.pointsToWin,
            channelId,
        });

        if (response) {
            const pbSessionId = response?.recordData?.data?.id;

            return {sessionId: pbSessionId, channelId};
        }
    }
    else {
        console.error(`missing any of channelId, clientId, numberPlayers,
         pointsToWin. See current data: `, data);
    }
    return {channelId}
};