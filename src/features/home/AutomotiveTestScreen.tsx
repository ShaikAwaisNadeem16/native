import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Bookmark, ChevronDown } from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { colors, typography, borderRadius } from '../../styles/theme';
import TimerProgress from '../assessments/components/TimerProgress';
import TestQuestionTag from '../assessments/components/TestQuestionTag';
import AnswerOption from '../assessments/components/AnswerOption';
import ExplanationAnswerOption, { AnswerOptionState } from '../assessments/components/ExplanationAnswerOption';
import AnswerExplanationWidget, { ExplanationType } from '../assessments/components/AnswerExplanationWidget';
import ExplanationSection from '../assessments/components/ExplanationSection';

type NavigationProp = StackNavigationProp<RootStackParamList, 'AutomotiveTest'>;

// Question tag states as defined in Figma
type QuestionTagState = 'Unanswered' | 'Selected' | 'Answered' | 'Review Unanswered' | 'Review Answered' | 'Correct' | 'Incorrect';

// Question state tracking - internal representation
interface QuestionState {
    visited: boolean;
    answered: boolean;
    selectedOption: string | null;
    markedForReview: boolean;
    skipped: boolean; // Track if question was skipped (navigated away without answering)
}

interface Question {
    id: number;
    type: string;
    text: string;
    options: { text: string; number: string }[];
    correctAnswer: string; // Correct answer option number
    explanation: string; // Explanation text
}

// Sample questions for the automotive test
const questions: Question[] = [
    {
        id: 1,
        type: 'PASSAGE SINGLE CHOICE QUESTION',
        text: 'Who among the following is sitting opposite to the person who is sitting second to the left of T',
        options: [
            { text: 'Standard Design Vehicle', number: '1' },
            { text: 'Solar Driven Vehicle', number: '2' },
            { text: 'Speedy Driven Vehicle', number: '3' },
            { text: 'Software Defined Vehicle', number: '4' },
        ],
        correctAnswer: '3',
        explanation: 'The course features several short quizzes (around 5 questions each) to reinforce the material covered that week. All the quizzes combined account for 50% of your final grade. The Peer Review Assignment accounts for the other 50% of the final grade. You must pass every graded assessment to pass the course, regardless of your final grade.',
    },
    {
        id: 2,
        type: 'PASSAGE SINGLE CHOICE QUESTION',
        text: 'What is the primary advantage of electric vehicles over traditional combustion engines?',
        options: [
            { text: 'Lower initial cost', number: '1' },
            { text: 'Zero direct emissions', number: '2' },
            { text: 'Longer range', number: '3' },
            { text: 'Faster refueling', number: '4' },
        ],
        correctAnswer: '2',
        explanation: 'Electric vehicles produce zero direct emissions, making them environmentally friendly compared to traditional combustion engines.',
    },
    {
        id: 3,
        type: 'PASSAGE SINGLE CHOICE QUESTION',
        text: 'Which component is unique to hybrid electric vehicles?',
        options: [
            { text: 'Fuel tank', number: '1' },
            { text: 'Regenerative braking system', number: '2' },
            { text: 'Transmission', number: '3' },
            { text: 'Exhaust system', number: '4' },
        ],
        correctAnswer: '2',
        explanation: 'Regenerative braking systems are unique to hybrid and electric vehicles, allowing them to recover energy during braking.',
    },
    {
        id: 4,
        type: 'PASSAGE SINGLE CHOICE QUESTION',
        text: 'What does OEM stand for in the automotive industry?',
        options: [
            { text: 'Original Equipment Manufacturer', number: '1' },
            { text: 'Optimal Engine Management', number: '2' },
            { text: 'Overseas Export Market', number: '3' },
            { text: 'Operational Efficiency Metrics', number: '4' },
        ],
        correctAnswer: '1',
        explanation: 'OEM stands for Original Equipment Manufacturer, referring to companies that manufacture components or products used in another company\'s end product.',
    },
    {
        id: 5,
        type: 'PASSAGE SINGLE CHOICE QUESTION',
        text: 'Which automotive segment has shown the highest growth in recent years?',
        options: [
            { text: 'Sedans', number: '1' },
            { text: 'SUVs and Crossovers', number: '2' },
            { text: 'Sports cars', number: '3' },
            { text: 'Minivans', number: '4' },
        ],
        correctAnswer: '2',
        explanation: 'SUVs and Crossovers have shown the highest growth in recent years due to consumer preference for larger, more versatile vehicles.',
    },
    {
        id: 6,
        type: 'PASSAGE SINGLE CHOICE QUESTION',
        text: 'What is the primary function of ADAS in modern vehicles?',
        options: [
            { text: 'Entertainment', number: '1' },
            { text: 'Safety assistance', number: '2' },
            { text: 'Fuel efficiency', number: '3' },
            { text: 'Climate control', number: '4' },
        ],
        correctAnswer: '2',
        explanation: 'ADAS (Advanced Driver Assistance Systems) primarily focuses on safety assistance features to help prevent accidents and improve driving safety.',
    },
    {
        id: 7,
        type: 'PASSAGE SINGLE CHOICE QUESTION',
        text: 'Which country is the largest automobile manufacturer globally?',
        options: [
            { text: 'United States', number: '1' },
            { text: 'Germany', number: '2' },
            { text: 'China', number: '3' },
            { text: 'Japan', number: '4' },
        ],
        correctAnswer: '3',
        explanation: 'China is currently the largest automobile manufacturer globally, producing more vehicles than any other country.',
    },
    {
        id: 8,
        type: 'PASSAGE SINGLE CHOICE QUESTION',
        text: 'What does the term "Tier 1 supplier" refer to in the automotive supply chain?',
        options: [
            { text: 'Raw material suppliers', number: '1' },
            { text: 'Direct suppliers to OEMs', number: '2' },
            { text: 'Dealership networks', number: '3' },
            { text: 'After-market parts suppliers', number: '4' },
        ],
        correctAnswer: '2',
        explanation: 'Tier 1 suppliers are direct suppliers to OEMs (Original Equipment Manufacturers), providing complete systems or modules for vehicles.',
    },
];

