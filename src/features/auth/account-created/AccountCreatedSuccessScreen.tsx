import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing, borderRadius, sizes } from '../../../styles/theme';
import ProgressSteps from '../../../components/SignUp/ProgressSteps';
import PrimaryButton from '../../../components/SignUp/PrimaryButton';
import { RootStackParamList } from '../../../navigation/AppNavigator';

// Icons removed - will be added later

type AccountCreatedSuccessScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AccountCreatedSuccess'>;

const AccountCreatedSuccessScreen: React.FC = () => {
    const navigation = useNavigation<AccountCreatedSuccessScreenNavigationProp>();

    const handleExplorePlatform = () => {
        // Navigate to Home screen after account creation
        navigation.replace('Home');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Background Header Image */}
            <View style={styles.headerImageContainer}>
                <View style={styles.headerImage} />
            </View>

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

                {/* Main Card - Frame 16146 from Figma */}
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        {/* Frame 16387 - Progress Steps Section */}
                        <View style={styles.progressSection}>
                            <ProgressSteps 
                                currentStep={4} 
                                totalSteps={4}
                                completedSteps={[1, 2, 3, 4]}
                            />
                        </View>

                        {/* Frame 16287 - Success Icon */}
                        <View style={styles.successIconContainer}>
                            <View style={styles.successIcon} />
                        </View>

                        {/* Frame 16092 - Title and Subtitle */}
                        <View style={styles.titleSection}>
                            <Text style={styles.title}>
                                Your account has been successfully created
                            </Text>
                            <Text style={styles.subtitle}>
                                Now lets explore the platform. Your future awaits you!
                            </Text>
                        </View>

                        {/* Button Section */}
                        <View style={styles.buttonSection}>
                            <PrimaryButton
                                label="Explore The Platform"
                                onPress={handleExplorePlatform}
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
    headerImageContainer: {
        width: '100%',
        height: 122, // Exact height from Figma
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingTop: 170, // Logo position from Figma (170px from top)
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
        alignItems: 'center',
    },
    progressSection: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 32, // Exact gap from Figma: 92 - 32 - 28 = 32px from progress to icon
    },
    successIconContainer: {
        width: 172, // Exact width from Figma
        height: 124, // Exact height from Figma
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32, // Exact gap from Figma: 248 - 92 - 124 = 32px from icon to title
    },
    successIcon: {
        width: '100%',
        height: '100%',
    },
    titleSection: {
        width: '100%',
        gap: 8, // Exact gap from Figma Frame 16092 (8px between title and subtitle: 32 - 24 = 8px)
        alignItems: 'center',
        marginBottom: 32, // Exact gap from Figma: 332 - 248 - 52 = 32px from title to button
    },
    title: {
        ...typography.h6, // H6: 20px, line-height 24px, weight 700
        color: colors.primaryDarkBlue,
        textAlign: 'center',
        width: '100%',
    },
    subtitle: {
        ...typography.p4, // P4 Regular: 14px, line-height 20px, weight 400
        color: colors.textGrey,
        textAlign: 'center',
        width: '100%',
    },
    buttonSection: {
        width: '100%',
    },
});

export default AccountCreatedSuccessScreen;

