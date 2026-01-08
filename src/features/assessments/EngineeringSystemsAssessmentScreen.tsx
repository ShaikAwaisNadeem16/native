import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Bookmark, Check } from 'lucide-react-native';
import { colors, typography, borderRadius } from '../../styles/theme';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Header from '../home/components/Header';
import BreadcrumbBar from './components/BreadcrumbBar';
import TestQuestionTag from './components/TestQuestionTag';
import PrimaryButton from '../../components/SignUp/PrimaryButton';
import SecondaryButton from '../../components/SignUp/SecondaryButton';
import Checkbox from 'expo-checkbox';

type NavigationProp = StackNavigationProp<RootStackParamList>;

/**
 * EngineeringSystemsAssessmentScreen
 * 
 * Renders the Engineering Systems Assessment instructions screen
 * that appears AFTER clicking "Start Assessment".
 * 
 * Based on Figma design: node-id=8003-80635
 */
const EngineeringSystemsAssessmentScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [isInstructionsRead, setIsInstructionsRead] = useState(false);

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    const handleNotificationPress = () => {
        console.log('Notification pressed');
    };

    const handleLogoPress = () => {
        navigation.navigate('Home');
    };

    const handleStartTest = () => {
        if (!isInstructionsRead) {
            return; // Button should be disabled if checkbox not checked
        }
        // Navigate to assessment test screen (reuse StemAssessmentTest for Engineering Systems)
        navigation.navigate('StemAssessmentTest');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Header
                onProfilePress={handleProfilePress}
                onNotificationPress={handleNotificationPress}
                onLogoPress={handleLogoPress}
            />

            {/* Breadcrumb Bar */}
            <BreadcrumbBar items={['Your Learning Journey', 'Engineering Systems Assessment']} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Assessment Header Card (Blue) */}
                <View style={styles.headerCard}>
                    {/* Illustration */}
                    <View style={styles.illustrationContainer}>
                        <View style={styles.backgroundMaskContainer}>
                            <View style={styles.backgroundMask} />
                        </View>
                        <View style={styles.ufoContainer}>
                            <View style={styles.ufoImage} />
                        </View>
                    </View>

                    {/* Content Section */}
                    <View style={styles.headerContent}>
                        <View style={styles.headerTextSection}>
                            <Text style={styles.headerSubtitle}>ASSESSMENT</Text>
                            <View style={styles.headerTitleSection}>
                                <Text style={styles.headerTitle}>Engineering Systems Assessment</Text>
                                <Text style={styles.headerDescription}>
                                    The intent of this awareness course is to help the students understand all that is needed to know about the industry in which they will work in the future and progress their career.
                                </Text>
                            </View>
                        </View>

                        {/* Question Count and Duration */}
                        <View style={styles.metaInfo}>
                            <Text style={styles.metaText}>10 Questions</Text>
                            <View style={styles.metaDot} />
                            <Text style={styles.metaText}>20 Minutes</Text>
                        </View>
                    </View>
                </View>

                {/* Instructions Card (White) */}
                <View style={styles.instructionsCard}>
                    {/* About The Assessment Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About The Assessment</Text>
                        <Text style={styles.sectionText}>
                            The STEM Assessment will give you a comprehensive snapshot of your current UX/UI design skills, including your design thinking ability and your knowledge of the psychology of design, UX research, and design methodologies. You'll get learning recommendations based on your strengths and weaknesses and see how you stack up against other designers.
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Instructions Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Instructions</Text>
                        <View style={styles.instructionsList}>
                            <InstructionItem text="Each question is timed" />
                            <InstructionItem text="Do not use search engines or get help from others" />
                            <InstructionItem text="Once you've submitted an answer, you cannot go back" />
                            <InstructionItem text="You may exit the test, but the timer will continue to run" />
                            <InstructionItem text="You can retake the assessment every 60 days" />
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Navigation Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Navigation</Text>
                        <View style={styles.navigationList}>
                            <NavigationItem
                                icon={<Bookmark size={24} color={colors.primaryBlue} />}
                                label="Mark For Review"
                                description="Click on this button to mark a question and review it later"
                            />
                            <NavigationItem
                                label="Previous"
                                description="Click on this button to go to previous question"
                                variant="outline"
                            />
                            <NavigationItem
                                label="Next"
                                description="Save your response and move to the next question"
                                variant="primary"
                            />
                            <NavigationItem
                                label="Submit Test"
                                description="Click on this button to submit your test once you've reviewed all your answers"
                                variant="outline"
                            />
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Legend Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Legend</Text>
                        <View style={styles.legendList}>
                            <LegendItem
                                tag={<TestQuestionTag questionNo="1" state="Unanswered" />}
                                label="Not Visited/Unanswered Question"
                            />
                            <LegendItem
                                tag={<TestQuestionTag questionNo="1" state="Selected" />}
                                label="Current Question"
                            />
                            <LegendItem
                                tag={<TestQuestionTag questionNo="1" state="Answered" />}
                                label="Answered Question"
                            />
                            <LegendItem
                                tag={<TestQuestionTag questionNo="1" state="Review Unanswered" />}
                                label="Unanswered and Marked for Review"
                            />
                            <LegendItem
                                tag={<TestQuestionTag questionNo="1" state="Review Answered" />}
                                label="Answered and Marked for Review"
                            />
                        </View>
                    </View>
                </View>

                {/* Checkbox and Start Button Section */}
                <View style={styles.startSection}>
                    <View style={styles.checkboxRow}>
                        <Checkbox
                            value={isInstructionsRead}
                            onValueChange={setIsInstructionsRead}
                            color={isInstructionsRead ? colors.primaryBlue : undefined}
                            style={styles.checkbox}
                        />
                        <Text style={styles.checkboxLabel}>
                            I have read and understood all the instructions
                        </Text>
                    </View>
                    <PrimaryButton
                        label="Start The Test"
                        onPress={handleStartTest}
                        disabled={!isInstructionsRead}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// Instruction Item Component
