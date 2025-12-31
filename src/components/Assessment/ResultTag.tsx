import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '../../styles/theme';

interface ResultTagProps {
    result: 'Pass' | 'Fail';
}

const ResultTag: React.FC<ResultTagProps> = ({ result }) => {
    const isPass = result === 'Pass';
    
    return (
        <View style={[styles.container, isPass ? styles.passContainer : styles.failContainer]}>
            <Text style={[styles.text, isPass ? styles.passText : styles.failText]}>
                {result}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 4,
        borderRadius: 20,
    },
    passContainer: {
        backgroundColor: colors.passBg,
    },
    failContainer: {
        backgroundColor: colors.failBg,
    },
    text: {
        ...typography.p4SemiBold,
    },
    passText: {
        color: colors.successGreen,
    },
    failText: {
        color: colors.error,
    },
});

export default ResultTag;

