import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, borderRadius } from '../../styles/theme';
import Header from '../home/components/Header';
import BreadcrumbBar from '../assessments/components/BreadcrumbBar';
import DropdownField from '../../components/SignUp/DropdownField';
import TextInputField from '../../components/SignUp/TextInputField';
import TextAreaWithFloatingLabel from './components/TextAreaWithFloatingLabel';
import EditableSkillTag from './components/EditableSkillTag';
import { RootStackParamList } from '../../navigation/AppNavigator';
import useProfileStore from '../../store/useProfileStore';
import ProfileService from '../../api/profile';

/**
 * EditCertificatesScreen Component
 * Displays the edit form for Certificates section
 *
 * This screen appears when the Edit/Add button is clicked on the
 * Certificates card in the Profile screen.
 *
 * Form Fields (per Figma design):
 * - courseName: Certificate/Course name
 * - issuingOrganisation: Issuing organization name
 * - certificateUrl: Certificate URL
 * - completedMonth: Completion month
 * - completedYear: Completion year
 * - responsibilities: Responsibilities/description (textarea, max 500 chars)
 * - skillsAcquired: Selected skills (tags with remove functionality)
 */

type NavigationProp = StackNavigationProp<RootStackParamList>;

const EditCertificatesScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { profileData, profileDetails, initializeHome, skills: skillsFromStore } = useProfileStore();
    const [saving, setSaving] = useState(false);
    const [allSkillsOptions, setAllSkillsOptions] = useState<string[]>([]);

    // Extract existing certificate data from store
    const userData = profileDetails || profileData || {};
    // certificate is an array, get the first entry or empty object
    const certificateArray = Array.isArray(userData.certificate) ? userData.certificate : [];
    const certificateData = certificateArray.length > 0 ? certificateArray[0] : {};

    // Helper function to parse date from "YYYY-MM-DD" or "YYYY-MM" format
    const parseDate = (dateStr: string) => {
        if (!dateStr) return { month: '', year: '' };
        // Handle both "YYYY-MM-DD" and "YYYY-MM" formats
        const parts = dateStr.split('-');
        if (parts.length < 2) return { month: '', year: '' };
        const year = parts[0];
        const month = parts[1];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        return { month: monthNames[parseInt(month) - 1] || '', year: year || '' };
    };

    // Parse certDate from API response (format: "YYYY-MM-DD")
    const completedDateParsed = certificateData.certDate ? parseDate(certificateData.certDate) : { month: '', year: '' };

    // Extract skillsAcquired array and convert to skill names array
    const skillsFromAPI = Array.isArray(certificateData.skillsAcquired) 
        ? certificateData.skillsAcquired.map((skill: any) => skill.skillName || skill.skill || '')
        : [];

    // Form state - initialized from store data (using API field names)
    const [courseName, setCourseName] = useState(certificateData.certCourseName || '');
    const [issuingOrganisation, setIssuingOrganisation] = useState(certificateData.certProvider || '');
    const [certificateUrl, setCertificateUrl] = useState(certificateData.certUrl || '');
    const [completedMonth, setCompletedMonth] = useState(completedDateParsed.month);
    const [completedYear, setCompletedYear] = useState(completedDateParsed.year);
    const [responsibilities, setResponsibilities] = useState(''); // Not in API response, keeping for form compatibility
    const [skillsAcquired, setSkillsAcquired] = useState<string[]>(skillsFromAPI);

    // Dropdown options
    const monthOptions = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const yearOptions = Array.from({ length: 30 }, (_, i) => String(2024 - i));

    // Fetch skills from API if not in store
    useEffect(() => {
        const fetchSkills = async () => {
            if (skillsFromStore && skillsFromStore.length > 0) {
                // Use skills from store
                const skillNames = skillsFromStore.map(skill => skill.skillName);
                setAllSkillsOptions(skillNames);
            } else {
                // Fetch from API if not in store
                try {
                    const profileDataResponse = await ProfileService.fetchProfileData();
                    if (Array.isArray(profileDataResponse.skills) && profileDataResponse.skills.length > 0) {
                        const skillNames = profileDataResponse.skills.map((skill: any) => skill.skillName);
                        setAllSkillsOptions(skillNames);
                    }
                } catch (error) {
                    console.error('Failed to fetch skills:', error);
                }
            }
        };
        fetchSkills();
    }, [skillsFromStore]);

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    const handleSaveChanges = async () => {
        setSaving(true);
        try {
            // Helper function to convert month name to number (01-12)
            const monthNameToNumber = (monthName: string): string => {
                const months: { [key: string]: string } = {
                    'January': '01', 'February': '02', 'March': '03', 'April': '04',
                    'May': '05', 'June': '06', 'July': '07', 'August': '08',
                    'September': '09', 'October': '10', 'November': '11', 'December': '12'
                };
                return months[monthName] || '01';
            };

            // Format completed date as "YYYY-MM-DD" (API expects full date)
            const day = '01'; // Default to first day of month
            const formattedCompletedDate = completedYear && completedMonth 
                ? `${completedYear}-${monthNameToNumber(completedMonth)}-${day}`
                : '';

            // Map skillsAcquired to format with skillId and skillName
            // Only include skills that have a valid skillId (greater than 0)
            const skillsAcquiredFormatted = skillsAcquired
                .map((skillName) => {
                    // Find matching skill from store to get skillId
                    const matchingSkill = skillsFromStore?.find(skill => skill.skillName === skillName);
                    const skillId = matchingSkill?.skillId;
                    
                    // Only include if we have a valid skillId
                    if (skillId && skillId > 0) {
                        return {
                            skillId: skillId,
                            skillName: skillName,
                        };
                    }
                    return null;
                })
                .filter((skill): skill is { skillId: number; skillName: string } => skill !== null);

            // Prepare certificate array in API format (using correct field names)
            // Preserve existing id if updating, otherwise create new entry
            const existingId = certificateData.id || undefined;
            
            // Map skillsAcquired to format with skillId and skillName
            // Only include skills that have a valid skillId (greater than 0)
            const validSkillsAcquired = skillsAcquiredFormatted
                .filter((skill: any) => skill && typeof skill.skillId === 'number' && skill.skillId > 0 && skill.skillName && skill.skillName.trim());
            
            const certificate = [{
                ...(existingId && { id: existingId }), // Include id if updating existing entry
                certCourseName: courseName || '',
                certProvider: issuingOrganisation || '',
                certUrl: certificateUrl || null, // Use null instead of empty string
                certDate: formattedCompletedDate || null, // Use null instead of empty string
                skillsAcquired: validSkillsAcquired.length > 0 ? validSkillsAcquired : [],
            }];

            // Prepare payload for PUT /api/student/user-profile
            const profileUpdateData = {
                certificate: certificate,
            };

            console.log('Saving certificate details:', JSON.stringify(profileUpdateData, null, 2));

            // Call API to update certificate details
            // Get existing profile data to merge with update
            const existingData = profileDetails || profileData || {};
            
            await ProfileService.updateProfileDetails(profileUpdateData, existingData);

            // Refresh profile data after successful update
            await initializeHome();

            Alert.alert('Success', 'Certificate details updated successfully');
            navigation.goBack();
        } catch (error: any) {
            console.error('Failed to save certificate details:', error);
            Alert.alert('Error', error?.message || 'Failed to update certificate details. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDiscardChanges = () => {
        navigation.goBack();
    };

    const handleAddSkill = (skill: string) => {
        if (!skillsAcquired.includes(skill)) {
            setSkillsAcquired([...skillsAcquired, skill]);
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkillsAcquired(skillsAcquired.filter(skill => skill !== skillToRemove));
    };

    // Available skills for dropdown (exclude already selected ones)
    const availableSkillsOptions = allSkillsOptions.filter(skill => !skillsAcquired.includes(skill));

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Header onProfilePress={handleProfilePress} onLogoPress={() => navigation.navigate('Home')} />

            {/* Breadcrumb Bar */}
            <BreadcrumbBar items={['Your Profile', 'Edit Certificates']} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Form Card - matches Figma: padding 16px horizontal, 32px vertical, gap 32px between sections */}
                <View style={styles.formCard}>
                    {/* Title - matches Figma: 18px Bold, primaryDarkBlue */}
                    <Text style={styles.title}>Certifications</Text>

                    {/* Form Fields Container - matches Figma spacing */}
                    <View style={styles.formFieldsContainer}>
                        {/* Course Name - full width, 24px gap below */}
                        <View style={styles.fieldRow}>
                            <TextInputField
                                value={courseName}
                                onChangeText={setCourseName}
                                placeholder="Course Name*"
                            />
                        </View>

                        {/* Issuing Organisation - full width, 24px gap below */}
                        <View style={styles.fieldRow}>
                            <TextInputField
                                value={issuingOrganisation}
                                onChangeText={setIssuingOrganisation}
                                placeholder="Issuing Organisation*"
                            />
                        </View>

                        {/* Certificate URL - full width, 24px gap below */}
                        <View style={styles.fieldRow}>
                            <TextInputField
                                value={certificateUrl}
                                onChangeText={setCertificateUrl}
                                placeholder="Certificate URL"
                            />
                        </View>

                        {/* Completed On Date Section - matches Figma: label 14px SemiBold, primaryDarkBlue, gap 12px below */}
                        <View style={styles.dateSection}>
                            <Text style={styles.dateSectionLabel}>Completed On Date</Text>
                            <View style={styles.dateFields}>
                                {/* Month and Year side by side with 16px gap */}
                                <View style={styles.dateField}>
                                    <DropdownField
                                        value={completedMonth}
                                        onValueChange={setCompletedMonth}
                                        placeholder="Select Month*"
                                        options={monthOptions}
                                    />
                                </View>
                                <View style={styles.dateField}>
                                    <DropdownField
                                        value={completedYear}
                                        onValueChange={setCompletedYear}
                                        placeholder="Select Year*"
                                        options={yearOptions}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Your Responsibilities - full width, 24px gap below */}
                        <View style={styles.fieldRow}>
                            <TextAreaWithFloatingLabel
                                value={responsibilities}
                                onChangeText={setResponsibilities}
                                placeholder="Your Responsibilities*"
                                maxLength={500}
                            />
                        </View>

                        {/* Skills Acquired Section - matches Figma: label 14px SemiBold, primaryDarkBlue, gap 12px below */}
                        <View style={styles.skillsSection}>
                            <Text style={styles.skillsSectionLabel}>Skills Acquired</Text>
                            <View style={styles.skillsContainer}>
                                {/* Skills dropdown - full width, 16px gap below */}
                                <View style={styles.skillsDropdown}>
                                    {availableSkillsOptions.length > 0 ? (
                                        <DropdownField
                                            value=""
                                            onValueChange={handleAddSkill}
                                            placeholder="Select Your Skills*"
                                            options={availableSkillsOptions}
                                        />
                                    ) : (
                                        <View style={styles.skillsDropdownDisabled}>
                                            <Text style={styles.skillsDropdownDisabledText}>All skills selected</Text>
                                        </View>
                                    )}
                                </View>
                                {/* Selected skills tags - 16px gap from dropdown, 12px gap between tags */}
                                {skillsAcquired.length > 0 && (
                                    <View style={styles.skillsTagsContainer}>
                                        {skillsAcquired.map((skill, index) => (
                                            <EditableSkillTag
                                                key={index}
                                                skill={skill}
                                                onRemove={() => handleRemoveSkill(skill)}
                                                isHighlighted={index >= 2} // First 2 use light blue, rest use darker blue (per Figma)
                                            />
                                        ))}
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Bottom Buttons - matches Figma: gap 24px between buttons, 32px gap from form */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                            onPress={handleSaveChanges}
                            activeOpacity={0.7}
                            disabled={saving}
                        >
                            <Text style={styles.saveButtonText}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.discardButton}
                            onPress={handleDiscardChanges}
                            activeOpacity={0.7}
                            disabled={saving}
                        >
                            <Text style={styles.discardButtonText}>Discard Changes</Text>
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
        paddingBottom: 32,
    },
    formCard: {
        backgroundColor: colors.white,
        paddingHorizontal: 16, // Figma: px-[16px]
        paddingVertical: 32, // Figma: py-[32px]
        gap: 32, // Figma: gap-[32px] between main sections (title to form, form to buttons)
    },
    title: {
        ...typography.p2Bold, // Figma: Desktop/P2 Bold, 18px, line-height 25px, weight 700
        color: colors.primaryDarkBlue, // Figma: text-[color:var(--primary-dark-blue,#00213d)]
    },
    formFieldsContainer: {
        width: '100%',
        gap: 24, // Figma: gap-[24px] between form fields
    },
    fieldRow: {
        width: '100%',
    },
    // Completed On Date Section
    dateSection: {
        width: '100%',
        gap: 12, // Figma: gap-[12px] between label and fields
    },
    dateSectionLabel: {
        ...typography.p4SemiBold, // Figma: Desktop/P4 SemiBold, 14px, line-height 20px, weight 600
        color: colors.primaryDarkBlue, // Figma: text-[color:var(--primary-dark-blue,#00213d)]
    },
    dateFields: {
        flexDirection: 'row',
        gap: 16, // Figma: gap-[16px] between Month and Year
        width: '100%',
    },
    dateField: {
        flex: 1,
        minWidth: 0, // Allow flex shrinking
    },
    // Skills Acquired Section
    skillsSection: {
        width: '100%',
        gap: 12, // Figma: gap-[12px] between label and container
    },
    skillsSectionLabel: {
        ...typography.p4SemiBold, // Figma: Desktop/P4 SemiBold, 14px, line-height 20px, weight 600
        color: colors.primaryDarkBlue, // Figma: text-[color:var(--primary-dark-blue,#00213d)]
    },
    skillsContainer: {
        width: '100%',
        gap: 16, // Figma: gap-[16px] between dropdown and tags
    },
    skillsDropdown: {
        width: '100%',
    },
    skillsDropdownDisabled: {
        backgroundColor: '#ededed', // Disabled background
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.input,
        paddingHorizontal: 20,
        paddingVertical: 12,
        minHeight: 48,
        justifyContent: 'center',
    },
    skillsDropdownDisabledText: {
        ...typography.p4,
        color: colors.placeholderGrey,
    },
    skillsTagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12, // Figma: gap-[12px_8px] - 12px vertical, 8px horizontal (we'll use 12px for both)
        rowGap: 8, // Horizontal gap between items in row
    },
    // Bottom Buttons
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24, // Figma: gap-[24px] between buttons
        width: '100%',
    },
    saveButton: {
        backgroundColor: colors.primaryBlue, // Figma: bg-[var(--primary-blue,#0b6aea)]
        borderRadius: borderRadius.input, // Figma: rounded-[8px]
        paddingHorizontal: 24, // Figma: px-[24px]
        paddingVertical: 12, // Figma: py-[12px]
        minWidth: 140, // Figma: min-w-[140px]
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonText: {
        ...typography.p4SemiBold, // Figma: Desktop/P4 SemiBold, 14px, line-height 20px, weight 600
        color: colors.white, // Figma: text-[color:var(--white,white)]
        textAlign: 'center',
    },
    discardButton: {
        paddingHorizontal: 0, // No padding, just text
        paddingVertical: 12, // Match save button vertical padding
    },
    discardButtonText: {
        ...typography.p4SemiBold, // Figma: Desktop/P4 SemiBold, 14px, line-height 20px, weight 600
        color: colors.primaryBlue, // Figma: text-[color:var(--primary-blue,#0b6aea)]
    },
});

export default EditCertificatesScreen;

