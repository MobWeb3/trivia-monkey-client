
export interface MutableGameSession {
    sessionId: string;
    channelId: string;
    hostPlayerId: string;
    pointsToWin: number;
    numberPlayers: number;
    currentPhase?: string;
    gamePhase?: string;
    topics?: string[];
    currentTurnPlayerId?: string;
    playerList?: string[] | undefined;
    gameBoardState?: { [key: string]: number };
    winner?: string;
    questionSessionId?: string;
}

// Define the read-only session interface based on the mutable session interface
export type GameSession = Readonly<MutableGameSession>;