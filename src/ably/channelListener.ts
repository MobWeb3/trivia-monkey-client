import { Messages } from "../utils/Messages";
import { generateUniqueId } from "./uniqueId";

export const createChannelListener = async (data: any) => {

  const axios = require('axios');
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

