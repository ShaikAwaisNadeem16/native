import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, Flag, Check, X, BarChart2, Target, Clock, Lock } from 'lucide-react-native';
import { colors, typography, borderRadius } from '../../styles/theme';
import Header from '../home/components/Header';
import BreadcrumbBar from './components/BreadcrumbBar';
import SummaryTable from './components/SummaryTable';
import PrimaryButton from '../../components/SignUp/PrimaryButton';
import SecondaryButton from '../../components/SignUp/SecondaryButton';
import AssessmentLogo from '../../components/common/AssessmentLogo';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AssessmentService from '../../api/assessment';
import Storage from '../../utils/storage';
import TrophySvg from '../../../assets/trophy.svg';
import ErrorRocketSvg from '../../../assets/Error Rocket Destroyed.svg';
import { CardSkeleton, ListSkeleton } from '../../components/common/SkeletonLoaders';

// Icons removed - will be added later

type StemAssessmentReportScreenNavigationProp = StackNavigationProp<RootStackParamList, 'StemAssessmentReport'>;
type StemAssessmentReportScreenRouteProp = RouteProp<RootStackParamList, 'StemAssessmentReport'>;

// StemAssessmentReportScreen - Displays STEM Assessment results and scores
// Based on Figma design node-id=4559-37454
// Renders ONLY when user clicks "View Report" and quiz result API returns pass === true
const StemAssessmentReportScreen: React.FC = () => {
    const navigation = useNavigation<StemAssessmentReportScreenNavigationProp>();
    const route = useRoute<StemAssessmentReportScreenRouteProp>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reportData, setReportData] = useState<any>(null);

    // Extract lessonId from route params (moodleCourseId)
    const lessonId = route.params?.lessonId || route.params?.moodleCourseId;
    
    console.log('[StemAssessmentReportScreen] Route params:', JSON.stringify(route.params, null, 2));
    console.log('[StemAssessmentReportScreen] Extracted lessonId:', lessonId);

    // Fetch quiz report data on mount
    useEffect(() => {
        const fetchQuizReport = async () => {
            if (!lessonId) {
                console.warn('[StemAssessmentReportScreen] No lessonId provided, showing error');
                setError('Lesson ID is required to view report. Please try again.');
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
                const response = await AssessmentService.attemptQuiz({
                    page: 'score',
                    userId,
                    lessonId,
                });

                console.log('[StemAssessmentReportScreen] Quiz report response:', JSON.stringify(response, null, 2));

                // Store report data regardless of pass/fail status
                setReportData(response);
            } catch (err: any) {
                console.error('[StemAssessmentReportScreen] Failed to fetch quiz report:', err);
                setError(err?.message || 'Failed to load quiz report');
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
    const sectionDetailsRaw = questionsData?.sectionDetails || questionsData?.sections || reportData?.sectionDetails || {};

    console.log('[StemAssessmentReportScreen] Extracted data:', {
        finalData: JSON.stringify(finalData, null, 2),
        overallData: JSON.stringify(overallData, null, 2),
        sectionDetailsRaw: JSON.stringify(sectionDetailsRaw, null, 2),
    });

    // Determine if result is Pass or Fail - check multiple possible fields
    const isPass = finalData?.pass === true || 
                   reportData?.pass === true ||
                   reportData?.result?.pass === true ||
                   reportData?.quizResult?.pass === true ||
                   finalData?.quizStatus?.toLowerCase() === 'pass' ||
                   finalData?.quizStatus?.toLowerCase() === 'cleared' ||
                   finalData?.quizStatus?.toLowerCase().includes('cleared') ||
                   finalData?.status?.toLowerCase() === 'pass' ||
                   (finalData?.quizStatus !== 'Fail' && 
                    finalData?.status !== 'Fail' &&
                    finalData?.pass !== false && 
                    (finalData?.message?.toLowerCase().includes('pass') ||
                     finalData?.message?.toLowerCase().includes('cleared') ||
                     finalData?.message?.toLowerCase().includes('success')));
    
    const finalResult = isPass ? 'Pass' : 'Fail';
    // Use scoredMarks and totalMarks from overall data - check multiple possible fields
    const scoredMarks = overallData?.scoredMarks || 
                       overallData?.marksScored || 
                       finalData?.scoredMarks || 
                       finalData?.marksScored ||
                       reportData?.scoredMarks || 
                       0;
    const totalMarks = overallData?.totalMarks || 
                      overallData?.totalMarks || 
                      finalData?.totalMarks || 
                      reportData?.totalMarks || 
                      0;
    const finalScoreDisplay = totalMarks > 0 ? `${scoredMarks}/${totalMarks}` : '0/0';

    // Calculate percentage score for success screen
    const percentageScore = totalMarks > 0 ? Math.round((scoredMarks / totalMarks) * 100) : 0;
    const finalScorePercentage = `${percentageScore}%`;

    // Message from API - use API message or fallback based on pass/fail
    const message = finalData?.message || 
                   reportData?.message ||
                   finalData?.resultMessage ||
                   (isPass ? 'Congratulations on clearing the assessment!' : 'You did not pass this assessment. Please review and try again.');
    
    // Failure reason from API (if present)
    const failReason = finalData?.failReason || 
                      finalData?.failureReason || 
                      reportData?.failReason || 
                      '';

    // Time taken from API - format for display - check multiple possible fields
    const timeTakenRaw = finalData?.timeTaken || 
                        finalData?.timeSpent || 
                        reportData?.timeTaken || 
                        reportData?.timeSpent ||
                        overallData?.timeTaken ||
                        '';
    // Format time taken (e.g., "01m 15s" or "1h 30m")
    const formatTimeTaken = (timeStr: string): string => {
        if (!timeStr) return '00m 00s';
        // If already formatted, return as is
        if (timeStr.includes('m') || timeStr.includes('s') || timeStr.includes('h')) {
            return timeStr;
        }
        // If it's a number (seconds), convert to mm:ss format
        const seconds = parseInt(timeStr, 10);
        if (!isNaN(seconds)) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
        }
        return timeStr;
    };
    const timeTaken = formatTimeTaken(timeTakenRaw);

    // Correct answers - format as "X/Y" - check multiple possible fields
    const correctAnswers = finalData?.correctAnswers || 
                          finalData?.correctQuestions ||
                          overallData?.correctAnswers || 
                          overallData?.correctQuestions || 
                          reportData?.correctAnswers ||
                          scoredMarks;
    const totalQuestions = overallData?.totalQuestions || 
                          overallData?.totalQuestionsCount ||
                          finalData?.totalQuestions ||
                          reportData?.totalQuestions ||
                          totalMarks || 
                          0;
    const correctAnswersDisplay = totalQuestions > 0 ? `${correctAnswers}/${totalQuestions}` : '0/0';

    // Reattempt days from API (default to 60 days)
    const reattemptDays = finalData?.reattemptDays || 
                         finalData?.retryAfterDays ||
                         reportData?.reattemptDays || 
                         reportData?.retryAfterDays ||
                         60;
    const reattemptDaysDisplay = `${reattemptDays} Days`;

    // Minimum score required (from API or default 50%)
    const minimumScore = finalData?.minimumScore || 
                        finalData?.passingScore ||
                        reportData?.minimumScore || 
                        reportData?.passingScore ||
                        50;

    // Build table data from sectionDetails
    // sectionDetails can be an object (key-value pairs) or an array
    let tableData: Array<{ testPart: string; result: 'Pass' | 'Fail'; score: string }> = [];
    
    if (sectionDetailsRaw && typeof sectionDetailsRaw === 'object') {
        // Check if it's an array
        if (Array.isArray(sectionDetailsRaw)) {
            tableData = sectionDetailsRaw.map((section: any) => {
                const sectionName = section?.sectionName || section?.name || section?.section || 'Unknown';
                const isSectionPass = section?.passed === true || 
                                     section?.result === 'Pass' || 
                                     section?.pass === true ||
                                     (section?.quizStatus === 'Pass');
                const result: 'Pass' | 'Fail' = isSectionPass ? 'Pass' : 'Fail';
                const scoredMarks = section?.scoredMarks || 0;
                const totalMarks = section?.totalMarks || 0;
                
                return {
                    testPart: sectionName,
                    result: result,
                    score: `${scoredMarks}/${totalMarks}`,
                };
            });
        } else {
            // It's an object with section names as keys
            tableData = Object.entries(sectionDetailsRaw).map(([sectionKey, section]: [string, any]) => {
                // Use the key as section name, or section name from the object
                const sectionName = section?.sectionName || section?.name || sectionKey || 'Unknown';
                
                // Determine Pass/Fail
                const isSectionPass = section?.pass === true || 
                                     section?.passed === true ||
                                     section?.result === 'Pass' ||
                                     (section?.quizStatus === 'Pass');
                const result: 'Pass' | 'Fail' = isSectionPass ? 'Pass' : 'Fail';
                
                // Extract scoredMarks and totalMarks
                const scoredMarks = section?.scoredMarks || 0;
                const totalMarks = section?.totalMarks || 0;
                
                return {
                    testPart: sectionName,
                    result: result,
                    score: `${scoredMarks}/${totalMarks}`,
                };
            });
        }
    }
    
    console.log('[StemAssessmentReportScreen] Table data:', JSON.stringify(tableData, null, 2));

    const handleBackToHomepage = () => {
        navigation.navigate('Home');
    };

    const handleGiveFeedback = () => {
        console.log('Give feedback pressed');
    };

    const handleReportIssue = () => {
        console.log('Report issue pressed');
    };

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    // Show loading state
    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header onProfilePress={handleProfilePress} onLogoPress={() => navigation.navigate('Home')} />
                <BreadcrumbBar items={['STEM Assessment Report']} />
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <CardSkeleton />
                    <ListSkeleton count={2} />
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Always render the screen structure
    // Show error state (only if there's an error and not loading)
    if (error && !loading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header onProfilePress={handleProfilePress} onLogoPress={() => navigation.navigate('Home')} />
                <BreadcrumbBar items={['STEM Assessment Report']} />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <PrimaryButton
                        label="Back To Homepage"
                        onPress={handleBackToHomepage}
                    />
                </View>
            </SafeAreaView>
        );
    }
    
    // Show error if no report data after loading completes (and no error was set)
    if (!loading && !reportData && !error) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header onProfilePress={handleProfilePress} onLogoPress={() => navigation.navigate('Home')} />
                <BreadcrumbBar items={['STEM Assessment Report']} />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>No report data available. Please try again.</Text>
                    <PrimaryButton
                        label="Back To Homepage"
                        onPress={handleBackToHomepage}
                    />
                </View>
            </SafeAreaView>
        );
    }

    // Render main report screen (with or without data - will show loading if data is being fetched)
    console.log('[StemAssessmentReportScreen] Rendering report screen - loading:', loading, 'hasData:', !!reportData, 'error:', error);
    
    // If assessment is failed, show failed screen matching Figma design
    if (!isPass && !loading && reportData) {
        return (
            <SafeAreaView style={styles.failedContainer} edges={['top', 'bottom']}>
                {/* Main Content - Centered */}
                <View style={styles.failedContent}>
                    {/* Rocket Section */}
                    <View style={styles.rocketSection}>
                        <ErrorRocketSvg width={138} height={211} />
                    </View>

                    {/* Title and Stats Section */}
                    <View style={styles.failedStatsSection}>
                        {/* Title */}
                        <View style={styles.failedTitleContainer}>
                            <Text style={styles.failedTitle}>Assessment Failed</Text>
                        </View>

                        {/* Warning Message Box */}
                        <View style={styles.failedWarningBox}>
                            <Text style={styles.failedWarningText}>
                                <Text>You must </Text>
                                <Text style={styles.failedWarningBold}>score at least {minimumScore}% </Text>
                                <Text>in-order to clear the test. You must now reattempt the STEM Assessment and the Engineering Systems Assessment in </Text>
                                <Text style={styles.failedWarningBold}>{reattemptDaysDisplay}</Text>
                            </Text>
                        </View>

                        {/* Statistics Cards */}
                        <View style={styles.failedStatsContainer}>
                            {/* Final Score */}
                            <View style={styles.failedStatCard}>
                                <Text style={styles.failedStatLabel}>Final Score</Text>
                                <View style={styles.failedStatValueContainer}>
                                    <BarChart2 size={24} color={colors.primaryBlue} />
                                    <Text style={styles.failedStatValue}>{finalScorePercentage}</Text>
                                </View>
                            </View>

                            {/* Correct Answers */}
                            <View style={styles.failedStatCard}>
                                <Text style={styles.failedStatLabel}>Correct Answers</Text>
                                <View style={styles.failedStatValueContainer}>
                                    <Target size={24} color={colors.primaryBlue} />
                                    <Text style={styles.failedStatValue}>{correctAnswersDisplay}</Text>
                                </View>
                            </View>

                            {/* Time Taken */}
                            <View style={styles.failedStatCard}>
                                <Text style={styles.failedStatLabel}>Time Taken</Text>
                                <View style={styles.failedStatValueContainer}>
                                    <Clock size={24} color={colors.primaryBlue} />
                                    <Text style={styles.failedStatValue}>{timeTaken}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Bottom Action Buttons */}
                <View style={styles.failedActionsContainer}>
                    <View style={styles.failedButtonWrapper}>
                        <TouchableOpacity
                            style={styles.reattemptButton}
                            disabled={true}
                            activeOpacity={0.7}
                        >
                            <Lock size={24} color="#72818c" />
                            <Text style={styles.reattemptButtonText}>
                                Reattempt in {reattemptDaysDisplay}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.failedButtonWrapper}>
                        <SecondaryButton
                            label="Home"
                            onPress={handleBackToHomepage}
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    }
    
    // If assessment is passed, show success screen matching Figma design
    if (isPass && !loading && reportData) {
        return (
            <SafeAreaView style={styles.successContainer} edges={['top', 'bottom']}>
                {/* Main Content - Centered */}
                <View style={styles.successContent}>
                    {/* Trophy with Confetti Section */}
                    <View style={styles.trophySection}>
                        <View style={styles.confettiContainer}>
                            {/* Confetti background - placeholder for now */}
                            <View style={styles.confettiPlaceholder} />
                        </View>
                        <View style={styles.trophyContainer}>
                            <TrophySvg width={190} height={190} />
                        </View>
                    </View>

                    {/* Title and Stats Section */}
                    <View style={styles.successStatsSection}>
                        {/* Title */}
                        <View style={styles.successTitleContainer}>
                            <Text style={styles.successTitle}>Assessment Cleared!</Text>
                        </View>

                        {/* Statistics Cards */}
                        <View style={styles.successStatsContainer}>
                            {/* Final Score */}
                            <View style={styles.successStatCard}>
                                <Text style={styles.successStatLabel}>Final Score</Text>
                                <View style={styles.successStatValueContainer}>
                                    <BarChart2 size={24} color={colors.primaryBlue} />
                                    <Text style={styles.successStatValue}>{finalScorePercentage}</Text>
                                </View>
                            </View>

                            {/* Correct Answers */}
                            <View style={styles.successStatCard}>
                                <Text style={styles.successStatLabel}>Correct Answers</Text>
                                <View style={styles.successStatValueContainer}>
                                    <Target size={24} color={colors.primaryBlue} />
                                    <Text style={styles.successStatValue}>{correctAnswersDisplay}</Text>
                                </View>
                            </View>

                            {/* Time Taken */}
                            <View style={styles.successStatCard}>
                                <Text style={styles.successStatLabel}>Time Taken</Text>
                                <View style={styles.successStatValueContainer}>
                                    <Clock size={24} color={colors.primaryBlue} />
                                    <Text style={styles.successStatValue}>{timeTaken}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Bottom Action Buttons */}
                <View style={styles.successActionsContainer}>
                    <View style={styles.successButtonWrapper}>
                        <PrimaryButton
                            label="Continue"
                            onPress={handleBackToHomepage}
                        />
                    </View>
                    <View style={styles.successButtonWrapper}>
                        <SecondaryButton
                            label="Home"
                            onPress={handleBackToHomepage}
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    }
    
    // Render regular report screen for failed assessments or when data is not ready
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Header onProfilePress={handleProfilePress} onLogoPress={() => navigation.navigate('Home')} />

            {/* Breadcrumb Bar */}
            <BreadcrumbBar items={['STEM Assessment Report']} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Assessment Report Card */}
                <View style={styles.reportCard}>
                    {/* Assessment Logo at top of card */}
                    <View style={styles.illustrationContainer}>
                        <AssessmentLogo size={70} />
                    </View>

                    {/* Content Section */}
                    <View style={styles.contentSection}>
                        {/* Title and Message */}
                        <View style={styles.titleSection}>
                            <Text style={styles.title}>STEM Assessment Report</Text>
                            <Text style={styles.message}>
                                {message}
                            </Text>
                        </View>

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Statistics */}
                        <View style={styles.statisticsSection}>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>FINAL RESULT</Text>
                                <View style={styles.resultContainer}>
                                    <View style={styles.resultIconContainer}>
                                        {isPass ? (
                                            <Check size={24} color={colors.successGreen || '#27AE60'} />
                                        ) : (
                                            <X size={24} color={colors.error || '#EB5757'} />
                                        )}
                                    </View>
                                    <Text style={styles.resultText}>{finalResult}</Text>
                                </View>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>FINAL SCORE</Text>
                                <Text style={styles.scoreText}>{finalScoreDisplay}</Text>
                            </View>
                        </View>
                        
                        {/* Failure Reason (if present and failed) */}
                        {!isPass && failReason && (
                            <View style={styles.failReasonContainer}>
                                <Text style={styles.failReasonText}>{failReason}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Summary Section */}
                <View style={styles.summarySection}>
                    <Text style={styles.summaryTitle}>Summary Of Your Attempt</Text>
                    {tableData.length > 0 ? (
                        <SummaryTable rows={tableData} />
                    ) : (
                        <View style={styles.noDataContainer}>
                            <Text style={styles.noDataText}>No section details available</Text>
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View style={styles.actionsSection}>
                        <PrimaryButton
                            label="Back To Homepage"
                            onPress={handleBackToHomepage}
                        />
                        <View style={styles.actionLinks}>
                            <TouchableOpacity
                                style={styles.actionLink}
                                onPress={handleGiveFeedback}
                                activeOpacity={0.7}
                            >
                                <Star size={24} color={colors.textGrey} />
                                <Text style={styles.actionLinkText}>Give Us Feeback</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.actionLink}
                                onPress={handleReportIssue}
                                activeOpacity={0.7}
                            >
                                <Flag size={24} color={colors.textGrey} />
                                <Text style={styles.actionLinkText}>Report An Issue</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainBgGrey,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 32,
        gap: 16,
    },
    reportCard: {
        backgroundColor: colors.reportBlue,
        borderRadius: 16,
        padding: 24,
        gap: 20,
        position: 'relative',
        overflow: 'hidden',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    illustrationContainer: {
        width: 70,
        height: 70,
        position: 'relative',
        alignSelf: 'flex-start',
    },
    backgroundMaskContainer: {
        position: 'absolute',
        width: 60,
        height: 60,
        top: 5,
        left: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundMask: {
        width: '100%',
        height: '100%',
    },
    ufoContainer: {
        position: 'absolute',
        width: 102.864,
        height: 107.278,
        top: -18.639,
        left: -16.432,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ufoImage: {
        width: '100%',
        height: '100%',
    },
    contentSection: {
        flexDirection: 'column',
        gap: 16,
        width: '100%',
    },
    titleSection: {
        flexDirection: 'column',
        gap: 8,
        width: '100%',
    },
    title: {
        ...typography.h6,
        color: colors.white,
    },
    message: {
        ...typography.p4,
        color: colors.white,
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: colors.lightGrey,
        opacity: 0.3,
    },
    statisticsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
    },
    statItem: {
        flexDirection: 'column',
        gap: 0,
        alignItems: 'flex-start',
    },
    statLabel: {
        ...typography.s1Regular,
        color: colors.lightGrey,
        marginBottom: 0,
    },
    resultContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 0,
    },
    resultIconContainer: {
        width: 24,
        height: 24,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultIconBg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    resultIcon: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    resultText: {
        ...typography.h5,
        color: colors.white,
    },
    scoreText: {
        ...typography.p2Bold,
        color: colors.white,
    },
    summarySection: {
        flexDirection: 'column',
        gap: 16,
        width: '100%',
    },
    summaryTitle: {
        ...typography.p2Bold,
        color: colors.primaryDarkBlue,
    },
    actionsSection: {
        flexDirection: 'column',
        gap: 24,
        width: '100%',
    },
    actionLinks: {
        flexDirection: 'row',
        gap: 20,
        width: '100%',
    },
    actionLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionLinkText: {
        ...typography.p4,
        color: colors.textGrey,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 48,
    },
    loadingText: {
        ...typography.p4,
        color: colors.textGrey,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 48,
        gap: 24,
    },
    errorText: {
        ...typography.p4,
        color: colors.error || '#EB5757',
        textAlign: 'center',
    },
    noDataContainer: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.input,
    },
    noDataText: {
        ...typography.p4,
        color: colors.textGrey,
    },
    failReasonContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: 'rgba(235, 87, 87, 0.1)',
        borderRadius: borderRadius.input,
        borderWidth: 1,
        borderColor: colors.error || '#EB5757',
    },
    failReasonText: {
        ...typography.p4,
        color: colors.error || '#EB5757',
        textAlign: 'center',
    },
    // Success Screen Styles (Figma design node 7875-74947)
    successContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    successContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 48,
    },
    trophySection: {
        width: 328.227,
        height: 211.98,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    confettiContainer: {
        position: 'absolute',
        width: 328.321,
        height: 182.219,
        top: 14.89, // Centered vertically
        left: -0.047, // Centered horizontally
        alignItems: 'center',
        justifyContent: 'center',
    },
    confettiPlaceholder: {
        width: '100%',
        height: '100%',
        // Confetti will be added as an image asset later
        // For now, using a subtle background
        backgroundColor: 'transparent',
    },
    trophyContainer: {
        position: 'absolute',
        width: 190,
        height: 190,
        top: 11, // Positioned below confetti
        left: 69.14, // Centered horizontally
        alignItems: 'center',
        justifyContent: 'center',
    },
    successStatsSection: {
        width: '100%',
        alignItems: 'center',
        gap: 16,
    },
    successTitleContainer: {
        alignItems: 'center',
        gap: 4,
    },
    successTitle: {
        ...typography.h6, // 20px Bold, line-height 24px
        color: colors.primaryDarkBlue,
        textAlign: 'center',
    },
    successStatsContainer: {
        width: '100%',
        gap: 16,
    },
    successStatCard: {
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
        minHeight: 56,
    },
    successStatLabel: {
        ...typography.p4, // 14px Regular, line-height 20px
        color: colors.textGrey,
        flex: 1,
    },
    successStatValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    successStatValue: {
        ...typography.p3Bold, // 16px Bold, line-height 23px
        color: colors.primaryBlue,
    },
    successActionsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 16,
        borderTopWidth: 1,
        borderTopColor: colors.lightGrey,
        backgroundColor: colors.white,
    },
    successButtonWrapper: {
        width: '100%',
        minWidth: 140,
    },
    // Failed Screen Styles (Figma design node 7875-75038)
    failedContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    failedContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 48,
    },
    rocketSection: {
        width: 138,
        height: 211,
        alignItems: 'center',
        justifyContent: 'center',
    },
    failedStatsSection: {
        width: 328,
        alignItems: 'center',
        gap: 32,
    },
    failedTitleContainer: {
        alignItems: 'center',
        gap: 4,
    },
    failedTitle: {
        ...typography.h6, // 20px Bold, line-height 24px
        color: colors.primaryDarkBlue,
        textAlign: 'center',
    },
    failedWarningBox: {
        backgroundColor: '#fcefdc', // Light orange background
        borderWidth: 0.5,
        borderColor: '#eb5757', // Red/orange border
        borderRadius: borderRadius.input, // 8px
        padding: 12,
        width: '100%',
        gap: 12,
    },
    failedWarningText: {
        ...typography.p4, // 14px Regular, line-height 20px
        color: '#eb5757', // Red/orange text
        textAlign: 'left',
    },
    failedWarningBold: {
        ...typography.p4SemiBold, // 14px SemiBold
        color: '#eb5757',
    },
    failedStatsContainer: {
        width: '100%',
        gap: 16,
    },
    failedStatCard: {
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
        minHeight: 56,
    },
    failedStatLabel: {
        ...typography.p4, // 14px Regular, line-height 20px
        color: colors.textGrey,
        flex: 1,
    },
    failedStatValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    failedStatValue: {
        ...typography.p3Bold, // 16px Bold, line-height 23px
        color: colors.primaryBlue,
    },
    failedActionsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 16,
        borderTopWidth: 1,
        borderTopColor: colors.lightGrey,
        backgroundColor: colors.white,
    },
    failedButtonWrapper: {
        width: '100%',
        minWidth: 140,
    },
    reattemptButton: {
        backgroundColor: '#ededed', // Light gray background
        borderRadius: borderRadius.input, // 8px
        paddingHorizontal: 24,
        paddingVertical: 10,
        width: '100%',
        minWidth: 140,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        opacity: 1, // Disabled state
    },
    reattemptButtonText: {
        ...typography.p4SemiBold, // 14px SemiBold
        color: '#72818c', // Gray text
        textAlign: 'center',
    },
});

export default StemAssessmentReportScreen;


