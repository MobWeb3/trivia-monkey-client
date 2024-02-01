// const DEV_BASE_URL = 'https://tough-shark-literally.ngrok-free.app';
const DEV_BASE_URL = 'http://localhost:3333';

export const isDev = import.meta.env.MODE === 'dev-service' ? true : false;

export const BASE_URL = isDev ? DEV_BASE_URL : import.meta.env.VITE_PROD_BASE_URL;

// export const BASE_AI_URL = 'https://74.82.30.101:5000'

export const DEV_MENG_URL = 'http://127.0.0.1:8000'

export const MENG_URL = isDev ? DEV_MENG_URL : import.meta.env.VITE_PROD_MENG_URL;