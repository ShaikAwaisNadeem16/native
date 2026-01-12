import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';

type AnswerOptionState = 'attempted' | 'notAttempted' | 'skipped';

interface AnswerOptionProps {
    optionText: string;
    optionNumber: string;
    isSelected?: boolean;
    state?: AnswerOptionState; // New prop for question state
    onPress?: () => void;
}

const AnswerOption: React.FC<AnswerOptionProps> = ({
    optionText,
    optionNumber,
    isSelected = false,
    state = 'notAttempted', // Default to not attempted
    onPress,
}) => {
    // Determine container style based on state
    const getContainerStyle = () => {
        if (isSelected) {
            return [styles.optionContainer, styles.optionSelected];
        }
        switch (state) {
            case 'attempted':
                return [styles.optionContainer, styles.optionAttempted];
            case 'skipped':
                return [styles.optionContainer, styles.optionSkipped];
            case 'notAttempted':
            default:
                return styles.optionContainer;
        }
    };

    // Determine background shadow style based on state
    const getBackgroundShadowStyle = () => {
        switch (state) {
            case 'attempted':
                return [styles.backgroundShadow, styles.backgroundShadowAttempted];
            case 'skipped':
                return [styles.backgroundShadow, styles.backgroundShadowSkipped];
            case 'notAttempted':
            default:
                return styles.backgroundShadow;
        }
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Background shadow layer */}
            <View style={getBackgroundShadowStyle()} />
            {/* Option container */}
            <View style={getContainerStyle()}>
                <Text style={styles.optionText} numberOfLines={2}>
                    {optionText}
                </Text>
                <View style={styles.optionNumberContainer}>
                    <Text style={styles.optionNumber}>{optionNumber}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'relative',
    },
    backgroundShadow: {
        position: 'absolute',
        top: 2,
        left: 0,
        right: 0,
        height: 49,
        backgroundColor: colors.lightGrey,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.input,
    },
    optionContainer: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.input,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 48,
        minHeight: 49,
    },
    optionSelected: {
        borderColor: colors.primaryBlue,
        borderWidth: 2,
    },
    optionAttempted: {
        backgroundColor: '#E6F3FF', // Light blue background for attempted
        borderColor: colors.primaryBlue,
    },
    optionSkipped: {
        backgroundColor: '#FFF4E6', // Light orange/yellow background for skipped
        borderColor: colors.reviewOrange,
    },
    backgroundShadowAttempted: {
        backgroundColor: '#E6F3FF', // Light blue shadow for attempted
        borderColor: colors.primaryBlue,
    },
    backgroundShadowSkipped: {
        backgroundColor: '#FFF4E6', // Light orange/yellow shadow for skipped
        borderColor: colors.reviewOrange,
    },
    optionText: {
        ...typography.p4,
        color: colors.textGrey,
        flex: 1,
    },
    optionNumberContainer: {
        width: 25,
        height: 25,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    optionNumber: {
        ...typography.s1Regular,
        color: colors.textGrey,
    },
});

export default AnswerOption;






