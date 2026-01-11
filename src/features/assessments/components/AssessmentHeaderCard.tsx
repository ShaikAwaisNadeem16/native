import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../../styles/theme';

interface AssessmentHeaderCardProps {
    shortName?: string; // "Assessment" or "SURVEY"
    title: string; // "Engineering Assessment"
    description: string;
    duration?: string; // "1 Hour 30 Mins"
    questions?: string; // "60 Questions"
}

/**
 * Blue background header card component matching Figma design
 * Displays assessment icon, shortName, title, description, and metadata
 */
const AssessmentHeaderCard: React.FC<AssessmentHeaderCardProps> = ({
    shortName = 'ASSESSMENT',
    title,
    description,
    duration,
    questions,
}) => {
    return (
        <View style={styles.container}>
            {/* Content Section */}
            <View style={styles.contentSection}>
                {/* Short Name */}
                <Text style={styles.shortName}>{shortName.toUpperCase()}</Text>

                {/* Title and Description */}
                <View style={styles.titleDescriptionContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                </View>

                {/* Metadata: Duration and Questions */}
                {(duration || questions) && (
                    <View style={styles.metadataRow}>
                        {duration && <Text style={styles.metadataText}>{duration}</Text>}
                        {duration && questions && <View style={styles.dot} />}
                        {questions && <Text style={styles.metadataText}>{questions}</Text>}
                    </View>
                )}
            </View>

            {/* Decorative background elements */}
            <View style={styles.decorativeElement1} />
            <View style={styles.decorativeElement2} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primaryBlue, // #0049b5
        padding: 24,
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
    },
    contentSection: {
        width: '100%',
        flexDirection: 'column',
        gap: 24,
    },
    shortName: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
        color: colors.lightGrey, // #e2ebf3
        marginBottom: 16,
    },
    titleDescriptionContainer: {
        width: '100%',
        flexDirection: 'column',
        gap: 8,
    },
    title: {
        fontFamily: 'Inter',
        fontSize: 20,
        fontWeight: '700' as const,
        lineHeight: 24,
        color: colors.white,
        marginBottom: 8,
    },
    description: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
        color: colors.white,
    },
    metadataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        height: 20,
    },
    metadataText: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
        color: colors.lightGrey, // #e2ebf3
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.lightGrey, // #e2ebf3
    },
    decorativeElement1: {
        position: 'absolute',
        width: 207,
        height: 478,
        backgroundColor: 'rgba(250, 255, 252, 0.1)',
        borderRadius: 100,
        right: -50,
        top: -137,
        transform: [{ rotate: '38.713deg' }],
    },
    decorativeElement2: {
        position: 'absolute',
        width: 33,
        height: 784,
        backgroundColor: 'rgba(250, 255, 252, 0.1)',
        borderRadius: 100,
        right: -100,
        top: -271,
        transform: [{ rotate: '38.713deg' }],
    },
});

export default AssessmentHeaderCard;

