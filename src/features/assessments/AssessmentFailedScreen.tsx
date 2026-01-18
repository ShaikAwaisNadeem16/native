import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { colors, typography, borderRadius } from '../../styles/theme';
import PrimaryButton from '../../components/SignUp/PrimaryButton';
import SecondaryButton from '../../components/SignUp/SecondaryButton';
import { Target, Clock, Lock } from 'lucide-react-native';
import GreenTick from '../../components/common/GreenTick';
import AssessmentService from '../../api/assessment';
import Storage from '../../utils/storage';
import { CardSkeleton } from '../../components/common/SkeletonLoaders';

type AssessmentFailedScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AssessmentFailed'>;
type AssessmentFailedScreenRouteProp = RouteProp<RootStackParamList, 'AssessmentFailed'>;

/**
 * AssessmentFailedScreen Component
 * 
 * Shows assessment failed screen after user fails an assessment.
 * Matches Figma design: node 7875-75038
 * 
 * Renders ONLY when:
 * - Assessment submission is completed
 * - Result indicates FAIL state (pass === false)
 */
const AssessmentFailedScreen: React.FC = () => {
    const navigation = useNavigation<AssessmentFailedScreenNavigationProp>();
    const route = useRoute<AssessmentFailedScreenRouteProp>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reportData, setReportData] = useState<any>(null);

    // Extract lessonId from route params to fetch data from API
    const lessonId = route.params?.lessonId || route.params?.moodleCourseId;
    const moodleCourseId = route.params?.moodleCourseId || route.params?.lessonId;
    const quizReportDataFromRoute = route.params?.quizReportData;
    const finalResult = route.params?.finalResult || 'Fail';

    // Fallback data from route params (used if API fails or while loading)
    const {
        finalScore: fallbackFinalScore,
        correctAnswers: fallbackCorrectAnswers,
        timeTaken: fallbackTimeTaken,
        failMessage: fallbackFailMessage,
        cooldownDays: fallbackCooldownDays,
        minimumScore: fallbackMinimumScore,
    } = route.params || {};

    // Fetch quiz report data from API
    useEffect(() => {
        const fetchQuizReport = async () => {
            if (!lessonId) {
                console.warn('[AssessmentFailedScreen] No lessonId provided, using fallback data from route params');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const userId = await Storage.getItem('userId');
                if (!userId) {
                    throw new Error('User ID not found');
                }

                // Call API: POST /api/lms/attempt/quiz with page: "score"
                console.log('[AssessmentFailedScreen] Fetching quiz report for lessonId:', lessonId);
                const response = await AssessmentService.attemptQuiz({
                    page: 'score',
                    userId,
                    lessonId,
                });

                console.log('[AssessmentFailedScreen] Quiz report response:', JSON.stringify(response, null, 2));
                setReportData(response);
            } catch (err: any) {
                console.error('[AssessmentFailedScreen] Failed to fetch quiz report:', err);
                setError(err?.message || 'Failed to load quiz report');
                // Continue with fallback data from route params
            } finally {
                setLoading(false);
            }
        };

        fetchQuizReport();
    }, [lessonId]);

    // Extract data from API response - handle multiple possible response structures
    const finalData = reportData?.final || reportData?.result?.final || reportData?.quizResult?.final || {};
    const questionsData = reportData?.questions || reportData?.result?.questions || reportData?.quizResult?.questions || {};
    const overallData = questionsData?.overall || questionsData?.summary || {};

    // Extract scoredMarks and totalMarks from API
    const scoredMarks = overallData?.scoredMarks ||
        overallData?.marksScored ||
        finalData?.scoredMarks ||
        finalData?.marksScored ||
        reportData?.scoredMarks ||
        (fallbackCorrectAnswers ? parseInt(fallbackCorrectAnswers.split('/')[0]) : 0);
    const totalMarks = overallData?.totalMarks ||
        finalData?.totalMarks ||
        reportData?.totalMarks ||
        (fallbackCorrectAnswers ? parseInt(fallbackCorrectAnswers.split('/')[1]) : 7);

    // Format correct answers as "0/7" from API
    const correctAnswersDisplay = `${scoredMarks}/${totalMarks}`;

    // Calculate final score percentage
    const finalScorePercentage = totalMarks > 0 ? Math.round((scoredMarks / totalMarks) * 100) : (fallbackFinalScore || 0);
    const finalScoreDisplay = `${finalScorePercentage}%`;

    // Time taken from API
    const timeTakenRaw = finalData?.timeTaken ||
        finalData?.timeSpent ||
        reportData?.timeTaken ||
        reportData?.timeSpent ||
        overallData?.timeTaken ||
        fallbackTimeTaken ||
        '';
    const timeTakenDisplay = timeTakenRaw || '00m 00s';

    // Fail message from API - use "you didn't clear it" message
    const failMessage = finalData?.failReason ||
        finalData?.failureReason ||
        finalData?.message ||
        reportData?.failReason ||
        fallbackFailMessage ||
        '';

    // Cooldown days from API
    const cooldownDays = finalData?.cooldownDays ||
        finalData?.reattemptDays ||
        reportData?.cooldownDays ||
        fallbackCooldownDays ||
        60;

    // Minimum score from API
    const minimumScore = finalData?.minimumScore ||
        finalData?.passingScore ||
        reportData?.minimumScore ||
        fallbackMinimumScore ||
        50;

    // Build warning message - use API message or default
    const warningMessage = failMessage || `You didn't clear it. You must score at least ${minimumScore}% in-order to clear the test. You must now reattempt the STEM Assessment and the Engineering Systems Assessment in ${cooldownDays} days`;

    const handleHome = () => {
        // Navigate to Home page
        navigation.navigate('Home');
    };

    const handleViewReport = async () => {
        // Navigate to report screen with lessonId and quizReportData
        // If we have reportData from API, use it; otherwise use data from route
        const reportDataToPass = reportData || quizReportDataFromRoute;

        navigation.navigate('StemAssessmentReport', {
            lessonId: lessonId || moodleCourseId,
            moodleCourseId: moodleCourseId || lessonId,
            quizReportData: reportDataToPass,
            finalResult: finalResult || 'Fail',
        });
    };

    // Show loading skeleton while fetching data
    if (loading && lessonId) {
        return (
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <View style={styles.content}>
                    <CardSkeleton />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.content}>
                {/* Illustration Section */}
                <View style={styles.illustrationContainer}>
                    {/* Destroyed rocket illustration - placeholder for image */}
                    <View style={styles.rocketPlaceholder} />
                </View>

                {/* Content Section */}
                <View style={styles.contentSection}>
                    {/* Title */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Assessment Failed</Text>
                    </View>

                    {/* Warning Message Box - Red border box with fail message */}
                    <View style={styles.warningBox}>
                        <Text style={styles.warningText}>
                            {warningMessage}
                        </Text>
                    </View>

                    {/* Statistics */}
                    <View style={styles.statisticsContainer}>
                        {/* Final Score */}
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Final Score</Text>
                            <View style={styles.statValueContainer}>
                                <View style={styles.iconWrapper}>
                                    <Target size={24} color={colors.primaryBlue} />
                                </View>
                                <Text style={styles.statValue}>{finalScoreDisplay}</Text>
                            </View>
                        </View>

                        {/* Correct Answers */}
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Correct Answers</Text>
                            <View style={styles.statValueContainer}>
                                <View style={styles.iconWrapper}>
                                    <GreenTick size={24} />
                                </View>
                                <Text style={styles.statValue}>{correctAnswersDisplay}</Text>
                            </View>
                        </View>

                        {/* Time Taken */}
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Time Taken</Text>
                            <View style={styles.statValueContainer}>
                                <View style={styles.iconWrapper}>
                                    <Clock size={24} color={colors.primaryBlue} />
                                </View>
                                <Text style={styles.statValue}>{timeTakenDisplay}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Bottom Action Buttons */}
            <View style={styles.actionsContainer}>
                <View style={styles.buttonWrapper}>
                    {/* Disabled Reattempt Button */}
                    <TouchableOpacity
                        style={styles.disabledButton}
                        disabled={true}
                        activeOpacity={0.7}
                    >
                        <View style={styles.disabledButtonContent}>
                            <Lock size={24} color="#72818c" />
                            <Text style={styles.disabledButtonText}>
                                Reattempt in {cooldownDays} Days
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonWrapper}>
                    <PrimaryButton
                        label="View Report"
                        onPress={handleViewReport}
                    />
                </View>
                <View style={styles.buttonWrapper}>
                    <SecondaryButton
                        label="Home"
                        onPress={handleHome}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    illustrationContainer: {
        width: 137.89,
        height: 211,
        marginBottom: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rocketPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.lightGrey, // Placeholder until image is added
    },
    contentSection: {
        width: '100%',
        alignItems: 'center',
        gap: 32,
    },
    titleContainer: {
        alignItems: 'center',
        gap: 4,
    },
    title: {
        ...typography.h6, // 20px Bold, line-height 24px
        color: colors.primaryDarkBlue,
        textAlign: 'center',
    },
    warningBox: {
        backgroundColor: '#fff5f5', // Light red background
        borderWidth: 1,
        borderColor: colors.error || '#eb5757', // Red border
        borderRadius: borderRadius.input, // 8px
        padding: 16,
        width: '100%',
    },
    warningText: {
        ...typography.p4, // 14px Regular, line-height 20px
        color: colors.error || '#eb5757',
        textAlign: 'left',
    },
    warningTextBold: {
        ...typography.p4, // 14px Regular
        fontWeight: '700', // Bold
        color: colors.error || '#eb5757',
    },
    statisticsContainer: {
        width: '100%',
        gap: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 18,
        borderWidth: 2,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.input, // 8px
        backgroundColor: colors.white,
        gap: 32,
        minHeight: 56, // Ensure consistent height
    },
    statLabel: {
        ...typography.p4, // 14px Regular, line-height 20px
        color: colors.textGrey,
        flex: 1,
    },
    statValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    iconWrapper: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        ...typography.p3Bold, // 16px Bold, line-height 23px
        color: colors.primaryBlue,
    },
    actionsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 16,
        borderTopWidth: 1,
        borderTopColor: colors.lightGrey,
        backgroundColor: colors.white,
    },
    buttonWrapper: {
        width: '100%',
    },
    disabledButton: {
        backgroundColor: '#ededed', // Grey background from Figma
        borderRadius: borderRadius.input, // 8px
        paddingHorizontal: 24,
        paddingVertical: 10,
        minWidth: 140,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 1, // Fully visible but disabled
    },
    disabledButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    disabledButtonText: {
        ...typography.p4SemiBold, // 14px SemiBold, line-height 20px
        color: '#72818c', // Grey text from Figma
        textAlign: 'center',
    },
});

export default AssessmentFailedScreen;

