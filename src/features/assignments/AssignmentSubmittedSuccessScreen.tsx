import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { colors, typography, borderRadius } from '../../styles/theme';
import { Clock } from 'lucide-react-native';
import PrimaryButton from '../../components/SignUp/PrimaryButton';
import SecondaryButton from '../../components/SignUp/SecondaryButton';

type AssignmentSubmittedSuccessScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AssignmentSubmittedSuccess'>;
type AssignmentSubmittedSuccessScreenRouteProp = RouteProp<RootStackParamList, 'AssignmentSubmittedSuccess'>;

/**
 * AssignmentSubmittedSuccessScreen Component
 * Shows assignment submission success screen
 * Based on Figma design node-id=8217-86493
 * 
 * Renders ONLY when:
 * - Assignment submission API returns success
 * - Assignment status is finalized / submitted
 * - Editing is no longer allowed
 */
const AssignmentSubmittedSuccessScreen: React.FC = () => {
    const navigation = useNavigation<AssignmentSubmittedSuccessScreenNavigationProp>();
    const route = useRoute<AssignmentSubmittedSuccessScreenRouteProp>();
    const { startTime, submissionTime } = route.params || {};

    // Calculate time taken from startTime to submissionTime
    const timeTaken = useMemo(() => {
        if (!startTime || !submissionTime) {
            return '00d 00h 00m'; // Default if times not provided
        }

        try {
            const start = new Date(startTime);
            const end = new Date(submissionTime);
            const diffMs = end.getTime() - start.getTime();

            if (diffMs < 0) {
                return '00d 00h 00m';
            }

            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            // Format: "01d 15h 23m" (with leading zeros for days and hours, no leading zero for minutes)
            const formattedDays = days.toString().padStart(2, '0');
            const formattedHours = hours.toString().padStart(2, '0');
            const formattedMinutes = minutes.toString();

            return `${formattedDays}d ${formattedHours}h ${formattedMinutes}m`;
        } catch (error) {
            console.error('[AssignmentSubmittedSuccessScreen] Error calculating time taken:', error);
            return '00d 00h 00m';
        }
    }, [startTime, submissionTime]);

    const handleNext = () => {
        // Navigate to the next step defined in existing flow
        // For now, navigate to Home as default
        navigation.navigate('Home');
    };

    const handleHome = () => {
        navigation.navigate('Home');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.content}>
                {/* Illustration Section */}
                <View style={styles.illustrationContainer}>
                    {/* Puzzle illustration - placeholder for now, should match Figma exactly */}
                    <View style={styles.puzzleIllustration}>
                        {/* Placeholder for puzzle pieces illustration from Figma */}
                        <View style={styles.puzzlePlaceholder} />
                    </View>
                </View>

                {/* Content Section */}
                <View style={styles.contentSection}>
                    <Text style={styles.title}>Assignment Submitted!</Text>

                    {/* Time Taken Section */}
                    <View style={styles.timeTakenContainer}>
                        <Text style={styles.timeTakenLabel}>Time Taken</Text>
                        <View style={styles.timeTakenValueContainer}>
                            <Clock size={24} color={colors.primaryBlue} />
                            <Text style={styles.timeTakenValue}>{timeTaken}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Bottom Action Buttons */}
            <View style={styles.actionsContainer}>
                <PrimaryButton
                    label="Next"
                    onPress={handleNext}
                />
                <SecondaryButton
                    label="Home"
                    onPress={handleHome}
                />
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
        width: 289.6, // Width from Figma
        height: 200, // Height from Figma
        marginBottom: 48, // 48px gap from Figma
        alignItems: 'center',
        justifyContent: 'center',
    },
    puzzleIllustration: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    puzzlePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.lightGrey, // Placeholder - should be replaced with actual puzzle illustration
        borderRadius: 8,
    },
    contentSection: {
        width: 328, // Width from Figma
        alignItems: 'center',
        gap: 16, // 16px gap between title and time taken from Figma
    },
    title: {
        ...typography.h6, // Inter Bold, 20px, line-height 24px from Figma
        color: colors.primaryDarkBlue, // #00213d from Figma
        textAlign: 'center',
    },
    timeTakenContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 16, // 16px horizontal padding from Figma
        paddingVertical: 18, // 18px vertical padding from Figma
        borderWidth: 2,
        borderColor: colors.lightGrey, // #e2ebf3 from Figma
        borderRadius: borderRadius.input, // 8px from Figma
        backgroundColor: colors.white,
        gap: 32, // 32px gap between label and value from Figma
    },
    timeTakenLabel: {
        ...typography.p4, // Inter Regular, 14px, line-height 20px from Figma
        color: colors.textGrey, // #696a6f from Figma
        flex: 1,
    },
    timeTakenValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7, // 7px gap between icon and text from Figma
    },
    timeTakenValue: {
        ...typography.p2Bold, // Inter Bold, 18px, line-height 25px from Figma
        color: colors.primaryBlue, // #0b6aea from Figma
    },
    actionsContainer: {
        paddingHorizontal: 16, // 16px horizontal padding from Figma
        paddingVertical: 16, // 16px vertical padding from Figma
        gap: 16, // 16px gap between buttons from Figma
        borderTopWidth: 1,
        borderTopColor: colors.lightGrey, // #e2ebf3 from Figma
        backgroundColor: colors.white,
    },
});

export default AssignmentSubmittedSuccessScreen;

