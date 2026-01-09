import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Animated } from 'react-native';
import {
    colors,
    typography,
    inputVariants,
    inputBaseStyles,
    getInputVariant,
    InputVariant,
    animations,
    borderRadius
} from '../../../styles/theme';

interface TextAreaWithFloatingLabelProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    maxLength?: number;
    error?: string;
    disabled?: boolean;
}

const TextAreaWithFloatingLabel: React.FC<TextAreaWithFloatingLabelProps> = ({
    value,
    onChangeText,
    placeholder,
    maxLength = 500,
    error,
    disabled = false
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
        outputRange: [variantStyles.placeholderColor, colors.primaryBlue], // Figma: label is primaryBlue (#0b6aea) when floated
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

                <View style={styles.textAreaWrapper}>
                    <TextInput
                        style={[
                            styles.input,
                            { color: variantStyles.textColor }
                        ]}
                        value={value}
                        onChangeText={onChangeText}
                        multiline={true}
                        maxLength={maxLength}
                        textAlignVertical="top"
                        editable={!disabled}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    {/* Character count at bottom right */}
                    <Text style={styles.charCount}>{value.length}/{maxLength}</Text>
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
        minHeight: 103, // Figma: h-[103px] for textarea
        paddingVertical: 12, // Figma: py-[12px]
        paddingHorizontal: 20, // Figma: px-[20px]
        borderWidth: 1,
        borderRadius: borderRadius.input, // Figma: rounded-[8px]
        flexDirection: 'column',
        gap: 8, // Figma: gap-[8px] between input text and char count
    },
    floatingLabel: {
        position: 'absolute',
        left: 12, // Slightly inset from input padding
        fontFamily: typography.s1Regular.fontFamily,
        zIndex: 1,
    },
    textAreaWrapper: {
        flex: 1,
        flexDirection: 'column',
        gap: 8, // Figma: gap-[8px] between input text and char count
    },
    input: {
        ...typography.p4,
        flex: 1,
        minHeight: 60, // Minimum height for multiline input
        padding: 0,
        margin: 0,
        color: colors.textGrey,
    },
    charCount: {
        ...typography.s1Regular,
        color: colors.placeholderGrey, // Figma: #80919f
        textAlign: 'right',
        alignSelf: 'flex-end',
        marginTop: 8, // Figma: gap-[8px] between input text and char count
    },
    errorText: {
        ...inputBaseStyles.errorText,
    },
});

export default TextAreaWithFloatingLabel;

