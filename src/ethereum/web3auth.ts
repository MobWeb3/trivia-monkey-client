import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from '@web3auth/base';

const clientId = process.env.WEB3AUTH_CLIENT_ID ?? "";
export const web3authEvm = new Web3Auth({
  clientId ,
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x13881",
      rpcTarget: "https://rpc.ankr.com/polygon_mumbai", // This is the public RPC we have added, please pass on your own endpoint while creating an app
    },
    uiConfig: {
      appName: "Monkey Trivia",
      loginMethodsOrder: ["google", "facebook", "twitter", "reddit", "discord", "twitch", "apple", "line", "github", "kakao", "linkedin", "weibo", "wechat", "email_passwordless"],
      defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
      loginGridCol: 3,
      primaryButton: "externalLogin", // "externalLogin" | "socialLogin" | "emailLogin"
      mode: "light", // "modal" | "inline"
      logoLight: "assets/monkeys_avatars/astronaut-monkey1-200x200.png",
    },
    web3AuthNetwork: "cyan",
  });