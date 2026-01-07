import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, typography } from '../../../styles/theme';

// Icons removed - will be added later

interface SectionHeaderProps {
    title: string;
    completionPercentage: number; // 0-100
    onEditPress?: () => void;
    onAddPress?: () => void;
    showAddIcon?: boolean; // If true, shows add icon, otherwise shows edit icon
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    completionPercentage,
    onEditPress,
    onAddPress,
    showAddIcon = false,
}) => {

    const handlePress = showAddIcon ? onAddPress : onEditPress;
    // Ensure completionPercentage is a valid number
    const safePercentage = typeof completionPercentage === 'number' && !isNaN(completionPercentage) ? completionPercentage : 0;

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title || ''}</Text>
                <Text style={styles.completionText}>{safePercentage}% complete</Text>
            </View>
            {(onEditPress || onAddPress) && (
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handlePress}
                    activeOpacity={0.7}
                >
                    <View style={styles.iconContainer}>
                        <View style={styles.icon} />
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 32,
        width: '100%',
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
    },
    title: {
        ...typography.p2Bold,
        color: '#000000', // Exact black from Figma design
    },
    completionText: {
        ...typography.interRegular12,
        color: '#697077', // From Figma
        lineHeight: 13.56, // 1.13 * 12
    },
    iconButton: {
        width: 32,
        height: 32,
        borderRadius: 19.2, // From Figma
        backgroundColor: colors.primaryBlue,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    iconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: '100%',
        height: '100%',
    },
});

export default SectionHeader;






