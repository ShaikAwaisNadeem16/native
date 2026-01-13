import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography } from '../../styles/theme';

export interface LessonItemProps {
    title: string; // Lesson name
    sub?: string; // Lesson sub (e.g., "Graded Quiz 2 hours", "Video 5 mins")
    type?: string; // "Video", "Read", "Quiz", "Assignment", etc.
    duration?: string; // "10 mins", "5 mins", etc.
    lessonId?: string; // Lesson ID for navigation
    isLocked?: boolean; // Lesson lock state from API
    onPress?: () => void; // Callback when lesson is pressed
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
    isLocked = false,
    onPress,
}) => {
    // Use sub if provided, otherwise fall back to type + duration
    const displaySub = sub || (type && duration ? `${type} • ${duration}` : type || duration || '');

    const handlePress = () => {
        if (isLocked) return; // Locked lessons cannot be clicked
        onPress?.();
    };

    return (
        <TouchableOpacity
            style={[styles.container, isLocked && styles.containerLocked]}
            onPress={handlePress}
            activeOpacity={isLocked ? 1 : 0.7}
            disabled={isLocked}
        >
            <View style={styles.content}>
                {isLocked && (
                    <View style={styles.lockIconContainer}>
                        <View style={styles.lockIcon}>
                            <View style={styles.lockBody}>
                                <View style={styles.lockShackle} />
                            </View>
                        </View>
                    </View>
                )}
                <View style={styles.textContainer}>
                    <Text style={[styles.title, isLocked && styles.titleLocked]}>{title}</Text>
                    {displaySub && (
                        <View style={styles.metadataRow}>
                            <Text style={[styles.subText, isLocked && styles.subTextLocked]}>{displaySub}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 4,
        width: '100%',
    },
    containerLocked: {
        opacity: 0.6,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        width: '100%',
    },
    lockIconContainer: {
        width: 16,
        height: 18,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 2,
    },
    lockIcon: {
        width: 12,
        height: 14,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    lockBody: {
        width: 10,
        height: 8,
        backgroundColor: colors.textGrey,
        borderRadius: 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    lockShackle: {
        position: 'absolute',
        top: -4,
        width: 7,
        height: 5,
        borderWidth: 1.5,
        borderColor: colors.textGrey,
        borderBottomWidth: 0,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: 'transparent',
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
    },
    title: {
        ...typography.p4,
        color: colors.primaryDarkBlue,
    },
    titleLocked: {
        color: colors.textGrey,
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
    subTextLocked: {
        opacity: 0.7,
    },
});

export default LessonItem;