interface InstructionItemProps {
    text: string;
}

const InstructionItem: React.FC<InstructionItemProps> = ({ text }) => {
    return (
        <View style={styles.instructionItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.instructionText}>{text}</Text>
        </View>
    );
};

// Navigation Item Component
interface NavigationItemProps {
    icon?: React.ReactNode;
    label: string;
    description: string;
    variant?: 'primary' | 'outline' | 'link';
}

const NavigationItem: React.FC<NavigationItemProps> = ({
    icon,
    label,
    description,
    variant = 'link',
}) => {
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';
    const isLink = variant === 'link';

    return (
        <View style={styles.navigationItem}>
            {isLink ? (
                <View style={styles.linkButton}>
                    {icon && <View style={styles.linkIcon}>{icon}</View>}
                    <Text style={styles.linkText}>{label}</Text>
                </View>
            ) : (
                <View
                    style={[
                        styles.navButton,
                        isPrimary && styles.navButtonPrimary,
                        isOutline && styles.navButtonOutline,
                    ]}
                >
                    <Text
                        style={[
                            styles.navButtonText,
                            isPrimary && styles.navButtonTextPrimary,
                            isOutline && styles.navButtonTextOutline,
                        ]}
                    >
                        {label}
                    </Text>
                </View>
            )}
            <Text style={styles.navigationDescription}>{description}</Text>
        </View>
    );
};

