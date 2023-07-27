import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";

// const web3auth = new Web3Auth({
//   clientId: "YOUR_WEB3AUTH_CLIENT_ID", // get it from Web3Auth Dashboard
//   web3AuthNetwork: "cyan",
//   chainConfig: {
//     chainNamespace: CHAIN_NAMESPACES.EIP155,
//     chainId: "0x89", // hex of 137, polygon mainnet
//     rpcTarget: "https://rpc.ankr.com/polygon",
//     // Avoid using public rpcTarget in production.
//     // Use services like Infura, Quicknode etc
//     displayName: "Polygon Mainnet",
//     blockExplorer: "https://polygonscan.com",
//     ticker: "MATIC",
//     tickerName: "Matic",
//   },
// });
// await web3auth.initModal();

// const web3authProvider = web3auth.connect();

// const signer = await getZeroDevSigner({
//   projectId: "<project id>",
//   owner: getRPCProviderOwner(web3auth.provider),
// })

const clientId = "BLawc_CSIedtl9Rt2J6XJidEmc5CF_ZHk538Rp8V1sBlv_sllZEOPZqginP7t0KLcLPrqhACT0B_pS3pNlv_cfQ";

function App() {

  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);


  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x13881",
            rpcTarget: "https://rpc.ankr.com/polygon_mumbai", // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
          uiConfig: {
            appName: "W3A",
            appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg", // Your App Logo Here
            theme: "light",
            loginMethodsOrder: ["google", "facebook", "twitter", "reddit", "discord", "twitch", "apple", "line", "github", "kakao", "linkedin", "weibo", "wechat", "email_passwordless"],
            defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
            loginGridCol: 3,
            primaryButton: "externalLogin", // "externalLogin" | "socialLogin" | "emailLogin"
          },
          web3AuthNetwork: "cyan",
        });

        setWeb3auth(web3auth);
        await web3auth.initModal();

      } catch (error) {
        console.error(error);
      }
    }
    init();
  }, [])

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    setLoggedIn(true);
  };

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
        <img src={logo} className="App-logo" alt="logo" />
        {!loggedIn ? (
          <button onClick={login}>Login</button>
        ) : (
          <button onClick={logout}>Logout</button>
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