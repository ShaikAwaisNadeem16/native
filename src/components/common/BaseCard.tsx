import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, typography, borderRadius, shadows } from '../../styles/theme';
import PrimaryButton from '../SignUp/PrimaryButton';
import SecondaryButton from '../SignUp/SecondaryButton';
import AssessmentLogo from './AssessmentLogo';
import GreenTick from './GreenTick';

export type CardVariant = 'active' | 'completed' | 'locked' | 'comingSoon' | 'assessment';

export interface BaseCardProps {
    variant: CardVariant;
    // Icon
    iconUrl?: string | number | React.ComponentType<any>;
    useAssessmentLogo?: boolean;
    useGreenCheck?: boolean;
    // Content
    subtitle?: string;
    title: string;
    description?: string;
    level?: string;
    duration?: string;
    // Progress (for active variant)
    progressPercentage?: number;
    completedModules?: number;
    totalModules?: number;
    // Tags/Badges
    tagText?: string; // For locked/coming soon variants
    // Buttons
    primaryButtonLabel?: string;
    secondaryButtonLabel?: string;
    onPrimaryButtonPress?: () => void;
    onSecondaryButtonPress?: () => void;
    // Layout
    iconSize?: number;
    iconPosition?: 'top' | 'left'; // 'top' for assessment cards, 'left' for course cards
}

/**
 * BaseCard - Unified card component for all card types
 * Replaces: LearningJourneyCard, JourneyBlock, EngineeringAssessmentCard, 
 * LockedCourseCard, ComingSoonCourseCard
 */
