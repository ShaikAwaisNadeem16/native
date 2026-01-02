import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography } from '../styles/theme';
import Header from '../components/Home/Header';
import CompleteProfileWidget from '../components/Home/CompleteProfileWidget';
import CompletedActivitiesCard from '../components/Home/CompletedActivitiesCard';
import JourneyBlock from '../components/Home/JourneyBlock';
import useProfileStore from '../store/useProfileStore';
import { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const { initializeHome, profilePercentage, loading, profileData } = useProfileStore();

    // Load home data on mount - executes APIs in strict sequential order
    // APIs are called ONLY after authentication (token stored during login)
    // All APIs include auth headers via GlobalAxiosConfig
    useEffect(() => {
        initializeHome();
    }, [initializeHome]);

    // Extract percentage value from API response
    const percentageValue = profilePercentage?.overallPercentage || profilePercentage?.percentage || 70;
    // Image URLs from Figma
    const stemAssessmentIconUrl = 'https://www.figma.com/api/mcp/asset/e343ba4f-a8f3-4966-8531-9d44f5591215';
    const automotiveIconUrl = 'https://www.figma.com/api/mcp/asset/1a7483b6-140e-4834-8e14-de7a078afeeb';
    const checkIconUrl = 'https://www.figma.com/api/mcp/asset/2d1f8647-28d6-4c4a-90fa-82698cd1ddfb';
    const checkIconUrl2 = 'https://www.figma.com/api/mcp/asset/bbefd45c-69df-497b-b543-3a2dc95c92a4';

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    const handleUpdateProfile = () => {
        navigation.navigate('Profile');
    };

    const handleViewReport = () => {
        navigation.navigate('AssessmentReport', { finalResult: 'Pass' });
    };

    const handleRewatchCourse = () => {
        console.log('Rewatch Course pressed');
    };

    const handleReattempt = () => {
        console.log('Reattempt pressed');
    };

    const handleOpenPreviousReport = () => {
        navigation.navigate('AssessmentReport', { finalResult: 'Fail' });
    };

    // Completed activities data
    const completedItems = [
        {
            checkIconUrl: checkIconUrl,
            subtitle: 'ASSESSMENT CLEARED',
            title: 'STEM Assessment',
            buttonLabel: 'View Report',
            onButtonPress: handleViewReport,
        },
        {
            checkIconUrl: checkIconUrl2,
            subtitle: 'COURSE COMPLETED',
            title: 'Automotive Industry Awareness',
            buttonLabel: 'Rewatch Course',
            onButtonPress: handleRewatchCourse,
        },
    ];

    // Show loading indicator while fetching initial data
    if (loading && !profileData) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header onProfilePress={handleProfilePress} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primaryBlue} />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Header onProfilePress={handleProfilePress} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Complete Your Profile Widget */}
                <CompleteProfileWidget
                    percentage={percentageValue}
                    onUpdatePress={handleUpdateProfile}
                />

                {/* Learning Journey Section */}
                <View style={styles.learningJourneySection}>
                    <Text style={styles.sectionTitle}>Your Learning Journey</Text>

                    <View style={styles.blocksContainer}>
                        {/* Completed Activities Card */}
                        <CompletedActivitiesCard
                            completed={2}
                            total={10}
                            completedItems={completedItems}
                        />

                        {/* Reattempt Journey Block - STEM Assessment */}
                        <JourneyBlock
                            type="reattempt"
                            iconUrl={stemAssessmentIconUrl}
                            subtitle="TEST"
                            title="STEM Assessment"
                            description="You need to clear the test by scoring at least 7/10 in-order to access the next activity in your journey"
                            buttons={[
                                {
                                    label: 'Reattempt in 60 Days',
                                    disabled: true,
                                    showIcon: true,
                                    onPress: handleReattempt,
                                },
                                {
                                    label: 'Open Previous Report',
                                    disabled: false,
                                    onPress: handleOpenPreviousReport,
                                },
                            ]}
                        />

                        {/* Coming Soon Journey Block - Automotive */}
                        <JourneyBlock
                            type="comingSoon"
                            iconUrl={automotiveIconUrl}
                            subtitle="COURSE"
                            title="Automotive Industry Awareness"
                            description="The intent of this awareness course is to help the students understand all that is needed to know about the industry in which they will work in the future and progress their career. "
                            level="Beginner"
                            duration="3 hours"
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        ...typography.p4,
        color: colors.textGrey,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 32,
    },
    learningJourneySection: {
        paddingHorizontal: 16,
        paddingTop: 24, // Gap from widget to section title
        gap: 24, // Gap between title and blocks
        width: '100%',
    },
    sectionTitle: {
        ...typography.h6,
        color: colors.black2 || colors.primaryDarkBlue,
        width: '100%',
    },
    blocksContainer: {
        gap: 16,
        width: '100%',
    },
});

export default HomeScreen;

