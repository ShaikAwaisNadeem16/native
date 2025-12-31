import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';

interface EmailInputFieldProps {
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    showCheckmark?: boolean;
}

const EmailInputField: React.FC<EmailInputFieldProps> = ({ 
    value, 
    onChangeText, 
    error,
    showCheckmark = false 
}) => {
    const hasValue = value.length > 0;
    const showLabel = hasValue || showCheckmark;

    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer, error && styles.inputContainerError]}>
                <View style={styles.inputContent}>
                    {showLabel && (
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Email ID</Text>
                        </View>
                    )}
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            value={value}
                            onChangeText={onChangeText}
                            placeholder={!showLabel ? "Email ID*" : ""}
                            placeholderTextColor={colors.placeholderGrey}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {showCheckmark && hasValue && (
                            <View style={styles.checkmarkContainer}>
                                <Check size={24} color="#27AE60" />
                            </View>
                        )}
                    </View>
                </View>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.input,
        paddingHorizontal: spacing.inputPaddingH,
        paddingVertical: spacing.inputPaddingV,
    },
    inputContainerError: {
        borderColor: colors.error,
    },
    inputContent: {
        flex: 1,
        position: 'relative',
    },
    labelContainer: {
        position: 'absolute',
        top: -22,
        left: -8,
        backgroundColor: colors.white,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 2,
        zIndex: 1,
    },
    label: {
        ...typography.s1Regular,
        color: colors.primaryDarkBlue,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        minHeight: 24,
    },
    input: {
        ...typography.p4,
        color: colors.textGrey,
        flex: 1,
        padding: 0,
        margin: 0,
    },
    checkmarkContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        ...typography.s1Regular,
        color: colors.error,
        marginTop: spacing.titleSubtitleGap,
    },
});

export default EmailInputField;

