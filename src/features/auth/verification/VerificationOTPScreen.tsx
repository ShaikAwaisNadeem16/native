import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing, borderRadius, sizes } from '../../../styles/theme';
import TextInputField from '../../../components/SignUp/TextInputField';
import PrimaryButton from '../../../components/SignUp/PrimaryButton';
import SecondaryButton from '../../../components/SignUp/SecondaryButton';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import AuthService from '../../../api/auth';
import ProfileService from '../../../api/profile';

type VerificationOTPScreenNavigationProp = StackNavigationProp<RootStackParamList, 'VerificationOTP'>;

const VerificationOTPScreen: React.FC = () => {
    const navigation = useNavigation<VerificationOTPScreenNavigationProp>();
    const route = useRoute();
    const [mobileOTP, setMobileOTP] = useState('');
    const [timerSeconds, setTimerSeconds] = useState(120); // 2 minutes countdown
    const [isResendingOtp, setIsResendingOtp] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    
    // Get user data from route params if available
    // @ts-ignore - route params may not be typed
    const phoneNumber = route.params?.phoneNumber || '';
    const email = route.params?.email || '';
    const firstName = route.params?.firstName || '';
    const lastName = route.params?.lastName || '';
    const password = route.params?.password || '';

    // Format timer for display - Figma shows "0s" format
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
        if (timerSeconds <= 0) return;

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
    }, [timerSeconds]);

    const handleVerify = async () => {
        if (!mobileOTP || mobileOTP.length < 4) {
            Alert.alert('Error', 'Please enter a valid OTP');
            return;
        }

        if (!phoneNumber) {
            Alert.alert('Error', 'Phone number not found. Please go back and try again.');
            return;
        }

        setIsVerifying(true);
        try {
            // Call API to verify SMS OTP
            const response = await AuthService.verifySmsOtp(phoneNumber, mobileOTP);
            
            // If verification is successful, proceed to next step
            console.log('[VerificationOTPScreen] ===== OTP VERIFIED SUCCESSFULLY =====');
            console.log('[VerificationOTPScreen] User data:', { email, firstName, lastName, phoneNumber });
            
            // Step 2: Call GET /api/student/user-profile/data
            try {
                console.log('[VerificationOTPScreen] Calling ProfileService.fetchProfileData (GET /api/student/user-profile/data)');
                const profileData = await ProfileService.fetchProfileData();
                console.log('[VerificationOTPScreen] Profile data response:', JSON.stringify(profileData, null, 2));
                
                // Step 3: Navigate to College Course Details screen with all user data
                console.log('[VerificationOTPScreen] Navigating to CollegeCourseDetails screen with user data');
                navigation.navigate('CollegeCourseDetails', {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    mobileNumber: phoneNumber.replace('+91', ''), // Remove country code for mobileNumber
                    password: password,
                });
            } catch (error: any) {
                console.error('[VerificationOTPScreen] Failed to fetch profile data:', error);
                console.error('[VerificationOTPScreen] Error response:', error?.response?.data);
                Alert.alert('Error', error?.response?.data?.message || error?.message || 'Failed to fetch profile data. Please try again.');
            }
        } catch (error: any) {
            console.error('Failed to verify OTP:', error);
            // Show error message from API
            Alert.alert('Error', error?.message || 'Failed to verify OTP. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleGoBack = () => {
        // Navigate back to Register screen
        navigation.goBack();
    };

    const handleResend = async () => {
        if (isResendingOtp) return; // Prevent multiple calls
        
        if (!phoneNumber) {
            Alert.alert('Error', 'Phone number not found. Please go back and try again.');
            return;
        }
        
        setIsResendingOtp(true);
        try {
            // Call API to resend SMS OTP
            const response = await AuthService.sendSmsOtp(phoneNumber);
            
            if (response.otpSent) {
                // Reset timer and clear OTP field
                setTimerSeconds(120);
                setMobileOTP('');
                Alert.alert('Success', response.message || 'OTP sent successfully');
            } else {
                Alert.alert('Error', response.message || 'Failed to resend OTP. Please try again.');
            }
        } catch (error: any) {
            console.error('Failed to resend OTP:', error);
            Alert.alert('Error', error?.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setIsResendingOtp(false);
        }
    };

    const handleTermsPress = () => {
        // Handle terms link
        console.log('Open terms');
    };

    const handlePrivacyPress = () => {
        // Handle privacy link
        console.log('Open privacy');
    };

    const handleProblemsPress = () => {
        // Handle problems link
        console.log('Open problems');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.modalContainer}>
                <Pressable 
                    style={styles.backdrop}
                    onPress={handleGoBack}
                />
                <View style={styles.modalCard}>
                    {/* Title and Subtitle Section */}
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>Mobile Number Verification</Text>
                        <Text style={styles.subtitle}>
                            An SMS with the One Time Password (OTP) have been sent to your mobile number
                        </Text>
                    </View>

                    {/* Content Section */}
                    <View style={styles.contentSection}>
                        {/* OTP Input and Timer Section */}
                        <View style={styles.inputSection}>
                            <TextInputField
                                value={mobileOTP}
                                onChangeText={setMobileOTP}
                                placeholder="Enter Mobile Number OTP"
                            />
                            
                            {/* Timer and Resend */}
                            <View style={styles.timerResendContainer}>
                                <Text style={styles.timerText}>Time Remaining: {timeRemaining}</Text>
                                <View style={styles.divider} />
                                <TouchableOpacity 
                                    onPress={handleResend}
                                    disabled={isResendingOtp}
                                >
                                    <Text style={[
                                        styles.resendLink,
                                        isResendingOtp && styles.resendLinkDisabled
                                    ]}>
                                        {isResendingOtp ? 'Sending...' : 'Resend OTPs'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Button Section */}
                        <View style={styles.buttonSection}>
                            <TouchableOpacity
                                style={[
                                    styles.verifyButton,
                                    (!mobileOTP || mobileOTP.length < 4) && styles.verifyButtonDisabled
                                ]}
                                onPress={handleVerify}
                                disabled={!mobileOTP || mobileOTP.length < 4 || isVerifying}
                            >
                                <Text style={[
                                    styles.verifyButtonText,
                                    (!mobileOTP || mobileOTP.length < 4) && styles.verifyButtonTextDisabled
                                ]}>
                                    {isVerifying ? 'Verifying...' : 'Verify OTP'}
                                </Text>
                            </TouchableOpacity>
                            
                            <SecondaryButton
                                label="Go Back"
                                onPress={handleGoBack}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainBgGrey,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalCard: {
        backgroundColor: colors.white,
        borderRadius: 12, // Figma: rounded-tl-[12px] rounded-tr-[12px]
        paddingHorizontal: 16, // Figma: px-[16px]
        paddingVertical: 32, // Figma: py-[32px]
        width: '100%',
        maxWidth: sizes.cardWidth,
        shadowColor: '#092C4C', // Figma: shadow-[0px_8px_40px_0px_rgba(9,44,76,0.08)]
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 40,
        elevation: 8,
        gap: 32, // Figma: gap-[32px]
    },
    titleSection: {
        gap: 4, // Figma: gap-[4px]
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontFamily: 'Inter',
        fontSize: 18, // Figma: Desktop/P2 Bold, 18px
        fontWeight: '700',
        lineHeight: 25,
        color: colors.primaryDarkBlue, // Figma: text-[color:var(--primary-dark-blue,#00213d)]
        width: '100%',
        textAlign: 'left',
    },
    subtitle: {
        fontFamily: 'Inter',
        fontSize: 12, // Figma: Desktop/S1 Regular, 12px
        fontWeight: '400',
        lineHeight: 16,
        color: colors.textGrey, // Figma: text-[color:var(--text-grey,#696a6f)]
        width: '100%',
        textAlign: 'left',
    },
    contentSection: {
        width: '100%',
        gap: 32, // Figma: gap-[32px]
        alignItems: 'center',
    },
    inputSection: {
        width: '100%',
        gap: 8, // Figma: gap-[8px]
        alignItems: 'center',
    },
    timerResendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        gap: 8, // Figma: gap-[8px]
    },
    timerText: {
        fontFamily: 'Inter',
        fontSize: 12, // Figma: Desktop/S1 Regular, 12px
        fontWeight: '400',
        lineHeight: 15,
        color: '#80919f', // Figma: text-[#80919f]
    },
    divider: {
        width: 1,
        height: 15,
        backgroundColor: colors.lightGrey, // Figma: rgba(226, 235, 243, 1)
    },
    resendLink: {
        fontFamily: 'Inter',
        fontSize: 12, // Figma: Desktop/S1 Regular, 12px
        fontWeight: '400',
        lineHeight: 15,
        color: colors.primaryBlue, // Figma: text-[color:var(--primary-blue,#0b6aea)]
        textDecorationLine: 'underline',
    },
    resendLinkDisabled: {
        color: colors.placeholderGrey,
        opacity: 0.5,
    },
    buttonSection: {
        width: '100%',
        gap: 16, // Figma: gap-[16px]
        alignItems: 'center',
    },
    verifyButton: {
        backgroundColor: colors.primaryBlue,
        borderRadius: 8, // Figma: rounded-[8px]
        paddingHorizontal: 24, // Figma: px-[24px]
        paddingVertical: 10, // Figma: py-[10px]
        minWidth: 140, // Figma: min-w-[140px]
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    verifyButtonDisabled: {
        backgroundColor: '#ededed', // Figma: bg-[#ededed]
    },
    verifyButtonText: {
        fontFamily: 'Inter',
        fontSize: 14, // Figma: Desktop/P4 SemiBold, 14px
        fontWeight: '600',
        lineHeight: 20,
        color: colors.white, // Figma: text-[color:var(--white,white)]
    },
    verifyButtonTextDisabled: {
        color: '#808080', // Figma: text-[#808080]
    },
});

export default VerificationOTPScreen;

