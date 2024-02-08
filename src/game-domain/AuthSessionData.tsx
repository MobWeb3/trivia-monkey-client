import { UserInfo } from "@web3auth/base";
import { Chain } from "viem";
import { SolanaNetwork } from "../solana/SolanaNetwork";

export interface AuthSessionData {
    userInfo?: Partial<UserInfo>;
    currentNetwork?: Chain | SolanaNetwork;
}
