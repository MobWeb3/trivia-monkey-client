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

export const addQuestions = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/questions/addQuestions`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    return false;
}