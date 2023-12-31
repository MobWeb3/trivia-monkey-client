import axios from 'axios';
import { BASE_URL } from '../ApiServiceConfig';

export const userExists = async (clientId: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/userExists`, {
            clientId
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
    return false;
}

export const createUser = async (data: any) => {
    // const { clientId, name } = data;
    try {
        const response = await axios.post(`${BASE_URL}/api/polybase/addUser`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    return false;
}