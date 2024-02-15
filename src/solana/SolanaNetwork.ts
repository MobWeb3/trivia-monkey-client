interface RpcUrls {
    public: {
      http: string[];
    };
    default: {
      http: string[];
    };
  }
  
  interface BlockExplorers {
    default: {
      name: string;
      url: string;
    };
  }
  
  interface NativeCurrency {
    name: string;
    symbol: string;
    decimals: number;
  }
  
  export interface SolanaNetwork {
    name: string;
    network: string;
    nativeCurrency: NativeCurrency;
    rpcUrls: RpcUrls;
    blockExplorers: BlockExplorers;
    testnet: boolean;
  }