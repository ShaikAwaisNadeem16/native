import GlobalAxiosConfig from './GlobalAxiosConfig';
import Storage from '../utils/storage';

export const NotificationService = {
    /**
     * STEP 4: GET /api/student/notification/{userId}
     * Fetches notifications for the user
     * USER_ID must be dynamic (from storage)
     */
    getNotifications: async () => {
        try {
            const userId = await Storage.getItem('userId');
            if (!userId) {
                console.warn('User ID not found, cannot fetch notifications');
                return null;
            }

            const response = await GlobalAxiosConfig.get(
                `/api/student/notification/${userId}`
            );
            return response.data;
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            // Non-blocking - return null on error
            return null;
        }
    },
};

export default NotificationService;

