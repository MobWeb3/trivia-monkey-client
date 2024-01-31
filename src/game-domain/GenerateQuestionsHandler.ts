import { requestQuestions } from '../mongo/QuestionHandler';
import { Topic } from './Topic';

export const generateAllQuestions = async (topics: Topic[]) => {
    if (topics.length > 0) {
        try {
            console.log("GENERATING QUESTIONS FOR TOPICS: ", topics);
            requestQuestions(topics);
        } catch (error) {
            console.error(error);
        }
    }
}
