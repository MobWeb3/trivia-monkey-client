import { useContext, useEffect, useState } from 'react';
import './App.css'
import './PhaserGame'
import { addMessageListener, removeMessageListener, sendMessage } from './utils/MessageListener';
import { SignerContext } from './components/SignerContext';
import { getRPCProviderOwner, getZeroDevSigner } from '@zerodevapp/sdk';
import { SafeEventEmitterProvider } from "@web3auth/base";


function App() {
	
	const { signer, web3auth, setSigner } = useContext(SignerContext);
	const [, setProvider] = useState<SafeEventEmitterProvider | null>(null);
	const [loggedIn, setLoggedIn] = useState(false);
	
	useEffect(() => {

		console.log("App.tsx useEffect");
		const tryConnection = async (data: any) => {
			// Handle the received data from Phaser
			console.log('tryConnection data:', data);
			login();
			setLoggedIn(true);
		};
		
		const disconnect = async (data: any) => {
			logout();
		};
		
		// Add a listener for the 'dataEvent' from Phaser
		addMessageListener('TryConnection', tryConnection);
		
		// Add a listener for the 'dataEvent' from Phaser
		addMessageListener('Disconnect', disconnect);
		
		// Clean up the listener when the component unmounts
		return () => {
			removeMessageListener('TryConnection', tryConnection);
		};
	}, []);
	
	const login = async () => {
		if (!web3auth) {
			console.log("web3auth not initialized yet");
			return;
		}
		const web3authProvider = await web3auth.connect();
		setProvider(web3authProvider);
		setLoggedIn(true);
		
		const _signer = await getZeroDevSigner({
			projectId: "5682ee04-d8d3-436a-ae63-479e063a23c4",
			owner: getRPCProviderOwner(web3auth.provider),
		})
		
		setSigner(_signer);
		console.log("signer created: ", signer);
		console.log("signer address", await _signer.getAddress());
		
		// Send phaser the logged in status
		sendMessage('Connected', true);
	};
	
	const logout = async () => {
		if (!web3auth) {
			console.log("web3auth not initialized yet");
			return;
		}
		try {
			await web3auth.logout()
			
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
		)
	}
	
	export default App