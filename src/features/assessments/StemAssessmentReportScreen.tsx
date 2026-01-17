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
import StemAssessmentReportSkeleton from './components/StemAssessmentReportSkeleton';

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
    const attemptId = route.params?.attemptId;
    const quizReportDataFromRoute = route.params?.quizReportData;

    console.log('[StemAssessmentReportScreen] Route params:', JSON.stringify(route.params, null, 2));
    console.log('[StemAssessmentReportScreen] Extracted lessonId:', lessonId);
    console.log('[StemAssessmentReportScreen] Extracted attemptId:', attemptId);
    console.log('[StemAssessmentReportScreen] Quiz report data from route:', quizReportDataFromRoute ? 'Present' : 'Not present');

    // Fetch quiz report data on mount (or use data passed from navigation)
    useEffect(() => {
        const fetchQuizReport = async () => {
            // If data was passed from navigation, use it directly
            if (quizReportDataFromRoute) {
                // Artificial delay to show skeleton UI as per user request
                await new Promise(resolve => setTimeout(resolve, 1500));

                console.log('[StemAssessmentReportScreen] Using quiz report data from route params');
                console.log('[StemAssessmentReportScreen] Data:', JSON.stringify(quizReportDataFromRoute, null, 2));

                // Parse JSON strings if they exist in the response
                let parsedResponse = { ...quizReportDataFromRoute };

                // If finalData is a JSON string, parse it
                if (typeof quizReportDataFromRoute?.final === 'string') {
                    try {
                        parsedResponse.final = JSON.parse(quizReportDataFromRoute.final);
                    } catch (e) {
                        console.warn('[StemAssessmentReportScreen] Failed to parse finalData JSON string:', e);
                    }
                }

                // If questions.overall is a JSON string, parse it
                if (typeof quizReportDataFromRoute?.questions?.overall === 'string') {
                    try {
                        parsedResponse.questions = {
                            ...quizReportDataFromRoute.questions,
                            overall: JSON.parse(quizReportDataFromRoute.questions.overall),
                        };
                    } catch (e) {
                        console.warn('[StemAssessmentReportScreen] Failed to parse overallData JSON string:', e);
                    }
                }

                // If questions.sectionDetails is a JSON string, parse it
                if (typeof quizReportDataFromRoute?.questions?.sectionDetails === 'string') {
                    try {
                        parsedResponse.questions = {
                            ...quizReportDataFromRoute.questions,
                            sectionDetails: JSON.parse(quizReportDataFromRoute.questions.sectionDetails),
                        };
                    } catch (e) {
                        console.warn('[StemAssessmentReportScreen] Failed to parse sectionDetails JSON string:', e);
                    }
                }

                // Also check for sectionDetails at root level
                if (typeof quizReportDataFromRoute?.sectionDetails === 'string') {
                    try {
                        parsedResponse.sectionDetails = JSON.parse(quizReportDataFromRoute.sectionDetails);
                    } catch (e) {
                        console.warn('[StemAssessmentReportScreen] Failed to parse sectionDetails JSON string:', e);
                    }
                }

                console.log('[StemAssessmentReportScreen] Parsed response from route:', JSON.stringify(parsedResponse, null, 2));
                setReportData(parsedResponse);
                setLoading(false);
                return;
            }

            // Otherwise, fetch from API
            if (!lessonId) {
                console.warn('[StemAssessmentReportScreen] No lessonId provided, showing error');
                setError('Lesson ID is required to view report. Please try again.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Artificial delay to show skeleton UI as per user request
                await new Promise(resolve => setTimeout(resolve, 1500));

                const userId = await Storage.getItem('userId');
                if (!userId) {
                    throw new Error('User ID not found');
                }

                // Call API: POST /api/lms/attempt/quiz with page: "score"
                console.log('[StemAssessmentReportScreen] ===== CALLING QUIZ REPORT API =====');
                console.log('[StemAssessmentReportScreen] API: POST /api/lms/attempt/quiz');

                const payload: any = {
                    page: 'score',
                    userId,
                    lessonId,
                };

                if (attemptId) {
                    payload.attemptId = attemptId;
                }

                console.log('[StemAssessmentReportScreen] Payload:', JSON.stringify(payload, null, 2));

                const response = await AssessmentService.attemptQuiz(payload);

                console.log('[StemAssessmentReportScreen] ===== QUIZ REPORT API RESPONSE =====');
                console.log('[StemAssessmentReportScreen] Full response:', JSON.stringify(response, null, 2));
                console.log('[StemAssessmentReportScreen] Response keys:', response ? Object.keys(response) : 'null');
                console.log('[StemAssessmentReportScreen] Root pass:', response?.pass);
                console.log('[StemAssessmentReportScreen] Final object:', response?.final);
                console.log('[StemAssessmentReportScreen] Questions object:', response?.questions);
                console.log('[StemAssessmentReportScreen] AttemptId:', response?.attemptId);

                // Parse JSON strings if they exist in the response
                let parsedResponse = { ...response };

                // If finalData is a JSON string, parse it
                if (typeof response?.final === 'string') {
                    try {
                        parsedResponse.final = JSON.parse(response.final);
                    } catch (e) {
                        console.warn('[StemAssessmentReportScreen] Failed to parse finalData JSON string:', e);
                    }
                }

                // If questions.overall is a JSON string, parse it
                if (typeof response?.questions?.overall === 'string') {
                    try {
                        parsedResponse.questions = {
                            ...response.questions,
                            overall: JSON.parse(response.questions.overall),
                        };
                    } catch (e) {
                        console.warn('[StemAssessmentReportScreen] Failed to parse overallData JSON string:', e);
                    }
                }

                // If questions.sectionDetails is a JSON string, parse it
                if (typeof response?.questions?.sectionDetails === 'string') {
                    try {
                        parsedResponse.questions = {
                            ...response.questions,
                            sectionDetails: JSON.parse(response.questions.sectionDetails),
                        };
                    } catch (e) {
                        console.warn('[StemAssessmentReportScreen] Failed to parse sectionDetails JSON string:', e);
                    }
                }

                // Also check for sectionDetails at root level
                if (typeof response?.sectionDetails === 'string') {
                    try {
                        parsedResponse.sectionDetails = JSON.parse(response.sectionDetails);
                    } catch (e) {
                        console.warn('[StemAssessmentReportScreen] Failed to parse sectionDetails JSON string:', e);
                    }
                }

                console.log('[StemAssessmentReportScreen] Parsed response:', JSON.stringify(parsedResponse, null, 2));

                // Store report data regardless of pass/fail status
                setReportData(parsedResponse);
            } catch (err: any) {
                console.error('[StemAssessmentReportScreen] Failed to fetch quiz report:', err);
                setError(err?.message || 'Failed to load quiz report');
            } finally {
                setLoading(false);
            }
        };

        fetchQuizReport();
    }, [lessonId, quizReportDataFromRoute]);

    // Extract data from API response - handle multiple possible response structures
    // Data may already be parsed or may need parsing
    // The API response structure: { pass, final: {...}, questions: { overall: {...}, sectionDetails: {...} }, ... }
    let finalData = reportData?.final || reportData?.result?.final || reportData?.quizResult?.final || {};
    const questionsData = reportData?.questions || reportData?.result?.questions || reportData?.quizResult?.questions || {};
    let overallData = questionsData?.overall || questionsData?.summary || {};
    let sectionDetailsRaw = questionsData?.sectionDetails || questionsData?.sections || reportData?.sectionDetails || {};

    // Also check root level pass if final.pass is not available
    const rootPass = reportData?.pass;

    // Parse JSON strings if they're still strings
    if (typeof finalData === 'string') {
        try {
            finalData = JSON.parse(finalData);
        } catch (e) {
            console.warn('[StemAssessmentReportScreen] Failed to parse finalData:', e);
            finalData = {};
        }
    }

    if (typeof overallData === 'string') {
        try {
            overallData = JSON.parse(overallData);
        } catch (e) {
            console.warn('[StemAssessmentReportScreen] Failed to parse overallData:', e);
            overallData = {};
        }
    }

    if (typeof sectionDetailsRaw === 'string') {
        try {
            sectionDetailsRaw = JSON.parse(sectionDetailsRaw);
        } catch (e) {
            console.warn('[StemAssessmentReportScreen] Failed to parse sectionDetailsRaw:', e);
            sectionDetailsRaw = {};
        }
    }

    console.log('[StemAssessmentReportScreen] ===== EXTRACTED DATA =====');
    console.log('[StemAssessmentReportScreen] Root pass:', rootPass);
    console.log('[StemAssessmentReportScreen] FinalData:', JSON.stringify(finalData, null, 2));
    console.log('[StemAssessmentReportScreen] OverallData:', JSON.stringify(overallData, null, 2));
    console.log('[StemAssessmentReportScreen] SectionDetailsRaw:', JSON.stringify(sectionDetailsRaw, null, 2));
    console.log('[StemAssessmentReportScreen] FinalData.pass:', finalData?.pass);
    console.log('[StemAssessmentReportScreen] FinalData.message:', finalData?.message);
    console.log('[StemAssessmentReportScreen] FinalData.finalScore:', finalData?.finalScore);
    console.log('[StemAssessmentReportScreen] FinalData.correctAnswers:', finalData?.correctAnswers);
    console.log('[StemAssessmentReportScreen] FinalData.timeTaken:', finalData?.timeTaken);
    console.log('[StemAssessmentReportScreen] OverallData.scoredMarks:', overallData?.scoredMarks);
    console.log('[StemAssessmentReportScreen] OverallData.totalMarks:', overallData?.totalMarks);
    console.log('[StemAssessmentReportScreen] OverallData.correctQuestions:', overallData?.correctQuestions);
    console.log('[StemAssessmentReportScreen] OverallData.totalQuestions:', overallData?.totalQuestions);

    // Determine if result is Pass or Fail - check multiple possible fields
    // Check root level pass first, then final.pass, then quizStatus
    const isPass = rootPass === true ||
        finalData?.pass === true ||
        reportData?.result?.pass === true ||
        reportData?.quizResult?.pass === true ||
        finalData?.quizStatus?.toLowerCase() === 'pass' ||
        finalData?.quizStatus?.toLowerCase() === 'cleared' ||
        finalData?.quizStatus?.toLowerCase().includes('cleared') ||
        finalData?.status?.toLowerCase() === 'pass' ||
        (finalData?.quizStatus !== 'Fail' &&
            finalData?.status !== 'Fail' &&
            finalData?.pass !== false &&
            rootPass !== false &&
            (finalData?.message?.toLowerCase().includes('pass') ||
                finalData?.message?.toLowerCase().includes('cleared') ||
                finalData?.message?.toLowerCase().includes('success')));

    const finalResult = isPass ? 'Pass' : 'Fail';
    // Use scoredMarks and totalMarks from overall data - check multiple possible fields
    // Priority: overallData > finalData > reportData root level
    const scoredMarks = overallData?.scoredMarks ||
        overallData?.marksScored ||
        finalData?.scoredMarks ||
        finalData?.marksScored ||
        finalData?.rawScore ||
        reportData?.rawScore ||
        reportData?.scoredMarks ||
        0;
    const totalMarks = overallData?.totalMarks ||
        overallData?.totalMarks ||
        finalData?.totalMarks ||
        reportData?.totalMarks ||
        0;
    const finalScoreDisplay = totalMarks > 0 ? `${scoredMarks}/${totalMarks}` : '0/0';

    // Calculate percentage score - use finalScore from API if available, otherwise calculate
    let finalScorePercentage = finalData?.finalScore || finalData?.finalScorePercentage || '';
    if (!finalScorePercentage && totalMarks > 0) {
        const percentageScore = Math.round((scoredMarks / totalMarks) * 100);
        finalScorePercentage = `${percentageScore}%`;
    } else if (!finalScorePercentage) {
        finalScorePercentage = '0%';
    }
    // Ensure finalScorePercentage is always a string
    if (typeof finalScorePercentage !== 'string') {
        finalScorePercentage = String(finalScorePercentage);
    }

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
    const formatTimeTaken = (timeStr: string | number | undefined): string => {
        if (!timeStr) return '00m 00s';
        // Convert to string if needed
        const timeStrFormatted = String(timeStr);
        // If already formatted, return as is
        if (timeStrFormatted.includes('m') || timeStrFormatted.includes('s') || timeStrFormatted.includes('h')) {
            return timeStrFormatted;
        }
        // If it's a number (seconds), convert to mm:ss format
        const seconds = parseInt(timeStrFormatted, 10);
        if (!isNaN(seconds)) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
        }
        return timeStrFormatted;
    };
    const timeTaken = formatTimeTaken(timeTakenRaw);

    // Correct answers - format as "X/Y" - check multiple possible fields
    // finalData.correctAnswers might already be in "0/7" format
    let correctAnswersDisplay = finalData?.correctAnswers || '';

    if (!correctAnswersDisplay || typeof correctAnswersDisplay !== 'string') {
        // If not in format, extract and format it
        const correctAnswers = overallData?.correctQuestions ||
            overallData?.correctAnswers ||
            finalData?.correctQuestions ||
            finalData?.rawScore ||
            scoredMarks;
        const totalQuestions = overallData?.totalQuestions ||
            overallData?.totalQuestionsCount ||
            finalData?.totalQuestions ||
            totalMarks ||
            0;
        correctAnswersDisplay = totalQuestions > 0 ? `${correctAnswers}/${totalQuestions}` : '0/0';
    }
    // Ensure correctAnswersDisplay is always a string
    if (typeof correctAnswersDisplay !== 'string') {
        correctAnswersDisplay = String(correctAnswersDisplay);
    }

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
    // API response structure: questions.sectionDetails = { "Section 1": { pass: true, scoredMarks: 2, totalMarks: 4, ... } }
    // sectionDetails can be an object (key-value pairs) or an array
    let tableData: Array<{ testPart: string; result: 'Pass' | 'Fail'; score: string }> = [];

    console.log('[StemAssessmentReportScreen] ===== BUILDING TABLE DATA =====');
    console.log('[StemAssessmentReportScreen] sectionDetailsRaw type:', typeof sectionDetailsRaw);
    console.log('[StemAssessmentReportScreen] sectionDetailsRaw is array?', Array.isArray(sectionDetailsRaw));
    console.log('[StemAssessmentReportScreen] sectionDetailsRaw keys:', sectionDetailsRaw && typeof sectionDetailsRaw === 'object' ? Object.keys(sectionDetailsRaw) : 'N/A');
    console.log('[StemAssessmentReportScreen] sectionDetailsRaw value:', JSON.stringify(sectionDetailsRaw, null, 2));

    if (sectionDetailsRaw && typeof sectionDetailsRaw === 'object') {
        // Check if it's an array
        if (Array.isArray(sectionDetailsRaw)) {
            console.log('[StemAssessmentReportScreen] Processing sectionDetails as array, length:', sectionDetailsRaw.length);
            tableData = sectionDetailsRaw.map((section: any, index: number) => {
                const sectionName = section?.sectionName || section?.name || section?.section || `Section ${index + 1}`;
                const isSectionPass = section?.passed === true ||
                    section?.result === 'Pass' ||
                    section?.pass === true ||
                    (section?.quizStatus === 'Pass');
                const result: 'Pass' | 'Fail' = isSectionPass ? 'Pass' : 'Fail';
                const scoredMarks = section?.scoredMarks || section?.marksScored || 0;
                const totalMarks = section?.totalMarks || section?.maxMarks || 0;

                console.log(`[StemAssessmentReportScreen] Section ${index}:`, { sectionName, result, scoredMarks, totalMarks });

                return {
                    testPart: sectionName,
                    result: result,
                    score: totalMarks > 0 ? `${scoredMarks}/${totalMarks}` : '0/0',
                };
            });
        } else {
            // It's an object with section names as keys (e.g., { "Section 1": {...}, "Section 2": {...} })
            console.log('[StemAssessmentReportScreen] Processing sectionDetails as object');
            const entries = Object.entries(sectionDetailsRaw);
            console.log('[StemAssessmentReportScreen] Number of sections:', entries.length);

            tableData = entries.map(([sectionKey, section]: [string, any], index: number) => {
                // Use the key as section name, or section name from the object
                const sectionName = section?.sectionName || section?.name || sectionKey || `Section ${index + 1}`;

                // Determine Pass/Fail - check multiple possible fields
                const isSectionPass = section?.pass === true ||
                    section?.passed === true ||
                    section?.result === 'Pass' ||
                    section?.result === 'pass' ||
                    (section?.quizStatus === 'Pass') ||
                    (section?.quizStatus === 'pass');
                const result: 'Pass' | 'Fail' = isSectionPass ? 'Pass' : 'Fail';

                // Extract scoredMarks and totalMarks - check multiple possible fields
                const scoredMarks = section?.scoredMarks || section?.marksScored || section?.correctQuestions || 0;
                const totalMarks = section?.totalMarks || section?.maxMarks || section?.totalQuestions || 0;

                console.log(`[StemAssessmentReportScreen] Section "${sectionKey}":`, {
                    sectionName,
                    result,
                    scoredMarks,
                    totalMarks,
                    pass: section?.pass,
                    passed: section?.passed,
                    sectionData: JSON.stringify(section, null, 2)
                });

                return {
                    testPart: sectionName,
                    result: result,
                    score: totalMarks > 0 ? `${scoredMarks}/${totalMarks}` : '0/0',
                };
            });
        }
    } else {
        console.warn('[StemAssessmentReportScreen] sectionDetailsRaw is not an object or is null/undefined');
    }

    console.log('[StemAssessmentReportScreen] ===== TABLE DATA BUILT =====');
    console.log('[StemAssessmentReportScreen] Table data length:', tableData.length);
    console.log('[StemAssessmentReportScreen] Table data:', JSON.stringify(tableData, null, 2));
    console.log('[StemAssessmentReportScreen] ============================');

    // Final rendering verification
    console.log('[StemAssessmentReportScreen] ===== RENDERING VERIFICATION =====');
    console.log('[StemAssessmentReportScreen] isPass:', isPass);
    console.log('[StemAssessmentReportScreen] finalScorePercentage:', finalScorePercentage);
    console.log('[StemAssessmentReportScreen] correctAnswersDisplay:', correctAnswersDisplay);
    console.log('[StemAssessmentReportScreen] timeTaken:', timeTaken);
    console.log('[StemAssessmentReportScreen] message:', message);
    console.log('[StemAssessmentReportScreen] tableData.length:', tableData.length);
    console.log('[StemAssessmentReportScreen] ====================================');

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

    // ... existing imports

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
                    <StemAssessmentReportSkeleton />
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

    // Quiz Title - use API data or fallback
    const reportTitle = finalData?.quizTitle ||
        reportData?.quizTitle ||
        reportData?.title ||
        'Assessment Report';

    // If assessment is failed, show report screen with blue card and table (matching Figma design)
    if (!isPass && !loading && reportData) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                {/* Header */}
                <Header onProfilePress={handleProfilePress} onLogoPress={() => navigation.navigate('Home')} />

                {/* Breadcrumb Bar */}
                <BreadcrumbBar items={[reportTitle]} />

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Assessment Report Card - Blue Card */}
                    <View style={styles.reportCard}>
                        {/* Assessment Logo at top of card */}
                        <View style={styles.illustrationContainer}>
                            <AssessmentLogo size={70} />
                        </View>

                        {/* Content Section */}
                        <View style={styles.contentSection}>
                            {/* Title and Message */}
                            <View style={styles.titleSection}>
                                <Text style={styles.title}>{reportTitle}</Text>
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
                                            <X size={24} color={colors.error || '#EB5757'} />
                                        </View>
                                        <Text style={styles.resultText}>Fail</Text>
                                    </View>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>FINAL SCORE</Text>
                                    <Text style={styles.scoreText}>{finalScoreDisplay}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Summary Section with Table */}
                    <View style={styles.summarySection}>
                        <Text style={styles.summaryTitle}>Summary Of Your Attempt</Text>
                        {/* Always render the table - it will show "No data available" if empty */}
                        <SummaryTable rows={tableData} />

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
    }

    // If assessment is passed, show success screen matching Figma design
    // BUT also show the table below the blue card (as per Figma design)
    if (isPass && !loading && reportData) {
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
                    {/* Assessment Report Card - Blue Card */}
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
                                            <Check size={24} color={colors.successGreen || '#27AE60'} />
                                        </View>
                                        <Text style={styles.resultText}>Pass</Text>
                                    </View>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>FINAL SCORE</Text>
                                    <Text style={styles.scoreText}>{finalScoreDisplay}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Summary Section with Table */}
                    <View style={styles.summarySection}>
                        <Text style={styles.summaryTitle}>Summary Of Your Attempt</Text>
                        {/* Always render the table - it will show "No data available" if empty */}
                        <SummaryTable rows={tableData} />

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
                    {/* Always render the table - it will show "No data available" if empty */}
                    <SummaryTable rows={tableData} />

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


