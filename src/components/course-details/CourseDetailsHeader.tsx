import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../styles/theme';

interface CourseDetailsHeaderProps {
    title: string;
}

/**
 * CourseDetailsHeader Component
 * Renders the course title section
 */
const CourseDetailsHeader: React.FC<CourseDetailsHeaderProps> = ({ title }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 0,
    },
    title: {
        ...typography.p2Bold,
        color: colors.primaryDarkBlue,
        lineHeight: 25,
    },
});

export default CourseDetailsHeader;

