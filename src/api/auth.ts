import axios from 'axios';
import { ENV } from '../constants/env';
import Storage from '../utils/storage';
import GlobalAxiosConfig from './GlobalAxiosConfig';

const AuthService = {
    doLogin: async (username: string, password: string) => {
        // Determine if username is mobile number (10 digits) or email
        const payload = /^\d{10}$/.test(username)
            ? { method: "mobile", phoneNumber: username, password, platform: "student" }
            : { email: username, method: "email", password, platform: "student" };

        try {
            const res = await axios.post(`${ENV.API_BASE_URL}/api/auth/user/login`, payload);
            if (res.data.message === "Login successful") {
                // Explicitly convert all values to strings to prevent Android type casting errors
                await Storage.setItem("accessToken", res.data.accessToken || '');
                await Storage.setItem("refreshToken", res.data.refreshToken || '');
                await Storage.setItem("userId", res.data.userId != null ? String(res.data.userId) : '');
                await Storage.setItem("username", username || '');
                return res.data;
            }
            throw new Error(res.data.message || "Login failed");
        } catch (error: any) {
            console.error('Login error:', error);
            // Extract error message from axios error response
            const errorMessage = error?.response?.data?.message || error?.message || "Login failed. Please try again.";
            throw new Error(errorMessage);
        }
    },

    doLogout: async () => {
        await Storage.clear();
    },

    /**
     * Admin Authorization API
     * POST /api/admin/authorize-student/get-authorized-email-college
     * Validates if an email is authorized and returns college information
     */
    authorizeEmail: async (email: string) => {
        try {
            const response = await GlobalAxiosConfig.post(
                '/api/admin/authorize-student/get-authorized-email-college',
                { email }
            );
            return response.data;
        } catch (error: any) {
            console.error("Error authorizing email:", error);
            // Extract error message from response if available
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to verify email";
            throw new Error(errorMessage);
        }
    },
};

export default AuthService;

