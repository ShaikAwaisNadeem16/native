import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '../../../../styles/theme';

interface SkillChipProps {
    skill: string;
    variant?: 'default' | 'highlighted';
}

/**
 * SkillChip - Reusable skill tag/chip component
 * Matches Figma design: node 12085:61782
 */
const SkillChip: React.FC<SkillChipProps> = ({ skill, variant = 'default' }) => {
    return (
        <View style={[styles.container, variant === 'highlighted' && styles.highlighted]}>
            <Text style={styles.text}>{skill}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(205, 231, 255, 0.5)', // First 2 skills - lighter background
        paddingHorizontal: 16, // Exact Figma padding
        paddingVertical: 8, // Exact Figma padding
        borderRadius: 20, // Exact Figma border radius
    },
    highlighted: {
        backgroundColor: '#e6f3ff', // Rest of skills - darker background (exact Figma color)
    },
    text: {
        ...typography.p4, // 14px Regular, line-height 20px
        color: colors.textGrey,
    },
});

export default SkillChip;

