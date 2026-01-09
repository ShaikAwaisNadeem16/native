import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, borderRadius } from '../../styles/theme';
import Header from '../home/components/Header';
import BreadcrumbBar from '../assessments/components/BreadcrumbBar';
import DropdownField from '../../components/SignUp/DropdownField';
import EditableSkillTag from './components/EditableSkillTag';
import { RootStackParamList } from '../../navigation/AppNavigator';
import useProfileStore from '../../store/useProfileStore';
import ProfileService from '../../api/profile';

/**
 * EditTechnicalCompetenciesScreen Component
 * Displays the edit form for Technical Competencies section
 *
 * This screen appears when the Edit/Add button is clicked on the
 * Technical Competencies card in the Profile screen.
 *
 * Form Fields (per Figma design):
 * - skills: Array of selected skills (max 7)
 * - Skill dropdown: For adding new skills
 * - Skill tags: Display selected skills with remove functionality
 */

type NavigationProp = StackNavigationProp<RootStackParamList>;

const MAX_SKILLS = 7; // Figma: Maximum 7 skills can be entered

const EditTechnicalCompetenciesScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { profileData, profileDetails, initializeHome, skills: skillsFromStore } = useProfileStore();
    const [saving, setSaving] = useState(false);
    const [allSkillsOptions, setAllSkillsOptions] = useState<string[]>([]);

    // Extract existing technical competencies data from store
    const userData = profileDetails || profileData || {};
    const skillsData = userData.technicalSkills || userData.skills || userData.technicalCompetencies || [];

    // Form state - initialized from store data
    // Convert to array of skill strings if needed
    // API format: technicalSkills is array of { skillId, skillName } objects
    const initialSkills = Array.isArray(skillsData) 
        ? skillsData
            .map((item: any) => {
                if (typeof item === 'string') {
                    return item;
                } else if (item?.skillName) {
                    // API format: { skillId, skillName }
                    return item.skillName;
                } else {
                    // Legacy format: { skill, name }
                    return item?.skill || item?.name || '';
                }
            })
            .filter((skill: string) => skill !== '') // Remove empty strings
        : [];
    const [skills, setSkills] = useState<string[]>(initialSkills.slice(0, MAX_SKILLS));

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
            // Map skills to format with skillId and skillName
            // Match skill names with skills from store/API to get correct skillId
            const technicalSkills = skills.map((skillName) => {
                // Find matching skill from store to get skillId
                const matchingSkill = skillsFromStore?.find(skill => skill.skillName === skillName);
                return {
                    skillId: matchingSkill?.skillId || 0,
                    skillName: skillName,
                };
            });

            // Prepare payload for PUT /api/student/user-profile
            const profileUpdateData = {
                technicalSkills: technicalSkills,
            };

            console.log('Saving technical competencies:', JSON.stringify(profileUpdateData, null, 2));

            // Call API to update technical competencies
            await ProfileService.updateProfileDetails(profileUpdateData);

            // Refresh profile data after successful update
            await initializeHome();

            Alert.alert('Success', 'Technical competencies updated successfully');
            navigation.goBack();
        } catch (error: any) {
            console.error('Failed to save technical competencies:', error);
            Alert.alert('Error', error?.message || 'Failed to update technical competencies. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDiscardChanges = () => {
        navigation.goBack();
    };

    const handleAddSkill = (skill: string) => {
        if (skills.length >= MAX_SKILLS) {
            Alert.alert('Limit Reached', `Maximum ${MAX_SKILLS} skills can be entered`);
            return;
        }
        if (!skills.includes(skill)) {
            setSkills([...skills, skill]);
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    // Available skills for dropdown (exclude already selected ones)
    const availableSkillsOptions = allSkillsOptions.filter(skill => !skills.includes(skill));

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Header onProfilePress={handleProfilePress} onLogoPress={() => navigation.navigate('Home')} />

            {/* Breadcrumb Bar */}
            <BreadcrumbBar items={['Your Profile', 'Edit Technical Competencies']} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Form Card - matches Figma: padding 16px horizontal, 32px vertical, gap 32px between sections */}
                <View style={styles.formCard}>
                    {/* Title Section - matches Figma: title 18px Bold, black, subtitle 12px Regular, #697077, gap 4px between them */}
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>Technical Competencies</Text>
                        <Text style={styles.subtitle}>Maximum 7 skills can be entered</Text>
                    </View>

                    {/* Form Fields Container - matches Figma spacing */}
                    <View style={styles.formFieldsContainer}>
                        {/* Skills Dropdown - full width, 16px gap below */}
                        <View style={styles.skillsDropdownContainer}>
                            {availableSkillsOptions.length > 0 && skills.length < MAX_SKILLS ? (
                                <DropdownField
                                    value=""
                                    onValueChange={handleAddSkill}
                                    placeholder="Add Your Skills"
                                    options={availableSkillsOptions}
                                />
                            ) : (
                                <View style={styles.skillsDropdownDisabled}>
                                    <Text style={styles.skillsDropdownDisabledText}>
                                        {skills.length >= MAX_SKILLS 
                                            ? `Maximum ${MAX_SKILLS} skills reached`
                                            : 'All available skills selected'}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Selected Skills Tags - 16px gap from dropdown, 12px gap between tags (wrap layout) */}
                        {skills.length > 0 && (
                            <View style={styles.skillsTagsContainer}>
                                {skills.map((skill, index) => (
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
    titleSection: {
        width: '100%',
        gap: 4, // Figma: gap-[4px] between title and subtitle
    },
    title: {
        ...typography.p2Bold, // Figma: Desktop/P2 Bold, 18px, line-height 25px, weight 700
        color: '#000000', // Figma: text-black
    },
    subtitle: {
        ...typography.s1Regular, // Figma: Desktop/S1 Regular, 12px, line-height 16px, weight 400
        color: '#697077', // Figma: text-[#697077]
        width: 206, // Figma: w-[206px]
    },
    formFieldsContainer: {
        width: '100%',
        gap: 16, // Figma: gap-[16px] between dropdown and tags
    },
    skillsDropdownContainer: {
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

export default EditTechnicalCompetenciesScreen;

