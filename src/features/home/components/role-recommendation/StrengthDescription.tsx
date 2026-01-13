import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../../../styles/theme';

interface StrengthDescriptionProps {
    title: string;
    description: string;
}

/**
 * StrengthDescription - Reusable strength description block
 * Matches Figma design: node 12085:61755
 */
const StrengthDescription: React.FC<StrengthDescriptionProps> = ({ title, description }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 4,
        width: '100%',
    },
    title: {
        ...typography.p3Bold,
        color: colors.primaryDarkBlue,
    },
    description: {
        ...typography.p4,
        color: colors.textGrey,
    },
});

export default StrengthDescription;

