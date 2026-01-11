import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, borderRadius, shadows } from '../../styles/theme';

/**
 * Simple skeleton component compatible with Expo (no native modules required)
 * Uses opacity animation instead of gradient shimmer
 */
const BaseSkeleton: React.FC<{ 
    children: React.ReactNode;
    enabled?: boolean;
    backgroundColor?: string;
    highlightColor?: string;
    speed?: number;
}> = ({ 
    children, 
    enabled = true,
    backgroundColor = colors.lightGrey,
    highlightColor = colors.white,
    speed = 1200
}) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!enabled) return;

        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: speed,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: speed,
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();
        return () => animation.stop();
    }, [enabled, speed, animatedValue]);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    if (!enabled) {
        return <View>{children}</View>;
    }

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.overlay,
                    {
                        backgroundColor: highlightColor,
                        opacity,
                    },
                ]}
            />
            <View style={styles.content}>{children}</View>
        </View>
    );
};

/**
 * Card skeleton - matches card structure with padding and border
 */
export const CardSkeleton: React.FC = () => (
    <BaseSkeleton>
        <View style={styles.cardContainer}>
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <View style={styles.titleSkeleton} />
                    <View style={styles.iconSkeleton} />
                </View>
                <View style={styles.descriptionSkeleton} />
                <View style={styles.descriptionSkeleton2} />
                <View style={styles.metadataRow}>
                    <View style={styles.metadataSkeleton} />
                    <View style={styles.dotSkeleton} />
                    <View style={styles.metadataSkeleton2} />
                </View>
                <View style={styles.buttonSkeleton} />
            </View>
        </View>
    </BaseSkeleton>
);

/**
 * Profile header skeleton - avatar, name, college
 */
export const ProfileHeaderSkeleton: React.FC = () => (
    <BaseSkeleton>
        <View style={styles.profileHeaderContainer}>
            <View style={styles.avatarSkeleton} />
            <View style={styles.profileInfoContainer}>
                <View style={styles.nameSkeleton} />
                <View style={styles.collegeSkeleton} />
            </View>
        </View>
    </BaseSkeleton>
);

/**
 * Profile field skeleton - label and value
 */
export const ProfileFieldSkeleton: React.FC = () => (
    <BaseSkeleton>
        <View style={styles.fieldContainer}>
            <View style={styles.labelSkeleton} />
            <View style={styles.valueSkeleton} />
        </View>
    </BaseSkeleton>
);

/**
 * Profile section skeleton - section header + multiple fields
 */
export const ProfileSectionSkeleton: React.FC = () => (
    <BaseSkeleton>
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleSkeleton} />
                <View style={styles.percentageSkeleton} />
                <View style={styles.editIconSkeleton} />
            </View>
            <View style={styles.fieldsContainer}>
                {[1, 2, 3, 4].map((i) => (
                    <ProfileFieldSkeleton key={i} />
                ))}
            </View>
        </View>
    </BaseSkeleton>
);

/**
 * List skeleton - for course lists, assessment lists, etc.
 */
export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
    <BaseSkeleton>
        <View style={styles.listContainer}>
            {Array.from({ length: count }).map((_, index) => (
                <CardSkeleton key={index} />
            ))}
        </View>
    </BaseSkeleton>
);

/**
 * Course card skeleton - matches ActiveCourseCard structure
 */
export const CourseCardSkeleton: React.FC = () => (
    <BaseSkeleton>
        <View style={styles.courseCardContainer}>
            <View style={styles.courseCardHeader}>
                <View style={styles.courseIconSkeleton} />
                <View style={styles.courseTitleContainer}>
                    <View style={styles.courseSubtitleSkeleton} />
                    <View style={styles.courseTitleSkeleton} />
                </View>
            </View>
            <View style={styles.courseDescriptionSkeleton} />
            <View style={styles.courseProgressContainer}>
                <View style={styles.progressBarSkeleton} />
            </View>
            <View style={styles.courseButtonsRow}>
                <View style={styles.primaryButtonSkeleton} />
                <View style={styles.secondaryButtonSkeleton} />
            </View>
        </View>
    </BaseSkeleton>
);

