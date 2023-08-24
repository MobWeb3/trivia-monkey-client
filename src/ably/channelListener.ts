import { Messages } from "../utils/Messages";
import { generateUniqueId } from "./uniqueId";
import axios from "axios";
import {AblyHandler} from "./AblyHandler";

const baseUrl = "https://a0a7-2600-100f-a104-648-5969-6475-cb53-c247.ngrok-free.app/api/ably";

const YOUR_ABLY_API_KEY = process.env.REACT_APP_ABLY_API_KEY ?? "";
const ablyInstance = AblyHandler.getInstance(YOUR_ABLY_API_KEY);

export const createChannelListener = async (data: any) => {
  const channelId = `trivia-monkey-${generateUniqueId()}`;

  try {
    const postResponse = await axios.post(`${baseUrl}/subscribeToChannel`, {
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
    await ablyInstance.enterChannel(channelId, clientId, nickname);
    const eventData = { nickname, channelId, clientId };
    window.dispatchEvent(new CustomEvent(Messages.CHANNEL_JOINED, { detail: eventData }));

  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

// export const enterChannelListenerV2 = async (data: any) => {
//   const { channelId, clientId, nickname } = data;

//   console.log(`data-enterChannelListener: ${data}`);
//   try {
//     const postResponse = await axios.post(`${baseUrl}/enterChannel`, {
//       clientId,
//       channelId,
//       nickname
//     });


//     const connectionStatus = postResponse.data.state.connectionStatus;
//     console.log(`Connection status: ${connectionStatus}`);
//     // window.dispatchEvent(new CustomEvent(Messages.CHANNEL_CREATED));
//     const eventData = { nickname, channelId, clientId };
//     window.dispatchEvent(new CustomEvent(Messages.CHANNEL_JOINED, { detail: eventData }));

//   } catch (error) {
//     console.error(`Error: ${error}`);
//   }

// }

// export const requestToken = async (clientId: string) => {
//   try {
//     // const response = await axios.post(, {
//     //   clientId
//     // });
//     // const token = response.data.token;
//     ablyInstance = AblyHandler.getInstance(`${baseUrl}/getAuthToken`);
//     console.log(`Ably instance initialized`);

//     const channel = ablyInstance.ablyInstance.channels.get("monkey0");
//     const attached = await channel.attach();

//     if (attached === null) {
//         return console.error("Error attaching to the channel.");
//     }
//     const members = await channel.presence.get();
//     console.log(`Members: ${members}`);
//     // return token;
//   } catch (error) {
//     console.error(`Error: ${error}`);
//   }
// }

