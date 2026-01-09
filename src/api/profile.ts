import GlobalAxiosConfig from './GlobalAxiosConfig';
import Storage from '../utils/storage';

export const ProfileService = {
    /**
     * STEP 1: GET /api/student/user-profile/data
     * Fetches basic user profile data
     */
    fetchProfileData: async () => {
        try {
            const response = await GlobalAxiosConfig.get('/api/student/user-profile/data');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch profile data:', error);
            throw error;
        }
    },

    /**
     * STEP 3: POST /api/student/user-profile/details
     * Fetches detailed user profile information
     * Request body: { userId: string }
     */
    fetchProfileDetails: async () => {
        try {
            const userId = await Storage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found');
            }

            const response = await GlobalAxiosConfig.post(
                '/api/student/user-profile/details',
                { userId }
            );

            // Check if response and response.data exist
            if (!response) {
                throw new Error('No response received from server');
            }

            if (!response.data) {
                console.warn('[ProfileService] Response data is undefined, returning empty object');
                return {};
            }

            // Transform data to handle JSON strings in response (from existing pattern)
            const transformData = (item: any): any => {
                if (!item || typeof item !== 'object') {
                    return item || {};
                }

                for (const key in item) {
                    if (
                        item.hasOwnProperty(key) &&
                        typeof item[key] === "string" &&
                        item[key].startsWith("[") &&
                        item[key].endsWith("]")
                    ) {
                        try {
                            item[key] = JSON.parse(item[key]);
                        } catch (error) {
                            console.error(`Error parsing ${key}:`, error);
                        }
                    }
                }
                return item;
            };

            const finalData = transformData(response.data);
            return finalData;
        } catch (error: any) {
            console.error('[ProfileService] Failed to fetch profile details:', error);
            console.error('[ProfileService] Error details:', {
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status,
                statusText: error?.response?.statusText,
            });
            
            // Re-throw with more context
            const errorMessage = error?.response?.data?.message || 
                                error?.message || 
                                'Failed to fetch profile details';
            throw new Error(errorMessage);
        }
    },

    /**
     * STEP 5: POST /api/student/user-profile/get-profile-percentage
     * Fetches profile completion percentage
     * Request body: { email: string, userId: string }
     */
    fetchProfilePercentage: async () => {
        try {
            const userId = await Storage.getItem('userId');
            const email = await Storage.getItem('username'); // Using username as email from login

            if (!userId) {
                throw new Error('User ID not found');
            }

            if (!email) {
                throw new Error('Email not found');
            }

            // Send as form-urlencoded as per existing pattern in codebase
            const response = await GlobalAxiosConfig.post(
                '/api/student/user-profile/get-profile-percentage',
                { email, userId },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    transformRequest: [(data) => {
                        const str = Object.keys(data).map(key =>
                            `${encodeURIComponent(key)}=${encodeURIComponent(data[key] || '')}`
                        ).join('&');
                        return str;
                    }]
                }
            );
            return response.data;
        } catch (error) {
            console.error('Failed to fetch profile percentage:', error);
            // Non-blocking, return null
            return null;
        }
    },

    /**
     * PUT /api/student/user-profile
     * Updates user profile details
     * Request body: profile data object with email, userId, and other fields
     */
    updateProfileDetails: async (profileData: any) => {
        try {
            const userId = await Storage.getItem('userId');
            const email = await Storage.getItem('username'); // Using username as email from login

            if (!userId) {
                throw new Error('User ID not found');
            }

            if (!email) {
                throw new Error('Email not found');
            }

            // Prepare payload with email and userId
            const payload = {
                email,
                userId,
                ...profileData,
            };

            const response = await GlobalAxiosConfig.put(
                '/api/student/user-profile',
                payload
            );
            return response.data;
        } catch (error) {
            console.error('Failed to update profile details:', error);
            throw error;
        }
    },

    /**
     * GET /api/auth/post-office/pincode/{pincode}
     * Fetches state, district, and locality data for a given pincode
     */
    fetchPincodeData: async (pincode: string) => {
        try {
            if (!pincode || pincode.length !== 6) {
                throw new Error('Invalid pincode');
            }

            const response = await GlobalAxiosConfig.get(
                `/api/auth/post-office/pincode/${pincode}`
            );
            return response.data;
        } catch (error) {
            console.error('Failed to fetch pincode data:', error);
            throw error;
        }
    },
};

export default ProfileService;

