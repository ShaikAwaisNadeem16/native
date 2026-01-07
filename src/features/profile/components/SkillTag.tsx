import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';

interface SkillTagProps {
    skill: string;
    isHighlighted?: boolean; // If true, uses darker blue background
}

const SkillTag: React.FC<SkillTagProps> = ({ skill, isHighlighted = false }) => {
    return (
        <View style={[styles.container, isHighlighted && styles.highlightedContainer]}>
            <Text style={styles.text}>{skill}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(205, 231, 255, 0.5)', // From Figma
        borderRadius: 20,
        paddingHorizontal: 24,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    highlightedContainer: {
        backgroundColor: colors.tableHeaderBlue, // #e6f3ff from Figma
    },
    text: {
        ...typography.p4,
        color: colors.textGrey,
    },
});

export default SkillTag;






