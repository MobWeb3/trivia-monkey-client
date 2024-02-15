interface CollectionOption {
    verified: boolean;
    key: string;
  }
  
  interface Collection {
    __option: "Some" | "None";
    value?: CollectionOption;
  }
  
  export interface NftMintData {
    mint: string;
    name: string;
    uri: string;
    symbol: string;
    collection: Collection;
  }