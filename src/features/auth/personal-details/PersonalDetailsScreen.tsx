import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing, borderRadius, sizes } from '../../../styles/theme';
import ProgressSteps from '../../../components/SignUp/ProgressSteps';
import TextInputField from '../../../components/SignUp/TextInputField';
import PhoneInputField from '../../../components/SignUp/PhoneInputField';
import PasswordField from '../../../components/SignUp/PasswordField';
import PrimaryButton from '../../../components/SignUp/PrimaryButton';
import SecondaryButton from '../../../components/SignUp/SecondaryButton';
import { RootStackParamList } from '../../../navigation/AppNavigator';

type PersonalDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PersonalDetails'>;

const PersonalDetailsScreen: React.FC = () => {
    const navigation = useNavigation<PersonalDetailsScreenNavigationProp>();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');

    const handleVerify = () => {
        // Navigate to College Course Details screen
        navigation.navigate('CollegeCourseDetails');
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
                                onChangeText={setMobileNumber}
                                countryCode="+91"
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
                                label="Verify Email And Mobile Number"
                                onPress={handleVerify}
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

