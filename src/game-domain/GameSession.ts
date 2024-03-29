import { PlayerOrderType } from "./Session";
import { Topic } from "./Topic";

export interface MutableGameSession {
    sessionId: string;
    channelId: string;
    hostPlayerId: string;
    pointsToWin: number;
    numberPlayers: number;
    currentPhase?: string;
    gamePhase?: string;
    topics?: Topic[];
    currentTurnPlayer: PlayerOrderType;
    playerList?: PlayerOrderType[];
    winner?: PlayerOrderType;
    ignoranceMonkey?: PlayerOrderType;
}

// Define the read-only session interface based on the mutable session interface
export type GameSession = Readonly<MutableGameSession>;