import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';

interface InstructionItem {
    text: string;
}

interface AssessmentInstructionsSectionProps {
    aboutText?: string;
    instructions?: InstructionItem[];
    navigationItems?: Array<{
        label: string;
        description: string;
        variant?: 'primary' | 'outline';
    }>;
}

/**
 * Instructions section component matching Figma design
 * Displays "About The Assessment", "Instructions", and "Navigation" sections
 */
const AssessmentInstructionsSection: React.FC<AssessmentInstructionsSectionProps> = ({
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
                        <Text style={styles.sectionText}>{aboutText}</Text>
                    </View>
                    <View style={styles.divider} />
                </>
            )}

            {/* Instructions Section */}
            {instructions.length > 0 && (
                <>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Instructions</Text>
                        <View style={styles.instructionsList}>
                            {instructions.map((item, index) => (
                                <View key={index} style={styles.instructionItem}>
                                    <View style={styles.bulletDot} />
                                    <Text style={styles.instructionText}>{item.text}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    {navigationItems.length > 0 && <View style={styles.divider} />}
                </>
            )}

            {/* Navigation Section */}
            {navigationItems.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Navigation</Text>
                    <View style={styles.navigationList}>
                        {navigationItems.map((item, index) => (
                            <View key={index} style={styles.navigationItem}>
                                <View
                                    style={[
                                        styles.navigationButton,
                                        item.variant === 'primary' && styles.navigationButtonPrimary,
                                        item.variant === 'outline' && styles.navigationButtonOutline,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.navigationButtonText,
                                            item.variant === 'primary' && styles.navigationButtonTextPrimary,
                                            item.variant === 'outline' && styles.navigationButtonTextOutline,
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </View>
                                <Text style={styles.navigationDescription}>{item.description}</Text>
                            </View>
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
        width: '100%',
        marginBottom: 24,
    },
    sectionTitle: {
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: '700' as const,
        lineHeight: 23,
        color: colors.primaryDarkBlue,
        marginBottom: 12,
    },
    sectionText: {
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 25,
        color: colors.textGrey,
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: colors.lightGrey,
        marginVertical: 24,
    },
    instructionsList: {
        flexDirection: 'column',
        gap: 8,
        width: '100%',
    },
    instructionItem: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        width: '100%',
    },
    bulletDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.textGrey,
        flexShrink: 0,
    },
    instructionText: {
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 25,
        color: colors.textGrey,
        flex: 1,
    },
    navigationList: {
        flexDirection: 'column',
        gap: 20,
        width: '100%',
    },
    navigationItem: {
        flexDirection: 'column',
        gap: 4,
        width: '100%',
    },
    navigationButton: {
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
        minWidth: 173,
    },
    navigationButtonPrimary: {
        backgroundColor: colors.primaryBlue,
    },
    navigationButtonOutline: {
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        backgroundColor: 'transparent',
    },
    navigationButtonText: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: '600' as const,
        lineHeight: 13,
        color: colors.primaryBlue,
    },
    navigationButtonTextPrimary: {
        color: colors.white,
    },
    navigationButtonTextOutline: {
        color: colors.primaryBlue,
    },
    navigationDescription: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
        color: colors.textGrey,
        width: '100%',
    },
});

export default AssessmentInstructionsSection;




