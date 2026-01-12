import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Bookmark } from 'lucide-react-native';
import { colors, typography } from '../../styles/theme';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { AssessmentService } from '../../api/assessment';
import TestQuestionTag from './components/TestQuestionTag';
import AssessmentHeaderCard from './components/AssessmentHeaderCard';
import AssessmentInstructionsCard from './components/AssessmentInstructionsCard';
import AssessmentInstructionsFooter from './components/AssessmentInstructionsFooter';
import { CardSkeleton } from '../../components/common/SkeletonLoaders';
import Header from '../home/components/Header';
import BreadcrumbBar from './components/BreadcrumbBar';
import { parseInstructionsFromHTML, InstructionItem } from './utils/htmlParser';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'StemAssessmentInstructions'>;

interface QuizData {
    shortName?: string;
    title?: string;
    description?: string;
    duration?: string;
    quizDetails?: any;
    section?: string;
    terms?: string;
    btntext?: string;
    questions?: string;
    html?: string;
}


// StemAssessmentInstructionsScreen - Displays STEM Assessment instructions and test details
const StemAssessmentInstructionsScreen: React.FC = () => {
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

    // Extract lessonId from route params (for STEM assessment, it's LID-A-0019)
    const lessonId = route.params?.lessonId || 'LID-A-0019';

    useEffect(() => {
        const fetchStemLessonContents = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log('========================================');
                console.log('[StemAssessmentInstructions] ===== API CALL START =====');
                console.log('[StemAssessmentInstructions] Fetching STEM lesson contents for lessonId:', lessonId);

                // Use the STEM-specific API endpoint
                const response = await AssessmentService.getStemLessonContents(lessonId);

                console.log('========================================');
                console.log('[StemAssessmentInstructions] ===== API RESPONSE RECEIVED =====');
                console.log('[StemAssessmentInstructions] Full API Response:', JSON.stringify(response, null, 2));

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
                    
                    console.log('[StemAssessmentInstructions] Mapped QuizData:', JSON.stringify(quizData, null, 2));
                    
                    setQuizData(quizData);

                    // Parse HTML to extract instructions
                    if (response.html) {
                        console.log('[StemAssessmentInstructions] Parsing HTML for instructions...');
                        const parsed = parseInstructionsFromHTML(response.html);
                        console.log('[StemAssessmentInstructions] Parsed aboutItems:', parsed.aboutItems?.length || 0);
                        console.log('[StemAssessmentInstructions] Parsed instructions:', parsed.instructions?.length || 0);
                        console.log('[StemAssessmentInstructions] Parsed procedureItems:', parsed.procedureItems?.length || 0);
                        
                        setAboutItems(parsed.aboutItems || []);
                        setInstructions(parsed.instructions || []);
                        setProcedureItems(parsed.procedureItems || []);
                    } else {
                        console.log('[StemAssessmentInstructions] No HTML found');
                    }
                    
                    console.log('========================================');
                } else {
                    console.error('[StemAssessmentInstructions] ERROR: No data found in response');
                    setError('No data found in response');
                }
            } catch (err: any) {
                console.error('========================================');
                console.error('[StemAssessmentInstructions] ===== ERROR OCCURRED =====');
                console.error('[StemAssessmentInstructions] Error message:', err?.message);
                console.error('[StemAssessmentInstructions] Error response:', err?.response?.data);
                console.error('[StemAssessmentInstructions] Error status:', err?.response?.status);
                console.error('========================================');
                
                setError(err?.message || 'Failed to load assessment instructions');
                Alert.alert('Error', 'Failed to load assessment instructions. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchStemLessonContents();
    }, [lessonId]);

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    const handleStartAssessment = async () => {
        if (!agreementChecked) {
            Alert.alert('Required', 'Please read and agree to the terms before starting the assessment.');
            return;
        }

        if (!lessonId) {
            Alert.alert('Error', 'No lesson ID available');
            return;
        }

        try {
            setStartingQuiz(true);

            console.log('========================================');
            console.log('[StemAssessmentInstructions] ===== START ASSESSMENT BUTTON CLICKED =====');
            console.log('[StemAssessmentInstructions] Current lessonId:', lessonId);

            // Call API to start the quiz attempt
            console.log('========================================');
            console.log('[StemAssessmentInstructions] ===== CALLING START QUIZ API =====');
            console.log('[StemAssessmentInstructions] API: POST /api/lms/attempt/quiz');
            console.log('[StemAssessmentInstructions] Payload:', JSON.stringify({
                lessonId,
                page: 'start',
            }, null, 2));

            const startQuizResponse = await AssessmentService.attemptQuiz({
                lessonId,
                page: 'start',
            });

            console.log('========================================');
            console.log('[StemAssessmentInstructions] ===== START QUIZ API RESPONSE =====');
            console.log('[StemAssessmentInstructions] Full API Response:', JSON.stringify(startQuizResponse, null, 2));

            // Log questionData structure
            if (startQuizResponse?.questionData) {
                console.log('[StemAssessmentInstructions] QuestionData exists');
                console.log('[StemAssessmentInstructions] QuestionData keys (sections):', Object.keys(startQuizResponse.questionData));
                
                // Log question counts per section
                Object.keys(startQuizResponse.questionData).forEach((section) => {
                    const questions = startQuizResponse.questionData[section];
                    console.log(`[StemAssessmentInstructions] Section "${section}": ${Array.isArray(questions) ? questions.length : 0} questions`);
                });
            } else {
                console.warn('[StemAssessmentInstructions] WARNING: questionData not found in response');
            }

            // Log attemptId and result
            if (startQuizResponse?.attemptId) {
                console.log('[StemAssessmentInstructions] AttemptId:', startQuizResponse.attemptId);
            }
            if (startQuizResponse?.result) {
                console.log('[StemAssessmentInstructions] Result:', JSON.stringify(startQuizResponse.result, null, 2));
            }

            // Navigate to Survey Assessment Questions screen with question data
            console.log('========================================');
            console.log('[StemAssessmentInstructions] ===== NAVIGATING TO QUESTIONS SCREEN =====');
            console.log('[StemAssessmentInstructions] Navigation params:');
            console.log('[StemAssessmentInstructions] - lessonId:', lessonId);
            console.log('[StemAssessmentInstructions] - moodleCourseId:', lessonId);
            console.log('[StemAssessmentInstructions] - attemptId:', startQuizResponse?.attemptId);
            console.log('[StemAssessmentInstructions] - questionData exists:', !!startQuizResponse?.questionData);
            console.log('[StemAssessmentInstructions] - result exists:', !!startQuizResponse?.result);
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
            console.error('[StemAssessmentInstructions] ===== ERROR STARTING QUIZ =====');
            console.error('[StemAssessmentInstructions] Error message:', error?.message);
            console.error('[StemAssessmentInstructions] Error response:', error?.response?.data);
            console.error('[StemAssessmentInstructions] Error status:', error?.response?.status);
            console.error('========================================');
            
            Alert.alert('Error', 'Failed to start assessment. Please try again.');
        } finally {
            setStartingQuiz(false);
        }
    };

    const handleMarkForReview = () => {
        console.log('Mark for review pressed');
    };

    const handlePrevious = () => {
        console.log('Previous pressed');
    };

    const handleNext = () => {
        console.log('Next pressed');
    };

    const handleSubmitTest = () => {
        console.log('Submit test pressed');
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <Header 
                    onProfilePress={handleProfilePress} 
                    onLogoPress={() => navigation.navigate('Home')} 
                    useAssessmentLogo={true}
                />
                <BreadcrumbBar items={['Your Learning Journey', 'STEM Assessment']} />
                <CardSkeleton />
            </SafeAreaView>
        );
    }

    if (error || !quizData) {
        return (
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <Header 
                    onProfilePress={handleProfilePress} 
                    onLogoPress={() => navigation.navigate('Home')} 
                    useAssessmentLogo={true}
                />
                <BreadcrumbBar items={['Your Learning Journey', 'STEM Assessment']} />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error || 'Failed to load assessment'}</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Navigation items from the instructions
    const navigationItems = [
        {
            label: 'Mark For Review',
            description: 'Click on this button to mark a question and review it later',
            variant: 'link' as const,
            icon: <Bookmark size={24} color={colors.primaryBlue} />,
        },
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
        {
            label: 'Submit Test',
            description: 'Click on this button to submit your test once you\'ve reviewed all your answers',
            variant: 'outline' as const,
        },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Header 
                onProfilePress={handleProfilePress} 
                onLogoPress={() => navigation.navigate('Home')} 
                useAssessmentLogo={true}
            />
            <BreadcrumbBar items={['Your Learning Journey', 'STEM Assessment']} />
            
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Blue Header Card - Matches Figma design */}
                <AssessmentHeaderCard
                    shortName={quizData.shortName || 'ASSESSMENT'}
                    title={quizData.title || 'STEM Assessment'}
                    description={quizData.description || 'The intent of this awareness course is to help the students understand all that is needed to know about the industry in which they will work in the future and progress their career.'}
                    duration={quizData.duration}
                    questions={quizData.questions}
                    section={quizData.section}
                />

                {/* Instructions Card */}
                <View style={styles.instructionsContainer}>
                    <AssessmentInstructionsCard
                        aboutItems={aboutItems}
                        instructions={instructions}
                        procedureItems={procedureItems}
                        navigationItems={navigationItems}
                        legendItems={[
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
                        ]}
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

export default StemAssessmentInstructionsScreen;
