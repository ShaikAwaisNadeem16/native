import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';

interface StartQuizButtonProps {
    label: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
}

/**
 * Start Quiz button component
 * Matches Figma design exactly
 * Disabled state: grey background (#ededed), grey text (#72818c)
 * Enabled state: primary blue background, white text
 */
const StartQuizButton: React.FC<StartQuizButtonProps> = ({
    label,
    onPress,
    disabled = false,
    loading = false,
}) => {
    return (
        <TouchableOpacity
            style={[styles.button, disabled && styles.buttonDisabled]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={disabled ? colors.textGrey : colors.white} />
            ) : (
                <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primaryBlue,
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 140,
        width: '100%',
    },
    buttonDisabled: {
        backgroundColor: '#ededed', // Exact from Figma
    },
    buttonText: {
        ...typography.p4SemiBold,
        color: colors.white,
        textAlign: 'center',
    },
    buttonTextDisabled: {
        color: '#72818c', // Exact from Figma
    },
});

export default StartQuizButton;

