import { Web3Auth } from "@web3auth/modal";
import { userExists, createUser } from "../mongo/PlayerHandler";
import { getWeb3AuthSigner } from "./Web3AuthAuthentication";
import { detectNetwork, isEvmChain } from './NetworkDetector';


export const login = async () => {
  console.log(`to detect: ${import.meta.env.VITE_DEFAULT_BLOCKCHAIN_NETWORK}`);
  const detectedNetwork = await detectNetwork(import.meta.env.VITE_DEFAULT_BLOCKCHAIN_NETWORK);
  
    if (isEvmChain(detectedNetwork)) {
        const web3authSigner = await getWeb3AuthSigner();
        const web3auth = web3authSigner.inner;
        await createPlayerIfNotExists(web3auth);
        return await web3auth?.getUserInfo();
    } else {
        // const publicKey = await getConnectedPublicKey(web3auth);
        // console.log(`publick key: ${publicKey?.toString()}`);
        // console.log(`userInfo: ${JSON.stringify(userInfo)}`);
        // return userInfo;
    }
    return {}
};

const createPlayerIfNotExists = async (web3authInstance: Web3Auth) => {
    const userInfo = await web3authInstance.getUserInfo();
    console.log('userInfo: ', userInfo);
    const userExist = await userExists(userInfo?.email ?? "");
    if (!userExist) {
      console.log('user does not exist, creating user');
      // create user
      const createdPlayer = await createUser({
        email: userInfo.email ?? "",
        name: userInfo.name ?? ""
      });
      console.log('createdPlayer: ', createdPlayer);
    }
}