/**
 * Assessment card skeleton - matches EngineeringAssessmentCard structure
 */
export const AssessmentCardSkeleton: React.FC = () => (
    <BaseSkeleton>
        <View style={styles.assessmentCardContainer}>
            <View style={styles.assessmentIconSkeleton} />
            <View style={styles.assessmentTitleContainer}>
                <View style={styles.assessmentSubtitleSkeleton} />
                <View style={styles.assessmentTitleSkeleton} />
            </View>
            <View style={styles.assessmentDescriptionSkeleton} />
            <View style={styles.assessmentMetadataRow}>
                <View style={styles.assessmentMetadataSkeleton} />
                <View style={styles.assessmentDotSkeleton} />
                <View style={styles.assessmentMetadataSkeleton2} />
            </View>
            <View style={styles.assessmentButtonSkeleton} />
        </View>
    </BaseSkeleton>
);

/**
 * Home screen skeleton - complete home screen layout
 */
export const HomeScreenSkeleton: React.FC = () => (
    <BaseSkeleton>
        <View style={styles.homeScreenContainer}>
            <View style={styles.profileWidgetSkeleton} />
            <View style={styles.sectionTitleSkeleton} />
            <ListSkeleton count={3} />
        </View>
    </BaseSkeleton>
);

/**
 * Profile screen skeleton - complete profile screen layout
 */
export const ProfileScreenSkeleton: React.FC = () => (
    <BaseSkeleton>
        <View style={styles.profileScreenContainer}>
            <ProfileHeaderSkeleton />
            {[1, 2, 3].map((i) => (
                <ProfileSectionSkeleton key={i} />
            ))}
        </View>
    </BaseSkeleton>
);

/**
 * Button skeleton - for loading button states
 */
export const ButtonSkeleton: React.FC<{ width?: string | number }> = ({ width = '100%' }) => (
    <BaseSkeleton>
        <View style={[styles.buttonSkeleton, { width }]} />
    </BaseSkeleton>
);

/**
 * Inline loader skeleton - for small inline loading states (like pincode)
 */
