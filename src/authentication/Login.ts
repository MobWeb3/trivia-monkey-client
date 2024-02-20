import { Web3Auth } from "@web3auth/modal";
import { userExists, createUser } from "../mongo/PlayerHandler";
import { getWeb3AuthSigner } from "./Web3AuthAuthentication";
import { detectNetwork } from './NetworkDetector';


export const login = async (defaultNetwork: string='solana-devnet') => {
  const detectedNetwork = await detectNetwork(defaultNetwork);
  
      const web3authSigner = await getWeb3AuthSigner();
      const web3auth = web3authSigner.inner;
      await createPlayerIfNotExists(web3auth);
      return {
        userInfo: await web3auth?.getUserInfo(),
        network: detectedNetwork
      };
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