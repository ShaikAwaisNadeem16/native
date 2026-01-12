import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';

interface NavigationItemProps {
    icon?: React.ReactNode;
    label: string;
    description: string;
    variant?: 'primary' | 'outline' | 'link';
    onPress?: () => void;
}

/**
 * Navigation item component for instructions
 * Supports link, primary, and outline variants
 * Matches Figma design exactly
 */
const NavigationItem: React.FC<NavigationItemProps> = ({
    icon,
    label,
    description,
    variant = 'link',
    onPress,
}) => {
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';
    const isLink = variant === 'link';

    return (
        <View style={styles.container}>
            {isLink ? (
                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={onPress}
                    activeOpacity={0.7}
                    disabled={!onPress}
                >
                    {icon && <View style={styles.linkIcon}>{icon}</View>}
                    <Text style={styles.linkText}>{label}</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={[
                        styles.button,
                        isPrimary && styles.buttonPrimary,
                        isOutline && styles.buttonOutline,
                    ]}
                    onPress={onPress}
                    activeOpacity={0.7}
                    disabled={!onPress}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            isPrimary && styles.buttonTextPrimary,
                            isOutline && styles.buttonTextOutline,
                        ]}
                    >
                        {label}
                    </Text>
                </TouchableOpacity>
            )}
            <Text style={styles.description}>{description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 4,
        width: '100%',
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
    },
    linkIcon: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    linkText: {
        ...typography.s1Regular,
        color: colors.primaryBlue,
    },
    button: {
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
        minWidth: 173,
    },
    buttonPrimary: {
        backgroundColor: colors.primaryBlue,
    },
    buttonOutline: {
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        backgroundColor: 'transparent',
    },
    buttonText: {
        ...typography.s2SemiBold,
        color: colors.primaryBlue,
    },
    buttonTextPrimary: {
        color: colors.white,
    },
    buttonTextOutline: {
        color: colors.primaryBlue,
    },
    description: {
        ...typography.p4,
        color: colors.textGrey,
        width: '100%',
    },
});

export default NavigationItem;

