import axios from 'axios';
import { BASE_URL } from '../ApiServiceConfig';

export const getSession = async (sessionId: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/mongo/getSession`, {sessionId});
        return response.data.session;
    } catch (error) {
        console.error(error);
        throw error;
    }
}