// Legend Item Component
interface LegendItemProps {
    tag: React.ReactNode;
    label: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ tag, label }) => {
    return (
        <View style={styles.legendItem}>
            {tag}
            <Text style={styles.legendLabel}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainBgGrey,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 32,
        gap: 16,
    },
    headerCard: {
        backgroundColor: colors.reportBlue, // #0049b5 from Figma
        borderRadius: 16,
        padding: 24,
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    illustrationContainer: {
        width: 70,
        height: 70,
        position: 'relative',
        alignSelf: 'flex-start',
    },
    backgroundMaskContainer: {
        position: 'absolute',
        width: 60,
        height: 60,
        top: 5,
        left: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundMask: {
        width: '100%',
        height: '100%',
    },
    ufoContainer: {
        position: 'absolute',
        width: 102.864,
        height: 107.278,
        top: -18.639,
        left: -16.432,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ufoImage: {
        width: '100%',
        height: '100%',
    },
    headerContent: {
        flexDirection: 'column',
        gap: 24,
        width: '100%',
    },
    headerTextSection: {
        flexDirection: 'column',
        gap: 16,
        width: '100%',
    },
    headerSubtitle: {
        ...typography.s1Regular, // 12px Regular
        color: colors.lightGrey, // #e2ebf3 from Figma
        lineHeight: 16,
    },
    headerTitleSection: {
        flexDirection: 'column',
        gap: 8,
        width: '100%',
    },
    headerTitle: {
        ...typography.h6, // 20px Bold
        color: colors.white,
        lineHeight: 24,
    },
    headerDescription: {
        ...typography.p4, // 14px Regular
        color: colors.white,
        lineHeight: 20,
    },
    metaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        height: 20,
    },
    metaText: {
        ...typography.p4, // 14px Regular
        color: colors.lightGrey, // #e2ebf3 from Figma
        lineHeight: 20,
    },
    metaDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.lightGrey, // #e2ebf3 from Figma
    },
    instructionsCard: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.input, // 8px
        padding: 24,
        gap: 24,
        width: '100%',
    },
    section: {
        flexDirection: 'column',
        gap: 12,
        width: '100%',
    },
    sectionTitle: {
        ...typography.p3Bold, // 16px Bold
        color: colors.primaryDarkBlue,
        lineHeight: 23,
    },
    sectionText: {
        ...typography.p3Regular, // 16px Regular
        color: colors.textGrey,
        lineHeight: 25,
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: colors.lightGrey,
    },
    instructionsList: {
        flexDirection: 'column',
        gap: 8,
        width: '100%',
    },
    instructionItem: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        width: '100%',
    },
    bulletDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.textGrey,
    },
    instructionText: {
        ...typography.p3Regular, // 16px Regular
        color: colors.textGrey,
        lineHeight: 25,
        flex: 1,
    },
    navigationList: {
        flexDirection: 'column',
        gap: 20,
        width: '100%',
    },
    navigationItem: {
        flexDirection: 'column',
        gap: 4,
        width: '100%',
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
    },
    linkIcon: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    linkText: {
        ...typography.s1Regular, // 12px Regular
        color: colors.primaryBlue,
        lineHeight: 16,
    },
    navButton: {
        borderRadius: borderRadius.input, // 8px
        paddingHorizontal: 24,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
        minWidth: 173,
    },
    navButtonPrimary: {
        backgroundColor: colors.primaryBlue,
    },
    navButtonOutline: {
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        backgroundColor: 'transparent',
    },
    navButtonText: {
        ...typography.s2SemiBold, // 12px SemiBold
        color: colors.primaryBlue,
        lineHeight: 13,
    },
    navButtonTextPrimary: {
        color: colors.white,
    },
    navButtonTextOutline: {
        color: colors.primaryBlue,
    },
    navigationDescription: {
        ...typography.p4, // 14px Regular
        color: colors.textGrey,
        lineHeight: 20,
        width: '100%',
    },
    legendList: {
        flexDirection: 'column',
        gap: 16,
        width: '100%',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        width: '100%',
    },
    legendLabel: {
        ...typography.p4, // 14px Regular
        color: colors.textGrey,
        lineHeight: 20,
    },
    startSection: {
        flexDirection: 'column',
        gap: 16,
        width: '100%',
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        width: '100%',
    },
    checkbox: {
        width: 16,
        height: 16,
        borderRadius: 2.667,
        borderWidth: 0.667,
        borderColor: colors.primaryBlue,
    },
    checkboxLabel: {
        ...typography.s1Regular, // 12px Regular
        color: colors.primaryDarkBlue,
        lineHeight: 16,
        flex: 1,
    },
});

export default EngineeringSystemsAssessmentScreen;

