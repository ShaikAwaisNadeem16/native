import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '../../styles/theme';
import ResultTag from './ResultTag';

interface TableRow {
    testPart: string;
    result: 'Pass' | 'Fail';
    score: string;
}

interface SummaryTableProps {
    rows: TableRow[];
}

const SummaryTable: React.FC<SummaryTableProps> = ({ rows }) => {
    return (
        <View style={styles.container}>
            {/* Table Header */}
            <View style={styles.headerRow}>
                <View style={[styles.headerCell, styles.firstCell]}>
                    <View style={styles.cellContent}>
                        <Text style={styles.headerText}>Test Part</Text>
                    </View>
                </View>
                <View style={styles.headerCell}>
                    <View style={styles.cellContent}>
                        <Text style={styles.headerText}>Result</Text>
                    </View>
                </View>
                <View style={styles.headerCell}>
                    <View style={styles.cellContent}>
                        <Text style={styles.headerText}>Score</Text>
                    </View>
                </View>
            </View>

            {/* Table Rows */}
            {Array.isArray(rows) && rows.map((row, index) => (
                <View
                    key={index}
                    style={[
                        styles.dataRow,
                        index < rows.length - 1 && styles.dataRowWithBorder,
                    ]}
                >
                    <View style={[styles.dataCell, styles.firstCell]}>
                        <View style={styles.cellContent}>
                            <Text style={styles.dataText}>{row?.testPart || ''}</Text>
                        </View>
                    </View>
                    <View style={styles.dataCell}>
                        <View style={styles.cellContent}>
                            <ResultTag result={row?.result || 'Pass'} />
                        </View>
                    </View>
                    <View style={styles.dataCell}>
                        <View style={styles.cellContent}>
                            <Text style={styles.dataText}>{row?.score || ''}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.input,
        overflow: 'hidden',
        width: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: colors.tableHeaderBlue,
        width: '100%',
    },
    headerCell: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    firstCell: {
        // First cell styling if needed
    },
    cellContent: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        width: '100%',
    },
    headerText: {
        ...typography.s2SemiBold,
        color: colors.primaryDarkBlue,
        lineHeight: 15.6, // 1.3 * 12
    },
    dataRow: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        width: '100%',
    },
    dataRowWithBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey,
    },
    dataCell: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    dataText: {
        ...typography.p4,
        color: colors.primaryDarkBlue,
    },
});

export default SummaryTable;





