import { Messages } from "../utils/Messages";
import { generateUniqueId } from "./uniqueId";
import axios from "axios";
import {AblyHandler} from "./AblyHandler";
import { BASE_URL } from "../MonkeyTriviaServiceConstants";

const baseUrl = `${BASE_URL}/api/ably`;

export class ChannelHandler {
  static ablyInstance?: AblyHandler;

  public async createChannel(data: any) {
    const { clientId, nickname } = data;
    const channelId = `tm-chid-${generateUniqueId()}`;

    console.log(`data-createChannelListener:`, data);

    try {
      const postResponse = await axios.post(`${baseUrl}/subscribeToChannel`, {
        channelId: channelId,

      });
      const connectionStatus = postResponse.data.state.connectionStatus;
      console.log(`Connection status: ${connectionStatus}`);
      // window.dispatchEvent(new CustomEvent(Messages.CHANNEL_CREATED));
      const eventData = { channelInfo: data, channelId: channelId };
      window.dispatchEvent(new CustomEvent(Messages.CHANNEL_CREATED, { detail: eventData }));
      await ChannelHandler.ablyInstance?.enterChannel(channelId, clientId, nickname);
      return channelId;

    } catch (error) {
      console.error(`Error: ${error}`);
      return undefined;
    }
  }

  public async enterChannel(data: any) {
    const { channelId, clientId, nickname } = data;

    console.log("data-enterChannelListener:",  data);
    try {
      await ChannelHandler.ablyInstance?.enterChannel(channelId, clientId, nickname);
      const eventData = { nickname, channelId, clientId };
      window.dispatchEvent(new CustomEvent(Messages.CHANNEL_JOINED, { detail: eventData }));

    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }
  public async initChannelHandler(clientId: string): Promise<ChannelHandler|undefined> {
    try {
      const response = await axios.post(`${baseUrl}/getToken`, {
        clientId
      });
      const token = response.data.token;

      console.log(`Token: ${token}`);
      ChannelHandler.ablyInstance = AblyHandler.getInstanceWithToken(token);
      return this;

    } catch (error) {
      console.error(`Error: ${error}`);
      return undefined;
    }
  }

  public async publishMessage(data: any) {
    const { channelId, message, details} = data;
    try {
      await ChannelHandler.ablyInstance?.publishToChannel(channelId, message, details);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  public async subscribeToChannel(channelId: string, message: string) {
    try {
      await ChannelHandler.ablyInstance?.subscribeToChannel(channelId, message);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }
}
