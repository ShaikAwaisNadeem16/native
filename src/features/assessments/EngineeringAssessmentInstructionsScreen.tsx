import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography } from '../../styles/theme';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { AssessmentService } from '../../api/assessment';
import AssessmentHeaderCard from './components/AssessmentHeaderCard';
import AssessmentInstructionsCard from './components/AssessmentInstructionsCard';
import AssessmentInstructionsFooter from './components/AssessmentInstructionsFooter';
import { CardSkeleton } from '../../components/common/SkeletonLoaders';
import { parseInstructionsFromHTML, InstructionItem } from './utils/htmlParser';
import { Bookmark } from 'lucide-react-native';
import TestQuestionTag from './components/TestQuestionTag';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'EngineeringAssessmentInstructions'>;

interface QuizData {
    shortName?: string;
    title?: string;
    description?: string;
    duration?: string;
    quizDetails?: any;
    section?: any;
    terms?: string;
    btntext?: string;
    questions?: string;
    html?: string;
    isXPShow?: boolean;
    eligible?: boolean;
    warnMsg?: string;
}


/**
 * Engineering Assessment Instructions Screen
 * Displays assessment header and instructions from API response
 */
const EngineeringAssessmentInstructionsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const [loading, setLoading] = useState(true);
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [aboutItems, setAboutItems] = useState<InstructionItem[]>([]);
    const [instructions, setInstructions] = useState<InstructionItem[]>([]);
    const [procedureItems, setProcedureItems] = useState<InstructionItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [agreementChecked, setAgreementChecked] = useState(false);
    const [startingQuiz, setStartingQuiz] = useState(false);

    // Extract lessonId (moodleCourseId) from route params
    const lessonId = route.params?.lessonId || route.params?.moodleCourseId;

    useEffect(() => {
        const fetchLessonContents = async () => {
            if (!lessonId) {
                setError('No lesson ID provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                console.log('========================================');
                console.log('[EngineeringAssessmentInstructions] ===== API CALL START =====');
                console.log('[EngineeringAssessmentInstructions] Fetching lesson contents for lessonId:', lessonId);
                console.log('[EngineeringAssessmentInstructions] Route params:', JSON.stringify(route.params, null, 2));

                // Use the new API endpoint /api/lms/lj/contents/lesson
                const response = await AssessmentService.getLessonContents(lessonId);

                console.log('========================================');
                console.log('[EngineeringAssessmentInstructions] ===== API RESPONSE RECEIVED =====');
                console.log('[EngineeringAssessmentInstructions] Full API Response:', JSON.stringify(response, null, 2));
                console.log('[EngineeringAssessmentInstructions] Response type:', typeof response);
                console.log('[EngineeringAssessmentInstructions] Response keys:', response ? Object.keys(response) : 'null/undefined');

                // Log individual fields from response
                if (response) {
                    console.log('[EngineeringAssessmentInstructions] shortName:', response.shortName);
                    console.log('[EngineeringAssessmentInstructions] title:', response.title);
                    console.log('[EngineeringAssessmentInstructions] description:', response.description);
                    console.log('[EngineeringAssessmentInstructions] duration:', response.duration);
                    console.log('[EngineeringAssessmentInstructions] questions:', response.questions);
                    console.log('[EngineeringAssessmentInstructions] btntext:', response.btntext);
                    console.log('[EngineeringAssessmentInstructions] terms:', response.terms);
                    console.log('[EngineeringAssessmentInstructions] html length:', response.html ? response.html.length : 'null/undefined');
                    console.log('[EngineeringAssessmentInstructions] html preview:', response.html ? response.html.substring(0, 200) + '...' : 'null/undefined');
                }

                // The new API returns data directly (not wrapped in quiz_data)
                if (response) {
                    // Map the response to quizData format
                    const quizData: QuizData = {
                        shortName: response.shortName,
                        title: response.title,
                        description: response.description,
                        duration: response.duration,
                        quizDetails: response.quizDetails,
                        section: response.section,
                        terms: response.terms,
                        btntext: response.btntext,
                        questions: response.questions,
                        html: response.html,
                    };
                    
                    console.log('========================================');
                    console.log('[EngineeringAssessmentInstructions] ===== QUIZ DATA MAPPED =====');
                    console.log('[EngineeringAssessmentInstructions] Mapped QuizData:', JSON.stringify(quizData, null, 2));
                    console.log('[EngineeringAssessmentInstructions] QuizData keys:', Object.keys(quizData));
                    
                    setQuizData(quizData);

                    // Parse HTML to extract instructions
                    if (response.html) {
                        console.log('[EngineeringAssessmentInstructions] Parsing HTML for instructions...');
                        const parsed = parseInstructionsFromHTML(response.html);
                        console.log('[EngineeringAssessmentInstructions] Parsed aboutItems:', parsed.aboutItems?.length || 0);
                        console.log('[EngineeringAssessmentInstructions] Parsed instructions:', parsed.instructions?.length || 0);
                        console.log('[EngineeringAssessmentInstructions] Parsed procedureItems:', parsed.procedureItems?.length || 0);
                        
                        setAboutItems(parsed.aboutItems || []);
                        setInstructions(parsed.instructions || []);
                        setProcedureItems(parsed.procedureItems || []);
                    } else {
                        console.log('[EngineeringAssessmentInstructions] No HTML found');
                    }
                    
                    console.log('========================================');
                    console.log('[EngineeringAssessmentInstructions] ===== STATE UPDATED =====');
                    console.log('[EngineeringAssessmentInstructions] Final aboutText:', aboutText || response.description);
                    console.log('[EngineeringAssessmentInstructions] Final instructions count:', instructions.length);
                    console.log('[EngineeringAssessmentInstructions] Button text will be: "Start Assessment" (hardcoded)');
                    console.log('========================================');
                } else {
                    console.error('[EngineeringAssessmentInstructions] ERROR: No data found in response');
                    setError('No data found in response');
                }
            } catch (err: any) {
                console.error('========================================');
                console.error('[EngineeringAssessmentInstructions] ===== ERROR OCCURRED =====');
                console.error('[EngineeringAssessmentInstructions] Error type:', typeof err);
                console.error('[EngineeringAssessmentInstructions] Error message:', err?.message);
                console.error('[EngineeringAssessmentInstructions] Error stack:', err?.stack);
                console.error('[EngineeringAssessmentInstructions] Error response:', err?.response ? JSON.stringify(err.response, null, 2) : 'No response');
                console.error('[EngineeringAssessmentInstructions] Error response data:', err?.response?.data ? JSON.stringify(err.response.data, null, 2) : 'No response data');
                console.error('[EngineeringAssessmentInstructions] Error response status:', err?.response?.status);
                console.error('[EngineeringAssessmentInstructions] Full error object:', JSON.stringify(err, null, 2));
                console.error('========================================');
                
                // Check if this is a STEM assessment (500 error might mean API doesn't support this lessonId)
                // Check lessonId pattern or route params to determine if it's STEM
                const isStemAssessment = lessonId?.includes('LID-A-0019') || 
                                        lessonId?.includes('STEM') ||
                                        route.params?.title?.toLowerCase().includes('stem');
                
                if (isStemAssessment && err?.response?.status === 500) {
                    console.log('[EngineeringAssessmentInstructions] Detected STEM assessment with 500 error, navigating to StemAssessmentInstructions');
                    // Navigate to STEM Assessment Instructions screen (doesn't require API)
                    navigation.replace('StemAssessmentInstructions');
                    return;
                }
                
                setError(err?.message || 'Failed to load assessment instructions');
                Alert.alert('Error', 'Failed to load assessment instructions. Please try again.');
            } finally {
                setLoading(false);
                console.log('[EngineeringAssessmentInstructions] Loading set to false');
            }
        };

        fetchLessonContents();
    }, [lessonId]);

    const handleStartAssessment = async () => {
        if (!agreementChecked) {
            Alert.alert('Required', 'Please read and agree to the terms before starting the assessment.');
            return;
        }
        console.log('========================================');
        console.log('[EngineeringAssessmentInstructions] ===== START ASSESSMENT BUTTON CLICKED =====');
        console.log('[EngineeringAssessmentInstructions] Current lessonId:', lessonId);
        console.log('[EngineeringAssessmentInstructions] Current quizData:', quizData ? JSON.stringify(quizData, null, 2) : 'null');
        console.log('[EngineeringAssessmentInstructions] Current aboutText:', aboutText);
        console.log('[EngineeringAssessmentInstructions] Current instructions count:', instructions.length);
        
        if (!lessonId) {
            console.error('[EngineeringAssessmentInstructions] ERROR: No lesson ID available');
            Alert.alert('Error', 'No lesson ID available');
            return;
        }

        try {
            setStartingQuiz(true);
            
            // Call API to start the quiz attempt
            console.log('========================================');
            console.log('[EngineeringAssessmentInstructions] ===== CALLING START QUIZ API =====');
            console.log('[EngineeringAssessmentInstructions] API: POST /api/lms/attempt/quiz');
            console.log('[EngineeringAssessmentInstructions] Payload:', JSON.stringify({
                lessonId,
                page: 'start',
            }, null, 2));

            const startQuizResponse = await AssessmentService.attemptQuiz({
                lessonId,
                page: 'start',
            });

            console.log('========================================');
            console.log('[EngineeringAssessmentInstructions] ===== START QUIZ API RESPONSE =====');
            console.log('[EngineeringAssessmentInstructions] Full API Response:', JSON.stringify(startQuizResponse, null, 2));
            console.log('[EngineeringAssessmentInstructions] Response type:', typeof startQuizResponse);
            console.log('[EngineeringAssessmentInstructions] Response keys:', startQuizResponse ? Object.keys(startQuizResponse) : 'null/undefined');

            // Log questionData structure
            if (startQuizResponse?.questionData) {
                console.log('[EngineeringAssessmentInstructions] QuestionData exists');
                console.log('[EngineeringAssessmentInstructions] QuestionData keys (sections):', Object.keys(startQuizResponse.questionData));
                console.log('[EngineeringAssessmentInstructions] QuestionData:', JSON.stringify(startQuizResponse.questionData, null, 2));
                
                // Log question counts per section
                Object.keys(startQuizResponse.questionData).forEach((section) => {
                    const questions = startQuizResponse.questionData[section];
                    console.log(`[EngineeringAssessmentInstructions] Section "${section}": ${Array.isArray(questions) ? questions.length : 0} questions`);
                });
            } else {
                console.warn('[EngineeringAssessmentInstructions] WARNING: questionData not found in response');
            }

            // Log attemptId and result
            if (startQuizResponse?.attemptId) {
                console.log('[EngineeringAssessmentInstructions] AttemptId:', startQuizResponse.attemptId);
            }
            if (startQuizResponse?.result) {
                console.log('[EngineeringAssessmentInstructions] Result:', JSON.stringify(startQuizResponse.result, null, 2));
            }

            // Navigate to Survey Assessment Questions screen with question data
            console.log('========================================');
            console.log('[EngineeringAssessmentInstructions] ===== NAVIGATING TO QUESTIONS SCREEN =====');
            console.log('[EngineeringAssessmentInstructions] Navigation params:');
            console.log('[EngineeringAssessmentInstructions] - lessonId:', lessonId);
            console.log('[EngineeringAssessmentInstructions] - moodleCourseId:', lessonId);
            console.log('[EngineeringAssessmentInstructions] - attemptId:', startQuizResponse?.attemptId);
            console.log('[EngineeringAssessmentInstructions] - questionData exists:', !!startQuizResponse?.questionData);
            console.log('[EngineeringAssessmentInstructions] - result exists:', !!startQuizResponse?.result);
            console.log('========================================');
            
            navigation.navigate('SurveyAssessmentQuestions', {
                lessonId,
                moodleCourseId: lessonId,
                attemptId: startQuizResponse?.attemptId,
                questionData: startQuizResponse?.questionData,
                quizResult: startQuizResponse?.result,
            });
        } catch (error: any) {
            console.error('========================================');
            console.error('[EngineeringAssessmentInstructions] ===== ERROR STARTING QUIZ =====');
            console.error('[EngineeringAssessmentInstructions] Error type:', typeof error);
            console.error('[EngineeringAssessmentInstructions] Error message:', error?.message);
            console.error('[EngineeringAssessmentInstructions] Error stack:', error?.stack);
            console.error('[EngineeringAssessmentInstructions] Error response:', error?.response ? JSON.stringify(error.response, null, 2) : 'No response');
            console.error('[EngineeringAssessmentInstructions] Error response data:', error?.response?.data ? JSON.stringify(error.response.data, null, 2) : 'No response data');
            console.error('[EngineeringAssessmentInstructions] Error response status:', error?.response?.status);
            console.error('[EngineeringAssessmentInstructions] Full error object:', JSON.stringify(error, null, 2));
            console.error('========================================');
            
            Alert.alert('Error', 'Failed to start assessment. Please try again.');
        } finally {
            setStartingQuiz(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <CardSkeleton />
                </ScrollView>
            </SafeAreaView>
        );
    }

    if (error || !quizData) {
        return (
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error || 'Failed to load assessment'}</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Format questions text
    const questionsText = quizData.questions || '';

    // Navigation items from the instructions
    const navigationItems = [
        {
            label: 'Previous',
            description: 'Click on this button to go to previous question',
            variant: 'outline' as const,
        },
        {
            label: 'Next',
            description: 'Save your response and move to the next question',
            variant: 'primary' as const,
        },
    ];

    // Legend items
    const legendItems = [
        {
            tag: <TestQuestionTag questionNo="1" state="Unanswered" />,
            label: 'Not Visited/Unanswered Question',
        },
        {
            tag: <TestQuestionTag questionNo="1" state="Selected" />,
            label: 'Current Question',
        },
        {
            tag: <TestQuestionTag questionNo="1" state="Answered" />,
            label: 'Answered Question',
        },
        {
            tag: <TestQuestionTag questionNo="1" state="Review Unanswered" />,
            label: 'Unanswered and Marked for Review',
        },
        {
            tag: <TestQuestionTag questionNo="1" state="Review Answered" />,
            label: 'Answered and Marked for Review',
        },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Blue Header Card */}
                <AssessmentHeaderCard
                    shortName={quizData.shortName || 'ASSESSMENT'}
                    title={quizData.title || 'Assessment'}
                    description={quizData.description || ''}
                    duration={quizData.duration}
                    questions={questionsText}
                    section={quizData.section}
                />

                {/* Instructions Card */}
                <View style={styles.instructionsContainer}>
                    <AssessmentInstructionsCard
                        aboutItems={aboutItems}
                        instructions={instructions}
                        procedureItems={procedureItems}
                        navigationItems={navigationItems}
                        legendItems={legendItems}
                    />
                </View>

                {/* Footer: Checkbox + Start Quiz Button */}
                <AssessmentInstructionsFooter
                    termsText={quizData.terms || 'I have read all the instructions carefully and have understood them. I agree not to cheat or use unfair means in this examination. I understand that using unfair means of any sort for my own or someone else\'s advantage will lead to my immediate disqualification. The decision of creamcollar.com will be final in these matters and cannot be appealed.'}
                    buttonLabel="Start Assessment"
                    checked={agreementChecked}
                    onCheckboxToggle={() => setAgreementChecked(!agreementChecked)}
                    onStartQuiz={handleStartAssessment}
                    loading={startingQuiz}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f9fc',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 24,
    },
    instructionsContainer: {
        padding: 16,
        width: '100%',
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

export default EngineeringAssessmentInstructionsScreen;

