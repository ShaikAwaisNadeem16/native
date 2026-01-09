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
    badgeCount: number;
    loading: boolean;
    error: string | null;
    skills: Array<{ skillId: number; skillName: string }> | null;
    branches: Array<{ branchId: number; branch: string }> | null;
    diplomaBranches: Array<{ branchId: number; branch: string }> | null;
    initializeHome: () => Promise<void>;
    initializeBadgeCount: () => void;
    fetchProfileDropdownData: () => Promise<void>;
}

const useProfileStore = create<ProfileState>((set, get) => ({
    profileData: null,
    profileDetails: null,
    profilePercentage: null,
    isEnrolled: null,
    enrolledCourses: null,
    notifications: null,
    badgeCount: 0,
    loading: false,
    error: null,
    skills: null,
    branches: null,
    diplomaBranches: null,

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
            console.log('[DATA FETCH] STEP 1: Fetching basic profile data...');
            const profileDataResponse = await ProfileService.fetchProfileData();
            console.log('[DATA FETCH] STEP 1: Profile data received:', JSON.stringify(profileDataResponse, null, 2));
            
            // Extract skills, branches, and diplomaBranches from response
            const skills = Array.isArray(profileDataResponse.skills) ? profileDataResponse.skills : null;
            const branches = Array.isArray(profileDataResponse.branches) ? profileDataResponse.branches : null;
            const diplomaBranches = Array.isArray(profileDataResponse.diplomaBranches) ? profileDataResponse.diplomaBranches : null;
            
            console.log('[DATA FETCH] STEP 1: Skills extracted:', skills?.length || 0);
            console.log('[DATA FETCH] STEP 1: Branches extracted:', branches?.length || 0);
            console.log('[DATA FETCH] STEP 1: Diploma Branches extracted:', diplomaBranches?.length || 0);
            
            set({ 
                profileData: profileDataResponse,
                skills,
                branches,
                diplomaBranches,
            });

            // STEP 2: Check Enrollment Status
            // POST https://apis.dev.cream-collar.com/api/student/v1/home/check-enrol
            let enrollmentData = null;
            try {
                console.log('[DATA FETCH] STEP 2: Checking enrollment status...');
                enrollmentData = await HomeService.checkEnrol();
                console.log('[DATA FETCH] STEP 2: Enrollment data received:', JSON.stringify(enrollmentData, null, 2));
                console.log('[DATA FETCH] STEP 2: roleEnrolled value:', enrollmentData?.roleEnrolled);
                console.log('[DATA FETCH] STEP 2: roleEnrolled type:', typeof enrollmentData?.roleEnrolled);
                const isEnrolledValue = enrollmentData?.roleEnrolled || false;
                console.log('[DATA FETCH] STEP 2: Setting isEnrolled to:', isEnrolledValue);
                set({ isEnrolled: isEnrolledValue });
            } catch (error) {
                console.error('[DATA FETCH] STEP 2: Failed to check enrollment:', error);
                console.error('[DATA FETCH] STEP 2: Error details:', JSON.stringify(error, null, 2));
                // Non-blocking - continue flow
                set({ isEnrolled: false });
            }

            // STEP 3: Fetch Full Profile Details
            // POST https://apis.dev.cream-collar.com/api/student/user-profile/details
            let profileDetails = null;
            try {
                console.log('[DATA FETCH] STEP 3: Fetching profile details...');
                profileDetails = await ProfileService.fetchProfileDetails();
                
                // Validate response
                if (!profileDetails) {
                    console.warn('[DATA FETCH] STEP 3: Profile details is null/undefined');
                    profileDetails = null;
                } else if (typeof profileDetails === 'object' && Object.keys(profileDetails).length === 0) {
                    console.warn('[DATA FETCH] STEP 3: Profile details is empty object');
                    profileDetails = null;
                }
                
                if (profileDetails) {
                    console.log('[DATA FETCH] STEP 3: Profile details received:', JSON.stringify(profileDetails, null, 2));
                    console.log('[DATA FETCH] STEP 3: technicalSkills:', profileDetails?.technicalSkills?.length || 0);
                    console.log('[DATA FETCH] STEP 3: educationalDetails:', profileDetails?.educationalDetails?.length || 0);
                    console.log('[DATA FETCH] STEP 3: workExperience:', profileDetails?.workExperience?.length || 0);
                    console.log('[DATA FETCH] STEP 3: certificate:', profileDetails?.certificate?.length || 0);
                    
                    // Merge with basic profile data safely
                    // Get current profileData from store state
                    const currentProfileData = get().profileData || {};
                    set({
                        profileDetails,
                        profileData: { ...currentProfileData, ...profileDetails }
                    });
                } else {
                    console.warn('[DATA FETCH] STEP 3: No profile details data, keeping existing profileData');
                    // Don't overwrite profileData, set profileDetails to null
                    set({ profileDetails: null });
                }
            } catch (error: any) {
                console.error('[DATA FETCH] STEP 3: Failed to fetch profile details:', error);
                console.error('[DATA FETCH] STEP 3: Error type:', typeof error);
                console.error('[DATA FETCH] STEP 3: Error message:', error?.message);
                console.error('[DATA FETCH] STEP 3: Error response:', error?.response);
                console.error('[DATA FETCH] STEP 3: Error response data:', error?.response?.data);
                console.error('[DATA FETCH] STEP 3: Error response status:', error?.response?.status);
                
                // Non-blocking - continue flow, set profileDetails to null (not empty object)
                // This way ProfileScreen can fall back to profileData
                console.warn('[DATA FETCH] STEP 3: Setting profileDetails to null, will use profileData as fallback');
                set({ profileDetails: null });
            }

            // STEP 4: Fetch Notifications
            // GET https://apis.dev.cream-collar.com/api/student/notification/{userId}
            // userId must be dynamic (fetched from storage)
            try {
                console.log('[DATA FETCH] STEP 4: Fetching notifications...');
                const notifications = await NotificationService.getNotifications();
                console.log('[DATA FETCH] STEP 4: Notifications received:', JSON.stringify(notifications, null, 2));
                if (notifications) {
                    set({ notifications });
                    // Calculate badge count (matching web app functionality)
                    const older = notifications.older?.filter((notif: any) => !notif.isRead) || [];
                    const yesterday = notifications.yesterday?.filter((notif: any) => !notif.isRead) || [];
                    const today = notifications.today?.filter((notif: any) => !notif.isRead) || [];
                    const count = older.length + yesterday.length + today.length;
                    set({ badgeCount: count });
                }
            } catch (error) {
                console.error('[DATA FETCH] STEP 4: Failed to fetch notifications:', error);
                // Non-blocking - continue flow
            }

            // STEP 5: Fetch Profile Completion Percentage
            // POST https://apis.dev.cream-collar.com/api/student/user-profile/get-profile-percentage
            try {
                console.log('[DATA FETCH] STEP 5: Fetching profile percentage...');
                const percentageData = await ProfileService.fetchProfilePercentage();
                console.log('[DATA FETCH] STEP 5: Profile percentage received:', JSON.stringify(percentageData, null, 2));
                if (percentageData) {
                    set({ profilePercentage: percentageData });
                }
            } catch (error) {
                console.error('[DATA FETCH] STEP 5: Failed to fetch profile percentage:', error);
                // Non-blocking - continue flow
            }

            // STEP 6: Fetch Enrolled Courses
            // POST https://apis.dev.cream-collar.com/api/lms/enrol/get-enroll-course
            // NOTE: API is called regardless of roleEnrolled status (as per user requirement)
            console.log('[DATA FETCH] STEP 6: Fetching enrolled courses...');
            console.log('[DATA FETCH] STEP 6: enrollmentData?.roleEnrolled:', enrollmentData?.roleEnrolled);
            console.log('[DATA FETCH] STEP 6: enrollmentData?.preLearning:', enrollmentData?.preLearning);
            console.log('[DATA FETCH] STEP 6: enrollmentData?.userType:', enrollmentData?.userType);
            
            try {
                const coursesResponse = await HomeService.getEnrollCourse();
                console.log('[DATA FETCH] STEP 6: Raw API response type:', typeof coursesResponse);
                console.log('[DATA FETCH] STEP 6: Is array?', Array.isArray(coursesResponse));
                console.log('[DATA FETCH] STEP 6: Full response:', JSON.stringify(coursesResponse, null, 2));
                
                if (coursesResponse) {
                    // Handle different response structures: array, { data: [...] }, { courses: [...] }
                    let coursesArray: any[] = [];
                    
                    if (Array.isArray(coursesResponse)) {
                        coursesArray = coursesResponse;
                        console.log('[DATA FETCH] STEP 6: Response is array, length:', coursesArray.length);
                    } else if (coursesResponse?.data && Array.isArray(coursesResponse.data)) {
                        coursesArray = coursesResponse.data;
                        console.log('[DATA FETCH] STEP 6: Found courses in response.data, length:', coursesArray.length);
                    } else if (coursesResponse?.courses && Array.isArray(coursesResponse.courses)) {
                        coursesArray = coursesResponse.courses;
                        console.log('[DATA FETCH] STEP 6: Found courses in response.courses, length:', coursesArray.length);
                    } else if (coursesResponse?.enrolledCourses && Array.isArray(coursesResponse.enrolledCourses)) {
                        coursesArray = coursesResponse.enrolledCourses;
                        console.log('[DATA FETCH] STEP 6: Found courses in response.enrolledCourses, length:', coursesArray.length);
                    } else {
                        // Try to extract any array from the response
                        const keys = Object.keys(coursesResponse || {});
                        console.log('[DATA FETCH] STEP 6: Response keys:', keys);
                        for (const key of keys) {
                            if (Array.isArray(coursesResponse[key])) {
                                coursesArray = coursesResponse[key];
                                console.log('[DATA FETCH] STEP 6: Found array in key:', key, 'length:', coursesArray.length);
                                break;
                            }
                        }
                    }
                    
                    console.log('[DATA FETCH] STEP 6: Final coursesArray length:', coursesArray.length);
                    if (coursesArray.length > 0) {
                        console.log('[DATA FETCH] STEP 6: First course sample:', JSON.stringify(coursesArray[0], null, 2));
                        console.log('[DATA FETCH] STEP 6: First course CourseProgress:', JSON.stringify(coursesArray[0]?.CourseProgress, null, 2));
                        console.log('[DATA FETCH] STEP 6: First course Courses:', JSON.stringify(coursesArray[0]?.Courses, null, 2));
                    }
                    set({ enrolledCourses: coursesArray });
                } else {
                    console.log('[DATA FETCH] STEP 6: coursesResponse is null/undefined');
                    set({ enrolledCourses: [] });
                }
            } catch (error) {
                console.error('[DATA FETCH] STEP 6: Failed to fetch enrolled courses:', error);
                console.error('[DATA FETCH] STEP 6: Error details:', JSON.stringify(error, null, 2));
                // Non-blocking - continue flow
                set({ enrolledCourses: [] });
            }

            console.log('[DATA FETCH] All data fetching completed successfully');
            set({ loading: false });
        } catch (error: any) {
            console.error('[DATA FETCH] Failed to initialize home:', error);
            console.error('[DATA FETCH] Error details:', JSON.stringify(error?.response?.data || error?.message, null, 2));
            set({
                error: error?.message || 'Failed to load home data',
                loading: false
            });
        }
    },

    /**
     * Initialize Badge Count: Calculate badge count from stored notifications
     * Matches web app functionality - calculates unread count from today, yesterday, older arrays
     */
    initializeBadgeCount: () => {
        const state = get();
        const notifications = state.notifications;
        if (notifications && typeof notifications === 'object' && !Array.isArray(notifications)) {
            const older = notifications.older?.filter((notif: any) => !notif.isRead) || [];
            const yesterday = notifications.yesterday?.filter((notif: any) => !notif.isRead) || [];
            const today = notifications.today?.filter((notif: any) => !notif.isRead) || [];
            const count = older.length + yesterday.length + today.length;
            set({ badgeCount: count });
        }
    },

    /**
     * Fetch Profile Dropdown Data
     * Fetches skills, branches, and diplomaBranches from /api/student/user-profile/data
     * This is called when profile page loads to ensure dropdown data is available
     */
    fetchProfileDropdownData: async () => {
        try {
            console.log('[DATA FETCH] Fetching profile dropdown data...');
            const profileDataResponse = await ProfileService.fetchProfileData();
            
            // Extract skills, branches, and diplomaBranches from response
            const skills = Array.isArray(profileDataResponse.skills) ? profileDataResponse.skills : null;
            const branches = Array.isArray(profileDataResponse.branches) ? profileDataResponse.branches : null;
            const diplomaBranches = Array.isArray(profileDataResponse.diplomaBranches) ? profileDataResponse.diplomaBranches : null;
            
            console.log('[DATA FETCH] Skills extracted:', skills?.length || 0);
            console.log('[DATA FETCH] Branches extracted:', branches?.length || 0);
            console.log('[DATA FETCH] Diploma Branches extracted:', diplomaBranches?.length || 0);
            
            set({ 
                skills,
                branches,
                diplomaBranches,
            });
        } catch (error) {
            console.error('[DATA FETCH] Failed to fetch profile dropdown data:', error);
            // Non-blocking - continue with existing data
        }
    },
}));

export default useProfileStore;

