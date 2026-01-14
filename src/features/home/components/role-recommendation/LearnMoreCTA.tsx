import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography } from '../../../../styles/theme';
import { ChevronRight } from 'lucide-react-native';

interface LearnMoreCTAProps {
    onPress: () => void;
}

/**
 * LearnMoreCTA - Reusable "Learn More To Enrol" CTA component
 * Matches Figma design: node 12085:61834
 */
const LearnMoreCTA: React.FC<LearnMoreCTAProps> = ({ onPress }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={styles.text}>Learn More To Enrol</Text>
            <View style={styles.iconContainer}>
                <View style={styles.iconBackground}>
                    <ChevronRight size={16} color={colors.white} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        width: '100%',
    },
    text: {
        ...typography.p4SemiBold,
        color: colors.primaryBlue,
    },
    iconContainer: {
        width: 20,
        height: 20,
        position: 'relative',
    },
    iconBackground: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.primaryBlue,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LearnMoreCTA;



