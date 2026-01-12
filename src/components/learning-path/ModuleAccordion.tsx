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
    onPress?: () => void; // Callback when module is pressed
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
    onPress,
}) => {
    const handlePress = () => {
        onPress?.();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.header}
                onPress={handlePress}
                activeOpacity={0.7}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.title} numberOfLines={isExpanded ? undefined : 2}>
                        {title}
                    </Text>
                    <View style={styles.iconContainer}>
                        {isExpanded ? (
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
});

export default ModuleAccordion;

