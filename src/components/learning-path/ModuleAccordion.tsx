import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, borderRadius, shadows } from '../../styles/theme';
import DownwardArrow from '../common/DownwardArrow';
import GreaterIcon from '../common/GreaterIcon';
import LessonItem, { LessonItemProps } from './LessonItem';

export interface ModuleAccordionProps {
    title: string; // Module title
    description?: string; // Module description/summary
    duration?: string; // Module duration
    lessons?: LessonItemProps[]; // Array of lessons
    isExpanded?: boolean; // Initial expanded state
    isLocked?: boolean; // Module lock state from API
    onPress?: () => void; // Callback when module is pressed
    onLessonPress?: (lessonId: string, isLocked: boolean) => void; // Callback when lesson is pressed
}

/**
 * ModuleAccordion - Reusable expandable/collapsible module component
 * Matches Figma design: node 808:3128 (Expanded) and 808:3230 (Collapsed)
 */
const ModuleAccordion: React.FC<ModuleAccordionProps> = ({
    title,
    description,
    duration,
    lessons = [],
    isExpanded = false,
    isLocked = false,
    onPress,
    onLessonPress,
}) => {
    const handlePress = () => {
        // Locked modules cannot be expanded
        if (isLocked) return;
        onPress?.();
    };

    return (
        <View style={[styles.container, isLocked && styles.containerLocked]}>
            <TouchableOpacity
                style={[styles.header, isLocked && styles.headerLocked]}
                onPress={handlePress}
                activeOpacity={isLocked ? 1 : 0.7}
                disabled={isLocked}
            >
                <View style={styles.headerContent}>
                    <Text style={[styles.title, isLocked && styles.titleLocked]} numberOfLines={isExpanded ? undefined : 2}>
                        {title}
                    </Text>
                    <View style={styles.iconContainer}>
                        {isLocked ? (
                            <View style={styles.lockIcon}>
                                <View style={styles.lockBody}>
                                    <View style={styles.lockShackle} />
                                </View>
                            </View>
                        ) : isExpanded ? (
                            <DownwardArrow size={24} style={styles.iconRotated} />
                        ) : (
                            <DownwardArrow size={24} />
                        )}
                    </View>
                </View>
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.expandedContent}>
                    {/* Description */}
                    {description && (
                        <Text style={styles.description}>{description}</Text>
                    )}

                    {/* Duration */}
                    {duration && (
                        <Text style={styles.duration}>{duration}</Text>
                    )}

                    {/* Separator */}
                    {(description || duration) && (
                        <View style={styles.separator} />
                    )}

                    {/* Lessons List */}
                    {lessons.length > 0 && (
                        <View style={styles.lessonsContainer}>
                            {lessons.map((lesson, index) => (
                                <LessonItem
                                    key={lesson.lessonId || index}
                                    title={lesson.title}
                                    sub={lesson.sub}
                                    type={lesson.type}
                                    duration={lesson.duration}
                                    lessonId={lesson.lessonId}
                                    isLocked={lesson.isLocked}
                                    onPress={() => onLessonPress?.(lesson.lessonId || '', lesson.isLocked || false)}
                                />
                            ))}
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.card,
        padding: 24,
        width: '100%',
        gap: 20,
        ...shadows.activeElement,
    },
    header: {
        width: '100%',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 40,
        width: '100%',
    },
    iconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconRotated: {
        transform: [{ rotate: '180deg' }],
    },
    title: {
        ...typography.p3Bold,
        color: colors.primaryDarkBlue,
        flex: 1,
    },
    expandedContent: {
        flexDirection: 'column',
        gap: 20,
        width: '100%',
    },
    description: {
        ...typography.p4,
        color: colors.textGrey,
    },
    duration: {
        ...typography.interRegular12,
        color: colors.textGrey,
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: colors.lightGrey,
    },
    lessonsContainer: {
        flexDirection: 'column',
        gap: 20,
        width: '100%',
    },
    containerLocked: {
        opacity: 0.6,
    },
    headerLocked: {
        opacity: 0.6,
    },
    titleLocked: {
        color: colors.textGrey,
    },
    lockIcon: {
        width: 16,
        height: 18,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    lockBody: {
        width: 12,
        height: 9,
        backgroundColor: colors.textGrey,
        borderRadius: 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    lockShackle: {
        position: 'absolute',
        top: -5,
        width: 8,
        height: 6,
        borderWidth: 2,
        borderColor: colors.textGrey,
        borderBottomWidth: 0,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        backgroundColor: 'transparent',
    },
});

export default ModuleAccordion;

