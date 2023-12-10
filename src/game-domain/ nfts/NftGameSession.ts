import { NftRawMetadata } from "alchemy-sdk";

export interface NftGameSession {
    readonly name?: string;
    readonly tokenUri?: string;
    readonly description?: string;
    readonly image?: string;
    readonly contract?: string;
    readonly tokenId?: string;
    readonly owner?: string;
    readonly timestampMint?: string;
    readonly attributes?: readonly Record<string, any>[];
    readonly raw?: NftRawMetadata;
}


