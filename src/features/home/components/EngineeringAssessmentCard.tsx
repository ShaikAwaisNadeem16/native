import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, borderRadius, shadows } from '../../../styles/theme';
import AssessmentLogo from '../../../components/common/AssessmentLogo';

interface EngineeringAssessmentCardProps {
    subtitle?: string; // "TEST" label
    title: string; // "Engineering Systems Assessment"
    description: string;
    level?: string; // "Beginner"
    duration?: string; // "3 hours"
    buttonLabel?: string; // "Test Details"
    onButtonPress?: () => void;
}

const EngineeringAssessmentCard: React.FC<EngineeringAssessmentCardProps> = ({
    subtitle = 'TEST',
    title = '',
    description = '',
    level = 'Beginner',
    duration = '3 hours',
    buttonLabel = 'Test Details',
    onButtonPress,
}) => {
    // Ensure component always renders with valid data
    const displayTitle = title || 'Assessment';
    const displayDescription = description || 'Complete this assessment to progress in your learning journey.';
    
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Icon Title and Subtitle Section - Figma: Icon at top-left, then subtitle and title below */}
                <View style={styles.iconTitleSection}>
                    {/* Icon Container - 70px size as per Figma */}
                    <View style={styles.iconContainer}>
                        <AssessmentLogo size={70} />
                    </View>
                    
                    {/* Subtitle and Title - Below icon */}
                    <View style={styles.titleSection}>
                        <Text style={styles.subtitle}>{subtitle}</Text>
                        <Text style={styles.title}>{displayTitle}</Text>
                    </View>
                </View>

                {/* Description */}
                <Text style={styles.description}>{displayDescription}</Text>

                {/* CTA and Course Details */}
                <View style={styles.detailsSection}>
                    {/* More Details - Level and Duration */}
                    <View style={styles.moreDetails}>
                        <Text style={styles.detailText}>{level}</Text>
                        <View style={styles.dot} />
                        <Text style={styles.detailText}>{duration}</Text>
                    </View>

                    {/* Button */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onButtonPress}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.buttonText}>{buttonLabel}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderWidth: 2,
        borderColor: colors.primaryBlue,
        borderRadius: 12, // Figma: rounded-[12px]
        padding: 24, // Figma: p-[24px]
        width: '100%',
        minHeight: 200, // Ensure minimum height for visibility
        ...shadows.activeElement, // Figma: shadow-[0px_8px_40px_0px_rgba(9,44,76,0.08)]
        overflow: 'visible', // Changed from 'hidden' to ensure content is visible
    },
    content: {
        flexDirection: 'column',
        width: '100%',
    },
    iconTitleSection: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
    },
    iconContainer: {
        width: 70, // Figma: size-[70px]
        height: 70,
        justifyContent: 'center',
        alignItems: 'flex-start', // Align icon to left as per Figma
    },
    titleSection: {
        flexDirection: 'column',
        width: '100%',
        marginTop: 20, // Figma: gap-[20px] between icon and title section
    },
    subtitle: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 13.56, // Figma: 1.13 * 12 = 13.56
        color: colors.textGrey, // Figma: text-[color:var(--text-grey,#696a6f)]
        marginBottom: 4, // Figma: gap-[4px] between subtitle and title
    },
    title: {
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: '700' as const,
        lineHeight: 23, // Figma: Desktop/P3 Bold, 16px, line-height 23px
        color: colors.primaryDarkBlue, // Figma: text-[color:var(--primary-dark-blue,#00213d)]
    },
    description: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20, // Figma: Desktop/P4 Regular, 14px, line-height 20px
        color: colors.textGrey, // Figma: text-[color:var(--text-grey,#696a6f)]
        marginTop: 20, // Figma: gap-[20px] from iconTitleSection
    },
    detailsSection: {
        flexDirection: 'column',
        width: '100%',
        marginTop: 20, // Figma: gap-[20px] from description
    },
    moreDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8, // Figma: gap-[8px] before button
    },
    detailText: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20, // Figma: Desktop/P4 Regular, 14px, line-height 20px
        color: colors.textGrey, // Figma: text-[color:var(--text-grey,#696a6f)]
    },
    dot: {
        width: 4, // Figma: size-[4px]
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.lightGrey, // Figma: fill-0: rgba(226, 235, 243, 1)
        marginHorizontal: 8, // Figma: gap-[8px] between level and duration
    },
    button: {
        backgroundColor: colors.primaryBlue, // Figma: bg-[var(--primary-blue,#0b6aea)]
        borderRadius: 8, // Figma: rounded-[8px]
        paddingHorizontal: 24, // Figma: px-[24px]
        paddingVertical: 12, // Figma: py-[12px]
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: '600' as const,
        lineHeight: 20, // Figma: Desktop/P4 SemiBold, 14px, line-height 20px
        color: colors.white, // Figma: text-[color:var(--white,white)]
    },
});

export default EngineeringAssessmentCard;

