import { Messages } from "../utils/Messages";
import { ChannelHandler } from "./ChannelHandler";

export const publishStartGameAI = async (clientId: string, channelId: string) => {
    const channelHandler = await new ChannelHandler().initChannelHandler(clientId);
    await channelHandler?.publishMessage({ channelId, message: Messages.START_GAME_AI, details: {} });
}

export const subscribeToStartGameAI = async (clientId: string, channelId: string) => {
    const channelHandler = await new ChannelHandler().initChannelHandler(clientId);
    await channelHandler?.subscribeToChannel(channelId, Messages.START_GAME_AI);
}

export const publishTurnCompleted = async (clientId: string, channelId: string) => {
    const channelHandler = await new ChannelHandler().initChannelHandler(clientId);
    await channelHandler?.publishMessage({ channelId, message: Messages.TURN_COMPLETED, details: {} });
}

export const suscribeToTurnCompleted = async (clientId: string, channelId: string) => {
    const channelHandler = await new ChannelHandler().initChannelHandler(clientId);
    await channelHandler?.subscribeToChannel(channelId, Messages.TURN_COMPLETED);
}
