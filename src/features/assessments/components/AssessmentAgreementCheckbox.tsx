import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography } from '../../../styles/theme';
import Checkbox from '../../../components/SignUp/Checkbox';

interface AssessmentAgreementCheckboxProps {
    checked: boolean;
    onToggle: () => void;
    termsText: string;
}

/**
 * Assessment agreement checkbox component
 * Matches Figma design exactly
 * Displays checkbox with terms text
 */
const AssessmentAgreementCheckbox: React.FC<AssessmentAgreementCheckboxProps> = ({
    checked,
    onToggle,
    termsText,
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={onToggle}
                activeOpacity={0.7}
            >
                <View style={styles.checkboxWrapper}>
                    <Checkbox checked={checked} onToggle={onToggle} size={16} />
                </View>
            </TouchableOpacity>
            <Text style={styles.termsText}>{termsText}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
        width: '100%',
    },
    checkboxContainer: {
        paddingTop: 2, // Align checkbox with first line of text
    },
    checkboxWrapper: {
        width: 16,
        height: 16,
    },
    termsText: {
        ...typography.s1Regular,
        color: colors.textGrey,
        flex: 1,
        lineHeight: 16,
    },
});

export default AssessmentAgreementCheckbox;

