import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';

interface FormInputWithLabelProps extends Omit<TextInputProps, 'style'> {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    multiline?: boolean;
    maxLength?: number;
    showCharCount?: boolean;
}

const FormInputWithLabel: React.FC<FormInputWithLabelProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    required = false,
    multiline = false,
    maxLength,
    showCharCount = false,
    ...textInputProps
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label}
                {required && <Text style={styles.required}>*</Text>}
            </Text>
            <View style={[
                styles.inputContainer,
                multiline && styles.multilineContainer,
                error && styles.inputContainerError
            ]}>
                <TextInput
                    style={[styles.input, multiline && styles.multilineInput]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.placeholderGrey}
                    multiline={multiline}
                    maxLength={maxLength}
                    textAlignVertical={multiline ? 'top' : 'center'}
                    {...textInputProps}
                />
            </View>
            {showCharCount && maxLength && (
                <Text style={styles.charCount}>{value.length}/{maxLength}</Text>
            )}
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    label: {
        ...typography.s1Regular,
        color: colors.textGrey,
        marginBottom: 8,
    },
    required: {
        color: colors.primaryBlue,
    },
    inputContainer: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.input,
        paddingHorizontal: spacing.inputPaddingH,
        paddingVertical: spacing.inputPaddingV,
    },
    multilineContainer: {
        minHeight: 100,
    },
    inputContainerError: {
        borderColor: colors.error,
    },
    input: {
        ...typography.p4,
        color: colors.textGrey,
        padding: 0,
        margin: 0,
        minHeight: 20,
    },
    multilineInput: {
        minHeight: 80,
    },
    charCount: {
        ...typography.s1Regular,
        color: colors.textGrey,
        textAlign: 'right',
        marginTop: 4,
    },
    errorText: {
        ...typography.s1Regular,
        color: colors.error,
        marginTop: 4,
    },
});

export default FormInputWithLabel;
