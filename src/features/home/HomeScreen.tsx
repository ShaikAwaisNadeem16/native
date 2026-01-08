import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography } from '../../styles/theme';
import Header from './components/Header';
import BreadcrumbBar from '../assessments/components/BreadcrumbBar';
import WelcomeBanner from './components/WelcomeBanner';
import CompleteProfileWidget from './components/CompleteProfileWidget';
import CompletedActivitiesCard from './components/CompletedActivitiesCard';
import JourneyBlock from './components/JourneyBlock';
import ActiveCourseCard from './components/ActiveCourseCard';
import LockedCourseCard from './components/LockedCourseCard';
import CompletedCourseCard from './components/CompletedCourseCard';
import ComingSoonCourseCard from './components/ComingSoonCourseCard';
import HomeSectionHeader from './components/HomeSectionHeader';
import useProfileStore from '../../store/useProfileStore';
import { RootStackParamList } from '../../navigation/AppNavigator';

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

    const handleRewatchCourse = () => {
        console.log('Rewatch Course pressed');
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

                let state: 'completed' | 'active' | 'locked' | 'comingSoon' = 'comingSoon';
                if (isCompleted) {
                    state = 'completed';
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
        () => normalizedCourses.filter((c) => c.state === 'locked'),
        [normalizedCourses]
    );
    const comingSoonCourses = useMemo(
        () => normalizedCourses.filter((c) => c.state === 'comingSoon'),
        [normalizedCourses]
    );
    const completedCourses = useMemo(
        () => normalizedCourses.filter((c) => c.state === 'completed'),
        [normalizedCourses]
    );

    // Process completed courses into CompletedActivitiesCard items
    const completedItems = useMemo(() => {
        return completedCourses.map((course) => {
            const isAssessment =
                course.contentType.includes('ASSESSMENT') || course.contentType.includes('TEST');
            const isAssignment = course.contentType.includes('ASSIGNMENT');

            return {
                checkIconUrl: '', // Icon wiring handled separately; keeps visuals unchanged for now
                subtitle: isAssessment
                    ? 'ASSESSMENT CLEARED'
                    : isAssignment
                    ? 'ASSIGNMENT COMPLETED'
                    : 'COURSE COMPLETED',
                title: course.title,
                buttonLabel: isAssessment ? 'View Report' : 'Rewatch Course',
                onButtonPress: isAssessment ? () => handleViewReport(course) : handleRewatchCourse,
            };
        });
    }, [completedCourses]);

    const completedCount = completedItems.length;
    const totalCount = normalizedCourses.length;

    const handleOpenMoodleUrl = (url?: string, course?: any) => {
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
            // Navigate to appropriate assessment screen based on course data
            // For now, default to Engineering Systems Assessment if it's an engineering-related course
            if (course?.title?.toLowerCase().includes('engineering') || 
                course?.subTitle?.toLowerCase().includes('engineering')) {
                console.log('[HomeScreen] Navigating to EngineeringSystemsAssessment for engineering course');
                navigation.navigate('EngineeringSystemsAssessment');
            } else {
                // Default to STEM Assessment Instructions for other assessments
                console.log('[HomeScreen] Navigating to StemAssessmentInstructions for assessment course');
                navigation.navigate('StemAssessmentInstructions');
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

    // Show loading indicator while fetching initial data
    if (loading && !profileData) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header onProfilePress={handleProfilePress} onLogoPress={() => navigation.navigate('Home')} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primaryBlue} />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Show error message if data fetching failed
    if (error && !profileData) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header onProfilePress={handleProfilePress} onLogoPress={() => navigation.navigate('Home')} />
                <View style={styles.loadingContainer}>
                    <Text style={styles.errorText}>Error: {error}</Text>
                    <Text style={styles.loadingText}>Please try again later</Text>
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
                {/* Welcome Banner - Shows greeting with user's name */}
                {profileData && (
                    <WelcomeBanner
                        userName={profileData?.firstName || profileData?.name?.split(' ')[0] || 'User'}
                    />
                )}

                {/* Complete Your Profile Widget */}
                <CompleteProfileWidget
                    percentage={percentageValue}
                    onUpdatePress={handleUpdateProfile}
                />

                {/* Learning Journey Section */}
                <View style={styles.learningJourneySection}>
                    <Text style={styles.sectionTitle}>Your Learning Journey</Text>
                    <View style={styles.blocksContainer}>
                        {/* Section 3: Completed Activities - Show first if there are completed items */}
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
                                <HomeSectionHeader title="Your Active Courses" />
                                {activeCourses.map((course) => (
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
                                ))}
                            </>
                        )}

                        {/* Section 2: Locked / Coming Soon Courses */}
                        {(lockedCourses.length > 0 || comingSoonCourses.length > 0) && (
                            <>
                                {lockedCourses.map((course) => (
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
                                ))}
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
                                    const courseDescription = course?.description || course?.courseDescription || course?.Courses?.description || '';
                                    const courseLevel = course?.level || course?.difficulty || course?.Courses?.level || 'Beginner';
                                    const courseDuration = course?.duration || course?.estimatedDuration || course?.Courses?.duration || '3 hours';
                                    const courseIconUrl = course?.iconUrl || course?.thumbnailUrl || undefined;
                                    
                                    // Extract progress data from API - handle nested structures
                                    const courseProgress = course?.CourseProgress || course?.courseProgress || course?.progress || {};
                                    const progressPercentage = course?.progressPercentage || course?.progress?.percent || courseProgress?.percent || course?.percent || course?.percentage || 0;
                                    const completedModules = course?.completedModules || course?.modulesCompleted || courseProgress?.completedModules || 0;
                                    const totalModules = course?.totalModules || course?.totalModulesCount || course?.modulesTotal || courseProgress?.totalModules || 10;

                                    // Use JourneyBlock for assessments/assignments, otherwise use appropriate card
                                    if (isAssessment || isAssignment) {
                                        return (
                                            <JourneyBlock
                                                key={course?.id || course?.courseId || course?.Courses?.courseId || index}
                                                type={blockType}
                                                iconUrl={courseIconUrl}
                                                subtitle={isAssessment ? 'TEST' : 'ASSIGNMENT'}
                                                title={courseTitle}
                                                description={courseDescription || (isAssessment 
                                                    ? 'You need to clear the test by scoring at least 7/10 in-order to access the next activity in your journey'
                                                    : 'Complete this assignment to progress in your learning journey.')}
                                                level={courseLevel}
                                                duration={courseDuration}
                                                buttonLabel={isAssessment ? 'Take The Test' : (progressPercentage > 0 ? 'Resume Learning' : 'Start Assignment')}
                                                onButtonPress={isAssessment ? handleTakeTheTest : handleRewatchCourse}
                                                onSecondaryButtonPress={!isAssessment ? () => handleCourseDetails(courseTitle) : undefined}
                                                progressPercentage={isActive && !isAssessment && !isAssignment ? progressPercentage : undefined}
                                                completedModules={isActive && !isAssessment && !isAssignment ? completedModules : undefined}
                                                totalModules={isActive && !isAssessment && !isAssignment ? totalModules : undefined}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        ...typography.p4,
        color: colors.textGrey,
    },
    errorText: {
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

