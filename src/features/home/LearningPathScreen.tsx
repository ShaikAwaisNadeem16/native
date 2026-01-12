import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { colors, typography } from '../../styles/theme';
import Header from './components/Header';
import BreadcrumbBar from '../assessments/components/BreadcrumbBar';
import {
    LearningPathCard,
    ModuleAccordion,
    ProgressWidget,
} from '../../components/learning-path';
import PrimaryButton from '../../components/SignUp/PrimaryButton';
import { HomeService } from '../../api/home';
import { CardSkeleton } from '../../components/common/SkeletonLoaders';
import { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'LearningPath'>;
type LearningPathRouteProp = RouteProp<RootStackParamList, 'LearningPath'>;

// Type definitions based on API response
interface Lesson {
    lessonId: string;
    type: string;
    name: string;
    isLocked: boolean;
    lessonType: string;
    sub: string;
    order: number;
    url: string;
    duration: string;
    category: string | null;
    globalOrder: number;
}

interface Module {
    unitId: string;
    order: number;
    skills: Record<string, any>;
    modules: number;
    summary: string;
    name: string;
    duration: string;
    durationInHrs: string;
    rawDuration: number;
    lessons: Lesson[];
    isLocked: boolean;
}

interface CourseViewResponse {
    id: string;
    name: string;
    type: string;
    summary: string;
    is_reviewed: boolean;
    lockLessons: boolean;
    learningJourney: boolean;
    duration: string;
    duartionInHr: string;
    module: Module[];
    noOfModules: number;
    skills: string[];
    can_review: boolean;
    resume1?: {
        lessonId: string;
        globalOrder: number;
        completedAt: string;
        lessonType: string;
        name: string;
    };
    resumeUrl: string;
    timeTaken: string;
    percent: number;
}

/**
 * LearningPathScreen - Screen component for displaying learning path details
 * Fetches course data from API and renders using reusable components
 */
const LearningPathScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<LearningPathRouteProp>();
    const { courseId } = route.params || {};

    const [loading, setLoading] = useState(true);
    const [courseData, setCourseData] = useState<CourseViewResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [expandedModuleIndex, setExpandedModuleIndex] = useState<number | null>(0); // First module expanded by default

    useEffect(() => {
        if (courseId) {
            fetchCourseView();
        } else {
            setError('Course ID is required');
            setLoading(false);
        }
    }, [courseId]);

    const fetchCourseView = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await HomeService.getCourseView(courseId);
            setCourseData(data);
        } catch (err: any) {
            console.error('[LearningPathScreen] Error fetching course view:', err);
            setError(err?.message || 'Failed to load course data');
        } finally {
            setLoading(false);
        }
    };

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    const handleLogoPress = () => {
        navigation.navigate('Home');
    };

    const handleResumeLearning = () => {
        if (courseData?.resume1) {
            // Navigate to the resume lesson
            const resumeLesson = courseData.resume1;
            // Determine navigation based on lesson type
            if (resumeLesson.lessonType === 'quiz' || resumeLesson.lessonType === 'nongraded') {
                // Navigate to quiz/assessment
                navigation.navigate('EngineeringAssessmentInstructions', {
                    lessonId: resumeLesson.lessonId,
                    moodleCourseId: courseId,
                });
            } else if (resumeLesson.lessonType === 'assignment') {
                // Navigate to assignment
                navigation.navigate('AssignmentInstructions', {
                    lessonId: resumeLesson.lessonId,
                    moodleCourseId: courseId,
                });
            } else {
                // Navigate to course details for video/article
                navigation.navigate('CourseDetails', {
                    courseId: resumeLesson.lessonId,
                    courseTitle: resumeLesson.name,
                });
            }
        }
    };

    const handleStartLearning = () => {
        // Navigate to "Different Players in Automotive Industry" screen
        // Check all modules to find the "Different Players" lesson
        if (courseData?.module && courseData.module.length > 0) {
            // Search for "Different Players in Automotive Industry" lesson
            let differentPlayersLesson: Lesson | null = null;
            
            for (const module of courseData.module) {
                if (module.lessons && module.lessons.length > 0) {
                    const foundLesson = module.lessons.find(
                        (lesson) => 
                            lesson.name.toLowerCase().includes('different players') ||
                            lesson.lessonId === 'LID-A-0096'
                    );
                    if (foundLesson) {
                        differentPlayersLesson = foundLesson;
                        break;
                    }
                }
            }
            
            // If found, navigate to ReadDifferentPlayers screen
            if (differentPlayersLesson) {
                console.log('[LearningPathScreen] Navigating to ReadDifferentPlayers for lesson:', differentPlayersLesson.name);
                navigation.navigate('ReadDifferentPlayers');
                return;
            }
            
            // Fallback: Navigate to the first lesson of the first module
            const firstModule = courseData.module[0];
            if (firstModule.lessons && firstModule.lessons.length > 0) {
                const firstLesson = firstModule.lessons[0];
                // Determine navigation based on lesson type
                if (firstLesson.lessonType === 'quiz' || firstLesson.lessonType === 'nongraded' || firstLesson.lessonType === 'graded') {
                    navigation.navigate('EngineeringAssessmentInstructions', {
                        lessonId: firstLesson.lessonId,
                        moodleCourseId: courseId,
                    });
                } else if (firstLesson.lessonType === 'assignment') {
                    navigation.navigate('AssignmentInstructions', {
                        lessonId: firstLesson.lessonId,
                        moodleCourseId: courseId,
                    });
                } else if (firstLesson.lessonType === 'video' || firstLesson.type === 'videoPage') {
                    // For video lessons, check if it's "Different Players"
                    if (firstLesson.name.toLowerCase().includes('different players')) {
                        navigation.navigate('ReadDifferentPlayers');
                    } else {
                        navigation.navigate('CourseDetails', {
                            courseId: firstLesson.lessonId,
                            courseTitle: firstLesson.name,
                        });
                    }
                } else {
                    navigation.navigate('CourseDetails', {
                        courseId: firstLesson.lessonId,
                        courseTitle: firstLesson.name,
                    });
                }
            }
        }
    };

    // Transform lesson type to display format
    const getLessonTypeDisplay = (lessonType: string, type: string): string => {
        if (lessonType === 'video' || type === 'videoPage') return 'Video';
        if (lessonType === 'article' || type === 'article') return 'Read';
        if (lessonType === 'quiz' || lessonType === 'nongraded' || lessonType === 'graded' || type === 'quiz') return 'Quiz';
        if (lessonType === 'assignment' || type === 'assign') return 'Assignment';
        return 'Lesson';
    };

    // Transform modules data for ModuleAccordion
    const transformModules = (modules: Module[]) => {
        return modules.map((module) => ({
            title: module.name, // Unit name as accordion heading
            description: module.summary, // Summary as description
            duration: module.duration,
            lessons: module.lessons.map((lesson) => ({
                title: lesson.name, // Lesson name as heading
                sub: lesson.sub, // Sub as description (e.g., "Graded Quiz 2 hours", "Video 5 mins")
                type: getLessonTypeDisplay(lesson.lessonType, lesson.type),
                duration: lesson.duration,
                lessonId: lesson.lessonId, // Lesson ID for navigation
            })),
        }));
    };

    const handleModulePress = (moduleIndex: number) => {
        // If the clicked module is already expanded, close it. Otherwise, expand it and close others.
        setExpandedModuleIndex(expandedModuleIndex === moduleIndex ? null : moduleIndex);
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header
                    onProfilePress={handleProfilePress}
                    onLogoPress={handleLogoPress}
                />
                <BreadcrumbBar items={['Your Learning Journey', 'Learning Path']} />
                <View style={styles.content}>
                    <CardSkeleton />
                </View>
            </SafeAreaView>
        );
    }

    if (error || !courseData) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header
                    onProfilePress={handleProfilePress}
                    onLogoPress={handleLogoPress}
                />
                <BreadcrumbBar items={['Your Learning Journey', 'Learning Path']} />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        {error || 'Failed to load course data'}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header
                onProfilePress={handleProfilePress}
                onLogoPress={handleLogoPress}
            />
            <BreadcrumbBar
                items={['Your Learning Journey', courseData.name || 'Learning Path']}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Progress Widget */}
                <View style={styles.progressWidgetContainer}>
                    <ProgressWidget progressPercentage={courseData.percent || 0} />
                    <PrimaryButton
                        label="Resume Learning"
                        onPress={handleResumeLearning}
                    />
                </View>

                {/* Learning Path Card */}
                <LearningPathCard
                    subtitle="LEARNING PATH"
                    title={courseData.name}
                    description={courseData.summary}
                    skills={courseData.skills || []}
                    modulesCount={`${courseData.noOfModules || 0} Modules`}
                    level="Beginner" // This should come from API if available
                    duration={courseData.duration}
                    onStartLearningPress={handleStartLearning}
                />

                {/* Learning Path Journey Section */}
                <View style={styles.journeySection}>
                    <Text style={styles.journeyTitle}>Learning Path Journey</Text>
                    <View style={styles.modulesContainer}>
                        {courseData.module && courseData.module.length > 0 ? (
                            transformModules(courseData.module).map((module, index) => (
                                <ModuleAccordion
                                    key={module.title || index}
                                    title={module.title}
                                    description={module.description}
                                    duration={module.duration}
                                    lessons={module.lessons}
                                    isExpanded={expandedModuleIndex === index}
                                    onPress={() => handleModulePress(index)}
                                />
                            ))
                        ) : (
                            <Text style={styles.emptyText}>No modules available</Text>
                        )}
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 32,
        gap: 24,
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    progressWidgetContainer: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: 12,
        padding: 16,
        gap: 20,
        shadowColor: '#092C4C',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.08,
        shadowRadius: 40,
        elevation: 8,
    },
    journeySection: {
        flexDirection: 'column',
        gap: 24,
    },
    journeyTitle: {
        ...typography.p2Bold,
        color: colors.primaryDarkBlue,
    },
    modulesContainer: {
        flexDirection: 'column',
        gap: 16,
    },
    errorContainer: {
        padding: 24,
        alignItems: 'center',
    },
    errorText: {
        ...typography.p4,
        color: colors.error,
    },
    emptyText: {
        ...typography.p4,
        color: colors.textGrey,
        textAlign: 'center',
        padding: 24,
    },
});

export default LearningPathScreen;

