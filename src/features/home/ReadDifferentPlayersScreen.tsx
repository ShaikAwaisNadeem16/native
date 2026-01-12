import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
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
import { HomeService } from '../../api/home';
import { transformCourseDataToMenuSections, getCourseMenuTitle } from '../../utils/courseDataTransform';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ReadDifferentPlayers'>;
type ReadDifferentPlayersRouteProp = RouteProp<RootStackParamList, 'ReadDifferentPlayers'>;

/**
 * ReadDifferentPlayersScreen
 * Screen displaying the "Read: Different Players in the Automotive Industry" content
 * Based on Figma design node-id=7381-69207
 */
const ReadDifferentPlayersScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<ReadDifferentPlayersRouteProp>();
    const { courseId, lessonId } = route.params || {};
    
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [courseSections, setCourseSections] = useState<ModuleSection[]>([]);
    const [courseTitle, setCourseTitle] = useState('Awareness On Automotive Industry');
    const [courseSubtitle, setCourseSubtitle] = useState('Automotive Industry Value Chain');
    const [loading, setLoading] = useState(false);

    // Fetch course data for hamburger menu
    useEffect(() => {
        if (courseId) {
            fetchCourseData();
        }
    }, [courseId]);

    const fetchCourseData = async () => {
        try {
            setLoading(true);
            const courseData = await HomeService.getCourseView(courseId);
            console.log('[ReadDifferentPlayers] Course data fetched:', JSON.stringify(courseData, null, 2));
            
            // Transform course data to menu sections
            const sections = transformCourseDataToMenuSections(courseData, lessonId);
            setCourseSections(sections);
            
            // Get course title and subtitle
            const { title, subtitle } = getCourseMenuTitle(courseData);
            setCourseTitle(title);
            setCourseSubtitle(subtitle);
        } catch (error: any) {
            console.error('[ReadDifferentPlayers] Failed to fetch course data:', error);
            // Keep default sections if API fails
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

    const handleHamburgerPress = () => {
        setIsMenuVisible(true);
    };

    const handleMenuClose = () => {
        setIsMenuVisible(false);
    };

    const handleMenuItemPress = (sectionId: string, itemId: string) => {
        setIsMenuVisible(false);
        
        // Extract lessonId from itemId (format: "unitId-lessonId")
        const parts = itemId.split('-');
        if (parts.length >= 2) {
            const extractedLessonId = parts.slice(1).join('-'); // Handle lessonIds with hyphens
            
            // Find the lesson in course sections to get its type
            let lessonType: string | null = null;
            for (const section of courseSections) {
                const item = section.items?.find(item => item.id === itemId);
                if (item) {
                    lessonType = item.type;
                    break;
                }
            }
            
            // Navigate based on lesson type
            if (lessonType === 'video') {
                navigation.navigate('CourseDetails', {
                    courseId: extractedLessonId,
                    courseTitle: courseSections.find(s => s.items?.some(i => i.id === itemId))?.items?.find(i => i.id === itemId)?.title || '',
                });
            } else if (lessonType === 'read') {
                if (extractedLessonId === lessonId || extractedLessonId === 'LID-A-0096') {
                    // Current screen, do nothing
                    return;
                }
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
        // Navigate to previous content (Video: Size of Industry)
        // Find previous lesson in course data
        if (courseSections.length > 0 && courseId) {
            // Try to find previous lesson - this is a simplified version
            // In a real implementation, you'd track the current lesson index
            navigation.navigate('CourseDetails', {
                courseId: 'LID-A-0094', // Size of Industry lessonId
                courseTitle: 'Size of Industry',
                parentCourseId: courseId,
            });
        }
    };

    const handleNextPress = () => {
        // Navigate to Reading Completion screen (STEM Assessment prompt)
        navigation.navigate('ReadingCompletion', {
            courseId,
            lessonId,
        });
    };

    const handleCompletedPress = () => {
        // Mark reading as complete (no navigation)
        // Just update the UI state if needed
        console.log('Reading marked as complete');
    };

    const handleFeedbackPress = () => {
        // Handle feedback action
    };

    const handleReportIssuePress = () => {
        // Handle report issue action
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

    // Render checkmark icon
    const renderCheckIcon = () => (
        <View style={styles.checkIconContainer}>
            <View style={styles.checkLine1} />
            <View style={styles.checkLine2} />
        </View>
    );

    // Render thumbs up icon
    const renderThumbsUpIcon = () => (
        <View style={styles.thumbsUpIcon}>
            <View style={styles.thumbsUpThumb} />
            <View style={styles.thumbsUpPalm} />
        </View>
    );

    // Render flag icon
    const renderFlagIcon = () => (
        <View style={styles.flagIcon}>
            <View style={styles.flagPole} />
            <View style={styles.flagBody} />
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header
                onProfilePress={handleProfilePress}
                onLogoPress={handleLogoPress}
            />
            <BreadcrumbBar
                items={['Your Learning Journey', 'Awareness On Automotive Industry', 'Different Players In The Automotive Industry']}
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

                {/* Title */}
                <Text style={styles.contentTitle}>
                    Different Players In The Automotive Industry
                </Text>

                {/* Content Container */}
                <View style={styles.contentContainer}>
                    {/* Introduction Paragraph */}
                    <Text style={styles.bodyText}>
                        There are several course requirements needed in order to complete the course. The entire course takes 10 weeks with the bulk of the lecture content appearing in Weeks 2-6. The last four weeks of the course are lighter on content but are designed to serve as checkpoints to prepare you for your final peer review assignment.
                    </Text>

                    {/* Readings Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Readings</Text>
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400' }}
                                style={styles.contentImage}
                                resizeMode="cover"
                            />
                            <Text style={styles.imageCaption}>A futuristic car</Text>
                        </View>
                        <Text style={styles.bodyText}>
                            There are NO required readings for this course. All the information you need to know is summarized within the lecture. That said, if you want to dive deeper into the material, we've provided two sets of links to help you. First, we provide links to all the references discussed in the course. We include these references in case there is something about a particular study from the lecture that you want to look into and read more about. These references are listed in a Course Reading called "References & Notes." Second, we also provide links for how to learn more about each topic we discuss in class. These links are totally optional, but they're there in case you want to dive deeper into any of the topics we discuss. These resources are listed in Course Readings called "Ways to Learn More."
                        </Text>
                    </View>

                    {/* Assessments Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Assessments</Text>
                        <Text style={styles.bodyText}>
                            To officially pass the course and get a certificate, you must complete and pass all graded assignments (several quizzes and 1 peer-review assignment). The quizzes involve a set of questions designed to test whether you've learned the material in lecture. The peer review assignment is designed to help you apply the material you learned in class and share your experience trying to build a new habit.
                        </Text>
                    </View>

                    {/* Gradings Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Gradings</Text>
                        <Text style={styles.bodyText}>
                            The course features several short quizzes (around 5 questions each) to reinforce the material covered that week. All the quizzes combined account for 50% of your final grade. The Peer Review Assignment accounts for the other 50% of the final grade. You must pass every graded assessment to pass the course, regardless of your final grade.
                        </Text>
                    </View>
                </View>

                {/* Completed Button */}
                <TouchableOpacity
                    style={styles.completedButton}
                    onPress={handleCompletedPress}
                    activeOpacity={0.7}
                >
                    {renderCheckIcon()}
                    <Text style={styles.completedButtonText}>Completed</Text>
                </TouchableOpacity>

                {/* Feedback Section */}
                <View style={styles.feedbackContainer}>
                    <TouchableOpacity
                        style={styles.feedbackItem}
                        onPress={handleFeedbackPress}
                        activeOpacity={0.7}
                    >
                        {renderThumbsUpIcon()}
                        <Text style={styles.feedbackText}>Give Us Feedback</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.feedbackItem}
                        onPress={handleReportIssuePress}
                        activeOpacity={0.7}
                    >
                        {renderFlagIcon()}
                        <Text style={styles.feedbackText}>Report An Issue</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Hamburger Menu Modal */}
            <AutomotiveHamburgerMenu
                visible={isMenuVisible}
                onClose={handleMenuClose}
                title={courseTitle}
                subtitle={courseSubtitle}
                sections={courseSections}
                onItemPress={handleMenuItemPress}
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
        paddingVertical: 16,
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
    contentTitle: {
        ...typography.p2Bold,
        color: colors.primaryDarkBlue,
        lineHeight: 25,
        marginBottom: 16,
    },
    contentContainer: {
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingVertical: 32,
        gap: 32,
    },
    bodyText: {
        ...typography.p3Regular,
        color: colors.textGrey,
        lineHeight: 25,
    },
    section: {
        gap: 12,
    },
    sectionTitle: {
        ...typography.p2Bold,
        color: colors.primaryDarkBlue,
        lineHeight: 25,
    },
    imageContainer: {
        alignItems: 'center',
        gap: 8,
    },
    contentImage: {
        width: '100%',
        height: 178,
        borderRadius: 8,
    },
    imageCaption: {
        ...typography.s1Regular,
        color: colors.placeholderGrey,
        lineHeight: 16,
    },
    completedButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: colors.successGreen,
        borderRadius: 8,
        paddingHorizontal: 24,
        paddingVertical: 10,
        marginTop: 32,
    },
    checkIconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkLine1: {
        position: 'absolute',
        width: 6,
        height: 2,
        backgroundColor: colors.successGreen,
        borderRadius: 1,
        transform: [{ rotate: '45deg' }, { translateX: -4 }, { translateY: 2 }],
    },
    checkLine2: {
        position: 'absolute',
        width: 12,
        height: 2,
        backgroundColor: colors.successGreen,
        borderRadius: 1,
        transform: [{ rotate: '-45deg' }, { translateX: 2 }, { translateY: 0 }],
    },
    completedButtonText: {
        ...typography.p4SemiBold,
        color: colors.successGreen,
        lineHeight: 20,
    },
    feedbackContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 32,
        marginTop: 32,
        paddingHorizontal: 16,
    },
    feedbackItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    feedbackText: {
        ...typography.p4,
        color: colors.textGrey,
        lineHeight: 20,
    },
    thumbsUpIcon: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    thumbsUpThumb: {
        position: 'absolute',
        width: 8,
        height: 12,
        backgroundColor: colors.textGrey,
        borderRadius: 2,
        top: 2,
        left: 8,
        transform: [{ rotate: '-15deg' }],
    },
    thumbsUpPalm: {
        position: 'absolute',
        width: 14,
        height: 8,
        backgroundColor: colors.textGrey,
        borderRadius: 2,
        bottom: 4,
        left: 3,
    },
    flagIcon: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flagPole: {
        position: 'absolute',
        width: 2,
        height: 16,
        backgroundColor: colors.textGrey,
        borderRadius: 1,
        left: 5,
    },
    flagBody: {
        position: 'absolute',
        width: 10,
        height: 8,
        backgroundColor: colors.textGrey,
        borderRadius: 1,
        top: 4,
        left: 7,
    },
});

export default ReadDifferentPlayersScreen;
