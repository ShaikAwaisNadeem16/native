import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, typography } from '../../../styles/theme';
import Avatar from '../../../components/common/Avatar';

interface CircularProgressProps {
    percentage: number; // 0-100
    size?: number;
    strokeWidth?: number;
    avatarUrl?: string | number; // Can be URI string or require() result (number)
    loading?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
    percentage,
    size = 60,
    strokeWidth = 0.723,
    avatarUrl = '',
    loading = false,
}) => {
    // Ensure percentage is a valid number between 0-100
    const safePercentage = typeof percentage === 'number' && !isNaN(percentage) ? Math.min(Math.max(percentage, 0), 100) : 0;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (safePercentage / 100) * circumference;
    const center = size / 2;
    const avatarSize = size * 0.855; // 51.326 / 60
    const avatarTop = (size - avatarSize) / 2; // Center the avatar vertically
    const avatarLeft = (size - avatarSize) / 2; // Center the avatar horizontally

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            {/* Background circle (light grey) */}
            <Svg width={size} height={size} style={styles.svg}>
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={colors.lightGrey}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress circle (green) - ONLY show if not loading */}
                {!loading && (
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
                )}
            </Svg>
            {/* Avatar in center */}
            {avatarUrl && avatarUrl !== '' ? (
                <View style={[styles.avatarContainer, {
                    width: avatarSize,
                    height: avatarSize,
                    top: avatarTop,
                    left: avatarLeft,
                }]}>
                    <Image
                        source={typeof avatarUrl === 'string' ? { uri: avatarUrl } : avatarUrl}
                        style={styles.avatar}
                        resizeMode="cover"
                    />
                </View>
            ) : (
                <View style={[styles.avatarContainer, {
                    width: avatarSize,
                    height: avatarSize,
                    top: avatarTop,
                    left: avatarLeft,
                }]}>
                    <Avatar size={avatarSize} />
                </View>
            )}
            {/* Percentage badge - positioned at top right of circle */}
            {!loading && (
                <View style={styles.percentageContainer}>
                    <Text style={styles.percentageText}>{safePercentage}%</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    svg: {
        position: 'absolute',
    },
    avatarContainer: {
        position: 'absolute',
        borderRadius: 100,
        overflow: 'hidden',
        backgroundColor: colors.lightGrey,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    percentageContainer: {
        position: 'absolute',
        top: 16, // 2.89px from top in Figma (scaled)
        left: 28.289, // Position from Figma
        backgroundColor: colors.white,
        borderWidth: 0.723,
        borderColor: colors.lightGrey,
        borderRadius: 11.566,
        paddingHorizontal: 8.675,
        paddingTop: 2.892,
        paddingBottom: 1.446,
        minWidth: 36.145,
        height: 14.458,
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentageText: {
        fontFamily: 'Inter',
        fontSize: 8.675,
        fontWeight: '700' as const,
        lineHeight: 9.8,
        color: colors.successGreen,
    },
});

export default CircularProgress;

