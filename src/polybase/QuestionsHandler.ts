import axios from 'axios';
import { BASE_URL } from '../MonkeyTriviaServiceConstants';

export const createQuestionSession = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/questions/createQuestion`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    return false;
}

export const addTopicToQuestionSession = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/questions/addTopic`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    return false;
}