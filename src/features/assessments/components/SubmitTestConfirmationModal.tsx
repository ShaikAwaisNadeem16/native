import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { colors, typography, borderRadius, shadows } from '../../../styles/theme';
import ModalBackdrop from '../../../components/ModalBackdrop';
import PrimaryButton from '../../../components/SignUp/PrimaryButton';
import SecondaryButton from '../../../components/SignUp/SecondaryButton';

/**
 * SubmitTestConfirmationModal Component
 *
 * A reusable confirmation modal shown when user clicks "Submit Test"
 * and there are unanswered or review-marked questions.
 * Matches Figma design: node 7875-74423
 *
 * Usage:
 * ```tsx
 * <SubmitTestConfirmationModal
 *   visible={showConfirmation}
 *   unansweredCount={5}
 *   reviewMarkedCount={2}
 *   onConfirm={handleConfirmSubmit}
 *   onCancel={handleReturnToAttempt}
 * />
 * ```
 */
export interface SubmitTestConfirmationModalProps {
    visible: boolean;
    unansweredCount: number;
    reviewMarkedCount: number;
    onConfirm: () => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const SubmitTestConfirmationModal: React.FC<SubmitTestConfirmationModalProps> = ({
    visible,
    unansweredCount,
    reviewMarkedCount,
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
                    {/* Title and Description */}
                    <View style={styles.headerSection}>
                        <Text style={styles.title}>Submit All Answers?</Text>
                        <Text style={styles.description}>
                            Once you submit all the answers you won't be able to change them
                        </Text>
                    </View>

                    {/* Warning Section */}
                    {(unansweredCount > 0 || reviewMarkedCount > 0) && (
                        <View style={styles.warningSection}>
                            {unansweredCount > 0 && (
                                <Text style={styles.warningText}>
                                    <Text>Unanswered Questions: </Text>
                                    <Text style={styles.warningValue}>{unansweredCount}</Text>
                                </Text>
                            )}
                            {reviewMarkedCount > 0 && (
                                <Text style={styles.warningText}>
                                    <Text>Questions Marked For Review: </Text>
                                    <Text style={styles.warningValue}>{reviewMarkedCount}</Text>
                                </Text>
                            )}
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View style={styles.buttonsContainer}>
                        {/* Return To Attempt Button (Primary) */}
                        <TouchableOpacity
                            style={styles.returnButton}
                            onPress={onCancel}
                            disabled={isSubmitting}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.returnButtonText}>Return To Attempt</Text>
                        </TouchableOpacity>

                        {/* Submit Test Button (Secondary) */}
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={onConfirm}
                            disabled={isSubmitting}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.submitButtonText}>
                                {isSubmitting ? 'Submitting...' : 'Submit Test'}
                            </Text>
                        </TouchableOpacity>
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
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 24,
        width: '100%',
        alignItems: 'center',
        gap: 32,
        ...shadows.activeElement,
    },
    headerSection: {
        width: '100%',
        alignItems: 'center',
        gap: 4,
    },
    title: {
        ...typography.p2Bold,
        color: colors.primaryDarkBlue,
        textAlign: 'center',
        width: '100%',
    },
    description: {
        ...typography.s1Regular,
        color: colors.textGrey,
        textAlign: 'center',
        width: '100%',
    },
    warningSection: {
        backgroundColor: '#fcefdc', // Light orange/peach background from Figma
        borderRadius: borderRadius.input,
        padding: 12,
        width: '100%',
        gap: 8,
        justifyContent: 'center',
    },
    warningText: {
        ...typography.p4,
        color: '#eb5757', // Red/orange text color from Figma
        lineHeight: 20,
    },
    warningValue: {
        ...typography.p4SemiBold,
        color: '#eb5757', // Red/orange text color from Figma
    },
    buttonsContainer: {
        width: '100%',
        flexDirection: 'column',
        gap: 16,
        alignItems: 'center',
    },
    returnButton: {
        backgroundColor: colors.primaryBlue,
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 10,
        width: '100%',
        minWidth: 140,
        alignItems: 'center',
        justifyContent: 'center',
    },
    returnButtonText: {
        ...typography.p4SemiBold,
        color: colors.white,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 10,
        width: '100%',
        minWidth: 140,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        ...typography.p4SemiBold,
        color: colors.primaryBlue,
        textAlign: 'center',
    },
});

export default SubmitTestConfirmationModal;

