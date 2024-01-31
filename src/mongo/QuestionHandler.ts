import axios from 'axios';
import { BASE_URL } from '../ApiServiceConfig';
import { Question } from '../game-domain/Question';
import { Topic } from '../game-domain/Topic';

/**
 * Dispatch a request to the backend to add questions to the database or make
 * sure they are there.
 * @returns Returns if the request was successful
 */
export const requestQuestions= async (topics: Topic[]) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/game/requestQuestionsByTopics`, topics);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Get question from the database
 * @returns Returns a Question object
 */
export const getQuestion = async ( {sessionId, topic} :
     {sessionId: string, topic: Topic}): Promise<Question> => {
    try {
        const response = await axios.post(`${BASE_URL}/api/mongo/getQuestionByTopic`, { sessionId, topic } );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}