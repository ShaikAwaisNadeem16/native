import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';

interface DateFieldProps {
    value: Date | null;
    onValueChange: (date: Date) => void;
    placeholder: string;
    error?: string;
}

const DateField: React.FC<DateFieldProps> = ({ 
    value, 
    onValueChange, 
    placeholder,
    error 
}) => {
    const [showPicker, setShowPicker] = useState(false);

    const formatDate = (date: Date | null): string => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowPicker(false);
        }
        if (selectedDate) {
            onValueChange(selectedDate);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.inputContainer, error && styles.inputContainerError]}
                onPress={() => setShowPicker(true)}
            >
                <Text style={[styles.inputText, !value && styles.placeholderText]}>
                    {value ? formatDate(value) : placeholder}
                </Text>
                <Calendar size={24} color={colors.primaryDarkBlue} />
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                />
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.input,
        paddingHorizontal: spacing.inputPaddingH,
        paddingVertical: spacing.inputPaddingV,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 48,
    },
    inputContainerError: {
        borderColor: colors.error,
    },
    inputText: {
        ...typography.p4,
        color: colors.textGrey,
        flex: 1,
    },
    placeholderText: {
        color: colors.placeholderGrey,
    },
    errorText: {
        ...typography.s1Regular,
        color: colors.error,
        marginTop: spacing.titleSubtitleGap,
    },
});

export default DateField;