export const InlineLoaderSkeleton: React.FC = () => (
    <BaseSkeleton>
        <View style={styles.inlineLoaderSkeleton} />
    </BaseSkeleton>
);

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        overflow: 'hidden',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    content: {
        position: 'relative',
        zIndex: 0,
    },
    // Card skeleton styles
    cardContainer: {
        backgroundColor: colors.white,
        borderWidth: 2,
        borderColor: colors.primaryBlue,
        borderRadius: borderRadius.card,
        padding: 24,
        width: '100%',
        marginBottom: 16,
        ...shadows.activeElement,
    },
    cardContent: {
        width: '100%',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    titleSkeleton: {
        width: '60%',
        height: 20,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    iconSkeleton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.lightGrey,
    },
    descriptionSkeleton: {
        width: '100%',
        height: 16,
        borderRadius: 4,
        marginBottom: 8,
        backgroundColor: colors.lightGrey,
    },
    descriptionSkeleton2: {
        width: '80%',
        height: 16,
        borderRadius: 4,
        marginBottom: 20,
        backgroundColor: colors.lightGrey,
    },
    metadataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    metadataSkeleton: {
        width: 60,
        height: 14,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    dotSkeleton: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginHorizontal: 8,
        backgroundColor: colors.lightGrey,
    },
    metadataSkeleton2: {
        width: 50,
        height: 14,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    buttonSkeleton: {
        width: '100%',
        height: 44,
        borderRadius: 8,
        backgroundColor: colors.lightGrey,
    },
    // Profile skeleton styles
    profileHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    avatarSkeleton: {
        width: 72,
        height: 75,
        borderRadius: 36,
        backgroundColor: colors.lightGrey,
    },
    profileInfoContainer: {
        flex: 1,
        marginLeft: 16,
    },
    nameSkeleton: {
        width: '70%',
        height: 20,
        borderRadius: 4,
        marginBottom: 8,
        backgroundColor: colors.lightGrey,
    },
    collegeSkeleton: {
        width: '50%',
        height: 16,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    fieldContainer: {
        marginBottom: 16,
    },
    labelSkeleton: {
        width: 100,
        height: 14,
        borderRadius: 4,
        marginBottom: 8,
        backgroundColor: colors.lightGrey,
    },
    valueSkeleton: {
        width: '80%',
        height: 16,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    sectionCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.card,
        padding: 24,
        marginBottom: 16,
        ...shadows.activeElement,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    sectionTitleSkeleton: {
        width: 150,
        height: 20,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    percentageSkeleton: {
        width: 40,
        height: 16,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    editIconSkeleton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.lightGrey,
    },
    fieldsContainer: {
        width: '100%',
    },
    // List skeleton styles
    listContainer: {
        width: '100%',
    },
    // Course card skeleton styles
    courseCardContainer: {
        backgroundColor: colors.white,
        borderWidth: 2,
        borderColor: colors.primaryBlue,
        borderRadius: borderRadius.card,
        padding: 24,
        width: '100%',
        marginBottom: 16,
        ...shadows.activeElement,
    },
    courseCardHeader: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    courseIconSkeleton: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 16,
        backgroundColor: colors.lightGrey,
    },
    courseTitleContainer: {
        flex: 1,
    },
    courseSubtitleSkeleton: {
        width: 60,
        height: 14,
        borderRadius: 4,
        marginBottom: 4,
        backgroundColor: colors.lightGrey,
    },
    courseTitleSkeleton: {
        width: '80%',
        height: 20,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    courseDescriptionSkeleton: {
        width: '100%',
        height: 16,
        borderRadius: 4,
        marginBottom: 8,
        backgroundColor: colors.lightGrey,
    },
    courseProgressContainer: {
        width: '100%',
        height: 8,
        borderRadius: 4,
        marginBottom: 16,
        backgroundColor: colors.lightGrey,
    },
    progressBarSkeleton: {
        width: '60%',
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    courseButtonsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    primaryButtonSkeleton: {
        flex: 1,
        height: 44,
        borderRadius: 8,
        backgroundColor: colors.lightGrey,
    },
    secondaryButtonSkeleton: {
        flex: 1,
        height: 44,
        borderRadius: 8,
        backgroundColor: colors.lightGrey,
    },
    // Assessment card skeleton styles
    assessmentCardContainer: {
        backgroundColor: colors.white,
        borderWidth: 2,
        borderColor: colors.primaryBlue,
        borderRadius: borderRadius.card,
        padding: 24,
        width: '100%',
        marginBottom: 16,
        ...shadows.activeElement,
    },
    assessmentIconSkeleton: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: colors.lightGrey,
    },
    assessmentTitleContainer: {
        marginBottom: 20,
    },
    assessmentSubtitleSkeleton: {
        width: 50,
        height: 14,
        borderRadius: 4,
        marginBottom: 4,
        backgroundColor: colors.lightGrey,
    },
    assessmentTitleSkeleton: {
        width: '90%',
        height: 20,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    assessmentDescriptionSkeleton: {
        width: '100%',
        height: 16,
        borderRadius: 4,
        marginBottom: 8,
        backgroundColor: colors.lightGrey,
    },
    assessmentMetadataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    assessmentMetadataSkeleton: {
        width: 60,
        height: 14,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    assessmentDotSkeleton: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginHorizontal: 8,
        backgroundColor: colors.lightGrey,
    },
    assessmentMetadataSkeleton2: {
        width: 50,
        height: 14,
        borderRadius: 4,
        backgroundColor: colors.lightGrey,
    },
    assessmentButtonSkeleton: {
        width: '100%',
        height: 44,
        borderRadius: 8,
        marginTop: 20,
        backgroundColor: colors.lightGrey,
    },
    // Screen skeleton styles
    homeScreenContainer: {
        padding: 16,
    },
    profileWidgetSkeleton: {
        width: '100%',
        height: 100,
        borderRadius: borderRadius.card,
        marginBottom: 24,
        backgroundColor: colors.lightGrey,
    },
    profileScreenContainer: {
        padding: 16,
    },
    inlineLoaderSkeleton: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.lightGrey,
    },
});


