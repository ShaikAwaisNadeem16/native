import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography } from '../../styles/theme';
import Header from '../home/components/Header';
import BreadcrumbBar from '../assessments/components/BreadcrumbBar';
import AssignmentHeaderCard from './components/AssignmentHeaderCard';
import AssignmentInstructions, { AssignmentTermsAndButton } from './components/AssignmentInstructions';
import AssignmentService from '../../api/assignment';
import { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteProp = {
    key: string;
    name: string;
    params?: {
        lessonId?: string;
        assignmentId?: string;
        moodleCourseId?: string;
    };
};

/**
 * AssignmentInstructionsScreen
 * 
 * Displays assignment intro and instructions using real API data.
 * Fetches from POST /api/lms/lesson/contents
 */
const AssignmentInstructionsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProp>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [assignmentData, setAssignmentData] = useState<any>(null);

    // lessonId is used to fetch lesson contents
    const lessonId = route.params?.lessonId || route.params?.assignmentId;
    // moodleCourseId is used for start assignment and attempt summary APIs
    const moodleCourseId = route.params?.moodleCourseId;

    console.log('[AssignmentInstructions] Route params:', JSON.stringify(route.params, null, 2));
    console.log('[AssignmentInstructions] Extracted lessonId:', lessonId);
    console.log('[AssignmentInstructions] Extracted moodleCourseId:', moodleCourseId);

    useEffect(() => {
        if (!lessonId) {
            setError('Lesson ID is required');
            setLoading(false);
            return;
        }

        const fetchAssignmentData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await AssignmentService.getLessonContents(lessonId);
                console.log('[AssignmentInstructions] API response:', JSON.stringify(response, null, 2));
                setAssignmentData(response);
            } catch (err: any) {
                console.error('[AssignmentInstructions] Failed to fetch assignment data:', err);
                setError(err?.message || 'Failed to load assignment');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignmentData();
    }, [lessonId]);

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    const handleNotificationPress = () => {
        // Navigate to notifications screen when available
        console.log('Notification pressed');
    };

    const handleLogoPress = () => {
        navigation.navigate('Home');
    };

    const handleStartAssignment = async () => {
        // IMPORTANT: Use moodleCourseId for start assignment API
        // If moodleCourseId not available, fall back to lessonId
        const courseIdForAttempt = moodleCourseId || lessonId;
        
        if (!courseIdForAttempt) {
            console.error('[AssignmentInstructions] No moodleCourseId or lessonId available');
            setError('Course ID is required to start assignment');
            return;
        }

        try {
            // Call the Start Assignment API
            // POST /api/lms/v1/attempt/assignment with { lessonId: moodleCourseId, page: "attempt-summary", userId }
            // Note: API field is "lessonId" but VALUE comes from Courses.moodleCourseId
            console.log('[AssignmentInstructions] Starting assignment with courseId (moodleCourseId):', courseIdForAttempt);
            const response = await AssignmentService.startAssignment(courseIdForAttempt);
            console.log('[AssignmentInstructions] Start Assignment response:', JSON.stringify(response, null, 2));

            // ONLY navigate to AssignmentAttemptScreen after successful API response
            // Response structure: { id, status, startTime, deadline, breif, assign_data, ... }
            navigation.navigate('AssignmentAttempt', {
                moodleCourseId: courseIdForAttempt,
                assignData: response.assign_data?.assign_data || response.assign_data,
                attemptData: {
                    id: response.id,
                    status: response.status,
                    startTime: response.startTime,
                    deadline: response.deadline,
                    fileStatus: response.fileStatus,
                    is_draft: response.is_draft,
                    evaluated: response.evaluated,
                    attemptCount: response.attemptCount,
                    breif: response.breif,
                },
            });
        } catch (err: any) {
            console.error('[AssignmentInstructions] Failed to start assignment:', err);
            setError(err?.message || 'Failed to start assignment');
        }
    };

    // Extract data from API response - use exact field names from API
    const assignData = assignmentData?.assign_data || {};
    const studentData = assignmentData?.studentData || {};

    console.log('[AssignmentInstructions] assignData:', JSON.stringify(assignData, null, 2));
    console.log('[AssignmentInstructions] studentData:', JSON.stringify(studentData, null, 2));

    const assignmentTitle = assignData?.title || 'Assignment';
    const assignmentDescription = assignData?.description || '';
    const assignmentDuration = assignData?.duration || '';
    const instructionsHtml = assignData?.html || '';
    const termsText = assignData?.terms || 'I have read and understood all the instructions.';
    const buttonLabel = (assignData?.btntext || 'Start Assignment').trim();
    const assignmentIconUrl = assignData?.iconUrl || assignData?.icon || undefined;

    // Deadline is extracted from terms HTML, not from studentData
    // The terms HTML contains: "Your deadline will be set for <strong>7th January, 5:22pm</strong>"
    // This will be parsed in AssignmentTermsAndButton component

    // Determine if button should be disabled based on student status
    const isButtonDisabledByStatus = studentData?.status === 'completed' || 
                                     studentData?.status === 'submitted' ||
                                     studentData?.status === 'submitted';

    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header 
                    onProfilePress={handleProfilePress} 
                    onNotificationPress={handleNotificationPress}
                    onLogoPress={handleLogoPress}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primaryBlue} />
                    <Text style={styles.loadingText}>Loading assignment...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header 
                    onProfilePress={handleProfilePress} 
                    onNotificationPress={handleNotificationPress}
                    onLogoPress={handleLogoPress}
                />
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
            <BreadcrumbBar items={['Your Learning Journey', assignmentTitle]} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Assignment Header Card */}
                <AssignmentHeaderCard
                    iconUrl={assignmentIconUrl}
                    title={assignmentTitle}
                    description={assignmentDescription}
                    duration={assignmentDuration}
                />

                {/* Assignment Instructions */}
                <AssignmentInstructions
                    instructionsHtml={instructionsHtml}
                />

                {/* Terms and Button Section - Separate from instructions card */}
                <AssignmentTermsAndButton
                    termsText={termsText}
                    buttonLabel={buttonLabel}
                    onStartAssignment={handleStartAssignment}
                    isButtonDisabled={isButtonDisabledByStatus}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainBgGrey, // #f6f9fc from Figma
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
        gap: 20, // 20px gap between sections from Figma
    },
});

export default AssignmentInstructionsScreen;

