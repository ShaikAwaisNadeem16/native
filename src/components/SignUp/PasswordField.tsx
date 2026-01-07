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
        isDisabled: disabled,
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
                    style={[
                        styles.input,
                        { color: variantStyles.textColor }
                    ]}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={!isPasswordVisible}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!disabled}
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
    errorText: {
        ...inputBaseStyles.errorText,
    },
});

export default PasswordField;
