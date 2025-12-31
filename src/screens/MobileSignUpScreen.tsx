import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, borderRadius, sizes } from '../styles/theme';
import TextInputField from '../components/SignUp/TextInputField';
import PhoneInputField from '../components/SignUp/PhoneInputField';
import PasswordField from '../components/SignUp/PasswordField';
import PrimaryButton from '../components/SignUp/PrimaryButton';

const MobileSignUpScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Handle login navigation
        console.log('Navigate to Login');
    };

    const handleVerify = () => {
        // Handle verify action
        console.log('Verify Email and Mobile Number');
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
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoText}>CC Logo</Text>
                    </View>
                </View>

                {/* Terms Text - ABOVE the card */}
                <View style={styles.termsContainer}>
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

                {/* Main Card - Register from Figma */}
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        {/* Frame 16086 - Title and Subtitle Section */}
                        <View style={styles.titleSection}>
                            {/* Title and Toggle */}
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>
                                    Create a new account for free
                                </Text>
                            </View>
                            {/* Frame 16085 - Subtitle with login link */}
                            <View style={styles.subtitleContainer}>
                                <Text style={styles.subtitleText}>Already have an account? </Text>
                                <TouchableOpacity onPress={handleLogin}>
                                    <Text style={styles.subtitleLink}>Log in</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Sign Up Options - Input Fields Section */}
                        <View style={styles.inputSection}>
                            {/* Frame 16145 - Input Fields */}
                            <View style={styles.inputFieldsContainer}>
                                <TextInputField
                                    placeholder="Email ID"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                                <TextInputField
                                    placeholder="First Name"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    disabled={true}
                                />
                                <TextInputField
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChangeText={setLastName}
                                    disabled={true}
                                />
                                <PhoneInputField
                                    value={mobileNumber}
                                    onChangeText={setMobileNumber}
                                    disabled={true}
                                />
                                <PasswordField
                                    value={password}
                                    onChangeText={setPassword}
                                    disabled={true}
                                />
                            </View>

                            {/* Button */}
                            <PrimaryButton
                                label="Verify Email and Mobile Number"
                                onPress={handleVerify}
                                disabled={true}
                            />
                        </View>
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
    termsContainer: {
        width: '100%',
        maxWidth: 328, // Exact width from Figma
        paddingHorizontal: 16, // Exact from Figma
        marginTop: 35, // Exact gap from Figma: 107 - 72 = 35px from logo bottom (logo ends at 72px)
        marginBottom: 18, // Exact gap from Figma: 153 - 135 = 18px to card top (terms ends at 135px)
    },
    termsText: {
        ...typography.terms,
        color: colors.placeholderGrey,
        textAlign: 'left',
        width: '100%',
    },
    termsLink: {
        ...typography.terms,
        color: colors.primaryBlue,
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
        gap: 32, // Exact gap from Figma Sign Up Options (32px between input fields and button)
        marginTop: 32, // Exact gap from Figma: 113 - 81 = 32px from title section
    },
    inputFieldsContainer: {
        width: '100%',
        gap: 24, // Exact gap from Figma Frame 16145 (24px between inputs: 72 - 48 = 24px)
    },
});

export default MobileSignUpScreen;

