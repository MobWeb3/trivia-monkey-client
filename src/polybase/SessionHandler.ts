import axios from 'axios';
import { BASE_URL } from '../MonkeyTriviaServiceConstants';


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
        console.log('getSession response data: ', response.data);
        console.log('getSession response: ', response.data.session);
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