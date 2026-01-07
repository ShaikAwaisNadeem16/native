import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';

/**
 * ComingSoonCourseCard Component
 * 
 * Renders a coming soon course card exactly as per Figma design (node 7875-71039).
 * 
 * Usage:
 * - Render ONLY when course is UPCOMING / COMING SOON
 * - Card is NON-CLICKABLE
 * - No CTA buttons shown
 * - Displays "COMING SOON" tag
 * 
 * Data Binding:
 * - Courses.title → title prop
 * - Courses.subTitle → subtitle prop
 */
export interface ComingSoonCourseCardProps {
    iconUrl?: string | number; // Course icon from Courses or course data
    subtitle: string; // From Courses.subTitle
    title: string; // From Courses.title
}

const ComingSoonCourseCard: React.FC<ComingSoonCourseCardProps> = ({
    iconUrl,
    subtitle,
    title,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Icon, Title, and Coming Soon Tag Section */}
                <View style={styles.iconTitleSection}>
                    {/* Course Icon - 48x48px */}
                    {iconUrl && (
                        <View style={styles.iconContainer}>
                            <Image
                                source={typeof iconUrl === 'string' ? { uri: iconUrl } : iconUrl}
                                style={styles.icon}
                                resizeMode="contain"
                            />
                        </View>
                    )}
                    
                    {/* Subtitle and Title */}
                    <View style={styles.titleSection}>
                        <Text style={styles.subtitle}>{subtitle}</Text>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    
                    {/* Coming Soon Tag */}
                    <View style={styles.comingSoonTag}>
                        <Text style={styles.comingSoonText}>COMING SOON</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.lightGrey, // #e2ebf3 from Figma
        borderRadius: borderRadius.card, // 12px from Figma
        padding: 24, // 24px padding from Figma
        width: '100%',
        overflow: 'hidden',
    },
    content: {
        flexDirection: 'column',
        gap: 20, // 20px gap between sections from Figma
        width: '100%',
    },
    iconTitleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16, // 16px gap between icon and title section from Figma
        width: '100%',
    },
    iconContainer: {
        width: 48, // 48x48px from Figma
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    icon: {
        width: '100%',
        height: '100%',
    },
    titleSection: {
        flexDirection: 'column',
        gap: 4, // 4px gap between subtitle and title from Figma
        flex: 1,
        minWidth: 0, // Allow text to wrap
    },
    subtitle: {
        ...typography.s1Regular, // Inter Regular, 12px, line-height 16px from Figma
        color: colors.textGrey, // #696a6f from Figma
    },
    title: {
        ...typography.p2Bold, // Inter Bold, 18px, line-height 25px from Figma
        color: colors.primaryDarkBlue, // #00213d from Figma
    },
    comingSoonTag: {
        backgroundColor: colors.highlightBlue, // #f2f7fe from Figma
        paddingHorizontal: 12, // 12px horizontal padding from Figma
        paddingVertical: 8, // 8px vertical padding from Figma
        borderRadius: 4, // 4px border radius from Figma
        flexShrink: 0,
    },
    comingSoonText: {
        ...typography.s2SemiBold, // Inter SemiBold, 12px, line-height 13px from Figma
        color: colors.textGrey, // #696a6f from Figma
    },
});

export default ComingSoonCourseCard;
