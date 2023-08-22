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
import { createChannelListener } from '../ably/channelListener';

function App() {
  const { signer, web3auth, setSigner } = useContext(SignerContext);
  const [, setProvider] = useState<SafeEventEmitterProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const tryConnection = async (data: any) => {
      console.log('tryConnection data:', data);
      await login();
    };

    const disconnect = async (data: any) => {
      await logout();
    };

    addMessageListener(Messages.TRY_CONNECTION, tryConnection);
    addMessageListener(Messages.TRY_DISCONNECT, disconnect);
    addMessageListener(Messages.CREATE_CHANNEL, createChannelListener);

    return () => {
      removeMessageListener(Messages.TRY_CONNECTION, tryConnection);
      removeMessageListener(Messages.TRY_DISCONNECT, disconnect);
      removeMessageListener(Messages.CREATE_CHANNEL, createChannelListener);
    };
  });

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
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
          const publicKey = await mySolanaWallet.getPublicKey();
          console.log("web3auth account info: ", await web3auth.getUserInfo());
          console.log("solana publicKey: ", publicKey.toString());
          // console.log("private key: ", await mySolanaWallet.getPrivateKey());
        }
        
      }

    }

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