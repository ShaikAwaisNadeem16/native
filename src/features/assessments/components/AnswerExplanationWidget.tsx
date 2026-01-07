import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';

export type ExplanationType = 'correct' | 'incorrect';

interface AnswerExplanationWidgetProps {
    type: ExplanationType;
    onPrevious: () => void;
    onNext: () => void;
}

/**
 * AnswerExplanationWidget Component
 * Bottom widget showing correct/incorrect status and navigation buttons
 * Based on Figma designs: node-id=7381-70178 (correct) and node-id=7381-68814 (incorrect)
 */
const AnswerExplanationWidget: React.FC<AnswerExplanationWidgetProps> = ({
    type,
    onPrevious,
    onNext,
}) => {
    const isCorrect = type === 'correct';

    return (
        <View
            style={[
                styles.container,
                isCorrect ? styles.containerCorrect : styles.containerIncorrect,
            ]}
        >
            {/* Status indicator */}
            <View style={styles.statusContainer}>
                <View style={styles.iconContainer}>
                    {isCorrect ? (
                        <Check size={32} color={colors.successGreen} />
                    ) : (
                        <X size={32} color={colors.error} />
                    )}
                </View>
                <Text
                    style={[
                        styles.statusText,
                        isCorrect ? styles.statusTextCorrect : styles.statusTextIncorrect,
                    ]}
                >
                    {isCorrect ? 'Correct' : 'Incorrect'}
                </Text>
            </View>

            {/* Navigation buttons */}
            <View style={styles.navButtons}>
                <TouchableOpacity
                    style={[
                        styles.previousButton,
                        isCorrect ? styles.previousButtonCorrect : styles.previousButtonIncorrect,
                    ]}
                    onPress={onPrevious}
                    activeOpacity={0.7}
                >
                    <Text
                        style={[
                            styles.previousButtonText,
                            isCorrect
                                ? styles.previousButtonTextCorrect
                                : styles.previousButtonTextIncorrect,
                        ]}
                    >
                        Previous
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.nextButton,
                        isCorrect ? styles.nextButtonCorrect : styles.nextButtonIncorrect,
                    ]}
                    onPress={onNext}
                    activeOpacity={0.7}
                >
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: colors.lightGrey,
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 20,
        backgroundColor: colors.white,
    },
    containerCorrect: {
        backgroundColor: 'rgba(233, 247, 239, 1)', // Light green background from Figma
    },
    containerIncorrect: {
        backgroundColor: '#fdeeee', // Light red/pink background from Figma
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'center',
    },
    iconContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusText: {
        ...typography.p1Bold,
        color: colors.primaryDarkBlue,
    },
    statusTextCorrect: {
        color: colors.primaryDarkBlue,
    },
    statusTextIncorrect: {
        color: colors.primaryDarkBlue,
    },
    navButtons: {
        flexDirection: 'row',
        gap: 20,
        width: '100%',
    },
    previousButton: {
        flex: 1,
        borderWidth: 1,
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 140,
        backgroundColor: colors.white,
    },
    previousButtonCorrect: {
        borderColor: colors.successGreen,
    },
    previousButtonIncorrect: {
        borderColor: colors.error,
    },
    previousButtonText: {
        ...typography.p4SemiBold,
    },
    previousButtonTextCorrect: {
        color: colors.successGreen,
    },
    previousButtonTextIncorrect: {
        color: colors.error,
    },
    nextButton: {
        flex: 1,
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 140,
    },
    nextButtonCorrect: {
        backgroundColor: colors.successGreen,
    },
    nextButtonIncorrect: {
        backgroundColor: colors.error,
    },
    nextButtonText: {
        ...typography.p4SemiBold,
        color: colors.white,
    },
});

export default AnswerExplanationWidget;






