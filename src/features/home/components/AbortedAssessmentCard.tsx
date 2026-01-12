import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Lock, AlertTriangle } from 'lucide-react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';
import SecondaryButton from '../../../components/SignUp/SecondaryButton';
import AssessmentLogo from '../../../components/common/AssessmentLogo';

interface AbortedAssessmentCardProps {
    subtitle?: string; // "TEST" label
    title: string; // "STEM Assessment"
    reattemptDays?: number; // Days until reattempt (e.g., 60)
    onViewReport?: () => void;
}

/**
 * AbortedAssessmentCard Component
 * Displays assessment card when test is aborted/failed
 * Matches Figma design: node-id=6044-43879
 */
const AbortedAssessmentCard: React.FC<AbortedAssessmentCardProps> = ({
    subtitle = 'TEST',
    title = 'STEM Assessment',
    reattemptDays = 60,
    onViewReport,
}) => {
    return (
        <View style={styles.container}>
            {/* Icon, Title and Subtitle Section */}
            <View style={styles.headerSection}>
                <View style={styles.iconTitleRow}>
                    {/* Icon Container */}
                    <View style={styles.iconContainer}>
                        <View style={styles.iconBackgroundMask}>
                            <AssessmentLogo size={70} />
                        </View>
                    </View>
                    
                    {/* Title and Subtitle */}
                    <View style={styles.titleSubtitleContainer}>
                        <Text style={styles.subtitle}>{subtitle.toUpperCase()}</Text>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                </View>
            </View>

            {/* CTA and Course Details Section */}
            <View style={styles.ctaSection}>
                <View style={styles.buttonsRow}>
                    {/* Reattempt Button (Disabled) */}
                    <TouchableOpacity
                        style={styles.reattemptButton}
                        disabled={true}
                        activeOpacity={0.7}
                    >
                        <Lock size={24} color="#72818c" />
                        <Text style={styles.reattemptButtonText}>
                            Reattempt in {reattemptDays} Days
                        </Text>
                    </TouchableOpacity>

                    {/* View Report Button */}
                    <View style={styles.viewReportButtonContainer}>
                        <SecondaryButton
                            label="View Report"
                            onPress={onViewReport}
                        />
                    </View>
                </View>
            </View>

            {/* Warning Message Banner */}
            <View style={styles.warningBanner}>
                <AlertTriangle size={24} color="#eb5757" />
                <Text style={styles.warningText}>
                    You need to clear the test by scoring at least 7/10 in-order to unlock the next activity
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderWidth: 2,
        borderColor: colors.primaryBlue,
        borderRadius: borderRadius.card,
        padding: 24,
        gap: 32,
        width: '100%',
    },
    headerSection: {
        width: '100%',
    },
    iconTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        width: '100%',
    },
    iconContainer: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    iconBackgroundMask: {
        width: 60.007,
        height: 59.999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleSubtitleContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
        justifyContent: 'center',
    },
    subtitle: {
        ...typography.s1Regular,
        color: colors.textGrey,
    },
    title: {
        ...typography.p2Bold,
        color: colors.primaryDarkBlue,
    },
    ctaSection: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 25,
    },
    buttonsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
    },
    reattemptButton: {
        backgroundColor: '#ededed',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: borderRadius.button,
        opacity: 0.7, // Disabled state
    },
    reattemptButtonText: {
        ...typography.p4SemiBold,
        color: '#72818c',
    },
    viewReportButtonContainer: {
        flex: 1,
        minWidth: 140,
    },
    warningBanner: {
        backgroundColor: '#fcefdc',
        borderWidth: 0.5,
        borderColor: '#eb5757',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: borderRadius.button,
        width: '100%',
    },
    warningText: {
        ...typography.p4,
        color: '#eb5757',
        flex: 1,
    },
});

export default AbortedAssessmentCard;

