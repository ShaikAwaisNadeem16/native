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

            // DEBUG: Log full API response to verify token field name
            console.log('[DEBUG] Login API Response:', JSON.stringify(res.data, null, 2));
            console.log('[DEBUG] accessToken value:', res.data.accessToken);
            console.log('[DEBUG] access_token value:', res.data.access_token);
            console.log('[DEBUG] token value:', res.data.token);

            if (res.data.message === "Login successful") {
                // Explicitly convert all values to strings to prevent Android type casting errors
                const tokenValue = res.data.accessToken || res.data.access_token || res.data.token || '';
                console.log('[DEBUG] Token being stored:', tokenValue ? `${tokenValue.substring(0, 20)}...` : 'EMPTY');
                console.log('[DEBUG] Login response data:', JSON.stringify(res.data, null, 2));

                await Storage.setItem("accessToken", tokenValue);
                await Storage.setItem("refreshToken", res.data.refreshToken || '');
                await Storage.setItem("userId", res.data.userId != null ? String(res.data.userId) : '');
                await Storage.setItem("username", username || '');
                
                // Store platformId and organizationId if present in response
                if (res.data.platformId) {
                    await Storage.setItem("platformId", String(res.data.platformId));
                    console.log('[DEBUG] platformId stored:', res.data.platformId);
                }
                if (res.data.organizationId) {
                    await Storage.setItem("organizationId", String(res.data.organizationId));
                    console.log('[DEBUG] organizationId stored:', res.data.organizationId);
                }
                
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
     * Check User Authorization
     * POST /api/admin/v2/authorize-student/check-user-authorized
     * Checks if the logged-in user is authorized to access the platform
     * Request body: { userId: string }
     * Response: { message: string, authorized: boolean }
     */
    checkUserAuthorized: async (userId: string) => {
        try {
            const payload = { userId };
            console.log('[AuthService] checkUserAuthorized - Request payload:', JSON.stringify(payload, null, 2));
            console.log('[AuthService] checkUserAuthorized - Calling POST /api/admin/v2/authorize-student/check-user-authorized');
            
            const response = await GlobalAxiosConfig.post(
                '/api/admin/v2/authorize-student/check-user-authorized',
                payload
            );
            
            console.log('[AuthService] checkUserAuthorized - Response status:', response.status);
            console.log('[AuthService] checkUserAuthorized - Full response.data:', JSON.stringify(response.data, null, 2));
            
            return response.data;
        } catch (error: any) {
            console.error('[AuthService] Error checking user authorization:', error);
            console.error('[AuthService] Error response:', error?.response?.data);
            console.error('[AuthService] Error status:', error?.response?.status);
            // Extract error message from response if available
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to check user authorization";
            throw new Error(errorMessage);
        }
    },

    /**
     * Admin Authorization API
     * POST /api/admin/authorize-student/get-authorized-email-college
     * Validates if an email is authorized and returns college information
     * Request body: { email: string }
     * Response: { message: string, authorizedEmail: { authorized: boolean, college: { college: string, logo: string, state: string, district: string, pincode: string }, collegeId: string } }
     */
    authorizeEmail: async (email: string) => {
        try {
            const payload = { email };
            console.log('[AuthService] authorizeEmail - Request payload:', JSON.stringify(payload, null, 2));
            console.log('[AuthService] authorizeEmail - Calling POST /api/admin/authorize-student/get-authorized-email-college');
            
            const response = await GlobalAxiosConfig.post(
                '/api/admin/authorize-student/get-authorized-email-college',
                payload
            );
            
            console.log('[AuthService] authorizeEmail - Response status:', response.status);
            console.log('[AuthService] authorizeEmail - Full response.data:', JSON.stringify(response.data, null, 2));
            
            return response.data;
        } catch (error: any) {
            console.error('[AuthService] Error authorizing email:', error);
            console.error('[AuthService] Error response:', error?.response?.data);
            console.error('[AuthService] Error status:', error?.response?.status);
            // Extract error message from response if available
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to verify email";
            throw new Error(errorMessage);
        }
    },

    /**
     * Check if account exists
     * POST /api/auth/user/account-exists
     * Validates if a phone number or email account exists
     * Request body: { type: "phone" | "email", phone?: string, email?: string }
     * Response: { exists: boolean, type: string, message: string }
     */
    checkAccountExists: async (type: 'phone' | 'email', value: string) => {
        try {
            const payload = type === 'phone' 
                ? { type: 'phone', phone: value }
                : { type: 'email', email: value };
            
            console.log('[AuthService] checkAccountExists - Request payload:', JSON.stringify(payload, null, 2));
            console.log('[AuthService] checkAccountExists - Calling POST /api/auth/user/account-exists');
            
            const response = await GlobalAxiosConfig.post(
                '/api/auth/user/account-exists',
                payload
            );
            
            console.log('[AuthService] checkAccountExists - Response status:', response.status);
            console.log('[AuthService] checkAccountExists - Full response.data:', JSON.stringify(response.data, null, 2));
            
            return response.data;
        } catch (error: any) {
            console.error('[AuthService] Error checking account exists:', error);
            console.error('[AuthService] Error response:', error?.response?.data);
            console.error('[AuthService] Error status:', error?.response?.status);
            
            // If the response indicates account doesn't exist, return the response data instead of throwing
            // This allows the UI to handle the "exists: false" case gracefully
            if (error?.response?.data && error.response.data.exists === false) {
                return error.response.data;
            }
            
            // Extract error message from response if available
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to check account";
            throw new Error(errorMessage);
        }
    },

    /**
     * Send SMS OTP
     * POST /api/auth/sms/send-sms-otp-v1
     * Sends OTP to the provided phone number
     * Request body: { phone: string } (e.g., "+919030675999")
     * Response: { otpSent: boolean, message: string }
     */
    sendSmsOtp: async (phone: string) => {
        try {
            // Ensure phone number includes country code (e.g., +91)
            const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
            
            const payload = { phone: formattedPhone };
            
            console.log('[AuthService] sendSmsOtp - Request payload:', JSON.stringify(payload, null, 2));
            
            const response = await GlobalAxiosConfig.post(
                '/api/auth/sms/send-sms-otp-v1',
                payload
            );
            
            console.log('[AuthService] sendSmsOtp - Response:', JSON.stringify(response.data, null, 2));
            
            return response.data;
        } catch (error: any) {
            console.error("Error sending SMS OTP:", error);
            // Extract error message from response if available
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to send OTP";
            throw new Error(errorMessage);
        }
    },

    /**
     * Verify SMS OTP
     * POST /api/auth/sms/verify-sms-otp-v1
     * Verifies the OTP for the provided phone number
     * Request body: { phone: string, otp: string } (e.g., { phone: "+919030675999", otp: "123456" })
     * Response: Success message or error with statusCode
     */
    verifySmsOtp: async (phone: string, otp: string) => {
        try {
            // Ensure phone number includes country code (e.g., +91)
            const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
            
            const payload = { 
                phone: formattedPhone,
                otp: otp
            };
            
            console.log('[AuthService] verifySmsOtp - Request payload:', JSON.stringify(payload, null, 2));
            
            const response = await GlobalAxiosConfig.post(
                '/api/auth/sms/verify-sms-otp-v1',
                payload
            );
            
            console.log('[AuthService] verifySmsOtp - Response:', JSON.stringify(response.data, null, 2));
            
            return response.data;
        } catch (error: any) {
            console.error("Error verifying SMS OTP:", error);
            // Extract error message from response if available
            const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Failed to verify OTP";
            throw new Error(errorMessage);
        }
    },

    /**
     * Register User
     * POST /api/auth/user/register
     * Registers a new user account
     * Request body: { email: string, firstName: string, lastName: string, mobileNumber: string, password: string, platform: "student" }
     * Response: { statusCode: number, message: string, ... } or error with 409 if user already exists
     */
    register: async (userData: {
        email: string;
        firstName: string;
        lastName: string;
        mobileNumber: string;
        password: string;
        platform?: string;
    }) => {
        try {
            const payload = {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                mobileNumber: userData.mobileNumber,
                password: userData.password,
                platform: userData.platform || 'student',
            };
            
            console.log('[AuthService] register - Request URL: POST /api/auth/user/register');
            console.log('[AuthService] register - Request payload:', JSON.stringify({ ...payload, password: '***' }, null, 2));
            console.log('[AuthService] register - Full payload (with password):', JSON.stringify(payload, null, 2));
            
            const response = await GlobalAxiosConfig.post(
                '/api/auth/user/register',
                payload
            );
            
            console.log('[AuthService] register - Response status:', response.status);
            console.log('[AuthService] register - Full response.data:', JSON.stringify(response.data, null, 2));
            
            return response.data;
        } catch (error: any) {
            console.error('[AuthService] register - Error:', error);
            console.error('[AuthService] register - Error response:', JSON.stringify(error?.response?.data, null, 2));
            console.error('[AuthService] register - Error status:', error?.response?.status);
            console.error('[AuthService] register - Error statusCode:', error?.response?.data?.statusCode);
            
            // Log full error response structure
            if (error?.response?.data) {
                const errorData = error.response.data;
                console.error('[AuthService] register - Error details:', {
                    statusCode: errorData.statusCode,
                    timestamp: errorData.timestamp,
                    path: errorData.path,
                    message: errorData.message,
                    error: errorData.error,
                });
            }
            
            // Re-throw the error so the calling code can handle it
            throw error;
        }
    },
};

export default AuthService;