const TOTAL_TIME_SECONDS = 2 * 60 * 60; // 2 hours in seconds

// Initialize question states - all unvisited initially
const initializeQuestionStates = (): Map<number, QuestionState> => {
    const states = new Map<number, QuestionState>();
    questions.forEach((q) => {
        states.set(q.id, {
            visited: false,
            answered: false,
            selectedOption: null,
            markedForReview: false,
            skipped: false,
        });
    });
    return states;
};

/**
 * AutomotiveTestScreen
 * Production-grade quiz/assessment screen with proper state management
 * Based on Figma design node-id=7381-70007
 *
 * Question States (from Figma):
 * - Unanswered: White bg, grey border (#e2ebf3), grey text (#696a6f)
 * - Selected: White bg, blue border 2px (#0b6aea), blue text (#0b6aea)
 * - Answered: Blue bg (#0b6aea), white text
 * - Review Unanswered: Orange bg (#f18522), white text
 * - Review Answered: Orange bg (#f18522), white text with blue indicator
 */
const AutomotiveTestScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    // Menu expansion state
    const [isMenuExpanded, setIsMenuExpanded] = useState(true);

    // Current question index (0-based)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Question states map - tracks all question states
    const [questionStates, setQuestionStates] = useState<Map<number, QuestionState>>(() => initializeQuestionStates());

    // Timer state
    const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME_SECONDS);

    // Track start time for calculating time taken
    const startTimeRef = useRef<number>(Date.now());

    // Track if test is submitted
    const isSubmittedRef = useRef(false);

    // Track if test is finished (submitted) - used to show correct/incorrect states
    const [isTestFinished, setIsTestFinished] = useState(false);

    // Current question's temporary answer (before navigation)
    const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);

    // Mark first question as visited on mount
    useEffect(() => {
        setQuestionStates((prev) => {
            const newStates = new Map(prev);
            const firstQuestionState = newStates.get(1);
            if (firstQuestionState && !firstQuestionState.visited) {
                newStates.set(1, { ...firstQuestionState, visited: true });
            }
            return newStates;
        });
    }, []);

    // Load current answer when question changes
    useEffect(() => {
        const questionId = currentQuestionIndex + 1;
        const state = questionStates.get(questionId);
        setCurrentAnswer(state?.selectedOption || null);
    }, [currentQuestionIndex, questionStates]);

    // Timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    if (!isSubmittedRef.current) {
                        handleSubmitTest();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Format time as HH:MM:SS
    const formatTime = useCallback((seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    // Format time taken as MMm SSs (for quiz results)
    const formatTimeTaken = useCallback((milliseconds: number): string => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
    }, []);

    // Calculate timer percentage
    const timerPercentage = (timeRemaining / TOTAL_TIME_SECONDS) * 100;

    /**
     * Get the visual state for a question tag (Figma-defined states)
     * This determines how the question indicator appears
     * States: Active (Selected), Attempted (Answered), Skipped (Unanswered), Unvisited (Unanswered)
     */
    const getQuestionTagState = useCallback((questionId: number): QuestionTagState => {
        const state = questionStates.get(questionId);
        const question = questions.find(q => q.id === questionId);

        if (!state || !question) return 'Unanswered';

        // After test is finished, show correct/incorrect states
        if (isTestFinished) {
            if (!state.answered) {
                return 'Unanswered'; // Skipped question
            }
            // Check if the selected answer is correct
            if (state.selectedOption === question.correctAnswer) {
                return 'Correct';
            } else {
                return 'Incorrect';
            }
        }

        // During test - show current states based on Active, Attempted, Skipped, Unvisited
        const isCurrentQuestion = questionId === currentQuestionIndex + 1;

        // ACTIVE: Current question is always "Selected" (white bg, blue border, blue text)
        if (isCurrentQuestion) {
            return 'Selected';
        }

        // ATTEMPTED: Question was answered (blue bg, white text)
        if (state.answered) {
            // Check if marked for review
            if (state.markedForReview) {
                return 'Review Answered';
            }
            return 'Answered';
        }

        // SKIPPED: Question was visited but not answered (white bg, grey border, grey text)
        if (state.visited && !state.answered) {
            if (state.markedForReview) {
                return 'Review Unanswered';
            }
            return 'Unanswered';
        }

        // UNVISITED: Question not opened yet (white bg, grey border, grey text)
        return 'Unanswered';
    }, [currentQuestionIndex, questionStates, isTestFinished]);

    /**
     * Save current question state before navigation
     * Marks question as ATTEMPTED if answered, SKIPPED if not answered
     */
    const saveCurrentQuestionState = useCallback(() => {
        const questionId = currentQuestionIndex + 1;

        setQuestionStates((prev) => {
            const newStates = new Map(prev);
            const currentState = newStates.get(questionId);

            if (currentState) {
                const hasAnswer = currentAnswer !== null;
                newStates.set(questionId, {
                    ...currentState,
                    visited: true,
                    answered: hasAnswer,
                    selectedOption: currentAnswer,
                    skipped: !hasAnswer, // Mark as skipped if no answer selected
                });
            }

            return newStates;
        });
    }, [currentQuestionIndex, currentAnswer]);

    /**
     * Navigate to a specific question
     */
    const navigateToQuestion = useCallback((targetIndex: number) => {
        // Save current question state first
        saveCurrentQuestionState();

        // Mark target question as visited
        const targetQuestionId = targetIndex + 1;
        setQuestionStates((prev) => {
            const newStates = new Map(prev);
            const targetState = newStates.get(targetQuestionId);

            if (targetState) {
                newStates.set(targetQuestionId, {
                    ...targetState,
                    visited: true,
                });
            }

            return newStates;
        });

        // Update current question index
        setCurrentQuestionIndex(targetIndex);

        // Close menu if expanded
        setIsMenuExpanded(false);
    }, [saveCurrentQuestionState]);

    /**
     * Handle mark for review toggle
     */
    const handleMarkForReview = useCallback(() => {
        const questionId = currentQuestionIndex + 1;

        setQuestionStates((prev) => {
            const newStates = new Map(prev);
            const currentState = newStates.get(questionId);

            if (currentState) {
                newStates.set(questionId, {
                    ...currentState,
                    markedForReview: !currentState.markedForReview,
                });
            }

            return newStates;
        });
    }, [currentQuestionIndex]);

    /**
     * Handle previous button
     */
    const handlePrevious = useCallback(() => {
        if (currentQuestionIndex > 0) {
            navigateToQuestion(currentQuestionIndex - 1);
        }
    }, [currentQuestionIndex, navigateToQuestion]);

    /**
     * Handle next button (from question view)
     */
    const handleNext = useCallback(() => {
        if (currentQuestionIndex < questions.length - 1) {
            navigateToQuestion(currentQuestionIndex + 1);
        }
    }, [currentQuestionIndex, navigateToQuestion]);

    /**
     * Handle next button (from explanation view)
     */
    const handleNextFromExplanation = useCallback(() => {
        if (currentQuestionIndex < questions.length - 1) {
            navigateToQuestion(currentQuestionIndex + 1);
        }
    }, [currentQuestionIndex, navigateToQuestion]);

    /**
     * Handle previous button (from explanation view)
     */
    const handlePreviousFromExplanation = useCallback(() => {
        if (currentQuestionIndex > 0) {
            navigateToQuestion(currentQuestionIndex - 1);
        }
    }, [currentQuestionIndex, navigateToQuestion]);

    /**
     * Handle test submission
     */
    const handleSubmitTest = useCallback(() => {
        if (isSubmittedRef.current) return;
        isSubmittedRef.current = true;

        // Save current question state before submission
        saveCurrentQuestionState();

        // Mark test as finished - this will update question tags to show correct/incorrect
        setIsTestFinished(true);

        // Calculate accuracy (correct answers / total questions)
        let correctCount = 0;
        questions.forEach((question) => {
            const state = questionStates.get(question.id);
            if (state?.selectedOption === question.correctAnswer) {
                correctCount++;
            }
        });
        const totalQuestions = questions.length;
        const accuracy = Math.round((correctCount / totalQuestions) * 100);

        // Calculate time taken
        const timeTaken = Date.now() - startTimeRef.current;
        const timeTakenFormatted = formatTimeTaken(timeTaken);

        // Navigate to result screen based on pass/fail
        const passThreshold = 50; // 50% threshold
        if (accuracy >= passThreshold) {
            navigation.navigate('QuizCompleted', {
                accuracy,
                timeTaken: timeTakenFormatted,
            });
        } else {
            navigation.navigate('QuizFailed', {
                accuracy,
                timeTaken: timeTakenFormatted,
            });
        }
    }, [navigation, questionStates, saveCurrentQuestionState, formatTimeTaken]);

    /**
     * Handle answer selection (supports toggle/deselection)
     */
    const handleAnswerSelect = useCallback((optionNumber: string) => {
        // Toggle: if clicking the same option, deselect it
        const newAnswer = currentAnswer === optionNumber ? null : optionNumber;
        setCurrentAnswer(newAnswer);

        // Update the selected option in state, but don't mark as answered yet
        // It will be marked as answered when navigating away (if option is still selected)
        const questionId = currentQuestionIndex + 1;
        setQuestionStates((prev) => {
            const newStates = new Map(prev);
            const currentState = newStates.get(questionId);

            if (currentState) {
                newStates.set(questionId, {
                    ...currentState,
                    selectedOption: newAnswer,
                    // Don't set answered=true here - let saveCurrentQuestionState handle it
                    // If newAnswer is null, it will be marked as skipped on navigation
                });
            }

            return newStates;
        });

        // Don't show explanation during test - only after submission
    }, [currentQuestionIndex, currentAnswer]);

    /**
     * Handle question tag press (from menu)
     */
    const handleQuestionTagPress = useCallback((questionIndex: number) => {
        navigateToQuestion(questionIndex);
    }, [navigateToQuestion]);

    // Current question data
    const currentQuestion = questions[currentQuestionIndex];
    const currentQuestionState = questionStates.get(currentQuestionIndex + 1);
    const isCurrentMarkedForReview = currentQuestionState?.markedForReview || false;

    // Render chevron icon for menu toggle (from Figma design)
    const renderChevronIcon = () => (
        <ChevronDown 
            size={24} 
            color={colors.textGrey} 
            style={[styles.chevron, isMenuExpanded && styles.chevronRotated]} 
        />
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Top Navigation */}
            <View style={styles.topNavigation}>
                <View style={styles.topNavigationContent}>
                    {/* Timer Section */}
                    <View style={styles.timerSection}>
                        <TimerProgress
                            timeRemaining={formatTime(timeRemaining)}
                            timeLabel="TIME REMAINING: PART 1"
                            percentage={timerPercentage}
                        />
                    </View>

                    {/* Expanded Menu Content */}
                    {isMenuExpanded && (
                        <View style={styles.menuContent}>
                            <View style={styles.testInfo}>
                                <Text style={styles.testSubtitle}>STEM ASSESSMENT</Text>
                                <Text style={styles.testTitle}>Part 1 of 4: Science</Text>
                            </View>
                            <View style={styles.questionTagsContainer}>
                                {questions.map((_, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => handleQuestionTagPress(index)}
                                        activeOpacity={0.7}
                                    >
                                        <TestQuestionTag
                                            questionNo={String(index + 1)}
                                            state={getQuestionTagState(index + 1)}
                                            size={36}
                                        />
                                    </TouchableOpacity>
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

                {/* Menu Toggle Button - from Figma design */}
                <TouchableOpacity
                    style={styles.menuToggle}
                    onPress={() => setIsMenuExpanded(!isMenuExpanded)}
                    activeOpacity={0.7}
                >
                    <View style={styles.menuToggleCircle}>
                        {renderChevronIcon()}
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Question View - always interactive during test, no explanations during test */}
                <View style={styles.questionSection}>
                    <View style={styles.questionHeader}>
                        <Text style={styles.questionType}>{currentQuestion.type}</Text>
                        <Text style={styles.questionText}>{currentQuestion.text}</Text>
                    </View>
                    <View style={styles.answerOptions}>
                        {currentQuestion.options.map((option) => (
                            <AnswerOption
                                key={option.number}
                                optionText={option.text}
                                optionNumber={option.number}
                                isSelected={currentAnswer === option.number}
                                onPress={() => handleAnswerSelect(option.number)}
                            />
                        ))}
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
                    <Text style={styles.markForReviewText}>
                        Mark For Review
                    </Text>
                </TouchableOpacity>
                <View style={styles.navButtons}>
                    <TouchableOpacity
                        style={[
                            styles.previousButton,
                            currentQuestionIndex === 0 && styles.buttonDisabled
                        ]}
                        onPress={handlePrevious}
                        activeOpacity={0.7}
                        disabled={currentQuestionIndex === 0}
                    >
                        <Text style={[
                            styles.previousButtonText,
                            currentQuestionIndex === 0 && styles.buttonTextDisabled
                        ]}>
                            Previous
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={currentQuestionIndex === questions.length - 1 ? handleSubmitTest : handleNext}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.nextButtonText}>
                            {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
                        </Text>
                    </TouchableOpacity>
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
        width: 81,
        height: 40,
        overflow: 'hidden',
    },
    menuToggleCircle: {
        width: 81,
        height: 81,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 40.5,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        marginTop: -41,
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
    },
    questionSection: {
        flexDirection: 'column',
        gap: 24,
        width: '100%',
    },
    questionHeader: {
        flexDirection: 'column',
        gap: 4,
        width: '100%',
    },
    questionType: {
        ...typography.s1Regular,
        color: colors.textGrey,
    },
    questionText: {
        ...typography.p4SemiBold,
        color: colors.primaryDarkBlue,
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
    buttonDisabled: {
        borderColor: colors.lightGrey,
    },
    previousButtonText: {
        ...typography.p4SemiBold,
        color: colors.primaryBlue,
    },
    buttonTextDisabled: {
        color: colors.textGrey,
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

export default AutomotiveTestScreen;
