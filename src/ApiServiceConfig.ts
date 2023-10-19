// const DEV_BASE_URL = 'https://tough-shark-literally.ngrok-free.app';
const DEV_BASE_URL = 'http://localhost:3333';
const PROD_BASE_URL = 'https://monkey-trivia-server-e2c4b5238a63.herokuapp.com';

export const isDev = import.meta.env.MODE === 'dev-service' ? true : false;

export const BASE_URL = isDev ? DEV_BASE_URL : PROD_BASE_URL;
