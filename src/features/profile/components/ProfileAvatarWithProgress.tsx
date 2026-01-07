import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, typography } from '../../../styles/theme';

// Icons removed - will be added later

interface ProfileAvatarWithProgressProps {
    percentage: number; // 0-100
    avatarUrl?: string | number; // Can be URI string or require() result (number)
    onEditPress?: () => void;
}

const ProfileAvatarWithProgress: React.FC<ProfileAvatarWithProgressProps> = ({
    percentage,
    avatarUrl = '',
    onEditPress,
}) => {
    // Ensure percentage is a valid number between 0-100
    const safePercentage = typeof percentage === 'number' && !isNaN(percentage) ? Math.min(Math.max(percentage, 0), 100) : 0;
    const progressRingSize = 72; // From Figma: 72px
    const strokeWidth = 0.714; // From Figma: 0.714px border
    const radius = (progressRingSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (safePercentage / 100) * circumference;
    const center = progressRingSize / 2;
    const avatarSize = 61.591; // From Figma: 61.591px


    return (
        <View style={styles.container}>
            {/* Circular Progress Ring Background (Ellipse 440) */}
            <View style={styles.progressRingContainer}>
                <View style={styles.progressRingBg} />
            </View>

            {/* Circular Progress Ring SVG */}
            <Svg width={progressRingSize} height={progressRingSize} style={styles.svg}>
                {/* Background circle (light grey) */}
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={colors.lightGrey}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress circle (green) */}
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={colors.successGreen}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${center} ${center})`}
                />
            </Svg>

            {/* Avatar Background */}
            <View style={styles.avatarBackgroundContainer}>
                <View style={styles.avatarBackground} />
            </View>

            {/* Avatar Image */}
            {avatarUrl && avatarUrl !== '' && (
                <View style={styles.avatarContainer}>
                    <Image
                        source={typeof avatarUrl === 'string' ? { uri: avatarUrl } : avatarUrl}
                        style={styles.avatar}
                        resizeMode="cover"
                    />
                </View>
            )}

            {/* Percentage Badge */}
            <View style={styles.percentageContainer}>
                <Text style={styles.percentageText}>{safePercentage}%</Text>
            </View>

            {/* Edit Icon */}
            <TouchableOpacity
                style={styles.editIconContainer}
                onPress={onEditPress}
                activeOpacity={0.7}
            >
                <View style={styles.editIconBg}>
                    <View style={styles.editIconBgImage} />
                </View>
                <View style={styles.editIconWrapper}>
                    <View style={styles.editIcon} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 72,
        height: 75.471, // From Figma: 75.471px total height
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressRingContainer: {
        position: 'absolute',
        width: 72,
        height: 71.983,
        top: 3.49,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressRingBg: {
        width: '100%',
        height: '100%',
    },
    svg: {
        position: 'absolute',
        top: 3.49,
        left: 0,
    },
    avatarBackgroundContainer: {
        position: 'absolute',
        width: 61.591,
        height: 61.576,
        top: 8.636,
        left: 21.201,
        borderRadius: 30.795,
        overflow: 'hidden',
        backgroundColor: colors.lightGrey,
    },
    avatarBackground: {
        width: '100%',
        height: '100%',
    },
    avatarContainer: {
        position: 'absolute',
        width: 61.591,
        height: 61.576,
        top: 8.636,
        left: 21.201,
        borderRadius: 30.795,
        overflow: 'hidden',
        backgroundColor: colors.lightGrey,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    percentageContainer: {
        position: 'absolute',
        top: 0,
        left: 30.748,
        backgroundColor: colors.white,
        borderWidth: 0.714,
        borderColor: colors.lightGrey,
        borderRadius: 19.275,
        paddingHorizontal: 14.457,
        paddingTop: 4.819,
        paddingBottom: 2.409,
        minWidth: 43.373,
        height: 17.345,
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentageText: {
        fontFamily: 'Inter',
        fontSize: 14.457,
        fontWeight: '700' as const,
        lineHeight: 16.35, // 1.13 * 14.457
        color: colors.successGreen,
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 17.28,
        height: 17.279,
    },
    editIconBg: {
        position: 'absolute',
        width: 24,
        height: 24,
        top: -3,
        left: -3,
    },
    editIconBgImage: {
        width: '100%',
        height: '100%',
    },
    editIconWrapper: {
        position: 'absolute',
        width: 16,
        height: 16,
        top: 1,
        left: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editIcon: {
        width: '100%',
        height: '100%',
    },
});

export default ProfileAvatarWithProgress;

