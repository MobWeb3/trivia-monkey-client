import { Web3Auth } from "@web3auth/modal";
import { userExists, createUser } from "../mongo/PlayerHandler";
import { getWeb3AuthSigner } from "./Web3AuthAuthentication";
import { detectNetwork } from './NetworkDetector';
import { getConnectedSolanaPublicKey } from "./solana/utils";
import { SolanaDevnet } from "../SupportedNetworksConfig";


export const login = async (selectedNetwork: string=SolanaDevnet.network) => {
  const detectedNetwork = await detectNetwork(selectedNetwork);
  
      const web3authSigner = await getWeb3AuthSigner();
      const web3auth = web3authSigner.inner;
      await createPlayerIfNotExists(web3auth);
      return {
        userInfo: await web3auth?.getUserInfo(),
        network: detectedNetwork,
        currentUserPublicKey: await getConnectedSolanaPublicKey(web3auth)
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