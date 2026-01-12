import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../../../styles/theme';
import InstructionSection from './InstructionSection';
import SectionDivider from './SectionDivider';
import NavigationItem from './NavigationItem';

interface InstructionItem {
    text: string;
    subItems?: string[];
}

interface NavigationItemData {
    label: string;
    description: string;
    variant?: 'primary' | 'outline' | 'link';
    icon?: React.ReactNode;
}

interface AssessmentInstructionsCardProps {
    aboutItems?: InstructionItem[];
    instructions?: InstructionItem[];
    procedureItems?: InstructionItem[];
    navigationItems?: NavigationItemData[];
    legendItems?: Array<{
        tag: React.ReactNode;
        label: string;
    }>;
}

/**
 * Main instructions card component
 * Wraps all instruction sections in a white card with border
 * Matches Figma design exactly
 */
const AssessmentInstructionsCard: React.FC<AssessmentInstructionsCardProps> = ({
    aboutItems,
    instructions,
    procedureItems,
    navigationItems,
    legendItems,
}) => {
    return (
        <View style={styles.container}>
            {/* About The Assessment Section */}
            {aboutItems && aboutItems.length > 0 && (
                <>
                    <InstructionSection title="About The Assessment" items={aboutItems} />
                    <SectionDivider />
                </>
            )}

            {/* General Instructions Section */}
            {instructions && instructions.length > 0 && (
                <>
                    <InstructionSection title="General Instructions" items={instructions} />
                    <SectionDivider />
                </>
            )}

            {/* Procedure For Answering A Question Section */}
            {procedureItems && procedureItems.length > 0 && (
                <>
                    <InstructionSection title="Procedure For Answering A Question" items={procedureItems} />
                    <SectionDivider />
                </>
            )}

            {/* Navigation Section */}
            {navigationItems && navigationItems.length > 0 && (
                <>
                    <InstructionSection title="Navigation">
                        <View style={styles.navigationList}>
                            {navigationItems.map((item, index) => (
                                <NavigationItem
                                    key={index}
                                    icon={item.icon}
                                    label={item.label}
                                    description={item.description}
                                    variant={item.variant || 'link'}
                                />
                            ))}
                        </View>
                    </InstructionSection>
                    <SectionDivider />
                </>
            )}

            {/* Legend Section */}
            {legendItems && legendItems.length > 0 && (
                <InstructionSection title="Legend">
                    <View style={styles.legendList}>
                        {legendItems.map((item, index) => (
                            <View key={index} style={styles.legendItem}>
                                {item.tag}
                                <View style={styles.legendLabelContainer}>
                                    <Text style={styles.legendLabel}>{item.label}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </InstructionSection>
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
    navigationList: {
        flexDirection: 'column',
        gap: 20,
        width: '100%',
    },
    legendList: {
        flexDirection: 'column',
        gap: 16,
        width: '100%',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        width: '100%',
    },
    legendLabelContainer: {
        flex: 1,
    },
    legendLabel: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
        color: colors.textGrey,
    },
});

export default AssessmentInstructionsCard;

