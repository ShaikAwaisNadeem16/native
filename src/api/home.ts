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
     * STEP 7: POST /api/lms/enrol/get-enroll-course
     * Fetches enrolled courses for the user (ONLY if enrolled)
     * Request body: { email: string, userId: string }
     */
    getEnrollCourse: async () => {
        try {
            const userId = await Storage.getItem('userId');
            const email = await Storage.getItem('username'); // Using username as email from login

            if (!userId) {
                throw new Error('User ID not found');
            }

            if (!email) {
                throw new Error('Email not found');
            }

            const response = await GlobalAxiosConfig.post(
                '/api/lms/enrol/get-enroll-course',
                { email, userId }
            );
            return response.data;
        } catch (error) {
            console.error('Failed to fetch enrolled courses:', error);
            throw error;
        }
    },
};

export default HomeService;

