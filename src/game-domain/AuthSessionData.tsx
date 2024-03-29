import { UserInfo } from "@web3auth/base";
import { Chain } from "viem";
import { SolanaNetwork } from "../solana/SolanaNetwork";
// import { PublicKey } from '@solana/web3.js';


export interface AuthSessionData {
    userInfo?: Partial<UserInfo>;
    currentNetwork?: Chain | SolanaNetwork;
    currentUserPublicKey?: string;
}
