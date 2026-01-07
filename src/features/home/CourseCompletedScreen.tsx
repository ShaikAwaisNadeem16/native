import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { colors, typography, borderRadius } from '../../styles/theme';
import { Clock } from 'lucide-react-native';

type CourseCompletedScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CourseCompleted'>;
type CourseCompletedScreenRouteProp = RouteProp<RootStackParamList, 'CourseCompleted'>;

/**
 * CourseCompletedScreen Component
 * Shows course completion screen
 * Based on Figma design node-id=7381-70317
 */
const CourseCompletedScreen: React.FC = () => {
    const navigation = useNavigation<CourseCompletedScreenNavigationProp>();
    const route = useRoute<CourseCompletedScreenRouteProp>();
    const { timeTaken } = route.params || { timeTaken: '12d 04h' };

    const handleBackToHomepage = () => {
        navigation.navigate('Home');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.content}>
                {/* Illustration Section */}
                <View style={styles.illustrationContainer}>
                    {/* Confetti background - placeholder for image */}
                    <View style={styles.confettiBackground} />
                    {/* Group/People icon - placeholder for image */}
                    <View style={styles.groupIcon} />
                </View>

                {/* Content Section */}
                <View style={styles.contentSection}>
                    <Text style={styles.title}>Course Completed</Text>

                    {/* Statistics */}
                    <View style={styles.statisticsContainer}>
                        {/* Time Taken */}
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Time Taken</Text>
                            <View style={styles.statValueContainer}>
                                <Clock size={24} color={colors.primaryBlue} />
                                <Text style={styles.statValue}>{timeTaken}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Bottom Action Button */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleBackToHomepage}
                    activeOpacity={0.7}
                >
                    <Text style={styles.primaryButtonText}>Back To Homepage</Text>
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
        height: 184,
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
    groupIcon: {
        width: 148,
        height: 148,
        backgroundColor: colors.lightGrey, // Placeholder for group/people image
        borderRadius: 74,
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
});

export default CourseCompletedScreen;






