import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../styles/theme';

export interface LessonItemProps {
    title: string; // Lesson name
    sub?: string; // Lesson sub (e.g., "Graded Quiz 2 hours", "Video 5 mins")
    type?: string; // "Video", "Read", "Quiz", "Assignment", etc.
    duration?: string; // "10 mins", "5 mins", etc.
    lessonId?: string; // Lesson ID for navigation
}

/**
 * LessonItem - Reusable component for displaying a lesson in a module
 * Matches Figma design: node 808:3102
 */
const LessonItem: React.FC<LessonItemProps> = ({
    title,
    sub,
    type,
    duration,
    lessonId,
}) => {
    // Use sub if provided, otherwise fall back to type + duration
    const displaySub = sub || (type && duration ? `${type} • ${duration}` : type || duration || '');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {displaySub && (
                <View style={styles.metadataRow}>
                    <Text style={styles.subText}>{displaySub}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 4,
        width: '100%',
    },
    title: {
        ...typography.p4,
        color: colors.primaryDarkBlue,
    },
    metadataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    subText: {
        ...typography.interRegular12,
        color: colors.textGrey,
    },
});

export default LessonItem;


