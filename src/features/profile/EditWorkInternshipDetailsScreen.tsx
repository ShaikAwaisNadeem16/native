import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, borderRadius } from '../../styles/theme';
import Header from '../home/components/Header';
import BreadcrumbBar from '../assessments/components/BreadcrumbBar';
import DropdownField from '../../components/SignUp/DropdownField';
import TextInputField from '../../components/SignUp/TextInputField';
import Checkbox from '../../components/SignUp/Checkbox';
import TextAreaWithFloatingLabel from './components/TextAreaWithFloatingLabel';
import EditableSkillTag from './components/EditableSkillTag';
import { RootStackParamList } from '../../navigation/AppNavigator';
import useProfileStore from '../../store/useProfileStore';
import ProfileService from '../../api/profile';

/**
 * EditWorkInternshipDetailsScreen Component
 * Displays the edit form for Work / Internship Details section
 *
 * This screen appears when the Edit/Add button is clicked on the
 * Work / Internship Details card in the Profile screen.
 *
 * Form Fields (per Figma design):
 * - companyName: Company/Organization name
 * - employmentType: Employment type (Full-time, Part-time, Internship, etc.)
 * - designation: Job designation/role
 * - currentlyWorking: Currently working checkbox
 * - startMonth: Start date month
 * - startYear: Start date year
 * - endMonth: End date month (disabled when currentlyWorking is true)
 * - endYear: End date year (disabled when currentlyWorking is true)
 * - responsibilities: Job responsibilities (textarea, max 500 chars)
 * - skillsUsed: Selected skills (tags with remove functionality)
 */

type NavigationProp = StackNavigationProp<RootStackParamList>;

const EditWorkInternshipDetailsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { profileData, profileDetails, initializeHome, skills: skillsFromStore } = useProfileStore();
    const [saving, setSaving] = useState(false);
    const [allSkillsOptions, setAllSkillsOptions] = useState<string[]>([]);

    // Extract existing work/internship data from store
    const userData = profileDetails || profileData || {};
    // workExperience is an array, get the first entry or empty object
    const workExperienceArray = Array.isArray(userData.workExperience) ? userData.workExperience : [];
    const workData = workExperienceArray.length > 0 ? workExperienceArray[0] : {};

    // Helper function to convert month name to number (01-12)
    const monthNameToNumber = (monthName: string): string => {
        const months: { [key: string]: string } = {
            'January': '01', 'February': '02', 'March': '03', 'April': '04',
            'May': '05', 'June': '06', 'July': '07', 'August': '08',
            'September': '09', 'October': '10', 'November': '11', 'December': '12'
        };
        return months[monthName] || '01';
    };

    // Helper function to parse date from "YYYY-MM" format
    const parseDate = (dateStr: string) => {
        if (!dateStr || dateStr.length !== 7) return { month: '', year: '' };
        const [year, month] = dateStr.split('-');
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        return { month: monthNames[parseInt(month) - 1] || '', year: year || '' };
    };

    // Parse workStartDate and workEndDate from API response
    const startDateParsed = workData.workStartDate ? parseDate(workData.workStartDate) : { month: '', year: '' };
    const endDateParsed = workData.workEndDate ? parseDate(workData.workEndDate) : { month: '', year: '' };

    // Extract skillsAcquired array and convert to skill names array
    const skillsFromAPI = Array.isArray(workData.skillsAcquired) 
        ? workData.skillsAcquired.map((skill: any) => skill.skillName || skill.skill || '')
        : [];

    // Form state - initialized from store data
    const [companyName, setCompanyName] = useState(workData.companyName || '');
    const [employmentType, setEmploymentType] = useState(workData.empType || '');
    const [designation, setDesignation] = useState(workData.designation || '');
    const [currentlyWorking, setCurrentlyWorking] = useState(workData.isWorking || false);
    const [startMonth, setStartMonth] = useState(startDateParsed.month);
    const [startYear, setStartYear] = useState(startDateParsed.year);
    const [endMonth, setEndMonth] = useState(endDateParsed.month);
    const [endYear, setEndYear] = useState(endDateParsed.year);
    const [responsibilities, setResponsibilities] = useState(workData.jobDesc || '');
    const [skillsUsed, setSkillsUsed] = useState<string[]>(skillsFromAPI);

    // Dropdown options
    const employmentTypeOptions = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance', 'Other'];
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

            // Format start date as "YYYY-MM"
            const formattedStartDate = startYear && startMonth 
                ? `${startYear}-${monthNameToNumber(startMonth)}`
                : '';

            // Format end date as "YYYY-MM" (empty if currently working)
            const formattedEndDate = currentlyWorking || !endYear || !endMonth
                ? ''
                : `${endYear}-${monthNameToNumber(endMonth)}`;

            // Map skills to skillsAcquired format with skillId and skillName
            // Match skill names with skills from store/API to get correct skillId
            const skillsAcquired = skillsUsed.map((skillName) => {
                // Find matching skill from store to get skillId
                const matchingSkill = skillsFromStore?.find(skill => skill.skillName === skillName);
                return {
                    skillId: matchingSkill?.skillId || 0, // Use skillId from API, or 0 if not found
                    skillName: skillName,
                };
            });

            // Prepare workExperience array in API format
            const workExperience = [{
                companyName: companyName,
                empType: employmentType,
                designation: designation,
                workStartDate: formattedStartDate,
                workEndDate: formattedEndDate,
                isWorking: currentlyWorking,
                jobDesc: responsibilities,
                skillsAcquired: skillsAcquired,
            }];

            // Prepare payload for PUT /api/student/user-profile
            const profileUpdateData = {
                workExperience: workExperience,
            };

            console.log('Saving work/internship details:', JSON.stringify(profileUpdateData, null, 2));

            // Call API to update work/internship details
            await ProfileService.updateProfileDetails(profileUpdateData);

            // Refresh profile data after successful update
            await initializeHome();

            Alert.alert('Success', 'Work/Internship details updated successfully');
            navigation.goBack();
        } catch (error: any) {
            console.error('Failed to save work/internship details:', error);
            Alert.alert('Error', error?.message || 'Failed to update work/internship details. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDiscardChanges = () => {
        navigation.goBack();
    };

    const handleAddSkill = (skill: string) => {
        if (!skillsUsed.includes(skill)) {
            setSkillsUsed([...skillsUsed, skill]);
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkillsUsed(skillsUsed.filter(skill => skill !== skillToRemove));
    };

    // Available skills for dropdown (exclude already selected ones)
    const availableSkillsOptions = allSkillsOptions.filter(skill => !skillsUsed.includes(skill));

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Header onProfilePress={handleProfilePress} onLogoPress={() => navigation.navigate('Home')} />

            {/* Breadcrumb Bar */}
            <BreadcrumbBar items={['Your Profile', 'Edit Work/Internship Details']} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Form Card - matches Figma: padding 16px horizontal, 32px vertical, gap 32px between sections */}
                <View style={styles.formCard}>
                    {/* Title - matches Figma: 18px Bold, primaryDarkBlue, gap 32px below */}
                    <Text style={styles.title}>Work/Internship Details</Text>

                    {/* Form Fields Container - matches Figma spacing */}
                    <View style={styles.formFieldsContainer}>
                        {/* Company Name - full width, 24px gap below */}
                        <View style={styles.fieldRow}>
                            <TextInputField
                                value={companyName}
                                onChangeText={setCompanyName}
                                placeholder="Company Name*"
                            />
                        </View>

                        {/* Employment Type and Designation - side by side with 24px gap */}
                        <View style={styles.firstRow}>
                            <View style={styles.firstRowField}>
                                <DropdownField
                                    value={employmentType}
                                    onValueChange={setEmploymentType}
                                    placeholder="Employment Type*"
                                    options={employmentTypeOptions}
                                />
                            </View>
                            <View style={styles.firstRowField}>
                                <TextInputField
                                    value={designation}
                                    onChangeText={setDesignation}
                                    placeholder="Designation*"
                                />
                            </View>
                        </View>

                        {/* Currently Working Checkbox - full width, 24px gap below */}
                        <View style={styles.checkboxRow}>
                            <Checkbox
                                checked={currentlyWorking}
                                onToggle={() => setCurrentlyWorking(!currentlyWorking)}
                                size={16}
                            />
                            <Text style={styles.checkboxLabel}>Currently Working</Text>
                        </View>

                        {/* Start Date Section - matches Figma: label 14px SemiBold, primaryDarkBlue, gap 12px below */}
                        <View style={styles.dateSection}>
                            <Text style={styles.dateSectionLabel}>Start Date</Text>
                            <View style={styles.dateFields}>
                                {/* Month and Year side by side with 16px gap */}
                                <View style={styles.dateField}>
                                    <DropdownField
                                        value={startMonth}
                                        onValueChange={setStartMonth}
                                        placeholder="Select Month*"
                                        options={monthOptions}
                                    />
                                </View>
                                <View style={styles.dateField}>
                                    <DropdownField
                                        value={startYear}
                                        onValueChange={setStartYear}
                                        placeholder="Select Year*"
                                        options={yearOptions}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* End Date Section - disabled when Currently Working is checked */}
                        <View style={styles.dateSection}>
                            <Text style={styles.dateSectionLabel}>End Date</Text>
                            <View style={styles.dateFields}>
                                {/* Month and Year side by side with 16px gap */}
                                <View style={styles.dateField}>
                                    <DropdownField
                                        value={endMonth}
                                        onValueChange={setEndMonth}
                                        placeholder="Select Month*"
                                        options={monthOptions}
                                        disabled={currentlyWorking}
                                    />
                                </View>
                                <View style={styles.dateField}>
                                    <DropdownField
                                        value={endYear}
                                        onValueChange={setEndYear}
                                        placeholder="Select Year*"
                                        options={yearOptions}
                                        disabled={currentlyWorking}
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

                        {/* Skills Used Section - matches Figma: label 14px SemiBold, primaryDarkBlue, gap 12px below */}
                        <View style={styles.skillsSection}>
                            <Text style={styles.skillsSectionLabel}>Skills Used</Text>
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
                                {/* Selected skills tags - 16px gap between tags */}
                                {skillsUsed.length > 0 && (
                                    <View style={styles.skillsTagsContainer}>
                                        {skillsUsed.map((skill, index) => (
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
                            {saving ? (
                                <ActivityIndicator size="small" color={colors.white} />
                            ) : (
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            )}
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
    // First Row: Employment Type and Designation side by side
    firstRow: {
        flexDirection: 'row',
        gap: 24, // Figma: gap-[24px] between Employment Type and Designation
        width: '100%',
    },
    firstRowField: {
        flex: 1,
        minWidth: 0, // Allow flex shrinking
    },
    // Currently Working Checkbox
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // Figma: gap-[8px] between checkbox and label
        width: '100%',
        height: 20, // Figma: h-[20px]
    },
    checkboxLabel: {
        ...typography.p4, // Figma: Desktop/P4 Regular, 14px, line-height 20px
        color: colors.textGrey, // Figma: text-[color:var(--text-grey,#696a6f)]
    },
    // Date Sections (Start Date and End Date)
    dateSection: {
        width: '100%',
        gap: 12, // Figma: gap-[12px] between label and fields
    },
    dateSectionLabel: {
        ...typography.p4SemiBold, // Figma: Desktop/P4 SemiBold, 14px, line-height 20px, weight 600
        color: colors.primaryDarkBlue, // Figma: text-[color:var(--primary-dark-blue,#00213d)]
        height: 23, // Figma: h-[23px]
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
    // Skills Used Section
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

export default EditWorkInternshipDetailsScreen;

