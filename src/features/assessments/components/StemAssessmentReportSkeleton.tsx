import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, borderRadius, shadows } from '../../../styles/theme';
import { BaseSkeleton } from '../../../components/common/ExpoSkeletonLoaders';

/**
 * StemAssessmentReportSkeleton
 * 
 * Skeleton loader specifically for the STEM Assessment Report screen.
 * Matches the layout of:
 * 1. Header Card (Blue card in result)
 * 2. Summary Table Section
 * 
 * Used during the artificial loading delay.
 */
export const StemAssessmentReportSkeleton: React.FC = () => {
    return (
        <View style={styles.container}>
            {/* Header Card Skeleton (Blue Report Card) */}
            <BaseSkeleton>
                <View style={styles.reportCard}>
                    {/* Logo/Illustration */}
                    <View style={styles.illustrationSkeleton} />

                    {/* Title & Message */}
                    <View style={styles.textContainer}>
                        <View style={styles.titleSkeleton} />
                        <View style={styles.messageSkeleton} />
                        <View style={styles.messageLineSkeleton} />
                    </View>

                    {/* Divider */}
                    <View style={styles.dividerSkeleton} />

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <View style={styles.statLabelSkeleton} />
                            <View style={styles.statValueRow}>
                                <View style={styles.iconSkeleton} />
                                <View style={styles.statTextSkeleton} />
                            </View>
                        </View>
                        <View style={styles.statItem}>
                            <View style={styles.statLabelSkeleton} />
                            <View style={styles.statValueRow}>
                                <View style={styles.statTextSkeleton} />
                            </View>
                        </View>
                    </View>
                </View>
            </BaseSkeleton>

            {/* Summary Section Skeleton */}
            <View style={styles.summarySection}>
                <BaseSkeleton>
                    <View style={styles.summaryTitleSkeleton} />
                </BaseSkeleton>

                {/* Table Header */}
                <BaseSkeleton>
                    <View style={styles.tableHeader}>
                        <View style={styles.col1Skeleton} />
                        <View style={styles.col2Skeleton} />
                        <View style={styles.col3Skeleton} />
                    </View>
                </BaseSkeleton>

                {/* Table Rows */}
                {[1, 2, 3, 4].map((i) => (
                    <BaseSkeleton key={i}>
                        <View style={styles.tableRow}>
                            <View style={styles.rowTextSkeleton} />
                            <View style={styles.rowResultSkeleton} />
                            <View style={styles.rowScoreSkeleton} />
                        </View>
                    </BaseSkeleton>
                ))}
            </View>

            {/* Buttons Skeleton */}
            <View style={styles.actionsSection}>
                <BaseSkeleton>
                    <View style={styles.buttonSkeleton} />
                </BaseSkeleton>
                <View style={styles.linksRow}>
                    <BaseSkeleton><View style={styles.linkSkeleton} /></BaseSkeleton>
                    <BaseSkeleton><View style={styles.linkSkeleton} /></BaseSkeleton>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16, // Matches scrollContent padding
        gap: 16,
    },
    // Report Card Styles - Matches reportCard in StemAssessmentReportScreen
    reportCard: {
        backgroundColor: colors.white, // In skeleton we use white bg for contrast, but check if we should transparent? No, white is good.
        borderRadius: 16,
        padding: 24,
        gap: 20,
        marginBottom: 16, // part of gap in parent
        // Let's keep border for skeleton to separate it visually if bg is white
        borderColor: colors.lightGrey,
        borderWidth: 1,
    },
    illustrationSkeleton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: colors.lightGrey,
        alignSelf: 'flex-start', // Match actual UI alignment
        marginBottom: 0, // Gap is handled by parent
    },
    textContainer: {
        width: '100%',
        alignItems: 'flex-start', // Match actual UI alignment
        gap: 8,
    },
    titleSkeleton: {
        width: 200,
        height: 24, // h6
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    messageSkeleton: {
        width: '90%',
        height: 16, // p4
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    messageLineSkeleton: {
        width: '70%',
        height: 16,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    dividerSkeleton: {
        width: '100%',
        height: 1,
        backgroundColor: colors.lightGrey,
        opacity: 0.3,
    },
    statsRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    statItem: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 8,
    },
    statLabelSkeleton: {
        width: 80,
        height: 14,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    statValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    iconSkeleton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.lightGrey,
    },
    statTextSkeleton: {
        width: 60,
        height: 24, // h5
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    // Summary Section Styles
    summarySection: {
        gap: 16,
        marginTop: 16,
        marginBottom: 32,
    },
    summaryTitleSkeleton: {
        width: 180,
        height: 20, // p2Bold
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
        marginBottom: 8,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: 12,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey,
    },
    col1Skeleton: { width: '40%', height: 16, borderRadius: 4, backgroundColor: colors.lightGrey },
    col2Skeleton: { width: '25%', height: 16, borderRadius: 4, backgroundColor: colors.lightGrey },
    col3Skeleton: { width: '25%', height: 16, borderRadius: 4, backgroundColor: colors.lightGrey },

    tableRow: {
        flexDirection: 'row',
        paddingVertical: 16,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey,
    },
    rowTextSkeleton: { width: '40%', height: 16, borderRadius: 4, backgroundColor: colors.lightGrey },
    rowResultSkeleton: { width: '25%', height: 16, borderRadius: 4, backgroundColor: colors.lightGrey },
    rowScoreSkeleton: { width: '25%', height: 16, borderRadius: 4, backgroundColor: colors.lightGrey },

    // Actions
    actionsSection: {
        gap: 24,
    },
    buttonSkeleton: {
        width: '100%',
        height: 48,
        borderRadius: 8,
        backgroundColor: colors.lightGrey,
    },
    linksRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 20,
    },
    linkSkeleton: {
        width: 120,
        height: 24,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    }
});

export default StemAssessmentReportSkeleton;
