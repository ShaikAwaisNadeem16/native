import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, borderRadius } from '../../styles/theme';
import Header from '../home/components/Header';
import BreadcrumbBar from '../assessments/components/BreadcrumbBar';
import DropdownField from '../../components/SignUp/DropdownField';
import { RootStackParamList } from '../../navigation/AppNavigator';
import useProfileStore from '../../store/useProfileStore';
import ProfileService from '../../api/profile';

/**
 * EditEducationDetailsScreen Component
 * Displays the edit form for Education Details section
 *
 * This screen appears when the Edit button is clicked on the
 * Education Details card in the Profile screen.
 *
 * Form Fields (per Figma design):
 * - education: Education level (10th, 12th, etc.)
 * - board: Board name (Mumbai, etc.)
 * - schoolMedium: School medium (English, etc.)
 * - gradingSystem: Grading system
 * - passingMonth: Passing out month
 * - passingYear: Passing out year
 */

type NavigationProp = StackNavigationProp<RootStackParamList>;

const EditEducationDetailsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { profileData, profileDetails, initializeHome, branches: branchesFromStore, diplomaBranches: diplomaBranchesFromStore } = useProfileStore();
    const [saving, setSaving] = useState(false);
    const [branchOptions, setBranchOptions] = useState<string[]>([]);

    // Extract existing education data from store
    const userData = profileDetails || profileData || {};
    // educationalDetails is an array, get the first entry or empty object
    const educationalDetailsArray = Array.isArray(userData.educationalDetails) ? userData.educationalDetails : [];
    const educationData = educationalDetailsArray.length > 0 ? educationalDetailsArray[0] : {};
    
    // Helper function to parse date from "YYYY-MM" format
    const parseDate = (dateStr: string) => {
        if (!dateStr || dateStr.length !== 7) return { month: '', year: '' };
        const [year, month] = dateStr.split('-');
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        return { month: monthNames[parseInt(month) - 1] || '', year: year || '' };
    };

    // Parse collegeStartDate and collegeEndDate from API response
    const startDateParsed = educationData.collegeStartDate ? parseDate(educationData.collegeStartDate) : { month: '', year: '' };
    const endDateParsed = educationData.collegeEndDate ? parseDate(educationData.collegeEndDate) : { month: '', year: '' };

    // Form state - initialized from store data
    // Map API fields to form fields (keeping form field names for UI compatibility)
    const [education, setEducation] = useState(educationData.educationLevel || educationData.courses || '');
    const [board, setBoard] = useState(educationData.collegeName || '');
    const [schoolMedium, setSchoolMedium] = useState(educationData.schoolMedium || '');
    const [gradingSystem, setGradingSystem] = useState(educationData.gradingSystem || '');
    const [specialization, setSpecialization] = useState(educationData.specialization?.branch || '');
    const [passingMonth, setPassingMonth] = useState(endDateParsed.month);
    const [passingYear, setPassingYear] = useState(endDateParsed.year);

    // Fetch branches from API if not in store, and update branch options based on education level
    useEffect(() => {
        const fetchBranches = async () => {
            let branches = branchesFromStore;
            let diplomaBranches = diplomaBranchesFromStore;

            if (!branches || !diplomaBranches) {
                try {
                    const profileDataResponse = await ProfileService.fetchProfileData();
                    branches = Array.isArray(profileDataResponse.branches) ? profileDataResponse.branches : null;
                    diplomaBranches = Array.isArray(profileDataResponse.diplomaBranches) ? profileDataResponse.diplomaBranches : null;
                } catch (error) {
                    console.error('Failed to fetch branches:', error);
                }
            }

            // Update branch options based on education level
            if (education === 'Diploma' && diplomaBranches) {
                const branchNames = diplomaBranches.map((branch: any) => branch.branch);
                setBranchOptions(branchNames);
            } else if ((education === 'Graduation' || education === 'Post Graduation') && branches) {
                const branchNames = branches.map((branch: any) => branch.branch);
                setBranchOptions(branchNames);
            } else {
                setBranchOptions([]);
            }
        };
        fetchBranches();
    }, [education, branchesFromStore, diplomaBranchesFromStore]);

    // Dropdown options
    const educationOptions = ['10th', '12th', 'Diploma', 'Graduation', 'Post Graduation', 'PhD'];
    const boardOptions = ['Mumbai', 'CBSE', 'ICSE', 'State Board', 'Maharashtra Board', 'Mumbai University', 'Pune University', 'Other'];
    const schoolMediumOptions = ['English', 'Hindi', 'Marathi', 'Gujarati', 'Kannada', 'Tamil', 'Telugu', 'Other'];
    const gradingSystemOptions = ['Percentage', 'CGPA (out of 10)', 'CGPA (out of 4)', 'Grade', 'Other'];
    const monthOptions = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const yearOptions = Array.from({ length: 30 }, (_, i) => String(2024 - i));

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

            // Format end date as "YYYY-MM"
            const formattedEndDate = passingYear && passingMonth 
                ? `${passingYear}-${monthNameToNumber(passingMonth)}`
                : '';

            // Find branchId for selected specialization
            let branchId = '';
            if (specialization) {
                if (education === 'Diploma' && diplomaBranchesFromStore) {
                    const foundBranch = diplomaBranchesFromStore.find((b: any) => b.branch === specialization);
                    branchId = foundBranch?.branchId?.toString() || '';
                } else if ((education === 'Graduation' || education === 'Post Graduation') && branchesFromStore) {
                    const foundBranch = branchesFromStore.find((b: any) => b.branch === specialization);
                    branchId = foundBranch?.branchId?.toString() || '';
                }
            }

            // Prepare educationalDetails array in API format
            const educationalDetails = [{
                courses: education || '',
                educationLevel: education || '',
                collegeName: board || '',
                collegeEndDate: formattedEndDate,
                collegeStartDate: '', // Start date not in current form - can be added later
                specialization: specialization ? {
                    branch: specialization,
                    branchId: branchId || educationData.specialization?.branchId || '',
                } : educationData.specialization || undefined,
            }];

            // Prepare payload for PUT /api/student/user-profile
            const profileUpdateData = {
                educationalDetails: educationalDetails,
            };

            console.log('Saving education details:', JSON.stringify(profileUpdateData, null, 2));

            // Call API to update education details
            await ProfileService.updateProfileDetails(profileUpdateData);

            // Refresh profile data after successful update
            await initializeHome();

            Alert.alert('Success', 'Education details updated successfully');
            navigation.goBack();
        } catch (error: any) {
            console.error('Failed to save education details:', error);
            Alert.alert('Error', error?.message || 'Failed to update education details. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDiscardChanges = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Header onProfilePress={handleProfilePress} onLogoPress={() => navigation.navigate('Home')} />

            {/* Breadcrumb Bar */}
            <BreadcrumbBar items={['Your Profile', 'Edit Education Details']} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Form Card - matches Figma: padding 16px horizontal, 32px vertical, gap 32px between sections */}
                <View style={styles.formCard}>
                    {/* Title - matches Figma: 18px Bold, black, gap 32px below */}
                    <Text style={styles.title}>Educational Details</Text>

                    {/* Form Fields Container - matches Figma spacing */}
                    <View style={styles.formFieldsContainer}>
                        {/* First Row: Education and Board - side by side with 32px gap */}
                        <View style={styles.firstRow}>
                            <View style={styles.firstRowField}>
                                <DropdownField
                                    value={education}
                                    onValueChange={setEducation}
                                    placeholder="Education*"
                                    options={educationOptions}
                                />
                            </View>
                            <View style={styles.firstRowField}>
                                <DropdownField
                                    value={board}
                                    onValueChange={setBoard}
                                    placeholder="Board*"
                                    options={boardOptions}
                                />
                            </View>
                        </View>

                        {/* Second Row: School Medium - full width, 32px gap from first row */}
                        <View style={styles.secondRow}>
                            <DropdownField
                                value={schoolMedium}
                                onValueChange={setSchoolMedium}
                                placeholder="School Medium*"
                                options={schoolMediumOptions}
                            />
                        </View>

                        {/* Third Row: Grading System - full width, 28px gap from School Medium */}
                        <View style={styles.thirdRow}>
                            <DropdownField
                                value={gradingSystem}
                                onValueChange={setGradingSystem}
                                placeholder="Grading System*"
                                options={gradingSystemOptions}
                            />
                        </View>

                        {/* Fourth Row: Specialization/Branch - full width, 28px gap from Grading System (only show for Diploma, Graduation, Post Graduation) */}
                        {(education === 'Diploma' || education === 'Graduation' || education === 'Post Graduation') && branchOptions.length > 0 && (
                            <View style={styles.fourthRow}>
                                <DropdownField
                                    value={specialization}
                                    onValueChange={setSpecialization}
                                    placeholder="Specialization/Branch*"
                                    options={branchOptions}
                                />
                            </View>
                        )}

                        {/* Passing Out Date Section - matches Figma: label 14px SemiBold, primaryDarkBlue, gap 12px below */}
                        <View style={styles.passingOutDateSection}>
                            <Text style={styles.passingOutDateLabel}>Passing Out Date</Text>
                            <View style={styles.passingOutDateFields}>
                                {/* Month and Year side by side with 16px gap */}
                                <View style={styles.dateField}>
                                    <DropdownField
                                        value={passingMonth}
                                        onValueChange={setPassingMonth}
                                        placeholder="Select Month*"
                                        options={monthOptions}
                                    />
                                </View>
                                <View style={styles.dateField}>
                                    <DropdownField
                                        value={passingYear}
                                        onValueChange={setPassingYear}
                                        placeholder="Select Year*"
                                        options={yearOptions}
                                    />
                                </View>
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
        color: '#000000', // Figma: text-black
    },
    formFieldsContainer: {
        width: '100%',
        gap: 32, // Figma: gap-[32px] between main sections
    },
    // First Row: Education and Board side by side
    firstRow: {
        flexDirection: 'row',
        gap: 32, // Figma: gap-[32px] between Education and Board
        width: '100%',
    },
    firstRowField: {
        flex: 1,
        minWidth: 0, // Allow flex shrinking
    },
    // Second Row: School Medium full width, 32px gap from first row
    secondRow: {
        width: '100%',
    },
    // Third Row: Grading System full width, 28px gap from School Medium (adjusted from 32px)
    thirdRow: {
        width: '100%',
        marginTop: -4, // Adjust to get 28px gap instead of 32px (32px - 4px = 28px)
    },
    // Fourth Row: Specialization/Branch full width, 28px gap from Grading System
    fourthRow: {
        width: '100%',
        marginTop: -4, // Adjust to get 28px gap instead of 32px
    },
    // Passing Out Date Section
    passingOutDateSection: {
        width: '100%',
        gap: 12, // Figma: gap-[12px] between label and fields
    },
    passingOutDateLabel: {
        ...typography.p4SemiBold, // Figma: Desktop/P4 SemiBold, 14px, line-height 20px, weight 600
        color: colors.primaryDarkBlue, // Figma: text-[color:var(--primary-dark-blue,#00213d)]
    },
    passingOutDateFields: {
        flexDirection: 'row',
        gap: 16, // Figma: gap-[16px] between Month and Year
        width: '100%',
    },
    dateField: {
        flex: 1,
        minWidth: 0, // Allow flex shrinking
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

export default EditEducationDetailsScreen;
