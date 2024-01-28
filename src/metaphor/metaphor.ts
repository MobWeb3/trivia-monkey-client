import axios from 'axios';
import { MENG_URL } from "../ApiServiceConfig";
import { MetaphorEntry } from '../game-domain/metaphor/MetaphorEntry';


// Get topic entries from text
export const getTopicEntries = async (topic: string): Promise<MetaphorEntry[]> => {
    const response = await axios.post(`${MENG_URL}/metaphor/search`, { topic });
    return response.data;
};