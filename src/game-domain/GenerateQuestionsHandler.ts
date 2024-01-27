import axios from 'axios';
import { MENG_URL, BASE_URL } from '../ApiServiceConfig';
import { Topic } from '../components/topics/TopicContext';

// const BASE_PAPERSPACE_HOST = `${BASE_AI_URL}/api`;
// const GENERATE_QUESTIONS_URL = `${BASE_PAPERSPACE_HOST}/generateQuestions`;
// const GENERATE_QUESTIONS_33_URL = `${BASE_PAPERSPACE_HOST}/generateQuestions33`;

export const generateAllQuestions = async (topics: Topic[], isFastCreation: boolean = false) => {
    // const getUrl = isFastCreation ? GENERATE_QUESTIONS_33_URL : GENERATE_QUESTIONS_URL;

    // from topics, create an array of topics that contain a metaphor id
    const customTopics = topics.filter((topic) => topic.metaphor_id.length > 0).map((topic) => {
        const topicName = topic.name;
        const id = topic.metaphor_id;
        return { id, topic: topicName };
    });

    if (customTopics.length > 0) {
        try {
            // const ids = [topic[1]];
            console.log("GENERATING CUSTOM QUESTIONS FOR TOPICS: ", customTopics);
            axios.post(MENG_URL, customTopics).then((response) => {
                console.log("RESPONSE: ", response);
                // const result = response.data;
                // addQuestions(questionSessionId, result);
                // console.log("added questions: ", { result });
            });

        } catch (error) {
            console.error(error);
        }
    }

    topics.map(async (topic) => {
        // If the topic has empty metaphor id, it is a general topic question
        if (topic.metaphor_id.length === 0) {
            try {
                console.log("GENERATING GENERAL QUESTIONS FOR TOPIC: ", topic.name);
                axios.post(
                    `${BASE_URL}/api/openai/generalTopicQuestions`,
                    { topic: topic.name }
                );
            } catch (error) {
                console.error(error);
            }
        }
    });
}
