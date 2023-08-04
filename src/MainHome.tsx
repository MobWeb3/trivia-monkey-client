import { useContext, useEffect, useState } from 'react';
import './App.css';
import './PhaserGame';
import { addMessageListener, removeMessageListener, sendMessage } from './utils/MessageListener';
import { SignerContext } from './components/SignerContext';
import { getRPCProviderOwner, getZeroDevSigner } from '@zerodevapp/sdk';
import { SafeEventEmitterProvider } from '@web3auth/base';
import { Messages } from './utils/Messages';

function App() {
  const { signer, web3auth, setSigner } = useContext(SignerContext);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
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

    return () => {
      removeMessageListener(Messages.TRY_CONNECTION, tryConnection);
      removeMessageListener(Messages.TRY_DISCONNECT, disconnect);
    };
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log('web3auth not initialized yet');
      return;
    }

    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    setLoggedIn(true);

    const _signer = await getZeroDevSigner({
      projectId: '5682ee04-d8d3-436a-ae63-479e063a23c4',
      owner: getRPCProviderOwner(web3auth.provider),
    });

    setSigner(_signer);
    console.log('signer created:', _signer);
    console.log('signer address:', await _signer.getAddress());

    sendMessage(Messages.IS_CONNECTED, true);
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