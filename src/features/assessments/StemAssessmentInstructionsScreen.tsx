import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Bookmark } from 'lucide-react-native';
import { colors, typography, borderRadius } from '../../styles/theme';
import { RootStackParamList } from '../../navigation/AppNavigator';
import TestQuestionTag from './components/TestQuestionTag';
import STEMAssignmentInfo from './components/STEMAssignmentInfo';

type NavigationProp = StackNavigationProp<RootStackParamList>;

// StemAssessmentInstructionsScreen - Displays STEM Assessment instructions and test details
// Renamed from ModuleDetailsScreen to reflect actual content (STEM Assessment Instructions)
const StemAssessmentInstructionsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleTakeTest = () => {
        // Navigate to STEM Assessment Test screen when Take The Test button is pressed
        navigation.navigate('StemAssessmentTest');
    };

    const handleMarkForReview = () => {
        console.log('Mark for review pressed');
    };

    const handlePrevious = () => {
        console.log('Previous pressed');
    };

    const handleNext = () => {
        console.log('Next pressed');
    };

    const handleSubmitTest = () => {
        console.log('Submit test pressed');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* STEM Assignment Info - Rendered ABOVE the instructions sections */}
                <STEMAssignmentInfo
                    subtitle="TEST"
                    title="STEM Assessment"
                    description="You need to clear the test by scoring at least 7/10 in-order to access the next activity in your journey"
                    level="Beginner"
                    duration="60 mins"
                    onTakeTest={handleTakeTest}
                />

                {/* About The Assessment Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About The Assessment</Text>
                    <View style={styles.bulletList}>
                        <BulletPoint text="The total duration of this test is 60 minutes." />
                        <BulletPoint text="This test is of 80 Questions each of 1 Marks." />
                        <BulletPoint text="Total number of sections in this test is 4." />
                        <BulletPoint text="Each section comprises a duration of 15 minutes." />
                        <BulletPointWithSubPoints
                            mainText="There are following sections in the test:"
                            subPoints={[
                                'Section 1 is Science consisting of 20 questions.',
                                'Section 2 is Technology consisting of 20 questions.',
                                'Section 3 is Engineering Awareness consisting of 20 questions.',
                                'Section 4 is Mathematics consisting of 20 questions.',
                            ]}
                        />
                        <BulletPoint text="There will be a sectional cutoff of ⅓ for each section and an overall cutoff of ¾." />
                        <BulletPoint text="No Marks will be deducted for un-attempted Questions" />
                        <BulletPoint text="You are advised to not close the browser window before submitting the test." />
                    </View>
                </View>

                <Divider />

                {/* General Instructions Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>General Instructions</Text>
                    <View style={styles.bulletList}>
                        <BulletPoint text="Each question is timed" />
                        <BulletPoint text="Do not use search engines or get help from others" />
                        <BulletPoint text="Once you've submitted an answer, you cannot go back" />
                        <BulletPoint text="You may exit the test, but the timer will continue to run" />
                        <BulletPoint text="You can retake the assessment every 60 days" />
                    </View>
                </View>

                <Divider />

                {/* Procedure For Answering A Question Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Procedure For Answering A Question</Text>
                    <View style={styles.bulletList}>
                        <BulletPoint text="Read the type of question mentioned above the question carefully before answering the question" />
                        <BulletPoint text="To deselect your chosen answer, click on the bubble of the chosen option again." />
                        <BulletPoint text="To change your chosen answer, click on the bubble of another option." />
                        <BulletPoint text="To save your answer, you MUST click on the any one of the options." />
                        <BulletPoint text="If an answer is selected for a question that is Marked for Review, that answer will be considered in the evaluation unless the deselected by the candidate." />
                        <BulletPoint text="To change your answer to a question that has already been answered, first select that question for answering and then follow the procedure for answering that type of question." />
                        <BulletPoint text="Note that ONLY Questions for which answers are saved or marked for review after answering will be considered for evaluation." />
                    </View>
                </View>

                {/* Navigation Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Navigation</Text>
                    <View style={styles.navigationList}>
                        <NavigationItem
                            icon={<Bookmark size={24} color={colors.primaryBlue} />}
                            label="Mark For Review"
                            description="Click on this button to mark a question and review it later"
                            onPress={handleMarkForReview}
                        />
                        <NavigationItem
                            label="Previous"
                            description="Click on this button to go to previous question"
                            onPress={handlePrevious}
                            variant="outline"
                        />
                        <NavigationItem
                            label="Next"
                            description="Save your response and move to the next question"
                            onPress={handleNext}
                            variant="primary"
                        />
                        <NavigationItem
                            label="Submit Test"
                            description="Click on this button to submit your test once you've reviewed all your answers"
                            onPress={handleSubmitTest}
                            variant="outline"
                        />
                    </View>
                </View>

                <Divider />

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
            </ScrollView>
        </SafeAreaView>
    );
};

// Bullet Point Component
interface BulletPointProps {
    text: string;
}

const BulletPoint: React.FC<BulletPointProps> = ({ text }) => {
    return (
        <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{text}</Text>
        </View>
    );
};

// Bullet Point with Sub-points Component
interface BulletPointWithSubPointsProps {
    mainText: string;
    subPoints: string[];
}

const BulletPointWithSubPoints: React.FC<BulletPointWithSubPointsProps> = ({
    mainText,
    subPoints,
}) => {
    return (
        <View style={styles.bulletItemWithSub}>
            <View style={styles.bulletDotContainer}>
                <View style={styles.bulletDotTall} />
            </View>
            <View style={styles.bulletContent}>
                <Text style={styles.bulletText}>{mainText}</Text>
                <View style={styles.subPointsContainer}>
                    {subPoints.map((point, index) => (
                        <Text key={index} style={styles.subPointText}>
                            {point}
                        </Text>
                    ))}
                </View>
            </View>
        </View>
    );
};

// Divider Component
const Divider: React.FC = () => {
    return <View style={styles.divider} />;
};

// Navigation Item Component
interface NavigationItemProps {
    icon?: React.ReactNode;
    label: string;
    description: string;
    onPress: () => void;
    variant?: 'primary' | 'outline' | 'link';
}

const NavigationItem: React.FC<NavigationItemProps> = ({
    icon,
    label,
    description,
    onPress,
    variant = 'link',
}) => {
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';
    const isLink = variant === 'link';

    return (
        <View style={styles.navigationItem}>
            {isLink ? (
                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={onPress}
                    activeOpacity={0.7}
                >
                    {icon && <View style={styles.linkIcon}>{icon}</View>}
                    <Text style={styles.linkText}>{label}</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={[
                        styles.navButton,
                        isPrimary && styles.navButtonPrimary,
                        isOutline && styles.navButtonOutline,
                    ]}
                    onPress={onPress}
                    activeOpacity={0.7}
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
                </TouchableOpacity>
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
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
    },
    section: {
        width: '100%',
        marginBottom: 24,
    },
    sectionTitle: {
        ...typography.p3Bold,
        color: colors.primaryDarkBlue,
        marginBottom: 12,
    },
    bulletList: {
        flexDirection: 'column',
        gap: 8,
        width: '100%',
    },
    bulletItem: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        width: '100%',
    },
    bulletItemWithSub: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
        width: '100%',
    },
    bulletDotContainer: {
        width: 6,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bulletDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.textGrey,
    },
    bulletDotTall: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.textGrey,
        marginTop: 4.5, // Center vertically in 15px container (15 - 6) / 2 = 4.5
    },
    bulletContent: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
    },
    bulletText: {
        ...typography.p3Regular,
        color: colors.textGrey,
        flex: 1,
    },
    subPointsContainer: {
        paddingLeft: 20,
        flexDirection: 'column',
        gap: 4,
    },
    subPointText: {
        ...typography.p3Regular,
        color: colors.textGrey,
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: colors.lightGrey,
        marginVertical: 24,
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
        ...typography.s1Regular,
        color: colors.primaryBlue,
    },
    navButton: {
        borderRadius: borderRadius.input,
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
        ...typography.s2SemiBold,
        color: colors.primaryBlue,
    },
    navButtonTextPrimary: {
        color: colors.white,
    },
    navButtonTextOutline: {
        color: colors.primaryBlue,
    },
    navigationDescription: {
        ...typography.p4,
        color: colors.textGrey,
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
        ...typography.p4,
        color: colors.textGrey,
    },
});

export default StemAssessmentInstructionsScreen;

