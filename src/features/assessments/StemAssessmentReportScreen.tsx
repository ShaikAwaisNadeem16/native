import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, Flag, Check, X } from 'lucide-react-native';
import { colors, typography, borderRadius } from '../../styles/theme';
import Header from '../home/components/Header';
import BreadcrumbBar from './components/BreadcrumbBar';
import SummaryTable from './components/SummaryTable';
import PrimaryButton from '../../components/SignUp/PrimaryButton';
import AssessmentLogo from '../../components/common/AssessmentLogo';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AssessmentService from '../../api/assessment';
import Storage from '../../utils/storage';

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

    // Extract data from API response
    const finalData = reportData?.final || {};
    const questionsData = reportData?.questions || {};
    const overallData = questionsData?.overall || {};
    const sectionDetailsRaw = questionsData?.sectionDetails || {};

    // Determine if result is Pass or Fail
    const isPass = finalData?.pass === true || 
                   reportData?.pass === true ||
                   finalData?.quizStatus?.toLowerCase().includes('cleared') ||
                   (finalData?.quizStatus !== 'Fail' && finalData?.pass !== false && 
                    finalData?.message?.toLowerCase().includes('pass'));
    
    const finalResult = isPass ? 'Pass' : 'Fail';
    // Use scoredMarks and totalMarks from overall data
    const scoredMarks = overallData?.scoredMarks || 0;
    const totalMarks = overallData?.totalMarks || 0;
    const finalScoreDisplay = `${scoredMarks}/${totalMarks}`;

    // Message from API - use API message or fallback based on pass/fail
    const message = finalData?.message || 
                    (isPass ? 'Congratulations on clearing the assessment!' : 'You did not pass this assessment. Please review and try again.');
    
    // Failure reason from API (if present)
    const failReason = finalData?.failReason || '';

    // Time taken from API
    const timeTaken = finalData?.timeTaken || '';

    // Correct answers
    const correctAnswers = finalData?.correctAnswers || overallData?.correctQuestions || 0;
    const totalQuestions = overallData?.totalQuestions || 0;

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
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primaryBlue} />
                    <Text style={styles.loadingText}>Loading report...</Text>
                </View>
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
});

export default StemAssessmentReportScreen;


