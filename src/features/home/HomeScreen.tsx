import React, { useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography } from '../../styles/theme';
import Header from './components/Header';
import BreadcrumbBar from '../assessments/components/BreadcrumbBar';
import CompleteProfileWidget from './components/CompleteProfileWidget';
import CompletedActivitiesCard from './components/CompletedActivitiesCard';
import JourneyBlock from './components/JourneyBlock';
import EngineeringAssessmentCard from './components/EngineeringAssessmentCard';
import AbortedAssessmentCard from './components/AbortedAssessmentCard';
import ActiveCourseCard from './components/ActiveCourseCard';
import LockedCourseCard from './components/LockedCourseCard';
import CompletedCourseCard from './components/CompletedCourseCard';
import ComingSoonCourseCard from './components/ComingSoonCourseCard';
import HomeSectionHeader from './components/HomeSectionHeader';
import useProfileStore from '../../store/useProfileStore';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { HomeScreenSkeleton, ListSkeleton } from '../../components/common/SkeletonLoaders';
import Storage from '../../utils/storage';

// Icons removed - will be added later

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const { initializeHome, profilePercentage, loading, profileData, error, enrolledCourses, isEnrolled } = useProfileStore();

    // Load home data on mount - executes APIs in strict sequential order
    // APIs are called ONLY after authentication (token stored during login)
    // All APIs include auth headers via GlobalAxiosConfig
    useEffect(() => {
        initializeHome();
    }, [initializeHome]);

    // Debug: Log data when it changes
    useEffect(() => {
        console.log('========================================');
        console.log('[HomeScreen] DATA STATE UPDATE');
        console.log('========================================');
        console.log('[HomeScreen] Profile data:', profileData ? 'EXISTS' : 'NULL');
        console.log('[HomeScreen] Profile percentage:', profilePercentage);
        console.log('[HomeScreen] Loading state:', loading);
        console.log('[HomeScreen] Error state:', error);
        console.log('[HomeScreen] Is enrolled:', isEnrolled);
        console.log('[HomeScreen] Enrolled courses type:', typeof enrolledCourses);
        console.log('[HomeScreen] Enrolled courses is array?', Array.isArray(enrolledCourses));
        console.log('[HomeScreen] Enrolled courses length:', enrolledCourses ? (Array.isArray(enrolledCourses) ? enrolledCourses.length : 'NOT ARRAY') : 'NULL');
        
        if (enrolledCourses && Array.isArray(enrolledCourses)) {
            console.log('[HomeScreen] Enrolled courses count:', enrolledCourses.length);
            if (enrolledCourses.length > 0) {
                console.log('[HomeScreen] First course sample:', JSON.stringify(enrolledCourses[0], null, 2));
            } else {
                console.log('[HomeScreen] ⚠️ enrolledCourses array is EMPTY');
            }
        } else if (enrolledCourses) {
            console.log('[HomeScreen] ⚠️ enrolledCourses is NOT an array:', typeof enrolledCourses);
            console.log('[HomeScreen] enrolledCourses value:', JSON.stringify(enrolledCourses, null, 2));
        } else {
            console.log('[HomeScreen] ⚠️ enrolledCourses is NULL/UNDEFINED');
        }
        
        // Log normalized courses
        console.log('[HomeScreen] Normalized courses count:', normalizedCourses.length);
        console.log('[HomeScreen] Active courses:', activeCourses.length);
        console.log('[HomeScreen] Locked courses:', lockedCourses.length);
        console.log('[HomeScreen] Coming soon courses:', comingSoonCourses.length);
        console.log('[HomeScreen] Completed courses:', completedCourses.length);
        console.log('========================================');
    }, [profileData, profilePercentage, loading, error, enrolledCourses, isEnrolled, normalizedCourses, activeCourses, lockedCourses, comingSoonCourses, completedCourses]);

    // Extract percentage value from API response
    const percentageValue = profilePercentage?.overallPercentage || profilePercentage?.percentage || 70;

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    const handleNotificationPress = () => {
        // Navigate to notifications screen when available
        console.log('Notification pressed');
    };

    const handleLogoPress = () => {
        // Logo clicked - already on home, no action needed
        // Could add scroll to top or other behavior if needed
    };

    const handleUpdateProfile = () => {
        navigation.navigate('Profile');
    };

    const handleCourseDetails = (courseTitle?: string) => {
        // Check if it's Automotive Industry Awareness course
        if (courseTitle && courseTitle.toLowerCase().includes('automotive industry awareness')) {
            // Navigate to Course Details screen
            console.log('[HomeScreen] Navigating to CourseDetails for course:', courseTitle);
            navigation.navigate('CourseDetails', {
                courseId: 'automotive-awareness',
                courseTitle: 'Different Players In The Automotive Industry',
            });
        } else {
            // Default behavior for other courses
            console.log('Course Details pressed for:', courseTitle || 'Unknown course');
        }
    };

    const handleViewReport = async (course?: any) => {
        // Extract moodleCourseId from course data
        const moodleCourseId = course?.moodleCourseId || 
                              course?.lessonId || 
                              course?.raw?.moodleCourseId || 
                              course?.raw?.lessonId ||
                              course?.raw?.Courses?.moodleCourseId ||
                              course?.raw?.Courses?.id;
        
        console.log('[HomeScreen] ===== VIEW REPORT CLICKED =====');
        console.log('[HomeScreen] handleViewReport - course:', JSON.stringify(course, null, 2));
        console.log('[HomeScreen] handleViewReport - extracted moodleCourseId:', moodleCourseId);
        
        if (!moodleCourseId) {
            console.error('[HomeScreen] handleViewReport - No moodleCourseId found in course data');
            // Still navigate but let the screen handle the error
            navigation.navigate('StemAssessmentReport', { 
                lessonId: undefined,
                moodleCourseId: undefined,
            });
            return;
        }

        try {
            // Call POST /api/lms/attempt/quiz with page: "score" to get quiz report
            const AssessmentService = (await import('../api/assessment')).default;
            const userId = await Storage.getItem('userId');
            
            if (!userId) {
                throw new Error('User ID not found');
            }

            console.log('[HomeScreen] Calling POST /api/lms/attempt/quiz with page: "score"');
            console.log('[HomeScreen] Payload:', JSON.stringify({
                lessonId: moodleCourseId,
                page: 'score',
                userId: userId,
            }, null, 2));

            const quizReport = await AssessmentService.attemptQuiz({
                lessonId: moodleCourseId,
                page: 'score',
                userId: userId,
            });

            console.log('[HomeScreen] ===== QUIZ REPORT API RESPONSE =====');
            console.log('[HomeScreen] Quiz report received:', JSON.stringify(quizReport, null, 2));
            console.log('[HomeScreen] Response keys:', quizReport ? Object.keys(quizReport) : 'null/undefined');
            console.log('[HomeScreen] Root pass:', quizReport?.pass);
            console.log('[HomeScreen] Final object:', quizReport?.final);
            console.log('[HomeScreen] Questions object:', quizReport?.questions);
            console.log('[HomeScreen] AttemptId:', quizReport?.attemptId);
            console.log('[HomeScreen] =====================================');

            // Determine final result based on API response
            const finalResult = quizReport?.pass === true || quizReport?.final?.pass === true ? 'Pass' : 'Fail';

            // Navigate to report screen with API response data
            navigation.navigate('StemAssessmentReport', { 
                finalResult: finalResult,
                lessonId: moodleCourseId,
                moodleCourseId: moodleCourseId,
                quizReportData: quizReport, // Pass the full API response
            });

            console.log('[HomeScreen] handleViewReport - Navigation called to StemAssessmentReport with data');
        } catch (error: any) {
            console.error('[HomeScreen] ===== VIEW REPORT ERROR =====');
            console.error('[HomeScreen] handleViewReport - Failed to fetch quiz report:', error);
            console.error('[HomeScreen] Error message:', error?.message);
            console.error('[HomeScreen] Error response:', error?.response?.data);
            console.error('[HomeScreen] Error status:', error?.response?.status);
            console.error('[HomeScreen] =================================');
            
            // Still navigate to report screen, but without data (screen will handle loading/error)
            navigation.navigate('StemAssessmentReport', { 
                lessonId: moodleCourseId,
                moodleCourseId: moodleCourseId,
            });
        }
    };

    const handleViewSubmission = async (course: any) => {
        // Extract moodleCourseId to use as lessonId for API calls
        const moodleCourseId = course?.moodleCourseId || course?.lessonId;
        
        if (!moodleCourseId) {
            console.warn('[HomeScreen] handleViewSubmission - No moodleCourseId found for course:', course?.title);
            return;
        }

        try {
            console.log('[HomeScreen] ===== VIEW SUBMISSION CLICKED =====');
            console.log('[HomeScreen] handleViewSubmission - moodleCourseId:', moodleCourseId);
            console.log('[HomeScreen] handleViewSubmission - Course:', course?.title);
            
            // First, call POST /api/lms/lesson/contents to get assignment details
            const { default: AssignmentService } = await import('../api/assignment');
            console.log('[HomeScreen] Calling POST /api/lms/lesson/contents with lessonId:', moodleCourseId);
            
            const lessonContents = await AssignmentService.getLessonContents(moodleCourseId);
            
            console.log('[HomeScreen] ===== LESSON CONTENTS API RESPONSE =====');
            console.log('[HomeScreen] Lesson contents received:', JSON.stringify(lessonContents, null, 2));
            console.log('[HomeScreen] Response keys:', lessonContents ? Object.keys(lessonContents) : 'null/undefined');
            
            // Extract assignment data from response
            // Response structure: { assign_data: { assign_data: { ... } } } or direct assignment data
            const assignDataRaw = lessonContents?.assign_data?.assign_data || lessonContents?.assign_data || lessonContents;
            const studentDataRaw = lessonContents?.assign_data?.studentData || lessonContents?.studentData || {};
            
            console.log('[HomeScreen] Extracted assignDataRaw:', JSON.stringify(assignDataRaw, null, 2));
            console.log('[HomeScreen] Extracted studentDataRaw:', JSON.stringify(studentDataRaw, null, 2));
            
            // Also get attempt summary to get current submission status
            console.log('[HomeScreen] Calling POST /api/lms/v1/attempt/assignment with page: "attempt-summary"');
            const attemptSummary = await AssignmentService.getAttemptSummary(moodleCourseId);
            
            console.log('[HomeScreen] ===== ATTEMPT SUMMARY API RESPONSE =====');
            console.log('[HomeScreen] Attempt summary received:', JSON.stringify(attemptSummary, null, 2));
            
            // Build assignData from lesson contents API response
            const assignData = {
                title: assignDataRaw?.title || course?.title || 'Assignment',
                description: assignDataRaw?.description || assignDataRaw?.description || '',
                brief: assignDataRaw?.brief || assignDataRaw?.breif || attemptSummary?.breif || '',
                instructions: assignDataRaw?.assignmentDetails || assignDataRaw?.instructions || assignDataRaw?.html || '',
                maxCharacters: assignDataRaw?.maxCharacters || 5000,
                allowedFileTypes: assignDataRaw?.allowedFileTypes || ['.pdf', '.doc', '.docx'],
                maxFileSize: assignDataRaw?.maxFileSize || 10,
            };
            
            // Build attemptData from attempt summary (prioritize attempt summary for current status)
            const attemptData = {
                status: (attemptSummary?.status || studentDataRaw?.status || 'submitted') as 'not_started' | 'in_progress' | 'submitted' | 'evaluated',
                startTime: attemptSummary?.startTime || studentDataRaw?.startedAt || undefined,
                deadline: attemptSummary?.deadline || assignDataRaw?.deadline || '',
                fileStatus: (attemptSummary?.fileStatus || 'not uploaded') as 'none' | 'uploaded' | 'pending' | 'not uploaded',
                file: attemptSummary?.file || null,
                fileIds: attemptSummary?.fileIds || [],
                is_draft: attemptSummary?.is_draft || false,
                evaluated: attemptSummary?.evaluated || false,
                submissionText: attemptSummary?.text || attemptSummary?.submissionText || '',
                uploadedFileName: attemptSummary?.file || undefined,
            };
            
            console.log('[HomeScreen] ===== FINAL DATA FOR NAVIGATION =====');
            console.log('[HomeScreen] assignData:', JSON.stringify(assignData, null, 2));
            console.log('[HomeScreen] attemptData:', JSON.stringify(attemptData, null, 2));
            console.log('[HomeScreen] ======================================');
            
            // Navigate to AssignmentAttemptScreen with the fetched data
            navigation.navigate('AssignmentAttempt', {
                moodleCourseId: moodleCourseId,
                assignData: assignData,
                attemptData: attemptData,
            });
        } catch (error: any) {
            console.error('[HomeScreen] ===== VIEW SUBMISSION ERROR =====');
            console.error('[HomeScreen] handleViewSubmission - Failed to fetch assignment data:', error);
            console.error('[HomeScreen] Error message:', error?.message);
            console.error('[HomeScreen] Error response:', error?.response?.data);
            console.error('[HomeScreen] Error status:', error?.response?.status);
            console.error('[HomeScreen] ===================================');
            
            // Still navigate to assignment attempt screen, but without data (screen will handle loading/error)
            navigation.navigate('AssignmentAttempt', {
                moodleCourseId: moodleCourseId,
            });
        }
    };

    const handleRewatchCourse = (course?: any) => {
        console.log('[HomeScreen] Rewatch/Start Course pressed for:', course?.title);
        
        // Check if this is an assignment
        const contentType = course?.contentType || '';
        const isAssignment = contentType.toUpperCase().includes('ASSIGNMENT');
        
        if (isAssignment) {
            // Extract lessonId and moodleCourseId for assignment navigation
            const lessonId = course?.moodleCourseId || 
                           course?.lessonId || 
                           course?.raw?.Courses?.moodleCourseId ||
                           course?.raw?.moodleCourseId ||
                           course?.raw?.lessonId;
            
            const moodleCourseIdValue = course?.moodleCourseId || 
                                      course?.raw?.Courses?.moodleCourseId ||
                                      course?.raw?.moodleCourseId ||
                                      course?.lessonId || 
                                      lessonId;
            
            if (lessonId) {
                console.log('[HomeScreen] Navigating to AssignmentInstructions with lessonId:', lessonId, 'moodleCourseId:', moodleCourseIdValue);
                navigation.navigate('AssignmentInstructions', {
                    lessonId: lessonId, // Used for /api/lms/lesson/contents (POST /api/lms/lesson/contents)
                    assignmentId: lessonId,
                    moodleCourseId: moodleCourseIdValue, // Used for /api/lms/v1/attempt/assignment (POST /api/lms/v1/attempt/assignment)
                });
            } else {
                console.warn('[HomeScreen] Assignment detected but no lessonId found. Course:', JSON.stringify(course, null, 2));
            }
            return;
        }
        
        // For regular courses, use handleOpenMoodleUrl
        handleOpenMoodleUrl(course?.moodleUrl, course);
    };

    const handleReattempt = () => {
        // Navigate to STEM Assessment Test screen
        navigation.navigate('StemAssessmentTest');
    };

    const handleTakeTheTest = () => {
        // Navigate to STEM Assessment Test screen - Take the Test button
        navigation.navigate('StemAssessmentTest');
    };

    const handleOpenPreviousReport = () => {
        navigation.navigate('StemAssessmentReport', { finalResult: 'Fail' });
    };

    /**
     * Normalize enrolledCourses response from /api/lms/enrol/get-enroll-course
     * using CourseProgress.* and Courses.* fields.
     * 
     * API Response Structure:
     * [
     *   {
     *     courseId: "CID-0543",           // Root-level courseId - USE THIS for course-view API
     *     Courses: {
     *       courseId: "CID-0543",         // Same as root level
     *       moodleCourseId: "LID-2278",   // Use for lesson/assessment APIs
     *       title: "...",
     *       contentType: "survey" | "assignment" | "stemAssessment" | "Course" | ...
     *     },
     *     CourseProgress: { ... }
     *   }
     * ]
     * 
     * For courses (contentType: "Course"), use root-level courseId to call:
     * POST /api/lms/course/course-view with { courseId, userId }
     */
    const normalizedCourses = useMemo(() => {
        if (!Array.isArray(enrolledCourses)) {
            return [];
        }

        return enrolledCourses
            .map((course: any, index: number) => {
                const courseProgress = course?.CourseProgress || course?.courseProgress || {};
                const courseMeta = course?.Courses || course?.course || course || {};

                const lockedOrUnlocked = courseProgress?.lockedOrUnlocked || course?.lockedOrUnlocked;
                const courseProgressStatus =
                    courseProgress?.courseProgress || course?.courseProgressStatus || course?.courseProgress;
                const result = courseProgress?.result || course?.result;
                const contentType = (courseMeta?.contentType || course?.contentType || 'COURSE')
                    .toString()
                    .toUpperCase();
                const buttonText = courseMeta?.buttonText || course?.buttonText;
                const title =
                    courseMeta?.title || course?.title || course?.courseName || course?.name || 'Untitled';
                const description =
                    courseMeta?.description || course?.description || course?.courseDescription || '';
                const duration =
                    courseMeta?.duration || course?.duration || course?.estimatedDuration || '3 hours';
                const subTitle = courseMeta?.subTitle || course?.subTitle || contentType;
                const moodleUrl = courseMeta?.moodleUrl || course?.moodleUrl;
                const reason = courseProgress?.reason || course?.reason;
                const iconUrl = course?.iconUrl || course?.thumbnailUrl || undefined;
                // Extract moodleCourseId to use as lessonId for API calls
                // Priority: Courses.moodleCourseId > course.moodleCourseId
                const moodleCourseId = courseMeta?.moodleCourseId || 
                                      course?.moodleCourseId ||
                                      courseMeta?.moodleCourseId ||
                                      course?.moodleCourseId;
                
                // Log moodleCourseId extraction for debugging (only for assignments)
                if (courseMeta?.contentType?.includes('ASSIGNMENT') || course?.contentType?.includes('ASSIGNMENT')) {
                    console.log('[HomeScreen] Assignment course data:', {
                        courseMetaKeys: Object.keys(courseMeta || {}),
                        courseKeys: Object.keys(course || {}),
                        courseMetaMoodleCourseId: courseMeta?.moodleCourseId,
                        courseMoodleCourseId: course?.moodleCourseId,
                        extractedMoodleCourseId: moodleCourseId,
                    });
                }

                const courseOrder =
                    courseMeta?.courseOrder ??
                    course?.courseOrder ??
                    course?.order ??
                    index;

                // Derive state from CourseProgress.* and fall back to existing fields
                const status = (course?.status || course?.courseStatus || '').toString().toLowerCase();
                const progressState = (courseProgressStatus || '').toString().toLowerCase();
                const lockedState = (lockedOrUnlocked || '').toString().toLowerCase();
                const resultState = (result || '').toString().toLowerCase();

                const isCompleted =
                    progressState === 'completed' ||
                    status === 'completed' ||
                    status === 'passed' ||
                    resultState === 'pass' ||
                    course?.isCompleted;

                // Check if assessment is aborted/failed BEFORE checking locked state
                const isAborted =
                    resultState === 'fail' ||
                    resultState === 'failed' ||
                    status === 'aborted' ||
                    status === 'failed' ||
                    progressState === 'aborted' ||
                    progressState === 'failed';

                const isUnlocked = lockedState === 'unlocked';
                const isLocked = lockedState === 'locked';
                const isActiveProgress =
                    progressState === 'notstarted' ||
                    progressState === 'not_started' ||
                    progressState === 'inprogress' ||
                    progressState === 'in_progress' ||
                    progressState === 'started';

                // More lenient state detection - also check status field
                const statusActive = status === 'active' || status === 'in_progress' || status === 'available' || status === 'started';
                const statusLocked = status === 'locked' || status === 'coming_soon';

                let state: 'completed' | 'active' | 'locked' | 'comingSoon' | 'aborted' = 'comingSoon';
                if (isCompleted) {
                    state = 'completed';
                } else if (isAborted) {
                    // Aborted state takes priority over locked
                    state = 'aborted';
                } else if (isUnlocked && (isActiveProgress || statusActive)) {
                    state = 'active';
                } else if (isUnlocked && !isLocked) {
                    // If unlocked but no progress state, still show as active
                    state = 'active';
                } else if (isLocked || statusLocked) {
                    state = 'locked';
                } else if (statusActive) {
                    // Fallback: if status says active, treat as active
                    state = 'active';
                } else {
                    state = 'comingSoon';
                }

                // Progress data
                const progressPercentage =
                    course?.progressPercentage ||
                    course?.progress?.percent ||
                    courseProgress?.percent ||
                    course?.percent ||
                    course?.percentage ||
                    0;

                const completedModules =
                    course?.completedModules ||
                    course?.modulesCompleted ||
                    courseProgress?.completedModules ||
                    0;

                const totalModules =
                    course?.totalModules ||
                    course?.totalModulesCount ||
                    course?.modulesTotal ||
                    courseProgress?.totalModules ||
                    0;

                // Extract deadline from various possible locations
                const deadline = courseMeta?.deadline || 
                               course?.deadline || 
                               courseProgress?.deadline ||
                               course?.endTime ||
                               course?.endDate ||
                               courseMeta?.endTime ||
                               courseMeta?.endDate;

                // Extract courseId from root level (for course-view API)
                // Priority: course.courseId (root level) > courseMeta.courseId > course.id
                const courseIdForView = course?.courseId || 
                                       courseMeta?.courseId || 
                                       course?.id || 
                                       index;
                
                // Extract reattempt information from API
                const retakeDays = course?.retakeDays || courseMeta?.retakeDays || null;
                const retakeExact = course?.retakeExact || courseMeta?.retakeExact || null;
                
                // Extract lockedOrUnlocked status from CourseProgress
                const lockedOrUnlockedStatus = lockedOrUnlocked || course?.lockedOrUnlocked || 'unlocked';
                
                return {
                    raw: course,
                    id: course?.id || course?.courseId || courseMeta?.courseId || index,
                    courseId: courseIdForView, // Store root-level courseId for course-view API
                    lessonId: moodleCourseId, // Store moodleCourseId as lessonId for assignment navigation
                    moodleCourseId: moodleCourseId, // Also store separately for clarity
                    order: courseOrder,
                    state,
                    contentType,
                    title,
                    description,
                    duration,
                    subTitle,
                    moodleUrl,
                    buttonText,
                    reason,
                    iconUrl,
                    progressPercentage,
                    completedModules,
                    totalModules,
                    deadline, // Store deadline for deadline exceeded checks
                    isAborted, // Store aborted state for later use
                    resultState, // Store result state for aborted detection
                    lockedOrUnlocked: lockedOrUnlockedStatus, // Store locked/unlocked status
                    retakeDays: retakeDays, // Store retake days
                    retakeExact: retakeExact, // Store exact retake time (e.g., "0 days 2 hrs 24 mins")
                };
            })
            .sort((a, b) => {
                const aOrder = typeof a.order === 'number' ? a.order : 0;
                const bOrder = typeof b.order === 'number' ? b.order : 0;
                return aOrder - bOrder;
            });
    }, [enrolledCourses]);

    const activeCourses = useMemo(
        () => normalizedCourses.filter((c) => c.state === 'active'),
        [normalizedCourses]
    );
    const lockedCourses = useMemo(
        () => normalizedCourses.filter((c) => c.state === 'locked' || c.state === 'aborted'),
        [normalizedCourses]
    );
    const comingSoonCourses = useMemo(
        () => normalizedCourses.filter((c) => c.state === 'comingSoon'),
        [normalizedCourses]
    );
    // Helper function to check if deadline has passed
    const isDeadlineExceeded = useCallback((deadline: string | null | undefined): boolean => {
        if (!deadline) return false;
        
        try {
            // Parse various deadline formats
            // Format examples: "7th January 2026, 5:18pm", "2026-01-07T17:18:00.000Z", etc.
            let deadlineDate: Date | null = null;
            
            // Try ISO format first
            if (deadline.includes('T') || deadline.includes('Z')) {
                deadlineDate = new Date(deadline);
            } else {
                // Try parsing common date formats
                // Handle formats like "7th January 2026, 5:18pm"
                const dateStr = deadline.replace(/(\d+)(st|nd|rd|th)/, '$1'); // Remove ordinal suffixes
                deadlineDate = new Date(dateStr);
            }
            
            if (!deadlineDate || isNaN(deadlineDate.getTime())) {
                return false; // Invalid date
            }
            
            const now = new Date();
            return deadlineDate < now;
        } catch (error) {
            console.error('[HomeScreen] Error parsing deadline:', deadline, error);
            return false;
        }
    }, []);

    const completedCourses = useMemo(
        () => normalizedCourses.filter((c) => c.state === 'completed'),
        [normalizedCourses]
    );

    // Find assessments/exams with expired deadlines that aren't already completed
    const deadlineExceededAssessments = useMemo(() => {
        return normalizedCourses
            .filter((course) => {
                const isAssessment =
                    course.contentType.includes('ASSESSMENT') || course.contentType.includes('TEST');
                if (!isAssessment) return false;
                
                // Check if already completed
                if (course.state === 'completed') return false;
                
                // Check for deadline - use the deadline field we stored during normalization
                const deadline = course.deadline;
                
                return deadline && isDeadlineExceeded(deadline);
            })
            .map((course) => ({
                ...course,
                state: 'completed' as const, // Mark as completed for display
            }));
    }, [normalizedCourses, isDeadlineExceeded]);

    // Combine completed courses with deadline-exceeded assessments
    const allCompletedItems = useMemo(() => {
        return [...completedCourses, ...deadlineExceededAssessments];
    }, [completedCourses, deadlineExceededAssessments]);

    // Process completed courses into CompletedActivitiesCard items
    const completedItems = useMemo(() => {
        return allCompletedItems.map((course) => {
            const contentType = course.contentType || '';
            const contentTypeUpper = contentType.toUpperCase();
            const titleLower = (course.title || '').toLowerCase();

            // Treat STEM / Engineering assessments as assessments even if contentType
            // is not correctly tagged from backend. This ensures their CTA shows
            // "View Report" instead of "Rewatch Course" when finished.
            const isStemOrEngineeringAssessment =
                titleLower.includes('stem assessment') ||
                titleLower.includes('engineering assessment') ||
                titleLower.includes('engineering systems');

            const isAssessment =
                contentTypeUpper.includes('ASSESSMENT') ||
                contentTypeUpper.includes('TEST') ||
                isStemOrEngineeringAssessment;
            const isAssignment = contentType.includes('ASSIGNMENT');

            // Check if this is a deadline-exceeded assessment
            const deadline = course.deadline;
            const isDeadlinePassed =
                deadline &&
                isDeadlineExceeded(deadline) &&
                isAssessment &&
                !completedCourses.some((c) => c.id === course.id);

            // Special-case: Automotive Awareness Assignment in completed activities
            // Check for "CC Automotive" or any automotive-related assignment
            const courseTitleLower = (course.title || '').toLowerCase();
            const isAutomotiveAwarenessAssignment =
                isAssignment &&
                (courseTitleLower.includes('automotive') || 
                 courseTitleLower.includes('cc automotive') ||
                 courseTitleLower.includes('automotive awareness'));

            const buttonLabel = isAssessment
                ? 'View Report'
                : isAutomotiveAwarenessAssignment
                ? 'View Submission'
                : 'Rewatch Course';

            return {
                checkIconUrl: '', // Icon wiring handled separately; keeps visuals unchanged for now
                useGreenCheck: isAssessment, // Use green check icon for completed assessments
                subtitle: isDeadlinePassed
                    ? 'ASSESSMENT DEADLINE EXCEEDED'
                    : isAssessment
                    ? 'ASSESSMENT CLEARED'
                    : isAssignment
                    ? 'ASSIGNMENT COMPLETED'
                    : 'COURSE COMPLETED',
                title: course.title,
                buttonLabel,
                onButtonPress: isAssessment 
                    ? () => handleViewReport(course) 
                    : isAutomotiveAwarenessAssignment
                    ? () => handleViewSubmission(course)
                    : handleRewatchCourse,
            };
        });
    }, [allCompletedItems, isDeadlineExceeded, completedCourses]);

    const completedCount = completedItems.length;
    const totalCount = normalizedCourses.length;

    const handleOpenMoodleUrl = (url?: string, course?: any) => {
        // Check if this is Automotive Awareness course - check both URL and course title/subtitle
        // This check should happen even if URL is missing, as we can identify by title
        const courseTitle = (course?.title || '').toLowerCase();
        const courseSubtitle = (course?.subTitle || '').toLowerCase();
        const isAutomotiveAwareness = (courseTitle.includes('automotive') && 
                                      (courseTitle.includes('awareness') || courseSubtitle.includes('awareness'))) ||
                                     (url && (url.includes('/automotive') && url.includes('/awareness')));
        
        if (isAutomotiveAwareness) {
            console.log('[HomeScreen] ===== AUTOMOTIVE AWARENESS COURSE CLICKED =====');
            console.log('[HomeScreen] Course data:', JSON.stringify(course, null, 2));
            
            // Get courseId from root level of enrolled courses API response
            // Priority: course.courseId (from normalized) > course.raw.courseId (root level) > course.raw.Courses.courseId > fallback
            const courseId = course?.courseId || 
                           course?.raw?.courseId || 
                           course?.raw?.Courses?.courseId ||
                           course?.id ||
                           course?.moodleCourseId;
            
            console.log('[HomeScreen] Extracted courseId for course-view API:', courseId);
            console.log('[HomeScreen] Raw course data courseId:', course?.raw?.courseId);
            console.log('[HomeScreen] Raw Courses.courseId:', course?.raw?.Courses?.courseId);
            console.log('[HomeScreen] Normalized courseId:', course?.courseId);
            console.log('[HomeScreen] Full course object keys:', course ? Object.keys(course) : 'null');
            
            // Ensure courseId is a valid string
            const validCourseId = courseId && 
                                 courseId !== 'undefined' && 
                                 courseId !== 'null' && 
                                 String(courseId).trim() !== '';
            
            if (validCourseId) {
                const courseIdString = String(courseId).trim();
                console.log('[HomeScreen] ===== NAVIGATING TO LEARNING PATH =====');
                console.log('[HomeScreen] CourseId for course-view API:', courseIdString);
                console.log('[HomeScreen] Course title:', course?.title);
                console.log('[HomeScreen] Course data structure:', {
                    hasCourseId: !!course?.courseId,
                    hasRawCourseId: !!course?.raw?.courseId,
                    hasRawCoursesCourseId: !!course?.raw?.Courses?.courseId,
                    normalizedCourseId: course?.courseId,
                    rawCourseId: course?.raw?.courseId,
                    rawCoursesCourseId: course?.raw?.Courses?.courseId,
                });
                // Navigate to LearningPath screen which will:
                // 1. Fetch course-view API with this courseId
                // 2. Display modules and lessons
                // 3. When "Start Learning" is clicked, navigate to first unlocked lesson
                // 4. If lesson name includes "different players", navigate to ReadDifferentPlayers
                navigation.navigate('LearningPath', { courseId: courseIdString });
            } else {
                console.error('[HomeScreen] ===== NO VALID COURSE ID FOUND =====');
                console.error('[HomeScreen] Course object:', JSON.stringify(course, null, 2));
                console.error('[HomeScreen] Available course fields:', {
                    courseId: course?.courseId,
                    rawCourseId: course?.raw?.courseId,
                    rawCoursesCourseId: course?.raw?.Courses?.courseId,
                    id: course?.id,
                    moodleCourseId: course?.moodleCourseId,
                });
                console.warn('[HomeScreen] Falling back to AutomotiveAwareness screen');
                navigation.navigate('AutomotiveAwareness');
            }
            return;
        }
        
        // Check if this is a Role Recommendation course - navigate to FAQ screen
        const isRoleRecommendation = course?.contentType && 
                                    (course.contentType.includes('ROLERECOMMENDATION') || 
                                     course.contentType.toUpperCase().includes('ROLERECOMMENDATION')) ||
                                    (url && (url.includes('/role') || url.includes('student/role'))) ||
                                    course?.title?.toLowerCase().includes('role recommendation') ||
                                    course?.buttonText?.toLowerCase().includes('view insights');
        
        if (isRoleRecommendation) {
            console.log('[HomeScreen] ===== ROLE RECOMMENDATION CLICKED =====');
            console.log('[HomeScreen] Course data:', JSON.stringify(course, null, 2));
            console.log('[HomeScreen] Navigating to RoleRecommendation screen');
            navigation.navigate('RoleRecommendation');
            return;
        }
        
        if (!url) return;
        
        // Check if this is an assignment - check both URL and course contentType
        const isAssignmentUrl = url.includes('/student/assignment') || 
                                url.includes('/assignment');
        const isAssignmentCourse = course?.contentType && 
                                  (course.contentType.includes('ASSIGNMENT') || 
                                   course.contentType.toUpperCase().includes('ASSIGNMENT'));
        
        if (isAssignmentUrl || isAssignmentCourse) {
            // Extract moodleCourseId to use as lessonId - prioritize from normalized course data
            let lessonId: string | undefined;
            
            // First, try to get moodleCourseId from normalized course data
            if (course?.moodleCourseId) {
                lessonId = course.moodleCourseId;
                console.log('[HomeScreen] Using moodleCourseId from normalized course data:', lessonId);
            } else if (course?.lessonId) {
                // Fallback to lessonId if moodleCourseId not available
                lessonId = course.lessonId;
                console.log('[HomeScreen] Using lessonId from normalized course data:', lessonId);
            } else if (isAssignmentUrl) {
                // Extract from URL path if not in course data
                const urlParts = url.split('/');
                lessonId = urlParts[urlParts.length - 1];
                console.log('[HomeScreen] Extracted lessonId from URL:', lessonId);
            }
            
            // Fallback to raw course data if extraction didn't work
            if (!lessonId) {
                lessonId = course?.raw?.Courses?.moodleCourseId ||
                          course?.raw?.moodleCourseId ||
                          course?.raw?.Courses?.lessonId ||
                          course?.raw?.lessonId ||
                          course?.raw?.Courses?.id ||
                          course?.raw?.id ||
                          course?.raw?.courseId ||
                          course?.raw?.Courses?.courseId;
                console.log('[HomeScreen] Using fallback from raw course data:', lessonId);
            }
            
            if (lessonId) {
                // Pass both lessonId (for fetching contents) and moodleCourseId (for start assignment API)
                // moodleCourseId comes from Courses.moodleCourseId in the enrolled courses API response
                // If not available in normalized course, try to get from raw course data
                const moodleCourseIdValue = course?.moodleCourseId || 
                                          course?.raw?.Courses?.moodleCourseId ||
                                          course?.raw?.moodleCourseId ||
                                          course?.lessonId || 
                                          lessonId;
                console.log('[HomeScreen] Navigating to AssignmentInstructions with lessonId:', lessonId, 'moodleCourseId:', moodleCourseIdValue);
                navigation.navigate('AssignmentInstructions', {
                    lessonId: lessonId, // Used for /api/lms/lesson/contents (POST /api/lms/lesson/contents)
                    assignmentId: lessonId,
                    moodleCourseId: moodleCourseIdValue, // Used for /api/lms/v1/attempt/assignment (POST /api/lms/v1/attempt/assignment)
                });
            } else {
                console.warn('[HomeScreen] Assignment detected but no moodleCourseId/lessonId found. URL:', url, 'Course:', JSON.stringify(course, null, 2));
            }
            return;
        }
        
        // Check for Survey URL pattern (including "career survey")
        const isSurveyUrl = url.includes('/student/student-survey-intro') || 
            url.includes('student-survey-intro') || 
            url.includes('/survey');
        const isSurveyCourse = course?.title?.toLowerCase().includes('survey') ||
            course?.title?.toLowerCase().includes('career') ||
            course?.subTitle?.toLowerCase().includes('survey') ||
            course?.subTitle?.toLowerCase().includes('career') ||
            course?.contentType?.toLowerCase().includes('survey');
        
        if (isSurveyUrl || isSurveyCourse) {
            // Extract moodleCourseId to use as lessonId for API calls
            const moodleCourseId = course?.moodleCourseId || course?.lessonId;
            
            if (moodleCourseId) {
                console.log('[HomeScreen] Navigating to EngineeringAssessmentInstructions for survey with lessonId:', moodleCourseId);
                // Navigate to instructions screen first, which will then navigate to SurveyAssessmentQuestions
                navigation.navigate('EngineeringAssessmentInstructions', {
                    lessonId: moodleCourseId,
                    moodleCourseId: moodleCourseId,
                });
            } else {
                console.warn('[HomeScreen] Survey detected but no moodleCourseId found. URL:', url, 'Course:', course?.title);
            }
            return;
        }
        
        // Check if this is a regular course (not assignment, survey, or assessment)
        // For regular courses, navigate to LearningPath screen which will fetch course-view API
        const isRegularCourse = !isAssignmentUrl && 
                                !isAssignmentCourse && 
                                !url.includes('/student/student-survey-intro') &&
                                !url.includes('/survey') &&
                                !url.includes('/student/engIntro') &&
                                !url.includes('engIntro') &&
                                course?.contentType &&
                                (course.contentType.includes('COURSE') || 
                                 course.contentType.toUpperCase().includes('COURSE'));
        
        if (isRegularCourse) {
            // Extract courseId from root level of enrolled courses API response
            // This is the courseId that should be used for POST /api/lms/course/course-view
            // Priority: course.courseId (from normalized) > course.raw.courseId (root level) > fallback
            const courseId = course?.courseId || 
                           course?.raw?.courseId || 
                           course?.id ||
                           course?.moodleCourseId;
            
            console.log('[HomeScreen] ===== REGULAR COURSE CLICKED =====');
            console.log('[HomeScreen] Course title:', course?.title);
            console.log('[HomeScreen] Extracted courseId for course-view API:', courseId);
            console.log('[HomeScreen] Raw course data courseId:', course?.raw?.courseId);
            console.log('[HomeScreen] Normalized courseId:', course?.courseId);
            console.log('[HomeScreen] Content type:', course?.contentType);
            
            if (courseId) {
                console.log('[HomeScreen] Navigating to LearningPath for course:', course?.title, 'courseId:', courseId);
                // Navigate to LearningPath screen which will fetch course-view API with this courseId
                navigation.navigate('LearningPath', { courseId });
                return;
            } else {
                console.warn('[HomeScreen] Regular course detected but no courseId found. URL:', url, 'Course:', course?.title);
                console.warn('[HomeScreen] Available course fields:', Object.keys(course || {}));
                console.warn('[HomeScreen] Raw course fields:', Object.keys(course?.raw || {}));
            }
        }
        
        // Check for Engineering Systems Assessment URL pattern
        if (url.includes('/student/engIntro') || url.includes('engIntro')) {
            console.log('[HomeScreen] Navigating to EngineeringSystemsAssessment for URL:', url);
            navigation.navigate('EngineeringSystemsAssessment');
            return;
        }
        
        // Check for other assessment/test patterns
        const isAssessmentUrl = url.includes('/student/assessment') || 
                               url.includes('/assessment') ||
                               url.includes('/test') ||
                               url.includes('/quiz');
        const isAssessmentCourse = course?.contentType && 
                                  (course.contentType.includes('ASSESSMENT') || 
                                   course.contentType.includes('TEST') ||
                                   course.contentType.toUpperCase().includes('ASSESSMENT'));
        
        if (isAssessmentUrl || isAssessmentCourse) {
            // Extract moodleCourseId to use as lessonId for API calls
            const moodleCourseId = course?.moodleCourseId || course?.lessonId;
            
            // Check if this is STEM Assessment - navigate directly to STEM instructions
            const isStemAssessment = course?.title?.toLowerCase().includes('stem') || 
                                   course?.subTitle?.toLowerCase().includes('stem') ||
                                   moodleCourseId?.includes('LID-A-0019');
            
            if (isStemAssessment) {
                console.log('[HomeScreen] Detected STEM Assessment, navigating to StemAssessmentInstructions');
                navigation.navigate('StemAssessmentInstructions');
                return;
            }
            
            if (moodleCourseId) {
                console.log('[HomeScreen] Navigating to EngineeringAssessmentInstructions for assessment with lessonId:', moodleCourseId);
                navigation.navigate('EngineeringAssessmentInstructions', {
                    lessonId: moodleCourseId,
                    moodleCourseId: moodleCourseId,
                });
            } else {
                // Fallback to old navigation if no moodleCourseId
                if (course?.title?.toLowerCase().includes('engineering') || 
                    course?.subTitle?.toLowerCase().includes('engineering')) {
                    console.log('[HomeScreen] Navigating to EngineeringSystemsAssessment for engineering course');
                    navigation.navigate('EngineeringSystemsAssessment');
                } else {
                    console.log('[HomeScreen] Navigating to StemAssessmentInstructions for assessment course');
                    navigation.navigate('StemAssessmentInstructions');
                }
            }
            return;
        }
        
        // For external URLs (moodle URLs), use Linking
        // Check if it's a full URL (starts with http:// or https://)
        if (url.startsWith('http://') || url.startsWith('https://')) {
            Linking.openURL(url).catch((err) => {
                console.error('Failed to open course URL:', err);
            });
            return;
        }
        
        // Relative URL that doesn't match any known pattern - log for debugging
        console.warn('[HomeScreen] Relative URL not handled:', url, 'Course:', course?.title || 'Unknown');
    };

    // Show skeleton loader while fetching initial data
    if (loading && !profileData && !enrolledCourses) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header onProfilePress={handleProfilePress} onLogoPress={() => navigation.navigate('Home')} />
                <BreadcrumbBar items={['Your Learning Journey']} />
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <HomeScreenSkeleton />
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Show error message if data fetching failed and we have no data at all
    if (error && !profileData && !enrolledCourses) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header onProfilePress={handleProfilePress} onLogoPress={() => navigation.navigate('Home')} />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Error: {error}</Text>
                    <Text style={styles.errorSubtext}>Please try again later</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Header
                onProfilePress={handleProfilePress}
                onNotificationPress={handleNotificationPress}
                onLogoPress={handleLogoPress}
            />

            {/* Breadcrumb Bar */}
            <BreadcrumbBar items={['Your Learning Journey']} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Complete Your Profile Widget */}
                <CompleteProfileWidget
                    percentage={percentageValue}
                    onUpdatePress={handleUpdateProfile}
                />

                {/* Learning Journey Section */}
                <View style={styles.learningJourneySection}>
                    <Text style={styles.sectionTitle}>Your Learning Journey</Text>
                    <View style={styles.blocksContainer}>
                        {/* Section 3: Past Activities - Show first if there are completed items */}
                        {completedCount > 0 && (
                            <CompletedActivitiesCard
                                completed={completedCount}
                                total={totalCount || completedCount}
                                completedItems={completedItems}
                            />
                        )}

                        {/* Section 1: Active / Unlocked Courses */}
                        {activeCourses.length > 0 && (
                            <>
                                {activeCourses.map((course) => {
                                    // Check if this is an assessment (case-insensitive)
                                    const contentTypeUpper = (course.contentType || '').toUpperCase();
                                    const isAssessment = contentTypeUpper.includes('ASSESSMENT') || contentTypeUpper.includes('TEST');
                                    
                                    // Check if this is a survey FIRST (before assessment check)
                                    const isSurvey = course.title?.toLowerCase().includes('survey') || 
                                                   course.title?.toLowerCase().includes('career') ||
                                                   course.subTitle?.toLowerCase().includes('survey') ||
                                                   course.subTitle?.toLowerCase().includes('career') ||
                                                   course.contentType?.toLowerCase().includes('survey') ||
                                                   course.moodleUrl?.includes('/survey') ||
                                                   course.moodleUrl?.includes('student-survey-intro');
                                    
                                    if (isSurvey) {
                                        // Extract moodleCourseId to use as lessonId for API calls
                                        const moodleCourseId = course?.moodleCourseId || course?.lessonId;
                                        
                                        // Check if assessment is aborted
                                        const resultState = (course?.result || course?.CourseProgress?.result || '').toString().toLowerCase();
                                        const status = (course?.status || course?.courseStatus || '').toString().toLowerCase();
                                        const isAborted = resultState === 'fail' || 
                                                         resultState === 'failed' ||
                                                         status === 'aborted' ||
                                                         status === 'failed' ||
                                                         course?.state === 'aborted';
                                        
                                        // Calculate reattempt days (if available from API)
                                        const reattemptDays = course?.reattemptDays || course?.daysUntilReattempt || 60;
                                        
                                        if (isAborted) {
                                            return (
                                                <AbortedAssessmentCard
                                                    key={course.id}
                                                    subtitle="TEST"
                                                    title={course.title}
                                                    reattemptDays={reattemptDays}
                                                    onViewReport={() => {
                                                        // Navigate to assessment report
                                                        if (moodleCourseId) {
                                                            navigation.navigate('StemAssessmentReport', {
                                                                lessonId: moodleCourseId,
                                                                moodleCourseId: moodleCourseId,
                                                            });
                                                        }
                                                    }}
                                                />
                                            );
                                        }
                                        
                                        // Check if survey is in progress
                                        const isSurveyInProgress = course?.CourseProgress?.courseProgress === 'inProgress' ||
                                                                  course?.buttonText?.toLowerCase().includes('resume') ||
                                                                  course?.Courses?.attemptId;
                                        const surveyAttemptId = course?.Courses?.attemptId || course?.attemptId;
                                        
                                        return (
                                            <EngineeringAssessmentCard
                                                key={course.id}
                                                subtitle="TEST"
                                                title={course.title}
                                                description={course.description || 'You need to clear the test by scoring at least 7/10 in-order to access the next activity in your journey'}
                                                level={course.subTitle || 'Beginner'}
                                                duration={course.duration || '3 hours'}
                                                buttonLabel={isSurveyInProgress ? (course?.buttonText || "Resume Survey") : "Start Survey"}
                                                onButtonPress={() => {
                                                    if (moodleCourseId) {
                                                        console.log('[HomeScreen] Detected Survey, navigating to EngineeringAssessmentInstructions with lessonId:', moodleCourseId);
                                                        console.log('[HomeScreen] Survey in progress:', isSurveyInProgress);
                                                        console.log('[HomeScreen] Survey attemptId:', surveyAttemptId);
                                                        // Navigate to instructions screen first, which will then navigate to SurveyAssessmentQuestions
                                                        // Pass attemptId if survey is in progress
                                                        navigation.navigate('EngineeringAssessmentInstructions', {
                                                            lessonId: moodleCourseId,
                                                            moodleCourseId: moodleCourseId,
                                                            attemptId: surveyAttemptId, // Pass attemptId if survey is in progress
                                                        });
                                                    } else {
                                                        console.warn('[HomeScreen] Survey detected but no moodleCourseId found:', course.title);
                                                    }
                                                }}
                                            />
                                        );
                                    }
                                    
                                    // Use the already declared contentTypeUpper and isAssessment variables
                                    
                                    if (isAssessment) {
                                        // Extract moodleCourseId to use as lessonId for API calls
                                        const moodleCourseId = course?.moodleCourseId || course?.lessonId;
                                        
                                        // Check if assessment is aborted
                                        const resultState = (course?.result || course?.CourseProgress?.result || '').toString().toLowerCase();
                                        const status = (course?.status || course?.courseStatus || '').toString().toLowerCase();
                                        const isAborted = resultState === 'fail' || 
                                                         resultState === 'failed' ||
                                                         status === 'aborted' ||
                                                         status === 'failed' ||
                                                         course?.state === 'aborted';
                                        
                                        // Calculate reattempt days (if available from API)
                                        const reattemptDays = course?.reattemptDays || course?.daysUntilReattempt || 60;
                                        
                                        if (isAborted) {
                                            return (
                                                <AbortedAssessmentCard
                                                    key={course.id}
                                                    subtitle="TEST"
                                                    title={course.title}
                                                    reattemptDays={reattemptDays}
                                                    onViewReport={() => {
                                                        // Navigate to assessment report
                                                        if (moodleCourseId) {
                                                            navigation.navigate('StemAssessmentReport', {
                                                                lessonId: moodleCourseId,
                                                                moodleCourseId: moodleCourseId,
                                                            });
                                                        }
                                                    }}
                                                />
                                            );
                                        }
                                        
                                        return (
                                            <EngineeringAssessmentCard
                                                key={course.id}
                                                subtitle="TEST"
                                                title={course.title}
                                                description={course.description || 'You need to clear the test by scoring at least 7/10 in-order to access the next activity in your journey'}
                                                level={course.subTitle || 'Beginner'}
                                                duration={course.duration || '3 hours'}
                                                buttonLabel={isSurvey ? "Start Survey" : "Start Assessment"}
                                                onButtonPress={() => {
                                                    // Check if this is a Survey - navigate to instructions screen first
                                                    if (isSurvey) {
                                                        if (moodleCourseId) {
                                                            console.log('[HomeScreen] Detected Survey, navigating to EngineeringAssessmentInstructions with lessonId:', moodleCourseId);
                                                            // Navigate to instructions screen first, which will then navigate to SurveyAssessmentQuestions
                                                            navigation.navigate('EngineeringAssessmentInstructions', {
                                                                lessonId: moodleCourseId,
                                                                moodleCourseId: moodleCourseId,
                                                            });
                                                        } else {
                                                            console.warn('[HomeScreen] Survey detected but no moodleCourseId found:', course.title);
                                                        }
                                                        return;
                                                    }
                                                    
                                                    // Check if this is STEM Assessment - navigate directly to STEM instructions
                                                    const isStemAssessment = course.title?.toLowerCase().includes('stem') || 
                                                                             course.subTitle?.toLowerCase().includes('stem') ||
                                                                             moodleCourseId?.includes('LID-A-0019');
                                                    
                                                    if (isStemAssessment) {
                                                        console.log('[HomeScreen] Detected STEM Assessment, navigating to StemAssessmentInstructions');
                                                        navigation.navigate('StemAssessmentInstructions');
                                                        return;
                                                    }
                                                    
                                                    // Navigate to Assessment Instructions screen for other assessments
                                                    // Uses same API call: POST /api/lms/lesson/contents with { lessonId: moodleCourseId, userId }
                                                    if (moodleCourseId) {
                                                        console.log('[HomeScreen] Navigating to EngineeringAssessmentInstructions with lessonId:', moodleCourseId, 'for assessment:', course.title);
                                                        navigation.navigate('EngineeringAssessmentInstructions', {
                                                            lessonId: moodleCourseId,
                                                            moodleCourseId: moodleCourseId,
                                                        });
                                                    } else {
                                                        console.warn('[HomeScreen] No moodleCourseId found for assessment:', course.title);
                                                        // Fallback to old navigation (should not happen for properly configured assessments)
                                                        if (course.title?.toLowerCase().includes('engineering') || 
                                                            course.subTitle?.toLowerCase().includes('engineering')) {
                                                            navigation.navigate('EngineeringSystemsAssessment');
                                                        } else {
                                                            handleTakeTheTest();
                                                        }
                                                    }
                                                }}
                                            />
                                        );
                                    }
                                    
                                    // Regular course card
                                    return (
                                        <ActiveCourseCard
                                            key={course.id}
                                            iconUrl={course.iconUrl}
                                            subtitle={course.subTitle || course.contentType}
                                            title={course.title}
                                            description={course.description || 'Continue your learning journey with this course.'}
                                            level={course.subTitle}
                                            duration={course.duration}
                                            contentType={course.contentType}
                                            lockedOrUnlocked={course.lockedOrUnlocked}
                                            retakeDays={course.retakeDays}
                                            retakeExact={course.retakeExact}
                                            progressPercentage={course.progressPercentage}
                                            completedModules={course.completedModules}
                                            totalModules={course.totalModules}
                                            primaryButtonLabel={course.buttonText || 'Start Learning'}
                                            onPrimaryButtonPress={() => {
                                                console.log('[HomeScreen] ===== START LEARNING BUTTON CLICKED =====');
                                                console.log('[HomeScreen] Course:', course?.title);
                                                console.log('[HomeScreen] Course data:', JSON.stringify(course, null, 2));
                                                console.log('[HomeScreen] CourseId available:', course?.courseId);
                                                console.log('[HomeScreen] Raw courseId:', course?.raw?.courseId);
                                                handleOpenMoodleUrl(course.moodleUrl, course);
                                            }}
                                            secondaryButtonLabel="Course Details"
                                            onSecondaryButtonPress={() => handleCourseDetails(course.title)}
                                        />
                                    );
                                })}
                            </>
                        )}

                        {/* Section 2: Locked / Coming Soon Courses */}
                        {(lockedCourses.length > 0 || comingSoonCourses.length > 0) && (
                            <>
                                {lockedCourses.map((course) => {
                                    // Check if this is an aborted assessment
                                    const contentTypeUpper = (course.contentType || '').toUpperCase();
                                    const isAssessment = contentTypeUpper.includes('ASSESSMENT') || contentTypeUpper.includes('TEST');
                                    const moodleCourseId = course?.moodleCourseId || course?.lessonId;
                                    
                                    // Check if assessment is aborted
                                    const resultState = course?.resultState || (course?.raw?.result || course?.raw?.CourseProgress?.result || '').toString().toLowerCase();
                                    const status = (course?.raw?.status || course?.raw?.courseStatus || '').toString().toLowerCase();
                                    const isAborted = course?.isAborted || 
                                                     resultState === 'fail' || 
                                                     resultState === 'failed' ||
                                                     status === 'aborted' ||
                                                     status === 'failed';
                                    
                                    // Calculate reattempt days (if available from API)
                                    const reattemptDays = course?.raw?.reattemptDays || course?.raw?.daysUntilReattempt || 60;
                                    
                                    if (isAssessment && isAborted) {
                                        return (
                                            <AbortedAssessmentCard
                                                key={course.id}
                                                subtitle="TEST"
                                                title={course.title}
                                                reattemptDays={reattemptDays}
                                                onViewReport={() => {
                                                    // Navigate to assessment report
                                                    if (moodleCourseId) {
                                                        navigation.navigate('StemAssessmentReport', {
                                                            lessonId: moodleCourseId,
                                                            moodleCourseId: moodleCourseId,
                                                        });
                                                    }
                                                }}
                                            />
                                        );
                                    }
                                    
                                    return (
                                        <LockedCourseCard
                                            key={course.id}
                                            iconUrl={course.iconUrl}
                                            subtitle={course.subTitle || course.contentType}
                                            title={course.title}
                                            description={course.description || 'This course will be available soon.'}
                                            level={course.subTitle}
                                            duration={course.duration}
                                            contentType={course.contentType}
                                            lockedOrUnlocked={course.lockedOrUnlocked}
                                            retakeDays={course.retakeDays}
                                            retakeExact={course.retakeExact}
                                            reason={course.reason}
                                        />
                                    );
                                })}
                                {comingSoonCourses.map((course) => (
                                    <ComingSoonCourseCard
                                        key={course.id}
                                        iconUrl={course.iconUrl}
                                        subtitle={course.subTitle || course.contentType}
                                        title={course.title}
                                        contentType={course.contentType}
                                        lockedOrUnlocked={course.lockedOrUnlocked}
                                        retakeDays={course.retakeDays}
                                        retakeExact={course.retakeExact}
                                    />
                                ))}
                            </>
                        )}

                        {/* Fallback: Render ALL courses if normalizedCourses is empty but enrolledCourses has data */}
                        {normalizedCourses.length === 0 && Array.isArray(enrolledCourses) && enrolledCourses.length > 0 && (
                            <>
                                <HomeSectionHeader title="Your Courses" />
                                {enrolledCourses.map((course: any, index: number) => {
                                    const courseStatus = course?.status?.toLowerCase() || course?.courseStatus?.toLowerCase() || '';
                                    const courseType = course?.type?.toUpperCase() || course?.courseType?.toUpperCase() || course?.contentType?.toUpperCase() || 'COURSE';
                                    const isAssessment = courseType.includes('ASSESSMENT') || courseType.includes('TEST');
                                    const isAssignment = courseType.includes('ASSIGNMENT');
                                    const isCompleted = courseStatus === 'completed' || courseStatus === 'passed' || course?.isCompleted;
                                    const isReattempt = courseStatus === 'failed' || courseStatus === 'reattempt' || course?.needsReattempt;
                                    const isActive = courseStatus === 'active' || courseStatus === 'in_progress' || courseStatus === 'available';

                                    // Determine block type
                                    let blockType: 'active' | 'comingSoon' | 'reattempt' = 'comingSoon';
                                    if (isActive) blockType = 'active';
                                    else if (isReattempt) blockType = 'reattempt';

                                    // Skip completed (already shown in CompletedActivitiesCard)
                                    if (isCompleted) return null;

                                    const courseTitle = course?.title || course?.courseName || course?.name || course?.Courses?.title || 'Untitled';
                                    let courseDescription = course?.description || course?.courseDescription || course?.Courses?.description || '';
                                    
                                    // Format deadline if it exists and clean up any "Invalid Date" text in description
                                    const deadline = course?.deadline || course?.raw?.deadline || course?.CourseProgress?.deadline || course?.raw?.CourseProgress?.deadline;
                                    
                                    // Remove any "Invalid Date" text from description
                                    if (courseDescription) {
                                        courseDescription = courseDescription.replace(/Invalid Date/gi, '').trim();
                                    }
                                    
                                    if (isAssignment && deadline) {
                                        try {
                                            // Format deadline for display
                                            let deadlineDate: Date | null = null;
                                            
                                            // Try ISO format first
                                            if (deadline.includes('T') || deadline.includes('Z')) {
                                                deadlineDate = new Date(deadline);
                                            } else {
                                                // Try parsing common date formats
                                                const dateStr = deadline.replace(/(\d+)(st|nd|rd|th)/, '$1'); // Remove ordinal suffixes
                                                deadlineDate = new Date(dateStr);
                                            }
                                            
                                            if (deadlineDate && !isNaN(deadlineDate.getTime())) {
                                                const formattedDeadline = deadlineDate.toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                });
                                                // Replace any existing deadline text or append if not present
                                                const deadlineRegex = /deadline:\s*[^\n]*/gi;
                                                if (deadlineRegex.test(courseDescription)) {
                                                    courseDescription = courseDescription.replace(deadlineRegex, `Deadline: ${formattedDeadline}`);
                                                } else if (!courseDescription.toLowerCase().includes('deadline')) {
                                                    courseDescription = courseDescription 
                                                        ? `${courseDescription}\n\nDeadline: ${formattedDeadline}`
                                                        : `Deadline: ${formattedDeadline}`;
                                                }
                                            }
                                        } catch (error) {
                                            console.error('[HomeScreen] Error formatting deadline:', deadline, error);
                                            // Don't add invalid date to description
                                        }
                                    }
                                    
                                    const courseLevel = course?.level || course?.difficulty || course?.Courses?.level || 'Beginner';
                                    const courseDuration = course?.duration || course?.estimatedDuration || course?.Courses?.duration || '3 hours';
                                    const courseIconUrl = course?.iconUrl || course?.thumbnailUrl || course?.raw?.iconUrl || course?.raw?.thumbnailUrl || course?.Courses?.iconUrl || undefined;
                                    
                                    // Extract progress data from API - handle nested structures
                                    const courseProgress = course?.CourseProgress || course?.courseProgress || course?.progress || {};
                                    const progressPercentage = course?.progressPercentage || course?.progress?.percent || courseProgress?.percent || course?.percent || course?.percentage || 0;
                                    const completedModules = course?.completedModules || course?.modulesCompleted || courseProgress?.completedModules || 0;
                                    const totalModules = course?.totalModules || course?.totalModulesCount || course?.modulesTotal || courseProgress?.totalModules || 10;

                                    // Use EngineeringAssessmentCard for assessments, JourneyBlock for assignments
                                    if (isAssessment) {
                                        // Extract moodleCourseId to use as lessonId for API calls
                                        const moodleCourseId = course?.moodleCourseId || 
                                                              course?.lessonId ||
                                                              course?.Courses?.moodleCourseId ||
                                                              course?.raw?.moodleCourseId;
                                        
                                        // Check if assessment is aborted
                                        const resultState = (course?.result || course?.CourseProgress?.result || courseStatus || '').toString().toLowerCase();
                                        const isAborted = resultState === 'fail' || 
                                                         resultState === 'failed' ||
                                                         courseStatus === 'aborted' ||
                                                         courseStatus === 'failed' ||
                                                         isReattempt; // Reattempt also means aborted/failed
                                        
                                        // Calculate reattempt days (if available from API)
                                        const reattemptDays = course?.reattemptDays || course?.daysUntilReattempt || 60;
                                        
                                        if (isAborted) {
                                            return (
                                                <AbortedAssessmentCard
                                                    key={course?.id || course?.courseId || course?.Courses?.courseId || index}
                                                    subtitle="TEST"
                                                    title={courseTitle}
                                                    reattemptDays={reattemptDays}
                                                    onViewReport={() => {
                                                        // Navigate to assessment report
                                                        if (moodleCourseId) {
                                                            navigation.navigate('StemAssessmentReport', {
                                                                lessonId: moodleCourseId,
                                                                moodleCourseId: moodleCourseId,
                                                            });
                                                        }
                                                    }}
                                                />
                                            );
                                        }
                                        
                                        // Check if this is a survey (including "career survey")
                                        const isSurvey = courseTitle?.toLowerCase().includes('survey') || 
                                                       courseTitle?.toLowerCase().includes('career') ||
                                                       course?.subTitle?.toLowerCase().includes('survey') ||
                                                       course?.subTitle?.toLowerCase().includes('career') ||
                                                       course?.contentType?.toLowerCase().includes('survey') ||
                                                       course?.moodleUrl?.includes('/survey') ||
                                                       course?.moodleUrl?.includes('student-survey-intro');
                                        
                                        return (
                                            <EngineeringAssessmentCard
                                                key={course?.id || course?.courseId || course?.Courses?.courseId || index}
                                                subtitle="TEST"
                                                title={courseTitle}
                                                description={courseDescription || 'You need to clear the test by scoring at least 7/10 in-order to access the next activity in your journey'}
                                                level={courseLevel}
                                                duration={courseDuration}
                                                buttonLabel={isSurvey ? "Start Survey" : "Start Assessment"}
                                                onButtonPress={() => {
                                                    // Check if this is a Survey - navigate to instructions screen first
                                                    if (isSurvey) {
                                                        if (moodleCourseId) {
                                                            console.log('[HomeScreen] Detected Survey, navigating to EngineeringAssessmentInstructions with lessonId:', moodleCourseId);
                                                            // Navigate to instructions screen first, which will then navigate to SurveyAssessmentQuestions
                                                            navigation.navigate('EngineeringAssessmentInstructions', {
                                                                lessonId: moodleCourseId,
                                                                moodleCourseId: moodleCourseId,
                                                            });
                                                        } else {
                                                            console.warn('[HomeScreen] Survey detected but no moodleCourseId found:', courseTitle);
                                                        }
                                                        return;
                                                    }
                                                    
                                                    // Check if this is STEM Assessment - navigate directly to STEM instructions
                                                    const isStemAssessment = courseTitle?.toLowerCase().includes('stem') || 
                                                                             course?.subTitle?.toLowerCase().includes('stem') ||
                                                                             moodleCourseId?.includes('LID-A-0019');
                                                    
                                                    if (isStemAssessment) {
                                                        console.log('[HomeScreen] Detected STEM Assessment, navigating to StemAssessmentInstructions');
                                                        navigation.navigate('StemAssessmentInstructions');
                                                        return;
                                                    }
                                                    
                                                    // Navigate to Assessment Instructions screen for other assessments
                                                    // Uses same API call: POST /api/lms/lesson/contents with { lessonId: moodleCourseId, userId }
                                                    if (moodleCourseId) {
                                                        console.log('[HomeScreen] Navigating to EngineeringAssessmentInstructions with lessonId:', moodleCourseId, 'for assessment:', courseTitle);
                                                        navigation.navigate('EngineeringAssessmentInstructions', {
                                                            lessonId: moodleCourseId,
                                                            moodleCourseId: moodleCourseId,
                                                        });
                                                    } else {
                                                        console.warn('[HomeScreen] No moodleCourseId found for assessment:', courseTitle);
                                                        // Fallback to old navigation (should not happen for properly configured assessments)
                                                        if (courseTitle?.toLowerCase().includes('engineering') || 
                                                            course?.subTitle?.toLowerCase().includes('engineering')) {
                                                            navigation.navigate('EngineeringSystemsAssessment');
                                                        } else {
                                                            handleTakeTheTest();
                                                        }
                                                    }
                                                }}
                                            />
                                        );
                                    }
                                    if (isAssignment) {
                                        return (
                                            <JourneyBlock
                                                key={course?.id || course?.courseId || course?.Courses?.courseId || index}
                                                type={blockType}
                                                iconUrl={courseIconUrl}
                                                subtitle="ASSIGNMENT"
                                                title={courseTitle}
                                                description={courseDescription || 'Complete this assignment to progress in your learning journey.'}
                                                level={courseLevel}
                                                duration={courseDuration}
                                                buttonLabel={progressPercentage > 0 ? 'Resume Learning' : 'Start Assignment'}
                                                onButtonPress={() => handleRewatchCourse(course)}
                                                onSecondaryButtonPress={() => handleCourseDetails(courseTitle)}
                                                progressPercentage={isActive ? progressPercentage : undefined}
                                                completedModules={isActive ? completedModules : undefined}
                                                totalModules={isActive ? totalModules : undefined}
                                                buttons={isReattempt ? [
                                                    {
                                                        label: course?.reattemptMessage || 'Reattempt in 60 Days',
                                                        disabled: course?.canReattempt === false,
                                                        showIcon: course?.canReattempt === false,
                                                        onPress: handleReattempt,
                                                    },
                                                    {
                                                        label: 'Open Previous Report',
                                                        disabled: false,
                                                        onPress: handleOpenPreviousReport,
                                                    },
                                                ] : undefined}
                                            />
                                        );
                                    }

                                    // For regular courses, use ActiveCourseCard if active, otherwise ComingSoonCourseCard
                                    if (isActive) {
                                        return (
                                            <ActiveCourseCard
                                                key={course?.id || course?.courseId || course?.Courses?.courseId || index}
                                                iconUrl={courseIconUrl}
                                                subtitle={courseType}
                                                title={courseTitle}
                                                description={courseDescription || 'Continue your learning journey with this course.'}
                                                level={courseLevel}
                                                duration={courseDuration}
                                                contentType={course?.contentType || course?.Courses?.contentType}
                                                lockedOrUnlocked={course?.lockedOrUnlocked || course?.CourseProgress?.lockedOrUnlocked}
                                                retakeDays={course?.retakeDays}
                                                retakeExact={course?.retakeExact}
                                                progressPercentage={progressPercentage}
                                                completedModules={completedModules}
                                                totalModules={totalModules}
                                                primaryButtonLabel={course?.buttonText || course?.Courses?.buttonText || 'Start Learning'}
                                                onPrimaryButtonPress={() => handleOpenMoodleUrl(course?.moodleUrl || course?.Courses?.moodleUrl, course)}
                                                secondaryButtonLabel="Course Details"
                                                onSecondaryButtonPress={() => handleCourseDetails(courseTitle)}
                                            />
                                        );
                                    }

                                    return (
                                        <ComingSoonCourseCard
                                            key={course?.id || course?.courseId || course?.Courses?.courseId || index}
                                            iconUrl={courseIconUrl}
                                            subtitle={courseType}
                                            title={courseTitle}
                                            description={courseDescription || 'This course will be available soon.'}
                                            level={courseLevel}
                                            duration={courseDuration}
                                            contentType={course?.contentType || course?.Courses?.contentType}
                                            lockedOrUnlocked={course?.lockedOrUnlocked || course?.CourseProgress?.lockedOrUnlocked}
                                            retakeDays={course?.retakeDays}
                                            retakeExact={course?.retakeExact}
                                        />
                                    );
                                })}
                            </>
                        )}

                        {/* Empty state - show message if no courses at all */}
                        {(!enrolledCourses || !Array.isArray(enrolledCourses) || enrolledCourses.length === 0) && !loading && (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateText}>
                                    {isEnrolled === false 
                                        ? 'You are not enrolled in any courses yet.' 
                                        : 'No courses available at the moment.'}
                                </Text>
                                <Text style={styles.emptyStateSubtext}>
                                    {isEnrolled === false
                                        ? 'Please contact your administrator to get enrolled in courses.'
                                        : 'Check back later for new learning opportunities.'}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        ...typography.p3Bold,
        color: colors.error,
        marginBottom: 8,
        textAlign: 'center',
    },
    errorSubtext: {
        ...typography.p4,
        color: colors.textGrey,
        textAlign: 'center',
    },
    errorTextOld: {
        ...typography.p3Regular,
        color: colors.error || '#FF0000',
        textAlign: 'center',
        marginBottom: 8,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 32,
    },
    learningJourneySection: {
        paddingHorizontal: 16,
        paddingTop: 24, // Gap from widget to section title
        gap: 24, // Gap between title and blocks
        width: '100%',
    },
    sectionTitle: {
        ...typography.h6,
        color: colors.black2 || colors.primaryDarkBlue,
        width: '100%',
    },
    blocksContainer: {
        gap: 16,
        width: '100%',
    },
    emptyState: {
        paddingVertical: 48,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyStateText: {
        ...typography.p3Bold,
        color: colors.primaryDarkBlue,
        textAlign: 'center',
        marginBottom: 8,
    },
    emptyStateSubtext: {
        ...typography.p4,
        color: colors.textGrey,
        textAlign: 'center',
    },
});

export default HomeScreen;

