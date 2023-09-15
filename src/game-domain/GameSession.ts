import { Types } from 'ably';

export interface GameSession {
    id?: string;
    channelId?: string;
    currentPhase?: string;
    channel?: Types.RealtimeChannelPromise;
    initialTurnPositions?: any;
    numberPlayers?: number;
    gamePhase?: string;
    topics?: [];
    currentTurnPlayerId?: string;
}