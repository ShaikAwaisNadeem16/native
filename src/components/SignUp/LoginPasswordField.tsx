import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import {
    colors,
    typography,
    inputVariants,
    inputBaseStyles,
    getInputVariant,
    InputVariant,
    animations
} from '../../styles/theme';

// Import assets
import eyeIcon from '../../../assets/quill_eye.png';

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
    const [isFocused, setIsFocused] = useState(false);

    // Animated value for floating label
    const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;

    // Track if label should be floated (focused OR has value)
    const shouldFloat = isFocused || value.length > 0;

    useEffect(() => {
        Animated.timing(labelAnimation, {
            toValue: shouldFloat ? 1 : 0,
            duration: animations.floatingLabel.duration,
            useNativeDriver: false,
        }).start();
    }, [shouldFloat, labelAnimation]);

    // Determine current variant based on state
    const variant: InputVariant = getInputVariant({
        isFocused,
        hasError: !!error,
        hasValue: !!value,
    });

    // Get variant-specific styles
    const variantStyles = inputVariants[variant];

    // Interpolate label position and font size
    const labelTop = labelAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [animations.floatingLabel.defaultTop, animations.floatingLabel.floatedTop],
    });

    const labelFontSize = labelAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [animations.floatingLabel.defaultFontSize, animations.floatingLabel.floatedFontSize],
    });

    const labelColor = labelAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [variantStyles.placeholderColor, isFocused ? colors.primaryBlue : colors.primaryDarkBlue],
    });

    return (
        <View style={styles.container}>
            <View style={[
                styles.inputContainer,
                {
                    borderColor: variantStyles.borderColor,
                    backgroundColor: variantStyles.backgroundColor,
                }
            ]}>
                {/* Floating Label */}
                <Animated.Text
                    style={[
                        styles.floatingLabel,
                        {
                            top: labelTop,
                            fontSize: labelFontSize,
                            color: labelColor,
                            backgroundColor: shouldFloat ? colors.white : 'transparent',
                            paddingHorizontal: shouldFloat ? animations.floatingLabel.horizontalPadding : 0,
                        }
                    ]}
                    pointerEvents="none"
                >
                    {placeholder}
                </Animated.Text>

                <TextInput
                    style={[styles.input, { color: variantStyles.textColor }]}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={!isPasswordVisible}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                <TouchableOpacity
                    style={styles.eyeIconContainer}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                    <Image
                        source={eyeIcon}
                        style={styles.eyeIcon}
                        resizeMode="contain"
                    />
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
        ...inputBaseStyles.inputContainer,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    floatingLabel: {
        position: 'absolute',
        left: 16,
        fontFamily: typography.p4.fontFamily,
        zIndex: 1,
    },
    input: {
        ...inputBaseStyles.input,
        flex: 1,
        minHeight: 24,
    },
    eyeIconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    eyeIcon: {
        width: 24,
        height: 24,
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
        ...inputBaseStyles.errorText,
    },
});

export default LoginPasswordField;
