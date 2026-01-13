import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

/**
 * Reusable section divider component
 * Matches Figma design exactly (1px height, light grey color)
 */
const SectionDivider: React.FC = () => {
    return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: colors.lightGrey,
        marginVertical: 24, // 24px gap between sections (matches Figma)
    },
});

export default SectionDivider;


