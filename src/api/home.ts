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
            console.log('[API] getEnrollCourse - Response is array?', Array.isArray(response.data));
            console.log('[API] getEnrollCourse - Response data keys:', Object.keys(response.data || {}));
            console.log('[API] getEnrollCourse - Full response.data:', JSON.stringify(response.data, null, 2));

            // The API returns an array directly, so return it as is
            // If response.data is an array, return it directly
            // If it's wrapped in an object, extract the array
            if (Array.isArray(response.data)) {
                return response.data;
            } else if (response.data && Array.isArray(response.data.courses)) {
                return response.data.courses;
            } else if (response.data && Array.isArray(response.data.data)) {
                return response.data.data;
            } else {
                // If it's not an array, return as is (might be single object or different structure)
                console.warn('[API] getEnrollCourse - Response is not an array, returning as is');
                return response.data;
            }
        } catch (error: any) {
            console.error('[API] getEnrollCourse - Error occurred:', error);
            console.error('[API] getEnrollCourse - Error message:', error?.message);
            console.error('[API] getEnrollCourse - Error response:', error?.response?.data);
            console.error('[API] getEnrollCourse - Error status:', error?.response?.status);
            throw error;
        }
    },

    /**
     * POST /api/lms/course/course-view
     * Fetches course view data when a course is started
     * Request body: { courseId: string, userId: string }
     * This API is used for COURSES (not assessments)
     */
    getCourseView: async (courseId: string) => {
        try {
            const userId = await Storage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found');
            }

            if (!courseId) {
                throw new Error('Course ID is required');
            }

            console.log('[API] ===== CALLING COURSE VIEW API =====');
            console.log('[API] API: POST /api/lms/course/course-view');
            console.log('[API] Purpose: Fetch course data (modules, lessons, etc.)');
            console.log('[API] getCourseView - courseId:', courseId);
            console.log('[API] getCourseView - userId:', userId);

            const requestPayload = { courseId, userId };
            console.log('[API] getCourseView - Request payload:', JSON.stringify(requestPayload, null, 2));
            console.log('[API] Calling POST /api/lms/course/course-view...');

            const response = await GlobalAxiosConfig.post(
                '/api/lms/course/course-view',
                requestPayload
            );

            console.log('[API] ===== COURSE VIEW API RESPONSE =====');
            console.log('[API] getCourseView - Response status:', response.status);
            console.log('[API] getCourseView - Response keys:', response.data ? Object.keys(response.data) : 'null/undefined');
            console.log('[API] getCourseView - Full response:', JSON.stringify(response.data, null, 2));
            
            // Log key fields from response
            if (response.data) {
                console.log('[API] Course name:', response.data.name);
                console.log('[API] Course type:', response.data.type);
                console.log('[API] Number of modules:', response.data.module?.length || 0);
                console.log('[API] Resume data:', response.data.resume1);
                console.log('[API] Resume URL:', response.data.resumeUrl);
            }
            console.log('[API] =====================================');
            
            return response.data;
        } catch (error: any) {
            console.error('[API] ===== COURSE VIEW API ERROR =====');
            console.error('[API] getCourseView - Error occurred:', error);
            console.error('[API] getCourseView - Error message:', error?.message);
            console.error('[API] getCourseView - Error response:', error?.response?.data);
            console.error('[API] getCourseView - Error status:', error?.response?.status);
            console.error('[API] ===================================');
            throw error;
        }
    },

    /**
     * GET /api/student/faqs/page/role-recommendation
     * Fetches FAQs for the role recommendation page
     * Response: Array of FAQ objects with id, tag, page, question, answer
     */
    getRoleRecommendationFAQs: async () => {
        try {
            console.log('[API] ===== CALLING ROLE RECOMMENDATION FAQ API =====');
            console.log('[API] API: GET /api/student/faqs/page/role-recommendation');

            const response = await GlobalAxiosConfig.get(
                '/api/student/faqs/page/role-recommendation'
            );

            console.log('[API] ===== ROLE RECOMMENDATION FAQ API RESPONSE =====');
            console.log('[API] Response status:', response.status);
            console.log('[API] Response is array?', Array.isArray(response.data));
            console.log('[API] Number of FAQs:', Array.isArray(response.data) ? response.data.length : 0);
            console.log('[API] Full response:', JSON.stringify(response.data, null, 2));
            console.log('[API] ================================================');
            
            return response.data;
        } catch (error: any) {
            console.error('[API] ===== ROLE RECOMMENDATION FAQ API ERROR =====');
            console.error('[API] Error occurred:', error);
            console.error('[API] Error message:', error?.message);
            console.error('[API] Error response:', error?.response?.data);
            console.error('[API] Error status:', error?.response?.status);
            console.error('[API] =============================================');
            throw error;
        }
    },
};

export default HomeService;

