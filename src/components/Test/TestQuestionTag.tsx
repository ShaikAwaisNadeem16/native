import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '../../styles/theme';

type QuestionTagState = 'Unanswered' | 'Selected' | 'Answered' | 'Review Unanswered' | 'Review Answered';

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

    // Determine container style
    const getContainerStyle = () => {
        if (isUnanswered) {
            return [styles.container, styles.containerUnanswered];
        }
        if (isSelected) {
            return [styles.container, styles.containerSelected];
        }
        if (isAnswered) {
            return [styles.container, styles.containerAnswered];
        }
        if (isReviewUnanswered || isReviewAnswered) {
            return [styles.container, styles.containerReview];
        }
        return styles.container;
    };

    // Determine text style
    const getTextStyle = () => {
        if (isUnanswered) {
            return styles.textUnanswered;
        }
        if (isSelected) {
            return styles.textSelected;
        }
        if (isAnswered || isReviewUnanswered || isReviewAnswered) {
            return styles.textAnswered;
        }
        return styles.textUnanswered;
    };

    return (
        <View style={[getContainerStyle(), { width: size, height: size }]}>
            {questionNo && <Text style={getTextStyle()}>{questionNo}</Text>}
            {isReviewAnswered && <View style={styles.reviewIndicator} />}
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
    containerReview: {
        backgroundColor: '#f18522', // Orange from Figma
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
        color: colors.white,
    },
    reviewIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 18,
        backgroundColor: colors.primaryBlue,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
});

export default TestQuestionTag;

