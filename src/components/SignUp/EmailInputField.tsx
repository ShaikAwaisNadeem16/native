import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Animated } from 'react-native';
import { Check } from 'lucide-react-native';
import {
    colors,
    typography,
    inputVariants,
    inputBaseStyles,
    getInputVariant,
    InputVariant,
    animations
} from '../../styles/theme';

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
        outputRange: [variantStyles.placeholderColor, isFocused ? colors.textGrey : colors.primaryDarkBlue],
    });

    return (
        <View style={styles.container}>
            <View style={[
                styles.inputContainer,
                {
                    // Email field: blue outline when focused, gray otherwise
                    borderColor: isFocused ? colors.primaryBlue : variantStyles.borderColor,
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
                    Email ID*
                </Animated.Text>

                <View style={styles.inputWrapper}>
                    <TextInput
                        style={[styles.input, { color: variantStyles.textColor }]}
                        value={value}
                        onChangeText={onChangeText}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    {showCheckmark && value.length > 0 && (
                        <View style={styles.checkmarkContainer}>
                            <Check size={24} color="#27AE60" />
                        </View>
                    )}
                </View>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...inputBaseStyles.container,
    },
    inputContainer: {
        ...inputBaseStyles.inputContainer,
        position: 'relative',
    },
    floatingLabel: {
        position: 'absolute',
        left: 16,
        fontFamily: typography.p4.fontFamily,
        zIndex: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        minHeight: 24,
    },
    input: {
        ...inputBaseStyles.input,
        flex: 1,
    },
    checkmarkContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        ...inputBaseStyles.errorText,
    },
});

export default EmailInputField;
