import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { colors, typography } from '../../styles/theme';
import Header from '../home/components/Header';
import BreadcrumbBar from '../assessments/components/BreadcrumbBar';
import ProfileAvatarWithProgress from './components/ProfileAvatarWithProgress';
import SectionHeader from './components/SectionHeader';
import ProfileField from './components/ProfileField';
import LanguageTable from './components/LanguageTable';
import EducationCard from './components/EducationCard';
import WorkExperienceCard from './components/WorkExperienceCard';
import CertificateCard from './components/CertificateCard';
import SkillTag from './components/SkillTag';
import useProfileStore from '../../store/useProfileStore';

// Icons removed - will be added later

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { profileData, profileDetails, profilePercentage, loading, fetchProfileDropdownData } = useProfileStore();

    // Fetch dropdown data when profile screen loads
    useEffect(() => {
        fetchProfileDropdownData();
    }, [fetchProfileDropdownData]);

    // Debug: Log data when it changes
    useEffect(() => {
        console.log('[ProfileScreen] Profile data updated:', profileData ? 'Data exists' : 'No data');
        console.log('[ProfileScreen] Profile details updated:', profileDetails ? 'Data exists' : 'No data');
        console.log('[ProfileScreen] Profile percentage:', profilePercentage);
        console.log('[ProfileScreen] Loading state:', loading);
        
        // Log detailed data for debugging
        const hasProfileDetails = profileDetails && Object.keys(profileDetails).length > 0;
        const userData = hasProfileDetails ? profileDetails : (profileData || {});
        console.log('[ProfileScreen] profileDetails exists:', !!profileDetails);
        console.log('[ProfileScreen] profileDetails keys:', profileDetails ? Object.keys(profileDetails) : []);
        console.log('[ProfileScreen] profileData exists:', !!profileData);
        console.log('[ProfileScreen] profileData keys:', profileData ? Object.keys(profileData) : []);
        console.log('[ProfileScreen] User data keys:', Object.keys(userData));
        console.log('[ProfileScreen] technicalSkills:', userData.technicalSkills);
        console.log('[ProfileScreen] educationalDetails:', userData?.educationalDetails);
        console.log('[ProfileScreen] workExperience:', userData.workExperience);
        console.log('[ProfileScreen] certificate:', userData.certificate);
        console.log('[ProfileScreen] languages:', userData.languages);
    }, [profileData, profileDetails, profilePercentage, loading]);


    // Extract profile data from store
    // Use profileDetails if it exists and has data, otherwise fall back to profileData
    // Merge both to ensure we have all available data
    const userData = {
        ...(profileData || {}),
        ...(profileDetails && Object.keys(profileDetails).length > 0 ? profileDetails : {})
    };
    
    // Helper function to format date from "YYYY-MM-DD" to "DD MMM YYYY"
    const formatDateOfBirth = (dateStr: string | null | undefined): string => {
        if (!dateStr) return '';
        try {
            const parts = dateStr.split('-');
            if (parts.length >= 3) {
                const year = parts[0];
                const month = parseInt(parts[1]) - 1;
                const day = parts[2];
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return `${day} ${monthNames[month] || ''} ${year}`;
            } else if (parts.length === 2) {
                const year = parts[0];
                const month = parseInt(parts[1]) - 1;
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return `${monthNames[month] || ''} ${year}`;
            }
            return dateStr;
        } catch (error) {
            return dateStr;
        }
    };
    
    // Personal Details - Safe extraction with null checks
    const firstName = userData?.firstName || userData?.first_name || '';
    const lastName = userData?.lastName || userData.last_name || '';
    const fullName = `${firstName} ${userData?.middleName || ''} ${lastName}`.trim();
    // Get college name from educationalDetails if available
    const educationalDetailsArray = Array.isArray(userData?.educationalDetails) ? userData?.educationalDetails : [];
    const latestEducation = educationalDetailsArray.length > 0 ? educationalDetailsArray[0] : null;
    const collegeName = latestEducation?.collegeName || userData?.collegeName || userData.college_name || '';
    const aboutYou = userData?.aboutYou || userData.about_you || '';
    const gender = userData?.gender || '';
    const phoneNumber = userData?.phoneNumber || userData.phone_number || '';
    const emailId = userData?.email || userData?.emailId || '';
    const city = userData?.city || '';
    const nationality = userData?.nationality || '';
    const dateOfBirth = formatDateOfBirth(userData?.dob || userData?.dateOfBirth);
    const linkedinUrl = userData?.linkedinLink || userData?.linkedin_url || '';
    const state = userData?.state || '';
    const permanentAddress = userData?.permanentAddress || '';
    const pinCode = userData?.pinCode || '';
    const district = userData?.district || '';
    const locality = userData?.locality || '';

    // Extract percentage from store - API returns: personalPercentage, educationPercentage, workPercentage, skillPercentage, certificatePercentage, overallPercentage
    // Only use API data, no hardcoded fallback
    const percentageValue = profilePercentage?.overallPercentage ?? profilePercentage?.percentage ?? null;
    
    // Debug: Log percentage for verification
    useEffect(() => {
        if (percentageValue !== null && percentageValue !== undefined) {
            console.log('[ProfileScreen] Profile completion percentage:', percentageValue);
        } else {
            console.log('[ProfileScreen] Profile completion percentage: Not available (will hide badge)');
        }
    }, [percentageValue]);
    const personalDetailsPercentage = profilePercentage?.personalPercentage || profilePercentage?.personalDetailsPercentage || 0;
    const educationPercentage = profilePercentage?.educationPercentage || 0;
    const workPercentage = profilePercentage?.workPercentage || 0;
    const skillPercentage = profilePercentage?.skillPercentage || 0;
    const certificatePercentage = profilePercentage?.certificatePercentage || 0;

    // Languages data from store - API can return null, so handle it properly
    const languages = Array.isArray(userData?.languages) && userData.languages.length > 0 
        ? userData.languages 
        : [];

    // Skills data from store or defaults
    // technicalSkills from API is array of { skillId, skillName } objects
    const rawSkills = userData?.technicalSkills || userData?.skills || userData?.technicalCompetencies || null;
    const skills = Array.isArray(rawSkills) && rawSkills.length > 0
        ? rawSkills
            .filter((item: any) => item !== null && item !== undefined) // Filter out null/undefined items
            .map((item: any) => {
                // Handle both API format { skillId, skillName } and legacy format { skill, isHighlighted }
                if (item && typeof item === 'object' && item.skillName) {
                    return { skill: item.skillName || '', isHighlighted: false };
                } else if (typeof item === 'string') {
                    return { skill: item, isHighlighted: false };
                } else if (item && typeof item === 'object') {
                    return { skill: item.skill || item.name || '', isHighlighted: item.isHighlighted || false };
                }
                return { skill: '', isHighlighted: false };
            })
            .filter((skill: any) => skill.skill !== '') // Remove empty skills
        : [];

    // Work Experience data from store - Safe array extraction
    const workExperienceArray = Array.isArray(userData?.workExperience) ? userData.workExperience : [];

    // Certificates data from store - Safe array extraction
    const certificatesArray = Array.isArray(userData?.certificate) ? userData.certificate : [];

    // Helper function to format date from "YYYY-MM" to "MMM YYYY"
    const formatDate = (dateStr: string): string => {
        if (!dateStr || dateStr.length !== 7) return '';
        const [year, month] = dateStr.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthName = monthNames[parseInt(month) - 1] || '';
        return `${monthName} ${year}`;
    };

    // Helper function to format date range - Safe with null checks
    const formatDateRange = (workExp: any): string => {
        if (!workExp || typeof workExp !== 'object') return '';
        const startDate = workExp?.workStartDate ? formatDate(workExp.workStartDate) : '';
        if (workExp?.isWorking === true) {
            return startDate ? `${startDate} - Present` : 'Present';
        }
        const endDate = workExp?.workEndDate ? formatDate(workExp.workEndDate) : '';
        if (startDate && endDate) {
            return `${startDate} - ${endDate}`;
        }
        return startDate || endDate || '';
    };

    const handleProfilePress = () => {
        console.log('Profile pressed');
    };

    const handleEditPersonalDetails = () => {
        navigation.navigate('EditPersonalDetails');
    };

    const handleAddEducation = () => {
        // Navigate to EditEducationDetails screen to add new education
        navigation.navigate('EditEducationDetails');
    };

    const handleEditEducation = () => {
        // Navigate to EditEducationDetails screen when Edit icon/button is clicked
        // This can be triggered by:
        // 1. Edit icon in SectionHeader (when there's existing data)
        // 2. Edit button inside EducationCard
        navigation.navigate('EditEducationDetails');
    };

    const handleDeleteEducation = () => {
        console.log('Delete education');
    };

    const handleAddTechnicalCompetencies = () => {
        // Navigate to EditTechnicalCompetencies screen to add/edit skills
        navigation.navigate('EditTechnicalCompetencies');
    };

    const handleEditTechnicalCompetencies = () => {
        // Navigate to EditTechnicalCompetencies screen when Edit icon/button is clicked
        navigation.navigate('EditTechnicalCompetencies');
    };

    const handleAddCertificates = () => {
        // Navigate to EditCertificates screen to add/edit certificates
        navigation.navigate('EditCertificates');
    };

    const handleEditCertificates = () => {
        // Navigate to EditCertificates screen when Edit icon/button is clicked
        navigation.navigate('EditCertificates');
    };

    const handleAddWorkInternship = () => {
        // Navigate to EditWorkInternshipDetails screen to add new work/internship
        navigation.navigate('EditWorkInternshipDetails');
    };

    const handleEditWorkInternship = () => {
        // Navigate to EditWorkInternshipDetails screen when Edit icon/button is clicked
        navigation.navigate('EditWorkInternshipDetails');
    };

    // Show loading indicator while fetching data
    if (loading && !profileData && !profileDetails) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header onProfilePress={handleProfilePress} onLogoPress={() => navigation.navigate('Home')} />
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
                        // avatarUrl={profileAvatarUrl}
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
                        completionPercentage={Math.round(personalDetailsPercentage)}
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
                        {state ? <ProfileField label="State" value={state} /> : null}
                        <ProfileField label="City" value={city} />
                        {district ? <ProfileField label="District" value={district} /> : null}
                        {locality ? <ProfileField label="Locality" value={locality} /> : null}
                        {pinCode ? <ProfileField label="Pin Code" value={pinCode} /> : null}
                        {permanentAddress ? <ProfileField label="Permanent Address" value={permanentAddress} /> : null}
                        <ProfileField label="Nationality" value={nationality} />
                        {dateOfBirth ? <ProfileField label="Date of Birth" value={dateOfBirth} /> : null}
                        {linkedinUrl ? <ProfileField label="Linkedin Profile URL" value={linkedinUrl} /> : null}
                    </View>

                    {/* Languages Section */}
                    <View style={styles.languagesSection}>
                        <Text style={styles.languagesTitle}>Languages</Text>
                        <LanguageTable languages={languages} />
                    </View>
                </View>

                {/* Education Details Section */}
                {educationalDetailsArray.length > 0 ? (
                    <View style={styles.sectionCard}>
                        <SectionHeader
                            title="Education Details"
                            completionPercentage={Math.round(educationPercentage)}
                            onEditPress={handleEditEducation}
                            showAddIcon={false}
                        />
                        <View style={styles.educationCardContainer}>
                            {educationalDetailsArray
                                .filter((edu: any) => edu !== null && edu !== undefined)
                                .map((edu: any, index: number) => {
                                    // Format end date from "YYYY-MM" to "MMM YYYY" - Safe with null checks
                                    const formattedEndDate = edu?.collegeEndDate ? formatDate(edu.collegeEndDate) : '';
                                    const collegeName = edu?.collegeName || '';
                                    const subtitle = [collegeName, formattedEndDate].filter(Boolean).join(' - ');
                                    
                                    return (
                                        <EducationCard
                                            key={edu?.id || `edu-${index}`}
                                            title={edu?.courses || edu?.educationLevel || ''}
                                            subtitle={subtitle}
                                            onEditPress={handleEditEducation}
                                            onDeletePress={handleDeleteEducation}
                                        />
                                    );
                                })}
                        </View>
                    </View>
                ) : (
                    <View style={styles.sectionCard}>
                        <SectionHeader
                            title="Education Details"
                            completionPercentage={Math.round(educationPercentage)}
                            onAddPress={handleAddEducation}
                            showAddIcon={true}
                        />
                    </View>
                )}

                {/* Work/Internship Details Section */}
                {workExperienceArray.length > 0 ? (
                    <View style={styles.sectionCard}>
                        <SectionHeader
                            title="Work/Internship Details"
                            completionPercentage={Math.round(workPercentage)}
                            onEditPress={handleEditWorkInternship}
                            showAddIcon={false}
                        />
                        <View style={styles.workExperienceCardContainer}>
                            {workExperienceArray
                                .filter((workExp: any) => workExp !== null && workExp !== undefined)
                                .map((workExp: any, index: number) => (
                                    <WorkExperienceCard
                                        key={workExp?.id || `work-${index}`}
                                        companyName={workExp?.companyName || ''}
                                        designation={workExp?.designation || ''}
                                        employmentType={workExp?.empType || ''}
                                        dateRange={formatDateRange(workExp)}
                                        onEditPress={handleEditWorkInternship}
                                        onDeletePress={() => console.log('Delete work experience:', workExp?.id)}
                                    />
                                ))}
                        </View>
                    </View>
                ) : (
                    <View style={styles.sectionCard}>
                        <SectionHeader
                            title="Work/Internship Details"
                            completionPercentage={Math.round(workPercentage)}
                            onAddPress={handleAddWorkInternship}
                            showAddIcon={true}
                        />
                    </View>
                )}

                {/* Technical Competencies Section */}
                {skills.length > 0 ? (
                    <View style={styles.sectionCard}>
                        <SectionHeader
                            title="Technical Competencies"
                            completionPercentage={Math.round(skillPercentage)}
                            onEditPress={handleEditTechnicalCompetencies}
                            showAddIcon={false}
                        />
                        <View style={styles.skillsContainer}>
                            {skills
                                .filter((skill: any) => skill && skill.skill && skill.skill !== '')
                                .map((skill: { skill?: string; isHighlighted?: boolean }, index: number) => (
                                    <SkillTag
                                        key={`skill-${index}`}
                                        skill={skill?.skill || ''}
                                        isHighlighted={skill?.isHighlighted || false}
                                    />
                                ))}
                        </View>
                    </View>
                ) : (
                    <View style={styles.sectionCard}>
                        <SectionHeader
                            title="Technical Competencies"
                            completionPercentage={Math.round(skillPercentage)}
                            onAddPress={handleAddTechnicalCompetencies}
                            showAddIcon={true}
                        />
                    </View>
                )}

                {/* Certificates Section */}
                {certificatesArray.length > 0 ? (
                    <View style={styles.sectionCard}>
                        <SectionHeader
                            title="Certificates"
                            completionPercentage={Math.round(certificatePercentage)}
                            onEditPress={handleEditCertificates}
                            showAddIcon={false}
                        />
                        <View style={styles.certificateCardContainer}>
                            {certificatesArray
                                .filter((cert: any) => cert !== null && cert !== undefined)
                                .map((cert: any, index: number) => {
                                    // Format date from "YYYY-MM-DD" or "YYYY-MM" to "MMM YYYY" - Safe with null checks
                                    let formattedDate = '';
                                    const dateStr = cert?.certDate || cert?.completedOn || cert?.issueDate || cert?.completedOnDate;
                                    if (dateStr && typeof dateStr === 'string') {
                                        try {
                                            const parts = dateStr.split('-');
                                            if (parts.length >= 2) {
                                                const year = parts[0];
                                                const month = parts[1];
                                                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                                                                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                                const monthIndex = parseInt(month) - 1;
                                                formattedDate = `${monthNames[monthIndex >= 0 && monthIndex < 12 ? monthIndex : 0] || ''} ${year}`;
                                            } else {
                                                formattedDate = dateStr;
                                            }
                                        } catch (error) {
                                            formattedDate = dateStr;
                                        }
                                    }
                                    
                                    return (
                                        <CertificateCard
                                            key={cert?.id || `cert-${index}`}
                                            certificateName={cert?.certCourseName || cert?.courseName || cert?.certificateName || cert?.name || ''}
                                            issuingOrganization={cert?.certProvider || cert?.issuingOrganisation || cert?.issuingOrganization || cert?.organization || ''}
                                            issueDate={formattedDate}
                                            onEditPress={handleEditCertificates}
                                            onDeletePress={() => console.log('Delete certificate:', cert?.id)}
                                        />
                                    );
                                })}
                        </View>
                    </View>
                ) : (
                    <View style={styles.sectionCard}>
                        <SectionHeader
                            title="Certificates"
                            completionPercentage={Math.round(certificatePercentage)}
                            onAddPress={handleAddCertificates}
                            showAddIcon={true}
                        />
                    </View>
                )}
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
        alignItems: 'center',
        gap: 16,
        paddingHorizontal: 16,
        paddingTop: 0,
        paddingBottom: 0,
    },
    userInfoContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
        justifyContent: 'center',
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
        alignSelf: 'stretch',
    },
    fieldsContainer: {
        flexDirection: 'column',
        gap: 24,
        width: '100%',
        alignSelf: 'stretch',
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
        gap: 16,
    },
    workExperienceCardContainer: {
        width: '100%',
        gap: 16,
    },
    certificateCardContainer: {
        width: '100%',
        gap: 16,
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

