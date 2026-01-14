import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../styles/theme';

export interface ProgressWidgetProps {
    progressPercentage: number; // 0-100
    onResumePress?: () => void;
}

/**
 * ProgressWidget - Reusable progress indicator with resume button
 * Matches Figma design: node 7381:72865
 */
const ProgressWidget: React.FC<ProgressWidgetProps> = ({
    progressPercentage = 0,
    onResumePress,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.progressSection}>
                <Text style={styles.progressText}>
                    {Math.round(progressPercentage)}% complete
                </Text>
                <View style={styles.progressBarContainer}>
                    <View
                        style={[
                            styles.progressBarFill,
                            { width: `${progressPercentage}%` },
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        width: '100%',
    },
    progressSection: {
        flexDirection: 'column',
        gap: 8,
        width: '100%',
    },
    progressText: {
        ...typography.interRegular12,
        color: colors.textGrey,
    },
    progressBarContainer: {
        backgroundColor: colors.lightGrey,
        borderRadius: 10,
        height: 8,
        width: '100%',
        overflow: 'hidden',
    },
    progressBarFill: {
        backgroundColor: colors.info || '#2F80ED',
        height: '100%',
        borderRadius: 10,
    },
});

export default ProgressWidget;





