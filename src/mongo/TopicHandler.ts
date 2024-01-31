import axios from 'axios';
import { BASE_URL } from '../ApiServiceConfig';
import { Topic } from '../game-domain/Topic';

export const getAllGeneralTopics = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/mongo/getAllGeneralTopics`);
        return response.data as Topic[];
    } catch (error) {
        console.error(error);
        throw error;
    }
}
