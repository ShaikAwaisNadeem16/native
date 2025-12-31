import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Lock } from 'lucide-react-native';
import { colors, typography, borderRadius, shadows } from '../../styles/theme';
import PrimaryButton from '../SignUp/PrimaryButton';

interface ButtonConfig {
    label: string;
    onPress?: () => void;
    disabled?: boolean;
    showIcon?: boolean;
    iconUrl?: string;
}

interface JourneyBlockProps {
    type: 'active' | 'comingSoon' | 'reattempt';
    iconUrl?: string;
    subtitle: string;
    title: string;
    description: string;
    level?: string;
    duration?: string;
    buttonLabel?: string;
    onButtonPress?: () => void;
    buttons?: ButtonConfig[]; // For multiple buttons (reattempt state)
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
    buttons,
}) => {
    const isActive = type === 'active';
    const isReattempt = type === 'reattempt';

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
                            <Image
                                source={{ uri: iconUrl }}
                                style={styles.icon}
                                resizeMode="contain"
                            />
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
                    <Text style={styles.title}>{title}</Text>
                </View>

                {/* Description */}
                <Text style={styles.description}>{description}</Text>

                {/* CTA and Course Details */}
                <View style={styles.detailsSection}>
                    {/* Show level/duration only for active (not reattempt) */}
                    {isActive && !isReattempt && (
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
                    {/* Active state: Single primary button */}
                    {isActive && !isReattempt && (
                        <PrimaryButton
                            label={buttonLabel}
                            onPress={onButtonPress || (() => {})}
                        />
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
        ...typography.p3Bold,
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
});

export default JourneyBlock;

