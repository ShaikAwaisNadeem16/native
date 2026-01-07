import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../styles/theme';

interface AutomotiveAwarenessHeaderProps {
    title: string;
    subtitle?: string;
}

/**
 * AutomotiveAwarenessHeader Component
 * Renders page title and subtitle with exact Figma typography
 */
const AutomotiveAwarenessHeader: React.FC<AutomotiveAwarenessHeaderProps> = ({
    title,
    subtitle,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 8,
    },
    title: {
        ...typography.h6,
        color: colors.primaryDarkBlue,
    },
    subtitle: {
        ...typography.p4,
        color: colors.textGrey,
        lineHeight: 20,
    },
});

export default AutomotiveAwarenessHeader;
