import React from 'react';
import { View, StyleSheet } from 'react-native';
import AssessmentAgreementCheckbox from './AssessmentAgreementCheckbox';
import StartQuizButton from './StartQuizButton';

interface AssessmentInstructionsFooterProps {
    termsText: string;
    buttonLabel: string;
    checked: boolean;
    onCheckboxToggle: () => void;
    onStartQuiz: () => void;
    loading?: boolean;
}

/**
 * Footer component for assessment instructions
 * Contains checkbox agreement and Start Quiz button
 * Matches Figma design exactly
 */
const AssessmentInstructionsFooter: React.FC<AssessmentInstructionsFooterProps> = ({
    termsText,
    buttonLabel,
    checked,
    onCheckboxToggle,
    onStartQuiz,
    loading = false,
}) => {
    return (
        <View style={styles.container}>
            <AssessmentAgreementCheckbox
                checked={checked}
                onToggle={onCheckboxToggle}
                termsText={termsText}
            />
            <StartQuizButton
                label={buttonLabel}
                onPress={onStartQuiz}
                disabled={!checked}
                loading={loading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 16,
        width: '100%',
        paddingHorizontal: 24,
        paddingVertical: 0,
    },
});

export default AssessmentInstructionsFooter;

