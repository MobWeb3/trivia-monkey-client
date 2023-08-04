import React, { createContext, useState, PropsWithChildren, useEffect } from 'react';
import { Signer } from 'ethers';
import { Web3Auth } from "@web3auth/modal";
import { configureChains, Chain, PublicClient, WebSocketPublicClient, Config } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { CHAIN_NAMESPACES } from "@web3auth/base";


interface SignerContextType {
  signer: Signer | null;
  web3auth: Web3Auth | null;
  setSigner: (signer: Signer | null) => void;
  setWeb3auth: (web3auth: Web3Auth | null) => void;
}

export const SignerContext = createContext<SignerContextType>({
  signer: null,
  web3auth: null,
  setSigner: () => { },
  setWeb3auth: () => { },
});

interface Props {
  children: React.ReactNode;
}

const polygonMumbai = {
  id: 80001,
  name: "Polygon Mumbai",
  network: "maticmum",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18
  },
  rpcUrls: {
    alchemy: {
      http: ["https://polygon-mumbai.g.alchemy.com/v2"],
      webSocket: ["wss://polygon-mumbai.g.alchemy.com/v2"]
    },
    infura: {
      http: ["https://polygon-mumbai.infura.io/v3"],
      webSocket: ["wss://polygon-mumbai.infura.io/ws/v3"]
    },
    default: {
      http: ["https://rpc.ankr.com/polygon_mumbai"]
    },
    public: {
      http: ["https://rpc.ankr.com/polygon_mumbai"]
    }
  },
  blockExplorers: {
    etherscan: {
      name: "PolygonScan",
      url: "https://mumbai.polygonscan.com"
    },
    default: {
      name: "PolygonScan",
      url: "https://mumbai.polygonscan.com"
    }
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 25770160
    }
  },
  testnet: true
};


const { chains } = configureChains([polygonMumbai as Chain], [publicProvider()]);




export const SignerProvider: React.FC<PropsWithChildren<Props>> = ({ children }) => {
  const [signer, setSigner] = useState<Signer | null>(null);
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [web3AuthConnector, setWeb3AuthConnector] = useState<Web3AuthConnector>();

  const clientId = "BLawc_CSIedtl9Rt2J6XJidEmc5CF_ZHk538Rp8V1sBlv_sllZEOPZqginP7t0KLcLPrqhACT0B_pS3pNlv_cfQ";


  const [config, setConfig] = useState<Config<PublicClient, WebSocketPublicClient>>()

  const init = async () => {
    try {
      const _web3auth = new Web3Auth({
        clientId,
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x13881",
          rpcTarget: "https://rpc.ankr.com/polygon_mumbai", // This is the public RPC we have added, please pass on your own endpoint while creating an app
        },
        uiConfig: {
          appName: "Monkey Trivia",
          appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg", // Your App Logo Here
          theme: "light",
          loginMethodsOrder: ["google", "facebook", "twitter", "reddit", "discord", "twitch", "apple", "line", "github", "kakao", "linkedin", "weibo", "wechat", "email_passwordless"],
          defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
          loginGridCol: 3,
          primaryButton: "externalLogin", // "externalLogin" | "socialLogin" | "emailLogin"
        },
        web3AuthNetwork: "cyan",
      });
      await _web3auth.initModal();




      if (_web3auth) {
        setWeb3auth(_web3auth);
        console.log("web3auth: ", _web3auth);
        setWeb3AuthConnector(new Web3AuthConnector({
          chains,
          options: {
            web3AuthInstance: _web3auth,
          },
        }))

        // console.log("connected account", await _web3auth.getUserInfo());



        //   if (web3AuthConnector) {



        //       const wagmiConfig = createConfig({
        //       autoConnect: true,
        //       connectors: [
        //         web3AuthConnector,
        //         new InjectedConnector({
        //           chains,
        //           options: {
        //             name: "Injected",
        //             shimDisconnect: true,
        //           },
        //         }),
        //       ],
        //       publicClient,
        //       webSocketPublicClient,
        //     });

        //     setConfig(wagmiConfig as Config<PublicClient, WebSocketPublicClient>);


        //   }
      }

    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    init();
  }, [])

  if (!web3auth) {
    // handle the case where web3auth is null
    console.log("web3auth is null");
    return null;
  }

  return (
    <SignerContext.Provider value={{ signer, web3auth, setSigner, setWeb3auth }}>
      {children}
    </SignerContext.Provider>
  );

};