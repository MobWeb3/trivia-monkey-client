import axios from 'axios';
import { BASE_AI_URL, BASE_URL } from '../ApiServiceConfig';
import { Topic } from '../components/topics/TopicContext';

const BASE_PAPERSPACE_HOST = `${BASE_AI_URL}/api`;
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

    // create the following array of {id: string, topic: string} objects
    const customTopics = topics.map((topic) => {
        if (topic[1].length > 0) {
            const topicName = topic[0];
            const id = topic[1];
            return {id, topic: topicName};
        }
        return {};
    });

    try {
        // const ids = [topic[1]];
        console.log("GENERATING CUSTOM QUESTIONS FOR TOPICS: ", customTopics);
        const response = await axios.post(getUrl, customTopics);
        result['customTopics'] = response.data;
    } catch (error) {
        console.error(error);
    }

    await Promise.all(topics.map(async (topic) => {
        // If the topic has empty id, it is a general topic question
        if (topic[1].length === 0) {
            try {
                console.log("GENERATING GENERAL QUESTIONS FOR TOPIC: ", topic[0]);
                const response = 
                    await axios.post(
                        `${BASE_URL}/api/openai/generalTopicQuestions`,
                        {topic: topic[0]}
                    );
                result[topic[0]] = response.data;
            } catch (error) {
                console.error(error);
            }
        }
    }));

    return result;
}
