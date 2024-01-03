import React, { createContext, useState, PropsWithChildren, useEffect } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { web3authSolana } from '../solana/web3auth';

interface SignerContextType {
  web3auth: Web3Auth | undefined;
  setWeb3auth: (web3auth: Web3Auth | undefined) => void;
}

export const SignerContext = createContext<SignerContextType>({
  web3auth: undefined,
  setWeb3auth: () => { }
});

interface Props {
  children: React.ReactNode;
}

export const SignerProvider: React.FC<PropsWithChildren<Props>> = ({ children }) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | undefined >(undefined);
  const [loading, setLoading] = useState(true);

  const init = async () => {
    try {
      const isEvmChain = import.meta.env.VITE_APP_EVM_CHAIN === 'true';
      let web3auth;
      if (isEvmChain){
        console.log("isEvmChain- SignerContext");
      } else {
        web3auth = web3authSolana;
        await web3auth.initModal();
        if (web3auth) {
          setWeb3auth(web3auth);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };


  useEffect(() => {
    init();
  }, [])

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <SignerContext.Provider value={{ web3auth, setWeb3auth }}>
      {children}
    </SignerContext.Provider>
  );

};