import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { colors } from '../../styles/theme';

interface RadioButtonProps {
    selected: boolean;
    onPress: () => void;
    label: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({ selected, onPress, label }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.radio, selected && styles.radioSelected]}>
                {selected && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        height: 20,
    },
    radio: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioSelected: {
        borderColor: colors.primaryBlue,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primaryBlue,
    },
    label: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter',
        fontWeight: '400',
        color: colors.textGrey,
    },
});

export default RadioButton;


