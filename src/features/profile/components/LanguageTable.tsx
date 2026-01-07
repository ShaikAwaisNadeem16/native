import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, typography } from '../../../styles/theme';

// Icons removed - will be added later

interface Language {
    language: string;
    proficiency: string;
}

interface LanguageTableProps {
    languages: Language[];
}

const LanguageTable: React.FC<LanguageTableProps> = ({ languages }) => {

    return (
        <View style={styles.container}>
            {/* Header Row */}
            <View style={styles.headerRow}>
                <View style={styles.headerCell}>
                    <Text style={styles.headerText}>Language</Text>
                </View>
                <View style={styles.headerCell}>
                    <Text style={styles.headerText}>Proficiency</Text>
                </View>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
            </View>

            {/* Data Rows */}
            <View style={styles.dataContainer}>
                {Array.isArray(languages) && languages.map((lang, index) => (
                    <View key={index} style={styles.dataRow}>
                        <View style={styles.dataCell}>
                            <Text style={styles.dataText}>{lang?.language || ''}</Text>
                        </View>
                        <View style={styles.dataCell}>
                            <Text style={styles.dataText}>{lang?.proficiency || ''}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 12,
        width: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        gap: 24,
        width: '100%',
    },
    headerCell: {
        flex: 1,
    },
    headerText: {
        ...typography.s2SemiBold,
        color: colors.primaryDarkBlue,
        lineHeight: 13, // From Figma
    },
    dividerContainer: {
        height: 1,
        width: '100%',
    },
    divider: {
        width: '100%',
        height: '100%',
    },
    dataContainer: {
        flexDirection: 'column',
        gap: 20,
        width: '100%',
    },
    dataRow: {
        flexDirection: 'row',
        gap: 24,
        width: '100%',
    },
    dataCell: {
        flex: 1,
    },
    dataText: {
        ...typography.p4,
        color: colors.textGrey,
    },
});

export default LanguageTable;






