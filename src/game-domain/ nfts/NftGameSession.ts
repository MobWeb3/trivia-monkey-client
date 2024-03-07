import { NftRawMetadata } from "alchemy-sdk";
import { GameSession } from "../GameSession";

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
    readonly session?: GameSession;
}

export interface MutableNftGameSession {
    name?: string;
    tokenUri?: string;
    description?: string;
    image?: string;
    contract?: string;
    tokenId?: string;
    owner?: string;
    timestampMint?: string;
    attributes?: Record<string, any>[];
    raw?: NftRawMetadata;
    session?: GameSession;
  }


