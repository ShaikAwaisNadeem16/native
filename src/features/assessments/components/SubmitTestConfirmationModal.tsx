import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';
import ModalBackdrop from '../../../components/ModalBackdrop';
import PrimaryButton from '../../../components/SignUp/PrimaryButton';
import SecondaryButton from '../../../components/SignUp/SecondaryButton';
import { AlertCircle } from 'lucide-react-native';

/**
 * SubmitTestConfirmationModal Component
 *
 * A reusable confirmation modal shown when user clicks "Submit Test"
 * and there are unanswered or review-marked questions.
 * Matches Figma design: node 7875-74422
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
                    {/* Title */}
                    <Text style={styles.title}>Submit All Answers?</Text>

                    {/* Description */}
                    <Text style={styles.description}>
                        You have unanswered questions or questions marked for review. Are you sure you want to submit the test?
                    </Text>

                    {/* Warning Section */}
                    <View style={styles.warningSection}>
                        {unansweredCount > 0 && (
                            <View style={styles.warningItem}>
                                <Text style={styles.warningLabel}>Unanswered Questions:</Text>
                                <Text style={styles.warningValue}>{unansweredCount}</Text>
                            </View>
                        )}
                        {reviewMarkedCount > 0 && (
                            <View style={styles.warningItem}>
                                <Text style={styles.warningLabel}>Questions Marked For Review:</Text>
                                <Text style={styles.warningValue}>{reviewMarkedCount}</Text>
                            </View>
                        )}
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.buttonsContainer}>
                        <View style={styles.buttonWrapper}>
                            <SecondaryButton
                                label="Return To Attempt"
                                onPress={onCancel}
                                disabled={isSubmitting}
                            />
                        </View>
                        <View style={styles.buttonWrapper}>
                            <PrimaryButton
                                label={isSubmitting ? 'Submitting...' : 'Submit Test'}
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
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 24,
        width: '100%',
        alignItems: 'center',
        gap: 24,
    },
    title: {
        ...typography.h6, // 20px Bold
        color: colors.primaryDarkBlue,
        textAlign: 'center',
    },
    description: {
        ...typography.p4, // 14px Regular
        color: colors.textGrey,
        textAlign: 'center',
        paddingHorizontal: 16,
        lineHeight: 20,
    },
    warningSection: {
        backgroundColor: 'rgba(235, 87, 87, 0.1)', // Light red background
        borderWidth: 1,
        borderColor: colors.error || '#EB5757',
        borderRadius: borderRadius.input, // 8px
        padding: 16,
        width: '100%',
        gap: 12,
    },
    warningItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    warningLabel: {
        ...typography.p4, // 14px Regular
        color: colors.textGrey,
        flex: 1,
    },
    warningValue: {
        ...typography.p4SemiBold, // 14px SemiBold
        color: colors.error || '#EB5757',
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    buttonWrapper: {
        flex: 1, // Equal width for both buttons
    },
});

export default SubmitTestConfirmationModal;

