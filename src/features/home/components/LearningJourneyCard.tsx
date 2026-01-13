import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, typography, borderRadius, shadows } from '../../../styles/theme';
import PrimaryButton from '../../../components/SignUp/PrimaryButton';
import SecondaryButton from '../../../components/SignUp/SecondaryButton';
import AssessmentLogo from '../../../components/common/AssessmentLogo';

export interface LearningJourneyCardProps {
    type: 'completed' | 'inProgress' | 'comingSoon';
    iconUrl?: string | number; // Can be URI string or require() result (number)
    subtitle: string; // e.g., "COURSE"
    title: string;
    description: string;
    level?: string; // e.g., "Beginner"
    duration?: string; // e.g., "3 hours"
    contentType?: string; // Content type from API (e.g., "survey", "assignment", "stemAssessment")
    lockedOrUnlocked?: string; // "locked" or "unlocked" status from API
    retakeDays?: number | null; // Number of days until reattempt
    retakeExact?: string | null; // Exact retake time (e.g., "0 days 2 hrs 24 mins")
    // For in-progress courses
    progressPercentage?: number; // 0-100
    completedModules?: number;
    totalModules?: number;
    // Button handlers
    onPrimaryButtonPress?: () => void;
    onSecondaryButtonPress?: () => void;
    primaryButtonLabel?: string; // e.g., "Resume Learning" or "Course Details"
    secondaryButtonLabel?: string; // e.g., "Course Details"
}

