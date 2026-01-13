import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';
import PrimaryButton from '../../../components/SignUp/PrimaryButton';
import SecondaryButton from '../../../components/SignUp/SecondaryButton';
import TimerResend from '../../../components/SignUp/TimerResend';
import CrossIcon from '../../../components/common/CrossIcon';

interface VerifyPhoneNumberModalProps {
    visible: boolean;
    phoneNumber: string;
    onClose: () => void;
    onVerifySuccess: () => void;
}

/**
 * VerifyPhoneNumberModal Component
 * Modal that appears when user clicks "Verify" button for phone number in profile
 * 
 * Displays OTP input field and handles verification flow
 */
const VerifyPhoneNumberModal: React.FC<VerifyPhoneNumberModalProps> = ({
    visible,
    phoneNumber,
    onClose,
    onVerifySuccess,
}) => {
    const [otp, setOtp] = useState('');
    const [timerSeconds, setTimerSeconds] = useState(120); // 2 minutes countdown

    // Format timer for display
    const formatTime = useCallback((seconds: number): string => {
        if (seconds <= 0) return '0s';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins > 0) {
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
        return `${secs}s`;
    }, []);

    const timeRemaining = formatTime(timerSeconds);

    // Timer countdown effect
    useEffect(() => {
        if (!visible || timerSeconds <= 0) return;

        const interval = setInterval(() => {
            setTimerSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [visible, timerSeconds]);

    // Reset OTP and timer when modal opens
    useEffect(() => {
        if (visible) {
            setOtp('');
            setTimerSeconds(120);
        }
    }, [visible]);

    const handleVerify = () => {
        if (!otp || otp.length < 4) {
            Alert.alert('Error', 'Please enter a valid OTP');
            return;
        }

        // TODO: Call API to verify OTP
        // await verifyPhoneOTP(phoneNumber, otp);
        console.log('Verifying OTP:', otp);

        // Simulate verification
        Alert.alert('Success', 'Phone number verified successfully');
        onVerifySuccess();
        onClose();
    };

    const handleResend = () => {
        // Reset timer and resend OTP
        setTimerSeconds(120);
        setOtp('');
        // TODO: Call API to resend OTP
        console.log('Resending OTP to:', phoneNumber);
        Alert.alert('OTP Sent', 'A new OTP has been sent to your phone number');
    };

    const handleClose = () => {
        setOtp('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
        >
            {/* Background Overlay - Figma: bg-[#191a1b] opacity-60 */}
            <View style={styles.overlay}>
                {/* Modal Content */}
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Close Button */}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleClose}
                            activeOpacity={0.7}
                        >
                            <CrossIcon size={24} />
                        </TouchableOpacity>

                        {/* Title */}
                        <Text style={styles.title}>Verify Phone Number</Text>

                        {/* Subtitle */}
                        <Text style={styles.subtitle}>
                            An SMS with the One Time Password (OTP) has been sent to {phoneNumber}
                        </Text>

                        {/* OTP Input Field */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.otpInput}
                                value={otp}
                                onChangeText={setOtp}
                                placeholder="Enter OTP"
                                placeholderTextColor={colors.placeholderGrey}
                                keyboardType="number-pad"
                                maxLength={6}
                                autoFocus={true}
                            />
                        </View>

                        {/* Timer and Resend */}
                        <TimerResend
                            timeRemaining={timeRemaining}
                            onResend={handleResend}
                        />

                        {/* Buttons */}
                        <View style={styles.buttonContainer}>
                            <PrimaryButton
                                label="Verify"
                                onPress={handleVerify}
                            />
                            <SecondaryButton
                                label="Cancel"
                                onPress={handleClose}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(25, 26, 27, 0.6)', // Figma: bg-[#191a1b] opacity-60
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
    },
    modalContent: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.card,
        padding: 24,
        gap: 24,
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    title: {
        ...typography.p1Bold,
        color: colors.primaryDarkBlue,
        textAlign: 'center',
        marginTop: 8,
    },
    subtitle: {
        ...typography.s1Regular,
        color: colors.placeholderGrey,
        textAlign: 'center',
        lineHeight: 16,
    },
    inputContainer: {
        width: '100%',
    },
    otpInput: {
        ...typography.p4,
        color: colors.textGrey,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.input,
        paddingHorizontal: 20,
        paddingVertical: 12,
        minHeight: 48,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
});

export default VerifyPhoneNumberModal;






