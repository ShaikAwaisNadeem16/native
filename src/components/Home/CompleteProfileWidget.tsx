import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors, typography } from '../../styles/theme';
import CircularProgress from './CircularProgress';

interface CompleteProfileWidgetProps {
    percentage: number;
    onUpdatePress?: () => void;
}

const CompleteProfileWidget: React.FC<CompleteProfileWidgetProps> = ({
    percentage,
    onUpdatePress,
}) => {
    // Avatar image URL from Figma
    const avatarUrl = 'https://www.figma.com/api/mcp/asset/1e50fa56-ea6d-4443-938c-020f6c70b43d';

    return (
        <View style={styles.container}>
            {/* Progress and Avatar Section */}
            <View style={styles.progressSection}>
                <CircularProgress percentage={percentage} size={60} avatarUrl={avatarUrl} />
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
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    buttonText: {
        ...typography.p4SemiBold,
        color: colors.primaryBlue,
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

