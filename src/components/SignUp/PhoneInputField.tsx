import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import {
    colors,
    typography,
    inputVariants,
    inputBaseStyles,
    getInputVariant,
    InputVariant,
    animations
} from '../../styles/theme';

interface PhoneInputFieldProps {
    value: string;
    onChangeText: (text: string) => void;
    countryCode?: string;
    countryFlag?: string;
    error?: string;
    disabled?: boolean;
}

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
    value,
    onChangeText,
    countryCode = '+91',
    countryFlag = 'https://www.figma.com/api/mcp/asset/6c4d43ed-16ac-4867-a1e9-20b023ca4da8', // India flag from Figma
    error,
    disabled = false
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showCountryPicker, setShowCountryPicker] = useState(false);

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

    // Interpolate label left position to account for country code section when floated
    const labelLeft = labelAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [120, 16], // Start after country code section, move to left when floated
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
                            left: labelLeft,
                            fontSize: labelFontSize,
                            color: labelColor,
                            backgroundColor: shouldFloat ? colors.white : 'transparent',
                            paddingHorizontal: shouldFloat ? animations.floatingLabel.horizontalPadding : 0,
                        }
                    ]}
                    pointerEvents="none"
                >
                    Mobile Number
                </Animated.Text>

                <View style={styles.countryCodeContainer}>
                    <View style={styles.countryCodeWrapper}>
                        <Image
                            source={{ uri: countryFlag }}
                            style={styles.flagIcon}
                            resizeMode="contain"
                        />
                        <Text style={[styles.countryCodeText, { color: variantStyles.textColor }]}>
                            {countryCode}
                        </Text>
                        <TouchableOpacity
                            style={styles.chevronContainer}
                            onPress={() => setShowCountryPicker(!showCountryPicker)}
                        >
                            <ChevronDown size={24} color={variantStyles.textColor} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.divider} />
                </View>
                <TextInput
                    style={[styles.input, { color: variantStyles.textColor }]}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType="phone-pad"
                    autoCorrect={false}
                    editable={!disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
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
        fontFamily: typography.p4.fontFamily,
        zIndex: 1,
    },
    countryCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 16,
    },
    countryCodeWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    flagIcon: {
        width: 24,
        height: 24,
    },
    countryCodeText: {
        ...typography.p4,
    },
    chevronContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: colors.lightGrey,
        marginLeft: 16,
    },
    input: {
        ...inputBaseStyles.input,
        flex: 1,
        minHeight: 24,
    },
    errorText: {
        ...inputBaseStyles.errorText,
    },
});

export default PhoneInputField;
