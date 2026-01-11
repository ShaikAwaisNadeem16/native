import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { X } from 'lucide-react-native';
import { colors, typography, borderRadius } from '../../styles/theme';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { AssessmentService } from '../../api/assessment';
import { AssignmentService } from '../../api/assignment';
import PrimaryButton from '../../components/SignUp/PrimaryButton';
import SecondaryButton from '../../components/SignUp/SecondaryButton';
import { CardSkeleton } from '../../components/common/SkeletonLoaders';
import SubmitSurveyConfirmationModal from './components/SubmitSurveyConfirmationModal';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'SurveyAssessmentQuestions'>;

interface Question {
    questionId: string;
    questionText: string;
    questionType?: string;
    options?: Array<{ value: number; label?: string }>;
    selectedAnswer?: number;
}

interface SurveyQuestionsResponse {
    questions?: Question[];
    attemptId?: string;
    totalQuestions?: number;
    currentQuestionIndex?: number;
}

/**
 * SurveyAssessmentQuestions Screen
 * Displays survey/assessment questions with numbered options (1-10 scale)
 * Matches Figma design with progress bar, questions, and navigation buttons
 */
const SurveyAssessmentQuestions: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const scrollViewRef = useRef<ScrollView>(null);
    
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
    const [attemptId, setAttemptId] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Extract lessonId (moodleCourseId) from route params
    const lessonId = route.params?.lessonId || route.params?.moodleCourseId;

    useEffect(() => {
        const fetchQuestions = async () => {
            if (!lessonId) {
                setError('No lesson ID provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                console.log('[SurveyAssessmentQuestions] Starting assessment with lessonId:', lessonId);

                // Start the assessment/quiz to get questions
                // Using the attemptQuiz API with page: 'start'
                const response: SurveyQuestionsResponse = await AssessmentService.attemptQuiz({
                    page: 'start',
                    lessonId: lessonId,
                });

                console.log('[SurveyAssessmentQuestions] Response received:', JSON.stringify(response, null, 2));

                if (response.questions && Array.isArray(response.questions)) {
                    setQuestions(response.questions);
                    setAttemptId(response.attemptId || null);
                    setCurrentQuestionIndex(response.currentQuestionIndex || 0);
                } else if (response.qdata && Array.isArray(response.qdata)) {
                    // Alternative response format - convert qdata to questions
                    const convertedQuestions: Question[] = response.qdata.map((item: any, index: number) => ({
                        questionId: item.questionId || `q${index + 1}`,
                        questionText: item.questionText || item.question || `Question ${index + 1}`,
                        questionType: item.questionType || 'SINGLE CHOICE QUESTION',
                        options: Array.from({ length: 10 }, (_, i) => ({ value: i + 1 })),
                    }));
                    setQuestions(convertedQuestions);
                    setAttemptId(response.attemptId || null);
                } else {
                    // If no questions in response, create default questions structure
                    // This is a fallback - in production, the API should return questions
                    console.warn('[SurveyAssessmentQuestions] No questions in response, using fallback');
                    const fallbackQuestions: Question[] = [
                        {
                            questionId: 'q1',
                            questionText: 'Who among the following is sitting opposite to the person who is sitting second to the left of T',
                            questionType: 'SINGLE CHOICE QUESTION',
                            options: Array.from({ length: 10 }, (_, i) => ({ value: i + 1 })),
                        },
                    ];
                    setQuestions(fallbackQuestions);
                }
            } catch (err: any) {
                console.error('[SurveyAssessmentQuestions] Error fetching questions:', err);
                setError(err?.message || 'Failed to load questions');
                Alert.alert('Error', 'Failed to load assessment questions. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [lessonId]);

    const handleAnswerSelect = (questionId: string, answer: number) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
        }));
    };

    const handleBackToTop = () => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    };

    const handleNext = async () => {
        if (!attemptId || !lessonId) {
            Alert.alert('Error', 'Missing attempt ID or lesson ID');
            return;
        }

        try {
            // Submit current answers
            const qdata = questions.map((q) => ({
                questionId: q.questionId,
                chosenAnswer: selectedAnswers[q.questionId] ? [String(selectedAnswers[q.questionId])] : [],
                status: selectedAnswers[q.questionId] ? 'submitted' : 'notSubmitted',
            }));

            // If there are more questions, move to next
            if (currentQuestionIndex < questions.length - 1) {
                const response = await AssessmentService.attemptQuiz({
                    page: 'question-submit',
                    lessonId: lessonId,
                    attemptId: attemptId,
                    qdata: qdata,
                });

                setCurrentQuestionIndex(currentQuestionIndex + 1);
                scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            } else {
                // Last question - show submit confirmation modal
                setShowSubmitModal(true);
            }
        } catch (err: any) {
            console.error('[SurveyAssessmentQuestions] Error submitting answer:', err);
            Alert.alert('Error', 'Failed to submit answer. Please try again.');
        }
    };

    const handleConfirmSubmit = async () => {
        if (!attemptId || !lessonId) {
            Alert.alert('Error', 'Missing attempt ID or lesson ID');
            setShowSubmitModal(false);
            return;
        }

        try {
            setIsSubmitting(true);

            // Submit all answers
            const qdata = questions.map((q) => ({
                questionId: q.questionId,
                chosenAnswer: selectedAnswers[q.questionId] ? [String(selectedAnswers[q.questionId])] : [],
                status: selectedAnswers[q.questionId] ? 'submitted' : 'notSubmitted',
            }));

            const response = await AssessmentService.attemptQuiz({
                page: 'quiz-submit',
                lessonId: lessonId,
                attemptId: attemptId,
                qdata: qdata,
            });

            setShowSubmitModal(false);
            setIsSubmitting(false);

            // Navigate to results screen
            navigation.navigate('StemAssessmentReport', {
                lessonId: lessonId,
                moodleCourseId: lessonId,
            });
        } catch (err: any) {
            console.error('[SurveyAssessmentQuestions] Error submitting quiz:', err);
            setIsSubmitting(false);
            Alert.alert('Error', 'Failed to submit survey. Please try again.');
        }
    };

    const handleCancelSubmit = () => {
        setShowSubmitModal(false);
    };

    const handleClose = () => {
        Alert.alert(
            'Exit Assessment',
            'Are you sure you want to exit? Your progress will be saved.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Exit', style: 'destructive', onPress: () => navigation.goBack() },
            ]
        );
    };

    // Calculate progress percentage
    const progressPercentage = questions.length > 0 
        ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100)
        : 0;

    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <CardSkeleton />
            </SafeAreaView>
        );
    }

    if (error || questions.length === 0) {
        return (
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error || 'No questions available'}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Header with Progress Bar */}
            <View style={styles.header}>
                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
                    <View style={styles.progressBarRemaining} />
                </View>
                
                {/* Percentage Badge */}
                <View style={styles.percentageBadge}>
                    <Text style={styles.percentageText}>{progressPercentage}%</Text>
                </View>

                {/* Close Button */}
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleClose}
                    activeOpacity={0.7}
                >
                    <X size={24} color={colors.textGrey} />
                </TouchableOpacity>
            </View>

            {/* Questions Content */}
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {questions.map((question, index) => {
                    const isCurrentQuestion = index === currentQuestionIndex;
                    const selectedAnswer = selectedAnswers[question.questionId];

                    return (
                        <View key={question.questionId} style={styles.questionContainer}>
                            {/* Question Header */}
                            <View style={styles.questionHeader}>
                                <Text style={styles.questionType}>
                                    {question.questionType || 'SINGLE CHOICE QUESTION'}
                                </Text>
                                <Text style={styles.questionText}>{question.questionText}</Text>
                            </View>

                            {/* Answer Options Grid (1-10) */}
                            <View style={styles.optionsContainer}>
                                <View style={styles.optionsGrid}>
                                    {Array.from({ length: 10 }, (_, i) => {
                                        const optionValue = i + 1;
                                        const isSelected = selectedAnswer === optionValue;

                                        return (
                                            <TouchableOpacity
                                                key={optionValue}
                                                style={styles.optionWrapper}
                                                onPress={() => handleAnswerSelect(question.questionId, optionValue)}
                                                activeOpacity={0.7}
                                                disabled={!isCurrentQuestion}
                                            >
                                                {/* Background shadow */}
                                                <View
                                                    style={[
                                                        styles.optionBackground,
                                                        isSelected && styles.optionBackgroundSelected,
                                                    ]}
                                                />
                                                {/* Option button */}
                                                <View
                                                    style={[
                                                        styles.optionButton,
                                                        isSelected && styles.optionButtonSelected,
                                                        !isCurrentQuestion && styles.optionDisabled,
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.optionText,
                                                            !isCurrentQuestion && styles.optionTextDisabled,
                                                        ]}
                                                    >
                                                        {optionValue}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                {/* Scale Indicator */}
                                <View style={styles.scaleIndicator}>
                                    <Text style={styles.scaleText}>1 - Beginner</Text>
                                    <Text style={styles.scaleText}>10 - Expert</Text>
                                </View>
                            </View>

                            {/* Divider (except for last question) */}
                            {index < questions.length - 1 && <View style={styles.divider} />}
                        </View>
                    );
                })}
            </ScrollView>

            {/* Bottom Navigation Buttons */}
            <View style={styles.bottomNavigation}>
                <View style={styles.backButton}>
                    <SecondaryButton
                        label="Back To Top"
                        onPress={handleBackToTop}
                    />
                </View>
                <View style={styles.nextButton}>
                    <PrimaryButton
                        label={currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
                        onPress={handleNext}
                    />
                </View>
            </View>

            {/* Submit Confirmation Modal */}
            <SubmitSurveyConfirmationModal
                visible={showSubmitModal}
                onConfirm={handleConfirmSubmit}
                onCancel={handleCancelSubmit}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 24,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey,
    },
    progressBarContainer: {
        flex: 1,
        flexDirection: 'row',
        height: 12,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: colors.lightGrey,
    },
    progressBar: {
        height: '100%',
        backgroundColor: colors.primaryBlue,
        borderRadius: 20,
    },
    progressBarRemaining: {
        flex: 1,
        backgroundColor: colors.lightGrey,
    },
    percentageBadge: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: 24,
        paddingHorizontal: 12,
        paddingVertical: 8,
        minWidth: 60,
        alignItems: 'center',
    },
    percentageText: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: '600' as const,
        lineHeight: 13,
        color: colors.primaryDarkBlue,
    },
    closeButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100, // Space for bottom navigation
    },
    questionContainer: {
        marginBottom: 40,
    },
    questionHeader: {
        marginBottom: 24,
        gap: 4,
    },
    questionType: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
        color: colors.textGrey,
        textAlign: 'center',
    },
    questionText: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: '600' as const,
        lineHeight: 20,
        color: colors.primaryDarkBlue,
        textAlign: 'center',
    },
    optionsContainer: {
        gap: 16,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'center',
    },
    optionWrapper: {
        position: 'relative',
        width: 'auto',
        minWidth: 50,
    },
    optionBackground: {
        position: 'absolute',
        top: 2,
        left: 0,
        right: 0,
        height: 57,
        backgroundColor: colors.lightGrey,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: 8,
    },
    optionBackgroundSelected: {
        backgroundColor: colors.primaryBlue,
        borderColor: colors.primaryBlue,
    },
    optionButton: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: 8,
        paddingHorizontal: 24,
        paddingVertical: 16,
        minWidth: 50,
        minHeight: 57,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionButtonSelected: {
        borderColor: colors.primaryBlue,
        borderWidth: 2,
    },
    optionDisabled: {
        opacity: 0.4,
    },
    optionText: {
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 25,
        color: colors.textGrey,
    },
    optionTextDisabled: {
        color: colors.lightGrey,
    },
    scaleIndicator: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    scaleText: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
        color: '#80919f', // lighter-text-grey
    },
    divider: {
        height: 1,
        backgroundColor: '#dde1e6', // divider color from Figma
        marginTop: 40,
    },
    bottomNavigation: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        gap: 16,
        padding: 16,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.lightGrey,
    },
    backButton: {
        flex: 1,
        minWidth: 140,
    },
    nextButton: {
        flex: 1,
        minWidth: 140,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        ...typography.p3Regular,
        color: colors.textGrey,
        textAlign: 'center',
    },
});

export default SurveyAssessmentQuestions;

