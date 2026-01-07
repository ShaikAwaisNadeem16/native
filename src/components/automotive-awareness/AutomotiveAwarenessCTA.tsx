import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '../../styles/theme';

interface AutomotiveAwarenessCTAProps {
    label?: string;
    onPress: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
}

/**
 * AutomotiveAwarenessCTA Component
 * Renders CTA button styled exactly as per Figma design
 */
const AutomotiveAwarenessCTA: React.FC<AutomotiveAwarenessCTAProps> = ({
    label = 'Learn More',
    onPress,
    disabled = false,
    variant = 'primary',
}) => {
    const isPrimary = variant === 'primary';

    return (
        <TouchableOpacity
            style={[
                styles.button,
                isPrimary ? styles.primaryButton : styles.secondaryButton,
                disabled && styles.buttonDisabled,
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <Text
                style={[
                    styles.buttonText,
                    isPrimary ? styles.primaryText : styles.secondaryText,
                    disabled && styles.buttonTextDisabled,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    primaryButton: {
        backgroundColor: colors.primaryBlue,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primaryBlue,
    },
    buttonDisabled: {
        backgroundColor: '#ededed',
        borderColor: '#ededed',
        opacity: 1,
    },
    buttonText: {
        ...typography.p4SemiBold,
        textAlign: 'center',
    },
    primaryText: {
        color: colors.white,
    },
    secondaryText: {
        color: colors.primaryBlue,
    },
    buttonTextDisabled: {
        color: '#72818c',
    },
});

export default AutomotiveAwarenessCTA;
