import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChevronDown, Plus, Calendar } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../styles/theme';
import Header from '../components/Home/Header';
import BreadcrumbBar from '../components/Assessment/BreadcrumbBar';
import FormInputWithLabel from '../components/Profile/FormInputWithLabel';
import DropdownWithLabel from '../components/Profile/DropdownWithLabel';
import LanguageEntry from '../components/Profile/LanguageEntry';
import DateField from '../components/SignUp/DateField';
import { RootStackParamList } from '../navigation/AppNavigator';
import useProfileStore from '../store/useProfileStore';
import ProfileService from '../api/profile';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface LanguageData {
    id: string;
    language: string;
    proficiency: string;
    canRead: boolean;
    canWrite: boolean;
    canSpeak: boolean;
}

const EditPersonalDetailsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { profileData, profileDetails, initializeHome } = useProfileStore();
    const [saving, setSaving] = useState(false);

    // Extract existing data from store
    const userData = profileDetails || profileData || {};

    // Form state - initialized from store data
    const [aboutYou, setAboutYou] = useState(userData.aboutYou || userData.about_you || '');
    const [firstName, setFirstName] = useState(userData.firstName || userData.first_name || '');
    const [lastName, setLastName] = useState(userData.lastName || userData.last_name || '');
    const [gender, setGender] = useState(userData.gender || '');
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(
        userData.dateOfBirth || userData.dob ? new Date(userData.dateOfBirth || userData.dob) : null
    );
    const [emailId, setEmailId] = useState(userData.email || userData.emailId || '');
    const [regionCode, setRegionCode] = useState(userData.regionCode || '+91');
    const [phoneNumber, setPhoneNumber] = useState(userData.phoneNumber || userData.phone_number || '');
    const [nationality, setNationality] = useState(userData.nationality || '');
    const [state, setState] = useState(userData.state || '');
    const [city, setCity] = useState(userData.city || '');
    const [permanentAddress, setPermanentAddress] = useState(userData.permanentAddress || userData.address || '');
    const [pinCode, setPinCode] = useState(userData.pinCode || userData.pin_code || '');
    const [linkedinUrl, setLinkedinUrl] = useState(userData.linkedinUrl || userData.linkedin_url || '');

    // Languages state - initialized from store data
    const [languages, setLanguages] = useState<LanguageData[]>(() => {
        const storedLanguages = userData.languages;
        if (Array.isArray(storedLanguages) && storedLanguages.length > 0) {
            return storedLanguages.map((lang: any, index: number) => ({
                id: String(index + 1),
                language: lang.language || '',
                proficiency: lang.proficiency || '',
                canRead: lang.canRead || false,
                canWrite: lang.canWrite || false,
                canSpeak: lang.canSpeak || false,
            }));
        }
        return [
            { id: '1', language: '', proficiency: '', canRead: false, canWrite: false, canSpeak: false },
        ];
    });

    // Update form when store data changes
    useEffect(() => {
        const data = profileDetails || profileData || {};
        if (data.firstName || data.first_name) setFirstName(data.firstName || data.first_name || '');
        if (data.lastName || data.last_name) setLastName(data.lastName || data.last_name || '');
        if (data.aboutYou || data.about_you) setAboutYou(data.aboutYou || data.about_you || '');
        if (data.gender) setGender(data.gender || '');
        if (data.email || data.emailId) setEmailId(data.email || data.emailId || '');
        if (data.phoneNumber || data.phone_number) setPhoneNumber(data.phoneNumber || data.phone_number || '');
        if (data.nationality) setNationality(data.nationality || '');
        if (data.state) setState(data.state || '');
        if (data.city) setCity(data.city || '');
        if (data.permanentAddress || data.address) setPermanentAddress(data.permanentAddress || data.address || '');
        if (data.pinCode || data.pin_code) setPinCode(data.pinCode || data.pin_code || '');
        if (data.linkedinUrl || data.linkedin_url) setLinkedinUrl(data.linkedinUrl || data.linkedin_url || '');
    }, [profileData, profileDetails]);

    // Dropdown options
    const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
    const regionCodeOptions = ['+91', '+1', '+44', '+61', '+86'];
    const nationalityOptions = ['India', 'United States', 'United Kingdom', 'Australia', 'Canada'];
    const stateOptions = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Gujarat'];
    const cityOptions = ['Mumbai', 'Pune', 'Bangalore', 'Chennai', 'Delhi'];
    const languageOptions = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Bengali'];
    const proficiencyOptions = ['Basic', 'Intermediate', 'Proficient', 'Native'];

    // Add language icon from Figma
    const addIconUrl = 'https://www.figma.com/api/mcp/asset/419c11ae-d5e4-4355-bdd9-f59644f14813';

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    const handleVerifyPhone = () => {
        console.log('Verify phone number');
    };

    const handleAddLanguage = () => {
        const newLanguage: LanguageData = {
            id: Date.now().toString(),
            language: '',
            proficiency: '',
            canRead: false,
            canWrite: false,
            canSpeak: false,
        };
        setLanguages([...languages, newLanguage]);
    };

    const handleDeleteLanguage = (id: string) => {
        setLanguages(languages.filter(lang => lang.id !== id));
    };

    const updateLanguage = (id: string, field: keyof LanguageData, value: string | boolean) => {
        setLanguages(languages.map(lang =>
            lang.id === id ? { ...lang, [field]: value } : lang
        ));
    };

    const handleSaveChanges = async () => {
        setSaving(true);
        try {
            const profileUpdateData = {
                aboutYou,
                firstName,
                lastName,
                gender,
                dateOfBirth: dateOfBirth ? dateOfBirth.toISOString() : null,
                email: emailId,
                regionCode,
                phoneNumber,
                nationality,
                state,
                city,
                permanentAddress,
                pinCode,
                linkedinUrl,
                languages: languages.map(lang => ({
                    language: lang.language,
                    proficiency: lang.proficiency,
                    canRead: lang.canRead,
                    canWrite: lang.canWrite,
                    canSpeak: lang.canSpeak,
                })),
            };

            await ProfileService.updateProfileDetails(profileUpdateData);

            // Refresh profile data after successful update
            await initializeHome();

            Alert.alert('Success', 'Profile updated successfully');
            navigation.goBack();
        } catch (error: any) {
            console.error('Failed to save profile:', error);
            Alert.alert('Error', error?.message || 'Failed to update profile. Please try again.');
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
            <Header onProfilePress={handleProfilePress} />

            {/* Breadcrumb Bar */}
            <BreadcrumbBar items={['Your Profile', 'Edit Personal Details']} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Form Card */}
                <View style={styles.formCard}>
                    {/* Title */}
                    <Text style={styles.title}>Personal Details</Text>

                    {/* About You */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>About You</Text>
                        <View style={styles.textAreaContainer}>
                            <TextInput
                                style={styles.textArea}
                                value={aboutYou}
                                onChangeText={setAboutYou}
                                placeholder="Tell us about yourself..."
                                placeholderTextColor={colors.placeholderGrey}
                                multiline
                                maxLength={500}
                                textAlignVertical="top"
                            />
                        </View>
                        <Text style={styles.charCount}>{aboutYou.length}/500</Text>
                    </View>

                    {/* First Name */}
                    <FormInputWithLabel
                        label="First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="Enter first name"
                    />

                    {/* Last Name */}
                    <FormInputWithLabel
                        label="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Enter last name"
                    />

                    {/* Gender */}
                    <DropdownWithLabel
                        label="Gender"
                        value={gender}
                        onValueChange={setGender}
                        placeholder="Select gender"
                        options={genderOptions}
                        required
                    />

                    {/* Date of Birth */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>
                            Date Of Birth<Text style={styles.required}>*</Text>
                        </Text>
                        <DateField
                            value={dateOfBirth}
                            onValueChange={setDateOfBirth}
                            placeholder="Select date of birth"
                        />
                    </View>

                    {/* Email ID */}
                    <FormInputWithLabel
                        label="Email ID"
                        value={emailId}
                        onChangeText={setEmailId}
                        placeholder="Enter email address"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        required
                    />

                    {/* Region Code */}
                    <DropdownWithLabel
                        label="Region Code"
                        value={regionCode}
                        onValueChange={setRegionCode}
                        placeholder="Select region code"
                        options={regionCodeOptions}
                    />

                    {/* Phone Number with Verify Button */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>
                            Phone Number<Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.phoneRow}>
                            <View style={styles.phoneInputContainer}>
                                <TextInput
                                    style={styles.phoneInput}
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    placeholder="Enter phone number"
                                    placeholderTextColor={colors.placeholderGrey}
                                    keyboardType="phone-pad"
                                />
                            </View>
                            <TouchableOpacity
                                style={styles.verifyButton}
                                onPress={handleVerifyPhone}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.verifyButtonText}>Verify</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.helperText}>
                            We will send a OTP in a text message to verify your number
                        </Text>
                    </View>

                    {/* Nationality */}
                    <DropdownWithLabel
                        label="Nationality"
                        value={nationality}
                        onValueChange={setNationality}
                        placeholder="Select nationality"
                        options={nationalityOptions}
                        required
                    />

                    {/* State */}
                    <DropdownWithLabel
                        label="State"
                        value={state}
                        onValueChange={setState}
                        placeholder="Select state"
                        options={stateOptions}
                        required
                    />

                    {/* City */}
                    <DropdownWithLabel
                        label="City"
                        value={city}
                        onValueChange={setCity}
                        placeholder="Select city"
                        options={cityOptions}
                    />

                    {/* Permanent Address */}
                    <FormInputWithLabel
                        label="Permanent Address"
                        value={permanentAddress}
                        onChangeText={setPermanentAddress}
                        placeholder="Enter permanent address"
                        required
                    />

                    {/* Pin Code */}
                    <FormInputWithLabel
                        label="Pin Code"
                        value={pinCode}
                        onChangeText={setPinCode}
                        placeholder="Enter pin code"
                        keyboardType="numeric"
                        required
                    />

                    {/* Linkedin Profile URL */}
                    <FormInputWithLabel
                        label="Linkedin Profile URL"
                        value={linkedinUrl}
                        onChangeText={setLinkedinUrl}
                        placeholder="Enter LinkedIn profile URL"
                        autoCapitalize="none"
                    />

                    {/* Languages Section */}
                    <View style={styles.languagesSection}>
                        <Text style={styles.sectionTitle}>Languages</Text>

                        {languages.map((lang) => (
                            <LanguageEntry
                                key={lang.id}
                                language={lang.language}
                                proficiency={lang.proficiency}
                                canRead={lang.canRead}
                                canWrite={lang.canWrite}
                                canSpeak={lang.canSpeak}
                                onLanguageChange={(value) => updateLanguage(lang.id, 'language', value)}
                                onProficiencyChange={(value) => updateLanguage(lang.id, 'proficiency', value)}
                                onReadChange={(value) => updateLanguage(lang.id, 'canRead', value)}
                                onWriteChange={(value) => updateLanguage(lang.id, 'canWrite', value)}
                                onSpeakChange={(value) => updateLanguage(lang.id, 'canSpeak', value)}
                                onDelete={() => handleDeleteLanguage(lang.id)}
                                languageOptions={languageOptions}
                                proficiencyOptions={proficiencyOptions}
                            />
                        ))}

                        {/* Add Language Button */}
                        <TouchableOpacity
                            style={styles.addLanguageButton}
                            onPress={handleAddLanguage}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.addLanguageText}>Add Language</Text>
                            <Image
                                source={{ uri: addIconUrl }}
                                style={styles.addIcon}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
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
        gap: 24,
    },
    title: {
        ...typography.p2Bold,
        color: '#000000',
    },
    fieldContainer: {
        width: '100%',
    },
    label: {
        ...typography.s1Regular,
        color: colors.textGrey,
        marginBottom: 8,
    },
    required: {
        color: colors.primaryBlue,
    },
    textAreaContainer: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.input,
        paddingHorizontal: spacing.inputPaddingH,
        paddingVertical: spacing.inputPaddingV,
        minHeight: 100,
    },
    textArea: {
        ...typography.p4,
        color: colors.textGrey,
        padding: 0,
        margin: 0,
        minHeight: 80,
    },
    charCount: {
        ...typography.s1Regular,
        color: colors.textGrey,
        textAlign: 'right',
        marginTop: 4,
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    phoneInputContainer: {
        flex: 1,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        borderRadius: borderRadius.input,
        paddingHorizontal: spacing.inputPaddingH,
        paddingVertical: spacing.inputPaddingV,
    },
    phoneInput: {
        ...typography.p4,
        color: colors.primaryBlue,
        padding: 0,
        margin: 0,
        minHeight: 20,
    },
    verifyButton: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    verifyButtonText: {
        ...typography.p4SemiBold,
        color: colors.primaryBlue,
    },
    helperText: {
        ...typography.s1Regular,
        color: colors.textGrey,
        marginTop: 8,
    },
    languagesSection: {
        width: '100%',
        gap: 24,
        paddingTop: 8,
    },
    sectionTitle: {
        ...typography.p3Bold,
        color: colors.primaryDarkBlue,
    },
    addLanguageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    addLanguageText: {
        ...typography.p4SemiBold,
        color: colors.primaryBlue,
    },
    addIcon: {
        width: 16,
        height: 16,
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

export default EditPersonalDetailsScreen;
