import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { colors, typography, borderRadius } from '../../styles/theme';
import PrimaryButton from '../../components/SignUp/PrimaryButton';
import SecondaryButton from '../../components/SignUp/SecondaryButton';
import { Target, CheckCircle2, Clock, Trophy } from 'lucide-react-native';

type AssessmentClearedSuccessScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AssessmentClearedSuccess'>;
type AssessmentClearedSuccessScreenRouteProp = RouteProp<RootStackParamList, 'AssessmentClearedSuccess'>;

/**
 * AssessmentClearedSuccessScreen Component
 * 
 * Shows assessment cleared success screen after user successfully clears an assessment.
 * Matches Figma design: node 7875-74947
 * 
 * Renders ONLY when:
 * - Assessment submission is successful
 * - Result indicates PASS / CLEARED state
 */
const AssessmentClearedSuccessScreen: React.FC = () => {
    const navigation = useNavigation<AssessmentClearedSuccessScreenNavigationProp>();
    const route = useRoute<AssessmentClearedSuccessScreenRouteProp>();
    
    // Extract data from route params (passed from assessment submission)
    const {
        lessonId,
        moodleCourseId,
        quizReportData,
        finalResult,
        finalScore,      // Percentage (e.g., 60)
        correctAnswers,  // String format "40/60"
        timeTaken,       // String format "01m 15s"
    } = route.params || {};

    const handleContinue = () => {
        // Navigate to next step in existing flow
        // (e.g., next course / next assessment stage)
        // For now, navigate to Home
        navigation.navigate('Home');
    };

    const handleHome = () => {
        // Navigate to Home page
        navigation.navigate('Home');
    };

    const handleViewReport = () => {
        // Navigate to report screen with lessonId and quizReportData
        navigation.navigate('StemAssessmentReport', {
            lessonId: lessonId || moodleCourseId,
            moodleCourseId: moodleCourseId || lessonId,
            quizReportData: quizReportData,
            finalResult: finalResult || 'Pass',
        });
    };

    // Format final score as percentage
    const finalScoreDisplay = finalScore !== undefined ? `${finalScore}%` : '0%';
    const correctAnswersDisplay = correctAnswers || '0/0';
    const timeTakenDisplay = timeTaken || '00m 00s';

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.content}>
                {/* Illustration Section */}
                <View style={styles.illustrationContainer}>
                    {/* Confetti background - placeholder for image */}
                    <View style={styles.confettiBackground}>
                        {/* Placeholder for confetti image */}
                        <View style={styles.confettiPlaceholder} />
                    </View>
                    {/* Trophy icon */}
                    <View style={styles.trophyContainer}>
                        <Trophy size={189.946} color={colors.primaryBlue} />
                    </View>
                </View>

                {/* Content Section */}
                <View style={styles.contentSection}>
                    {/* Title */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Assessment Cleared!</Text>
                    </View>

                    {/* Statistics */}
                    <View style={styles.statisticsContainer}>
                        {/* Final Score */}
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Final Score</Text>
                            <View style={styles.statValueContainer}>
                                <View style={styles.iconWrapper}>
                                    <Target size={24} color={colors.primaryBlue} />
                                </View>
                                <Text style={styles.statValue}>{finalScoreDisplay}</Text>
                            </View>
                        </View>

                        {/* Correct Answers */}
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Correct Answers</Text>
                            <View style={styles.statValueContainer}>
                                <View style={styles.iconWrapper}>
                                    <CheckCircle2 size={24} color={colors.primaryBlue} />
                                </View>
                                <Text style={styles.statValue}>{correctAnswersDisplay}</Text>
                            </View>
                        </View>

                        {/* Time Taken */}
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Time Taken</Text>
                            <View style={styles.statValueContainer}>
                                <View style={styles.iconWrapper}>
                                    <Clock size={24} color={colors.primaryBlue} />
                                </View>
                                <Text style={styles.statValue}>{timeTakenDisplay}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Bottom Action Buttons */}
            <View style={styles.actionsContainer}>
                <View style={styles.buttonWrapper}>
                    <PrimaryButton
                        label="View Report"
                        onPress={handleViewReport}
                    />
                </View>
                <View style={styles.buttonWrapper}>
                    <SecondaryButton
                        label="Home"
                        onPress={handleHome}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    illustrationContainer: {
        width: 328.227,
        height: 211.98,
        position: 'relative',
        marginBottom: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confettiBackground: {
        position: 'absolute',
        width: 328.321,
        height: 182.219,
        top: 14.89, // Calculated: (211.98 - 182.219) / 2
        left: -0.047, // Centered: (328.227 - 328.321) / 2
        alignItems: 'center',
        justifyContent: 'center',
    },
    confettiPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.lightGrey, // Placeholder until image is added
    },
    trophyContainer: {
        position: 'absolute',
        width: 189.946,
        height: 189.946,
        top: 11, // Calculated: (211.98 - 189.946) / 2 + 25.36
        left: 69.14, // Calculated: (328.227 - 189.946) / 2
        alignItems: 'center',
        justifyContent: 'center',
    },
    trophyPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.lightGrey, // Placeholder until image is added
        borderRadius: 95,
    },
    contentSection: {
        width: '100%',
        alignItems: 'center',
        gap: 16,
    },
    titleContainer: {
        alignItems: 'center',
        gap: 4,
    },
    title: {
        ...typography.h6, // 20px Bold, line-height 24px
        color: colors.primaryDarkBlue,
        textAlign: 'center',
    },
    statisticsContainer: {
        width: '100%',
        gap: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 18,
        borderWidth: 2,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.input, // 8px
        backgroundColor: colors.white,
        gap: 32,
        minHeight: 56, // Ensure consistent height
    },
    statLabel: {
        ...typography.p4, // 14px Regular, line-height 20px
        color: colors.textGrey,
        flex: 1,
    },
    statValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    iconWrapper: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        ...typography.p3Bold, // 16px Bold, line-height 23px
        color: colors.primaryBlue,
    },
    actionsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 16,
        borderTopWidth: 1,
        borderTopColor: colors.lightGrey,
        backgroundColor: colors.white,
    },
    buttonWrapper: {
        width: '100%',
    },
});

export default AssessmentClearedSuccessScreen;

