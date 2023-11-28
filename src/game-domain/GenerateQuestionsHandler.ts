import axios from 'axios';
import { BASE_AI_URL, BASE_URL } from '../ApiServiceConfig';
import { Topic } from '../components/topics/TopicContext';
import { addQuestions } from '../polybase/QuestionsHandler';

const BASE_PAPERSPACE_HOST = `${BASE_AI_URL}/api`;
const GENERATE_QUESTIONS_URL = `${BASE_PAPERSPACE_HOST}/generateQuestions`;
const GENERATE_QUESTIONS_33_URL = `${BASE_PAPERSPACE_HOST}/generateQuestions33`;

export const generateAllQuestions = async (topics: Topic[], questionSessionId: string, isFastCreation: boolean = false) => {
    const getUrl = isFastCreation ? GENERATE_QUESTIONS_33_URL : GENERATE_QUESTIONS_URL;

    // from topics, create an array of topics that contain an id
    const customTopics = topics.filter((topic) => topic[1].length > 0).map((topic) => {
        const topicName = topic[0];
        const id = topic[1];
        return { id, topic: topicName };
    });

    if (customTopics.length > 0) {
        try {
            // const ids = [topic[1]];
            console.log("GENERATING CUSTOM QUESTIONS FOR TOPICS: ", customTopics);
            axios.post(getUrl, customTopics).then((response) => {
                console.log("RESPONSE: ", response);
                const result = response.data;
                addQuestions(questionSessionId, result); // TODO: should be done on the server
                console.log("added questions: ", { result });
            });

        } catch (error) {
            console.error(error);
        }
    }

    topics.map(async (topic) => {
        // If the topic has empty id, it is a general topic question
        if (topic[1].length === 0) {
            try {
                console.log("GENERATING GENERAL QUESTIONS FOR TOPIC: ", topic[0]);
                axios.post(
                    `${BASE_URL}/api/openai/generalTopicQuestions`,
                    { topic: topic[0] }
                ).then((response) => { // TODO: should be done on the server
                    const json = JSON.stringify(response.data);
                    const cleanedJsonString: string = json.replace(/\\"/g, '"');
                    const jsonObject = JSON.parse(cleanedJsonString);
                    const result: any = {};
                    result[topic[0]] = jsonObject;
                    addQuestions(questionSessionId, result); // TODO: should be done on the server
                    console.log("added questions: ", { genralTopics: result });
                });
            } catch (error) {
                console.error(error);
            }
        }
    });
}
