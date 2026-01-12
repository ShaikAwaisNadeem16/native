import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing, borderRadius, sizes } from '../../../styles/theme';
import ProgressSteps from '../../../components/SignUp/ProgressSteps';
import TextInputField from '../../../components/SignUp/TextInputField';
import PhoneInputField from '../../../components/SignUp/PhoneInputField';
import PasswordField from '../../../components/SignUp/PasswordField';
import PrimaryButton from '../../../components/SignUp/PrimaryButton';
import SecondaryButton from '../../../components/SignUp/SecondaryButton';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import AuthService from '../../../api/auth';
import ProfileService from '../../../api/profile';

type PersonalDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PersonalDetails'>;
type PersonalDetailsRouteProp = RouteProp<RootStackParamList, 'PersonalDetails'>;

const PersonalDetailsScreen: React.FC = () => {
    const navigation = useNavigation<PersonalDetailsScreenNavigationProp>();
    const route = useRoute<PersonalDetailsRouteProp>();
    const routeParams = route.params;
    const email = routeParams?.email || '';
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [isValidatingPhone, setIsValidatingPhone] = useState(false);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Debounced phone number validation
    const debouncedCheckPhone = useCallback(
        (phoneValue: string) => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            debounceTimerRef.current = setTimeout(async () => {
                // Only validate if phone number is 10 digits
                if (phoneValue.length === 10 && /^\d{10}$/.test(phoneValue)) {
                    setIsValidatingPhone(true);
                    setPhoneError('');

                    try {
                        console.log('[PersonalDetailsScreen] Calling checkAccountExists API with phone:', phoneValue);
                        const response = await AuthService.checkAccountExists('phone', phoneValue);
                        console.log('[PersonalDetailsScreen] checkAccountExists API Response:', JSON.stringify(response, null, 2));
                        
                        // If account EXISTS, show error (phone number already taken)
                        // If account does NOT exist, it's available for signup (no error)
                        if (response.exists === true) {
                            const errorMessage = response.message || 'Phone number is already registered';
                            console.log('[PersonalDetailsScreen] Phone account exists, showing error:', errorMessage);
                            setPhoneError(errorMessage);
                        } else {
                            console.log('[PersonalDetailsScreen] Phone account does not exist, phone number is available for signup');
                            setPhoneError('');
                        }
                    } catch (error: any) {
                        console.error('[PersonalDetailsScreen] Phone validation error:', error);
                        console.error('[PersonalDetailsScreen] Error response:', error?.response?.data);
                        // Only show error if account EXISTS (phone already taken)
                        if (error?.response?.data?.exists === true) {
                            setPhoneError(error?.response?.data?.message || 'Phone number is already registered');
                        } else {
                            // For other errors or if account doesn't exist, don't show error (phone is available)
                            setPhoneError('');
                        }
                    } finally {
                        setIsValidatingPhone(false);
                    }
                } else if (phoneValue.length > 0 && phoneValue.length < 10) {
                    // Clear error if user is still typing
                    setPhoneError('');
                } else if (phoneValue.length === 0) {
                    // Clear error if field is empty
                    setPhoneError('');
                }
            }, 500); // 500ms debounce
        },
        []
    );

    const handlePhoneChange = (text: string) => {
        // Only allow digits
        const digitsOnly = text.replace(/\D/g, '');
        // Limit to 10 digits
        const limitedDigits = digitsOnly.slice(0, 10);
        setMobileNumber(limitedDigits);
        
        // Clear error when user starts typing
        if (phoneError) {
            setPhoneError('');
        }
        
        // Debounced validation
        debouncedCheckPhone(limitedDigits);
    };

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleVerify = async () => {
        // Validate required fields
        if (!firstName || !lastName) {
            Alert.alert('Error', 'Please enter your first name and last name');
            return;
        }

        // Validate phone number
        if (!mobileNumber || mobileNumber.length !== 10) {
            setPhoneError('Please enter a valid 10-digit phone number');
            return;
        }

        // Check if phone account exists (should exist for signup)
        if (phoneError) {
            // Don't proceed if there's a phone validation error
            Alert.alert('Error', 'Please fix the phone number error before proceeding');
            return;
        }

        // Validate password
        if (!password || password.length < 6) {
            Alert.alert('Error', 'Please enter a valid password (minimum 6 characters)');
            return;
        }

        setIsSubmitting(true);
        try {
            console.log('[PersonalDetailsScreen] ===== VERIFY EMAIL AND MOBILE NUMBER CLICKED =====');
            
            // Call GET /api/student/user-profile/data to get branches for specializations
            console.log('[PersonalDetailsScreen] Calling GET /api/student/user-profile/data to fetch branches...');
            let branches: Array<{ branchId: number; branch: string }> = [];
            try {
                const profileData = await ProfileService.fetchProfileData();
                console.log('[PersonalDetailsScreen] Profile data received:', JSON.stringify(profileData, null, 2));
                
                // Extract branches from response
                if (Array.isArray(profileData.branches)) {
                    branches = profileData.branches;
                    console.log('[PersonalDetailsScreen] Branches extracted:', branches.length);
                } else {
                    console.warn('[PersonalDetailsScreen] No branches found in response, using fallback list');
                }
            } catch (apiError: any) {
                console.error('[PersonalDetailsScreen] Failed to fetch branches:', apiError);
                console.warn('[PersonalDetailsScreen] Will use fallback specialization list');
                // Continue with empty branches array - will use fallback in CollegeCourseDetailsScreen
            }
            
            // Format phone number with country code
            const formattedPhone = `+91${mobileNumber}`;
            
            // Navigate to College Course Details with branches data
            navigation.navigate('CollegeCourseDetails', {
                email: email,
                firstName: firstName,
                lastName: lastName,
                mobileNumber: formattedPhone,
                password: password,
                branches: branches, // Pass branches for specializations dropdown
            });
        } catch (error: any) {
            console.error('[PersonalDetailsScreen] Error:', error);
            Alert.alert('Error', error?.message || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoBack = () => {
        // Navigate back to Verification OTP screen
        navigation.goBack();
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

                {/* Main Card - Frame 16143 from Figma */}
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        {/* Frame 16387 - Progress Steps and Title Section */}
                        <View style={styles.progressTitleSection}>
                            {/* Frame 16088 - Progress Steps */}
                            <ProgressSteps 
                                currentStep={2} 
                                totalSteps={4}
                                completedSteps={[1]}
                            />
                            
                            {/* Frame 16086 - Title */}
                            <View style={styles.titleSection}>
                                <Text style={styles.title}>Enter Personal Details</Text>
                            </View>
                        </View>

                        {/* Frame 16388 - Input Fields Section */}
                        <View style={styles.inputSection}>
                            <TextInputField
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="First Name"
                            />
                            <TextInputField
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Last Name"
                            />
                            <PhoneInputField
                                value={mobileNumber}
                                onChangeText={handlePhoneChange}
                                countryCode="+91"
                                error={phoneError}
                            />
                            <PasswordField
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Password"
                            />
                        </View>

                        {/* Frame 16391 - Button Section */}
                        <View style={styles.buttonSection}>
                            <PrimaryButton
                                label={isSubmitting ? "Submitting..." : "Continue"}
                                onPress={handleVerify}
                                disabled={isSubmitting || !firstName || !lastName || !mobileNumber || mobileNumber.length !== 10 || !password || password.length < 6 || !!phoneError}
                            />
                            <SecondaryButton
                                label="Go Back"
                                onPress={handleGoBack}
                            />
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
        alignItems: 'center',
    },
    title: {
        ...typography.h6,
        color: colors.primaryDarkBlue,
        textAlign: 'center',
    },
    inputSection: {
        width: '100%',
        gap: 24, // Exact gap from Figma Frame 16388 (24px between inputs: 72-48=24)
        marginTop: 40, // Exact gap from Figma (40px gap in card)
    },
    buttonSection: {
        width: '100%',
        gap: 16, // Exact gap from Figma (16px between buttons)
        marginTop: 16, // Exact gap from Figma (16px from inputSection)
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

export default PersonalDetailsScreen;

