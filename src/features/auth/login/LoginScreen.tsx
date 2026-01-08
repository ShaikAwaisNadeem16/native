import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing, borderRadius, sizes } from '../../../styles/theme';
import TextInputField from '../../../components/SignUp/TextInputField';
import LoginPasswordField from '../../../components/SignUp/LoginPasswordField';
import PrimaryButton from '../../../components/SignUp/PrimaryButton';
import Checkbox from '../../../components/SignUp/Checkbox';
import AuthService from '../../../api/auth';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import CreamCollarLogo from '../../../components/common/CreamCollarLogo';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [emailOrMobile, setEmailOrMobile] = useState('');
    const [password, setPassword] = useState('');
    const [keepLoggedIn, setKeepLoggedIn] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        // Basic validation
        if (!emailOrMobile.trim()) {
            setError('Please enter your Email ID or Mobile Number');
            return;
        }
        if (!password.trim()) {
            setError('Please enter your password');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await AuthService.doLogin(emailOrMobile.trim(), password);
            if (response.message === "Login successful") {
                // Login successful - tokens are already stored by AuthService
                // Navigate to Home screen
                navigation.replace('Home');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            const errorMessage = error?.message || 'Please enter correct Email ID / Phone Number or Password.';
            setError(errorMessage);
            Alert.alert('Login Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = () => {
        // Navigate to Register screen
        navigation.navigate('Register');
    };

    const handleForgotPassword = () => {
        // Handle forgot password
        console.log('Forgot Password');
    };

    const handleTermsPress = () => {
        // Handle terms link
        console.log('Open terms');
    };

    const handlePrivacyPress = () => {
        // Handle privacy link
        console.log('Open privacy');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* CC Logo */}
                <View style={styles.logoContainer}>
                    <CreamCollarLogo width={149} height={32} />
                </View>

                {/* Main Card - Frame 16143 from Figma */}
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        {/* Frame 16086 - Title and Subtitle Section */}
                        <View style={styles.titleSection}>
                            {/* Title and Toggle */}
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>
                                    Welcome back to CreamCollar
                                </Text>
                            </View>
                            {/* Frame 16085 - Subtitle with sign up link */}
                            <View style={styles.subtitleContainer}>
                                <Text style={styles.subtitleText}>New to CreamCollar? </Text>
                                <TouchableOpacity onPress={handleSignUp}>
                                    <Text style={styles.subtitleLink}>Sign Up For Free</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Sign Up Options - Input Fields Section */}
                        <View style={styles.inputSection}>
                            {/* Frame 16144 - Input Fields */}
                            <View style={styles.inputFieldsContainer}>
                                <TextInputField
                                    placeholder="Email ID or Mobile Number"
                                    value={emailOrMobile}
                                    onChangeText={(text) => {
                                        setEmailOrMobile(text);
                                        if (error) setError('');
                                    }}
                                />
                                <LoginPasswordField
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        if (error) setError('');
                                    }}
                                    onForgotPassword={handleForgotPassword}
                                />
                                {error && (
                                    <Text style={styles.errorText}>{error}</Text>
                                )}
                            </View>

                            {/* Frame 16147 - Button and Checkbox */}
                            <View style={styles.buttonCheckboxSection}>
                                <PrimaryButton
                                    label={loading ? "Logging in..." : "Login"}
                                    onPress={handleLogin}
                                    disabled={loading}
                                />
                                {loading && (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator size="small" color={colors.primaryBlue} />
                                    </View>
                                )}
                                {/* Frame 16065 - Keep Me Logged In */}
                                <View style={styles.checkboxContainer}>
                                    <Checkbox
                                        checked={keepLoggedIn}
                                        onToggle={() => setKeepLoggedIn(!keepLoggedIn)}
                                    />
                                    <Text style={styles.checkboxLabel}>Keep Me Logged In</Text>
                                </View>
                            </View>
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
        paddingTop: 40, // Logo position from Figma (40px from top)
        paddingBottom: 32,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 0,
    },
    cardContainer: {
        width: '100%',
        maxWidth: 328, // Exact width from Figma (mobile)
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.card,
        paddingHorizontal: 16, // Exact from Figma (16px horizontal padding for mobile)
        paddingVertical: spacing.cardPaddingV,
        marginBottom: 12, // Gap between card and footer
    },
    titleSection: {
        gap: 4, // Exact gap from Figma Frame 16086 (4px between title and subtitle)
        alignItems: 'center',
        marginBottom: 0, // Gap handled by inputSection marginTop
    },
    titleContainer: {
        gap: 16, // Exact gap from Figma Title and Toggle (16px)
        alignItems: 'center',
    },
    title: {
        ...typography.p2Bold, // P2 Bold: 18px, line-height 25px, weight 700
        color: colors.primaryDarkBlue,
        textAlign: 'center',
    },
    subtitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8, // Exact gap from Figma Frame 16085 (8px between text and link)
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
        gap: 32, // Exact gap from Figma Sign Up Options (32px between input fields and button section)
        marginTop: 32, // Exact gap from Figma: 113 - 81 = 32px from title section (Frame 16086 ends at 81px, Sign Up Options starts at 113px)
    },
    inputFieldsContainer: {
        width: '100%',
        gap: 24, // Exact gap from Figma Frame 16144 (24px between inputs: 72 - 48 = 24px)
    },
    buttonCheckboxSection: {
        width: '100%',
        gap: 8, // Exact gap from Figma Frame 16147 (8px between button and checkbox: 48 - 40 = 8px)
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // Exact gap from Figma Frame 16065 (8px between checkbox and label: 24 - 16 = 8px)
        justifyContent: 'flex-end',
    },
    checkboxLabel: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 15, // Normal line height
        color: colors.primaryBlue,
        flex: 1,
    },
    footerContainer: {
        width: '100%',
        paddingHorizontal: 16, // Exact from Figma (16px horizontal padding)
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
    loadingContainer: {
        alignItems: 'center',
        marginTop: 8,
    },
    errorText: {
        ...typography.s1Regular,
        color: colors.error,
        marginTop: 4,
        textAlign: 'center',
    },
});

export default LoginScreen;

