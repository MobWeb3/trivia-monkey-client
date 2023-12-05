
// TODO - "root/packages/signers/src" should've been in the package @alchemy/aa-signers
// package is not published yet, so we have to copy it here
import { Web3AuthSigner } from "root/packages/signers/src";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { polygonMumbai } from "viem/chains";
import { LightSmartContractAccount, getDefaultLightAccountFactoryAddress } from "@alchemy/aa-accounts";

const clientId = import.meta.env.VITE_APP_WEB3AUTH_CLIENT_ID ?? "";
const network = import.meta.env.VITE_APP_WEB3AUTH_NETWORK ?? "sapphire_mainnet";
const chain = polygonMumbai;

export const createWeb3AuthSigner = async () => {
  const web3AuthSigner = new Web3AuthSigner({
    authMode:"DAPP",
    clientId,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155
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
  const API_KEY = "BZ_AjTOiiBVS4HeOniNodOUXTL5WS8nG";

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