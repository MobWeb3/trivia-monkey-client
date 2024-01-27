import axios from 'axios';
import { BASE_URL } from '../ApiServiceConfig';
import { GameSession } from '../game-domain/GameSession';

interface ApiPostParams {
    url: string;
    data: any;
}

async function apiPost({ url, data }: ApiPostParams): Promise<GameSession> {
    try {
        const response = await axios.post(`${BASE_URL}${url}`, data);
        return response.data as GameSession;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getSession = async (sessionId: string) => {
    return apiPost({
        url: '/api/mongo/getSession',
        data: { sessionId },
    });
}

export const createSession = async (gameSession: GameSession) => {
    return await apiPost({
        url: '/api/mongo/createSession',
        data: gameSession,
    });
}

export const updateSession = async (sessionId: string, updateData: GameSession) => {
    return apiPost({
        url: '/api/mongo/updateSession',
        data: { sessionId, updateData },
    });
}

export const updateInitialTurnPosition = async ({ sessionId, playerId, position }:
    { sessionId: string, playerId: string, position: number }) => {
    return apiPost({
        url: '/api/mongo/updateInitialTurnPosition',
        data: { sessionId, playerId, position },
    });
}

export const addTopics = async ({ sessionId, topics }:
    {
        sessionId: string,
        topics: string[],
    }) => {
    return apiPost({
        url: '/api/mongo/addTopics',
        data: { sessionId, topics },
    });
}

export const addPlayer = async ({ sessionId, playerId }:
    {
        sessionId: string,
        playerId: string,
    }
) => {
    return apiPost({
        url: '/api/mongo/addPlayer',
        data: { sessionId, playerId },
    });
}

export const sortPlayerList = async (sessionId: string) => {
    return apiPost({
        url: '/api/mongo/sortPlayerList',
        data: { sessionId },
    });
}

export const getNextTurnPlayerId = async (sessionId: string) => {
    return apiPost({
        url: '/api/mongo/getNextTurnPlayerId',
        data: { sessionId },
    });
}

export const addPointToPlayer = async ({sessionId, playerId}:
     {sessionId: string, playerId: string}) => {
    return apiPost({
        url: '/api/mongo/addPointToPlayer',
        data: { sessionId, playerId },
    });
}
