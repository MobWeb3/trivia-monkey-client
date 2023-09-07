import React, { createContext, useState, PropsWithChildren, useEffect } from 'react';
import { Signer } from 'ethers';
import { Web3Auth } from "@web3auth/modal";
import { configureChains, Chain } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { polygonMumbai } from '../ethereum/chains';
import { web3authSolana } from '../solana/web3auth';

interface SignerContextType {
  signer: Signer | null;
  web3auth: Web3Auth | null;
  setSigner: (signer: Signer | null) => void;
  setWeb3auth: (web3auth: Web3Auth | null) => void;
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  userInfo: any;
  setUserInfo: (userInfo: any) => void;
}

export const SignerContext = createContext<SignerContextType>({
  signer: null,
  web3auth: null,
  setSigner: () => { },
  setWeb3auth: () => { },
  loggedIn: false,
  setLoggedIn: () => { },
  userInfo: null,
  setUserInfo: () => { },
});

interface Props {
  children: React.ReactNode;
}

const { chains } = configureChains([polygonMumbai as Chain], [publicProvider()]);

export const SignerProvider: React.FC<PropsWithChildren<Props>> = ({ children }) => {
  const [signer, setSigner] = useState<Signer | null>(null);
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [, setWeb3AuthConnector] = useState<Web3AuthConnector>();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  // const [config, setConfig] = useState<Config<PublicClient, WebSocketPublicClient>>()

  const init = async () => {
    try {

      const web3auth = web3authSolana;

      await web3auth.initModal();
      if (web3auth) {
        setWeb3auth(web3auth);
        console.log("web3auth: ", web3auth);
        setWeb3AuthConnector(new Web3AuthConnector({
          chains,
          options: {
            web3AuthInstance: web3auth,
          },
        }))
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
    <SignerContext.Provider value={{ signer, web3auth, setSigner,
     setWeb3auth, loggedIn, setLoggedIn, userInfo, setUserInfo }}>
      {children}
    </SignerContext.Provider>
  );

};