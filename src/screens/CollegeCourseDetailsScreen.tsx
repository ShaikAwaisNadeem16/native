import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing, borderRadius, sizes } from '../styles/theme';
import ProgressSteps from '../components/SignUp/ProgressSteps';
import DropdownField from '../components/SignUp/DropdownField';
import DateField from '../components/SignUp/DateField';
import PrimaryButton from '../components/SignUp/PrimaryButton';
import { RootStackParamList } from '../navigation/AppNavigator';

type CollegeCourseDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CollegeCourseDetails'>;

const CollegeCourseDetailsScreen: React.FC = () => {
    const navigation = useNavigation<CollegeCourseDetailsScreenNavigationProp>();
    const [course, setCourse] = useState('');
    const [specialisation, setSpecialisation] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    // Placeholder options - these would come from API in real implementation
    const courseOptions = ['Computer Science', 'Engineering', 'Business', 'Arts'];
    const specialisationOptions = ['Software Development', 'Data Science', 'Web Development', 'Mobile Development'];

    const handleCreateAccount = () => {
        // Navigate to Account Created Success screen
        navigation.navigate('AccountCreatedSuccess');
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
                                    placeholder="Course"
                                    options={courseOptions}
                                />
                                <DropdownField
                                    value={specialisation}
                                    onValueChange={setSpecialisation}
                                    placeholder="Specialisation"
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
                                    label="Create Account"
                                    onPress={handleCreateAccount}
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

