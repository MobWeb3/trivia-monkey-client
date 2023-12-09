export interface NftGameSession {
    readonly name?: string;
    readonly tokenUri?: string;
    readonly description?: string;
    readonly image?: string;
    readonly contract?: string;
    readonly tokenId?: number;
    readonly owner?: string;
    readonly timestampMint?: string;
    readonly attributes?: readonly Trait[];
}

// Define the interface
interface Trait {
    value: string;
    trait_type: string;
}

