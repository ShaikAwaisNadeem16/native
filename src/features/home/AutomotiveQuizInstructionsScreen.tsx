import React, { useState } from 'react';
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
import { RootStackParamList } from '../../navigation/AppNavigator';
import { colors, typography } from '../../styles/theme';
import AutomotiveHamburgerMenu, {
    ModuleSection,
} from '../../components/course-details/AutomotiveHamburgerMenu';

type NavigationProp = StackNavigationProp<RootStackParamList, 'AutomotiveQuizInstructions'>;

// Sample course sections data
const courseSections: ModuleSection[] = [
    {
        id: '1',
        title: 'Introduction to Automotive Industry',
        items: [],
    },
    {
        id: '2',
        title: 'Automotive Industry Value Chain',
        items: [
            { id: '2-1', title: 'Size of Industry', type: 'video', status: 'completed' },
            { id: '2-2', title: 'Different Players in the Automotive Industry', type: 'read', status: 'completed' },
            { id: '2-3', title: 'Segments Of Automotive Industry', type: 'quiz', status: 'current' },
        ],
    },
    { id: '3', title: 'Size of Automotive Industry', isLocked: true },
    { id: '4', title: 'Major Players and Regions', isLocked: true },
    { id: '5', title: 'Career Opportunities and Success Development', isLocked: true },
    { id: '6', title: 'Next Module', isLocked: true },
    { id: '7', title: 'Next Module', isLocked: true },
    { id: '8', title: 'Quiz', isLocked: true },
    { id: '9', title: 'Quiz', isLocked: true },
    { id: '10', title: 'Next Module', isLocked: true },
];

/**
 * AutomotiveQuizInstructionsScreen
 * Screen displaying quiz instructions before starting the STEM Assessment
 * Based on Figma design node-id=7381-69727
 */
const AutomotiveQuizInstructionsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const handleHamburgerPress = () => {
        setIsMenuVisible(true);
    };

    const handleMenuClose = () => {
        setIsMenuVisible(false);
    };

    const handleMenuItemPress = (sectionId: string, itemId: string) => {
        setIsMenuVisible(false);
        if (itemId === '2-1') {
            navigation.navigate('CourseDetails', { courseTitle: 'Size of Industry' });
        } else if (itemId === '2-2') {
            navigation.navigate('ReadDifferentPlayers');
        }
    };

    const handlePreviousPress = () => {
        navigation.navigate('ReadingCompletion');
    };

    const handleNextPress = () => {
        // Navigate to test screen
        if (isChecked) {
            navigation.navigate('AutomotiveTest');
        }
    };

    const handleStartTestPress = () => {
        if (isChecked) {
            // Navigate to the Automotive Test screen
            navigation.navigate('AutomotiveTest');
        }
    };

    const handleCheckboxPress = () => {
        setIsChecked(!isChecked);
    };

    // Render hamburger icon
    const renderHamburgerIcon = () => (
        <View style={styles.hamburgerIconContainer}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
        </View>
    );

    // Render chevron left icon
    const renderChevronLeft = () => (
        <View style={styles.chevronLeftContainer}>
            <View style={styles.chevronLeftLine1} />
            <View style={styles.chevronLeftLine2} />
        </View>
    );

    // Render chevron right icon
    const renderChevronRight = () => (
        <View style={styles.chevronRightContainer}>
            <View style={styles.chevronRightLine1} />
            <View style={styles.chevronRightLine2} />
        </View>
    );

    // Render non-graded icon
    const renderNonGradedIcon = () => (
        <View style={styles.iconContainer}>
            <View style={styles.nonGradedCircle}>
                <View style={styles.nonGradedX1} />
                <View style={styles.nonGradedX2} />
            </View>
        </View>
    );

    // Render questions icon
    const renderQuestionsIcon = () => (
        <View style={styles.iconContainer}>
            <View style={styles.questionsDoc}>
                <View style={styles.questionsDocInner} />
            </View>
        </View>
    );

    // Render bookmark icon
    const renderBookmarkIcon = () => (
        <View style={styles.bookmarkIcon}>
            <View style={styles.bookmarkBody} />
        </View>
    );

    // Render bullet point
    const renderBulletPoint = (text: string, key: number) => (
        <View key={key} style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{text}</Text>
        </View>
    );

    // Render question tag
    const renderQuestionTag = (
        variant: 'unanswered' | 'selected' | 'answered' | 'review',
        number: string = '1'
    ) => {
        const tagStyles: ViewStyle[] = [styles.questionTag];
        let textStyle = styles.questionTagTextGrey;

        if (variant === 'unanswered') {
            tagStyles.push(styles.questionTagUnanswered);
        } else if (variant === 'selected') {
            tagStyles.push(styles.questionTagSelected);
            textStyle = styles.questionTagTextBlue;
        } else if (variant === 'answered') {
            tagStyles.push(styles.questionTagAnswered);
            textStyle = styles.questionTagTextWhite;
        } else if (variant === 'review') {
            tagStyles.push(styles.questionTagReview);
            textStyle = styles.questionTagTextWhite;
        }

        return (
            <View style={tagStyles}>
                <Text style={textStyle}>{number}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Top Navigation Header */}
            <View style={styles.header}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
                        Awareness On Automotive Industry
                    </Text>
                    <Text style={styles.headerSubtitle} numberOfLines={1} ellipsizeMode="tail">
                        Automotive Industry Value Chain
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.hamburgerButton}
                    onPress={handleHamburgerPress}
                    activeOpacity={0.7}
                >
                    {renderHamburgerIcon()}
                </TouchableOpacity>
            </View>

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
                    <View style={styles.decorativeStripe1} />
                    <View style={styles.decorativeStripe2} />

                    <View style={styles.assessmentContent}>
                        {/* UFO Illustration */}
                        <View style={styles.illustrationContainer}>
                            <View style={styles.illustrationCircle}>
                                <View style={styles.ufoBody}>
                                    <View style={styles.ufoDome} />
                                    <View style={styles.ufoBase} />
                                    <View style={styles.ufoLight1} />
                                    <View style={styles.ufoLight2} />
                                    <View style={styles.ufoLight3} />
                                </View>
                            </View>
                        </View>

                        <View style={styles.textContent}>
                            <Text style={styles.assessmentTitle}>STEM Assessment</Text>
                            <Text style={styles.assessmentDescription}>
                                Complete this quiz to learn how well you've understood the learnings of this module.
                            </Text>

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
                </View>

                {/* Instructions Card */}
                <View style={styles.instructionsCard}>
                    {/* About The Assessment */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About The Assessment</Text>
                        <Text style={styles.sectionDescription}>
                            The STEM Assessment will give you a comprehensive snapshot of your current UX/UI design skills, including your design thinking ability and your knowledge of the psychology of design, UX research, and design methodologies. You'll get learning recommendations based on your strengths and weaknesses and see how you stack up against other designers.
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Instructions */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Instructions</Text>
                        <View style={styles.bulletList}>
                            {renderBulletPoint('Each question is timed', 1)}
                            {renderBulletPoint('Do not use search engines or get help from others', 2)}
                            {renderBulletPoint("Once you've submitted an answer, you cannot go back", 3)}
                            {renderBulletPoint('You may exit the test, but the timer will continue to run', 4)}
                            {renderBulletPoint('You can retake the assessment every 60 days', 5)}
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Navigation */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Navigation</Text>
                        <View style={styles.navInstructionsList}>
                            {/* Mark For Review */}
                            <View style={styles.navInstruction}>
                                <View style={styles.navInstructionButton}>
                                    {renderBookmarkIcon()}
                                    <Text style={styles.markForReviewText}>Mark For Review</Text>
                                </View>
                                <Text style={styles.navInstructionDescription}>
                                    Click on this button to mark a question and review it later
                                </Text>
                            </View>

                            {/* Previous */}
                            <View style={styles.navInstruction}>
                                <View style={styles.previousButton}>
                                    <Text style={styles.previousButtonText}>Previous</Text>
                                </View>
                                <Text style={styles.navInstructionDescription}>
                                    Click on this button to go to previous question
                                </Text>
                            </View>

                            {/* Next */}
                            <View style={styles.navInstruction}>
                                <View style={styles.nextButton}>
                                    <Text style={styles.nextButtonText}>Next</Text>
                                </View>
                                <Text style={styles.navInstructionDescription}>
                                    Click on this button to go to next question
                                </Text>
                            </View>

                            {/* Submit Test */}
                            <View style={styles.navInstruction}>
                                <View style={styles.submitTestButton}>
                                    <Text style={styles.submitTestButtonText}>Submit Test</Text>
                                </View>
                                <Text style={styles.navInstructionDescription}>
                                    Click on this button to submit your test once you've reviewed all your answers
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Legend */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Legend</Text>
                        <View style={styles.legendList}>
                            <View style={styles.legendItem}>
                                {renderQuestionTag('unanswered')}
                                <Text style={styles.legendLabel}>Not Visited/Unanswered Question</Text>
                            </View>
                            <View style={styles.legendItem}>
                                {renderQuestionTag('selected')}
                                <Text style={styles.legendLabel}>Current Question</Text>
                            </View>
                            <View style={styles.legendItem}>
                                {renderQuestionTag('answered')}
                                <Text style={styles.legendLabel}>Answered Question</Text>
                            </View>
                            <View style={styles.legendItem}>
                                {renderQuestionTag('review')}
                                <Text style={styles.legendLabel}>Marked For Review Question</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Checkbox and Start Button */}
                <View style={styles.bottomSection}>
                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={handleCheckboxPress}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                            {isChecked && (
                                <View style={styles.checkmark}>
                                    <View style={styles.checkmarkLine1} />
                                    <View style={styles.checkmarkLine2} />
                                </View>
                            )}
                        </View>
                        <Text style={styles.checkboxLabel}>
                            I have read and understood all the instructions
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.startButton, !isChecked && styles.startButtonDisabled]}
                        onPress={handleStartTestPress}
                        activeOpacity={isChecked ? 0.7 : 1}
                        disabled={!isChecked}
                    >
                        <Text style={styles.startButtonText}>Start The Test</Text>
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
        paddingBottom: 32,
    },
    statusAndNavContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
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
    chevronLeftContainer: {
        width: 14,
        height: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chevronLeftLine1: {
        position: 'absolute',
        width: 8,
        height: 2,
        backgroundColor: '#72818c',
        borderRadius: 1,
        transform: [{ rotate: '-45deg' }, { translateY: -2 }],
    },
    chevronLeftLine2: {
        position: 'absolute',
        width: 8,
        height: 2,
        backgroundColor: '#72818c',
        borderRadius: 1,
        transform: [{ rotate: '45deg' }, { translateY: 2 }],
    },
    chevronRightContainer: {
        width: 14,
        height: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chevronRightLine1: {
        position: 'absolute',
        width: 8,
        height: 2,
        backgroundColor: colors.white,
        borderRadius: 1,
        transform: [{ rotate: '45deg' }, { translateY: -2 }],
    },
    chevronRightLine2: {
        position: 'absolute',
        width: 8,
        height: 2,
        backgroundColor: colors.white,
        borderRadius: 1,
        transform: [{ rotate: '-45deg' }, { translateY: 2 }],
    },
    assessmentCard: {
        backgroundColor: '#0049b5',
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
    iconContainer: {
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
    instructionsCard: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        padding: 24,
        marginTop: 20,
    },
    section: {
        gap: 12,
    },
    sectionTitle: {
        ...typography.p3Bold,
        color: colors.primaryDarkBlue,
        lineHeight: 23,
    },
    sectionDescription: {
        ...typography.p3Regular,
        color: colors.textGrey,
        lineHeight: 25,
    },
    divider: {
        height: 1,
        backgroundColor: colors.lightGrey,
        marginVertical: 24,
    },
    bulletList: {
        gap: 8,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    bulletDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.textGrey,
    },
    bulletText: {
        ...typography.p3Regular,
        color: colors.textGrey,
        flex: 1,
        lineHeight: 25,
    },
    navInstructionsList: {
        gap: 20,
    },
    navInstruction: {
        gap: 4,
    },
    navInstructionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    bookmarkIcon: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookmarkBody: {
        width: 14,
        height: 16,
        backgroundColor: colors.primaryBlue,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
    },
    markForReviewText: {
        ...typography.s1Regular,
        color: colors.primaryBlue,
        lineHeight: 16,
    },
    previousButton: {
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        borderRadius: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
        alignSelf: 'flex-start',
        minWidth: 173,
        alignItems: 'center',
    },
    previousButtonText: {
        ...typography.s2SemiBold,
        color: colors.primaryBlue,
        lineHeight: 13,
    },
    nextButton: {
        backgroundColor: colors.primaryBlue,
        borderRadius: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
        alignSelf: 'flex-start',
        minWidth: 173,
        alignItems: 'center',
    },
    nextButtonText: {
        ...typography.s2SemiBold,
        color: colors.white,
        lineHeight: 13,
    },
    submitTestButton: {
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        borderRadius: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
        alignSelf: 'flex-start',
        minWidth: 173,
        alignItems: 'center',
    },
    submitTestButtonText: {
        ...typography.s2SemiBold,
        color: colors.primaryBlue,
        lineHeight: 13,
    },
    navInstructionDescription: {
        ...typography.p4,
        color: colors.textGrey,
        lineHeight: 20,
    },
    legendList: {
        gap: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    legendLabel: {
        ...typography.p4,
        color: colors.textGrey,
        lineHeight: 20,
    },
    questionTag: {
        width: 32,
        height: 32,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionTagUnanswered: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
    },
    questionTagSelected: {
        backgroundColor: colors.white,
        borderWidth: 2,
        borderColor: colors.primaryBlue,
    },
    questionTagAnswered: {
        backgroundColor: colors.primaryBlue,
    },
    questionTagReview: {
        backgroundColor: '#f18522',
    },
    questionTagTextGrey: {
        ...typography.p4,
        color: colors.textGrey,
        lineHeight: 20,
    },
    questionTagTextBlue: {
        ...typography.p4,
        color: colors.primaryBlue,
        lineHeight: 20,
    },
    questionTagTextWhite: {
        ...typography.p4,
        color: colors.white,
        lineHeight: 20,
    },
    bottomSection: {
        paddingHorizontal: 16,
        paddingTop: 20,
        gap: 16,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    checkbox: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        borderRadius: 2.67,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    checkboxChecked: {
        backgroundColor: colors.primaryBlue,
    },
    checkmark: {
        width: 10,
        height: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmarkLine1: {
        position: 'absolute',
        width: 3,
        height: 1.5,
        backgroundColor: colors.white,
        borderRadius: 0.5,
        transform: [{ rotate: '45deg' }, { translateX: -2 }, { translateY: 1 }],
    },
    checkmarkLine2: {
        position: 'absolute',
        width: 6,
        height: 1.5,
        backgroundColor: colors.white,
        borderRadius: 0.5,
        transform: [{ rotate: '-45deg' }, { translateX: 1 }, { translateY: -1 }],
    },
    checkboxLabel: {
        ...typography.p4,
        color: colors.primaryDarkBlue,
        flex: 1,
        lineHeight: 20,
    },
    startButton: {
        backgroundColor: colors.primaryBlue,
        borderRadius: 8,
        paddingHorizontal: 24,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    startButtonDisabled: {
        opacity: 0.5,
    },
    startButtonText: {
        ...typography.p4SemiBold,
        color: colors.white,
        lineHeight: 20,
    },
});

export default AutomotiveQuizInstructionsScreen;
