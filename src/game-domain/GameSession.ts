import { PlayerOrderType } from "./Player";

export interface MutableGameSession {
    sessionId: string;
    channelId: string;
    hostPlayerId: string;
    pointsToWin: number;
    numberPlayers: number;
    currentPhase?: string;
    gamePhase?: string;
    topics?: string[];
    currentTurnPlayer: PlayerOrderType;
    playerList?: PlayerOrderType[];
    gameBoardState?: { [key: string]: number };
    winner?: string;
    questionSessionId?: string;
}

// Define the read-only session interface based on the mutable session interface
export type GameSession = Readonly<MutableGameSession>;