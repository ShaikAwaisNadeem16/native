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

        // DEBUG: Log token retrieval and header attachment
        console.log('[DEBUG] Interceptor - Request URL:', config.url);
        console.log('[DEBUG] Interceptor - Token retrieved:', token ? `${token.substring(0, 20)}...` : 'NULL/EMPTY');
        console.log('[DEBUG] Interceptor - Token truthy check:', !!token);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('[DEBUG] Interceptor - Authorization header SET');
        } else {
            console.log('[DEBUG] Interceptor - Authorization header NOT SET (no token)');
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
    (response) => {
        console.log('[DEBUG] Response - URL:', response.config.url, 'Status:', response.status);
        return response;
    },
    async (error) => {
        // DEBUG: Log error details
        console.log('[DEBUG] Response Error - URL:', error.config?.url);
        console.log('[DEBUG] Response Error - Status:', error.response?.status);
        console.log('[DEBUG] Response Error - Data:', JSON.stringify(error.response?.data));

        if (error.response && error.response.status === 401) {
            // Handle 401 Unauthorized - token might be expired
            // Could implement token refresh logic here if needed
            console.error('[DEBUG] 401 Unauthorized - token may be missing or expired');
        }
        return Promise.reject(error);
    }
);

export default GlobalAxiosConfig;

