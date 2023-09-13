import { ChannelHandler } from "./ChannelHandler";

export const publishStartGameAI = async (clientId: string, channelId: string) => {
    const channelHandler = await new ChannelHandler().initChannelHandler(clientId);
    await channelHandler?.publishMessage({ channelId, message: 'start-game-ai', details: {} });
}

export const subscribeToStartGameAI = async (clientId: string, channelId: string) => {
    const channelHandler = await new ChannelHandler().initChannelHandler(clientId);
    await channelHandler?.subscribeToChannel(channelId, 'start-game-ai');
}