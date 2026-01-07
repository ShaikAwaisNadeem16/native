import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Clock } from 'lucide-react-native';
import { colors, typography } from '../../../styles/theme';

/**
 * AssignmentHeaderCard Component
 * 
 * Renders the assignment header card exactly as per Figma design (node 8217-85452).
 * This is the top card with blue background showing assignment icon, title, description, and duration.
 * 
 * Data Binding:
 * - assign_data.title → title prop
 * - assign_data.description → description prop
 * - assign_data.duration → duration prop
 * - assign_data.iconUrl → iconUrl prop (if available)
 */
export interface AssignmentHeaderCardProps {
    iconUrl?: string | number; // Assignment icon
    title: string; // From assign_data.title
    description: string; // From assign_data.description
    duration: string; // From assign_data.duration (e.g., "7 days")
}

const AssignmentHeaderCard: React.FC<AssignmentHeaderCardProps> = ({
    iconUrl,
    title,
    description,
    duration,
}) => {
    return (
        <View style={styles.container}>
            {/* Assignment Icon - 70x70px with background mask */}
            {iconUrl && (
                <View style={styles.iconContainer}>
                    <View style={styles.iconBackgroundMask}>
                        <Image
                            source={typeof iconUrl === 'string' ? { uri: iconUrl } : iconUrl}
                            style={styles.icon}
                            resizeMode="contain"
                        />
                    </View>
                </View>
            )}

            {/* Content Section */}
            <View style={styles.contentSection}>
                {/* Subtitle and Title Section */}
                <View style={styles.titleSection}>
                    <Text style={styles.subtitle}>ASSIGNMENT</Text>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                </View>

                {/* Duration Section */}
                {duration && (
                    <View style={styles.durationSection}>
                        <Clock size={24} color={colors.lightGrey} />
                        <Text style={styles.durationText}>{duration}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0049b5', // reportBlue from Figma
        padding: 24, // 24px padding from Figma
        flexDirection: 'column',
        gap: 20, // 20px gap from Figma
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',
    },
    iconContainer: {
        width: 70, // 70x70px from Figma
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    iconBackgroundMask: {
        width: 60.007, // Background mask dimensions from Figma
        height: 59.999,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    icon: {
        width: 90, // Icon size from Figma
        height: 84,
    },
    contentSection: {
        flexDirection: 'column',
        gap: 24, // 24px gap between title section and duration from Figma
        width: '100%',
    },
    titleSection: {
        flexDirection: 'column',
        gap: 16, // 16px gap between subtitle and title group from Figma
        width: '100%',
    },
    subtitle: {
        ...typography.s1Regular, // Inter Regular, 12px, line-height 16px from Figma
        color: colors.lightGrey, // #e2ebf3 from Figma
    },
    title: {
        ...typography.h6, // Inter Bold, 20px, line-height 24px from Figma
        color: colors.white, // White from Figma
    },
    description: {
        ...typography.p4, // Inter Regular, 14px, line-height 20px from Figma
        color: colors.white, // White from Figma
    },
    durationSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // 8px gap between icon and text from Figma
        height: 20, // 20px height from Figma
    },
    durationText: {
        ...typography.p4, // Inter Regular, 14px, line-height 20px from Figma
        color: colors.lightGrey, // #e2ebf3 from Figma
    },
});

export default AssignmentHeaderCard;