const BaseCard: React.FC<BaseCardProps> = ({
    variant,
    iconUrl,
    useAssessmentLogo = false,
    useGreenCheck = false,
    subtitle,
    title,
    description,
    level,
    duration,
    progressPercentage,
    completedModules,
    totalModules,
    tagText,
    primaryButtonLabel,
    secondaryButtonLabel,
    onPrimaryButtonPress,
    onSecondaryButtonPress,
    iconSize = 70,
    iconPosition = 'left',
}) => {
    const isActive = variant === 'active';
    const isCompleted = variant === 'completed';
    const isLocked = variant === 'locked';
    const isComingSoon = variant === 'comingSoon';
    const isAssessment = variant === 'assessment';
    const hasProgress = progressPercentage !== undefined && progressPercentage > 0;
    const showIcon = iconUrl || useAssessmentLogo || useGreenCheck;

    // Determine container style
    const containerStyle = [
        styles.container,
        (isActive || isCompleted || isAssessment) ? styles.containerActive : styles.containerInactive,
    ];

    // Determine icon size based on variant
    const finalIconSize = isLocked || isComingSoon ? 48 : iconSize;

    return (
        <View style={containerStyle}>
            <View style={styles.content}>
                {/* Assessment Layout: Icon at top, then subtitle and title below */}
                {isAssessment && iconPosition === 'top' ? (
                    <>
                        {/* Icon at top */}
                        {showIcon && (
                            <View style={styles.iconContainerTop}>
                                {useAssessmentLogo ? (
                                    <AssessmentLogo size={finalIconSize} />
                                ) : iconUrl ? (
                                    typeof iconUrl === 'function' ? (
                                        (() => {
                                            const IconComponent = iconUrl;
                                            return <IconComponent style={[styles.icon, { width: finalIconSize, height: finalIconSize }]} />;
                                        })()
                                    ) : (
                                        <Image
                                            source={typeof iconUrl === 'string' ? { uri: iconUrl } : iconUrl}
                                            style={[styles.icon, { width: finalIconSize, height: finalIconSize }]}
                                            resizeMode="contain"
                                        />
                                    )
                                ) : null}
                            </View>
                        )}
                        {/* Subtitle and Title below icon */}
                        <View style={styles.titleSectionTop}>
                            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                            <Text style={styles.title}>{title}</Text>
                        </View>
                    </>
                ) : (
                    <>
                        {/* Icon Section (for top position, non-assessment) */}
                        {showIcon && iconPosition === 'top' && (
                            <View style={styles.iconContainerTop}>
                                {useAssessmentLogo ? (
                                    <AssessmentLogo size={finalIconSize} />
                                ) : useGreenCheck ? (
                                    <GreenTick size={finalIconSize} />
                                ) : iconUrl ? (
                                    typeof iconUrl === 'function' ? (
                                        (() => {
                                            const IconComponent = iconUrl;
                                            return <IconComponent style={[styles.icon, { width: finalIconSize, height: finalIconSize }]} />;
                                        })()
                                    ) : (
                                        <Image
                                            source={typeof iconUrl === 'string' ? { uri: iconUrl } : iconUrl}
                                            style={[styles.icon, { width: finalIconSize, height: finalIconSize }]}
                                            resizeMode="contain"
                                        />
                                    )
                                ) : null}
                            </View>
                        )}

                        {/* Header Section: Icon (left) + Title + Tag */}
                        <View style={styles.headerSection}>
                            {showIcon && iconPosition === 'left' && (
                                <View style={styles.iconContainerLeft}>
                                    {useAssessmentLogo ? (
                                        <AssessmentLogo size={finalIconSize} />
                                    ) : useGreenCheck ? (
                                        <GreenTick size={finalIconSize} />
                                    ) : iconUrl ? (
                                        typeof iconUrl === 'function' ? (
                                            (() => {
                                                const IconComponent = iconUrl;
                                                return <IconComponent style={[styles.icon, { width: finalIconSize, height: finalIconSize }]} />;
                                            })()
                                        ) : (
                                            <Image
                                                source={typeof iconUrl === 'string' ? { uri: iconUrl } : iconUrl}
                                                style={[styles.icon, { width: finalIconSize, height: finalIconSize }]}
                                                resizeMode="contain"
                                            />
                                        )
                                    ) : null}
                                </View>
                            )}

                            {/* Title Section */}
                            <View style={styles.titleSection}>
                                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                                <Text style={[
                                    styles.title,
                                    (isLocked || isComingSoon) && styles.titleSmall
                                ]}>
                                    {title}
                                </Text>
                            </View>

                            {/* Tag (for locked/coming soon) */}
                            {(isLocked || isComingSoon) && tagText && (
                                <View style={styles.tag}>
                                    <Text style={styles.tagText}>{tagText}</Text>
                                </View>
                            )}
                        </View>
                    </>
                )}

                {/* Description */}
                {description && <Text style={styles.description}>{description}</Text>}

                {/* Progress Bar (for active variant) */}
                {isActive && hasProgress && (
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

                {/* Details Section: Level/Duration + Buttons */}
                <View style={styles.detailsSection}>
                    {/* Level and Duration */}
                    {level && duration && (
                        <View style={styles.metadataRow}>
                            <Text style={styles.metadataText}>{level}</Text>
                            <View style={styles.dot} />
                            <Text style={styles.metadataText}>{duration}</Text>
                        </View>
                    )}

                    {/* Buttons */}
                    {isCompleted && onPrimaryButtonPress && (
                        <PrimaryButton
                            label={primaryButtonLabel || secondaryButtonLabel || 'View Details'}
                            onPress={onPrimaryButtonPress}
                        />
                    )}

                    {isActive && (
                        <View style={styles.buttonsContainer}>
                            {onPrimaryButtonPress && (
                                <PrimaryButton
                                    label={primaryButtonLabel || 'Continue'}
                                    onPress={onPrimaryButtonPress}
                                />
                            )}
                            {onSecondaryButtonPress && (
                                <SecondaryButton
                                    label={secondaryButtonLabel || 'Details'}
                                    onPress={onSecondaryButtonPress}
                                />
                            )}
                        </View>
                    )}

                    {isAssessment && onPrimaryButtonPress && (
                        <TouchableOpacity
                            style={styles.assessmentButton}
                            onPress={onPrimaryButtonPress}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.assessmentButtonText}>
                                {primaryButtonLabel || 'Start Assessment'}
                            </Text>
                        </TouchableOpacity>
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
    containerInactive: {
        backgroundColor: colors.lightGrey,
    },
    content: {
        flexDirection: 'column',
        gap: 20,
        width: '100%',
    },
    iconContainerTop: {
        width: '100%',
        alignItems: 'flex-start',
        marginBottom: 0,
    },
    titleSectionTop: {
        flexDirection: 'column',
        width: '100%',
        gap: 4,
    },
    iconContainerLeft: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    icon: {
        width: '100%',
        height: '100%',
    },
    headerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: 16,
    },
    titleSection: {
        flexDirection: 'column',
        gap: 4,
        flex: 1,
        minWidth: 0,
    },
    subtitle: {
        ...typography.interRegular12,
        color: colors.textGrey,
    },
    title: {
        ...typography.p2Bold,
        color: colors.primaryDarkBlue,
    },
    titleSmall: {
        ...typography.p3Bold,
    },
    tag: {
        backgroundColor: colors.highlightBlue,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 4,
        flexShrink: 0,
    },
    tagText: {
        ...typography.s2SemiBold,
        color: colors.textGrey,
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
    metadataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        height: 20,
    },
    metadataText: {
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
    assessmentButton: {
        backgroundColor: colors.primaryBlue,
        borderRadius: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    assessmentButtonText: {
        ...typography.p4SemiBold,
        color: colors.white,
    },
});

export default BaseCard;

