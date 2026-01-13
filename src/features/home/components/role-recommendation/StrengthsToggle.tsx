import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, borderRadius } from '../../../../styles/theme';

export type ToggleOption = 'Skills' | 'Knowledge';

interface StrengthsToggleProps {
    selected: ToggleOption;
    onToggle: (option: ToggleOption) => void;
}

/**
 * StrengthsToggle - Reusable toggle component for Skills/Knowledge switching
 * Matches Figma design: node 12085:61728
 */
const StrengthsToggle: React.FC<StrengthsToggleProps> = ({ selected, onToggle }) => {
    const isSkills = selected === 'Skills';

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.toggleContainer}
                onPress={() => onToggle(isSkills ? 'Knowledge' : 'Skills')}
                activeOpacity={0.8}
            >
                {/* Background slider */}
                <View style={[styles.slider, isSkills ? styles.sliderLeft : styles.sliderRight]} />
                
                {/* Skills option */}
                <Text style={[styles.option, isSkills ? styles.optionActive : styles.optionInactive]}>
                    Skills
                </Text>
                
                {/* Knowledge option */}
                <Text style={[styles.option, !isSkills ? styles.optionActive : styles.optionInactive]}>
                    Knowledge
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 176,
        height: 38,
        flexShrink: 0,
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        borderRadius: 31,
        height: 38,
        paddingHorizontal: 3,
        position: 'relative',
        overflow: 'hidden',
    },
    slider: {
        position: 'absolute',
        backgroundColor: colors.primaryBlue,
        height: 30,
        width: 100,
        borderRadius: 16,
        top: 3,
    },
    sliderLeft: {
        left: '50%',
        transform: [{ translateX: -50 }],
        marginLeft: -34,
    },
    sliderRight: {
        left: '50%',
        transform: [{ translateX: -50 }],
        marginLeft: 34,
    },
    option: {
        ...typography.p4SemiBold,
        flex: 1,
        textAlign: 'center',
        zIndex: 1,
    },
    optionActive: {
        color: colors.white,
    },
    optionInactive: {
        color: colors.primaryBlue,
    },
});

export default StrengthsToggle;

