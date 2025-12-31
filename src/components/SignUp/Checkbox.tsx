import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors, borderRadius } from '../../styles/theme';

interface CheckboxProps {
    checked: boolean;
    onToggle: () => void;
    size?: number;
}

const Checkbox: React.FC<CheckboxProps> = ({ 
    checked, 
    onToggle,
    size = 16 
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.checkbox,
                checked && styles.checkboxChecked,
                { width: size, height: size }
            ]}
            onPress={onToggle}
            activeOpacity={0.7}
        >
            {checked && (
                <Check size={size * 0.625} color={colors.white} />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    checkbox: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: 2.667, // Exact from Figma
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#0f62fe', // Selection blue from Figma
        borderColor: '#0f62fe',
        borderWidth: 0,
    },
});

export default Checkbox;

