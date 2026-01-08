import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';
import ModalBackdrop from '../../../components/ModalBackdrop';
import PrimaryButton from '../../../components/SignUp/PrimaryButton';
import SecondaryButton from '../../../components/SignUp/SecondaryButton';
import { FileCheck } from 'lucide-react-native';

/**
 * SubmitAssignmentConfirmationModal Component
 *
 * A reusable confirmation modal shown when user clicks "Submit Assignment".
 * Matches Figma design: node 8780-27370
 *
 * Usage:
 * ```tsx
 * <SubmitAssignmentConfirmationModal
 *   visible={showConfirmation}
 *   onConfirm={handleConfirmSubmit}
 *   onCancel={handleCancel}
 * />
 * ```
 */
export interface SubmitAssignmentConfirmationModalProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const SubmitAssignmentConfirmationModal: React.FC<SubmitAssignmentConfirmationModalProps> = ({
    visible,
    onConfirm,
    onCancel,
    isSubmitting = false,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onCancel}
        >
            <View style={styles.modalContainer}>
                <ModalBackdrop onPress={onCancel} />
                <View style={styles.modalContent}>
                    {/* Illustration */}
                    <View style={styles.illustrationContainer}>
                        <View style={styles.illustrationBackground}>
                            <View style={styles.illustrationDocument}>
                                <FileCheck size={48} color={colors.successGreen || '#27AE60'} />
                            </View>
                        </View>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Submit Assignment?</Text>

                    {/* Description */}
                    <Text style={styles.description}>
                        Are you sure you want to submit this assignment? Once submitted, you won't be able to make any changes.
                    </Text>

                    {/* Action Buttons */}
                    <View style={styles.buttonsContainer}>
                        <View style={styles.buttonWrapper}>
                            <SecondaryButton
                                label="Back"
                                onPress={onCancel}
                                disabled={isSubmitting}
                            />
                        </View>
                        <View style={styles.buttonWrapper}>
                            <PrimaryButton
                                label={isSubmitting ? 'Submitting...' : 'Submit'}
                                onPress={onConfirm}
                                disabled={isSubmitting}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 16, // Rounded top corners from Figma
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 0, // Sharp bottom corners from Figma
        borderBottomRightRadius: 0,
        paddingHorizontal: 24, // 24px horizontal padding from Figma
        paddingTop: 32, // 32px top padding from Figma
        paddingBottom: 24, // 24px bottom padding from Figma
        width: '100%',
        alignItems: 'center',
        gap: 24, // 24px gap between sections from Figma
    },
    illustrationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8, // Additional spacing from Figma
    },
    illustrationBackground: {
        width: 120, // Approximate size from Figma
        height: 120,
        backgroundColor: colors.lightGrey || '#E2EBF3', // Light blue background from Figma
        borderRadius: 16,
        borderWidth: 2,
        borderColor: colors.primaryBlue || '#0b6aea', // Blue border from Figma
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    illustrationDocument: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        ...typography.h6, // Large, bold heading from Figma
        color: colors.primaryDarkBlue, // #00213d from Figma
        textAlign: 'center',
    },
    description: {
        ...typography.p4, // Standard body text from Figma
        color: colors.textGrey, // #696a6f from Figma
        textAlign: 'center',
        paddingHorizontal: 16, // Additional horizontal padding for text
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 12, // 12px gap between buttons from Figma
        width: '100%',
    },
    buttonWrapper: {
        flex: 1, // Equal width for both buttons
    },
});

export default SubmitAssignmentConfirmationModal;

