import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { Alert, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AutomotiveAwarenessSection } from '../../components/automotive-awareness';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AutomotiveHamburgerMenu, {
    ModuleSection,
    ModuleItemStatus,
} from '../../components/course-details/AutomotiveHamburgerMenu';
import useCourseStore from '../../store/useCourseStore';
import {
    transformCourseDataToMenuSections,
    getCourseMenuTitle,
} from '../../utils/courseDataTransform';
import { ModuleAccordion } from '../../components/learning-path/index';
import Header from './components/Header';
import BreadcrumbBar from '../assessments/components/BreadcrumbBar';
import { colors, typography } from '../../styles/theme';
import { CardSkeleton } from '../../components/common/SkeletonLoaders';

type NavigationProp = StackNavigationProp<RootStackParamList, 'AutomotiveAwareness'>;
type AutomotiveAwarenessRouteProp = RouteProp<RootStackParamList, 'AutomotiveAwareness'>;

/**
 * AutomotiveAwarenessScreen
 * Screen component that renders the "Automotive Awareness" page
 * Now uses API data from course-view instead of hardcoded sections
 * This screen is used as a fallback when courseId is not available
 */
const AutomotiveAwarenessScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<AutomotiveAwarenessRouteProp>();
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    // Try to get courseId from route params if available
    // If not available, this screen shows a fallback UI
    const courseId = (route.params as any)?.courseId;

    // Use course store to fetch course data if courseId is available
    const { courseData, loading, error, fetchCourseView } = useCourseStore();

    const [expandedModuleIndices, setExpandedModuleIndices] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (courseId) {
            console.log('[AutomotiveAwarenessScreen] Fetching course data for courseId:', courseId);
            fetchCourseView(courseId);
        }
    }, [courseId, fetchCourseView]);

    // Auto-expand ALL modules on load and console log the data
    useEffect(() => {
        if (courseData?.module) {
            console.log('[AutomotiveAwarenessScreen] ===== COURSE DATA FROM API =====');
            console.log('[AutomotiveAwarenessScreen] Full course data:', JSON.stringify(courseData, null, 2));
            console.log('[AutomotiveAwarenessScreen] Course name:', courseData.name);
            console.log('[AutomotiveAwarenessScreen] Course summary:', courseData.summary);
            console.log('[AutomotiveAwarenessScreen] Number of modules:', courseData.module.length);

            // Expand all modules (both locked and unlocked)
            const allIndices = new Set<number>();
            courseData.module.forEach((module, index) => {
                allIndices.add(index);
                console.log(`[AutomotiveAwarenessScreen] Module ${index + 1}:`, {
                    unitId: module.unitId,
                    name: module.name,
                    summary: module.summary,
                    duration: module.duration,
                    isLocked: module.isLocked,
                    lessonsCount: module.lessons?.length || 0,
                    lessons: module.lessons?.map(l => ({
                        lessonId: l.lessonId,
                        name: l.name,
                        sub: l.sub,
                        lessonType: l.lessonType,
                        type: l.type,
                        duration: l.duration,
                        isLocked: l.isLocked,
                        completionStatus: l.completionStatus,
                        completedAt: l.completedAt,
                    })),
                });
            });
            setExpandedModuleIndices(allIndices);
            console.log('[AutomotiveAwarenessScreen] All modules expanded:', Array.from(allIndices));
        }
    }, [courseData]);

    // Transform course data to menu sections if available
    const menuSections: ModuleSection[] = courseData
        ? transformCourseDataToMenuSections(courseData)
        : [];

    const { title, subtitle } = courseData
        ? getCourseMenuTitle(courseData)
        : {
            title: 'Awareness On Automotive Industry',
            subtitle: 'Automotive Industry Value Chain',
        };

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    const handleLogoPress = () => {
        navigation.navigate('Home');
    };

    const handleMenuClose = () => {
        setIsMenuVisible(false);
    };

    const handleItemClick = (itemId: string) => {
        // If we have course data, navigate based on lesson type
        if (courseData) {
            const lesson = courseData.module
                .flatMap((m) => m.lessons)
                .find((l) => l.lessonId === itemId);

            if (lesson) {
                if (lesson.isLocked) {
                    Alert.alert('Locked Lesson', 'This lesson is locked and cannot be accessed yet.');
                    return;
                }

                // Navigate based on lesson type
                if (lesson.lessonType === 'read' || lesson.type === 'read') {
                    navigation.navigate('ReadDifferentPlayers', {
                        courseId: courseId || courseData.id,
                        lessonId: lesson.lessonId,
                    });
                } else if (lesson.lessonType === 'quiz' || lesson.type === 'quiz') {
                    navigation.navigate('AutomotiveQuizInstructions', {
                        courseId: courseId || courseData.id,
                        lessonId: lesson.lessonId,
                    });
                } else if (lesson.lessonType === 'video' || lesson.type === 'video') {
                    navigation.navigate('CourseDetails', {
                        courseId: courseId || courseData.id,
                        lessonId: lesson.lessonId,
                        parentCourseId: courseId || courseData.id,
                    });
                }
            }
        } else {
            // Fallback navigation when no course data
            console.log('Awareness item clicked:', itemId);
            navigation.navigate('CourseDetails', {
                courseId: itemId,
                courseTitle: 'Different Players In The Automotive Industry',
            });
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

    // Transform modules data for ModuleAccordion - Use API data
    const transformModules = (modules: any[]) => {
        return modules.map((module) => ({
            title: module.name || 'Untitled Module',
            description: module.summary || '',
            duration: module.duration || '',
            isLocked: module.isLocked || false,
            lessons: module.lessons?.map((lesson: any) => ({
                title: lesson.name || 'Untitled Lesson',
                sub: lesson.sub || '',
                type: getLessonTypeDisplay(lesson.lessonType, lesson.type),
                duration: lesson.duration || '',
                lessonId: lesson.lessonId,
                isLocked: lesson.isLocked || false,
            })) || [],
        }));
    };

    const handleModulePress = (moduleIndex: number) => {
        if (!courseData) return;

        // Check if module is locked from API data
        const module = courseData.module[moduleIndex];
        if (module?.isLocked) {
            console.log('[AutomotiveAwarenessScreen] Module is locked, cannot expand');
            return;
        }

        // Toggle module expansion
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
            Alert.alert('Locked Lesson', 'This lesson is locked and cannot be accessed yet.');
            return;
        }

        // Find the lesson in course data
        let targetLesson: any = null;
        for (const module of courseData.module) {
            const lesson = module.lessons.find((l: any) => l.lessonId === lessonId);
            if (lesson) {
                targetLesson = lesson;
                break;
            }
        }

        if (targetLesson) {
            // Navigate based on lesson type
            if (targetLesson.lessonType === 'read' || targetLesson.type === 'read') {
                navigation.navigate('ReadDifferentPlayers', {
                    courseId: courseId || courseData.id,
                    lessonId: targetLesson.lessonId,
                });
            } else if (targetLesson.lessonType === 'quiz' || targetLesson.type === 'quiz') {
                navigation.navigate('AutomotiveQuizInstructions', {
                    courseId: courseId || courseData.id,
                    lessonId: targetLesson.lessonId,
                });
            } else if (targetLesson.lessonType === 'video' || targetLesson.type === 'video') {
                navigation.navigate('CourseDetails', {
                    courseId: courseId || courseData.id,
                    lessonId: targetLesson.lessonId,
                    parentCourseId: courseId || courseData.id,
                });
            }
        }
    };

    const handleMenuItemPress = (sectionId: string, itemId: string, status: ModuleItemStatus) => {
        setIsMenuVisible(false);
        if (status === 'locked') {
            Alert.alert('Locked Lesson', 'This lesson is locked and cannot be accessed yet.');
            return;
        }

        // If we have course data, navigate based on lesson type
        if (courseData) {
            const lesson = courseData.module
                .flatMap((m) => m.lessons)
                .find((l) => l.lessonId === itemId);

            if (lesson) {
                if (lesson.lessonType === 'read' || lesson.type === 'read') {
                    navigation.navigate('ReadDifferentPlayers', {
                        courseId: courseId || courseData.id,
                        lessonId: lesson.lessonId,
                    });
                } else if (lesson.lessonType === 'quiz' || lesson.type === 'quiz') {
                    navigation.navigate('AutomotiveQuizInstructions', {
                        courseId: courseId || courseData.id,
                        lessonId: lesson.lessonId,
                    });
                } else if (lesson.lessonType === 'video' || lesson.type === 'video') {
                    navigation.navigate('CourseDetails', {
                        courseId: courseId || courseData.id,
                        lessonId: lesson.lessonId,
                        parentCourseId: courseId || courseData.id,
                    });
                }
            }
        } else {
            // Fallback navigation when no course data
            if (itemId === '2-2') {
                navigation.navigate('CourseDetails', {
                    courseId: itemId,
                    courseTitle: 'Different Players In The Automotive Industry',
                });
            }
        }
    };

    // Show loading state or error state (skeleton)
    if ((loading || error) && courseId) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header
                    onProfilePress={handleProfilePress}
                    onLogoPress={handleLogoPress}
                />
                <BreadcrumbBar items={['Your Learning Journey', 'Automotive Awareness']} />
                <View style={styles.content}>
                    <CardSkeleton />
                </View>
            </SafeAreaView>
        );
    }

    // If we have course data, show accordion view
    if (courseData && courseData.module && courseData.module.length > 0) {
        return (
            <>
                <SafeAreaView style={styles.container} edges={['top']}>
                    <Header
                        onProfilePress={handleProfilePress}
                        onLogoPress={handleLogoPress}
                    />
                    <BreadcrumbBar items={['Your Learning Journey', courseData.name || 'Automotive Awareness']} />

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Course Header */}
                        <View style={styles.headerSection}>
                            <Text style={styles.courseTitle}>{courseData.name || 'Automotive Awareness'}</Text>
                            {courseData.summary && (
                                <Text style={styles.courseSummary}>{courseData.summary}</Text>
                            )}
                        </View>

                        {/* Learning Path Journey Section - Accordion */}
                        <View style={styles.journeySection}>
                            <Text style={styles.journeyTitle}>Learning Path Journey</Text>
                            <View style={styles.modulesContainer}>
                                {transformModules(courseData.module).map((module, index) => (
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
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Hamburger Menu Toggle Button */}
                    <TouchableOpacity
                        style={styles.menuToggleButton}
                        onPress={() => setIsMenuVisible(true)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.menuToggleText}>☰</Text>
                    </TouchableOpacity>
                </SafeAreaView>

                {/* Hamburger Menu Modal - Uses API data */}
                {menuSections.length > 0 && (
                    <AutomotiveHamburgerMenu
                        visible={isMenuVisible}
                        onClose={handleMenuClose}
                        title={title}
                        subtitle={subtitle}
                        sections={menuSections}
                        onItemPress={handleMenuItemPress}
                        initialExpandedSection={menuSections.find((s) => !s.isLocked)?.id}
                    />
                )}
            </>
        );
    }

    // Fallback to original section if no course data
    return (
        <>
            <AutomotiveAwarenessSection
                onProfilePress={handleProfilePress}
                onLogoPress={handleLogoPress}
                onItemClick={handleItemClick}
            />

            {/* Hamburger Menu Modal - Uses API data if available */}
            {menuSections.length > 0 && (
                <AutomotiveHamburgerMenu
                    visible={isMenuVisible}
                    onClose={handleMenuClose}
                    title={title}
                    subtitle={subtitle}
                    sections={menuSections}
                    onItemPress={handleMenuItemPress}
                    initialExpandedSection={menuSections.find((s) => !s.isLocked)?.id}
                />
            )}
        </>
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
    headerSection: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: 12,
        padding: 24,
        gap: 12,
    },
    courseTitle: {
        ...typography.h6,
        color: colors.primaryDarkBlue,
    },
    courseSummary: {
        ...typography.p3Regular,
        color: colors.textGrey,
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
    menuToggleButton: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primaryBlue,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuToggleText: {
        fontSize: 24,
        color: colors.white,
    },
});

export default AutomotiveAwarenessScreen;
