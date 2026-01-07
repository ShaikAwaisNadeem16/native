import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { colors, typography, borderRadius, shadows } from '../../../styles/theme';

/**
 * AutomotiveIndustryTypes Component
 * Displays different automotive industry categories in a horizontal scrollable list
 *
 * Props:
 * - title: string - Section title (default: "Explore Automotive Industries")
 * - industries: Array - List of industry types to display
 * - onIndustryPress: function - Callback when an industry card is pressed
 */

// Industry type definition
interface IndustryType {
    // Unique identifier for the industry
    id: string;
    // Display name of the industry (e.g., "Manufacturing", "EV & Hybrid")
    name: string;
    // Short description of the industry
    description?: string;
    // Icon URL or local asset
    iconUrl?: string | number;
    // Background color for the card (optional, defaults to highlightBlue)
    backgroundColor?: string;
}

interface AutomotiveIndustryTypesProps {
    // Section title displayed above the industry cards
    title?: string;
    // Array of industry types to display
    industries?: IndustryType[];
    // Callback function when an industry card is pressed
    onIndustryPress?: (industry: IndustryType) => void;
}

// Default automotive industry types
const defaultIndustries: IndustryType[] = [
    {
        id: 'manufacturing',
        name: 'Manufacturing',
        description: 'Vehicle production & assembly',
    },
    {
        id: 'ev-hybrid',
        name: 'EV & Hybrid',
        description: 'Electric & hybrid vehicles',
    },
    {
        id: 'aftermarket',
        name: 'Aftermarket',
        description: 'Parts & accessories',
    },
    {
        id: 'dealership',
        name: 'Dealership',
        description: 'Sales & service',
    },
    {
        id: 'logistics',
        name: 'Logistics',
        description: 'Supply chain & transport',
    },
];

const AutomotiveIndustryTypes: React.FC<AutomotiveIndustryTypesProps> = ({
    title = 'Explore Automotive Industries',
    industries = defaultIndustries,
    onIndustryPress,
}) => {
    // Only render if there are industries to display
    if (!industries || industries.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            {/* Section Title */}
            <Text style={styles.sectionTitle}>{title}</Text>

            {/* Horizontal Scrollable Industry Cards */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {industries.map((industry) => (
                    <TouchableOpacity
                        key={industry.id}
                        style={[
                            styles.industryCard,
                            { backgroundColor: industry.backgroundColor || colors.highlightBlue }
                        ]}
                        onPress={() => onIndustryPress?.(industry)}
                        activeOpacity={0.7}
                    >
                        {/* Industry Icon */}
                        <View style={styles.iconContainer}>
                            {industry.iconUrl ? (
                                <Image
                                    source={typeof industry.iconUrl === 'string'
                                        ? { uri: industry.iconUrl }
                                        : industry.iconUrl}
                                    style={styles.icon}
                                    resizeMode="contain"
                                />
                            ) : (
                                <View style={styles.iconPlaceholder} />
                            )}
                        </View>

                        {/* Industry Name */}
                        <Text style={styles.industryName} numberOfLines={2}>
                            {industry.name}
                        </Text>

                        {/* Industry Description */}
                        {industry.description && (
                            <Text style={styles.industryDescription} numberOfLines={2}>
                                {industry.description}
                            </Text>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        width: '100%',
    },
    sectionTitle: {
        ...typography.p3Bold, // 16px Bold
        color: colors.primaryDarkBlue, // #00213d
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    industryCard: {
        width: 140,
        height: 140,
        borderRadius: borderRadius.card, // 12px
        padding: 16,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 8,
    },
    iconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    icon: {
        width: 40,
        height: 40,
    },
    iconPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: colors.lightGrey, // #e2ebf3
    },
    industryName: {
        ...typography.p4SemiBold, // 14px SemiBold
        color: colors.primaryDarkBlue, // #00213d
    },
    industryDescription: {
        ...typography.s1Regular, // 12px Regular
        color: colors.textGrey, // #696a6f
    },
});

export default AutomotiveIndustryTypes;
