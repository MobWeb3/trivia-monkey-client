import axios from 'axios';
import { BASE_URL } from '../ApiServiceConfig';
import { Player } from '../game-domain/Player';

export const userExists = async (email: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/mongo/userExistsByEmail`, {
            email
        });
        return response.data as boolean;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const createUser = async (data: Player) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/mongo/addUser`, data);
        return response.data as Player;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getUserFromEmail = async (email: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/mongo/getUserFromEmail`, {
            email
        });
        return response.data as Player;
    } catch (error) {
        console.error(error);
        throw error;
    }
}