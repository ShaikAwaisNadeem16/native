import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import { FileCheck } from 'lucide-react-native';

/**
 * SubmitAssignmentConfirmationModal Component
 *
 * A reusable confirmation modal shown when user clicks "Submit Assignment".
 * Matches Figma design: node 8780-27370
 * Uses unified ConfirmationModal component.
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
    const illustration = (
        <View style={styles.illustrationContainer}>
            <View style={styles.illustrationBackground}>
                <View style={styles.illustrationDocument}>
                    <FileCheck size={48} color={colors.successGreen || '#27AE60'} />
                </View>
            </View>
        </View>
    );

    return (
        <ConfirmationModal
            visible={visible}
            title="Submit Assignment?"
            description="Are you sure you want to submit this assignment? Once submitted, you won't be able to make any changes."
            variant="default"
            illustration={illustration}
            primaryButtonLabel="Submit"
            secondaryButtonLabel="Back"
            onConfirm={onConfirm}
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            buttonLayout="row"
        />
    );
};

const styles = StyleSheet.create({
    illustrationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    illustrationBackground: {
        width: 120,
        height: 120,
        backgroundColor: colors.lightGrey || '#E2EBF3',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: colors.primaryBlue || '#0b6aea',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    illustrationDocument: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SubmitAssignmentConfirmationModal;

