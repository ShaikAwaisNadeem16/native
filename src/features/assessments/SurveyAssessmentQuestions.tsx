import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Bookmark } from 'lucide-react-native';
import { colors, typography, borderRadius } from '../../styles/theme';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { AssessmentService } from '../../api/assessment';
import TimerProgress from './components/TimerProgress';
import TestQuestionTag from './components/TestQuestionTag';
import AnswerOption from './components/AnswerOption';
import PrimaryButton from '../../components/SignUp/PrimaryButton';
import SecondaryButton from '../../components/SignUp/SecondaryButton';
import SubmitTestConfirmationModal from './components/SubmitTestConfirmationModal';
import DownwardArrow from '../../components/common/DownwardArrow';
import { CardSkeleton } from '../../components/common/SkeletonLoaders';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'SurveyAssessmentQuestions'>;

interface Question {
    questionId: string;
    questionText: string;
    questionType?: string;
    type?: string;
    choices?: string[];
    page?: number;
    slot?: number;
    status?: string;
    maxMark?: number;
}

/**
 * SurveyAssessmentQuestions Screen
 * Displays assessment questions with multiple choice options
 * Matches Figma design: node-id=7875-74126
 */
const SurveyAssessmentQuestions: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
    const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
    const [skippedQuestions, setSkippedQuestions] = useState<Set<string>>(new Set());
    const [attemptId, setAttemptId] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMenuExpanded, setIsMenuExpanded] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState('02:00:00'); // Format: "HH:MM:SS"
    const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0); // Total seconds remaining
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [totalDurationSeconds, setTotalDurationSeconds] = useState(0); // Total duration in seconds
    
    // Ref for ScrollView to scroll to top when question changes
    const scrollViewRef = useRef<ScrollView>(null);

    // Extract lessonId (moodleCourseId) and questionData from route params
    const lessonId = route.params?.lessonId || route.params?.moodleCourseId;
    const routeAttemptId = route.params?.attemptId;
    const routeQuestionData = route.params?.questionData;

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

                console.log('========================================');
                console.log('[SurveyAssessmentQuestions] ===== INITIALIZING QUESTIONS =====');
                console.log('[SurveyAssessmentQuestions] Route params:', JSON.stringify(route.params, null, 2));
                console.log('[SurveyAssessmentQuestions] LessonId:', lessonId);
                console.log('[SurveyAssessmentQuestions] Route attemptId:', routeAttemptId);
                console.log('[SurveyAssessmentQuestions] Route questionData exists:', !!routeQuestionData);

                // Always call the start API to get questions (even if route params exist)
                // This ensures we always have the latest question data from the API
                console.log('[SurveyAssessmentQuestions] Calling start API to get questions');
                
                // Use attemptId from route params if available
                let response;
                if (routeAttemptId) {
                    console.log('[SurveyAssessmentQuestions] AttemptId from route params:', routeAttemptId);
                    response = await AssessmentService.attemptQuiz({
                        page: 'start',
                        lessonId: lessonId,
                        attemptId: routeAttemptId,
                    });
                } else {
                    response = await AssessmentService.attemptQuiz({
                        page: 'start',
                        lessonId: lessonId,
                    });
                }

                console.log('[SurveyAssessmentQuestions] Start API Response received:', JSON.stringify(response, null, 2));

                // Extract start time and duration from API response
                if (response.result?.attempt?.startTime) {
                    const startTimeStr = response.result.attempt.startTime;
                    setStartTime(new Date(startTimeStr));
                    console.log('[SurveyAssessmentQuestions] Start time from API:', startTimeStr);
                } else {
                    // If no start time in API, use current time
                    setStartTime(new Date());
                    console.log('[SurveyAssessmentQuestions] No start time in API, using current time');
                }

                // Parse duration from API response (format: "1 Hour 30 Mins" or "90 Minutes" or seconds)
                let durationSeconds = 0;
                if (response.result?.attempt?.duration) {
                    // If duration is in seconds or minutes
                    durationSeconds = parseInt(response.result.attempt.duration) || 0;
                    // If it's less than 100, assume it's in minutes, convert to seconds
                    if (durationSeconds < 100) {
                        durationSeconds = durationSeconds * 60;
                    }
                } else if (response.duration) {
                    // Parse duration string like "1 Hour 30 Mins" or "90 Minutes"
                    const durationStr = response.duration.toLowerCase();
                    const hoursMatch = durationStr.match(/(\d+)\s*hour/i);
                    const minsMatch = durationStr.match(/(\d+)\s*min/i);
                    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
                    const mins = minsMatch ? parseInt(minsMatch[1]) : 0;
                    durationSeconds = (hours * 3600) + (mins * 60);
                    console.log('[SurveyAssessmentQuestions] Parsed duration:', hours, 'hours', mins, 'minutes =', durationSeconds, 'seconds');
                } else {
                    // Default to 2 hours if not provided
                    durationSeconds = 2 * 3600;
                    console.log('[SurveyAssessmentQuestions] No duration in API, using default 2 hours');
                }
                setTotalDurationSeconds(durationSeconds);

                if (response.questionData) {
                    // Handle questionData structure (organized by sections)
                    console.log('[SurveyAssessmentQuestions] Processing questionData structure');
                    const allQuestions: Question[] = [];
                    Object.keys(response.questionData).forEach((section) => {
                        const sectionQuestions = response.questionData[section];
                        if (Array.isArray(sectionQuestions)) {
                            sectionQuestions.forEach((q: any) => {
                                allQuestions.push({
                                    questionId: q.questionId,
                                    questionText: q.questionText,
                                    questionType: q.type || 'mcq',
                                    type: q.type || 'mcq',
                                    choices: q.choices || [],
                                    page: q.page,
                                    slot: q.slot,
                                    status: q.status || 'notStarted',
                                    maxMark: q.maxMark,
                                });
                            });
                        }
                    });
                    // Sort by page number if available
                    allQuestions.sort((a, b) => (a.page || 0) - (b.page || 0));
                    setQuestions(allQuestions);
                    setAttemptId(response.attemptId || null);
                    setCurrentQuestionIndex(0);
                } else {
                    setError('No questions found in response');
                }
                console.log('========================================');
            } catch (err: any) {
                console.error('[SurveyAssessmentQuestions] Error fetching questions:', err);
                setError(err?.message || 'Failed to load questions');
                Alert.alert('Error', 'Failed to load assessment questions. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [lessonId, routeAttemptId, routeQuestionData]);

    // Timer countdown effect
    useEffect(() => {
        if (!startTime || totalDurationSeconds === 0) {
            return;
        }

        const updateTimer = () => {
            const now = new Date();
            const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
            const remainingSeconds = Math.max(0, totalDurationSeconds - elapsedSeconds);

            setTimeRemainingSeconds(remainingSeconds);

            // Format time as HH:MM:SS
            const hours = Math.floor(remainingSeconds / 3600);
            const minutes = Math.floor((remainingSeconds % 3600) / 60);
            const seconds = remainingSeconds % 60;
            const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            setTimeRemaining(formattedTime);

            // Auto-submit when time runs out
            if (remainingSeconds === 0 && !isSubmitting && attemptId && lessonId) {
                console.log('[SurveyAssessmentQuestions] Time is up! Auto-submitting assessment...');
                handleConfirmSubmit();
            }
        };

        // Update immediately
        updateTimer();

        // Update every second
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [startTime, totalDurationSeconds, isSubmitting, attemptId, lessonId]);

    // Get current question
    const currentQuestion = questions[currentQuestionIndex] || null;
    
    // Scroll to top when question changes
    useEffect(() => {
        if (scrollViewRef.current && questions.length > 0) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    }, [currentQuestionIndex, questions.length]);

    // Determine question states for tags
    const questionStates = useMemo(() => {
        return questions.map((q, index) => {
            const isSelected = index === currentQuestionIndex;
            const isAnswered = !!selectedAnswers[q.questionId];
            const isMarked = markedForReview.has(q.questionId);
            
            if (isSelected) {
                return 'Selected';
            }
            if (isMarked && !isAnswered) {
                return 'Review Unanswered';
            }
            if (isMarked && isAnswered) {
                return 'Review Answered';
            }
            if (isAnswered) {
                return 'Answered';
            }
            return 'Unanswered';
        });
    }, [questions, currentQuestionIndex, selectedAnswers, markedForReview]);

    // Calculate unanswered and review-marked question counts
    const unansweredCount = useMemo(() => {
        return questionStates.filter(state => state === 'Unanswered').length;
    }, [questionStates]);

    const reviewMarkedCount = useMemo(() => {
        return questionStates.filter(state => 
            state === 'Review Unanswered' || state === 'Review Answered'
        ).length;
    }, [questionStates]);

    const handleAnswerSelect = (optionNumber: string) => {
        if (!currentQuestion) return;
        const questionId = currentQuestion.questionId;
        
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: optionNumber,
        }));
        
        // Remove from skipped when answer is selected
        setSkippedQuestions((prev) => {
            const newSet = new Set(prev);
            newSet.delete(questionId);
            return newSet;
        });
    };

    const handleMarkForReview = async () => {
        if (!currentQuestion || !attemptId || !lessonId) return;
        
        const questionId = currentQuestion.questionId;
        const isCurrentlyMarked = markedForReview.has(questionId);
        const hasAnswer = !!selectedAnswers[questionId];
        
        // Toggle mark for review state
        setMarkedForReview((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(questionId)) {
                newSet.delete(questionId);
            } else {
                newSet.add(questionId);
            }
            return newSet;
        });
        
        // Call API to submit the mark for review status
        try {
            const chosenAnswer = hasAnswer ? [selectedAnswers[questionId]] : [];
            const status = !isCurrentlyMarked 
                ? 'toReview' 
                : (hasAnswer ? 'submitted' : 'notSubmitted');

            console.log('[SurveyAssessmentQuestions] Marking question for review - API call');
            console.log('[SurveyAssessmentQuestions] QuestionId:', questionId);
            console.log('[SurveyAssessmentQuestions] IsMarked:', !isCurrentlyMarked);
            console.log('[SurveyAssessmentQuestions] Payload:', JSON.stringify({
                page: 'question-submit',
                lessonId: lessonId,
                attemptId: attemptId,
                questionId: questionId,
                chosenAnswer: chosenAnswer,
                status: status,
            }, null, 2));

            await AssessmentService.attemptQuiz({
                page: 'question-submit',
                lessonId: lessonId,
                attemptId: attemptId,
                questionId: questionId,
                chosenAnswer: chosenAnswer,
                status: status,
            });

            console.log('[SurveyAssessmentQuestions] Question marked for review successfully');
        } catch (err: any) {
            console.error('[SurveyAssessmentQuestions] Error marking question for review:', err);
            // Revert the state change on error
            setMarkedForReview((prev) => {
                const newSet = new Set(prev);
                if (isCurrentlyMarked) {
                    newSet.add(questionId);
                } else {
                    newSet.delete(questionId);
                }
                return newSet;
            });
            Alert.alert('Error', 'Failed to mark question for review. Please try again.');
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0 && questions.length > 0) {
            const newIndex = currentQuestionIndex - 1;
            setCurrentQuestionIndex(newIndex);
            console.log('[SurveyAssessmentQuestions] Navigated to previous question. Index:', newIndex, 'QuestionId:', questions[newIndex]?.questionId);
        }
    };

    const handleNext = async () => {
        if (!attemptId || !lessonId || !currentQuestion) {
            Alert.alert('Error', 'Missing attempt ID or lesson ID');
            return;
        }

        try {
            const questionId = currentQuestion.questionId;
            const hasAnswer = !!selectedAnswers[questionId];
            
            // If no answer selected, mark as skipped
            if (!hasAnswer) {
                setSkippedQuestions((prev) => new Set(prev).add(questionId));
            } else {
                // Remove from skipped if answered
                setSkippedQuestions((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(questionId);
                    return newSet;
                });
            }

            // Submit current answer
            // Based on API spec: {page: "question-submit", attemptId, questionId, chosenAnswer, status}
            const chosenAnswer = hasAnswer ? [selectedAnswers[questionId]] : [];
            const status = hasAnswer 
                ? (markedForReview.has(questionId) ? 'toReview' : 'submitted')
                : (markedForReview.has(questionId) ? 'toReview' : 'notSubmitted');

            console.log('[SurveyAssessmentQuestions] Submitting answer via API');
            console.log('[SurveyAssessmentQuestions] QuestionId:', questionId);
            console.log('[SurveyAssessmentQuestions] AttemptId:', attemptId);
            console.log('[SurveyAssessmentQuestions] ChosenAnswer:', chosenAnswer);
            console.log('[SurveyAssessmentQuestions] Status:', status);

            await AssessmentService.attemptQuiz({
                page: 'question-submit',
                lessonId: lessonId,
                attemptId: attemptId,
                questionId: questionId,
                chosenAnswer: chosenAnswer,
                status: status,
            });

            // Move to next question
            if (currentQuestionIndex < questions.length - 1) {
                const newIndex = currentQuestionIndex + 1;
                setCurrentQuestionIndex(newIndex);
                console.log('[SurveyAssessmentQuestions] Navigated to next question. Index:', newIndex);
            } else {
                // Last question - show submit confirmation
                console.log('[SurveyAssessmentQuestions] Last question reached. Showing submit modal.');
                setShowSubmitModal(true);
            }
        } catch (err: any) {
            console.error('[SurveyAssessmentQuestions] Error submitting answer:', err);
            Alert.alert('Error', 'Failed to submit answer. Please try again.');
        }
    };

    const handleSubmitTest = () => {
        // Check if there are unanswered or review-marked questions
        if (unansweredCount > 0 || reviewMarkedCount > 0) {
            setShowSubmitModal(true);
        } else {
            handleConfirmSubmit();
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

            // Build qdata array from all questions with their answers
            const qdata = questions.map((q) => {
                const answer = selectedAnswers[q.questionId];
                const isMarked = markedForReview.has(q.questionId);
                return {
                    questionId: q.questionId,
                    chosenAnswer: answer ? [answer] : [],
                    status: answer 
                        ? (isMarked ? 'toReview' : 'submitted')
                        : (isMarked ? 'toReview' : 'notSubmitted'),
                };
            });

            console.log('========================================');
            console.log('[SurveyAssessmentQuestions] ===== CALLING QUIZ SUBMIT API =====');
            console.log('[SurveyAssessmentQuestions] API: POST /api/lms/attempt/quiz');
            console.log('[SurveyAssessmentQuestions] Payload:', JSON.stringify({
                attemptId,
                page: 'quiz-submit',
                lessonId,
                qdata,
            }, null, 2));

            const response = await AssessmentService.attemptQuiz({
                page: 'quiz-submit',
                lessonId: lessonId,
                attemptId: attemptId,
                qdata: qdata,
            });

            console.log('[SurveyAssessmentQuestions] ===== QUIZ SUBMIT API RESPONSE =====');
            console.log('[SurveyAssessmentQuestions] Full API Response:', JSON.stringify(response, null, 2));
            console.log('========================================');

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
            Alert.alert('Error', 'Failed to submit assessment. Please try again.');
        }
    };

    const handleCancelSubmit = () => {
        setShowSubmitModal(false);
    };

    // Timer countdown effect
    useEffect(() => {
        if (!startTime || totalDurationSeconds === 0) {
            return;
        }

        const updateTimer = () => {
            const now = new Date();
            const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
            const remainingSeconds = Math.max(0, totalDurationSeconds - elapsedSeconds);

            setTimeRemainingSeconds(remainingSeconds);

            // Format time as HH:MM:SS
            const hours = Math.floor(remainingSeconds / 3600);
            const minutes = Math.floor((remainingSeconds % 3600) / 60);
            const seconds = remainingSeconds % 60;
            const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            setTimeRemaining(formattedTime);

            // Auto-submit when time runs out
            if (remainingSeconds === 0 && !isSubmitting && attemptId && lessonId) {
                console.log('[SurveyAssessmentQuestions] Time is up! Auto-submitting assessment...');
                handleConfirmSubmit();
            }
        };

        // Update immediately
        updateTimer();

        // Update every second
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [startTime, totalDurationSeconds, isSubmitting, attemptId, lessonId]);

    const handleQuestionTagPress = (index: number) => {
        if (index >= 0 && index < questions.length) {
            setCurrentQuestionIndex(index);
            console.log('[SurveyAssessmentQuestions] Navigated to question via tag. Index:', index);
        }
    };

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
            {/* Top Navigation */}
            <View style={styles.topNavigation}>
                {/* Timer and Time Info */}
                <View style={styles.timerSection}>
                    <TimerProgress
                        timeRemaining={timeRemaining}
                        timeLabel="TIME REMAINING: PART 1"
                        percentage={totalDurationSeconds > 0 ? (timeRemainingSeconds / totalDurationSeconds) * 100 : 100}
                    />
                </View>

                {/* Collapsible Menu Widget */}
                {isMenuExpanded && (
                    <View style={styles.menuWidget}>
                        {/* Mark For Review Button */}
                        <TouchableOpacity
                            style={styles.markForReviewButton}
                            onPress={handleMarkForReview}
                            activeOpacity={0.7}
                        >
                            <Bookmark 
                                size={24} 
                                color={markedForReview.has(currentQuestion?.questionId || '') 
                                    ? colors.primaryBlue 
                                    : colors.primaryBlue} 
                            />
                            <Text style={styles.markForReviewText}>Mark For Review</Text>
                        </TouchableOpacity>

                        {/* Assessment Info */}
                        <View style={styles.assessmentInfo}>
                            <Text style={styles.assessmentSubtitle}>STEM ASSESSMENT</Text>
                            <Text style={styles.assessmentTitle}>Part 1 of 4: Science</Text>
                        </View>

                        {/* Question Tags */}
                        <View style={styles.questionTagsContainer}>
                            {questions.map((q, index) => (
                                <TouchableOpacity
                                    key={q.questionId}
                                    onPress={() => handleQuestionTagPress(index)}
                                    activeOpacity={0.7}
                                >
                                    <TestQuestionTag
                                        questionNo={String(index + 1)}
                                        state={questionStates[index] as any}
                                        size={36}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Submit Test Button */}
                        <TouchableOpacity
                            style={styles.submitTestButton}
                            onPress={handleSubmitTest}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.submitTestButtonText}>Submit Test</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Menu Toggle Button */}
                <TouchableOpacity
                    style={styles.menuToggle}
                    onPress={() => setIsMenuExpanded(!isMenuExpanded)}
                    activeOpacity={0.7}
                >
                    <DownwardArrow size={24} />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {currentQuestion ? (
                    <View 
                        key={currentQuestion.questionId} 
                        style={[
                            styles.questionContainer,
                            markedForReview.has(currentQuestion.questionId) && styles.questionContainerMarkedForReview
                        ]}
                    >
                        {/* Question Type and Text */}
                        <View style={styles.questionHeader}>
                            <Text style={styles.questionType}>
                                {currentQuestion.questionType?.toUpperCase() || 
                                 currentQuestion.type?.toUpperCase() || 
                                 'PASSAGE SINGLE CHOICE QUESTION'}
                            </Text>
                            <Text style={styles.questionText}>
                                {currentQuestion.questionText}
                            </Text>
                        </View>

                        {/* Answer Options */}
                        <View style={styles.optionsContainer}>
                            {currentQuestion.choices && currentQuestion.choices.length > 0 ? (
                                currentQuestion.choices.map((choice, index) => {
                                    const optionNumber = String(index + 1);
                                    const isSelected = selectedAnswers[currentQuestion.questionId] === optionNumber;
                                    
                                    // Determine the state of the question
                                    const questionId = currentQuestion.questionId;
                                    const isQuestionAnswered = !!selectedAnswers[questionId];
                                    const isQuestionSkipped = skippedQuestions.has(questionId);
                                    
                                    // Determine option state
                                    let optionState: 'attempted' | 'notAttempted' | 'skipped' = 'notAttempted';
                                    if (isQuestionSkipped) {
                                        optionState = 'skipped';
                                    } else if (isQuestionAnswered) {
                                        optionState = 'attempted';
                                    }
                                    
                                    return (
                                        <AnswerOption
                                            key={`${currentQuestion.questionId}-${index}`}
                                            optionText={choice}
                                            optionNumber={optionNumber}
                                            isSelected={isSelected}
                                            state={optionState}
                                            onPress={() => handleAnswerSelect(optionNumber)}
                                        />
                                    );
                                })
                            ) : (
                                <Text style={styles.noChoicesText}>No answer options available</Text>
                            )}
                        </View>
                    </View>
                ) : (
                    <View style={styles.noQuestionContainer}>
                        <Text style={styles.noQuestionText}>No question available</Text>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNavigation}>
                <View style={styles.buttonContainer}>
                    <SecondaryButton
                        label="Previous"
                        onPress={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <PrimaryButton
                        label={currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
                        onPress={currentQuestionIndex === questions.length - 1 ? handleSubmitTest : handleNext}
                    />
                </View>
            </View>

            {/* Submit Confirmation Modal */}
            <SubmitTestConfirmationModal
                visible={showSubmitModal}
                unansweredCount={unansweredCount}
                reviewMarkedCount={reviewMarkedCount}
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
    topNavigation: {
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey,
    },
    timerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        gap: 16,
    },
    menuWidget: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        padding: 16,
        gap: 20,
    },
    markForReviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    markForReviewText: {
        ...typography.p4,
        color: colors.primaryBlue,
    },
    assessmentInfo: {
        gap: 4,
    },
    assessmentSubtitle: {
        ...typography.s1Regular,
        color: colors.textGrey,
    },
    assessmentTitle: {
        ...typography.p3Bold,
        color: colors.primaryDarkBlue,
    },
    questionTagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    submitTestButton: {
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 140,
    },
    submitTestButtonText: {
        ...typography.p4SemiBold,
        color: colors.primaryBlue,
    },
    menuToggle: {
        width: 81,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    questionContainer: {
        gap: 24,
        backgroundColor: colors.white,
        borderRadius: borderRadius.card,
        padding: 16,
    },
    questionContainerMarkedForReview: {
        backgroundColor: '#FFF4E6', // Light orange background when marked for review
        borderWidth: 1,
        borderColor: colors.reviewOrange,
    },
    questionHeader: {
        gap: 4,
    },
    questionType: {
        ...typography.s1Regular,
        color: colors.textGrey,
    },
    questionText: {
        ...typography.p4SemiBold,
        color: colors.primaryDarkBlue,
    },
    optionsContainer: {
        gap: 16,
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
    buttonContainer: {
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
    noQuestionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    noQuestionText: {
        ...typography.p3Regular,
        color: colors.textGrey,
        textAlign: 'center',
    },
    noChoicesText: {
        ...typography.p4,
        color: colors.textGrey,
        textAlign: 'center',
        padding: 16,
    },
});

export default SurveyAssessmentQuestions;
