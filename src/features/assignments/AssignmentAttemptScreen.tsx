import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography } from '../../styles/theme';
import Header from '../home/components/Header';
import BreadcrumbBar from '../assessments/components/BreadcrumbBar';
import AssignmentAttemptHeader from './components/AssignmentAttemptHeader';
import AssignmentSubmissionPanel from './components/AssignmentSubmissionPanel';
import DeadlineExceededModal from './components/DeadlineExceededModal';
import AssignmentService, {
    AssignmentAttemptData,
    AssignmentAttemptInfo,
} from '../../api/assignment';
import Storage from '../../utils/storage';
import { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteProp = {
    key: string;
    name: string;
    params?: {
        moodleCourseId?: string;
        assignData?: AssignmentAttemptData;
        attemptData?: AssignmentAttemptInfo;
    };
};

/**
 * AssignmentAttemptScreen
 *
 * Assignment Attempt / Submission page rendered AFTER the student clicks "Start Assignment"
 * and the API call POST /api/lms/v1/attempt/assignment succeeds.
 *
 * This screen is ONLY rendered after successful API response.
 * DO NOT render this screen before API success.
 *
 * Figma Design: node 8217-85764
 *
 * IMPORTANT: Uses moodleCourseId (from Courses.moodleCourseId) for all API calls.
 * The API field is "lessonId" but the VALUE comes from moodleCourseId.
 *
 * Data Flow:
 * 1. User clicks "Start Assignment" on AssignmentInstructionsScreen
 * 2. API call: POST /api/lms/v1/attempt/assignment with { lessonId: moodleCourseId, page: "start", userId }
 * 3. On success, navigate to this screen with API response data
 * 4. This screen renders AssignmentAttemptHeader and AssignmentSubmissionPanel
 */
const AssignmentAttemptScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProp>();

    // Extract data from route params (passed from AssignmentInstructionsScreen after API success)
    // IMPORTANT: Use moodleCourseId for all API calls (save draft, submit)
    const moodleCourseId = route.params?.moodleCourseId || '';
    const assignData = route.params?.assignData;
    const attemptData = route.params?.attemptData;

    // If no data is available, show error state
    if (!assignData || !attemptData) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header
                    onProfilePress={() => navigation.navigate('Profile')}
                    onNotificationPress={() => console.log('Notification pressed')}
                    onLogoPress={() => navigation.navigate('Home')}
                />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Assignment data not available</Text>
                    <Text style={styles.errorSubtext}>Please start the assignment again</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Extract values from API response
    const title = assignData.title || 'Assignment';
    const description = assignData.description || '';
    const brief = assignData.brief || assignData.description || '';
    const instructions = assignData.instructions || '';
    const maxCharacters = assignData.maxCharacters || 5000;
    const allowedFileTypes = assignData.allowedFileTypes || ['.pdf', '.doc', '.docx'];
    const maxFileSize = assignData.maxFileSize || 10;

    const deadline = attemptData.deadline || '';
    const isSubmitted = attemptData.status === 'submitted';
    const isEvaluated = attemptData.evaluated || false;
    const isDraft = attemptData.is_draft || false;
    const initialText = attemptData.submissionText || '';
    const initialFileName = attemptData.uploadedFileName || attemptData.file || undefined;
    const fileStatus = attemptData.fileStatus;
    const fileIds = attemptData.fileIds || [];
    const [showDeadlineExceededModal, setShowDeadlineExceededModal] = useState(false);

    // Check if deadline has been exceeded
    const isDeadlineExceeded = useMemo(() => {
        if (!deadline) return false;
        
        try {
            // Parse deadline string (format: "7th January 2026, 5:18pm" or ISO string)
            let deadlineDate: Date;
            
            // Try parsing as ISO string first
            if (deadline.includes('T') || deadline.includes('Z')) {
                deadlineDate = new Date(deadline);
            } else {
                // Try parsing formatted date string like "7th January 2026, 5:18pm"
                // Remove ordinal suffixes (st, nd, rd, th)
                const cleanedDeadline = deadline.replace(/(\d+)(st|nd|rd|th)/g, '$1');
                deadlineDate = new Date(cleanedDeadline);
            }
            
            // Check if deadline is in the past
            const now = new Date();
            return deadlineDate < now;
        } catch (error) {
            console.error('[AssignmentAttemptScreen] Error parsing deadline:', error);
            return false;
        }
    }, [deadline]);

    // Handle profile press
    const handleProfilePress = useCallback(() => {
        navigation.navigate('Profile');
    }, [navigation]);

    // Handle notification press
    const handleNotificationPress = useCallback(() => {
        console.log('Notification pressed');
    }, []);

    // Handle logo press
    const handleLogoPress = useCallback(() => {
        navigation.navigate('Home');
    }, [navigation]);

    // Handle deadline exceeded modal okay button
    const handleDeadlineExceededOkay = useCallback(() => {
        setShowDeadlineExceededModal(false);
        // Navigate to home or next allowed action
        navigation.navigate('Home');
    }, [navigation]);

    // Show deadline exceeded modal on screen load if deadline is already exceeded
    useEffect(() => {
        if (isDeadlineExceeded && !isSubmitted) {
            setShowDeadlineExceededModal(true);
        }
    }, [isDeadlineExceeded, isSubmitted]);

    // Handle save draft
    // IMPORTANT: API field is "lessonId" but VALUE comes from moodleCourseId
    const handleSaveDraft = useCallback(async (text: string, fileName?: string) => {
        const userId = await Storage.getItem('userId');
        if (!userId) {
            throw new Error('User ID not found');
        }

        await AssignmentService.saveDraft({
            lessonId: moodleCourseId, // Use moodleCourseId as the value for lessonId
            userId,
            submissionText: text,
            fileName,
        });

        console.log('[AssignmentAttemptScreen] Draft saved successfully with moodleCourseId:', moodleCourseId);
    }, [moodleCourseId]);

    // Handle submit
    // IMPORTANT: API field is "lessonId" but VALUE comes from moodleCourseId
    const handleSubmit = useCallback(async (text: string, fileName?: string) => {
        // Check if deadline has been exceeded
        if (isDeadlineExceeded) {
            setShowDeadlineExceededModal(true);
            return;
        }

        const userId = await Storage.getItem('userId');
        if (!userId) {
            throw new Error('User ID not found');
        }

        try {
            const response = await AssignmentService.submitAssignment({
                lessonId: moodleCourseId, // Use moodleCourseId as the value for lessonId
                userId,
                submissionText: text,
                fileName,
            });

            console.log('[AssignmentAttemptScreen] Assignment submitted successfully with moodleCourseId:', moodleCourseId);

            // Navigate to success screen with time data
            const startTime = attemptData?.startTime;
            const submissionTime = new Date().toISOString(); // Current time as submission time

            navigation.navigate('AssignmentSubmittedSuccess', {
                startTime: startTime || new Date().toISOString(),
                submissionTime: submissionTime,
            });
        } catch (error: any) {
            // Check if error is due to deadline exceeded
            if (error?.response?.data?.message?.toLowerCase().includes('deadline') ||
                error?.response?.data?.error?.toLowerCase().includes('deadline')) {
                setShowDeadlineExceededModal(true);
            } else {
                throw error;
            }
        }
    }, [moodleCourseId, navigation, isDeadlineExceeded, attemptData]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Header
                onProfilePress={handleProfilePress}
                onNotificationPress={handleNotificationPress}
                onLogoPress={handleLogoPress}
            />

            {/* Breadcrumb Bar */}
            <BreadcrumbBar items={['Your Learning Journey', title]} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Assignment Attempt Header */}
                <AssignmentAttemptHeader
                    title={title}
                    description={description}
                    deadline={deadline}
                />

                {/* Assignment Submission Panel */}
                <View style={styles.panelContainer}>
                    <AssignmentSubmissionPanel
                        instructions={instructions}
                        brief={brief}
                        maxCharacters={maxCharacters}
                        allowedFileTypes={allowedFileTypes}
                        maxFileSize={maxFileSize}
                        initialText={initialText}
                        initialFileName={initialFileName}
                        fileStatus={fileStatus}
                        fileIds={fileIds}
                        isDraft={isDraft}
                        isSubmitted={isSubmitted}
                        isEvaluated={isEvaluated}
                        isDeadlineExceeded={isDeadlineExceeded}
                        onSaveDraft={handleSaveDraft}
                        onSubmit={handleSubmit}
                    />
                </View>
            </ScrollView>

            {/* Deadline Exceeded Modal */}
            <DeadlineExceededModal
                visible={showDeadlineExceededModal}
                onOkay={handleDeadlineExceededOkay}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainBgGrey, // #f6f9fc from Figma
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 32,
    },
    panelContainer: {
        paddingHorizontal: 16, // 16px horizontal padding from Figma
        paddingTop: 20, // 20px top padding from Figma
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        ...typography.p3Bold,
        color: colors.error || '#FF0000',
        textAlign: 'center',
        marginBottom: 8,
    },
    errorSubtext: {
        ...typography.p4,
        color: colors.textGrey,
        textAlign: 'center',
    },
});

export default AssignmentAttemptScreen;
