import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, borderRadius, inputBaseStyles } from '../../styles/theme';
import Header from '../home/components/Header';
import BreadcrumbBar from '../assessments/components/BreadcrumbBar';
import FormInputWithLabel from './components/FormInputWithLabel';
import DropdownWithLabel from './components/DropdownWithLabel';
import { RootStackParamList } from '../../navigation/AppNavigator';
import useProfileStore from '../../store/useProfileStore';

/**
 * EditEducationDetailsScreen Component
 * Displays the edit form for Education Details section
 *
 * This screen appears when the Edit button is clicked on the
 * Education Details card in the Profile screen.
 *
 * Form Fields:
 * - educationLevel: The level of education (Class X, Class XII, etc.)
 * - boardUniversity: The board or university name
 * - yearOfPassing: Year when the education was completed
 * - percentage: Percentage or CGPA obtained
 * - schoolCollegeName: Name of the school or college
 */

type NavigationProp = StackNavigationProp<RootStackParamList>;

const EditEducationDetailsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { profileData, profileDetails, initializeHome } = useProfileStore();
    const [saving, setSaving] = useState(false);

    // Extract existing education data from store
    const userData = profileDetails || profileData || {};
    const educationData = userData.education || {};

    // Form state - initialized from store data
    const [educationLevel, setEducationLevel] = useState(educationData.educationLevel || educationData.level || '');
    const [boardUniversity, setBoardUniversity] = useState(educationData.boardUniversity || educationData.board || '');
    const [yearOfPassing, setYearOfPassing] = useState(educationData.yearOfPassing || educationData.year || '');
    const [percentage, setPercentage] = useState(educationData.percentage || educationData.score || '');
    const [schoolCollegeName, setSchoolCollegeName] = useState(educationData.schoolCollegeName || educationData.institution || '');

    // Dropdown options
    const educationLevelOptions = ['Class X', 'Class XII', 'Diploma', 'Graduation', 'Post Graduation', 'PhD'];
    const boardUniversityOptions = ['CBSE', 'ICSE', 'State Board', 'Maharashtra Board', 'Mumbai University', 'Pune University', 'Other'];
    const yearOptions = Array.from({ length: 30 }, (_, i) => String(2024 - i));

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    const handleSaveChanges = async () => {
        setSaving(true);
        try {
            // Prepare education data for update
            const educationUpdateData = {
                educationLevel,
                boardUniversity,
                yearOfPassing,
                percentage,
                schoolCollegeName,
            };

            // TODO: Call API to update education details
            // await ProfileService.updateEducationDetails(educationUpdateData);
            console.log('Saving education details:', educationUpdateData);

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));

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
                {/* Form Card */}
                <View style={styles.formCard}>
                    {/* Title */}
                    <Text style={styles.title}>Education Details</Text>

                    {/* Input Fields Container - gap: 28px between fields (Figma) */}
                    <View style={styles.inputFieldsContainer}>
                        {/* Education Level */}
                        <DropdownWithLabel
                            label="Education Level"
                            value={educationLevel}
                            onValueChange={setEducationLevel}
                            placeholder="Select education level"
                            options={educationLevelOptions}
                            required
                        />

                        {/* Board / University */}
                        <DropdownWithLabel
                            label="Board / University"
                            value={boardUniversity}
                            onValueChange={setBoardUniversity}
                            placeholder="Select board or university"
                            options={boardUniversityOptions}
                            required
                        />

                        {/* Year of Passing */}
                        <DropdownWithLabel
                            label="Year of Passing"
                            value={yearOfPassing}
                            onValueChange={setYearOfPassing}
                            placeholder="Select year"
                            options={yearOptions}
                            required
                        />

                        {/* Percentage / CGPA */}
                        <FormInputWithLabel
                            label="Percentage / CGPA"
                            value={percentage}
                            onChangeText={setPercentage}
                            placeholder="Enter percentage or CGPA"
                            keyboardType="numeric"
                            required
                        />

                        {/* School / College Name */}
                        <FormInputWithLabel
                            label="School / College Name"
                            value={schoolCollegeName}
                            onChangeText={setSchoolCollegeName}
                            placeholder="Enter school or college name"
                            required
                        />
                    </View>

                    {/* Bottom Buttons */}
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
        paddingHorizontal: 16,
        paddingVertical: 32,
        gap: 32, // Figma: gap-[32px] between main sections
    },
    inputFieldsContainer: {
        width: '100%',
        gap: 28, // Figma: gap-[28px] between input fields
    },
    title: {
        ...typography.p2Bold,
        color: '#000000',
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingTop: 8,
    },
    saveButton: {
        backgroundColor: colors.primaryBlue,
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 12,
        minWidth: 120,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonText: {
        ...typography.p4SemiBold,
        color: colors.white,
    },
    discardButton: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    discardButtonText: {
        ...typography.p4SemiBold,
        color: colors.primaryBlue,
    },
});

export default EditEducationDetailsScreen;
