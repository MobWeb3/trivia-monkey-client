import axios from 'axios';
import { BASE_URL } from "../ApiServiceConfig";
import { MetaphorEntry } from '../game-domain/metaphor/MetaphorEntry';


// Get topic entries from text
export const getTopicEntries = async (topic: string): Promise<MetaphorEntry[]> => {
    const response = await axios.post(`${BASE_URL}/api/metaphor/search`, { topic });
    return response.data;
};