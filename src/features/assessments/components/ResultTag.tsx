import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';
import GreenTick from '../../../components/common/GreenTick';
import WrongTick from '../../../components/common/WrongTick';

interface ResultTagProps {
    result: 'Pass' | 'Fail';
}

const ResultTag: React.FC<ResultTagProps> = ({ result }) => {
    const isPass = result === 'Pass';

    return (
        <View style={[styles.container, isPass ? styles.passContainer : styles.failContainer]}>
            <View style={styles.content}>
                {isPass ? (
                    <GreenTick size={12} />
                ) : (
                    <WrongTick size={12} />
                )}
                <Text style={[styles.text, isPass ? styles.passText : styles.failText]}>
                    {result}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        justifyContent: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
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
