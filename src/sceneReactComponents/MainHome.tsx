import { useContext, useEffect, useState } from 'react';
import './MainHome.css';
import '../PhaserGame';
import { addMessageListener, removeMessageListener } from '../utils/MessageListener';
import { SignerContext } from '../components/SignerContext';
import { getRPCProviderOwner, getZeroDevSigner } from '@zerodevapp/sdk';
import { SafeEventEmitterProvider } from '@web3auth/base';
import { Messages } from '../utils/Messages';
import { SolanaWallet } from "@web3auth/solana-provider";
import { MySolanaWallet } from '../solana/MySolanaWallet';
import { Connection } from '@solana/web3.js'
import { createChannelListener, enterChannelListener, initAblyHandler } from '../ably/channelListener';
import { createUser, userExists } from '../polybase/UserHandler';

function App() {
  const { signer, web3auth, setSigner } = useContext(SignerContext);
  const [, setProvider] = useState<SafeEventEmitterProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

   // this should be the email associated with the account
  // const [email, setEmail] = useState<string | null>(null);
  // const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const tryConnection = async (data: any) => {
      console.log('tryConnection data:', data);
      const {name, publicKey, email }= await login();
      // check if user exist in polybase
      // if not, create user
      if (!publicKey || !email) {
        console.log('publicKey not initialized yet');
        return;
      }
      const userExist = await userExists(email);
      if (!userExist) {
        console.log('user does not exist, creating user');
        // create user
        await createUser({name: "name4", clientId: "email4"});
      }
    };

    const disconnect = async (data: any) => {
      await logout();
    };

    const createChannelListenerWrapper = async (data: any) => {

      if (!publicKey) {
        console.log('publicKey not initialized yet');
        return;
      }
      
      data.clientId = publicKey;
      await initAblyHandler(publicKey);
      await createChannelListener(data);
    };


    const enterChannelListenerWrapper = async (data: any) => {

      if (!publicKey) {
        console.log('publicKey not initialized yet');
        return;
      }
      
      data.clientId = publicKey;
      await initAblyHandler(publicKey);
      // console.log('enterChannelListenerWrapper data:', data);
      await enterChannelListener(data);
    }; 

    addMessageListener(Messages.TRY_CONNECTION, tryConnection);
    addMessageListener(Messages.TRY_DISCONNECT, disconnect);
    addMessageListener(Messages.CREATE_CHANNEL, createChannelListenerWrapper);
    addMessageListener(Messages.ENTER_CHANNEL, enterChannelListenerWrapper);

    return () => {
      removeMessageListener(Messages.TRY_CONNECTION, tryConnection);
      removeMessageListener(Messages.TRY_DISCONNECT, disconnect);
      removeMessageListener(Messages.CREATE_CHANNEL, createChannelListenerWrapper);
      removeMessageListener(Messages.ENTER_CHANNEL, enterChannelListenerWrapper);
    };
  });

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return {};
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    setLoggedIn(true);

    const evmChain = false;

    if (evmChain) {
      const _signer = await getZeroDevSigner({
        projectId: "5682ee04-d8d3-436a-ae63-479e063a23c4",
        owner: getRPCProviderOwner(web3auth.provider),
      })
  
      setSigner(_signer);
      console.log("signer created: ", signer);
      console.log("signer address", await _signer.getAddress());
    } else {
      if (web3authProvider) {
        const solanaWallet = new SolanaWallet(web3authProvider);

        const accounts = await solanaWallet.requestAccounts();
        const account1 = accounts[0];
        if (account1) {

          const connectionConfig: any = await solanaWallet.request({
            method: "solana_provider_config",
            params: [],
          });
  
          const connection = new Connection(connectionConfig.rpcTarget);
          const mySolanaWallet = new MySolanaWallet(solanaWallet, connection);
          const pk58 = (await mySolanaWallet.getPublicKey()).toString();
          setPublicKey(pk58);
          const userInfo = await web3auth.getUserInfo();
          // setEmail(userInfo.email ?? "no email");
          // setName(userInfo.name ?? "no name");
          console.log("web3auth account info: ", userInfo);
          console.log("solana publicKey: ", pk58);
          return { email: userInfo.email ?? "", name: userInfo.name ?? "", publicKey: pk58 ?? ""}
        }
      }

    }
    return {}
  };

  const logout = async () => {
    if (!web3auth) {
      console.log('web3auth not initialized yet');
      return;
    }

    try {
      await web3auth.logout();
    } catch (error) {
      console.error(error);
    }

    setProvider(null);
    setLoggedIn(false);
    console.log('Disconnected');
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'small' }}>
        <h1 style={{ textAlign: 'center' }}>{!loggedIn ? 'Site is not connected' : 'Site is connected'}</h1>
      </div>
      <div id="phaser-container" className="App"></div>
    </>
  );
}

export default App;