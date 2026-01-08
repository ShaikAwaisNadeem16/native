import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';
import ModalBackdrop from '../../../components/ModalBackdrop';
import PrimaryButton from '../../../components/SignUp/PrimaryButton';
import { AlertCircle } from 'lucide-react-native';

/**
 * DeadlineExceededModal Component
 *
 * A reusable modal shown when assignment deadline has been exceeded.
 * Matches Figma design: node 7875-70875
 *
 * Usage:
 * ```tsx
 * <DeadlineExceededModal
 *   visible={showDeadlineExceeded}
 *   onOkay={handleOkay}
 * />
 * ```
 */
export interface DeadlineExceededModalProps {
    visible: boolean;
    onOkay: () => void;
}

const DeadlineExceededModal: React.FC<DeadlineExceededModalProps> = ({
    visible,
    onOkay,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onOkay}
        >
            <View style={styles.modalContainer}>
                <ModalBackdrop onPress={onOkay} />
                <View style={styles.modalContent}>
                    {/* Illustration */}
                    <View style={styles.illustrationContainer}>
                        <View style={styles.illustrationBackground}>
                            <AlertCircle size={48} color={colors.error || '#EB5757'} />
                        </View>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Deadline Exceeded</Text>

                    {/* Description */}
                    <Text style={styles.description}>
                        The deadline for this assignment has passed. You can no longer submit or edit this assignment.
                    </Text>

                    {/* Action Button */}
                    <View style={styles.buttonContainer}>
                        <PrimaryButton
                            label="Okay"
                            onPress={onOkay}
                        />
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
        backgroundColor: colors.lightGrey || '#E2EBF3', // Light background from Figma
        borderRadius: 16,
        borderWidth: 2,
        borderColor: colors.error || '#EB5757', // Error border from Figma
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
    buttonContainer: {
        width: '100%',
    },
});

export default DeadlineExceededModal;

