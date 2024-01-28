import axios from 'axios';
import { BASE_URL } from '../ApiServiceConfig';
import { Topic } from '../components/topics/TopicContext';
import { requestQuestions } from '../mongo/QuestionHandler';

export const generateAllQuestions = async (topics: Topic[]) => {
    // from topics, create an array of topics that contain a metaphor id
    const customTopics = topics.filter((topic) => topic.metaphor_id.length > 0).map((topic) => {
        const topicName = topic.name;
        const metaphor_id = topic.metaphor_id;
        return { metaphor_id, name: topicName };
    });

    if (customTopics.length > 0) {
        try {
            console.log("GENERATING CUSTOM QUESTIONS FOR TOPICS: ", customTopics);
            requestQuestions(customTopics);
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
