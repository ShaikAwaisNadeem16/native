import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { colors, typography, borderRadius, shadows } from '../../styles/theme';
import ModalBackdrop from '../ModalBackdrop';
import PrimaryButton from '../SignUp/PrimaryButton';
import SecondaryButton from '../SignUp/SecondaryButton';

export type ConfirmationModalVariant = 'default' | 'warning' | 'success';

export interface ConfirmationModalProps {
    visible: boolean;
    title: string;
    description: string;
    variant?: ConfirmationModalVariant;
    // Illustration/Icon
    illustration?: React.ReactNode;
    // Warning section (for warning variant)
    warningItems?: Array<{ label: string; value: string | number }>;
    // Buttons
    primaryButtonLabel?: string;
    secondaryButtonLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isSubmitting?: boolean;
    // Layout
    buttonLayout?: 'column' | 'row'; // 'column' for stacked, 'row' for side-by-side
    // Custom styling
    contentBorderRadius?: number;
    contentPaddingHorizontal?: number;
    contentPaddingTop?: number;
    contentPaddingBottom?: number;
    contentGap?: number;
}

/**
 * ConfirmationModal - Unified confirmation modal component
 * Replaces: SubmitSurveyConfirmationModal, SubmitTestConfirmationModal, 
 * SubmitAssignmentConfirmationModal
 */
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    visible,
    title,
    description,
    variant = 'default',
    illustration,
    warningItems,
    primaryButtonLabel = 'Confirm',
    secondaryButtonLabel = 'Cancel',
    onConfirm,
    onCancel,
    isSubmitting = false,
    buttonLayout = 'column',
    contentBorderRadius = 16,
    contentPaddingHorizontal = 24,
    contentPaddingTop = 32,
    contentPaddingBottom = 24,
    contentGap = 24,
}) => {
    const isWarning = variant === 'warning';
    const isSuccess = variant === 'success';

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onCancel}
        >
            <View style={styles.modalContainer}>
                <ModalBackdrop onPress={onCancel} />
                <View style={[
                        styles.modalContent,
                        {
                            borderTopLeftRadius: contentBorderRadius,
                            borderTopRightRadius: contentBorderRadius,
                            paddingHorizontal: contentPaddingHorizontal,
                            paddingTop: contentPaddingTop,
                            paddingBottom: contentPaddingBottom,
                            gap: contentGap,
                        }
                    ]}>
                    {/* Illustration */}
                    {illustration && (
                        <View style={styles.illustrationContainer}>
                            {illustration}
                        </View>
                    )}

                    {/* Title */}
                    <Text style={styles.title}>{title}</Text>

                    {/* Description */}
                    <Text style={styles.description}>{description}</Text>

                    {/* Warning Section (for warning variant) */}
                    {isWarning && warningItems && warningItems.length > 0 && (
                        <View style={styles.warningSection}>
                            {warningItems.map((item, index) => (
                                <View key={index} style={styles.warningItem}>
                                    <Text style={styles.warningLabel}>{item.label}</Text>
                                    <Text style={styles.warningValue}>{item.value}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View style={[
                        styles.buttonsContainer,
                        buttonLayout === 'row' && styles.buttonsContainerRow
                    ]}>
                        <View style={styles.buttonWrapper}>
                            {buttonLayout === 'row' ? (
                                <SecondaryButton
                                    label={secondaryButtonLabel}
                                    onPress={onCancel}
                                    disabled={isSubmitting}
                                />
                            ) : (
                                <SecondaryButton
                                    label={secondaryButtonLabel}
                                    onPress={onCancel}
                                    disabled={isSubmitting}
                                />
                            )}
                        </View>
                        <View style={styles.buttonWrapper}>
                            <PrimaryButton
                                label={isSubmitting ? 'Submitting...' : primaryButtonLabel}
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
        ...shadows.activeElement,
    },
    illustrationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    title: {
        ...typography.h6,
        color: colors.primaryDarkBlue,
        textAlign: 'center',
        width: '100%',
    },
    description: {
        ...typography.p4,
        color: colors.textGrey,
        textAlign: 'center',
        paddingHorizontal: 16,
        lineHeight: 20,
    },
    warningSection: {
        backgroundColor: 'rgba(235, 87, 87, 0.1)',
        borderWidth: 1,
        borderColor: colors.error || '#EB5757',
        borderRadius: borderRadius.input,
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
        ...typography.p4,
        color: colors.textGrey,
        flex: 1,
    },
    warningValue: {
        ...typography.p4SemiBold,
        color: colors.error || '#EB5757',
    },
    buttonsContainer: {
        width: '100%',
        flexDirection: 'column',
        gap: 16,
        alignItems: 'center',
    },
    buttonsContainerRow: {
        flexDirection: 'row',
        gap: 12,
    },
    buttonWrapper: {
        width: '100%',
        minWidth: 140,
    },
});

export default ConfirmationModal;

