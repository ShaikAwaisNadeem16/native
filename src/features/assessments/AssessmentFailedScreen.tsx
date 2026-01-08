import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { colors, typography, borderRadius } from '../../styles/theme';
import SecondaryButton from '../../components/SignUp/SecondaryButton';
import { Target, CheckCircle2, Clock, Lock } from 'lucide-react-native';

type AssessmentFailedScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AssessmentFailed'>;
type AssessmentFailedScreenRouteProp = RouteProp<RootStackParamList, 'AssessmentFailed'>;

/**
 * AssessmentFailedScreen Component
 * 
 * Shows assessment failed screen after user fails an assessment.
 * Matches Figma design: node 7875-75038
 * 
 * Renders ONLY when:
 * - Assessment submission is completed
 * - Result indicates FAIL state (pass === false)
 */
const AssessmentFailedScreen: React.FC = () => {
    const navigation = useNavigation<AssessmentFailedScreenNavigationProp>();
    const route = useRoute<AssessmentFailedScreenRouteProp>();
    
    // Extract data from route params (passed from assessment submission)
    const {
        finalScore,      // Percentage (e.g., 30)
        correctAnswers,  // String format "40/60"
        timeTaken,       // String format "01m 15s"
        failMessage,     // Fail message/reason from API
        cooldownDays,    // Number of days for cooldown (e.g., 60)
        minimumScore,    // Minimum score required (e.g., 50)
    } = route.params || {};

    const handleHome = () => {
        // Navigate to Home page
        navigation.navigate('Home');
    };

    // Format final score as percentage
    const finalScoreDisplay = finalScore !== undefined ? `${finalScore}%` : '0%';
    const correctAnswersDisplay = correctAnswers || '0/0';
    const timeTakenDisplay = timeTaken || '00m 00s';
    const cooldownDaysDisplay = cooldownDays !== undefined ? cooldownDays : 60;
    
    // Build fail message - use API message or default
    const defaultMessage = `You must score at least ${minimumScore !== undefined ? minimumScore : 50}% in-order to clear the test. You must now reattempt the STEM Assessment and the Engineering Systems Assessment in ${cooldownDaysDisplay} days`;
    const warningMessage = failMessage || defaultMessage;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.content}>
                {/* Illustration Section */}
                <View style={styles.illustrationContainer}>
                    {/* Destroyed rocket illustration - placeholder for image */}
                    <View style={styles.rocketPlaceholder} />
                </View>

                {/* Content Section */}
                <View style={styles.contentSection}>
                    {/* Title */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Assessment Failed</Text>
                    </View>

                    {/* Warning Message Box */}
                    <View style={styles.warningBox}>
                        <Text style={styles.warningText}>
                            You must{' '}
                            <Text style={styles.warningTextBold}>
                                score at least {minimumScore !== undefined ? minimumScore : 50}%
                            </Text>
                            {' '}in-order to clear the test. You must now reattempt the STEM Assessment and the Engineering Systems Assessment in{' '}
                            <Text style={styles.warningTextBold}>
                                {cooldownDaysDisplay} days
                            </Text>
                        </Text>
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
                    {/* Disabled Reattempt Button */}
                    <TouchableOpacity
                        style={styles.disabledButton}
                        disabled={true}
                        activeOpacity={0.7}
                    >
                        <View style={styles.disabledButtonContent}>
                            <Lock size={24} color="#72818c" />
                            <Text style={styles.disabledButtonText}>
                                Reattempt in {cooldownDaysDisplay} Days
                            </Text>
                        </View>
                    </TouchableOpacity>
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
        width: 137.89,
        height: 211,
        marginBottom: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rocketPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.lightGrey, // Placeholder until image is added
    },
    contentSection: {
        width: '100%',
        alignItems: 'center',
        gap: 32,
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
    warningBox: {
        backgroundColor: '#fcefdc', // Light orange background from Figma
        borderWidth: 0.5,
        borderColor: colors.error || '#eb5757', // Orange border from Figma
        borderRadius: borderRadius.input, // 8px
        padding: 12,
        width: '100%',
        gap: 12,
    },
    warningText: {
        ...typography.p4, // 14px Regular, line-height 20px
        color: colors.error || '#eb5757',
        textAlign: 'left',
    },
    warningTextBold: {
        ...typography.p4, // 14px Regular
        fontWeight: '700', // Bold
        color: colors.error || '#eb5757',
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
    disabledButton: {
        backgroundColor: '#ededed', // Grey background from Figma
        borderRadius: borderRadius.input, // 8px
        paddingHorizontal: 24,
        paddingVertical: 10,
        minWidth: 140,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 1, // Fully visible but disabled
    },
    disabledButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    disabledButtonText: {
        ...typography.p4SemiBold, // 14px SemiBold, line-height 20px
        color: '#72818c', // Grey text from Figma
        textAlign: 'center',
    },
});

export default AssessmentFailedScreen;

