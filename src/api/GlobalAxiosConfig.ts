import axios from 'axios';
import Storage from '../utils/storage';
import { ENV } from '../constants/env';

// Create an Axios instance with global configurations
const GlobalAxiosConfig = axios.create({
    baseURL: ENV.API_BASE_URL,
});

// Axios request interceptor: Attach headers (like tokens) before sending the request
GlobalAxiosConfig.interceptors.request.use(
    async (config) => {
        // Attach Authorization token from AsyncStorage to every request
        const token = await Storage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request errors globally
        return Promise.reject(error);
    }
);

// Axios response interceptor: Handle errors globally
GlobalAxiosConfig.interceptors.response.use(
    (response) => response, // Return the response if successful
    async (error) => {
        if (error.response && error.response.status === 401) {
            // Handle 401 Unauthorized - token might be expired
            // Could implement token refresh logic here if needed
            console.error('Unauthorized - token may be expired');
        }
        return Promise.reject(error);
    }
);

export default GlobalAxiosConfig;

