import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';

interface TextInputFieldProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    error?: string;
    disabled?: boolean;
}

const TextInputField: React.FC<TextInputFieldProps> = ({ 
    value, 
    onChangeText, 
    placeholder,
    error,
    disabled = false
}) => {
    return (
        <View style={styles.container}>
            <View style={[
                styles.inputContainer, 
                error && styles.inputContainerError,
                disabled && styles.inputContainerDisabled
            ]}>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.placeholderGrey}
                    autoCapitalize="words"
                    autoCorrect={false}
                    editable={!disabled}
                />
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
    inputContainerDisabled: {
        backgroundColor: '#ededed', // Exact grey from Figma
    },
    input: {
        ...typography.p4,
        color: colors.textGrey,
        padding: 0,
        margin: 0,
        minHeight: 24,
    },
    errorText: {
        ...typography.s1Regular,
        color: colors.error,
        marginTop: spacing.titleSubtitleGap,
    },
});

export default TextInputField;

