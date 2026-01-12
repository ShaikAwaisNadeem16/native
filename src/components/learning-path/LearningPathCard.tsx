import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, borderRadius, shadows } from '../../styles/theme';
import PrimaryButton from '../SignUp/PrimaryButton';

export interface LearningPathCardProps {
    subtitle?: string; // "LEARNING PATH"
    title: string; // Course title
    description: string; // Course description
    skills?: string[]; // Array of skill names
    modulesCount?: string; // "5 Modules"
    level?: string; // "Beginner"
    duration?: string; // "3 hours"
    progressPercentage?: number; // 0-100
    onResumePress?: () => void;
    onStartLearningPress?: () => void; // "Start Learning" button handler
}

/**
 * LearningPathCard - Reusable card component for learning path details
 * Matches Figma design: node 7381-72828
 */
const LearningPathCard: React.FC<LearningPathCardProps> = ({
    subtitle = 'LEARNING PATH',
    title,
    description,
    skills = [],
    modulesCount,
    level,
    duration,
    progressPercentage = 0,
    onResumePress,
    onStartLearningPress,
}) => {
    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerSection}>
                {subtitle && (
                    <Text style={styles.subtitle}>{subtitle}</Text>
                )}
                <View style={styles.titleDescriptionContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                </View>
            </View>

            {/* Key Skills Section */}
            {skills.length > 0 && (
                <View style={styles.skillsSection}>
                    <Text style={styles.skillsLabel}>Key Skills:</Text>
                    <View style={styles.skillsContainer}>
                        {skills.map((skill, index) => (
                            <View key={index} style={styles.skillChip}>
                                <Text style={styles.skillText}>{skill}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Start Learning Button */}
            {onStartLearningPress && (
                <View style={styles.startLearningContainer}>
                    <PrimaryButton
                        label="Start Learning"
                        onPress={onStartLearningPress}
                    />
                </View>
            )}

            {/* CTA and Course Details */}
            <View style={styles.detailsSection}>
                {/* Metadata Row */}
                {(modulesCount || level || duration) && (
                    <View style={styles.metadataRow}>
                        {modulesCount && <Text style={styles.metadataText}>{modulesCount}</Text>}
                        {modulesCount && level && <View style={styles.dot} />}
                        {level && <Text style={styles.metadataText}>{level}</Text>}
                        {level && duration && <View style={styles.dot} />}
                        {duration && <Text style={styles.metadataText}>{duration}</Text>}
                    </View>
                )}

                {/* Resume Learning Button */}
                {onResumePress && (
                    <PrimaryButton
                        label="Resume Learning"
                        onPress={onResumePress}
                    />
                )}
            </View>
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
        gap: 24,
    },
    headerSection: {
        flexDirection: 'column',
        gap: 16,
        width: '100%',
    },
    subtitle: {
        ...typography.interRegular12,
        color: colors.textGrey,
    },
    titleDescriptionContainer: {
        flexDirection: 'column',
        gap: 8,
        width: '100%',
    },
    title: {
        ...typography.h6,
        color: colors.primaryDarkBlue,
    },
    description: {
        ...typography.p3Regular,
        color: colors.textGrey,
    },
    skillsSection: {
        flexDirection: 'column',
        gap: 8,
        width: '100%',
    },
    skillsLabel: {
        ...typography.p4SemiBold,
        color: colors.textGrey,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        width: '100%',
    },
    skillChip: {
        backgroundColor: colors.highlightBlue,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 28,
    },
    skillText: {
        ...typography.p4,
        color: colors.textGrey,
    },
    startLearningContainer: {
        width: '100%',
    },
    detailsSection: {
        flexDirection: 'column',
        gap: 8,
        width: '100%',
    },
    metadataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    metadataText: {
        ...typography.interRegular12,
        color: colors.textGrey,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.lightGrey,
    },
});

export default LearningPathCard;


