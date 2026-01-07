import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import {
    colors,
    typography,
    inputVariants,
    inputBaseStyles,
    inputDimensions,
    getInputVariant,
    InputVariant
} from '../../../styles/theme';

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
    disabled?: boolean;
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
    disabled = false,
    ...textInputProps
}) => {
    const [isFocused, setIsFocused] = useState(false);

    // Determine current variant based on state
    const variant: InputVariant = getInputVariant({
        isFocused,
        hasError: !!error,
        isDisabled: disabled,
        hasValue: !!value,
    });

    // Get variant-specific styles
    const variantStyles = inputVariants[variant];

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label}
                {required && <Text style={styles.required}>*</Text>}
            </Text>
            <View style={[
                styles.inputContainer,
                multiline && styles.multilineContainer,
                {
                    borderColor: variantStyles.borderColor,
                    backgroundColor: variantStyles.backgroundColor,
                }
            ]}>
                <TextInput
                    style={[
                        styles.input,
                        multiline && styles.multilineInput,
                        { color: variantStyles.textColor }
                    ]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={variantStyles.placeholderColor}
                    multiline={multiline}
                    maxLength={maxLength}
                    textAlignVertical={multiline ? 'top' : 'center'}
                    editable={!disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...textInputProps}
                />
                {/* Character count positioned inside input container, right-aligned (Figma) */}
                {showCharCount && maxLength && multiline && (
                    <Text style={styles.charCountInline}>{value.length}/{maxLength}</Text>
                )}
            </View>
            {/* Character count for non-multiline inputs (if ever needed) */}
            {showCharCount && maxLength && !multiline && (
                <Text style={styles.charCount}>{value.length}/{maxLength}</Text>
            )}
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...inputBaseStyles.container,
    },
    label: {
        ...inputBaseStyles.label,
    },
    required: {
        ...inputBaseStyles.required,
    },
    inputContainer: {
        ...inputBaseStyles.inputContainer,
    },
    multilineContainer: {
        minHeight: inputDimensions.multilineMinHeight,
        flexDirection: 'column' as const, // Figma: flex flex-col
        gap: 8, // Figma: gap-[8px] between input text and char count
    },
    input: {
        ...inputBaseStyles.input,
    },
    multilineInput: {
        flex: 1, // Figma: flex flex-[1_0_0] for input text area
        minHeight: inputDimensions.multilineMinHeight - inputDimensions.textMinHeight - 24, // Account for char count space
    },
    charCount: {
        ...inputBaseStyles.charCount,
    },
    charCountInline: {
        ...typography.s1Regular,
        color: colors.placeholderGrey, // Figma: #80919f
        textAlign: 'right' as const,
        width: '100%',
        marginTop: 8, // Figma: gap-[8px] between input text and char count
    },
    errorText: {
        ...inputBaseStyles.errorText,
    },
});

export default FormInputWithLabel;
