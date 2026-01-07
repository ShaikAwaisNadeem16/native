import GlobalAxiosConfig from './GlobalAxiosConfig';
import Storage from '../utils/storage';

export const HomeService = {
    /**
     * STEP 2: POST /api/student/v1/home/check-enrol
     * Checks if the student is enrolled
     * Request body: { userId: string }
     */
    checkEnrol: async () => {
        try {
            const userId = await Storage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found');
            }

            const response = await GlobalAxiosConfig.post(
                '/api/student/v1/home/check-enrol',
                { userId }
            );
            return response.data;
        } catch (error) {
            console.error('Failed to check enrol status:', error);
            throw error;
        }
    },

    /**
     * STEP 6: POST /api/lms/enrol/get-enroll-course
     * Fetches enrolled courses for the user (ONLY if enrolled)
     * Request body: { email: string, userId: string }
     */
    getEnrollCourse: async () => {
        try {
            const userId = await Storage.getItem('userId');
            const email = await Storage.getItem('username'); // Using username as email from login

            console.log('[API] getEnrollCourse - userId:', userId);
            console.log('[API] getEnrollCourse - email:', email);

            if (!userId) {
                throw new Error('User ID not found');
            }

            if (!email) {
                throw new Error('Email not found');
            }

            const requestPayload = { email, userId };
            console.log('[API] getEnrollCourse - Request payload:', JSON.stringify(requestPayload, null, 2));
            console.log('[API] getEnrollCourse - Calling POST /api/lms/enrol/get-enroll-course');

            const response = await GlobalAxiosConfig.post(
                '/api/lms/enrol/get-enroll-course',
                requestPayload
            );

            console.log('[API] getEnrollCourse - Response status:', response.status);
            console.log('[API] getEnrollCourse - Response data type:', typeof response.data);
            console.log('[API] getEnrollCourse - Response data keys:', Object.keys(response.data || {}));
            console.log('[API] getEnrollCourse - Full response.data:', JSON.stringify(response.data, null, 2));

            return response.data;
        } catch (error: any) {
            console.error('[API] getEnrollCourse - Error occurred:', error);
            console.error('[API] getEnrollCourse - Error message:', error?.message);
            console.error('[API] getEnrollCourse - Error response:', error?.response?.data);
            console.error('[API] getEnrollCourse - Error status:', error?.response?.status);
            throw error;
        }
    },
};

export default HomeService;

