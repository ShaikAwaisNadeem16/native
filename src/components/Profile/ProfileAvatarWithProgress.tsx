import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, typography } from '../../styles/theme';

interface ProfileAvatarWithProgressProps {
    percentage: number; // 0-100
    avatarUrl?: string;
    onEditPress?: () => void;
}

const ProfileAvatarWithProgress: React.FC<ProfileAvatarWithProgressProps> = ({
    percentage,
    avatarUrl,
    onEditPress,
}) => {
    const progressRingSize = 72; // From Figma: 72px
    const strokeWidth = 0.714; // From Figma: 0.714px border
    const radius = (progressRingSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const center = progressRingSize / 2;
    const avatarSize = 61.591; // From Figma: 61.591px

    // Image URLs from Figma
    const backgroundUrl = 'https://www.figma.com/api/mcp/asset/9f653d3c-f67f-477c-a95b-a57a0d494176';
    const ellipseUrl = 'https://www.figma.com/api/mcp/asset/a9c03cf7-8be8-4d45-9fb8-f9d98e26215c';
    const iconBgUrl = 'https://www.figma.com/api/mcp/asset/cad9b910-21c8-4f5a-8597-6ca51e08bd7e';
    const editIconUrl = 'https://www.figma.com/api/mcp/asset/54f5c0af-aa0c-41c1-81a8-1a4e8fde3de5';

    return (
        <View style={styles.container}>
            {/* Circular Progress Ring Background (Ellipse 440) */}
            <View style={styles.progressRingContainer}>
                <Image
                    source={{ uri: ellipseUrl }}
                    style={styles.progressRingBg}
                    resizeMode="contain"
                />
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
                <Image
                    source={{ uri: backgroundUrl }}
                    style={styles.avatarBackground}
                    resizeMode="cover"
                />
            </View>

            {/* Avatar Image */}
            {avatarUrl && (
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: avatarUrl }}
                        style={styles.avatar}
                        resizeMode="cover"
                    />
                </View>
            )}

            {/* Percentage Badge */}
            <View style={styles.percentageContainer}>
                <Text style={styles.percentageText}>{percentage}%</Text>
            </View>

            {/* Edit Icon */}
            <TouchableOpacity
                style={styles.editIconContainer}
                onPress={onEditPress}
                activeOpacity={0.7}
            >
                <View style={styles.editIconBg}>
                    <Image
                        source={{ uri: iconBgUrl }}
                        style={styles.editIconBgImage}
                        resizeMode="cover"
                    />
                </View>
                <View style={styles.editIconWrapper}>
                    <Image
                        source={{ uri: editIconUrl }}
                        style={styles.editIcon}
                        resizeMode="contain"
                    />
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

