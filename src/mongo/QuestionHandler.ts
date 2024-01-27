// import axios from 'axios';
// import { MENG_URL } from '../ApiServiceConfig';
import { Topic } from '../components/topics/TopicContext';

/**
 * Dispatch a request to the backend to add questions to the database or make
 * sure they are there.
 * @returns Returns if the request was successful
 */
export const requestQuestions= async (topics: Topic[]) => {
    try {
        // const response = await axios.post(`${MENG_URL}/api/mongo/addQuestions`, data);
        // return response.data as Player;
    } catch (error) {
        console.error(error);
        throw error;
    }
}