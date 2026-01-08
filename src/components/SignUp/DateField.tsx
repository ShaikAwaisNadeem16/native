import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CalendarIcon from '../common/CalendarIcon';
import {
    colors,
    typography,
    inputVariants,
    inputBaseStyles,
    getInputVariant,
    InputVariant,
    animations
} from '../../styles/theme';

interface DateFieldProps {
    value: Date | null;
    onValueChange: (date: Date) => void;
    placeholder: string;
    error?: string;
    disabled?: boolean;
}

const DateField: React.FC<DateFieldProps> = ({
    value,
    onValueChange,
    placeholder,
    error,
    disabled = false
}) => {
    const [showPicker, setShowPicker] = useState(false);

    // Animated value for floating label
    const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;

    // Track if label should be floated (picker open OR has value)
    const shouldFloat = showPicker || !!value;

    useEffect(() => {
        Animated.timing(labelAnimation, {
            toValue: shouldFloat ? 1 : 0,
            duration: animations.floatingLabel.duration,
            useNativeDriver: false,
        }).start();
    }, [shouldFloat, labelAnimation]);

    // Determine current variant based on state
    const variant: InputVariant = getInputVariant({
        isFocused: showPicker,
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
        outputRange: [variantStyles.placeholderColor, showPicker ? colors.textGrey : colors.primaryDarkBlue],
    });

    const formatDate = (date: Date | null): string => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowPicker(false);
        }
        if (selectedDate) {
            onValueChange(selectedDate);
        }
    };

    const handleOpen = () => {
        if (!disabled) {
            setShowPicker(true);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.inputContainer,
                    {
                        borderColor: variantStyles.borderColor,
                        backgroundColor: variantStyles.backgroundColor,
                    }
                ]}
                onPress={handleOpen}
                disabled={disabled}
            >
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

                <Text style={[
                    styles.inputText,
                    { color: value ? variantStyles.textColor : 'transparent' }
                ]}>
                    {value ? formatDate(value) : placeholder}
                </Text>
                <CalendarIcon size={24} />
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                />
            )}

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
        justifyContent: 'space-between',
        minHeight: 48,
        position: 'relative',
    },
    floatingLabel: {
        position: 'absolute',
        left: 16,
        fontFamily: typography.p4.fontFamily,
        zIndex: 1,
    },
    inputText: {
        ...typography.p4,
        flex: 1,
    },
    errorText: {
        ...inputBaseStyles.errorText,
    },
});

export default DateField;
