
// TODO - "root/packages/signers/src" should've been in the package @alchemy/aa-signers
// package is not published yet, so we have to copy it here
import { Web3AuthSigner } from "root/packages/signers/src";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { sepolia } from "viem/chains";
import { LightSmartContractAccount, getDefaultLightAccountFactoryAddress } from "@alchemy/aa-accounts";

/* Mainnet Ethereum*/
// const clientId = import.meta.env.VITE_APP_WEB3AUTH_CLIENT_ID ?? "";
// const network = import.meta.env.VITE_APP_WEB3AUTH_NETWORK ?? "sapphire_mainnet";
// const chain = mainnet;

/* Mumbai */
// const clientId = import.meta.env.VITE_APP_WEB3AUTH_CLIENT_ID_EVM_TESTNET ?? "";
// const network = import.meta.env.VITE_APP_WEB3AUTH_NETWORK_TESTNET ?? "";
// const chain = polygonMumbai;

/* Sepolia */
const clientId = import.meta.env.VITE_APP_WEB3AUTH_CLIENT_ID_EVM_TESTNET ?? "";
const network = import.meta.env.VITE_APP_WEB3AUTH_NETWORK_TESTNET ?? "";
const chain = sepolia;

export const createWeb3AuthSigner = async () => {
  const web3AuthSigner = new Web3AuthSigner({
    authMode:"DAPP",
    clientId,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x" + chain.id.toString(16),
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
};

export function getProvider(signer: Web3AuthSigner) {
  // const API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY_SEPOLIA ?? "";
  const API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY_MUMBAI ?? "";

  // Create a provider to send user operations from your smart account
  return new AlchemyProvider({
    apiKey: API_KEY,
    chain,
  }).connect(
    (rpcClient) =>
      new LightSmartContractAccount({
        chain,
        owner: signer,
        factoryAddress: getDefaultLightAccountFactoryAddress(chain),
        rpcClient,
      })
  );
}