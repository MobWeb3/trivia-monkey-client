
import axios from 'axios';
import { BASE_URL } from '../ApiServiceConfig';

export const generateQuestions = async (data: any) => {
    const topics  = data.topics as string[];
    const result: any = {};

    await Promise.all(topics.map(async (topic) => {
        if (!topic.includes("custom:")) {
            try {
                console.log("GENERATING QUESTIONS FOR TOPIC: ", topic);
                const response = await axios.post(`${BASE_URL}/api/openai/generalTopicQuestions`, {topic});
                result[topic] = response.data;
            } catch (error) {
                console.error(error);
            }
        }
    }));

    return result;
}