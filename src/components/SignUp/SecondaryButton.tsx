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
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        borderRadius: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'transparent',
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














