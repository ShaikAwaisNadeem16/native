import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing, borderRadius, sizes } from '../../../styles/theme';
import ProgressSteps from '../../../components/SignUp/ProgressSteps';
import EmailInputField from '../../../components/SignUp/EmailInputField';
import CollegeInfoCard from '../../../components/SignUp/CollegeInfoCard';
import PrimaryButton from '../../../components/SignUp/PrimaryButton';
import AuthService from '../../../api/auth';
import { RootStackParamList } from '../../../navigation/AppNavigator';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface CollegeData {
    collegeName: string;
    state: string;
    district: string;
    pinCode: string;
    collegeId?: string;
}

const SignUpScreen: React.FC = () => {
    const navigation = useNavigation<SignUpScreenNavigationProp>();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [collegeData, setCollegeData] = useState<CollegeData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Debounced email authorization check
    const debouncedAuthorizeEmail = useCallback(
        (emailValue: string) => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            debounceTimerRef.current = setTimeout(async () => {
                if (emailValue.length > 5 && emailValue.includes('@')) {
                    setIsLoading(true);
                    setEmailError('');
                    setIsAuthorized(false);
                    setCollegeData(null);

                    try {
                        const response = await AuthService.authorizeEmail(emailValue);
                        if (response.authorized === false) {
                            setIsAuthorized(false);
                            setCollegeData(null);
                            setEmailError(response.message || 'Email not authorized');
                        } else {
                            setIsAuthorized(true);
                            const college = response.authorizedEmail?.college || {};
                            setCollegeData({
                                collegeName: college.collegeName || '',
                                state: college.state || '',
                                district: college.district || '',
                                pinCode: college.pinCode || '',
                                collegeId: response.authorizedEmail?.collegeId,
                            });
                            setEmailError('');
                        }
                    } catch (error: any) {
                        console.error('Authorization error:', error);
                        setIsAuthorized(false);
                        setCollegeData(null);
                        setEmailError(error?.message || 'Failed to verify email');
                    } finally {
                        setIsLoading(false);
                    }
                }
            }, 1500);
        },
        []
    );

    const handleEmailChange = (text: string) => {
        setEmail(text);
        if (emailError) {
            setEmailError('');
        }
        if (isAuthorized) {
            setIsAuthorized(false);
            setCollegeData(null);
        }
        debouncedAuthorizeEmail(text);
    };

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const handleLoginPress = () => {
        // Navigate to login screen
        navigation.navigate('Login');
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

    const handleCollegeConfirm = () => {
        // Handle college confirmation - only allow if authorized
        if (!isAuthorized || !collegeData) {
            setEmailError('Please enter a valid authorized email');
            return;
        }
        // Navigate to Verification OTP screen
        navigation.navigate('VerificationOTP');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* CC Logo at top - positioned exactly as in Figma */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoText}>CC Logo</Text>
                    </View>
                </View>

                {/* Main Card - Frame 16143 from Figma */}
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        {/* Frame 16387 from Figma - Progress Steps and Title Section */}
                        <View style={styles.progressTitleSection}>
                            {/* Frame 16088 - Progress Steps */}
                            <ProgressSteps currentStep={1} totalSteps={4} />
                            
                            {/* Frame 16086 - Title and Toggle */}
                            <View style={styles.titleSection}>
                                {/* Title and Toggle frame */}
                                <Text style={styles.title}>Create your Student Account</Text>
                                {/* Frame 16085 - Subtitle with login link */}
                                <View style={styles.subtitleContainer}>
                                    <Text style={styles.subtitleText}>Already have an account? </Text>
                                    <TouchableOpacity onPress={handleLoginPress}>
                                        <Text style={styles.subtitleLink}>Log in</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                            {/* Frame 16388 - Sign Up Options and College Info */}
                            <View style={styles.contentSection}>
                                {/* Sign Up Options - Input Fields Section */}
                                <View style={styles.inputSection}>
                                    {/* Input Fields frame */}
                                    <EmailInputField
                                        value={email}
                                        onChangeText={handleEmailChange}
                                        error={emailError}
                                        showCheckmark={isAuthorized && !isLoading}
                                    />
                                </View>

                                {/* Frame 16385 - College Info Card - Only show if authorized */}
                                {isAuthorized && collegeData && (
                                    <CollegeInfoCard
                                        collegeName={collegeData.collegeName}
                                        state={collegeData.state}
                                        district={collegeData.district}
                                        pinCode={collegeData.pinCode}
                                    />
                                )}
                            </View>

                        {/* Frame 16390 - Button Section */}
                        <View style={styles.buttonSection}>
                            <PrimaryButton
                                label="This Is My College"
                                onPress={handleCollegeConfirm}
                            />
                        </View>
                    </View>

                    {/* Frame 16142 - Footer Text */}
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
        paddingTop: 50, // Adjusted for mobile (144px from Figma desktop, scaled for mobile)
        paddingBottom: 32,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 0, // Will be handled by card marginTop
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
        paddingHorizontal: 16, // Mobile padding for outer container
    },
    card: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.card,
        paddingHorizontal: spacing.cardPaddingH,
        paddingVertical: spacing.cardPaddingV,
        marginBottom: 12, // Gap from card to footer (12px from Figma)
    },
    progressTitleSection: {
        gap: spacing.titleProgressGap,
        alignItems: 'center',
        width: '100%',
        marginBottom: 0, // Gap handled by contentSection
    },
    contentSection: {
        gap: 24, // Exact gap from Figma (24px between input and college card)
        width: '100%',
        marginTop: 40, // Exact gap from Figma Frame 16388 (40px gap in card)
    },
    titleSection: {
        gap: spacing.titleSubtitleGap,
        alignItems: 'center',
    },
    title: {
        ...typography.h6,
        color: colors.primaryDarkBlue,
        textAlign: 'center',
    },
    subtitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8, // Gap between text and link
    },
    subtitleText: {
        ...typography.p4,
        color: colors.textGrey,
    },
    subtitleLink: {
        ...typography.p4,
        color: colors.primaryBlue,
    },
    inputSection: {
        width: '100%',
    },
    buttonSection: {
        width: '100%',
        gap: 16, // Gap from Figma Frame 16390
        marginTop: 16, // Exact gap from Figma (16px gap in Frame 16390)
    },
    footerContainer: {
        width: '100%',
        paddingHorizontal: spacing.footerPaddingH,
        gap: 8, // Gap between terms text and problems link
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

export default SignUpScreen;

