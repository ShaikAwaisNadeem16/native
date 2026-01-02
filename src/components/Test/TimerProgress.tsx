import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Clock } from 'lucide-react-native';
import { colors, typography } from '../../styles/theme';

interface TimerProgressProps {
    timeRemaining: string; // Format: "02:00:00"
    timeLabel: string; // e.g., "Time Remaining For Part 1"
    percentage?: number; // 0-100 for progress
}

const TimerProgress: React.FC<TimerProgressProps> = ({
    timeRemaining,
    timeLabel,
    percentage = 100,
}) => {
    const size = 32;
    const strokeWidth = 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const center = size / 2;

    return (
        <View style={styles.container}>
            <View style={styles.timerBar}>
                {/* Background circle */}
                <Svg width={size} height={size} style={styles.svg}>
                    <Circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke={colors.lightGrey}
                        strokeWidth={strokeWidth}
                        fill="none"
                        transform={`rotate(-90 ${center} ${center})`}
                    />
                    {/* Progress circle */}
                    <Circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke={colors.primaryBlue}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${center} ${center})`}
                    />
                </Svg>
                {/* Clock icon in center */}
                <View style={styles.iconContainer}>
                    <Clock size={24} color={colors.primaryBlue} />
                </View>
            </View>
            <View style={styles.timeInfo}>
                <Text style={styles.timeText}>{timeRemaining}</Text>
                <Text style={styles.timeLabel}>{timeLabel}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    timerBar: {
        width: 32,
        height: 32,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    svg: {
        position: 'absolute',
    },
    iconContainer: {
        position: 'absolute',
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeInfo: {
        flexDirection: 'column',
        gap: 0,
    },
    timeText: {
        ...typography.p3Bold,
        color: colors.primaryDarkBlue,
    },
    timeLabel: {
        ...typography.s1Regular,
        color: colors.textGrey,
    },
});

export default TimerProgress;





