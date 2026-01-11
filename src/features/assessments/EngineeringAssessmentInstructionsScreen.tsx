import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, borderRadius } from '../../styles/theme';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { AssignmentService } from '../../api/assignment';
import AssessmentHeaderCard from './components/AssessmentHeaderCard';
import AssessmentInstructionsSection from './components/AssessmentInstructionsSection';
import { CardSkeleton } from '../../components/common/SkeletonLoaders';

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
}

interface LessonContentsResponse {
    quiz_data?: QuizData;
}

/**
 * Parses HTML content to extract instructions
 * Extracts "About The Assessment" and "Instructions" sections from HTML
 */
const parseInstructionsFromHTML = (html: string): {
    aboutText?: string;
    instructions: Array<{ text: string }>;
} => {
    if (!html) {
        return { instructions: [] };
    }

    const instructions: Array<{ text: string }> = [];
    let aboutText: string | undefined;

    try {
        // Extract "About The Assessment" section - match the pattern from the API response
        // Pattern: <div style="...">About The Assessment</div><p style="...">...</p>
        const aboutMatch = html.match(/<div[^>]*>About The Assessment<\/div>\s*<p[^>]*>([^<]+)<\/p>/i);
        if (aboutMatch && aboutMatch[1]) {
            aboutText = aboutMatch[1].trim();
        }

        // Extract "Instructions" section - find the section after "Instructions" heading
        // Pattern: <p style="...">Instructions</p><ul style="...">...</ul>
        const instructionsSectionMatch = html.match(/<p[^>]*>Instructions<\/p>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i);
        
        if (instructionsSectionMatch && instructionsSectionMatch[1]) {
            const instructionsHTML = instructionsSectionMatch[1];
            // Extract all <li> items from the instructions section
            const liMatches = instructionsHTML.matchAll(/<li[^>]*>([^<]+)<\/li>/gi);
            for (const match of liMatches) {
                if (match[1]) {
                    const text = match[1].trim();
                    if (text.length > 0) {
                        instructions.push({ text });
                    }
                }
            }
        } else {
            // Fallback: Extract all <li> tags from the entire HTML
            const liMatches = html.matchAll(/<li[^>]*>([^<]+)<\/li>/gi);
            for (const match of liMatches) {
                if (match[1]) {
                    const text = match[1].trim();
                    // Skip if it's part of "About The Assessment" section or empty
                    if (!text.toLowerCase().includes('about') && text.length > 0) {
                        instructions.push({ text });
                    }
                }
            }
        }

        // If still no instructions found, try alternative patterns
        if (instructions.length === 0) {
            // Try to find any list items that might be instructions
            const allLiMatches = html.matchAll(/<li[^>]*style[^>]*>([^<]+)<\/li>/gi);
            for (const match of allLiMatches) {
                if (match[1]) {
                    const text = match[1].trim();
                    if (text.length > 0 && !text.toLowerCase().includes('about')) {
                        instructions.push({ text });
                    }
                }
            }
        }
    } catch (error) {
        console.error('[EngineeringAssessmentInstructions] Error parsing HTML:', error);
    }

    return { aboutText, instructions };
};

/**
 * Engineering Assessment Instructions Screen
 * Displays assessment header and instructions from API response
 */
const EngineeringAssessmentInstructionsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const [loading, setLoading] = useState(true);
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [aboutText, setAboutText] = useState<string | undefined>();
    const [instructions, setInstructions] = useState<Array<{ text: string }>>([]);
    const [error, setError] = useState<string | null>(null);

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

                console.log('[EngineeringAssessmentInstructions] Fetching lesson contents for lessonId:', lessonId);

                const response: LessonContentsResponse = await AssignmentService.getLessonContents(lessonId);

                console.log('[EngineeringAssessmentInstructions] Response received:', JSON.stringify(response, null, 2));

                if (response.quiz_data) {
                    setQuizData(response.quiz_data);

                    // Parse HTML to extract instructions
                    if (response.quiz_data.html) {
                        const parsed = parseInstructionsFromHTML(response.quiz_data.html);
                        setAboutText(parsed.aboutText || response.quiz_data.description);
                        setInstructions(parsed.instructions);
                    } else {
                        // Fallback: use description as about text
                        setAboutText(response.quiz_data.description);
                    }
                } else {
                    setError('No quiz data found in response');
                }
            } catch (err: any) {
                console.error('[EngineeringAssessmentInstructions] Error fetching lesson contents:', err);
                setError(err?.message || 'Failed to load assessment instructions');
                Alert.alert('Error', 'Failed to load assessment instructions. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchLessonContents();
    }, [lessonId]);

    const handleStartAssessment = () => {
        if (!lessonId) {
            Alert.alert('Error', 'No lesson ID available');
            return;
        }

        // Navigate to Survey Assessment Questions screen
        console.log('[EngineeringAssessmentInstructions] Starting assessment with lessonId:', lessonId);
        navigation.navigate('SurveyAssessmentQuestions', {
            lessonId,
            moodleCourseId: lessonId,
        });
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
                />

                {/* Instructions Section */}
                <View style={styles.instructionsContainer}>
                    <AssessmentInstructionsSection
                        aboutText={aboutText || quizData.description}
                        instructions={instructions}
                        navigationItems={navigationItems}
                    />
                </View>

                {/* Start Assessment Button */}
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={handleStartAssessment}
                    activeOpacity={0.7}
                >
                    <Text style={styles.startButtonText}>
                        {quizData.btntext || 'Start Assessment'}
                    </Text>
                </TouchableOpacity>
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
    startButton: {
        backgroundColor: colors.primaryBlue,
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 16,
    },
    startButtonText: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: '600' as const,
        lineHeight: 20,
        color: colors.white,
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

