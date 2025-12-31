import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography } from '../../styles/theme';

interface TimerResendProps {
    timeRemaining: string;
    onResend: () => void;
}

const TimerResend: React.FC<TimerResendProps> = ({ timeRemaining, onResend }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.timerText}>Time Remaining: {timeRemaining}</Text>
            <View style={styles.divider} />
            <TouchableOpacity onPress={onResend}>
                <Text style={styles.resendLink}>Resend OTPs</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 8,
    },
    timerText: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 15,
        color: colors.placeholderGrey,
    },
    divider: {
        width: 1,
        height: 15,
        backgroundColor: colors.lightGrey,
    },
    resendLink: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 15,
        color: colors.primaryBlue,
        textDecorationLine: 'underline',
    },
});

export default TimerResend;

