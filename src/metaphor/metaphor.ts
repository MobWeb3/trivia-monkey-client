import axios from 'axios';
import { BASE_AI_URL } from "../ApiServiceConfig";
import { MetaphorEntry } from '../game-domain/metaphor/MetaphorEntry';


// Get topic entries from text
export const getTopicEntries = async (topic: string): Promise<MetaphorEntry[]> => {
    const response = await axios.post(`${BASE_AI_URL}/api/topic`, { topic });
    return response.data;
};