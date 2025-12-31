import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bookmark, ChevronDown } from 'lucide-react-native';
import { colors, typography, borderRadius } from '../styles/theme';
import TimerProgress from '../components/Test/TimerProgress';
import TestQuestionTag from '../components/Test/TestQuestionTag';
import AnswerOption from '../components/Test/AnswerOption';
import PrimaryButton from '../components/SignUp/PrimaryButton';

const TestScreen: React.FC = () => {
    const [isMenuExpanded, setIsMenuExpanded] = useState(true); // Menu expanded by default
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

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

    const handleAnswerSelect = (optionNumber: string) => {
        setSelectedAnswer(optionNumber);
    };

    // Question tags data - showing different states
    const questionTags = [
        { number: '1', state: 'Answered' as const },
        { number: '2', state: 'Answered' as const },
        { number: '', state: 'Review Unanswered' as const },
        { number: '4', state: 'Answered' as const },
        { number: '5', state: 'Answered' as const },
        { number: '6', state: 'Selected' as const },
        { number: '7', state: 'Unanswered' as const },
        { number: '8', state: 'Unanswered' as const },
        { number: '9', state: 'Unanswered' as const },
        { number: '10', state: 'Unanswered' as const },
        { number: '11', state: 'Unanswered' as const },
        { number: '12', state: 'Unanswered' as const },
        { number: '13', state: 'Unanswered' as const },
        { number: '14', state: 'Unanswered' as const },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Top Navigation */}
            <View style={styles.topNavigation}>
                <View style={styles.topNavigationContent}>
                    {/* Timer Section */}
                    <View style={styles.timerSection}>
                        <TimerProgress
                            timeRemaining="02:00:00"
                            timeLabel="TIME REMAINING: PART 1"
                            percentage={100}
                        />
                    </View>
                    {/* Expanded Menu Content */}
                    {isMenuExpanded && (
                        <View style={styles.menuContent}>
                            <View style={styles.testInfo}>
                                <Text style={styles.testSubtitle}>STEM ASSESSMENT</Text>
                                <Text style={styles.testTitle}>Part 1 of 4: Science</Text>
                            </View>
                            <View style={styles.questionTagsContainer}>
                                {questionTags.map((tag, index) => (
                                    <TestQuestionTag
                                        key={index}
                                        questionNo={tag.number}
                                        state={tag.state}
                                        size={36}
                                    />
                                ))}
                            </View>
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleSubmitTest}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.submitButtonText}>Submit Test</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                {/* Menu Toggle Button */}
                <TouchableOpacity
                    style={styles.menuToggle}
                    onPress={() => setIsMenuExpanded(!isMenuExpanded)}
                    activeOpacity={0.7}
                >
                    <View style={styles.menuToggleCircle}>
                        <ChevronDown
                            size={24}
                            color={isMenuExpanded ? colors.primaryBlue : colors.textGrey}
                            style={[styles.chevron, isMenuExpanded && styles.chevronRotated]}
                        />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Question Section (Passage section is hidden in this view) */}
                <View style={styles.questionSection}>
                    <View style={styles.questionHeader}>
                        <Text style={styles.questionType}>PASSAGE SINGLE CHOICE QUESTION</Text>
                        <Text style={styles.questionText}>
                            Who among the following is sitting opposite to the person who is sitting second to the left of T
                        </Text>
                    </View>
                    <View style={styles.answerOptions}>
                        <AnswerOption
                            optionText="Standard Design Vehicle"
                            optionNumber="1"
                            isSelected={selectedAnswer === '1'}
                            onPress={() => handleAnswerSelect('1')}
                        />
                        <AnswerOption
                            optionText="Solar Driven Vehicle"
                            optionNumber="2"
                            isSelected={selectedAnswer === '2'}
                            onPress={() => handleAnswerSelect('2')}
                        />
                        <AnswerOption
                            optionText="Speedy Driven Vehicle"
                            optionNumber="3"
                            isSelected={selectedAnswer === '3'}
                            onPress={() => handleAnswerSelect('3')}
                        />
                        <AnswerOption
                            optionText="Software Defined Vehicle"
                            optionNumber="4"
                            isSelected={selectedAnswer === '4'}
                            onPress={() => handleAnswerSelect('4')}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNavigation}>
                <TouchableOpacity
                    style={styles.markForReviewButton}
                    onPress={handleMarkForReview}
                    activeOpacity={0.7}
                >
                    <Bookmark size={24} color={colors.primaryBlue} />
                    <Text style={styles.markForReviewText}>Mark For Review</Text>
                </TouchableOpacity>
                <View style={styles.navButtons}>
                    <TouchableOpacity
                        style={styles.previousButton}
                        onPress={handlePrevious}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.previousButtonText}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={handleNext}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        backgroundColor: colors.white,
        alignItems: 'center',
    },
    topNavigationContent: {
        width: '100%',
    },
    timerSection: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey,
    },
    menuToggle: {
        alignItems: 'center',
        paddingVertical: 8,
        width: 81,
        height: 40,
    },
    menuToggleCircle: {
        width: 81,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: colors.white,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: colors.lightGrey,
    },
    chevron: {
        transform: [{ rotate: '0deg' }],
    },
    chevronRotated: {
        transform: [{ rotate: '180deg' }],
    },
    menuContent: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 20,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        backgroundColor: colors.white,
    },
    testInfo: {
        flexDirection: 'column',
        gap: 4,
        width: '100%',
    },
    testSubtitle: {
        ...typography.s1Regular,
        color: colors.textGrey,
    },
    testTitle: {
        ...typography.p3Bold,
        color: colors.primaryDarkBlue,
    },
    questionTagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        width: '100%',
        // Ensure proper wrapping - 14 tags with 36px width + 12px gaps
    },
    submitButton: {
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    submitButtonText: {
        ...typography.p4SemiBold,
        color: colors.primaryBlue,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 20,
    },
    questionSection: {
        flexDirection: 'column',
        gap: 24,
        width: '100%',
    },
    questionHeader: {
        flexDirection: 'column',
        gap: 4,
        width: '100%',
    },
    questionType: {
        ...typography.s1Regular,
        color: colors.textGrey,
    },
    questionText: {
        ...typography.p4SemiBold,
        color: colors.primaryDarkBlue,
    },
    answerOptions: {
        flexDirection: 'column',
        gap: 16,
        width: '100%',
    },
    bottomNavigation: {
        borderTopWidth: 1,
        borderTopColor: colors.lightGrey,
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 20,
    },
    markForReviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
    },
    markForReviewText: {
        ...typography.p4,
        color: colors.primaryBlue,
    },
    navButtons: {
        flexDirection: 'row',
        gap: 20,
        width: '100%',
    },
    previousButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 140,
    },
    previousButtonText: {
        ...typography.p4SemiBold,
        color: colors.primaryBlue,
    },
    nextButton: {
        flex: 1,
        backgroundColor: colors.primaryBlue,
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 140,
    },
    nextButtonText: {
        ...typography.p4SemiBold,
        color: colors.white,
    },
});

export default TestScreen;

