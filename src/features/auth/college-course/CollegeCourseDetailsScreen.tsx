import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing, borderRadius, sizes } from '../../../styles/theme';
import ProgressSteps from '../../../components/SignUp/ProgressSteps';
import DropdownField from '../../../components/SignUp/DropdownField';
import DateField from '../../../components/SignUp/DateField';
import PrimaryButton from '../../../components/SignUp/PrimaryButton';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import AuthService from '../../../api/auth';
import CreamCollarLogo from '../../../components/common/CreamCollarLogo';

type CollegeCourseDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CollegeCourseDetails'>;

const CollegeCourseDetailsScreen: React.FC = () => {
    const navigation = useNavigation<CollegeCourseDetailsScreenNavigationProp>();
    const route = useRoute();
    const routeParams = route.params as {
        email?: string;
        firstName?: string;
        lastName?: string;
        mobileNumber?: string;
        password?: string;
        branches?: Array<{ branchId: number; branch: string }>;
    } | undefined;
    
    const [course, setCourse] = useState('');
    const [specialisation, setSpecialisation] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);

    // Course options
    const courseOptions = ['B.E', 'B.Tech'];
    
    // Specialization options - use branches from API if available, otherwise fallback to hardcoded list
    const specialisationOptions = useMemo(() => {
        if (routeParams?.branches && Array.isArray(routeParams.branches) && routeParams.branches.length > 0) {
            // Use branch names from API response
            const branchNames = routeParams.branches.map(branch => branch.branch);
            console.log('[CollegeCourseDetailsScreen] Using branches from API:', branchNames);
            return branchNames;
        } else {
            // Fallback to hardcoded list
            console.log('[CollegeCourseDetailsScreen] Using fallback specialization list');
            return [
                'Electronics and Communication',
                'Computer Science Engineering',
                'Information Technology',
                'Electrical Engineering',
                'Mechanical Engineering'
            ];
        }
    }, [routeParams?.branches]);

    const handleCreateAccount = async () => {
        // Validate required fields
        if (!course || !specialisation || !startDate || !endDate) {
            Alert.alert('Error', 'Please fill in all college course details');
            return;
        }

        // Validate user data from previous screens
        if (!routeParams?.email || !routeParams?.firstName || !routeParams?.lastName || !routeParams?.mobileNumber || !routeParams?.password) {
            Alert.alert('Error', 'Missing user information. Please go back and complete the previous steps.');
            return;
        }

        setIsCreatingAccount(true);
        try {
            console.log('[CollegeCourseDetailsScreen] ===== CREATE ACCOUNT CLICKED =====');
            console.log('[CollegeCourseDetailsScreen] User data from route params:', {
                email: routeParams.email,
                firstName: routeParams.firstName,
                lastName: routeParams.lastName,
                mobileNumber: routeParams.mobileNumber,
                password: '***' // Don't log password
            });

            // Call POST /api/auth/user/register
            // Remove country code prefix from mobileNumber if present (API expects just the number)
            let mobileNumberForRegister = routeParams.mobileNumber || '';
            if (mobileNumberForRegister.startsWith('+91')) {
                mobileNumberForRegister = mobileNumberForRegister.substring(3);
            } else if (mobileNumberForRegister.startsWith('91') && mobileNumberForRegister.length === 12) {
                mobileNumberForRegister = mobileNumberForRegister.substring(2);
            }
            
            const registerPayload = {
                email: routeParams.email,
                firstName: routeParams.firstName,
                lastName: routeParams.lastName,
                mobileNumber: mobileNumberForRegister,
                password: routeParams.password,
                platform: 'student',
                phase: course, // Add phase field (B.E or B.Tech)
            };
            
            console.log('[CollegeCourseDetailsScreen] Calling AuthService.register (POST /api/auth/user/register)');
            console.log('[CollegeCourseDetailsScreen] Register payload:', JSON.stringify({ ...registerPayload, password: '***' }, null, 2));
            
            const registerResponse = await AuthService.register(registerPayload);
            
            console.log('[CollegeCourseDetailsScreen] Register API response:', JSON.stringify(registerResponse, null, 2));
            
            // Show success message from backend if available
            if (registerResponse?.message) {
                console.log('[CollegeCourseDetailsScreen] Success message from backend:', registerResponse.message);
                // Note: We'll show success after auto-login completes
            }
            
            // After successful registration, automatically log the user in
            console.log('[CollegeCourseDetailsScreen] Registration successful, automatically logging in...');
            try {
                // Use email for login (mobile number can also be used, but email is more reliable)
                const loginResponse = await AuthService.doLogin(routeParams.email, routeParams.password);
                console.log('[CollegeCourseDetailsScreen] Auto-login successful:', JSON.stringify(loginResponse, null, 2));
                
                // Show success message from backend if available
                if (loginResponse?.message) {
                    console.log('[CollegeCourseDetailsScreen] Login success message from backend:', loginResponse.message);
                }
                
                // Check if user is authorized before navigating to Home
                console.log('[CollegeCourseDetailsScreen] Checking user authorization...');
                try {
                    const authCheck = await AuthService.checkUserAuthorized(loginResponse.userId);
                    console.log('[CollegeCourseDetailsScreen] Authorization check response:', JSON.stringify(authCheck, null, 2));
                    
                    if (authCheck.authorized === true) {
                        // User is authorized - navigate to Home screen
                        console.log('[CollegeCourseDetailsScreen] User is authorized, navigating to Home');
                        // Show success message from registration if available
                        if (registerResponse?.message) {
                            Alert.alert('Success', registerResponse.message);
                        }
                        navigation.replace('Home');
                    } else {
                        // User is not authorized - show error and logout
                        console.log('[CollegeCourseDetailsScreen] User is not authorized');
                        const errorMsg = authCheck.message || 'This email is not authorized to login';
                        Alert.alert('Authorization Failed', errorMsg, [
                            {
                                text: 'OK',
                                onPress: async () => {
                                    // Logout the user since they're not authorized
                                    await AuthService.doLogout();
                                    navigation.navigate('Login');
                                }
                            }
                        ]);
                    }
                } catch (authError: any) {
                    console.error('[CollegeCourseDetailsScreen] Authorization check failed:', authError);
                    // If authorization check fails, still allow login but log the error
                    // This is a fallback in case the authorization API is down
                    const authErrorMessage = authError?.response?.data?.message || authError?.message || 'Failed to verify authorization';
                    console.warn('[CollegeCourseDetailsScreen] Authorization check failed, but allowing login:', authErrorMessage);
                    // Show error message from backend
                    Alert.alert('Warning', authErrorMessage);
                    navigation.replace('Home');
                }
            } catch (loginError: any) {
                console.error('[CollegeCourseDetailsScreen] Auto-login failed:', loginError);
                // If auto-login fails, show error but registration was successful
                const loginErrorMessage = loginError?.response?.data?.message || loginError?.message || 'Failed to log in automatically';
                Alert.alert(
                    'Account Created',
                    registerResponse?.message || 'Your account has been created successfully. Please log in manually.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                navigation.navigate('Login');
                            }
                        }
                    ]
                );
                // Also show the login error message
                Alert.alert('Login Error', loginErrorMessage);
            }
        } catch (error: any) {
            console.error('[CollegeCourseDetailsScreen] Registration failed:', error);
            console.error('[CollegeCourseDetailsScreen] Error response:', JSON.stringify(error?.response?.data, null, 2));
            console.error('[CollegeCourseDetailsScreen] Error status:', error?.response?.status);
            console.error('[CollegeCourseDetailsScreen] Error statusCode:', error?.response?.data?.statusCode);
            
            // Handle 409 Conflict (user already registered)
            if (error?.response?.status === 409 || error?.response?.data?.statusCode === 409) {
                const errorData = error?.response?.data || {};
                const errorMessage = errorData.message || 'User already registered for this platform';
                const errorDetails = {
                    statusCode: errorData.statusCode,
                    timestamp: errorData.timestamp,
                    path: errorData.path,
                    message: errorData.message,
                    error: errorData.error,
                };
                console.log('[CollegeCourseDetailsScreen] 409 Conflict response:', JSON.stringify(errorDetails, null, 2));
                
                Alert.alert('Account Already Exists', errorMessage, [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Navigate to login screen
                            navigation.navigate('Login');
                        }
                    }
                ]);
            } else {
                // Handle other errors
                const errorData = error?.response?.data || {};
                const errorMessage = errorData.message || error?.message || 'Failed to create account. Please try again.';
                console.error('[CollegeCourseDetailsScreen] Registration error details:', JSON.stringify(errorData, null, 2));
                Alert.alert('Error', errorMessage);
            }
        } finally {
            setIsCreatingAccount(false);
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
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* CC Logo at top */}
                <View style={styles.logoContainer}>
                    <CreamCollarLogo width={149} height={32} style={styles.logo} />
                </View>

                {/* Main Card - Frame 16146 from Figma */}
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        {/* Frame 16387 - Progress Steps and Title Section */}
                        <View style={styles.progressTitleSection}>
                            {/* Frame 16056 - Progress Steps */}
                            <ProgressSteps 
                                currentStep={4} 
                                totalSteps={4}
                                completedSteps={[1, 2, 3]}
                            />
                            
                            {/* Frame 16055 - Title */}
                            <View style={styles.titleSection}>
                                <Text style={styles.title}>College Course Details</Text>
                            </View>
                        </View>

                        {/* Frame 16063 - Input Fields and Button */}
                        <View style={styles.contentSection}>
                            {/* Frame 16388 - Input Fields */}
                            <View style={styles.inputSection}>
                                <DropdownField
                                    value={course}
                                    onValueChange={setCourse}
                                    placeholder="Course *"
                                    options={courseOptions}
                                />
                                <DropdownField
                                    value={specialisation}
                                    onValueChange={setSpecialisation}
                                    placeholder="Specializations *"
                                    options={specialisationOptions}
                                />
                                
                                {/* Frame 16392 - Date Fields */}
                                <View style={styles.dateFieldsContainer}>
                                    <DateField
                                        value={startDate}
                                        onValueChange={setStartDate}
                                        placeholder="Start Date"
                                    />
                                    <DateField
                                        value={endDate}
                                        onValueChange={setEndDate}
                                        placeholder="Expected End Date"
                                    />
                                </View>
                            </View>

                            {/* Frame 16141 - Button Section */}
                            <View style={styles.buttonSection}>
                                <PrimaryButton
                                    label={isCreatingAccount ? "Creating Account..." : "Create Account"}
                                    onPress={handleCreateAccount}
                                    disabled={isCreatingAccount || !course || !specialisation || !startDate || !endDate}
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
        justifyContent: 'center',
        marginBottom: 24,
        width: '100%',
        paddingTop: 0,
    },
    logo: {
        width: 149,
        height: 32,
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
        width: '100%',
    },
    title: {
        ...typography.p1Bold,
        color: colors.primaryDarkBlue,
        textAlign: 'center',
        width: '100%',
    },
    contentSection: {
        width: '100%',
        gap: 40, // Exact gap from Figma Frame 16063 (40px between input section and button section)
        marginTop: 32, // Exact gap from Figma (32px from progressTitleSection: 140-108=32)
    },
    inputSection: {
        width: '100%',
        gap: 24, // Exact gap from Figma Frame 16388 (24px between inputs: 72-48=24)
    },
    dateFieldsContainer: {
        width: '100%',
        gap: 24, // Exact gap from Figma Frame 16392 (24px between date fields: 72-48=24)
    },
    buttonSection: {
        width: '100%',
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

export default CollegeCourseDetailsScreen;

