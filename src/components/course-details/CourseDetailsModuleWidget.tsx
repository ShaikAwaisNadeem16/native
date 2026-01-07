import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography } from '../../styles/theme';

interface CourseDetailsModuleWidgetProps {
    title?: string;
    subtitle?: string;
    onHamburgerPress?: () => void;
}

/**
 * CourseDetailsModuleWidget Component
 * Widget showing module title and subtitle with hamburger menu button
 * Based on Figma design node-id=7381-69117
 */
const CourseDetailsModuleWidget: React.FC<CourseDetailsModuleWidgetProps> = ({
    title = 'Awareness On Automotive Industry',
    subtitle = 'Automotive Industry Value Chain',
    onHamburgerPress,
}) => {
    // Hamburger icon - three horizontal lines
    const renderHamburgerIcon = () => {
        return (
            <View style={styles.hamburgerIconContainer}>
                <View style={styles.hamburgerLine} />
                <View style={styles.hamburgerLine} />
                <View style={styles.hamburgerLine} />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                    {title}
                </Text>
                <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
                    {subtitle}
                </Text>
            </View>
            <TouchableOpacity
                style={styles.hamburgerButton}
                onPress={onHamburgerPress}
                activeOpacity={0.7}
            >
                {renderHamburgerIcon()}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        width: '100%',
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: 32,
    },
    title: {
        ...typography.p3Bold,
        color: colors.textGrey,
        lineHeight: 23,
        marginBottom: 0,
    },
    subtitle: {
        ...typography.s1Regular,
        color: colors.textGrey,
        lineHeight: 16,
        marginTop: 0,
    },
    hamburgerButton: {
        backgroundColor: colors.highlightBlue,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: 28,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    hamburgerIconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    hamburgerLine: {
        width: 18,
        height: 2,
        backgroundColor: colors.primaryBlue,
        borderRadius: 1,
    },
});

export default CourseDetailsModuleWidget;

