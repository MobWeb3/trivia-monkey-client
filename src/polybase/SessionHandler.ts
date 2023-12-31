import axios from 'axios';
import { BASE_URL } from '../ApiServiceConfig';

export const createSession = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/createSession`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    return false;
}

export const updateSessionPhase = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/session/updatePhase`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    return false;
}

export const getSessionPhase = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/session/getGamePhase`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    return false;
}

export const updateInitialTurnPosition = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/session/updateInitialTurnPosition`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    return false;
}

export const getSession = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/session/getSession`, data);
        return response.data.session;
    } catch (error) {
        console.error(error);
    }
    return false;
}


export const getHostId = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/session/getHostPlayerId`, data);
        const { hostPlayerId } = response.data;
        return hostPlayerId;
    } catch (error) {
        console.error(error);
    }
    return false;
}

export const updateTopics = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/session/updateTopics`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    return false;
}

// add player to player list
export const addPlayer = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/session/addPlayer`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    return false;
}

export const updatePlayerListOrder = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/session/sortPlayerOrders`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    return false;
}

export const setCurrentTurnPlayerId = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/session/setCurrentTurnPlayerId`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    return false;
}

export const getNextTurnPlayerId = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/session/getNextTurnPlayerId`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    return false;
}

export const updateQuestionSessionId = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/session/setQuestionSessionId`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    return false;
}

export const addPointToPlayer = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/session/addPointToPlayer`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    return false;
}

// setWinner 
export const setWinner = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/session/setWinner`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    return false;
}