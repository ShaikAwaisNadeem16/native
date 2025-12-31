import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';

interface PasswordFieldProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ 
    value, 
    onChangeText, 
    placeholder = "Password",
    error,
    disabled = false
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
                    secureTextEntry={!isPasswordVisible}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!disabled}
                />
                <TouchableOpacity
                    style={styles.eyeIconContainer}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                    {isPasswordVisible ? (
                        <EyeOff size={24} color={colors.textGrey} />
                    ) : (
                        <Eye size={24} color={colors.textGrey} />
                    )}
                </TouchableOpacity>
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
        flexDirection: 'row',
        alignItems: 'center',
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
        flex: 1,
        padding: 0,
        margin: 0,
        minHeight: 24,
    },
    eyeIconContainer: {
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

export default PasswordField;

