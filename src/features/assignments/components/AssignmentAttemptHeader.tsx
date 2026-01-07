import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { colors, typography } from '../../../styles/theme';

/**
 * AssignmentAttemptHeader Component
 *
 * Renders the assignment attempt header exactly as per Figma design (node 8217-85764).
 * This is the top banner displayed after the student clicks "Start Assignment".
 *
 * Usage:
 * - Render ONLY after successful API response from POST /api/lms/v1/attempt/assignment
 * - Displays assignment title, description, deadline, and illustration
 *
 * Data Binding:
 * - assign_data.title → title prop
 * - assign_data.description → description prop
 * - attempt.deadline → deadline prop
 */
export interface AssignmentAttemptHeaderProps {
    title: string; // From assign_data.title
    description: string; // From assign_data.description
    deadline: string; // From attempt.deadline (formatted date string)
    illustrationUrl?: string | number; // Optional illustration from assets
}

const AssignmentAttemptHeader: React.FC<AssignmentAttemptHeaderProps> = ({
    title,
    description,
    deadline,
    illustrationUrl,
}) => {
    // Format deadline for display
    const formatDeadline = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    const formattedDeadline = formatDeadline(deadline);

    return (
        <View style={styles.container}>
            {/* Content Section */}
            <View style={styles.contentSection}>
                {/* Subtitle */}
                <Text style={styles.subtitle}>ASSIGNMENT</Text>

                {/* Title */}
                <Text style={styles.title}>{title}</Text>

                {/* Description */}
                <Text style={styles.description}>{description}</Text>

                {/* Deadline Section */}
                <View style={styles.deadlineSection}>
                    <Calendar size={20} color={colors.white} />
                    <Text style={styles.deadlineLabel}>Deadline:</Text>
                    <Text style={styles.deadlineValue}>{formattedDeadline}</Text>
                </View>
            </View>

            {/* Illustration Section */}
            {illustrationUrl && (
                <View style={styles.illustrationContainer}>
                    <Image
                        source={typeof illustrationUrl === 'string' ? { uri: illustrationUrl } : illustrationUrl}
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.reportBlue || '#0049b5', // reportBlue from Figma
        padding: 24, // 24px padding from Figma
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        minHeight: 180, // Minimum height from Figma
    },
    contentSection: {
        flexDirection: 'column',
        gap: 12, // 12px gap between elements from Figma
        flex: 1,
        paddingRight: 16, // Space for illustration
    },
    subtitle: {
        ...typography.s1Regular, // Inter Regular, 12px, line-height 16px from Figma
        color: colors.lightGrey, // #e2ebf3 from Figma
        letterSpacing: 1, // Letter spacing for subtitle
    },
    title: {
        ...typography.h6, // Inter Bold, 20px, line-height 24px from Figma
        color: colors.white, // White from Figma
    },
    description: {
        ...typography.p4, // Inter Regular, 14px, line-height 20px from Figma
        color: colors.white, // White from Figma
        opacity: 0.9,
    },
    deadlineSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // 8px gap between icon and text from Figma
        marginTop: 8, // Additional top margin
    },
    deadlineLabel: {
        ...typography.p4, // Inter Regular, 14px from Figma
        color: colors.lightGrey, // #e2ebf3 from Figma
    },
    deadlineValue: {
        ...typography.p4SemiBold, // Inter SemiBold, 14px from Figma
        color: colors.white, // White from Figma
    },
    illustrationContainer: {
        width: 120, // Illustration width from Figma
        height: 120, // Illustration height from Figma
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustration: {
        width: '100%',
        height: '100%',
    },
});

export default AssignmentAttemptHeader;
