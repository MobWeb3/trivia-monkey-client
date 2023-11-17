
import axios from 'axios';
import { BASE_URL } from '../ApiServiceConfig';
import { Topic } from '../components/topics/TopicContext';

const BASE_PAPERSPACE_HOST = "http://74.82.30.101:5000/api";
const GENERATE_QUESTIONS_URL = `${BASE_PAPERSPACE_HOST}/generateQuestions`;
const GENERATE_QUESTIONS_33_URL = `${BASE_PAPERSPACE_HOST}/generateQuestions33`;

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

export const generateAllQuestions = async (topics: Topic[], isFastCreation: boolean=false) => {
    // const topics  = data.topics as string[];
    const result: any = {};

    const getUrl = isFastCreation ? GENERATE_QUESTIONS_33_URL : GENERATE_QUESTIONS_URL;

    await Promise.all(topics.map(async (topic) => {
        // If the topic has an id, it is a custom topic
        if (topic[1].length > 0) {
            try {
                const ids = [topic[1]];
                console.log("GENERATING CUSTOM QUESTIONS FOR TOPIC: ", topic);
                const response = await axios.post(getUrl, {ids, topic: topic[0]});
                result[topic[0]] = response.data;
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                console.log("GENERATING GENERAL QUESTIONS FOR TOPIC: ", topic);
                const response = await axios.post(`${BASE_URL}/api/openai/generalTopicQuestions`, {topic});
                result[topic[0]] = response.data;
            } catch (error) {
                console.error(error);
            }
        }
    }));

    return result;
}

// Generate only 33% of the questions for each topic for Create Game.
//  This is to reduce the time it takes to create a game.
export const generate33PercentOfQuestionsForCreateGame = async (ids: string[], topic: string) => {
    try {
        // const ids = [topic[1]];
        console.log("GENERATING CUSTOM QUESTIONS FOR TOPIC: ", topic);
        const response = await axios.post(`http://74.82.30.101:5000/api/generateQuestions33`, {ids, topic: topic[0]});
        return response.data;
    } catch (error) {
        console.error(error);
    }
}


