import { CHAIN_NAMESPACES } from '@web3auth/base';
import { Web3AuthSigner } from "root/packages/signers/src";

const clientId = import.meta.env.VITE_APP_WEB3AUTH_CLIENT_ID ?? "";
const network = import.meta.env.VITE_APP_WEB3AUTH_NETWORK ?? "sapphire_mainnet";

//https://api.testnet.solana.com
//https://api.devnet.solana.com

// export const web3authSolana = new Web3Auth({
//     authMode:"DAPP",
//     clientId: clientId,
//     chainConfig: {
//       chainNamespace: CHAIN_NAMESPACES.SOLANA,
//       chainId: '0x3',
//       rpcTarget: "https://api.devnet.solana.com", // This is the mainnet RPC we have added, please pass on your own endpoint while creating an app
//       displayName: "solana",
//       ticker: "SOL",
//       tickerName: "solana",
//     },
//     // uiConfig: {
//       // theme: 'light',
//       // loginMethodsOrder: ['facebook', 'google'],
//       // appLogo: 'https://web3auth.io/images/w3a-L-Favicon-1.svg' // Your App Logo Here
//     // },
//     web3AuthNetwork: network,
// });

export const createWeb3AuthSolanaSigner = async () => {
  const web3AuthSigner = new Web3AuthSigner({
    authMode:"DAPP",
      clientId,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.SOLANA,
        chainId: '0x3',
        rpcTarget: "https://api.devnet.solana.com", // This is the mainnet RPC we have added, please pass on your own endpoint while creating an app
        displayName: "solana",
        ticker: "SOL",
        tickerName: "solana",
      },
      web3AuthNetwork: network,
    });

  await web3AuthSigner.authenticate({
    init: async () => {
      // console.log("init");
      await web3AuthSigner.inner.initModal();
    },
    connect: async () => {
      // console.log("connect");
      await web3AuthSigner.inner.connect();
    },
  });

  return web3AuthSigner;
}