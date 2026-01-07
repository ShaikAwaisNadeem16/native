import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';

export type AnswerOptionState = 'default' | 'correct' | 'incorrect';

interface ExplanationAnswerOptionProps {
    optionText: string;
    optionNumber: string;
    state?: AnswerOptionState;
}

/**
 * ExplanationAnswerOption Component
 * Read-only answer option for explanation screens
 * Shows correct/incorrect states from Figma design
 */
const ExplanationAnswerOption: React.FC<ExplanationAnswerOptionProps> = ({
    optionText,
    optionNumber,
    state = 'default',
}) => {
    const isCorrect = state === 'correct';
    const isIncorrect = state === 'incorrect';

    return (
        <View style={styles.container}>
            {/* Background shadow layer */}
            <View
                style={[
                    styles.backgroundShadow,
                    isCorrect && styles.backgroundShadowCorrect,
                    isIncorrect && styles.backgroundShadowIncorrect,
                ]}
            />
            {/* Option container */}
            <View
                style={[
                    styles.optionContainer,
                    isCorrect && styles.optionContainerCorrect,
                    isIncorrect && styles.optionContainerIncorrect,
                ]}
            >
                <Text style={styles.optionText} numberOfLines={2}>
                    {optionText}
                </Text>
                <View
                    style={[
                        styles.optionNumberContainer,
                        isCorrect && styles.optionNumberContainerCorrect,
                        isIncorrect && styles.optionNumberContainerIncorrect,
                    ]}
                >
                    <Text style={styles.optionNumber}>{optionNumber}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'relative',
    },
    backgroundShadow: {
        position: 'absolute',
        top: 2,
        left: 0,
        right: 0,
        height: 49,
        backgroundColor: colors.lightGrey,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.input,
    },
    backgroundShadowCorrect: {
        backgroundColor: colors.successGreen,
        borderColor: colors.successGreen,
    },
    backgroundShadowIncorrect: {
        backgroundColor: colors.error,
        borderColor: colors.error,
    },
    optionContainer: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.input,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 48,
        minHeight: 49,
    },
    optionContainerCorrect: {
        borderColor: colors.successGreen,
    },
    optionContainerIncorrect: {
        borderColor: colors.error,
    },
    optionText: {
        ...typography.p4,
        color: colors.textGrey,
        flex: 1,
    },
    optionNumberContainer: {
        width: 25,
        height: 25,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    optionNumberContainerCorrect: {
        borderColor: colors.successGreen,
    },
    optionNumberContainerIncorrect: {
        borderColor: colors.error,
    },
    optionNumber: {
        ...typography.s1Regular,
        color: colors.textGrey,
    },
});

export default ExplanationAnswerOption;






