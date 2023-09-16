
import axios from 'axios';
import { BASE_URL } from '../MonkeyTriviaServiceConstants';

export const generateQuestions = async (data: any) => {

    const topic  = data.topic as string;
    if (topic.includes("custom:")) {
        // your code here
    } else {
        try {
            const response = await axios.post(`${BASE_URL}/api/openai/generalTopicQuestions`, data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
    return false;
}