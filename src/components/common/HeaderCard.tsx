import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, typography } from '../../styles/theme';
import { Clock } from 'lucide-react-native';
import AssessmentLogo from './AssessmentLogo';

export interface HeaderCardProps {
    // Variant
    variant?: 'assessment' | 'assignment';
    // Icon
    iconUrl?: string | number;
    // Content
    shortName?: string; // "ASSESSMENT", "ASSIGNMENT", etc.
    title: string;
    description: string;
    // Metadata
    duration?: string;
    questions?: string;
    section?: string; // "4 Parts" or similar
    // Layout
    showIcon?: boolean;
}

/**
 * HeaderCard - Unified header card component for assessments and assignments
 * Replaces: AssessmentHeaderCard, AssignmentHeaderCard
 */
const HeaderCard: React.FC<HeaderCardProps> = ({
    variant = 'assessment',
    iconUrl,
    shortName,
    title,
    description,
    duration,
    questions,
    section,
    showIcon = true,
}) => {
    const isAssignment = variant === 'assignment';
    const displayShortName = shortName || (isAssignment ? 'ASSIGNMENT' : 'ASSESSMENT');

    return (
        <View style={styles.container}>
            {/* Icon (for assessment variant) */}
            {!isAssignment && showIcon && (
                <View style={styles.iconContainer}>
                    {iconUrl ? (
                        <View style={styles.iconBackgroundMask}>
                            <Image
                                source={typeof iconUrl === 'string' ? { uri: iconUrl } : iconUrl}
                                style={styles.icon}
                                resizeMode="contain"
                            />
                        </View>
                    ) : (
                        <View style={styles.assessmentLogoContainer}>
                            <AssessmentLogo size={70} />
                        </View>
                    )}
                </View>
            )}

            {/* Icon (for assignment variant) */}
            {isAssignment && showIcon && iconUrl && (
                <View style={styles.iconContainer}>
                    <View style={styles.iconBackgroundMask}>
                        <Image
                            source={typeof iconUrl === 'string' ? { uri: iconUrl } : iconUrl}
                            style={styles.icon}
                            resizeMode="contain"
                        />
                    </View>
                </View>
            )}

            {/* Content Section */}
            <View style={styles.contentSection}>
                {/* Short Name */}
                <Text style={styles.shortName}>{displayShortName.toUpperCase()}</Text>

                {/* Title and Description */}
                <View style={styles.titleDescriptionContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                </View>

                {/* Metadata: Duration and Questions */}
                {isAssignment ? (
                    duration && (
                        <View style={styles.durationSection}>
                            <Clock size={24} color={colors.lightGrey} />
                            <Text style={styles.durationText}>{duration}</Text>
                        </View>
                    )
                ) : (
                    (section || duration || questions) && (
                        <View style={styles.metadataRow}>
                            {section && <Text style={styles.metadataText}>{section}</Text>}
                            {section && questions && <View style={styles.dot} />}
                            {questions && <Text style={styles.metadataText}>{questions}</Text>}
                            {questions && duration && <View style={styles.dot} />}
                            {duration && <Text style={styles.metadataText}>{duration}</Text>}
                        </View>
                    )
                )}
            </View>

            {/* Decorative background elements (for assessment variant) */}
            {!isAssignment && (
                <>
                    <View style={styles.decorativeElement1} />
                    <View style={styles.decorativeElement2} />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.reportBlue || '#0049b5',
        padding: 24,
        flexDirection: 'column',
        gap: 20,
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
    },
    iconContainer: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    assessmentLogoContainer: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBackgroundMask: {
        width: 60.007,
        height: 59.999,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    icon: {
        width: 90,
        height: 84,
    },
    contentSection: {
        width: '100%',
        flexDirection: 'column',
        gap: 24,
    },
    shortName: {
        ...typography.s1Regular,
        color: colors.lightGrey,
        marginBottom: 0,
    },
    titleDescriptionContainer: {
        width: '100%',
        flexDirection: 'column',
        gap: 8,
    },
    title: {
        ...typography.h6,
        color: colors.white,
        marginBottom: 0,
    },
    description: {
        ...typography.p4,
        color: colors.white,
    },
    metadataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        height: 20,
    },
    metadataText: {
        ...typography.p4,
        color: colors.lightGrey,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.lightGrey,
    },
    durationSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        height: 20,
    },
    durationText: {
        ...typography.p4,
        color: colors.lightGrey,
    },
    decorativeElement1: {
        position: 'absolute',
        width: 207,
        height: 478,
        backgroundColor: 'rgba(250, 255, 252, 0.1)',
        borderRadius: 100,
        right: -50,
        top: -137,
        transform: [{ rotate: '38.713deg' }],
    },
    decorativeElement2: {
        position: 'absolute',
        width: 33,
        height: 784,
        backgroundColor: 'rgba(250, 255, 252, 0.1)',
        borderRadius: 100,
        right: -100,
        top: -271,
        transform: [{ rotate: '38.713deg' }],
    },
});

export default HeaderCard;



