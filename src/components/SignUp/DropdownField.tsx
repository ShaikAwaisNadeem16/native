import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Animated } from 'react-native';
import DownwardArrow from '../common/DownwardArrow';
import {
    colors,
    typography,
    borderRadius,
    inputVariants,
    inputBaseStyles,
    getInputVariant,
    InputVariant,
    animations
} from '../../styles/theme';

interface DropdownFieldProps {
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: string[];
    error?: string;
    disabled?: boolean;
}

const DropdownField: React.FC<DropdownFieldProps> = ({
    value,
    onValueChange,
    placeholder,
    options,
    error,
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);

    // Animated value for floating label
    const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;

    // Track if label should be floated (open OR has value)
    const shouldFloat = isOpen || value.length > 0;

    useEffect(() => {
        Animated.timing(labelAnimation, {
            toValue: shouldFloat ? 1 : 0,
            duration: animations.floatingLabel.duration,
            useNativeDriver: false,
        }).start();
    }, [shouldFloat, labelAnimation]);

    // Determine current variant based on state
    const variant: InputVariant = getInputVariant({
        isFocused: isOpen,
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
        outputRange: [variantStyles.placeholderColor, colors.primaryDarkBlue], // Figma: label always primaryDarkBlue when floated
    });

    const handleSelect = (option: string) => {
        onValueChange(option);
        setIsOpen(false);
    };

    const handleOpen = () => {
        if (!disabled) {
            setIsOpen(true);
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
                    {value}
                </Text>
                <DownwardArrow size={24} />
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsOpen(false)}
                >
                    <View style={styles.dropdownList}>
                        <FlatList
                            data={options}
                            keyExtractor={(item, index) => `${item}-${index}`}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.dropdownItem,
                                        index < options.length - 1 && styles.dropdownItemWithGap
                                    ]}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text style={styles.dropdownItemText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                            showsVerticalScrollIndicator={true} // Figma: Show scrollbar
                            scrollIndicatorInsets={{ right: 3 }} // Position scrollbar
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownList: {
        backgroundColor: colors.white,
        borderRadius: 12, // Figma: rounded-[12px]
        borderWidth: 1,
        borderColor: colors.primaryBlue, // Figma: border-[var(--primary-blue,#0b6aea)]
        padding: 8, // Figma: px-[8px] py-0
        paddingVertical: 0, // Figma: py-0
        maxHeight: 300,
        width: 200, // Figma: w-[200px]
        shadowColor: '#092C4C', // Figma: shadow-[0px_8px_16px_-12px_rgba(9,44,76,0.22)]
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.22,
        shadowRadius: 12,
        elevation: 8,
        overflow: 'hidden', // Ensure scrollbar is visible
    },
    dropdownItem: {
        paddingHorizontal: 12, // Figma: px-[12px]
        paddingVertical: 8, // Figma: py-[8px]
        borderRadius: 4, // Figma: rounded-[4px]
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // Figma: gap-[8px] (internal spacing)
    },
    dropdownItemWithGap: {
        marginBottom: 4, // Figma: gap-[4px] between items
    },
    dropdownItemText: {
        ...typography.p3Regular, // Figma: Desktop/P3 Regular, 16px, line-height 25px, weight 400
        color: colors.textGrey, // Figma: text-[color:var(--text-grey,#696a6f)]
        flex: 1, // Figma: flex-[1_0_0] - takes available space
        minWidth: 0, // Allow flex shrinking
    },
    errorText: {
        ...inputBaseStyles.errorText,
    },
});

export default DropdownField;



