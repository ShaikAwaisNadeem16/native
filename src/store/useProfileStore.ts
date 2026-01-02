import { create } from 'zustand';
import ProfileService from '../api/profile';
import HomeService from '../api/home';
import NotificationService from '../api/notification';

interface ProfileState {
    profileData: any | null;
    profileDetails: any | null;
    profilePercentage: any | null;
    isEnrolled: boolean | null;
    enrolledCourses: any | null;
    notifications: any | null;
    loading: boolean;
    error: string | null;
    initializeHome: () => Promise<void>;
}

const useProfileStore = create<ProfileState>((set) => ({
    profileData: null,
    profileDetails: null,
    profilePercentage: null,
    isEnrolled: null,
    enrolledCourses: null,
    notifications: null,
    loading: false,
    error: null,

    /**
     * Initialize Home: Execute APIs in strict sequential order
     * STEP 1 → STEP 2 → STEP 3 → STEP 4 → STEP 5 → STEP 6
     * APIs must be called ONLY after authentication
     */
    initializeHome: async () => {
        set({ loading: true, error: null });

        try {
            // STEP 1: Fetch Basic User Profile
            // GET https://apis.dev.cream-collar.com/api/student/user-profile/data
            const profileData = await ProfileService.fetchProfileData();
            set({ profileData });

            // STEP 2: Check Enrollment Status
            // POST https://apis.dev.cream-collar.com/api/student/v1/home/check-enrol
            let enrollmentData = null;
            try {
                enrollmentData = await HomeService.checkEnrol();
                set({ isEnrolled: enrollmentData?.roleEnrolled || false });
            } catch (error) {
                console.error('Failed to check enrollment:', error);
                // Non-blocking - continue flow
            }

            // STEP 3: Fetch Full Profile Details
            // POST https://apis.dev.cream-collar.com/api/student/user-profile/details
            let profileDetails = null;
            try {
                profileDetails = await ProfileService.fetchProfileDetails();
                // Merge with basic profile data safely
                set({
                    profileDetails,
                    profileData: { ...profileData, ...profileDetails }
                });
            } catch (error) {
                console.error('Failed to fetch profile details:', error);
                // Non-blocking - continue flow
            }

            // STEP 4: Fetch Notifications
            // GET https://apis.dev.cream-collar.com/api/student/notification/{userId}
            // userId must be dynamic (fetched from storage)
            try {
                const notifications = await NotificationService.getNotifications();
                if (notifications) {
                    set({ notifications });
                }
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
                // Non-blocking - continue flow
            }

            // STEP 5: Fetch Profile Completion Percentage
            // POST https://apis.dev.cream-collar.com/api/student/user-profile/get-profile-percentage
            try {
                const percentageData = await ProfileService.fetchProfilePercentage();
                if (percentageData) {
                    set({ profilePercentage: percentageData });
                }
            } catch (error) {
                console.error('Failed to fetch profile percentage:', error);
                // Non-blocking - continue flow
            }

            // STEP 6: Fetch Enrolled Courses (ONLY if user is enrolled)
            // POST https://apis.dev.cream-collar.com/api/lms/enrol/get-enroll-course
            if (enrollmentData?.roleEnrolled) {
                try {
                    const courses = await HomeService.getEnrollCourse();
                    if (courses) {
                        set({ enrolledCourses: courses });
                    }
                } catch (error) {
                    console.error('Failed to fetch enrolled courses:', error);
                    // Non-blocking - continue flow
                }
            }

            set({ loading: false });
        } catch (error: any) {
            console.error('Failed to initialize home:', error);
            set({
                error: error?.message || 'Failed to load home data',
                loading: false
            });
        }
    },
}));

export default useProfileStore;

