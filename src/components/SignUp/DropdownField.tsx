import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Animated } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
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
        outputRange: [variantStyles.placeholderColor, isOpen ? colors.primaryBlue : colors.primaryDarkBlue],
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
                    {value || placeholder}
                </Text>
                <ChevronDown size={24} color={variantStyles.textColor} />
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
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.dropdownItem}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text style={styles.dropdownItemText}>{item}</Text>
                                </TouchableOpacity>
                            )}
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
        borderRadius: borderRadius.card,
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        padding: 8,
        maxHeight: 300,
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 12,
        elevation: 8,
    },
    dropdownItem: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 4,
    },
    dropdownItemText: {
        ...typography.p3Regular,
        color: colors.textGrey,
    },
    errorText: {
        ...inputBaseStyles.errorText,
    },
});

export default DropdownField;



