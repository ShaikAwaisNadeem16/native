import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Clock, BarChart2 } from 'lucide-react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';

/**
 * STEMAssignmentInfo Component
 * Displays the STEM Assessment header information at the top of the
 * ModuleDetailsScreen, ABOVE the "About The Assessment" section.
 *
 * Props:
 * - subtitle: string - Category label (e.g., "TEST")
 * - title: string - Assessment title (e.g., "STEM Assessment")
 * - description: string - Brief description of the assessment
 * - level: string - Difficulty level (e.g., "Beginner")
 * - duration: string - Time duration (e.g., "60 mins")
 * - onTakeTest: function - Callback when "Take The Test" button is pressed
 * - iconUrl: string | number - Optional icon/image for the assessment
 */

interface STEMAssignmentInfoProps {
    // Category label displayed above the title
    subtitle?: string;
    // Main assessment title
    title?: string;
    // Description text
    description?: string;
    // Difficulty level
    level?: string;
    // Duration of the assessment
    duration?: string;
    // Callback for Take The Test button
    onTakeTest?: () => void;
    // Optional icon URL or local asset
    iconUrl?: string | number;
}

const STEMAssignmentInfo: React.FC<STEMAssignmentInfoProps> = ({
    subtitle = 'TEST',
    title = 'STEM Assessment',
    description = 'You need to clear the test by scoring at least 7/10 in-order to access the next activity in your journey',
    level = 'Beginner',
    duration = '60 mins',
    onTakeTest,
    iconUrl,
}) => {
    return (
        <View style={styles.container}>
            {/* Header Row: Icon + Content */}
            <View style={styles.headerRow}>
                {/* Icon Container */}
                <View style={styles.iconContainer}>
                    {iconUrl ? (
                        <Image
                            source={typeof iconUrl === 'string' ? { uri: iconUrl } : iconUrl}
                            style={styles.icon}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={styles.iconPlaceholder} />
                    )}
                </View>

                {/* Content Section */}
                <View style={styles.contentSection}>
                    {/* Subtitle */}
                    <Text style={styles.subtitle}>{subtitle}</Text>

                    {/* Title */}
                    <Text style={styles.title}>{title}</Text>

                    {/* Description */}
                    <Text style={styles.description}>{description}</Text>

                    {/* Meta Info: Level and Duration */}
                    <View style={styles.metaRow}>
                        {/* Level */}
                        <View style={styles.metaItem}>
                            <BarChart2 size={16} color={colors.textGrey} />
                            <Text style={styles.metaText}>{level}</Text>
                        </View>

                        {/* Duration */}
                        <View style={styles.metaItem}>
                            <Clock size={16} color={colors.textGrey} />
                            <Text style={styles.metaText}>{duration}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Take The Test Button */}
            {onTakeTest && (
                <TouchableOpacity
                    style={styles.takeTestButton}
                    onPress={onTakeTest}
                    activeOpacity={0.7}
                >
                    <Text style={styles.takeTestButtonText}>Take The Test</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        paddingHorizontal: 0,
        paddingVertical: 0,
        marginBottom: 24,
        gap: 20,
        width: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
        width: '100%',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: borderRadius.card,
        backgroundColor: colors.highlightBlue, // #f2f7fe
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    icon: {
        width: 48,
        height: 48,
    },
    iconPlaceholder: {
        width: 48,
        height: 48,
        backgroundColor: colors.lightGrey,
        borderRadius: 8,
    },
    contentSection: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
    },
    subtitle: {
        ...typography.s1Regular, // 12px Regular
        color: colors.textGrey, // #696a6f
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    title: {
        ...typography.p2Bold, // 18px Bold
        color: colors.primaryDarkBlue, // #00213d
    },
    description: {
        ...typography.p4, // 14px Regular
        color: colors.textGrey, // #696a6f
        marginTop: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginTop: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        ...typography.s1Regular, // 12px Regular
        color: colors.textGrey, // #696a6f
    },
    takeTestButton: {
        backgroundColor: colors.primaryBlue, // #0b6aea
        borderRadius: borderRadius.input, // 8px
        paddingHorizontal: 24,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    takeTestButtonText: {
        ...typography.p4SemiBold, // 14px SemiBold
        color: colors.white,
    },
});

export default STEMAssignmentInfo;
