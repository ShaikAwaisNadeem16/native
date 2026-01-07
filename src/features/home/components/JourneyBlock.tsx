import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Lock } from 'lucide-react-native';
import { colors, typography, borderRadius, shadows } from '../../../styles/theme';
import PrimaryButton from '../../../components/SignUp/PrimaryButton';
import SecondaryButton from '../../../components/SignUp/SecondaryButton';

interface ButtonConfig {
    label: string;
    onPress?: () => void;
    disabled?: boolean;
    showIcon?: boolean;
    iconUrl?: string;
}

interface JourneyBlockProps {
    type: 'active' | 'comingSoon' | 'reattempt';
    iconUrl?: string | number | React.ComponentType<any>; // Can be URI string, require() result (number), or SVG component
    subtitle: string;
    title: string;
    description: string;
    level?: string;
    duration?: string;
    buttonLabel?: string;
    onButtonPress?: () => void;
    onSecondaryButtonPress?: () => void; // For Course Details button
    buttons?: ButtonConfig[]; // For multiple buttons (reattempt state)
    // Progress bar props
    progressPercentage?: number; // 0-100
    completedModules?: number;
    totalModules?: number;
}

const JourneyBlock: React.FC<JourneyBlockProps> = ({
    type,
    iconUrl,
    subtitle,
    title,
    description,
    level,
    duration,
    buttonLabel = 'Take The Test',
    onButtonPress,
    onSecondaryButtonPress,
    buttons,
    progressPercentage,
    completedModules,
    totalModules,
}) => {
    const isActive = type === 'active';
    const isReattempt = type === 'reattempt';
    const hasProgress = progressPercentage !== undefined && progressPercentage > 0;

    return (
        <View style={[
            styles.container,
            (isActive || isReattempt) ? styles.containerActive : styles.containerComingSoon
        ]}>
            <View style={styles.content}>
                {/* Icon Title and Subtitle Section */}
                <View style={styles.iconTitleSection}>
                    {iconUrl && (
                        <View style={styles.iconContainer}>
                            {typeof iconUrl === 'function' ? (
                                // SVG component - render directly
                                (() => {
                                    const IconComponent = iconUrl;
                                    return <IconComponent style={styles.icon} />;
                                })()
                            ) : (
                                // Image source (URI or require result)
                                <Image
                                    source={typeof iconUrl === 'string' ? { uri: iconUrl } : iconUrl}
                                    style={styles.icon}
                                    resizeMode="contain"
                                />
                            )}
                        </View>
                    )}
                    {!isActive && !isReattempt && (
                        <View style={styles.comingSoonTag}>
                            <Text style={styles.comingSoonText}>COMING SOON</Text>
                        </View>
                    )}
                </View>

                {/* Subtitle and Title */}
                <View style={styles.titleSection}>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                    <Text style={!isActive && !isReattempt ? styles.comingSoonTitle : styles.title}>{title}</Text>
                </View>

                {/* Description */}
                <Text style={styles.description}>{description}</Text>

                {/* Progress Bar - Only show for active courses with progress */}
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
                                    <Text style={styles.moduleCountBold}>{completedModules}/{totalModules}</Text> Modules
                                </Text>
                            )}
                        </View>
                    </View>
                )}

                {/* CTA and Course Details */}
                <View style={styles.detailsSection}>
                    {/* Show level/duration for active courses (before buttons if no progress, after progress if has progress) */}
                    {isActive && !isReattempt && !hasProgress && level && duration && (
                        <View style={styles.moreDetails}>
                            <Text style={styles.detailText}>{level}</Text>
                            <View style={styles.dot} />
                            <Text style={styles.detailText}>{duration}</Text>
                        </View>
                    )}
                    {/* Show level/duration for active courses with progress (after progress bar, before buttons) */}
                    {isActive && !isReattempt && hasProgress && level && duration && (
                        <View style={styles.moreDetails}>
                            <Text style={styles.detailText}>{level}</Text>
                            <View style={styles.dot} />
                            <Text style={styles.detailText}>{duration}</Text>
                        </View>
                    )}
                    {/* Reattempt state: Multiple buttons */}
                    {isReattempt && buttons && buttons.length > 0 && (
                        <View style={styles.buttonsContainer}>
                            {buttons.map((button, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.reattemptButton,
                                        button.disabled && styles.reattemptButtonDisabled,
                                    ]}
                                    onPress={button.onPress}
                                    disabled={button.disabled}
                                    activeOpacity={0.7}
                                >
                                    {button.showIcon && (
                                        <View style={styles.buttonIconContainer}>
                                            <Lock size={24} color={button.disabled ? '#72818c' : colors.primaryBlue} />
                                        </View>
                                    )}
                                    <Text
                                        style={[
                                            styles.reattemptButtonText,
                                            button.disabled && styles.reattemptButtonTextDisabled,
                                        ]}
                                    >
                                        {button.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                    {/* Active state: Primary button + optional secondary button */}
                    {isActive && !isReattempt && (
                        <View style={styles.activeButtonsContainer}>
                            <PrimaryButton
                                label={buttonLabel || 'Resume Learning'}
                                onPress={onButtonPress || (() => {})}
                            />
                            {onSecondaryButtonPress && (
                                <SecondaryButton
                                    label={subtitle === 'ASSIGNMENT' ? 'Assignment Details' : 'Course Details'}
                                    onPress={onSecondaryButtonPress}
                                />
                            )}
                        </View>
                    )}
                    {/* Coming soon state: Level and duration only */}
                    {!isActive && !isReattempt && (
                        <View style={styles.subtext}>
                            <Text style={styles.detailText}>{level}</Text>
                            <View style={[styles.dot, styles.dotDark]} />
                            <Text style={styles.detailText}>{duration}</Text>
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
        ...typography.p2Bold, // 18px for active courses (matches Figma)
        color: colors.primaryDarkBlue,
    },
    comingSoonTitle: {
        ...typography.p3Bold, // 16px for coming soon (matches Figma)
        color: colors.primaryDarkBlue,
    },
    description: {
        ...typography.p4,
        color: colors.textGrey,
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
    },
    subtext: {
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
        backgroundColor: colors.lightGrey,
    },
    dotDark: {
        backgroundColor: colors.textGrey,
    },
    buttonsContainer: {
        flexDirection: 'column',
        gap: 16,
        width: '100%',
    },
    reattemptButton: {
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'transparent',
        flexDirection: 'row',
        gap: 8,
    },
    reattemptButtonDisabled: {
        backgroundColor: '#ededed',
        borderColor: '#ededed',
    },
    reattemptButtonText: {
        ...typography.p4SemiBold,
        color: colors.primaryBlue,
    },
    reattemptButtonTextDisabled: {
        color: '#72818c',
    },
    buttonIconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
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
    activeButtonsContainer: {
        flexDirection: 'column',
        gap: 16,
        width: '100%',
    },
});

export default JourneyBlock;

