import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { colors, typography, borderRadius, shadows } from '../../../styles/theme';
import ModalBackdrop from '../../../components/ModalBackdrop';
import PrimaryButton from '../../../components/SignUp/PrimaryButton';
import SecondaryButton from '../../../components/SignUp/SecondaryButton';
import ErrorNaughtyCat from '../../../components/common/ErrorNaughtyCat';

export interface SubmitSurveyConfirmationModalProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

/**
 * Submit Survey Confirmation Modal
 * 
 * Modal shown when user clicks "Submit" on the last question.
 * Displays Error Naughty Cat illustration and confirmation message.
 * Matches Figma design: node 10763-62358
 */
const SubmitSurveyConfirmationModal: React.FC<SubmitSurveyConfirmationModalProps> = ({
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
                    {/* Error Naughty Cat Illustration */}
                    <ErrorNaughtyCat 
                        width={175.102}
                        height={94}
                    />

                    {/* Title and Description */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Submit Survey?</Text>
                        <Text style={styles.description}>
                            Once submitted you won't be allowed to edit your submission
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.buttonsContainer}>
                        <View style={styles.buttonWrapper}>
                            <PrimaryButton
                                label={isSubmitting ? 'Submitting...' : 'Submit'}
                                onPress={onConfirm}
                                disabled={isSubmitting}
                            />
                        </View>
                        <View style={styles.buttonWrapper}>
                            <SecondaryButton
                                label="Back"
                                onPress={onCancel}
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
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 24,
        width: '100%',
        alignItems: 'center',
        gap: 32,
        ...shadows.activeElement, // Shadow from Figma: 0px 8px 40px 0px rgba(9,44,76,0.08)
    },
    textContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 4,
    },
    title: {
        fontFamily: 'Inter',
        fontSize: 18,
        fontWeight: '700' as const,
        lineHeight: 25,
        color: colors.primaryDarkBlue,
        textAlign: 'center',
        width: '100%',
    },
    description: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
        color: colors.textGrey,
        textAlign: 'center',
        width: '100%',
    },
    buttonsContainer: {
        width: '100%',
        flexDirection: 'column',
        gap: 16,
        alignItems: 'center',
    },
    buttonWrapper: {
        width: '100%',
        minWidth: 140,
    },
});

export default SubmitSurveyConfirmationModal;

