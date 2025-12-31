import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';

interface CollegeInfoCardProps {
    collegeName: string;
    state: string;
    district: string;
    pinCode: string;
    collegeImageUrl?: string;
}

const CollegeInfoCard: React.FC<CollegeInfoCardProps> = ({
    collegeName,
    state,
    district,
    pinCode,
    collegeImageUrl,
}) => {
    return (
        <View style={styles.container}>
            {/* Header section with college info */}
            <View style={styles.headerSection}>
                <View style={styles.imageContainer}>
                    {collegeImageUrl ? (
                        <Image
                            source={{ uri: collegeImageUrl }}
                            style={styles.collegeImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.imagePlaceholder} />
                    )}
                </View>
                <View style={styles.collegeInfo}>
                    <Text style={styles.labelText}>You are a student of:</Text>
                    <Text style={styles.collegeName}>{collegeName}</Text>
                </View>
            </View>

            {/* Details section */}
            <View style={styles.detailsSection}>
                <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>State</Text>
                        <Text style={styles.detailValue}>{state}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>District</Text>
                        <Text style={styles.detailValue}>{district}</Text>
                    </View>
                </View>
                <View style={styles.detailItemFull}>
                    <Text style={styles.detailLabel}>Pin Code</Text>
                    <Text style={styles.detailValue}>{pinCode}</Text>
                </View>
            </View>
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
    headerSection: {
        backgroundColor: colors.lightGrey,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.cardPaddingH / 2, // 24px
        paddingVertical: 16,
        gap: 16,
    },
    imageContainer: {
        width: 62,
        height: 62,
        borderRadius: 48, // Full circle
        backgroundColor: colors.white,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    collegeImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    imagePlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.lightGrey,
    },
    collegeInfo: {
        flex: 1,
        gap: 2,
    },
    labelText: {
        ...typography.s1Regular,
        color: colors.textGrey,
    },
    collegeName: {
        ...typography.p3Bold,
        color: colors.primaryDarkBlue,
    },
    detailsSection: {
        paddingHorizontal: spacing.cardPaddingH / 2, // 24px
        paddingVertical: 16,
        gap: 16,
    },
    detailsRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    detailItem: {
        flex: 1,
        gap: 2,
    },
    detailItemFull: {
        width: '100%',
        gap: 2,
    },
    detailLabel: {
        ...typography.s1Regular,
        color: colors.placeholderGrey, // Lighter text grey #80919f
    },
    detailValue: {
        ...typography.p4,
        color: colors.textGrey,
    },
});

export default CollegeInfoCard;

