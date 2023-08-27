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