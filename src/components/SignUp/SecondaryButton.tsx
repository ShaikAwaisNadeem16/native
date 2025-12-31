import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../styles/theme';

interface SecondaryButtonProps {
    label: string;
    onPress: () => void;
    disabled?: boolean;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ label, onPress, disabled = false }) => {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    buttonText: {
        ...typography.p4SemiBold,
        color: colors.primaryBlue,
        textAlign: 'center',
    },
    buttonTextDisabled: {
        opacity: 0.5,
    },
});

export default SecondaryButton;

