import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, typography } from '../../../styles/theme';
import PlusIcon from '../../../components/common/PlusIcon';
import EditPencilIcon from '../../../components/common/EditPencilIcon';

interface SectionHeaderProps {
    title: string;
    completionPercentage: number; // 0-100
    onEditPress?: () => void;
    onAddPress?: () => void;
    showAddIcon?: boolean; // If true, shows add icon, otherwise shows edit icon
    showBothIcons?: boolean; // If true, shows both add and edit icons
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    completionPercentage,
    onEditPress,
    onAddPress,
    showAddIcon = false,
    showBothIcons = false,
}) => {

    // Ensure completionPercentage is a valid number
    const safePercentage = typeof completionPercentage === 'number' && !isNaN(completionPercentage) ? completionPercentage : 0;

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title || ''}</Text>
                <Text style={styles.completionText}>{safePercentage}% complete</Text>
            </View>
            <View style={styles.iconsContainer}>
                {/* Show add icon if onAddPress is provided and (showAddIcon is true OR showBothIcons is true) */}
                {onAddPress && (showAddIcon || showBothIcons) && (
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={onAddPress}
                        activeOpacity={0.7}
                    >
                        <View style={styles.iconContainer}>
                            <PlusIcon size={16} color={colors.white} />
                        </View>
                    </TouchableOpacity>
                )}
                {/* Show edit icon if onEditPress is provided and (showAddIcon is false OR showBothIcons is true) */}
                {onEditPress && (!showAddIcon || showBothIcons) && (
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={onEditPress}
                        activeOpacity={0.7}
                    >
                        <View style={styles.iconContainer}>
                            <EditPencilIcon size={16} color={colors.white} />
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        width: '100%',
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
        justifyContent: 'center',
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
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
    },
    iconButton: {
        width: 32,
        height: 32,
        borderRadius: 19.2, // From Figma
        backgroundColor: colors.primaryBlue,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        flexShrink: 0, // Prevent icon from shrinking
    },
    iconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SectionHeader;






