import Ably from 'ably';
import { Messages } from '../utils/Messages';

export class AblyHandler {
    public ablyInstance;
    private static instance: AblyHandler;

    constructor(apiKey?: string, token?: string) {
        this.ablyInstance = new Ably.Realtime.Promise(apiKey ?? token ?? "");
    }

    public static getInstance(apiKey: string): AblyHandler {
        if (!AblyHandler.instance) {
          AblyHandler.instance = new AblyHandler(apiKey);
        }
        return AblyHandler.instance;
    }

    public static getInstanceWithToken(token: string): AblyHandler {
        if (!AblyHandler.instance) {
          AblyHandler.instance = new AblyHandler(undefined, token);
        }
        return AblyHandler.instance;
    }

    // Example method: subscribe to a channel
    async subscribeToChannel(channelName: string, message: string) {
        const channel = this.ablyInstance.channels.get(channelName);
        channel?.subscribe(message, async function (message) {
            console.log(`Message ${message} with id:`, message);
            window.dispatchEvent(new CustomEvent(Messages.OPEN_AI_GAME, {detail: message}));
        });
    }

    // Example method: publish a message to a channel
    async publishToChannel(channelName: string, message: string, details: any) {
        const channel = this.ablyInstance.channels.get(channelName);
        channel.publish(message, { data: details});
    }

    // enter channel method
    async enterChannel(channelName: string, clientId: string, nickname: string) {
        const channel = this.ablyInstance.channels.get(channelName);
        await channel.presence.enterClient(clientId, { nickname });
    }

    // Add more methods as needed for your use case

    // Example method: disconnect from Ably
    disconnect() {
        this.ablyInstance.close();
    }
}
