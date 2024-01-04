import axios from 'axios';
import { BASE_URL } from '../ApiServiceConfig';
import { Player } from '../game-domain/Player';

export const userExists = async (clientId: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/mongo/userExists`, {
            id: clientId
        });
        return response.data as boolean;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const createUser = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/mongo/addUser`, data);
        return response.data as Player;
    } catch (error) {
        console.error(error);
        throw error;
    }
}