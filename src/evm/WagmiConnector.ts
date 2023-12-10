import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { avalancheFuji, polygonMumbai } from "viem/chains";
import { createConfig, configureChains, mainnet, sepolia } from "wagmi";
import { publicProvider } from 'wagmi/providers/public'
import { Web3Auth } from "@web3auth/modal";


export const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet, sepolia, polygonMumbai, avalancheFuji],
    [publicProvider()],
)

export function getWagmiConfig(web3AuthInstance?: Web3Auth) {

    if (!web3AuthInstance) {
        console.log("No web3AuthInstance");
        return createConfig({
            autoConnect: false,
            connectors: [
                // new InjectedConnector({
                //     chains,
                //     options: {
                //         name: "Injected",
                //         shimDisconnect: true,
                //     },
                // }),
            ],
            publicClient,
            webSocketPublicClient,
        });
    }
    console.log("Web3AuthInstance with Web3AuthConnector");
    return createConfig({
        autoConnect: true,
        connectors: [
            new Web3AuthConnector({
                chains,
                options: {
                    web3AuthInstance,
                },
            }),
            // new InjectedConnector({
            //     chains,
            //     options: {
            //         name: "Injected",
            //         shimDisconnect: true,
            //     },
            // }),
        ],
        publicClient,
        webSocketPublicClient,
    });
}