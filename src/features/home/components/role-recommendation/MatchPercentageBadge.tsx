import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '../../../../styles/theme';
import { Star } from 'lucide-react-native';

interface MatchPercentageBadgeProps {
    percentage: number;
    variant?: 'high' | 'medium';
}

/**
 * MatchPercentageBadge - Reusable match percentage badge component
 * Matches Figma design: node 12085:62020
 */
const MatchPercentageBadge: React.FC<MatchPercentageBadgeProps> = ({ 
    percentage, 
    variant = 'high' 
}) => {
    const isHigh = variant === 'high' || percentage >= 90;

    return (
        <View style={[styles.container, isHigh ? styles.high : styles.medium]}>
            {isHigh && <Star size={20} color={colors.white} fill={colors.white} />}
            <Text style={[styles.text, isHigh && styles.textHigh]}>
                {percentage}% MATCH
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 40,
        borderWidth: 1,
    },
    high: {
        backgroundColor: colors.successGreen,
        borderColor: colors.successGreen,
    },
    medium: {
        backgroundColor: 'rgba(39, 174, 96, 0.05)',
        borderColor: colors.successGreen,
    },
    text: {
        ...typography.s2SemiBold,
        color: colors.successGreen,
    },
    textHigh: {
        color: colors.white,
    },
});

export default MatchPercentageBadge;

