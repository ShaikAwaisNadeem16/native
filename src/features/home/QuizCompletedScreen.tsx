import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { colors, typography, borderRadius } from '../../styles/theme';
import { Target, Clock } from 'lucide-react-native';

type QuizCompletedScreenNavigationProp = StackNavigationProp<RootStackParamList, 'QuizCompleted'>;
type QuizCompletedScreenRouteProp = RouteProp<RootStackParamList, 'QuizCompleted'>;

/**
 * QuizCompletedScreen Component
 * Shows quiz completion success screen
 * Based on Figma design node-id=7381-70231
 */
const QuizCompletedScreen: React.FC = () => {
    const navigation = useNavigation<QuizCompletedScreenNavigationProp>();
    const route = useRoute<QuizCompletedScreenRouteProp>();
    const { accuracy, timeTaken } = route.params || { accuracy: 60, timeTaken: '01m 15s' };

    const handleNextChapter = () => {
        // Navigate to course completion or next chapter
        navigation.navigate('CourseCompleted');
    };

    const handleReattemptQuiz = () => {
        // Navigate back to quiz instructions
        navigation.navigate('AutomotiveQuizInstructions');
    };

    // Format accuracy as percentage
    const accuracyText = `${accuracy}%`;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.content}>
                {/* Illustration Section */}
                <View style={styles.illustrationContainer}>
                    {/* Confetti background - placeholder for image */}
                    <View style={styles.confettiBackground} />
                    {/* Trophy icon - placeholder for image */}
                    <View style={styles.trophyIcon} />
                </View>

                {/* Content Section */}
                <View style={styles.contentSection}>
                    <Text style={styles.title}>Quiz Completed!</Text>

                    {/* Statistics */}
                    <View style={styles.statisticsContainer}>
                        {/* Learning Accuracy */}
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Learning Accuracy</Text>
                            <View style={styles.statValueContainer}>
                                <Target size={24} color={colors.primaryBlue} />
                                <Text style={styles.statValue}>{accuracyText}</Text>
                            </View>
                        </View>

                        {/* Time Taken */}
                        <View style={[styles.statItem, styles.statItemLast]}>
                            <Text style={styles.statLabel}>Time Taken</Text>
                            <View style={styles.statValueContainer}>
                                <Clock size={24} color={colors.primaryBlue} />
                                <Text style={styles.statValue}>{timeTaken}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Bottom Action Buttons */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleNextChapter}
                    activeOpacity={0.7}
                >
                    <Text style={styles.primaryButtonText}>Next Chapter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleReattemptQuiz}
                    activeOpacity={0.7}
                >
                    <Text style={styles.secondaryButtonText}>Reattempt Quiz</Text>
                </TouchableOpacity>
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
        width: 328,
        height: 212,
        position: 'relative',
        marginBottom: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confettiBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: colors.lightGrey, // Placeholder
    },
    trophyIcon: {
        width: 190,
        height: 190,
        backgroundColor: colors.lightGrey, // Placeholder
        borderRadius: 95,
    },
    contentSection: {
        width: '100%',
        alignItems: 'center',
        gap: 16,
    },
    title: {
        ...typography.h6,
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
        borderRadius: borderRadius.input,
        backgroundColor: colors.white,
    },
    statItemLast: {
        backgroundColor: colors.white,
    },
    statLabel: {
        ...typography.p4,
        color: colors.textGrey,
        flex: 1,
    },
    statValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    statValue: {
        ...typography.p3Bold,
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
    primaryButton: {
        backgroundColor: colors.primaryBlue,
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 40,
    },
    primaryButtonText: {
        ...typography.p4SemiBold,
        color: colors.white,
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 40,
        backgroundColor: colors.white,
    },
    secondaryButtonText: {
        ...typography.p4SemiBold,
        color: colors.primaryBlue,
    },
});

export default QuizCompletedScreen;






