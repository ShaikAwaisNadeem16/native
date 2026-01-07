import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';

interface AnswerOptionProps {
    optionText: string;
    optionNumber: string;
    isSelected?: boolean;
    onPress?: () => void;
}

const AnswerOption: React.FC<AnswerOptionProps> = ({
    optionText,
    optionNumber,
    isSelected = false,
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Background shadow layer */}
            <View style={styles.backgroundShadow} />
            {/* Option container */}
            <View style={[styles.optionContainer, isSelected && styles.optionSelected]}>
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






