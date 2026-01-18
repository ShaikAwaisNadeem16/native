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
import useCourseStore from '../../store/useCourseStore';
import { CardSkeleton } from '../../components/common/SkeletonLoaders';
import { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'LearningPath'>;
type LearningPathRouteProp = RouteProp<RootStackParamList, 'LearningPath'>;

// Import types from course store
import type { Lesson, Module, CourseViewResponse } from '../../store/useCourseStore';

/**
 * LearningPathScreen - Screen component for displaying learning path details
 * Fetches course data from API and renders using reusable components
 */
const LearningPathScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<LearningPathRouteProp>();
    const { courseId } = route.params || {};

    // Use course store as single source of truth
    const { courseData, loading, error, fetchCourseView } = useCourseStore();
    const [expandedModuleIndices, setExpandedModuleIndices] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (courseId) {
            console.log('[LearningPathScreen] ===== FETCHING COURSE VIEW =====');
            console.log('[LearningPathScreen] CourseId from route params:', courseId);
            console.log('[LearningPathScreen] CourseId type:', typeof courseId);
            fetchCourseView(courseId);
        } else {
            console.warn('[LearningPathScreen] No courseId provided in route params');
        }
    }, [courseId, fetchCourseView]);

    // Auto-expand ALL modules on load and console log the data
    useEffect(() => {
        if (courseData?.module) {
            console.log('[LearningPathScreen] ===== COURSE DATA =====');
            console.log('[LearningPathScreen] Full course data:', JSON.stringify(courseData, null, 2));
            console.log('[LearningPathScreen] Number of modules:', courseData.module.length);

            // Expand all modules (both locked and unlocked)
            const allIndices = new Set<number>();
            courseData.module.forEach((module, index) => {
                allIndices.add(index);
                console.log(`[LearningPathScreen] Module ${index + 1}:`, {
                    name: module.name,
                    isLocked: module.isLocked,
                    lessonsCount: module.lessons?.length || 0,
                    lessons: module.lessons?.map(l => ({
                        name: l.name,
                        lessonId: l.lessonId,
                        isLocked: l.isLocked,
                        lessonType: l.lessonType,
                    })),
                });
            });
            setExpandedModuleIndices(allIndices);
            console.log('[LearningPathScreen] All modules expanded:', Array.from(allIndices));
        }
    }, [courseData]);

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    const handleLogoPress = () => {
        navigation.navigate('Home');
    };

    const handleResumeLearning = () => {
        if (!courseData) return;

        // Use resume1 from API if available
        if (courseData.resume1) {
            const resumeLesson = courseData.resume1;
            navigateToLesson(resumeLesson.lessonId, resumeLesson.lessonType, resumeLesson.name, courseId!);
            return;
        }

        // Fallback: Use resumeUrl if available
        if (courseData.resumeUrl) {
            // Extract lessonId from resumeUrl or navigate directly
            // This is a fallback - prefer resume1
            console.log('[LearningPathScreen] Using resumeUrl:', courseData.resumeUrl);
        }

        // Final fallback: Find first unlocked lesson
        const firstUnlockedLesson = findFirstUnlockedLesson(courseData.module);
        if (firstUnlockedLesson) {
            navigateToLesson(
                firstUnlockedLesson.lessonId,
                firstUnlockedLesson.lessonType,
                firstUnlockedLesson.name,
                courseId!
            );
        }
    };

    // Helper to find first unlocked lesson across all modules
    const findFirstUnlockedLesson = (modules: Module[]): Lesson | null => {
        for (const module of modules) {
            if (module.isLocked) continue;
            for (const lesson of module.lessons) {
                if (!lesson.isLocked) {
                    return lesson;
                }
            }
        }
        return null;
    };

    // Helper to navigate to lesson based on type
    const navigateToLesson = (lessonId: string, lessonType: string, lessonName: string, parentCourseId: string) => {
        console.log('[LearningPathScreen] navigateToLesson called:', {
            lessonId,
            lessonType,
            lessonName,
            parentCourseId,
        });

        if (lessonType === 'quiz' || lessonType === 'nongraded' || lessonType === 'graded') {
            console.log('[LearningPathScreen] Navigating to EngineeringAssessmentInstructions for quiz');
            navigation.navigate('EngineeringAssessmentInstructions', {
                lessonId: lessonId,
                moodleCourseId: parentCourseId,
            });
        } else if (lessonType === 'assignment') {
            console.log('[LearningPathScreen] Navigating to AssignmentInstructions for assignment');
            navigation.navigate('AssignmentInstructions', {
                lessonId: lessonId,
                moodleCourseId: parentCourseId,
            });
        } else if (lessonType === 'video') {
            // Video lessons go to CourseDetails
            console.log('[LearningPathScreen] Navigating to CourseDetails for video');
            navigation.navigate('CourseDetails', {
                courseId: lessonId,
                courseTitle: lessonName,
                parentCourseId: parentCourseId,
            });
        } else if (lessonType === 'article') {
            // Only navigate to ReadDifferentPlayers if lesson name specifically includes "different players"
            // Otherwise, go to CourseDetails or ReadingCompletion
            const lessonNameLower = lessonName.toLowerCase();
            if (lessonNameLower.includes('different players')) {
                console.log('[LearningPathScreen] Navigating to ReadDifferentPlayers (article with "different players" in name)');
                navigation.navigate('ReadDifferentPlayers', {
                    courseId: parentCourseId,
                    lessonId: lessonId,
                });
            } else {
                // For other articles, navigate to CourseDetails or ReadingCompletion
                console.log('[LearningPathScreen] Navigating to CourseDetails for article');
                navigation.navigate('CourseDetails', {
                    courseId: lessonId,
                    courseTitle: lessonName,
                    parentCourseId: parentCourseId,
                });
            }
        } else {
            // Default navigation - go to CourseDetails
            console.log('[LearningPathScreen] Navigating to CourseDetails (default)');
            navigation.navigate('CourseDetails', {
                courseId: lessonId,
                courseTitle: lessonName,
                parentCourseId: parentCourseId,
            });
        }
    };

    const handleStartLearning = () => {
        console.log('[LearningPathScreen] ===== START LEARNING CLICKED =====');
        console.log('[LearningPathScreen] courseData:', courseData ? 'exists' : 'null');
        console.log('[LearningPathScreen] courseId:', courseId);
        console.log('[LearningPathScreen] courseData modules:', courseData?.module?.length || 0);

        if (!courseData || !courseId) {
            console.warn('[LearningPathScreen] Cannot start learning - missing courseData or courseId');
            return;
        }

        // Log all lessons for debugging
        if (courseData.module) {
            console.log('[LearningPathScreen] All lessons in course:');
            courseData.module.forEach((module, moduleIndex) => {
                console.log(`[LearningPathScreen] Module ${moduleIndex + 1} (${module.name}):`, {
                    isLocked: module.isLocked,
                    lessonsCount: module.lessons?.length || 0,
                });
                module.lessons?.forEach((lesson, lessonIndex) => {
                    console.log(`[LearningPathScreen]   Lesson ${lessonIndex + 1}:`, {
                        name: lesson.name,
                        lessonId: lesson.lessonId,
                        lessonType: lesson.lessonType,
                        isLocked: lesson.isLocked,
                        globalOrder: lesson.globalOrder,
                        includesDifferentPlayers: lesson.name?.toLowerCase().includes('different players'),
                    });
                });
            });
        }

        // First, check if there's resume data from API
        if (courseData.resume1) {
            const resumeLesson = courseData.resume1;
            console.log('[LearningPathScreen] Using resume1 data from API:', {
                lessonId: resumeLesson.lessonId,
                lessonType: resumeLesson.lessonType,
                lessonName: resumeLesson.name,
                globalOrder: resumeLesson.globalOrder,
            });
            navigateToLesson(
                resumeLesson.lessonId,
                resumeLesson.lessonType,
                resumeLesson.name,
                courseId
            );
            return;
        }

        // If no resume data, find first unlocked lesson by globalOrder (respecting API locking)
        const firstUnlockedLesson = findFirstUnlockedLessonByOrder(courseData.module);
        console.log('[LearningPathScreen] First unlocked lesson (by order):', firstUnlockedLesson ? {
            name: firstUnlockedLesson.name,
            lessonId: firstUnlockedLesson.lessonId,
            lessonType: firstUnlockedLesson.lessonType,
            globalOrder: firstUnlockedLesson.globalOrder,
        } : 'null');

        if (firstUnlockedLesson) {
            console.log('[LearningPathScreen] ===== NAVIGATING TO LESSON =====');
            console.log('[LearningPathScreen] Lesson details:', {
                lessonId: firstUnlockedLesson.lessonId,
                lessonType: firstUnlockedLesson.lessonType,
                lessonName: firstUnlockedLesson.name,
                globalOrder: firstUnlockedLesson.globalOrder,
                courseId: courseId,
                willNavigateToReadDifferentPlayers: firstUnlockedLesson.name?.toLowerCase().includes('different players'),
            });
            navigateToLesson(
                firstUnlockedLesson.lessonId,
                firstUnlockedLesson.lessonType,
                firstUnlockedLesson.name,
                courseId
            );
        } else {
            console.warn('[LearningPathScreen] No unlocked lesson found');
            console.warn('[LearningPathScreen] All modules:', courseData.module?.map(m => ({
                name: m.name,
                isLocked: m.isLocked,
                lessonsCount: m.lessons?.length || 0,
                unlockedLessons: m.lessons?.filter(l => !l.isLocked).length || 0,
            })));
        }
    };

    // Helper to find first unlocked lesson by globalOrder (more accurate than just first in array)
    const findFirstUnlockedLessonByOrder = (modules: Module[]): Lesson | null => {
        const allUnlockedLessons: Lesson[] = [];

        for (const module of modules) {
            if (module.isLocked) continue;
            for (const lesson of module.lessons) {
                if (!lesson.isLocked) {
                    allUnlockedLessons.push(lesson);
                }
            }
        }

        if (allUnlockedLessons.length === 0) return null;

        // Sort by globalOrder and return the first one
        const sortedLessons = allUnlockedLessons.sort((a, b) => {
            const orderA = a.globalOrder || 0;
            const orderB = b.globalOrder || 0;
            return orderA - orderB;
        });

        return sortedLessons[0];
    };

    // Transform lesson type to display format
    const getLessonTypeDisplay = (lessonType: string, type: string): string => {
        if (lessonType === 'video' || type === 'videoPage') return 'Video';
        if (lessonType === 'article' || type === 'article') return 'Read';
        if (lessonType === 'quiz' || lessonType === 'nongraded' || lessonType === 'graded' || type === 'quiz') return 'Quiz';
        if (lessonType === 'assignment' || type === 'assign') return 'Assignment';
        return 'Lesson';
    };

    // Transform modules data for ModuleAccordion - Use API locking flags from course data
    const transformModules = (modules: Module[]) => {
        return modules.map((module) => ({
            title: module.name,
            description: module.summary,
            duration: module.duration,
            isLocked: module.isLocked, // Use API flag from course data
            lessons: module.lessons.map((lesson) => ({
                title: lesson.name,
                sub: lesson.sub,
                type: getLessonTypeDisplay(lesson.lessonType, lesson.type),
                duration: lesson.duration,
                lessonId: lesson.lessonId,
                isLocked: lesson.isLocked, // Use API flag from course data
            })),
        }));
    };

    const handleModulePress = (moduleIndex: number) => {
        if (!courseData) return;

        // Check if module is locked from API data
        const module = courseData.module[moduleIndex];
        if (module?.isLocked) {
            console.log('[LearningPathScreen] Module is locked, cannot expand');
            return;
        }

        // Toggle module expansion (allow multiple modules to be expanded)
        setExpandedModuleIndices(prev => {
            const newSet = new Set(prev);
            if (newSet.has(moduleIndex)) {
                newSet.delete(moduleIndex);
            } else {
                newSet.add(moduleIndex);
            }
            return newSet;
        });
    };

    const handleLessonPress = (lessonId: string, isLocked: boolean) => {
        if (!courseData || !courseId) return;

        // Check if lesson is locked from API data
        if (isLocked) {
            console.log('[LearningPathScreen] Lesson is locked, cannot navigate');
            return;
        }

        // Find the lesson in course data
        let targetLesson: Lesson | null = null;
        for (const module of courseData.module) {
            const lesson = module.lessons.find(l => l.lessonId === lessonId);
            if (lesson) {
                targetLesson = lesson;
                break;
            }
        }

        if (targetLesson) {
            navigateToLesson(
                targetLesson.lessonId,
                targetLesson.lessonType,
                targetLesson.name,
                courseId
            );
        }
    };

    if (loading || error || !courseData) {
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
                    onResumePress={undefined}
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
                                    isExpanded={expandedModuleIndices.has(index)}
                                    isLocked={module.isLocked}
                                    onPress={() => handleModulePress(index)}
                                    onLessonPress={handleLessonPress}
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

