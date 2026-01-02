import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, typography } from '../../styles/theme';

interface Language {
    language: string;
    proficiency: string;
}

interface LanguageTableProps {
    languages: Language[];
}

const LanguageTable: React.FC<LanguageTableProps> = ({ languages }) => {
    // Line divider image URL from Figma
    const lineUrl = 'https://www.figma.com/api/mcp/asset/8f85d997-4380-4703-9bd7-f3b0c227a2fb';

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
                <Image
                    source={{ uri: lineUrl }}
                    style={styles.divider}
                    resizeMode="stretch"
                />
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





