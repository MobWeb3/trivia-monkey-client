import axios from 'axios';
import { BASE_URL } from '../ApiServiceConfig';

export const createQuestionSession = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/questions/createQuestion`, data);
        return response.data;
    } catch (error) {
        console.error("createQuestionSession: ", error);
    }
    return false;
}

export const addQuestions = async (id:string, topics: any, column=1) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/polybase/questions/addQuestions`, {id, column, topics});
        return response.data;
    } catch (error) {
        console.error(error);
    }
    return false;
}

export const getQuestions = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/questions/getQuestions`, data);
        return response.data.recordData;
    } catch (error) {
        console.error(error);
    }
    return false;
}

export const getQuestion = async (data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/questions/getQuestion`, data);
        return response.data.question;
    } catch (error) {
        console.error(error);
    }
    return false;
}