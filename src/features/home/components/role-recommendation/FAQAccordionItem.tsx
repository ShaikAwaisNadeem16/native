import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography } from '../../../../styles/theme';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

interface FAQAccordionItemProps {
    question: string;
    answer: string;
    isExpanded: boolean;
    onToggle: () => void;
}

/**
 * FAQAccordionItem - Reusable FAQ accordion item component
 * Matches Figma design: node 12085:62214
 */
const FAQAccordionItem: React.FC<FAQAccordionItemProps> = ({
    question,
    answer,
    isExpanded,
    onToggle,
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.questionContainer}
                onPress={onToggle}
                activeOpacity={0.7}
            >
                <Text style={styles.question} numberOfLines={isExpanded ? undefined : 2}>
                    {question}
                </Text>
                <View style={styles.iconContainer}>
                    {isExpanded ? (
                        <ChevronUp size={24} color={colors.placeholderGrey} />
                    ) : (
                        <ChevronDown size={24} color={colors.placeholderGrey} />
                    )}
                </View>
            </TouchableOpacity>
            {isExpanded && (
                <View style={styles.answerContainer}>
                    <Text style={styles.answer}>{answer}</Text>
                </View>
            )}
            <View style={styles.divider} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    questionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center items with gap
        gap: 40, // Exact Figma gap
        paddingVertical: 0, // No padding, gap handled by parent
        width: '100%',
    },
    question: {
        ...typography.p3Bold, // 16px Bold, line-height 23px
        color: colors.primaryDarkBlue,
        flex: 1, // Takes available space
        minWidth: 0, // Allow text to shrink
    },
    iconContainer: {
        width: 24, // Exact Figma icon size
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    answerContainer: {
        paddingTop: 16, // Gap between question and answer when expanded
        paddingBottom: 0,
    },
    answer: {
        ...typography.p4, // 14px Regular, line-height 20px
        color: colors.textGrey,
    },
    divider: {
        height: 1,
        backgroundColor: colors.lightGrey,
        width: '100%',
        marginTop: 0, // No margin, divider is part of the item
    },
});

export default FAQAccordionItem;

