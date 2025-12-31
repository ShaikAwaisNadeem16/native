import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';

interface DropdownFieldProps {
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: string[];
    error?: string;
}

const DropdownField: React.FC<DropdownFieldProps> = ({ 
    value, 
    onValueChange, 
    placeholder,
    options,
    error 
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option: string) => {
        onValueChange(option);
        setIsOpen(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.inputContainer, error && styles.inputContainerError]}
                onPress={() => setIsOpen(true)}
            >
                <Text style={[styles.inputText, !value && styles.placeholderText]}>
                    {value || placeholder}
                </Text>
                <ChevronDown size={24} color={colors.textGrey} />
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
        width: '100%',
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
        justifyContent: 'space-between',
        minHeight: 48,
    },
    inputContainerError: {
        borderColor: colors.error,
    },
    inputText: {
        ...typography.p4,
        color: colors.textGrey,
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
        ...typography.s1Regular,
        color: colors.error,
        marginTop: spacing.titleSubtitleGap,
    },
});

export default DropdownField;

