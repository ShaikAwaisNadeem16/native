import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Bookmark } from 'lucide-react-native';
import DownwardArrow from '../../components/common/DownwardArrow';
import { colors, typography, borderRadius } from '../../styles/theme';
import TimerProgress from './components/TimerProgress';
import TestQuestionTag from './components/TestQuestionTag';
import AnswerOption from './components/AnswerOption';
import PrimaryButton from '../../components/SignUp/PrimaryButton';
import SubmitTestConfirmationModal from './components/SubmitTestConfirmationModal';
import AssessmentService from '../../api/assessment';
import Storage from '../../utils/storage';
import { RootStackParamList } from '../../navigation/AppNavigator';

// StemAssessmentTestScreen - Assessment test with questions
// Handles both passage-based and single-line MCQ questions
// State-driven: Works for STEM Assessment, Engineering Systems, and other assessments
type StemAssessmentTestScreenNavigationProp = StackNavigationProp<RootStackParamList, 'StemAssessmentTest'>;
type StemAssessmentTestScreenRouteProp = RouteProp<RootStackParamList, 'StemAssessmentTest'>;

const StemAssessmentTestScreen: React.FC = () => {
    const navigation = useNavigation<StemAssessmentTestScreenNavigationProp>();
    const route = useRoute<StemAssessmentTestScreenRouteProp>();
    const [isMenuExpanded, setIsMenuExpanded] = useState(true); // Menu expanded by default
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Assessment type - can be "STEM Assessment" or "Engineering Systems" or other
    // In real implementation, this would come from route params or assessment state
    const assessmentType = 'Engineering Systems'; // Default to Engineering Systems for this state
    const assessmentSubtitle = 'ASSESSMENT'; // Subtitle shown in menu
    
    // Determine if this is a passage-based question or single-line MCQ
    // In real implementation, this would come from question data
    // For now, we'll use a prop or determine from question type
    const hasPassage = false; // Set to true for passage questions, false for single-line MCQs
    const questionCategory = 'PASSAGE SINGLE CHOICE QUESTION'; // Question category label

    const handleMarkForReview = () => {
        console.log('Mark for review pressed');
    };

    const handlePrevious = () => {
        console.log('Previous pressed');
    };

    const handleNext = () => {
        console.log('Next pressed');
    };

    const handleAnswerSelect = (optionNumber: string) => {
        setSelectedAnswer(optionNumber);
    };

    // Question tags data - showing different states
    // In real implementation, this would come from assessment state
    const questionTags = [
        { number: '1', state: 'Answered' as const },
        { number: '2', state: 'Answered' as const },
        { number: '', state: 'Review Unanswered' as const },
        { number: '4', state: 'Answered' as const },
        { number: '5', state: 'Answered' as const },
        { number: '6', state: 'Selected' as const },
        { number: '7', state: 'Unanswered' as const },
        { number: '8', state: 'Unanswered' as const },
        { number: '9', state: 'Unanswered' as const },
        { number: '10', state: 'Unanswered' as const },
        { number: '11', state: 'Unanswered' as const },
        { number: '12', state: 'Unanswered' as const },
        { number: '13', state: 'Unanswered' as const },
        { number: '14', state: 'Unanswered' as const },
    ];

    const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);

    // Calculate unanswered and review-marked question counts
    // In real implementation, this would come from assessment state
    const unansweredCount = useMemo(() => {
        // Count questions with state 'Unanswered'
        return questionTags.filter(tag => tag.state === 'Unanswered').length;
    }, [questionTags]);

    const reviewMarkedCount = useMemo(() => {
        // Count questions with state 'Review Unanswered' or 'Review Answered'
        return questionTags.filter(tag => 
            tag.state === 'Review Unanswered' || tag.state === 'Review Answered'
        ).length;
    }, [questionTags]);

    const handleSubmitTest = () => {
        // Check if there are unanswered or review-marked questions
        if (unansweredCount > 0 || reviewMarkedCount > 0) {
            // Show confirmation modal
            setShowSubmitConfirmation(true);
        } else {
            // All questions answered, proceed directly to submission
            console.log('Submit test - all questions answered');
            // TODO: Navigate to final submission or call submit API
        }
    };

    const handleConfirmSubmit = async () => {
        setShowSubmitConfirmation(false);
        setIsSubmitting(true);
        
        try {
            const userId = await Storage.getItem('userId');
            const lessonId = route.params?.lessonId || route.params?.moodleCourseId;
            
            if (!userId || !lessonId) {
                console.error('[StemAssessmentTestScreen] Missing userId or lessonId for submission');
                setIsSubmitting(false);
                return;
            }

            // Call quiz-submit API
            console.log('[StemAssessmentTestScreen] Submitting assessment...');
            const response = await AssessmentService.attemptQuiz({
                page: 'quiz-submit',
                userId,
                lessonId,
                // TODO: Include qdata with all question answers when available
            });

            console.log('[StemAssessmentTestScreen] Assessment submission response:', JSON.stringify(response, null, 2));

            // Extract data from response
            const finalData = response?.final || {};
            const questionsData = response?.questions || {};
            const overallData = questionsData?.overall || {};
            
            // Determine if result is Pass or Fail
            const isPass = finalData?.pass === true || 
                          response?.pass === true ||
                          finalData?.quizStatus?.toLowerCase().includes('cleared') ||
                          (finalData?.quizStatus !== 'Fail' && finalData?.pass !== false && 
                           finalData?.message?.toLowerCase().includes('pass'));
            
            // Extract score data
            const scoredMarks = overallData?.scoredMarks || 0;
            const totalMarks = overallData?.totalMarks || 100;
            const finalScorePercentage = overallData?.scaledScore || 
                                        finalData?.rawScore || 
                                        Math.round((scoredMarks / totalMarks) * 100);
            const correctAnswersDisplay = `${scoredMarks}/${totalMarks}`;
            const timeTaken = finalData?.timeTaken || '00m 00s';
            
            // Extract fail message and cooldown
            const failMessage = finalData?.failReason || finalData?.message;
            const cooldownDays = finalData?.cooldownDays || finalData?.reattemptDays || 60;
            const minimumScore = finalData?.minimumScore || finalData?.passingScore || 50;

            if (isPass) {
                // Navigate to success screen - pass lessonId and quizReportData for "View Report"
                navigation.navigate('AssessmentClearedSuccess', {
                    lessonId: lessonId, // Pass lessonId for "View Report" button
                    moodleCourseId: lessonId,
                    quizReportData: response, // Pass full response for "View Report" button
                    finalResult: 'Pass' as const,
                    finalScore: finalScorePercentage,
                    correctAnswers: correctAnswersDisplay,
                    timeTaken: timeTaken,
                });
            } else {
                // Navigate to failed screen - pass lessonId and quizReportData for "View Report"
                navigation.navigate('AssessmentFailed', {
                    lessonId: lessonId, // Pass lessonId to fetch data from API
                    moodleCourseId: lessonId,
                    quizReportData: response, // Pass full response for "View Report" button
                    finalResult: 'Fail' as const,
                    finalScore: finalScorePercentage, // Fallback data
                    correctAnswers: correctAnswersDisplay, // Fallback data
                    timeTaken: timeTaken, // Fallback data
                    failMessage: failMessage, // Fallback data
                    cooldownDays: cooldownDays, // Fallback data
                    minimumScore: minimumScore, // Fallback data
                });
            }
        } catch (error: any) {
            console.error('[StemAssessmentTestScreen] Failed to submit assessment:', error);
            setIsSubmitting(false);
            // Show error message from backend
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to submit assessment. Please try again.';
            Alert.alert('Error', errorMessage);
        }
    };

    const handleReturnToAttempt = () => {
        setShowSubmitConfirmation(false);
        // Return to current question - no state reset
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Top Navigation */}
            <View style={styles.topNavigation}>
                <View style={styles.topNavigationContent}>
                    {/* Timer Section */}
                    <View style={styles.timerSection}>
                        <TimerProgress
                            timeRemaining="02:00:00"
                            timeLabel="TIME REMAINING: PART 1"
                            percentage={100}
                        />
                    </View>
                    {/* Expanded Menu Content */}
                    {isMenuExpanded && (
                        <View style={styles.menuContent}>
                            <View style={styles.testInfo}>
                                <Text style={styles.testSubtitle}>{assessmentSubtitle}</Text>
                                <Text style={styles.testTitle}>{assessmentType}</Text>
                            </View>
                            <View style={styles.questionTagsContainer}>
                                {questionTags.map((tag, index) => (
                                    <TestQuestionTag
                                        key={index}
                                        questionNo={tag.number}
                                        state={tag.state}
                                        size={36}
                                    />
                                ))}
                            </View>
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleSubmitTest}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.submitButtonText}>Submit Test</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                {/* Menu Toggle Button */}
                <TouchableOpacity
                    style={styles.menuToggle}
                    onPress={() => setIsMenuExpanded(!isMenuExpanded)}
                    activeOpacity={0.7}
                >
                    <View style={[styles.menuToggleCircle, isMenuExpanded && styles.chevronRotated]}>
                        <DownwardArrow size={24} />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Passage Section - Only shown for passage-based questions */}
                {hasPassage && (
                    <View style={styles.passageSection}>
                        <Text style={styles.passageInstruction}>
                            Read the given information carefully and answer the questions 6-10 below:
                        </Text>
                        <Text style={styles.passageText}>
                            Ten persons are sitting in parallel rows such that P, Q, R, S and T are siting in Row-1 while A, B, C, D and E are sitting in Row-2. Row-1 is in the north of Row-2. Equal number of persons are facing north and south. All the above information is not necessarily in the same order. sits opposite to A. Q sits to the immediate left of R, who faces in the same direction as T. E sits second to the right of A, but not adjacent to B. D faces north direction. T sits third to the right of S. who faces south direction. The persons sitting at extreme ends of the same row do not face in same direction. Q and S are not neighbours. E, who faces south direction, is sitting opposite to P. C and B face in the same direction.
                        </Text>
                    </View>
                )}

                {/* Question Section */}
                <View style={[styles.questionSection, !hasPassage && styles.questionSectionNoPassage]}>
                    <View style={styles.questionHeader}>
                        {/* Question Category Label */}
                        <Text style={styles.questionCategory}>{questionCategory}</Text>
                        {/* Question Text */}
                        <Text style={styles.questionText}>
                            Who among the following is sitting opposite to the person who is sitting second to the left of T
                        </Text>
                    </View>
                    <View style={styles.answerOptions}>
                        <AnswerOption
                            optionText="Standard Design Vehicle"
                            optionNumber="1"
                            isSelected={selectedAnswer === '1'}
                            onPress={() => handleAnswerSelect('1')}
                        />
                        <AnswerOption
                            optionText="Solar Driven Vehicle"
                            optionNumber="2"
                            isSelected={selectedAnswer === '2'}
                            onPress={() => handleAnswerSelect('2')}
                        />
                        <AnswerOption
                            optionText="Speedy Driven Vehicle"
                            optionNumber="3"
                            isSelected={selectedAnswer === '3'}
                            onPress={() => handleAnswerSelect('3')}
                        />
                        <AnswerOption
                            optionText="Software Defined Vehicle"
                            optionNumber="4"
                            isSelected={selectedAnswer === '4'}
                            onPress={() => handleAnswerSelect('4')}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNavigation}>
                <TouchableOpacity
                    style={styles.markForReviewButton}
                    onPress={handleMarkForReview}
                    activeOpacity={0.7}
                >
                    <Bookmark size={24} color={colors.primaryBlue} />
                    <Text style={styles.markForReviewText}>Mark For Review</Text>
                </TouchableOpacity>
                <View style={styles.navButtons}>
                    <TouchableOpacity
                        style={styles.previousButton}
                        onPress={handlePrevious}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.previousButtonText}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={handleNext}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Submit Test Confirmation Modal */}
            <SubmitTestConfirmationModal
                visible={showSubmitConfirmation}
                unansweredCount={unansweredCount}
                reviewMarkedCount={reviewMarkedCount}
                onConfirm={handleConfirmSubmit}
                onCancel={handleReturnToAttempt}
                isSubmitting={isSubmitting}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    topNavigation: {
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey,
        backgroundColor: colors.white,
        alignItems: 'center',
    },
    topNavigationContent: {
        width: '100%',
    },
    timerSection: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey,
    },
    menuToggle: {
        alignItems: 'center',
        paddingVertical: 8,
        width: 81,
        height: 40,
    },
    menuToggleCircle: {
        width: 81,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: colors.white,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: colors.lightGrey,
    },
    chevron: {
        transform: [{ rotate: '0deg' }],
    },
    chevronRotated: {
        transform: [{ rotate: '180deg' }],
    },
    menuContent: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 20,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        backgroundColor: colors.white,
    },
    testInfo: {
        flexDirection: 'column',
        gap: 4,
        width: '100%',
    },
    testSubtitle: {
        ...typography.s1Regular,
        color: colors.textGrey,
    },
    testTitle: {
        ...typography.p3Bold,
        color: colors.primaryDarkBlue,
    },
    questionTagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        width: '100%',
        // Ensure proper wrapping - 14 tags with 36px width + 12px gaps
    },
    submitButton: {
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    submitButtonText: {
        ...typography.p4SemiBold,
        color: colors.primaryBlue,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 20,
        gap: 40,
    },
    passageSection: {
        backgroundColor: colors.mainBgGrey, // #f6f9fc from Figma
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 24,
        gap: 16,
        width: '100%',
    },
    passageInstruction: {
        ...typography.p4SemiBold, // 14px SemiBold
        color: colors.primaryDarkBlue,
        lineHeight: 20,
    },
    passageText: {
        ...typography.p3Regular, // 16px Regular
        color: colors.textGrey,
        lineHeight: 25,
    },
    questionSection: {
        flexDirection: 'column',
        gap: 24,
        width: '100%',
    },
    questionSectionNoPassage: {
        // For single-line MCQ questions without passage
        gap: 24,
    },
    questionHeader: {
        flexDirection: 'column',
        gap: 4,
        width: '100%',
    },
    questionCategory: {
        ...typography.s1Regular, // 12px Regular
        color: colors.textGrey,
        lineHeight: 16,
    },
    questionText: {
        ...typography.p4SemiBold, // 14px SemiBold
        color: colors.primaryDarkBlue,
        lineHeight: 20,
    },
    answerOptions: {
        flexDirection: 'column',
        gap: 16,
        width: '100%',
    },
    bottomNavigation: {
        borderTopWidth: 1,
        borderTopColor: colors.lightGrey,
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 20,
    },
    markForReviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
    },
    markForReviewText: {
        ...typography.p4,
        color: colors.primaryBlue,
    },
    navButtons: {
        flexDirection: 'row',
        gap: 20,
        width: '100%',
    },
    previousButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 140,
    },
    previousButtonText: {
        ...typography.p4SemiBold,
        color: colors.primaryBlue,
    },
    nextButton: {
        flex: 1,
        backgroundColor: colors.primaryBlue,
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 140,
    },
    nextButtonText: {
        ...typography.p4SemiBold,
        color: colors.white,
    },
});

export default StemAssessmentTestScreen;

