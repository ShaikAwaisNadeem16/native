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

            // Transform data to handle JSON strings in response (from existing pattern)
            const transformData = (item: any): any => {
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
        } catch (error) {
            console.error('Failed to fetch profile details:', error);
            throw error;
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
     * POST /api/student/user-profile/update
     * Updates user profile personal details
     * Request body: profile data object
     */
    updateProfileDetails: async (profileData: any) => {
        try {
            const userId = await Storage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found');
            }

            const response = await GlobalAxiosConfig.post(
                '/api/student/user-profile/update',
                { ...profileData, userId }
            );
            return response.data;
        } catch (error) {
            console.error('Failed to update profile details:', error);
            throw error;
        }
    },
};

export default ProfileService;