const LearningJourneyCard: React.FC<LearningJourneyCardProps> = ({
    type,
    iconUrl,
    subtitle,
    title,
    description,
    level,
    duration,
    contentType,
    lockedOrUnlocked,
    retakeDays,
    retakeExact,
    progressPercentage,
    completedModules,
    totalModules,
    onPrimaryButtonPress,
    onSecondaryButtonPress,
    primaryButtonLabel,
    secondaryButtonLabel = 'Course Details',
}) => {
    const isCompleted = type === 'completed';
    const isInProgress = type === 'inProgress';
    const isComingSoon = type === 'comingSoon';
    const hasProgress = progressPercentage !== undefined && progressPercentage > 0;

    return (
        <View style={[
            styles.container,
            isCompleted || isInProgress ? styles.containerActive : styles.containerComingSoon
        ]}>
            <View style={styles.content}>
                {/* Icon Title and Subtitle Section */}
                <View style={styles.iconTitleSection}>
                    {/* Show assessment logo if subtitle is ASSESSMENT or TEST, otherwise show iconUrl */}
                    {(subtitle === 'ASSESSMENT' || subtitle === 'TEST' || subtitle === 'ASSESSMENT CLEARED') ? (
                        <View style={styles.iconContainer}>
                            <AssessmentLogo size={70} />
                        </View>
                    ) : iconUrl ? (
                        <View style={styles.iconContainer}>
                            <Image
                                source={typeof iconUrl === 'string' ? { uri: iconUrl } : iconUrl}
                                style={styles.icon}
                                resizeMode="contain"
                            />
                        </View>
                    ) : null}
                    {isComingSoon && (
                        <View style={styles.comingSoonTag}>
                            <Text style={styles.comingSoonText}>COMING SOON</Text>
                        </View>
                    )}
                </View>

                {/* Content Type at Top (if provided) */}
                {contentType && (
                    <View style={styles.contentTypeContainer}>
                        <Text style={styles.contentTypeText}>{contentType.toUpperCase()}</Text>
                        {lockedOrUnlocked && (
                            <Text style={styles.lockedStatusText}>
                                {lockedOrUnlocked.toUpperCase()}
                            </Text>
                        )}
                    </View>
                )}

                {/* Subtitle and Title */}
                <View style={styles.titleSection}>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                    <Text style={isComingSoon ? styles.comingSoonTitle : styles.title}>{title}</Text>
                </View>

                {/* Description */}
                <Text style={styles.description}>{description}</Text>

                {/* Progress Bar - Only show for in-progress courses */}
                {isInProgress && hasProgress && (
                    <View style={styles.progressSection}>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
                        </View>
                        <View style={styles.progressTextContainer}>
                            <Text style={styles.progressText}>
                                {progressPercentage}% complete
                            </Text>
                            {completedModules !== undefined && totalModules !== undefined && (
                                <Text style={styles.moduleCountText}>
                                    <Text style={styles.moduleCountBold}>{completedModules}/{totalModules}</Text>
                                    {' '}Modules
                                </Text>
                            )}
                        </View>
                    </View>
                )}

                {/* CTA and Course Details */}
                <View style={styles.detailsSection}>
                    {/* Level and Duration */}
                    {level && duration && (
                        <View style={styles.moreDetails}>
                            <Text style={styles.detailText}>{level}</Text>
                            <View style={styles.dot} />
                            <Text style={styles.detailText}>{duration}</Text>
                        </View>
                    )}

                    {/* Reattempt Information (if available) */}
                    {(retakeDays !== null || retakeExact) && (
                        <View style={styles.reattemptContainer}>
                            <Text style={styles.reattemptText}>
                                {retakeExact || (retakeDays !== null ? `Reattempt in ${retakeDays} ${retakeDays === 1 ? 'day' : 'days'}` : '')}
                            </Text>
                        </View>
                    )}

                    {/* Buttons */}
                    {isCompleted && (
                        <PrimaryButton
                            label={primaryButtonLabel || secondaryButtonLabel || 'Course Details'}
                            onPress={onPrimaryButtonPress || onSecondaryButtonPress || (() => {})}
                        />
                    )}

                    {isInProgress && (
                        <View style={styles.buttonsContainer}>
                            <PrimaryButton
                                label={primaryButtonLabel || 'Resume Learning'}
                                onPress={onPrimaryButtonPress || (() => {})}
                            />
                            {onSecondaryButtonPress && (
                                <SecondaryButton
                                    label={secondaryButtonLabel}
                                    onPress={onSecondaryButtonPress}
                                />
                            )}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: borderRadius.card,
        padding: 24,
        width: '100%',
        overflow: 'hidden',
    },
    containerActive: {
        backgroundColor: colors.white,
        borderWidth: 2,
        borderColor: colors.primaryBlue,
        ...shadows.activeElement,
    },
    containerComingSoon: {
        backgroundColor: colors.lightGrey,
    },
    content: {
        flexDirection: 'column',
        gap: 20,
        width: '100%',
    },
    iconTitleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    iconContainer: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: '100%',
        height: '100%',
    },
    comingSoonTag: {
        backgroundColor: colors.highlightBlue,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 4,
    },
    comingSoonText: {
        ...typography.s2SemiBold,
        color: colors.textGrey,
    },
    contentTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 8,
    },
    contentTypeText: {
        ...typography.s2SemiBold,
        color: colors.primaryBlue,
        textTransform: 'uppercase',
    },
    lockedStatusText: {
        ...typography.s2SemiBold,
        color: colors.textGrey,
        textTransform: 'uppercase',
    },
    reattemptContainer: {
        marginTop: 8,
        marginBottom: 8,
    },
    reattemptText: {
        ...typography.s1Regular,
        color: colors.textGrey,
        fontStyle: 'italic',
    },
    titleSection: {
        flexDirection: 'column',
        gap: 4,
        width: '100%',
    },
    subtitle: {
        ...typography.interRegular12,
        color: colors.textGrey,
    },
    title: {
        ...typography.p2Bold, // 18px for active/completed courses
        color: colors.primaryDarkBlue,
    },
    comingSoonTitle: {
        ...typography.p3Bold, // 16px for coming soon
        color: colors.primaryDarkBlue,
    },
    description: {
        ...typography.p4,
        color: colors.textGrey,
    },
    progressSection: {
        flexDirection: 'column',
        gap: 8,
        width: '100%',
    },
    progressBarContainer: {
        backgroundColor: colors.lightGrey,
        borderRadius: 10,
        height: 8,
        width: '100%',
        overflow: 'hidden',
    },
    progressBarFill: {
        backgroundColor: colors.info || '#2F80ED',
        height: '100%',
        borderRadius: 10,
    },
    progressTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    progressText: {
        ...typography.s1Regular,
        color: colors.textGrey,
        textAlign: 'right',
    },
    moduleCountText: {
        ...typography.s1Regular,
        color: colors.textGrey,
    },
    moduleCountBold: {
        ...typography.s2SemiBold,
        color: colors.primaryDarkBlue,
    },
    detailsSection: {
        flexDirection: 'column',
        gap: 8,
        width: '100%',
    },
    moreDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        height: 20,
    },
    detailText: {
        ...typography.p4,
        color: colors.textGrey,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.textGrey,
    },
    buttonsContainer: {
        flexDirection: 'column',
        gap: 16,
        width: '100%',
    },
});

export default LearningJourneyCard;








