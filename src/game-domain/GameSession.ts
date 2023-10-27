import { Types } from 'ably';

export interface GameSession {
    readonly id?: string;
    readonly channelId?: string;
    readonly currentPhase?: string;
    readonly channel?: Types.RealtimeChannelPromise;
    readonly initialTurnPositions?: any;
    readonly numberPlayers?: number;
    readonly gamePhase?: string;
    readonly topics?: readonly [];
    readonly currentTurnPlayerId?: string;
}