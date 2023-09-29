import { useContext, useEffect, useState } from 'react';
import './MainHome.css';
import '../PhaserGame';
import { addMessageListener, removeMessageListener } from '../utils/MessageListener';
import { SignerContext } from '../components/SignerContext';
import { getRPCProviderOwner, getZeroDevSigner } from '@zerodevapp/sdk';
import { SafeEventEmitterProvider } from '@web3auth/base';
import { Messages } from '../utils/Messages';
import { createUser, userExists } from '../polybase/UserHandler';
import { createChannelListenerWrapper, enterChannelListenerWrapper } from '../ably/ChannelListener';
import { getConnectedPublicKey } from '../utils/Web3AuthAuthentication';

function App() {
  const { web3auth } = useContext(SignerContext);
  const [, setProvider] = useState<SafeEventEmitterProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const tryConnection = async (_data: any) => {
      // console.log('tryConnection data:', _data);
      const userData = await login();
      // check if user exist in polybase
      // if not, create user
      if (!userData.clientId) {
        console.log('publicKey not initialized yet');
        return;
      }
      const userExist = await userExists(userData.clientId);
      if (!userExist) {
        console.log('user does not exist, creating user');
        // create user
        await createUser(userData);
      }
    };

    const disconnect = async () => {
      await logout();
    };

    const handleCreateChannel = async (data: any) => {
       if (web3auth) {
           await createChannelListenerWrapper(web3auth, data);
       }
    };
  
    const handleEnterChannel = async (data: any) => {
      if (web3auth) await enterChannelListenerWrapper(web3auth, data); 
    };

    addMessageListener(Messages.TRY_CONNECTION, tryConnection);
    addMessageListener(Messages.TRY_DISCONNECT, disconnect);
    addMessageListener(Messages.CREATE_CHANNEL, handleCreateChannel);
    addMessageListener(Messages.ENTER_CHANNEL, handleEnterChannel);

    return () => {
      removeMessageListener(Messages.TRY_CONNECTION, tryConnection);
      removeMessageListener(Messages.TRY_DISCONNECT, disconnect);
      removeMessageListener(Messages.CREATE_CHANNEL, handleCreateChannel);
      removeMessageListener(Messages.ENTER_CHANNEL, handleEnterChannel);
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

      // setSigner(_signer);
      // console.log("signer created: ", signer);
      console.log("signer address", await _signer.getAddress());
    } else {
      const userInfo = await web3auth.getUserInfo();
      const publicKey = await getConnectedPublicKey(web3auth);
      console.log(`publick key: ${publicKey?.toString()}, ${publicKey?.toBase58()}`);
      return { 
        clientId: userInfo.email ?? "",
        name: userInfo.name ?? "",
        publicKey: publicKey ?? ""
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