import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';

interface ExplanationSectionProps {
    title?: string;
    explanation: string;
}

/**
 * ExplanationSection Component
 * Displays explanation text in a highlighted box
 * Based on Figma design (highlight-blue background)
 */
const ExplanationSection: React.FC<ExplanationSectionProps> = ({
    title = 'Explanation',
    explanation,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.text}>{explanation}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.highlightBlue,
        borderRadius: borderRadius.input,
        padding: 24,
        gap: 8,
        width: '100%',
    },
    title: {
        ...typography.p3Bold,
        color: colors.primaryDarkBlue,
    },
    text: {
        ...typography.p4,
        color: colors.textGrey,
        lineHeight: 20,
    },
});

export default ExplanationSection;






