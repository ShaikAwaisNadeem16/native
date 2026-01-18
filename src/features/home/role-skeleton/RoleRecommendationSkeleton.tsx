import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BaseSkeleton } from '../../../components/common/ExpoSkeletonLoaders';
import { colors, spacing, borderRadius, shadows } from '../../../styles/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Skeleton for the Strengths Section including Title, Toggle, RadarChart, and Descriptions
 */
const StrengthsSkeleton = () => (
    <View style={styles.strengthsSection}>
        {/* Title and Toggle Section */}
        <View style={styles.titleToggleSection}>
            <View style={styles.sectionTitleSkeleton} />
            <View style={styles.toggleSkeleton} />
        </View>

        {/* Chart and Descriptions Section */}
        <View style={styles.chartDescriptionsSection}>
            {/* Radar Chart Skeleton */}
            <View style={styles.chartContainer}>
                <View style={styles.chartSkeleton} />
            </View>

            {/* Strength Descriptions Skeleton */}
            <View style={styles.strengthDescriptionsContainer}>
                {[1, 2, 3, 4].map((i) => (
                    <View key={i} style={styles.strengthDescriptionItem}>
                        <View style={styles.strengthTitleSkeleton} />
                        <View style={styles.strengthTextSkeleton} />
                        <View style={styles.strengthTextSkeleton2} />
                    </View>
                ))}
            </View>
        </View>
    </View>
);

/**
 * Skeleton for a single Role Recommendation Card
 */
const RoleCardSkeleton = () => (
    <View style={styles.cardContainer}>
        {/* Header Section */}
        <View style={styles.headerSection}>
            <View style={styles.header}>
                <View style={styles.iconSkeleton} />
                <View style={styles.badgeSkeleton} />
            </View>

            <View style={styles.content}>
                <View style={styles.roleTitleSkeleton} />
                <View style={styles.roleDescSkeleton} />
                <View style={styles.roleDescSkeleton2} />
            </View>
        </View>

        <View style={styles.divider} />

        {/* Skills and CTA */}
        <View style={styles.skillsCTASection}>
            <View style={styles.skillsSection}>
                <View style={styles.skillsLabelSkeleton} />
                <View style={styles.skillsContainer}>
                    {[1, 2, 3, 4].map((i) => (
                        <View key={i} style={styles.skillChipSkeleton} />
                    ))}
                </View>
            </View>
            <View style={styles.buttonSkeleton} />
        </View>
    </View>
);

/**
 * Skeleton for the FAQ Section
 */
const FAQSkeleton = () => (
    <View style={styles.faqSection}>
        <View style={styles.faqTitleSkeleton} />
        <View style={styles.faqContainer}>
            {[1, 2, 3].map((i) => (
                <View key={i} style={styles.faqItem}>
                    <View style={styles.faqQuestionSkeleton} />
                    <View style={styles.faqIconSkeleton} />
                    <View style={styles.faqDivider} />
                </View>
            ))}
        </View>
    </View>
);

/**
 * Main Role Recommendation Screen Skeleton
 */
export const RoleRecommendationSkeleton = () => {
    return (
        <BaseSkeleton>
            <View style={styles.container}>
                <StrengthsSkeleton />

                <View style={styles.rolesSection}>
                    <View style={styles.rolesSectionTitleSkeleton} />
                    <View style={styles.rolesContainer}>
                        <RoleCardSkeleton />
                        <RoleCardSkeleton />
                    </View>
                </View>

                <FAQSkeleton />
            </View>
        </BaseSkeleton>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 32,
    },
    // Strengths Section Styles
    strengthsSection: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 24,
        marginTop: 24,
        marginBottom: spacing.sectionGap, // 48px
        width: SCREEN_WIDTH,
        alignSelf: 'stretch',
    },
    titleToggleSection: {
        flexDirection: 'column',
        gap: 16, // 16px
        width: '100%',
        marginBottom: 40,
    },
    sectionTitleSkeleton: {
        width: 200,
        height: 25,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    toggleSkeleton: {
        width: 176,
        height: 38,
        borderRadius: 19,
        backgroundColor: colors.lightGrey,
    },
    chartDescriptionsSection: {
        flexDirection: 'column',
        gap: 40,
        width: '100%',
        alignItems: 'center',
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    chartSkeleton: {
        width: 214,
        height: 214,
        borderRadius: 107,
        backgroundColor: colors.lightGrey,
    },
    strengthDescriptionsContainer: {
        flexDirection: 'column',
        gap: 32,
        width: '100%',
    },
    strengthDescriptionItem: {
        flexDirection: 'column',
        gap: 8,
        width: '100%',
    },
    strengthTitleSkeleton: {
        width: 120,
        height: 20,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
        marginBottom: 4,
    },
    strengthTextSkeleton: {
        width: '100%',
        height: 16,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    strengthTextSkeleton2: {
        width: '80%',
        height: 16,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },

    // Roles Section Styles
    rolesSection: {
        flexDirection: 'column',
        gap: 20,
        marginBottom: spacing.sectionGap,
        width: SCREEN_WIDTH,
        alignSelf: 'stretch',
    },
    rolesSectionTitleSkeleton: {
        width: 250,
        height: 25,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
        marginBottom: 8,
        marginLeft: 16,
    },
    rolesContainer: {
        flexDirection: 'column',
        gap: 20,
        width: '100%',
    },
    cardContainer: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.card, // 12px
        paddingHorizontal: 16,
        paddingVertical: 27,
        width: SCREEN_WIDTH,
        alignSelf: 'stretch',
        ...shadows.activeElement,
    },
    headerSection: {
        flexDirection: 'column',
        gap: 24,
        width: '100%',
        marginBottom: 25,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    iconSkeleton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.lightGrey,
    },
    badgeSkeleton: {
        width: 80,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.lightGrey,
    },
    content: {
        flexDirection: 'column',
        gap: 8,
        width: '100%',
    },
    roleTitleSkeleton: {
        width: 150,
        height: 24,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
        marginBottom: 4,
    },
    roleDescSkeleton: {
        width: '100%',
        height: 16,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    roleDescSkeleton2: {
        width: '90%',
        height: 16,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    divider: {
        height: 1,
        backgroundColor: colors.lightGrey,
        width: '100%',
        marginBottom: 25,
    },
    skillsCTASection: {
        flexDirection: 'column',
        gap: 32,
        width: '100%',
        alignItems: 'flex-start',
    },
    skillsSection: {
        flexDirection: 'column',
        gap: 17,
        width: '100%',
    },
    skillsLabelSkeleton: {
        width: 100,
        height: 14,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8, // 8px horizontal
        rowGap: 12, // 12px vertical
    },
    skillChipSkeleton: {
        width: 80,
        height: 24,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    buttonSkeleton: {
        width: '100%',
        height: 48,
        borderRadius: 8,
        backgroundColor: colors.lightGrey,
    },

    // FAQ Section Styles
    faqSection: {
        flexDirection: 'column',
        gap: 32,
        marginBottom: 32,
        width: 328,
        alignSelf: 'flex-start',
        marginLeft: 16,
    },
    faqTitleSkeleton: {
        width: 220,
        height: 25,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    faqContainer: {
        flexDirection: 'column',
        width: '100%',
    },
    faqItem: {
        width: '100%',
        marginBottom: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestionSkeleton: {
        flex: 1,
        height: 20,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
        marginRight: 40,
    },
    faqIconSkeleton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.lightGrey,
    },
    faqDivider: {
        width: '100%',
        height: 1,
        backgroundColor: colors.lightGrey,
        marginTop: 16,
    },
});
