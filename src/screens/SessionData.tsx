import { Web3AuthSigner } from "root/packages/signers/src";

export interface SessionData {
    name?: string;
    sessionId?: string;
    clientId?: string;
    channelId?: string;
    web3AuthSigner?: Web3AuthSigner
    nftWalletNetwork?: string;
}
