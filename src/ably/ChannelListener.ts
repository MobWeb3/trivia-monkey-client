import { ChannelHandler } from "./ChannelHandler";

export const createChannelId = async (data: any) => {
    const channelHandler = await ChannelHandler.getInstance().initChannelHandler(data.clientId);

    // Create the channel Id that will be used for the game session
    const channelId = await channelHandler?.createChannel(data);

    return channelId;
};