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
import Checkbox from '../../components/SignUp/Checkbox';
import RadioButton from '../../components/SignUp/RadioButton';
import { RootStackParamList } from '../../navigation/AppNavigator';
import useProfileStore from '../../store/useProfileStore';
import ProfileService from '../../api/profile';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const EditEducationDetailsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { profileData, profileDetails, initializeHome, branches: branchesFromStore, diplomaBranches: diplomaBranchesFromStore } = useProfileStore();
    const [saving, setSaving] = useState(false);
    const [branchOptions, setBranchOptions] = useState<string[]>([]);

    // Extract existing education data from store
    const userData = profileDetails || profileData || {};
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

    // Parse dates from API response
    const startDateParsed = educationData.collegeStartDate ? parseDate(educationData.collegeStartDate) : { month: '', year: '' };
    const endDateParsed = educationData.collegeEndDate ? parseDate(educationData.collegeEndDate) : { month: '', year: '' };

    // Form state - matching Figma design
    const [education, setEducation] = useState(educationData.educationLevel || educationData.courses || '');
    const [universityCollege, setUniversityCollege] = useState(educationData.collegeName || '');
    const [course, setCourse] = useState(educationData.courses || '');
    const [specialization, setSpecialization] = useState(educationData.specialization?.branch || '');
    const [startMonth, setStartMonth] = useState(startDateParsed.month);
    const [startYear, setStartYear] = useState(startDateParsed.year);
    const [endMonth, setEndMonth] = useState(endDateParsed.month);
    const [endYear, setEndYear] = useState(endDateParsed.year);
    const [currentlyPursuing, setCurrentlyPursuing] = useState(!educationData.collegeEndDate || educationData.collegeEndDate === '');
    const [gradingSystem, setGradingSystem] = useState(educationData.gradingSystem || '');
    const [aggregateCGPA, setAggregateCGPA] = useState(educationData.grade || educationData.percentage || '');
    const [courseType, setCourseType] = useState<'Full time' | 'Part time' | 'Correspondence/Distance learning'>('Full time');

    // Fetch branches from API if not in store
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
    const courseOptions = ['B.Tech', 'B.E.', 'B.Sc', 'B.Com', 'B.A.', 'M.Tech', 'M.E.', 'M.Sc', 'M.Com', 'M.A.', 'MBA', 'Other'];
    const gradingSystemOptions = ['CGPA', 'Percentage', 'Grade'];
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

            // Format start date as "YYYY-MM"
            const formattedStartDate = startYear && startMonth 
                ? `${startYear}-${monthNameToNumber(startMonth)}`
                : null;

            // Format end date as "YYYY-MM" (null if currently pursuing)
            const formattedEndDate = currentlyPursuing || !endYear || !endMonth
                ? null
                : `${endYear}-${monthNameToNumber(endMonth)}`;

            // Find branchId for selected specialization
            let branchId: number | null = null;
            if (specialization) {
                if (education === 'Diploma' && diplomaBranchesFromStore) {
                    const foundBranch = diplomaBranchesFromStore.find((b: any) => b.branch === specialization);
                    branchId = foundBranch?.branchId ? Number(foundBranch.branchId) : null;
                } else if ((education === 'Graduation' || education === 'Post Graduation') && branchesFromStore) {
                    const foundBranch = branchesFromStore.find((b: any) => b.branch === specialization);
                    branchId = foundBranch?.branchId ? Number(foundBranch.branchId) : null;
                }
            }

            // Prepare educationalDetails array in API format
            const existingId = educationData.id || undefined;
            
            // Handle specialization - only include if we have both branch and branchId
            let specializationObj: any = null;
            if (specialization && branchId !== null && branchId > 0) {
                specializationObj = {
                    branch: specialization,
                    branchId: branchId,
                };
            } else if (educationData.specialization && 
                      educationData.specialization.branch && 
                      educationData.specialization.branchId) {
                const existingBranchId = Number(educationData.specialization.branchId);
                if (existingBranchId > 0) {
                    specializationObj = {
                        branch: educationData.specialization.branch,
                        branchId: existingBranchId,
                    };
                }
            }

            // Map grading system and CGPA/percentage
            let grade: string | null = null;
            let percentage: number | null = null;
            if (gradingSystem === 'CGPA' && aggregateCGPA) {
                grade = aggregateCGPA;
            } else if (gradingSystem === 'Percentage' && aggregateCGPA) {
                percentage = parseFloat(aggregateCGPA) || null;
            } else if (gradingSystem === 'Grade' && aggregateCGPA) {
                grade = aggregateCGPA;
            }
            
            const educationalDetails = [{
                ...(existingId && { id: existingId }),
                courses: course || education || '',
                educationLevel: education || '',
                collegeName: universityCollege || '',
                collegeStartDate: formattedStartDate,
                collegeEndDate: formattedEndDate,
                schoolMedium: null, // Not in new design
                gradingSystem: gradingSystem || null,
                grade: grade,
                percentage: percentage,
                ...(specializationObj && { specialization: specializationObj }),
            }];

            // Prepare payload for PUT /api/student/user-profile
            const profileUpdateData = {
                educationalDetails: educationalDetails,
            };

            // Validate required fields
            if (!education || !universityCollege) {
                Alert.alert('Error', 'Please fill in all required fields (Education and University/College)');
                setSaving(false);
                return;
            }

            console.log('[EditEducationDetailsScreen] Saving education details payload:', JSON.stringify(profileUpdateData, null, 2));

            // Call API to update education details
            const existingData = profileDetails || profileData || {};
            await ProfileService.updateProfileDetails(profileUpdateData, existingData);

            // Refresh profile data after successful update
            await initializeHome();

            Alert.alert('Success', 'Education details updated successfully');
            navigation.goBack();
        } catch (error: any) {
            console.error('[EditEducationDetailsScreen] Failed to save education details:', error);
            console.error('[EditEducationDetailsScreen] Error response:', error?.response?.data);
            console.error('[EditEducationDetailsScreen] Error status:', error?.response?.status);
            const errorMessage = error?.response?.data?.message || 
                                error?.response?.data?.error || 
                                error?.message || 
                                'Failed to update education details. Please try again.';
            Alert.alert('Error', errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleDiscardChanges = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header onProfilePress={handleProfilePress} onLogoPress={() => navigation.navigate('Home')} />
            <BreadcrumbBar items={['Your Profile', 'Edit Education Details']} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.formCard}>
                    {/* Title - Figma: 18px Bold, primaryDarkBlue */}
                    <Text style={styles.title}>Educational Details</Text>

                    {/* Form Fields Container - gap 28px between rows */}
                    <View style={styles.formFieldsContainer}>
                        {/* Row 1: Education | University/College */}
                        <View style={styles.row}>
                            <View style={styles.rowField}>
                                <DropdownField
                                    value={education}
                                    onValueChange={setEducation}
                                    placeholder="Education"
                                    options={educationOptions}
                                />
                            </View>
                            <View style={styles.rowField}>
                                <TextInputField
                                    value={universityCollege}
                                    onChangeText={setUniversityCollege}
                                    placeholder="University/College"
                                />
                            </View>
                        </View>

                        {/* Row 2: Course | Specialisation */}
                        <View style={styles.row}>
                            <View style={styles.rowField}>
                                <DropdownField
                                    value={course}
                                    onValueChange={setCourse}
                                    placeholder="Course"
                                    options={courseOptions}
                                />
                            </View>
                            <View style={styles.rowField}>
                                {(education === 'Diploma' || education === 'Graduation' || education === 'Post Graduation') && branchOptions.length > 0 ? (
                                    <DropdownField
                                        value={specialization}
                                        onValueChange={setSpecialization}
                                        placeholder="Specialisation"
                                        options={branchOptions}
                                    />
                                ) : (
                                    <View style={styles.disabledField}>
                                        <Text style={styles.disabledText}>Specialisation</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Row 3: Start Date | End Date + Currently Pursuing */}
                        <View style={styles.row}>
                            <View style={styles.rowField}>
                                <View style={styles.dateSection}>
                                    <Text style={styles.dateLabel}>Start Date</Text>
                                    <View style={styles.dateFields}>
                                        <View style={styles.dateField}>
                                            <DropdownField
                                                value={startMonth}
                                                onValueChange={setStartMonth}
                                                placeholder="Select Month"
                                                options={monthOptions}
                                            />
                                        </View>
                                        <View style={styles.dateField}>
                                            <DropdownField
                                                value={startYear}
                                                onValueChange={setStartYear}
                                                placeholder="Select Year"
                                                options={yearOptions}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.rowField}>
                                <View style={styles.dateSection}>
                                    <Text style={styles.dateLabel}>End Date</Text>
                                    <View style={styles.dateFields}>
                                        <View style={styles.dateField}>
                                            <DropdownField
                                                value={endMonth}
                                                onValueChange={setEndMonth}
                                                placeholder="Select Month"
                                                options={monthOptions}
                                                disabled={currentlyPursuing}
                                            />
                                        </View>
                                        <View style={styles.dateField}>
                                            <DropdownField
                                                value={endYear}
                                                onValueChange={setEndYear}
                                                placeholder="Select Year"
                                                options={yearOptions}
                                                disabled={currentlyPursuing}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.checkboxContainer}>
                                        <Checkbox
                                            checked={currentlyPursuing}
                                            onToggle={() => setCurrentlyPursuing(!currentlyPursuing)}
                                            size={16}
                                        />
                                        <Text style={styles.checkboxLabel}>Currently Pursuing</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Row 4: Grading System | Aggregate CGPA */}
                        <View style={styles.row}>
                            <View style={styles.rowField}>
                                <DropdownField
                                    value={gradingSystem}
                                    onValueChange={setGradingSystem}
                                    placeholder="Grading System"
                                    options={gradingSystemOptions}
                                />
                            </View>
                            <View style={styles.rowField}>
                                <TextInputField
                                    value={aggregateCGPA}
                                    onChangeText={setAggregateCGPA}
                                    placeholder="Aggregate CGPA"
                                    disabled={!gradingSystem}
                                />
                            </View>
                        </View>

                        {/* Course Type Section */}
                        <View style={styles.courseTypeSection}>
                            <Text style={styles.courseTypeLabel}>Course Type</Text>
                            <View style={styles.radioGroup}>
                                <RadioButton
                                    selected={courseType === 'Full time'}
                                    onPress={() => setCourseType('Full time')}
                                    label="Full time"
                                />
                                <RadioButton
                                    selected={courseType === 'Part time'}
                                    onPress={() => setCourseType('Part time')}
                                    label="Part time"
                                />
                                <RadioButton
                                    selected={courseType === 'Correspondence/Distance learning'}
                                    onPress={() => setCourseType('Correspondence/Distance learning')}
                                    label="Correspondence/Distance learning"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Bottom Buttons */}
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
        paddingHorizontal: 32, // Figma: px-[32px]
        paddingVertical: 32, // Figma: py-[32px]
        gap: 32, // Figma: gap-[32px] between main sections
    },
    title: {
        ...typography.p2Bold, // Figma: Desktop/P2 Bold, 18px, line-height 25px, weight 700
        color: colors.primaryDarkBlue, // Figma: text-[color:var(--primary-dark-blue,#00213d)]
    },
    formFieldsContainer: {
        width: '100%',
        gap: 28, // Figma: gap-[28px] between rows
    },
    row: {
        flexDirection: 'row',
        gap: 32, // Figma: gap-[32px] between fields in row
        width: '100%',
    },
    rowField: {
        flex: 1,
        minWidth: 0,
    },
    dateSection: {
        width: '100%',
        gap: 12, // Figma: gap-[12px] between label and fields
    },
    dateLabel: {
        ...typography.p4SemiBold, // Figma: Desktop/P4 SemiBold, 14px, line-height 20px, weight 600
        color: colors.primaryDarkBlue,
    },
    dateFields: {
        flexDirection: 'row',
        gap: 16, // Figma: gap-[16px] between Month and Year
        width: '100%',
    },
    dateField: {
        flex: 1,
        minWidth: 0,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
    },
    checkboxLabel: {
        ...typography.p4,
        color: colors.textGrey,
    },
    disabledField: {
        backgroundColor: '#ededed',
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 12,
        minHeight: 48,
        justifyContent: 'center',
    },
    disabledText: {
        ...typography.p4,
        color: '#80919f',
    },
    courseTypeSection: {
        width: '100%',
        gap: 8, // Figma: gap-[8px] between label and radio buttons
    },
    courseTypeLabel: {
        ...typography.p4SemiBold,
        color: colors.primaryDarkBlue,
    },
    radioGroup: {
        flexDirection: 'row',
        gap: 32, // Figma: gap-[32px] between radio buttons
        width: '100%',
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24, // Figma: gap-[24px] between buttons
        width: '100%',
    },
    saveButton: {
        backgroundColor: colors.primaryBlue,
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 12,
        minWidth: 140,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonText: {
        ...typography.p4SemiBold,
        color: colors.white,
        textAlign: 'center',
    },
    discardButton: {
        paddingHorizontal: 0,
        paddingVertical: 12,
    },
    discardButtonText: {
        ...typography.p4SemiBold,
        color: colors.primaryBlue,
    },
});

export default EditEducationDetailsScreen;
