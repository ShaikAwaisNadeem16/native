import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, typography } from '../styles/theme';
import Header from '../components/Home/Header';
import BreadcrumbBar from '../components/Assessment/BreadcrumbBar';
import ProfileAvatarWithProgress from '../components/Profile/ProfileAvatarWithProgress';
import SectionHeader from '../components/Profile/SectionHeader';
import ProfileField from '../components/Profile/ProfileField';
import LanguageTable from '../components/Profile/LanguageTable';
import EducationCard from '../components/Profile/EducationCard';
import SkillTag from '../components/Profile/SkillTag';
import useProfileStore from '../store/useProfileStore';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { profileData, profileDetails, profilePercentage, loading } = useProfileStore();

    // Image URLs from Figma
    const profileAvatarUrl = 'https://www.figma.com/api/mcp/asset/9f653d3c-f67f-477c-a95b-a57a0d494176';

    // Extract profile data from store or use defaults
    const userData = profileDetails || profileData || {};
    const firstName = userData.firstName || userData.first_name || 'Steven';
    const lastName = userData.lastName || userData.last_name || 'Quadros';
    const fullName = `${firstName} ${userData.middleName || ''} ${lastName}`.trim() || 'Steven Melwyn Quadros';
    const collegeName = userData.collegeName || userData.college_name || 'St. Francis Institute Of Technology';
    const aboutYou = userData.aboutYou || userData.about_you || 'Lorem ipsum dolor sit amet consectetur. Nisl viverra pulvinar cursus morbi aliquet gravida tincidunt lobortis non. Sed ut leo magna pulvinar odio amet in. Enim consectetur cras tellus magnis nunc condimentum aenean. Tincidunt sapien vulputate interdum pellentesque orci est viverra id vulputate.';
    const gender = userData.gender || 'Male';
    const phoneNumber = userData.phoneNumber || userData.phone_number || '+91 435 543 2564';
    const emailId = userData.email || userData.emailId || 'stevenabcquadros@gmail.com';
    const city = userData.city || 'Mumbai';
    const nationality = userData.nationality || 'India';
    const dateOfBirth = userData.dateOfBirth || userData.dob || '14 Feb 1995';
    const linkedinUrl = userData.linkedinUrl || userData.linkedin_url || 'Pending...';

    // Extract percentage from store
    const percentageValue = profilePercentage?.overallPercentage || profilePercentage?.percentage || 70;
    const personalDetailsPercentage = profilePercentage?.personalDetailsPercentage || 20;

    // Languages data from store or defaults
    const languages = Array.isArray(userData.languages) ? userData.languages : [
        { language: 'English', proficiency: 'Proficient' },
        { language: 'Marathi', proficiency: 'Basic' },
    ];

    // Skills data from store or defaults
    const rawSkills = userData.skills || userData.technicalCompetencies;
    const skills = Array.isArray(rawSkills) ? rawSkills : [
        { skill: 'Photoshop', isHighlighted: false },
        { skill: 'Illustrator', isHighlighted: false },
        { skill: 'Figma', isHighlighted: true },
        { skill: 'inDesign', isHighlighted: true },
        { skill: 'Sketch', isHighlighted: true },
        { skill: 'Hotjar', isHighlighted: true },
        { skill: 'VWO', isHighlighted: true },
    ];

    const handleProfilePress = () => {
        console.log('Profile pressed');
    };

    const handleEditPersonalDetails = () => {
        navigation.navigate('EditPersonalDetails');
    };

    const handleAddEducation = () => {
        console.log('Add education');
    };

    const handleEditEducation = () => {
        console.log('Edit education');
    };

    const handleDeleteEducation = () => {
        console.log('Delete education');
    };

    const handleAddTechnicalCompetencies = () => {
        console.log('Add technical competencies');
    };

    const handleEditTechnicalCompetencies = () => {
        console.log('Edit technical competencies');
    };

    // Show loading indicator while fetching data
    if (loading && !profileData && !profileDetails) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header onProfilePress={handleProfilePress} />
                <BreadcrumbBar items={['Your Profile']} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primaryBlue} />
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Header onProfilePress={handleProfilePress} />

            {/* Breadcrumb Bar */}
            <BreadcrumbBar items={['Your Profile']} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Avatar and User Info Section */}
                <View style={styles.avatarSection}>
                    <ProfileAvatarWithProgress
                        percentage={percentageValue}
                        avatarUrl={profileAvatarUrl}
                        onEditPress={handleProfilePress}
                    />
                    <View style={styles.userInfoContainer}>
                        <Text style={styles.userName}>{fullName}</Text>
                        <Text style={styles.userCollege}>{collegeName}</Text>
                    </View>
                </View>

                {/* Personal Details Section */}
                <View style={styles.sectionCard}>
                    <SectionHeader
                        title="Personal Details"
                        completionPercentage={personalDetailsPercentage}
                        onEditPress={handleEditPersonalDetails}
                    />
                    <View style={styles.fieldsContainer}>
                        <ProfileField
                            label="About You"
                            value={aboutYou}
                        />
                        <ProfileField label="First Name" value={firstName} />
                        <ProfileField label="Last Name" value={lastName} />
                        <ProfileField label="Gender" value={gender} />
                        <ProfileField label="Phone Number" value={phoneNumber} />
                        <ProfileField label="Email ID" value={emailId} />
                        <ProfileField label="Full Name" value={fullName} />
                        <ProfileField label="City" value={city} />
                        <ProfileField label="Nationality" value={nationality} />
                        <ProfileField label="Date of Birth" value={dateOfBirth} />
                        <ProfileField label="Linkedin Profile URL" value={linkedinUrl} />
                    </View>

                    {/* Languages Section */}
                    <View style={styles.languagesSection}>
                        <Text style={styles.languagesTitle}>Languages</Text>
                        <LanguageTable languages={languages} />
                    </View>
                </View>

                {/* Education Details Section - Empty */}
                <View style={styles.sectionCard}>
                    <SectionHeader
                        title="Education Details"
                        completionPercentage={0}
                        onAddPress={handleAddEducation}
                        showAddIcon={true}
                    />
                </View>

                {/* Education Details Section - With Data */}
                <View style={styles.sectionCard}>
                    <SectionHeader
                        title="Education Details"
                        completionPercentage={20}
                        onAddPress={handleAddEducation}
                        showAddIcon={true}
                    />
                    <View style={styles.educationCardContainer}>
                        <EducationCard
                            title="Class X"
                            subtitle="Maharashtra Board - 2023"
                            onEditPress={handleEditEducation}
                            onDeletePress={handleDeleteEducation}
                        />
                    </View>
                </View>

                {/* Technical Competencies Section - Empty */}
                <View style={styles.sectionCard}>
                    <SectionHeader
                        title="Technical Competencies"
                        completionPercentage={0}
                        onAddPress={handleAddTechnicalCompetencies}
                        showAddIcon={true}
                    />
                </View>

                {/* Technical Competencies Section - With Data */}
                <View style={styles.sectionCard}>
                    <SectionHeader
                        title="Technical Competencies"
                        completionPercentage={20}
                        onEditPress={handleEditTechnicalCompetencies}
                    />
                    <View style={styles.skillsContainer}>
                        {skills.map((skill: { skill?: string; isHighlighted?: boolean }, index: number) => (
                            <SkillTag
                                key={index}
                                skill={skill?.skill || ''}
                                isHighlighted={skill?.isHighlighted || false}
                            />
                        ))}
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
        paddingHorizontal: 0, // No horizontal padding - cards have their own padding
        paddingTop: 16, // Gap from breadcrumb to avatar section
        paddingBottom: 32,
        gap: 16,
    },
    avatarSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
        paddingHorizontal: 16,
        paddingTop: 0,
        paddingBottom: 0,
    },
    userInfoContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
        paddingTop: 13.236, // From Figma positioning
    },
    userName: {
        ...typography.p2Bold,
        color: colors.primaryDarkBlue,
    },
    userCollege: {
        ...typography.p4,
        color: colors.textGrey,
    },
    sectionCard: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: 0, // No border radius from Figma
        paddingHorizontal: 16,
        paddingVertical: 24,
        gap: 24,
        width: '100%',
    },
    fieldsContainer: {
        flexDirection: 'column',
        gap: 24,
        width: '100%',
    },
    languagesSection: {
        flexDirection: 'column',
        gap: 24,
        width: '100%',
    },
    languagesTitle: {
        ...typography.p3Bold,
        color: colors.primaryDarkBlue,
    },
    educationCardContainer: {
        width: '100%',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        rowGap: 12, // Vertical gap between rows
        width: '100%',
    },
});

export default ProfileScreen;

