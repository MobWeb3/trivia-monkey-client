import axios from "axios";
import { BASE_URL } from "../ApiServiceConfig";

interface FrameData {
    name: string;
    numberOfQuestions: number;
    topic: {
        name: string;
        metaphor_id: string;
    }
    scoreToPass: number;
    collectionMint: string;
}

export const createFrame = async (data: FrameData) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/frames/createFrame`, data, {
            timeout: 15000,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}