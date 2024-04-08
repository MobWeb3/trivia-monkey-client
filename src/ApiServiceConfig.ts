// const DEV_BASE_URL = 'https://tough-shark-literally.ngrok-free.app';
const DEV_BASE_URL = 'http://localhost:3333';

export const isDev = import.meta.env.MODE === 'dev-service' ? true : false;

export let BASE_URL = isDev ? DEV_BASE_URL : import.meta.env.VITE_PROD_MT_SERVICE_URL;

// export const BASE_AI_URL = 'https://74.82.30.101:5000'

export const DEV_MENG_URL = 'http://127.0.0.1:8000'

export const MENG_URL = isDev ? DEV_MENG_URL : import.meta.env.VITE_PROD_MENG_URL;

export const DEV_FRAMES_URL = 'http://localhost:3000';

export const isDev_Frames = import.meta.env.MODE === 'prod-service-dev-frame' ? true : false;

export let FRAMES_URL = isDev_Frames ? DEV_FRAMES_URL : import.meta.env.VITE_PROD_FRAMES_URL;

// is dev service and dev frame
export const isDevServiceAndFrame = import.meta.env.MODE === 'dev-service-dev-frame' ? true : false;

if (isDevServiceAndFrame) {
    BASE_URL = DEV_BASE_URL;
    FRAMES_URL = DEV_FRAMES_URL;
} else {
    BASE_URL = import.meta.env.VITE_PROD_MT_SERVICE_URL;
    FRAMES_URL = import.meta.env.VITE_PROD_FRAMES_URL;
}

