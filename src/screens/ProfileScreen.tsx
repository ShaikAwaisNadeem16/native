import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography } from '../styles/theme';
import Header from '../components/Home/Header';
import BreadcrumbBar from '../components/Assessment/BreadcrumbBar';
import ProfileAvatarWithProgress from '../components/Profile/ProfileAvatarWithProgress';
import SectionHeader from '../components/Profile/SectionHeader';
import ProfileField from '../components/Profile/ProfileField';
import LanguageTable from '../components/Profile/LanguageTable';
import EducationCard from '../components/Profile/EducationCard';
import SkillTag from '../components/Profile/SkillTag';

const ProfileScreen: React.FC = () => {
    // Image URLs from Figma
    const profileAvatarUrl = 'https://www.figma.com/api/mcp/asset/9f653d3c-f67f-477c-a95b-a57a0d494176';

    // Languages data
    const languages = [
        { language: 'English', proficiency: 'Proficient' },
        { language: 'Marathi', proficiency: 'Basic' },
    ];

    // Skills data
    const skills = [
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
        console.log('Edit personal details');
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
                        percentage={70}
                        avatarUrl={profileAvatarUrl}
                        onEditPress={handleProfilePress}
                    />
                    <View style={styles.userInfoContainer}>
                        <Text style={styles.userName}>Steven Melwyn Quadros</Text>
                        <Text style={styles.userCollege}>St. Francis Institute Of Technology</Text>
                    </View>
                </View>

                {/* Personal Details Section */}
                <View style={styles.sectionCard}>
                    <SectionHeader
                        title="Personal Details"
                        completionPercentage={20}
                        onEditPress={handleEditPersonalDetails}
                    />
                    <View style={styles.fieldsContainer}>
                        <ProfileField
                            label="About You"
                            value="Lorem ipsum dolor sit amet consectetur. Nisl viverra pulvinar cursus morbi aliquet gravida tincidunt lobortis non. Sed ut leo magna pulvinar odio amet in. Enim consectetur cras tellus magnis nunc condimentum aenean. Tincidunt sapien vulputate interdum pellentesque orci est viverra id vulputate."
                        />
                        <ProfileField label="First Name" value="Steven" />
                        <ProfileField label="Last Name" value="Quadros" />
                        <ProfileField label="Gender" value="Male" />
                        <ProfileField label="Phone Number" value="+91 435 543 2564" />
                        <ProfileField label="Email ID" value="stevenabcquadros@gmail.com" />
                        <ProfileField label="Full Name" value="Pending..." />
                        <ProfileField label="City" value="Mumbai" />
                        <ProfileField label="Nationality" value="India" />
                        <ProfileField label="Date of Birth" value="14 Feb 1995" />
                        <ProfileField label="Linkedin Profile URL" value="Pending..." />
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
                        {skills.map((skill, index) => (
                            <SkillTag
                                key={index}
                                skill={skill.skill}
                                isHighlighted={skill.isHighlighted}
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

