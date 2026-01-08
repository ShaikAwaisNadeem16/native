import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import DownwardArrow from '../../../components/common/DownwardArrow';
import {
    colors,
    typography,
    borderRadius,
    inputVariants,
    inputBaseStyles,
    getInputVariant,
    InputVariant
} from '../../../styles/theme';

interface DropdownWithLabelProps {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: string[];
    error?: string;
    required?: boolean;
    disabled?: boolean;
}

const DropdownWithLabel: React.FC<DropdownWithLabelProps> = ({
    label,
    value,
    onValueChange,
    placeholder,
    options,
    error,
    required = false,
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    // Determine current variant based on state
    const variant: InputVariant = getInputVariant({
        isFocused: isOpen,
        hasError: !!error,
        isDisabled: disabled,
        hasValue: !!value,
    });

    // Get variant-specific styles
    const variantStyles = inputVariants[variant];

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
            <Text style={styles.label}>
                {label}
                {required && <Text style={styles.required}>*</Text>}
            </Text>
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
                <Text style={[
                    styles.inputText,
                    !value && styles.placeholderText,
                    { color: value ? variantStyles.textColor : variantStyles.placeholderColor }
                ]}>
                    {value || placeholder}
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
    label: {
        ...inputBaseStyles.label,
    },
    required: {
        ...inputBaseStyles.required,
    },
    inputContainer: {
        ...inputBaseStyles.inputContainer,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 48,
    },
    inputText: {
        ...typography.p4,
        flex: 1,
    },
    placeholderText: {
        color: colors.placeholderGrey,
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

export default DropdownWithLabel;
