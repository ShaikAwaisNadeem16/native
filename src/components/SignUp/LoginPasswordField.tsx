import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';

interface LoginPasswordFieldProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    error?: string;
    onForgotPassword?: () => void;
}

const LoginPasswordField: React.FC<LoginPasswordFieldProps> = ({ 
    value, 
    onChangeText, 
    placeholder = "Password",
    error,
    onForgotPassword
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer, error && styles.inputContainerError]}>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.placeholderGrey}
                    secureTextEntry={!isPasswordVisible}
                    autoCapitalize="none"
                    autoCorrect={false}
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
            {onForgotPassword && (
                <TouchableOpacity onPress={onForgotPassword} style={styles.forgotPasswordContainer}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
            )}
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 8, // Exact gap from Figma (8px between input and forgot password link)
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
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
    },
    forgotPasswordText: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 15,
        color: colors.primaryBlue,
        textDecorationLine: 'underline',
    },
    errorText: {
        ...typography.s1Regular,
        color: colors.error,
        marginTop: spacing.titleSubtitleGap,
    },
});

export default LoginPasswordField;

