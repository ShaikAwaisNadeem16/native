import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { colors, typography } from '../../styles/theme';
import Header from './components/Header';
import BreadcrumbBar from '../assessments/components/BreadcrumbBar';
import CourseDetailsModuleWidget from '../../components/course-details/CourseDetailsModuleWidget';
import LeftArrow from '../../components/common/LeftArrow';
import RightArrow from '../../components/common/RightArrow';
import AutomotiveHamburgerMenu, {
    ModuleSection,
} from '../../components/course-details/AutomotiveHamburgerMenu';
import useCourseStore from '../../store/useCourseStore';
import { transformCourseDataToMenuSections, getCourseMenuTitle } from '../../utils/courseDataTransform';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ReadingCompletion'>;
type ReadingCompletionRouteProp = RouteProp<RootStackParamList, 'ReadingCompletion'>;

/**
 * ReadingCompletionScreen
 * Screen displayed after completing the reading content, prompting user to start STEM Assessment
 * Based on Figma design node-id=7381-69592
 */
const ReadingCompletionScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<ReadingCompletionRouteProp>();
    const { courseId, lessonId } = route.params || {};
    
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [courseSections, setCourseSections] = useState<ModuleSection[]>([]);
    const [courseTitle, setCourseTitle] = useState('Awareness On Automotive Industry');
    const [courseSubtitle, setCourseSubtitle] = useState('Automotive Industry Value Chain');

    // Use course store
    const { courseData, fetchCourseView } = useCourseStore();
    
    // Fetch course data for hamburger menu
    useEffect(() => {
        if (courseId) {
            fetchCourseView(courseId);
        }
    }, [courseId, fetchCourseView]);
    
    // Update menu sections when course data changes
    useEffect(() => {
        if (courseData) {
            const sections = transformCourseDataToMenuSections(courseData, lessonId);
            setCourseSections(sections);
            
            const { title, subtitle } = getCourseMenuTitle(courseData);
            setCourseTitle(title);
            setCourseSubtitle(subtitle);
        }
    }, [courseData, lessonId]);

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    const handleLogoPress = () => {
        navigation.navigate('Home');
    };

    const handleHamburgerPress = () => {
        setIsMenuVisible(true);
    };

    const handleMenuClose = () => {
        setIsMenuVisible(false);
    };

    const handleMenuItemPress = (sectionId: string, itemId: string) => {
        setIsMenuVisible(false);
        
        const parts = itemId.split('-');
        if (parts.length >= 2) {
            const extractedLessonId = parts.slice(1).join('-');
            
            // Find the lesson in course sections to get its type and status
            let lessonType: string | null = null;
            let lessonStatus: 'completed' | 'current' | 'locked' = 'locked';
            for (const section of courseSections) {
                const item = section.items?.find(item => item.id === itemId);
                if (item) {
                    lessonType = item.type;
                    lessonStatus = item.status;
                    break;
                }
            }
            
            // CRITICAL: Do not navigate to locked lessons
            if (lessonStatus === 'locked') {
                console.log('[ReadingCompletion] Lesson is locked, cannot navigate');
                return;
            }
            
            if (lessonType === 'video') {
                navigation.navigate('CourseDetails', {
                    courseId: extractedLessonId,
                    courseTitle: courseSections.find(s => s.items?.some(i => i.id === itemId))?.items?.find(i => i.id === itemId)?.title || '',
                });
            } else if (lessonType === 'read') {
                navigation.navigate('ReadDifferentPlayers', {
                    courseId,
                    lessonId: extractedLessonId,
                });
            } else if (lessonType === 'quiz') {
                navigation.navigate('EngineeringAssessmentInstructions', {
                    lessonId: extractedLessonId,
                    moodleCourseId: courseId,
                });
            }
        }
    };

    const handlePreviousPress = () => {
        navigation.navigate('ReadDifferentPlayers', {
            courseId,
            lessonId,
        });
    };

    const handleNextPress = () => {
        // Navigate to the quiz/assessment instructions
        navigation.navigate('AutomotiveQuizInstructions', {
            courseId,
            lessonId,
        });
    };

    const handleStartQuizPress = () => {
        // Navigate to the Automotive Quiz Instructions screen
        navigation.navigate('AutomotiveQuizInstructions', {
            courseId,
            lessonId,
        });
    };

    // Render hamburger icon (three horizontal lines)
    const renderHamburgerIcon = () => (
        <View style={styles.hamburgerIconContainer}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
        </View>
    );

    // Render chevron left (previous) icon - using LeftArrow from assets
    // Gray color for gray background button
    const renderChevronLeft = () => (
        <LeftArrow size={14} color="#72818C" />
    );

    // Render chevron right (next) icon - using RightArrow from assets
    // White color for blue background button
    const renderChevronRight = () => (
        <RightArrow size={14} color={colors.white} />
    );

    // Render non-graded icon (X in circle)
    const renderNonGradedIcon = () => (
        <View style={styles.nonGradedIconContainer}>
            <View style={styles.nonGradedCircle}>
                <View style={styles.nonGradedX1} />
                <View style={styles.nonGradedX2} />
            </View>
        </View>
    );

    // Render questions icon (document)
    const renderQuestionsIcon = () => (
        <View style={styles.questionsIconContainer}>
            <View style={styles.questionsDoc}>
                <View style={styles.questionsDocInner} />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header
                onProfilePress={handleProfilePress}
                onLogoPress={handleLogoPress}
                useAssessmentLogo={true}
            />
            <BreadcrumbBar
                items={['Your Learning Journey', 'Awareness On Automotive Industry', 'Reading Completion']}
            />
            <CourseDetailsModuleWidget
                title="Awareness On Automotive Industry"
                subtitle="Automotive Industry Value Chain"
                onHamburgerPress={handleHamburgerPress}
            />

            {/* Main Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Status Bar and Navigation */}
                <View style={styles.statusAndNavContainer}>
                    <View style={styles.completedBadge}>
                        <Text style={styles.completedBadgeText}>Completed</Text>
                    </View>
                    <View style={styles.navigationButtons}>
                        <TouchableOpacity
                            style={styles.navButtonDisabled}
                            onPress={handlePreviousPress}
                            activeOpacity={0.7}
                        >
                            {renderChevronLeft()}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navButtonActive}
                            onPress={handleNextPress}
                            activeOpacity={0.7}
                        >
                            {renderChevronRight()}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* STEM Assessment Card */}
                <View style={styles.assessmentCard}>
                    {/* Decorative diagonal stripes (positioned absolutely) */}
                    <View style={styles.decorativeStripe1} />
                    <View style={styles.decorativeStripe2} />

                    {/* Card Content */}
                    <View style={styles.assessmentContent}>
                        {/* UFO Illustration */}
                        <View style={styles.illustrationContainer}>
                            <View style={styles.illustrationCircle}>
                                {/* UFO icon placeholder - circular background with dome shape */}
                                <View style={styles.ufoBody}>
                                    <View style={styles.ufoDome} />
                                    <View style={styles.ufoBase} />
                                    <View style={styles.ufoLight1} />
                                    <View style={styles.ufoLight2} />
                                    <View style={styles.ufoLight3} />
                                </View>
                            </View>
                        </View>

                        {/* Text Content */}
                        <View style={styles.textContent}>
                            <Text style={styles.assessmentTitle}>STEM Assessment</Text>
                            <Text style={styles.assessmentDescription}>
                                Complete this quiz to learn how well you've understood the learnings of this module.
                            </Text>

                            {/* Info Tags */}
                            <View style={styles.infoTags}>
                                <View style={styles.infoTag}>
                                    {renderNonGradedIcon()}
                                    <Text style={styles.infoTagText}>Non-Graded</Text>
                                </View>
                                <View style={styles.infoTag}>
                                    {renderQuestionsIcon()}
                                    <Text style={styles.infoTagText}>8 Questions</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Start Quiz Button */}
                    <TouchableOpacity
                        style={styles.startQuizButton}
                        onPress={handleStartQuizPress}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.startQuizButtonText}>Start The Quiz</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Hamburger Menu Modal */}
            <AutomotiveHamburgerMenu
                visible={isMenuVisible}
                onClose={handleMenuClose}
                title="Awareness On Automotive Industry"
                subtitle="Automotive Industry Value Chain"
                sections={courseSections}
                onItemPress={handleMenuItemPress}
                initialExpandedSection="2"
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainBgGrey,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTextContainer: {
        flex: 1,
        marginRight: 32,
    },
    headerTitle: {
        ...typography.p3Bold,
        color: colors.textGrey,
        lineHeight: 23,
    },
    headerSubtitle: {
        ...typography.s1Regular,
        color: colors.textGrey,
        lineHeight: 16,
    },
    hamburgerButton: {
        backgroundColor: colors.highlightBlue,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: 28,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hamburgerIconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    hamburgerLine: {
        width: 18,
        height: 2,
        backgroundColor: colors.primaryBlue,
        borderRadius: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 32,
    },
    statusAndNavContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    completedBadge: {
        backgroundColor: colors.successGreen,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 4,
    },
    completedBadgeText: {
        ...typography.s2SemiBold,
        color: colors.white,
        lineHeight: 13,
    },
    navigationButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    navButtonDisabled: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#ededed',
        borderWidth: 0.8,
        borderColor: colors.lightGrey,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navButtonActive: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primaryBlue,
        justifyContent: 'center',
        alignItems: 'center',
    },
    assessmentCard: {
        backgroundColor: '#0049b5',
        borderRadius: 0,
        paddingHorizontal: 16,
        paddingVertical: 24,
        overflow: 'hidden',
        position: 'relative',
    },
    decorativeStripe1: {
        position: 'absolute',
        width: 207,
        height: 478,
        backgroundColor: 'rgba(250, 255, 252, 0.1)',
        transform: [{ rotate: '38.7deg' }],
        right: -150,
        top: -200,
    },
    decorativeStripe2: {
        position: 'absolute',
        width: 33,
        height: 784,
        backgroundColor: 'rgba(250, 255, 252, 0.1)',
        transform: [{ rotate: '38.7deg' }],
        right: -100,
        top: -350,
    },
    assessmentContent: {
        gap: 20,
        marginBottom: 32,
    },
    illustrationContainer: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustrationCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'visible',
    },
    ufoBody: {
        width: 50,
        height: 35,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    ufoDome: {
        width: 24,
        height: 16,
        backgroundColor: 'rgba(200, 220, 255, 0.9)',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        position: 'absolute',
        top: 0,
    },
    ufoBase: {
        width: 40,
        height: 12,
        backgroundColor: 'rgba(180, 200, 230, 0.9)',
        borderRadius: 6,
        position: 'absolute',
        bottom: 8,
    },
    ufoLight1: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 100, 0.9)',
        position: 'absolute',
        bottom: 0,
        left: 8,
    },
    ufoLight2: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 100, 0.9)',
        position: 'absolute',
        bottom: 0,
    },
    ufoLight3: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 100, 0.9)',
        position: 'absolute',
        bottom: 0,
        right: 8,
    },
    textContent: {
        gap: 12,
    },
    assessmentTitle: {
        ...typography.h6,
        color: colors.white,
        lineHeight: 24,
    },
    assessmentDescription: {
        ...typography.p3Regular,
        color: colors.white,
        lineHeight: 25,
    },
    infoTags: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    infoTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    infoTagText: {
        ...typography.p4,
        color: colors.lightGrey,
        lineHeight: 20,
    },
    nonGradedIconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nonGradedCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.lightGrey,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nonGradedX1: {
        position: 'absolute',
        width: 10,
        height: 2,
        backgroundColor: colors.lightGrey,
        borderRadius: 1,
        transform: [{ rotate: '45deg' }],
    },
    nonGradedX2: {
        position: 'absolute',
        width: 10,
        height: 2,
        backgroundColor: colors.lightGrey,
        borderRadius: 1,
        transform: [{ rotate: '-45deg' }],
    },
    questionsIconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionsDoc: {
        width: 16,
        height: 18,
        borderWidth: 2,
        borderColor: colors.lightGrey,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionsDocInner: {
        width: 8,
        height: 2,
        backgroundColor: colors.lightGrey,
        borderRadius: 1,
    },
    startQuizButton: {
        backgroundColor: colors.white,
        borderRadius: 8,
        paddingHorizontal: 24,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    startQuizButtonText: {
        ...typography.p4SemiBold,
        color: colors.primaryBlue,
        lineHeight: 20,
    },
});

export default ReadingCompletionScreen;
