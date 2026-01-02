import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Image } from 'react-native';
import { ChevronDown, Trash2 } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';
import Checkbox from '../SignUp/Checkbox';

interface LanguageEntryProps {
    language: string;
    proficiency: string;
    canRead: boolean;
    canWrite: boolean;
    canSpeak: boolean;
    onLanguageChange: (language: string) => void;
    onProficiencyChange: (proficiency: string) => void;
    onReadChange: (value: boolean) => void;
    onWriteChange: (value: boolean) => void;
    onSpeakChange: (value: boolean) => void;
    onDelete: () => void;
    languageOptions: string[];
    proficiencyOptions: string[];
}

const LanguageEntry: React.FC<LanguageEntryProps> = ({
    language,
    proficiency,
    canRead,
    canWrite,
    canSpeak,
    onLanguageChange,
    onProficiencyChange,
    onReadChange,
    onWriteChange,
    onSpeakChange,
    onDelete,
    languageOptions,
    proficiencyOptions,
}) => {
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const [isProficiencyOpen, setIsProficiencyOpen] = useState(false);

    // Delete icon from Figma
    const deleteIconUrl = 'https://www.figma.com/api/mcp/asset/b1a64f85-5d59-4c88-a9a3-dde82e839ef9';

    return (
        <View style={styles.container}>
            {/* Language Dropdown */}
            <View style={styles.dropdownContainer}>
                <Text style={styles.label}>Language</Text>
                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setIsLanguageOpen(true)}
                >
                    <Text style={[styles.dropdownText, !language && styles.placeholderText]}>
                        {language || 'Select Language'}
                    </Text>
                    <ChevronDown size={24} color={colors.textGrey} />
                </TouchableOpacity>
            </View>

            {/* Proficiency Dropdown */}
            <View style={styles.dropdownContainer}>
                <Text style={styles.label}>Proficiency</Text>
                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setIsProficiencyOpen(true)}
                >
                    <Text style={[styles.dropdownText, !proficiency && styles.placeholderText]}>
                        {proficiency || 'Select Proficiency'}
                    </Text>
                    <ChevronDown size={24} color={colors.textGrey} />
                </TouchableOpacity>
            </View>

            {/* Checkboxes Row */}
            <View style={styles.checkboxRow}>
                <TouchableOpacity
                    style={styles.checkboxItem}
                    onPress={() => onReadChange(!canRead)}
                    activeOpacity={0.7}
                >
                    <Checkbox checked={canRead} onToggle={() => onReadChange(!canRead)} size={16} />
                    <Text style={styles.checkboxLabel}>Read</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.checkboxItem}
                    onPress={() => onWriteChange(!canWrite)}
                    activeOpacity={0.7}
                >
                    <Checkbox checked={canWrite} onToggle={() => onWriteChange(!canWrite)} size={16} />
                    <Text style={styles.checkboxLabel}>Write</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.checkboxItem}
                    onPress={() => onSpeakChange(!canSpeak)}
                    activeOpacity={0.7}
                >
                    <Checkbox checked={canSpeak} onToggle={() => onSpeakChange(!canSpeak)} size={16} />
                    <Text style={styles.checkboxLabel}>Speak</Text>
                </TouchableOpacity>
            </View>

            {/* Delete Button */}
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete} activeOpacity={0.7}>
                <Text style={styles.deleteText}>Delete</Text>
                <Image
                    source={{ uri: deleteIconUrl }}
                    style={styles.deleteIcon}
                    resizeMode="contain"
                />
            </TouchableOpacity>

            {/* Language Modal */}
            <Modal
                visible={isLanguageOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsLanguageOpen(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsLanguageOpen(false)}
                >
                    <View style={styles.dropdownList}>
                        <FlatList
                            data={languageOptions}
                            keyExtractor={(item, index) => `lang-${item}-${index}`}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        onLanguageChange(item);
                                        setIsLanguageOpen(false);
                                    }}
                                >
                                    <Text style={styles.dropdownItemText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Proficiency Modal */}
            <Modal
                visible={isProficiencyOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsProficiencyOpen(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsProficiencyOpen(false)}
                >
                    <View style={styles.dropdownList}>
                        <FlatList
                            data={proficiencyOptions}
                            keyExtractor={(item, index) => `prof-${item}-${index}`}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        onProficiencyChange(item);
                                        setIsProficiencyOpen(false);
                                    }}
                                >
                                    <Text style={styles.dropdownItemText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 16,
    },
    dropdownContainer: {
        width: '100%',
    },
    label: {
        ...typography.s1Regular,
        color: colors.textGrey,
        marginBottom: 8,
    },
    dropdown: {
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
    dropdownText: {
        ...typography.p4,
        color: colors.textGrey,
        flex: 1,
    },
    placeholderText: {
        color: colors.placeholderGrey,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkboxLabel: {
        ...typography.s1Regular,
        color: colors.textGrey,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    deleteText: {
        ...typography.p4SemiBold,
        color: colors.error,
    },
    deleteIcon: {
        width: 16,
        height: 16,
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
});

export default LanguageEntry;
