import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';

interface PrimaryButtonProps {
    label: string;
    onPress: () => void;
    disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ label, onPress, disabled = false }) => {
    return (
        <TouchableOpacity
            style={[styles.button, disabled && styles.buttonDisabled]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primaryBlue,
        borderRadius: borderRadius.input,
        paddingHorizontal: spacing.cardPaddingH / 2, // 24px
        paddingVertical: 10,
        minWidth: 140,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ededed', // Exact grey from Figma
        opacity: 1,
    },
    buttonText: {
        ...typography.p4SemiBold,
        color: colors.white,
        textAlign: 'center',
    },
    buttonTextDisabled: {
        color: '#72818c', // Exact grey text from Figma
    },
});

export default PrimaryButton;

