import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';

type QuestionTagState = 'Unanswered' | 'Selected' | 'Answered' | 'Review Unanswered' | 'Review Answered' | 'Correct' | 'Incorrect';

interface TestQuestionTagProps {
    questionNo?: string;
    state?: QuestionTagState;
    size?: number; // Default 32, but can be 36 for test screen
}

const TestQuestionTag: React.FC<TestQuestionTagProps> = ({
    questionNo,
    state = 'Unanswered',
    size = 32,
}) => {
    const isUnanswered = state === 'Unanswered';
    const isSelected = state === 'Selected';
    const isAnswered = state === 'Answered';
    const isReviewUnanswered = state === 'Review Unanswered';
    const isReviewAnswered = state === 'Review Answered';
    const isCorrect = state === 'Correct';
    const isIncorrect = state === 'Incorrect';

    // Determine container style
    const getContainerStyle = () => {
        if (isCorrect) {
            return [styles.container, styles.containerCorrect];
        }
        if (isIncorrect) {
            return [styles.container, styles.containerIncorrect];
        }
        if (isUnanswered) {
            return [styles.container, styles.containerUnanswered];
        }
        if (isSelected) {
            return [styles.container, styles.containerSelected];
        }
        if (isAnswered) {
            return [styles.container, styles.containerAnswered];
        }
        if (isReviewUnanswered) {
            return [styles.container, styles.containerReviewUnanswered];
        }
        if (isReviewAnswered) {
            return [styles.container, styles.containerReviewAnswered];
        }
        return styles.container;
    };

    // Determine text style
    const getTextStyle = () => {
        if (isCorrect || isIncorrect) {
            return styles.textAnswered; // White text for correct/incorrect
        }
        if (isUnanswered) {
            return styles.textUnanswered;
        }
        if (isSelected) {
            return styles.textSelected;
        }
        if (isAnswered) {
            return styles.textAnswered;
        }
        if (isReviewUnanswered) {
            return styles.textReviewUnanswered;
        }
        if (isReviewAnswered) {
            return styles.textReviewAnswered;
        }
        return styles.textUnanswered;
    };

    return (
        <View style={[getContainerStyle(), { width: size, height: size }]}>
            {isReviewAnswered && <View style={styles.reviewIndicator} />}
            {questionNo && <Text style={getTextStyle()}>{questionNo}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 32,
        height: 32,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        overflow: 'hidden',
    },
    containerUnanswered: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
    },
    containerSelected: {
        backgroundColor: colors.white,
        borderWidth: 2,
        borderColor: colors.primaryBlue,
    },
    containerAnswered: {
        backgroundColor: colors.primaryBlue,
    },
    containerReviewUnanswered: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: colors.reviewOrange,
    },
    containerReviewAnswered: {
        backgroundColor: colors.primaryBlue,
    },
    containerCorrect: {
        backgroundColor: colors.successGreen, // Green for correct answers
    },
    containerIncorrect: {
        backgroundColor: colors.error, // Red for incorrect answers
    },
    textUnanswered: {
        ...typography.p4,
        color: colors.textGrey,
    },
    textSelected: {
        ...typography.p4,
        color: colors.primaryBlue,
    },
    textAnswered: {
        ...typography.p4,
        color: '#FFFFFF',
        zIndex: 10,
        elevation: 5, // Android z-index equivalent
    },
    textReviewUnanswered: {
        ...typography.p4,
        color: colors.reviewOrange,
    },
    textReviewAnswered: {
        ...typography.p4,
        color: colors.white,
    },
    reviewIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 18,
        backgroundColor: colors.reviewOrange,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
});

export default TestQuestionTag;

