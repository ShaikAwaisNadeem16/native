import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, sizes } from '../../styles/theme';

interface ProgressStepsProps {
    currentStep: number;
    totalSteps?: number;
    completedSteps?: number[];
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ 
    currentStep, 
    totalSteps = 4,
    completedSteps = [] 
}) => {
    return (
        <View style={styles.container}>
            {Array.from({ length: totalSteps }, (_, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = completedSteps.includes(stepNumber);
                const isInactive = !isActive && !isCompleted;
                
                return (
                    <React.Fragment key={stepNumber}>
                        <View style={[
                            styles.stepCircle,
                            isCompleted && styles.stepCircleCompleted,
                            isActive && styles.stepCircleActive,
                            isInactive && styles.stepCircleInactive
                        ]}>
                            {isCompleted ? (
                                <Check size={16} color={colors.white} />
                            ) : (
                                <Text style={[
                                    styles.stepText,
                                    isActive ? styles.stepTextActive : styles.stepTextInactive
                                ]}>
                                    {stepNumber}
                                </Text>
                            )}
                        </View>
                        {stepNumber < totalSteps && (
                            <View style={[
                                styles.connectorLine,
                                (isCompleted || (isActive && stepNumber === currentStep - 1)) && styles.connectorLineActive
                            ]} />
                        )}
                    </React.Fragment>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.stepGap,
        width: '100%',
        maxWidth: 362, // Exact width from Figma
    },
    stepCircle: {
        width: sizes.stepCircle,
        height: sizes.stepCircle,
        borderRadius: borderRadius.stepCircle,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    stepCircleCompleted: {
        backgroundColor: colors.primaryBlue,
        borderColor: colors.primaryBlue,
        borderWidth: 0,
    },
    stepCircleActive: {
        backgroundColor: colors.primaryBlue,
        borderColor: colors.primaryBlue,
        borderWidth: 0,
    },
    stepCircleInactive: {
        backgroundColor: colors.white,
        borderColor: colors.lightGrey,
        borderWidth: 1,
    },
    stepText: {
        ...typography.s2SemiBold,
        textAlign: 'center',
    },
    stepTextActive: {
        color: colors.white,
    },
    stepTextInactive: {
        color: '#000000', // Black text for inactive steps
    },
    connectorLine: {
        flex: 1,
        height: sizes.connectorLineHeight,
        backgroundColor: colors.lightGrey,
        borderRadius: borderRadius.connectorLine,
        minWidth: 0,
    },
    connectorLineActive: {
        backgroundColor: colors.primaryBlue,
    },
});

export default ProgressSteps;

