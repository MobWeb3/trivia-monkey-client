import { Types } from 'ably';

export interface GameSession {
    readonly id?: string;
    readonly channelId?: string;
    readonly currentPhase?: string;
    readonly channel?: Types.RealtimeChannelPromise;
    readonly initialTurnPosition?: any;
    readonly numberPlayers?: number;
    readonly gamePhase?: string;
    readonly topics?: readonly [];
    readonly currentTurnPlayerId?: string;
    readonly hostPlayerId?: string;
    readonly playerList?: readonly [];
    readonly pointsToWinTheGame?: number;
    readonly gameBoardState?: Readonly<{ [key: string]: number }>;
    readonly winner?: string;
}