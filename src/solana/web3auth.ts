import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from '@web3auth/base';

const clientId = process.env.REACT_APP_WEB3AUTH_CLIENT_ID ?? "";

//https://api.testnet.solana.com
//https://api.devnet.solana.com

export const web3authSolana = new Web3Auth({
    authMode:"DAPP",
    clientId: clientId,
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.SOLANA,
      chainId: '0x3',
      rpcTarget: "https://api.devnet.solana.com", // This is the mainnet RPC we have added, please pass on your own endpoint while creating an app
      displayName: "solana",
      ticker: "SOL",
      tickerName: "solana",
    },
    uiConfig: {
      theme: 'light',
      loginMethodsOrder: ['facebook', 'google'],
      appLogo: 'https://web3auth.io/images/w3a-L-Favicon-1.svg' // Your App Logo Here
    },
    web3AuthNetwork: "cyan",
});