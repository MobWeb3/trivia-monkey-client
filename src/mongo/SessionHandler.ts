import axios from 'axios';
import { BASE_URL } from '../ApiServiceConfig';
import { GameSession } from '../game-domain/GameSession';

export const getSession = async (sessionId: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/mongo/getSession`, { sessionId });
        return response.data.session;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const createSession = async (gameSession: GameSession) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/mongo/createSession`, gameSession);
        return response.data.session;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updateSession = async (sessionId: string, updateData: GameSession) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/mongo/updateSession`, { sessionId, updateData });
        return response.data.session;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const updateInitialTurnPosition = async ({ sessionId, playerId, position }: 
    { sessionId: string, playerId: string, position: number }) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/mongo/updateInitialTurnPosition`, {
            sessionId, playerId, position
        });
        return response.data.session;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// export const updateTopics = async (sessionId: string, topics: string[]) => {
//     try {
//         const response = await axios.post(`${BASE_URL}/api/mongo/updateTopics`, { sessionId, topics });
//         return response.data.session;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

// export const addPlayer = async (sessionId: string, playerId: string) => {
//     try {
//         const response = await axios.post(`${BASE_URL}/api/mongo/addPlayer`, { sessionId, playerId });
//         return response.data.session;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

// export const updatePlayerListOrder = async (sessionId: string, playerListOrder: string[]) => {
//     try {
//         const response = await axios.post(`${BASE_URL}/api/mongo/updatePlayerListOrder`, { sessionId, playerListOrder });
//         return response.data.session;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

// export const setCurrentTurnPlayerId = async (sessionId: string, playerId: string) => {
//     try {
//         const response = await axios.post(`${BASE_URL}/api/mongo/setCurrentTurnPlayerId`, { sessionId, playerId });
//         return response.data.session;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

// export const getNextTurnPlayerId = async (sessionId: string) => {
//     try {
//         const response = await axios.post(`${BASE_URL}/api/mongo/getNextTurnPlayerId`, { sessionId });
//         return response.data;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

// export const updateQuestionSessionId = async (sessionId: string, questionSessionId: string) => {
//     try {
//         const response = await axios.post(`${BASE_URL}/api/mongo/updateQuestionSessionId`, { sessionId, questionSessionId });
//         return response.data.session;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

// export const addPointToPlayer = async (sessionId: string, playerId: string) => {
//     try {
//         const response = await axios.post(`${BASE_URL}/api/mongo/addPointToPlayer`, { sessionId, playerId });
//         return response.data.session;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

// export const setWinner = async (sessionId: string, playerId: string) => {
//     try {
//         const response = await axios.post(`${BASE_URL}/api/mongo/setWinner`, { sessionId, playerId });
//         return response.data.session;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }
