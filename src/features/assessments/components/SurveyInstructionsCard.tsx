import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';
import SectionDivider from './SectionDivider';
import NavigationItem from './NavigationItem';

interface SurveyInstructionsCardProps {
    aboutText?: string; // Description text for "About The Assessment" section
    instructions?: string[]; // Array of instruction bullet points
    navigationItems?: Array<{
        label: string;
        description: string;
        variant?: 'primary' | 'outline';
    }>;
}

/**
 * Survey Instructions Card Component
 * Matches Figma design: node 7974-79280
 * Displays "About The Assessment", "Instructions", and "Navigation" sections
 * for survey instructions page
 */
const SurveyInstructionsCard: React.FC<SurveyInstructionsCardProps> = ({
    aboutText,
    instructions = [],
    navigationItems = [],
}) => {
    return (
        <View style={styles.container}>
            {/* About The Assessment Section */}
            {aboutText && (
                <>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About The Assessment</Text>
                        <Text style={styles.aboutText}>{aboutText}</Text>
                    </View>
                    <SectionDivider />
                </>
            )}

            {/* Instructions Section */}
            {instructions.length > 0 && (
                <>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Instructions</Text>
                        <View style={styles.instructionsList}>
                            {instructions.map((instruction, index) => (
                                <View key={index} style={styles.instructionItem}>
                                    <View style={styles.bulletDot} />
                                    <Text style={styles.instructionText}>{instruction}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <SectionDivider />
                </>
            )}

            {/* Navigation Section */}
            {navigationItems.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Navigation</Text>
                    <View style={styles.navigationList}>
                        {navigationItems.map((item, index) => (
                            <NavigationItem
                                key={index}
                                label={item.label}
                                description={item.description}
                                variant={item.variant || 'outline'}
                            />
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.card,
        padding: 24,
        width: '100%',
    },
    section: {
        flexDirection: 'column',
        gap: 12, // 12px gap between title and content
        width: '100%',
    },
    sectionTitle: {
        ...typography.p3Bold, // 16px Bold, line-height 23px
        color: colors.primaryDarkBlue,
    },
    aboutText: {
        ...typography.p3Regular, // 16px Regular, line-height 25px
        color: colors.textGrey,
        width: '100%',
    },
    instructionsList: {
        flexDirection: 'column',
        gap: 8, // 8px gap between instruction items
        width: '100%',
    },
    instructionItem: {
        flexDirection: 'row',
        gap: 12, // 12px gap between bullet and text
        alignItems: 'center',
        width: '100%',
    },
    bulletDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.textGrey, // #696a6f
        flexShrink: 0,
    },
    instructionText: {
        ...typography.p3Regular, // 16px Regular, line-height 25px
        color: colors.textGrey,
        flex: 1,
    },
    navigationList: {
        flexDirection: 'column',
        gap: 20, // 20px gap between navigation items
        width: '100%',
    },
});

export default SurveyInstructionsCard;



