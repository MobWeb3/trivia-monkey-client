import { Messages } from "../utils/Messages";
import { generateUniqueId } from "./uniqueId";
import axios from "axios";

export const createChannelListener = async (data: any) => {

  // const ç = require('axios');
  const channelId = `trivia-monkey-${generateUniqueId()}`;

  try {
    const postResponse = await axios.post('http://localhost:3333/api/ably/subscribeToChannel', {
      channelId: channelId,

    });
    const connectionStatus = postResponse.data.state.connectionStatus;
    console.log(`Connection status: ${connectionStatus}`);
    // window.dispatchEvent(new CustomEvent(Messages.CHANNEL_CREATED));
    const eventData = { channelInfo: "postResponse.data", channelId: channelId };
    window.dispatchEvent(new CustomEvent(Messages.CHANNEL_CREATED, { detail: eventData }));
    
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

export const enterChannelListener = async (data: any) => {
    const { channelId, clientId, nickname } = data;
  
    console.log(`data-enterChannelListener: ${data}`);
    try {
      const postResponse = await axios.post('http://localhost:3333/api/ably/enterChannel', {
        clientId,
        channelId,
        nickname
      });
      const connectionStatus = postResponse.data.state.connectionStatus;
      console.log(`Connection status: ${connectionStatus}`);
      // window.dispatchEvent(new CustomEvent(Messages.CHANNEL_CREATED));
      const eventData = { nickname, channelId, clientId };
      window.dispatchEvent(new CustomEvent(Messages.CHANNEL_JOINED, { detail: eventData }));
      
    } catch (error) {
      console.error(`Error: ${error}`);
    }
}

