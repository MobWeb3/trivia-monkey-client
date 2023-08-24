import Ably from 'ably';

export class AblyHandler {
    public ablyInstance;
    private static instance: AblyHandler;

    constructor(apiKey: string) {
        this.ablyInstance = new Ably.Realtime.Promise({
            key: apiKey
        });
    }

    public static getInstance(apiKey: string): AblyHandler {
        if (!AblyHandler.instance) {
          AblyHandler.instance = new AblyHandler(apiKey);
        }
        return AblyHandler.instance;
    }

    // Example method: subscribe to a channel
    subscribeToChannel(channelName: string) {
        const channel = this.ablyInstance.channels.get(channelName);
        channel.subscribe((message) => {
            console.log(`Received message: ${message.data}`);
        });
    }

    // Example method: publish a message to a channel
    publishToChannel(channelName: string, message: string) {
        const channel = this.ablyInstance.channels.get(channelName);
        channel.publish('message', message);
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
