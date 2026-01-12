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

    const handleViewReport = (course?: any) => {
        // Extract moodleCourseId from course data
        const moodleCourseId = course?.moodleCourseId || 
                              course?.lessonId || 
                              course?.raw?.moodleCourseId || 
                              course?.raw?.lessonId ||
                              course?.raw?.Courses?.moodleCourseId ||
                              course?.raw?.Courses?.id;
        
        console.log('[HomeScreen] handleViewReport - course:', JSON.stringify(course, null, 2));
        console.log('[HomeScreen] handleViewReport - extracted moodleCourseId:', moodleCourseId);
        
        if (!moodleCourseId) {
            console.error('[HomeScreen] handleViewReport - No moodleCourseId found in course data');
            // Still navigate but let the screen handle the error
        }
        
        navigation.navigate('StemAssessmentReport', { 
            finalResult: 'Pass', // This will be determined by API response
            lessonId: moodleCourseId,
            moodleCourseId: moodleCourseId,
        });
        
        console.log('[HomeScreen] handleViewReport - Navigation called to StemAssessmentReport');
    };

    const handleViewSubmission = async (course: any) => {
        // Extract moodleCourseId to use as lessonId for API calls
        const moodleCourseId = course?.moodleCourseId || course?.lessonId;
        
        if (!moodleCourseId) {
            console.warn('[HomeScreen] handleViewSubmission - No moodleCourseId found for course:', course?.title);
            return;
        }

        try {
            // Call API to get assignment attempt summary
            const AssignmentService = (await import('../api/assignment')).default;
            const attemptData = await AssignmentService.getAttemptSummary(moodleCourseId);
            
            console.log('[HomeScreen] handleViewSubmission - Attempt summary received:', JSON.stringify(attemptData, null, 2));
            
            // Navigate to test report screen with API response data
            navigation.navigate('StemAssessmentReport', {
                lessonId: moodleCourseId,
                moodleCourseId: moodleCourseId,
                assignmentData: attemptData, // Pass assignment data to report screen
            });
        } catch (error: any) {
            console.error('[HomeScreen] handleViewSubmission - Failed to get assignment attempt summary:', error);
            // Still navigate to report screen, but without data (screen will handle loading/error)
            navigation.navigate('StemAssessmentReport', {
                lessonId: moodleCourseId,
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

                return {
                    raw: course,
                    id: course?.id || course?.courseId || courseMeta?.courseId || index,
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
            const isAssessment =
                contentType.includes('ASSESSMENT') || contentType.includes('TEST');
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
            
            // Get courseId from course data (moodleCourseId or courseId)
            const courseId = course?.moodleCourseId || course?.courseId || course?.id;
            
            if (courseId) {
                console.log('[HomeScreen] Navigating to LearningPath with courseId:', courseId);
                // Navigate to LearningPath screen which will fetch course-view API
                navigation.navigate('LearningPath', { courseId });
            } else {
                console.warn('[HomeScreen] No courseId found for automotive course, navigating to AutomotiveAwareness as fallback');
                navigation.navigate('AutomotiveAwareness');
            }
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
        
        // Check for Survey URL pattern
        if (url.includes('/student/student-survey-intro') || 
            url.includes('student-survey-intro') || 
            url.includes('/survey') ||
            course?.title?.toLowerCase().includes('survey') ||
            course?.subTitle?.toLowerCase().includes('survey')) {
            // Extract moodleCourseId to use as lessonId for API calls
            const moodleCourseId = course?.moodleCourseId || course?.lessonId;
            
            if (moodleCourseId) {
                console.log('[HomeScreen] Navigating to EngineeringAssessmentInstructions for survey with lessonId:', moodleCourseId);
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
            // Extract courseId (moodleCourseId) for the API call
            const courseId = course?.moodleCourseId || 
                           course?.lessonId ||
                           course?.raw?.Courses?.moodleCourseId ||
                           course?.raw?.moodleCourseId ||
                           course?.raw?.Courses?.id ||
                           course?.raw?.id ||
                           course?.id;
            
            if (courseId) {
                console.log('[HomeScreen] Navigating to LearningPath for course:', course?.title, 'courseId:', courseId);
                navigation.navigate('LearningPath', { courseId });
                return;
            } else {
                console.warn('[HomeScreen] Regular course detected but no courseId found. URL:', url, 'Course:', course?.title);
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
    if (loading && !profileData) {
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

    // Show error message if data fetching failed
    if (error && !profileData) {
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
                                                buttonLabel="Start Assessment"
                                                onButtonPress={() => {
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
                                            progressPercentage={course.progressPercentage}
                                            completedModules={course.completedModules}
                                            totalModules={course.totalModules}
                                            primaryButtonLabel={course.buttonText || 'Start Learning'}
                                            onPrimaryButtonPress={() => handleOpenMoodleUrl(course.moodleUrl, course)}
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
                                        
                                        return (
                                            <EngineeringAssessmentCard
                                                key={course?.id || course?.courseId || course?.Courses?.courseId || index}
                                                subtitle="TEST"
                                                title={courseTitle}
                                                description={courseDescription || 'You need to clear the test by scoring at least 7/10 in-order to access the next activity in your journey'}
                                                level={courseLevel}
                                                duration={courseDuration}
                                                buttonLabel="Start Assessment"
                                                onButtonPress={() => {
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
                                        />
                                    );
                                })}
                            </>
                        )}

                        {/* Empty state - show message if no courses at all */}
                        {(!enrolledCourses || !Array.isArray(enrolledCourses) || enrolledCourses.length === 0) && !loading && (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateText}>No courses available at the moment.</Text>
                                <Text style={styles.emptyStateSubtext}>Check back later for new learning opportunities.</Text>
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

