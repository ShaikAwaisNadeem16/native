import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors, typography } from '../../../styles/theme';
import CircularProgress from './CircularProgress';

// Icons removed - will be added later

interface CompleteProfileWidgetProps {
    percentage: number;
    onUpdatePress?: () => void;
    loading?: boolean;
}

const CompleteProfileWidget: React.FC<CompleteProfileWidgetProps> = ({
    percentage,
    onUpdatePress,
    loading = false,
}) => {
    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.progressSection}>
                    <CircularProgress percentage={0} loading={true} size={60} />
                </View>
                <View style={styles.contentSection}>
                    <View style={styles.textSection}>
                        <View style={styles.titleSkeleton} />
                    </View>
                    <View style={styles.buttonSkeleton} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Progress and Avatar Section */}
            <View style={styles.progressSection}>
                <CircularProgress percentage={percentage} size={60} />
            </View>

            {/* Content Section */}
            <View style={styles.contentSection}>
                <View style={styles.textSection}>
                    <Text style={styles.title}>Complete Your Profile</Text>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={onUpdatePress}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>Update & View Profile</Text>
                    <View style={styles.iconContainer}>
                        <View style={styles.iconBackground}>
                            <ChevronRight size={16} color={colors.white} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 16,
        width: '100%',
    },
    progressSection: {
        width: 60,
        height: 62.89,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: 2.89, // Match Figma positioning
    },
    contentSection: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
    },
    textSection: {
        width: 200,
    },
    title: {
        ...typography.p3Bold,
        color: colors.primaryDarkBlue,
    },
    titleSkeleton: {
        width: 150,
        height: 20,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    buttonText: {
        ...typography.p4SemiBold,
        color: colors.primaryBlue,
    },
    buttonSkeleton: {
        width: 120,
        height: 20,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
        marginTop: 4,
    },
    iconContainer: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBackground: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.primaryBlue,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CompleteProfileWidget;

