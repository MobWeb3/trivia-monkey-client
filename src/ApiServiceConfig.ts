// const DEV_BASE_URL = 'https://tough-shark-literally.ngrok-free.app';
const DEV_BASE_URL = 'http://localhost:3333';
const PROD_BASE_URL = 'https://monkey-trivia-server-e2c4b5238a63.herokuapp.com';

const isProd = import.meta.env.MODE === 'prod-service' ? true : false;

export const BASE_URL = isProd ? PROD_BASE_URL : DEV_BASE_URL;
