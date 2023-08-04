import React, { useContext, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { SafeEventEmitterProvider } from "@web3auth/base";
import { getZeroDevSigner, getRPCProviderOwner } from '@zerodevapp/sdk'
import { SignerContext } from './components/SignerContext';
import { Contract } from 'ethers'

function App() {

  const [, setProvider] = useState<SafeEventEmitterProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const { signer, web3auth, setSigner } = useContext(SignerContext);

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
  };

  const mint = async () => {

    const address = await signer?.getAddress();
    const contractAddress = '0x34bE7f35132E97915633BC1fc020364EA5134863'
    const contractABI = [
      'function mint(address _to) public',
      'function balanceOf(address owner) external view returns (uint256 balance)'
    ]

    if (!signer) {
      console.log("signer not initialized yet");
      return;
    }
    const nftContract = new Contract(contractAddress, contractABI, signer);

    const receipt = await nftContract.mint(address)
    await receipt.wait()
    console.log(`NFT balance: ${await nftContract.balanceOf(address)}`)


  }

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  return (

    <div className="App">
      <header className="App-header">
        {/* <SponsoredGasExample /> */}
        <img src={logo} className="App-logo" alt="logo" />
        {!loggedIn ? (
          <button onClick={login}>Login</button>
        ) : (
          <>
            <button onClick={mint}>Mint</button>
            <button onClick={logout}>Logout</button>
          </>
        )}

      </header>
    </div>
  );
}

export default App;


/**
 * One of your dependencies, babel-preset-react-app, is importing the
"@babel/plugin-proposal-private-property-in-object" package without
declaring it in its dependencies. This is currently working because
"@babel/plugin-proposal-private-property-in-object" is already in your
node_modules folder for unrelated reasons, but it may break at any time.

babel-preset-react-app is part of the create-react-app project, which
is not maintianed anymore. It is thus unlikely that this bug will
ever be fixed. Add "@babel/plugin-proposal-private-property-in-object" to
your devDependencies to work around this error. This will make this message
go away.

 */