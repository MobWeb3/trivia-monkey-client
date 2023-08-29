import { Messages } from "../utils/Messages";
import { generateUniqueId } from "./uniqueId";
import axios from "axios";
import {AblyHandler} from "./AblyHandler";

const baseUrl = "http://localhost:3333/api/ably";

let ablyInstance: AblyHandler;

export const createChannel = async (data: any) => {
  const { clientId, nickname } = data;
  const channelId = `tm-chid-${generateUniqueId()}`;

  try {
    const postResponse = await axios.post(`${baseUrl}/subscribeToChannel`, {
      channelId: channelId,

    });
    const connectionStatus = postResponse.data.state.connectionStatus;
    console.log(`Connection status: ${connectionStatus}`);
    // window.dispatchEvent(new CustomEvent(Messages.CHANNEL_CREATED));
    const eventData = { channelInfo: data, channelId: channelId };
    window.dispatchEvent(new CustomEvent(Messages.CHANNEL_CREATED, { detail: eventData }));
    await ablyInstance.enterChannel(channelId, clientId, nickname);
    return channelId;

  } catch (error) {
    console.error(`Error: ${error}`);
    return false;
  }
};

export const enterChannelListener = async (data: any) => {
  const { channelId, clientId, nickname } = data;

  console.log(`data-enterChannelListener: ${data}`);
  try {
    await ablyInstance.enterChannel(channelId, clientId, nickname);
    const eventData = { nickname, channelId, clientId };
    window.dispatchEvent(new CustomEvent(Messages.CHANNEL_JOINED, { detail: eventData }));

  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

export const initAblyHandler = async (clientId: string) => {
  try {
    const response = await axios.post(`${baseUrl}/getToken`, {
      clientId
    });
    const token = response.data.token;

    console.log(`Token: ${token}`);
    ablyInstance = AblyHandler.getInstanceWithToken(token);

  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

