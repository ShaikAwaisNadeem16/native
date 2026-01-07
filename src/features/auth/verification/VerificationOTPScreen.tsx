import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing, borderRadius, sizes } from '../../../styles/theme';
import ProgressSteps from '../../../components/SignUp/ProgressSteps';
import TextInputField from '../../../components/SignUp/TextInputField';
import PrimaryButton from '../../../components/SignUp/PrimaryButton';
import SecondaryButton from '../../../components/SignUp/SecondaryButton';
import TimerResend from '../../../components/SignUp/TimerResend';
import { RootStackParamList } from '../../../navigation/AppNavigator';

type VerificationOTPScreenNavigationProp = StackNavigationProp<RootStackParamList, 'VerificationOTP'>;

const VerificationOTPScreen: React.FC = () => {
    const navigation = useNavigation<VerificationOTPScreenNavigationProp>();
    const [mobileOTP, setMobileOTP] = useState('');
    const [emailOTP, setEmailOTP] = useState('');
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

    const handleVerify = () => {
        // Navigate to Personal Details screen after OTP verification
        navigation.navigate('PersonalDetails');
    };

    const handleGoBack = () => {
        // Navigate back to Register screen
        navigation.goBack();
    };

    const handleResend = () => {
        // Reset timer and resend OTP
        setTimerSeconds(120);
        console.log('Resend OTPs');
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
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* CC Logo at top */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoText}>CC Logo</Text>
                    </View>
                </View>

                {/* Main Card - Frame 16146 from Figma */}
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        {/* Frame 16387 - Progress Steps and Title Section */}
                        <View style={styles.progressTitleSection}>
                            {/* Frame 3 - Progress Steps */}
                            <ProgressSteps 
                                currentStep={3} 
                                totalSteps={4}
                                completedSteps={[1, 2]}
                            />
                            
                            {/* Frame 16055 - Title and Subtitle */}
                            <View style={styles.titleSection}>
                                <Text style={styles.title}>Verification</Text>
                                <Text style={styles.subtitle}>
                                    An SMS and email with the One Time Password (OTP) have been sent to your mobile number and email ID respectively
                                </Text>
                            </View>
                        </View>

                        {/* Frame 16063 - Input Fields and Buttons */}
                        <View style={styles.contentSection}>
                            {/* Frame 16140 - Input Fields and Timer */}
                            <View style={styles.inputSection}>
                                {/* Frame 16066 - Input Fields */}
                                <View style={styles.inputFieldsContainer}>
                                    <TextInputField
                                        value={mobileOTP}
                                        onChangeText={setMobileOTP}
                                        placeholder="Enter Mobile Number OTP"
                                    />
                                    <TextInputField
                                        value={emailOTP}
                                        onChangeText={setEmailOTP}
                                        placeholder="Enter Email ID OTP"
                                    />
                                </View>

                                {/* Frame 16062 - Timer and Resend */}
                                <TimerResend
                                    timeRemaining={timeRemaining}
                                    onResend={handleResend}
                                />
                            </View>

                            {/* Frame 16141 - Button Section */}
                            <View style={styles.buttonSection}>
                                <PrimaryButton
                                    label="Verify"
                                    onPress={handleVerify}
                                />
                                <SecondaryButton
                                    label="Go Back"
                                    onPress={handleGoBack}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Frame 16143 - Footer Text */}
                    <View style={styles.footerContainer}>
                        <Text style={styles.termsText}>
                            By creating an account or logging in, you agree to CreamCollar's{' '}
                            <Text style={styles.termsLink} onPress={handleTermsPress}>
                                Conditions of Use
                            </Text>
                            {' '}and{' '}
                            <Text style={styles.termsLink} onPress={handlePrivacyPress}>
                                Privacy Policy
                            </Text>
                            .
                        </Text>
                        <TouchableOpacity onPress={handleProblemsPress}>
                            <Text style={styles.problemsLink}>Having any problems?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainBgGrey,
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 32,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 0,
    },
    logoPlaceholder: {
        width: sizes.logoWidth,
        height: sizes.logoHeight,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 4,
    },
    logoText: {
        ...typography.s1Regular,
        color: colors.primaryDarkBlue,
    },
    cardContainer: {
        width: '100%',
        maxWidth: sizes.cardWidth,
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.card,
        paddingHorizontal: spacing.cardPaddingH,
        paddingVertical: spacing.cardPaddingV,
        marginBottom: 12,
    },
    progressTitleSection: {
        gap: spacing.titleProgressGap,
        alignItems: 'center',
        width: '100%',
        marginBottom: 0,
    },
    titleSection: {
        gap: spacing.titleSubtitleGap,
        alignItems: 'center',
        width: '100%',
    },
    title: {
        ...typography.p1Bold,
        color: colors.primaryDarkBlue,
        textAlign: 'center',
        width: '100%',
    },
    subtitle: {
        ...typography.s1Regular,
        color: colors.placeholderGrey,
        textAlign: 'center',
        width: '100%',
        lineHeight: 16,
    },
    contentSection: {
        width: '100%',
        gap: 40, // Exact gap from Figma Frame 16063 (40px between input section and button section)
        marginTop: 32, // Exact gap from Figma (32px from progressTitleSection: 176-144=32)
    },
    inputSection: {
        width: '100%',
        gap: 8, // Exact gap from Figma Frame 16140 (8px between input fields and timer)
    },
    inputFieldsContainer: {
        width: '100%',
        gap: 24, // Exact gap from Figma Frame 16066 (24px between inputs: 72-48=24)
    },
    buttonSection: {
        width: '100%',
        gap: 16, // Exact gap from Figma Frame 16141 (16px between buttons: 56-40=16)
    },
    footerContainer: {
        width: '100%',
        paddingHorizontal: spacing.footerPaddingH,
        gap: 8,
        alignItems: 'center',
    },
    termsText: {
        ...typography.terms,
        color: colors.placeholderGrey,
        textAlign: 'center',
        width: '100%',
    },
    termsLink: {
        ...typography.terms,
        color: colors.primaryBlue,
    },
    problemsLink: {
        ...typography.s1Regular,
        color: colors.primaryBlue,
        textAlign: 'center',
        width: '100%',
    },
});

export default VerificationOTPScreen;

