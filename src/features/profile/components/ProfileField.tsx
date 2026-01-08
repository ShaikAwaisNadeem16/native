import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../../styles/theme';
import CalendarIcon from '../../../components/common/CalendarIcon';

interface ProfileFieldProps {
    label: string;
    value: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value }) => {
    // Check if this is a date field (Date of Birth, DOB, etc.)
    const isDateField = label.toLowerCase().includes('date') || 
                       label.toLowerCase().includes('birth') ||
                       label.toLowerCase().includes('dob');

    return (
        <View style={styles.container}>
            <View style={styles.labelRow}>
                <Text style={styles.label}>{label || ''}</Text>
                {isDateField && (
                    <View style={styles.iconContainer}>
                        <CalendarIcon size={16} />
                    </View>
                )}
            </View>
            <Text style={styles.value}>{value || ''}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 4,
        width: '100%',
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    label: {
        ...typography.s2SemiBold,
        color: colors.primaryDarkBlue,
        lineHeight: 13, // From Figma
    },
    iconContainer: {
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    value: {
        ...typography.p4,
        color: colors.textGrey,
    },
});

export default ProfileField;






